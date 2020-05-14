var app = {
	
	inicio: function() {
		DIAMETRO = 50;
		alto = 400; //document.getElementById('phaser').clientHeight; //300; //document.documentElement.clientHeight;
		ancho = document.getElementById('phaser').clientWidth;
		
		if (cordova.platformId == 'android') {
			StatusBar.overlaysWebView(true);
			StatusBar.backgroundColorByHexString('#2F4F4F00');
			StatusBar.show();
		};
		
		//velocidadX = 0;
		//velocidadY = 0;
		
		document.addEventListener('deviceready', function() {
								app.vigilarSensores(); // detecta el movimiento
								app.iniciarJuego(); 
							}, false);
	},
	
	iniciarJuego: function() {
		function preload() {			
				//game.physics.startSystem(Phaser.Physics.ARCADE); //iniciar uno de los motores (ARCADE) de Física del Phaser
				//game.stage.backgroundColor = 'yellow';
				game.load.image('bola', 'img/balling.png');
				//game.load.image('hongo', 'img/mushroom.png');
			}	
		function create() {
				//game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
				game.add.sprite(100, 100, 'bola');
				//var hongo = game.add.sprite(app.inicioX(), app.inicioY(), 'hongo');
				//game.physics.arcade.enable(bola); //se le asignan propiedades físicas al objeto bola
			}		
		/*
		function actualizar() {
			bola.body.velocity.x = (velocidadX * -300); // negativo porque las coordenadas X tienen comportamiento inverso
			bola.body.velocity.y = (velocidadY * 300);
		}		
		*/
		var estados = { preload: preload, create: create }; //, update: actualizar }
		var game = new Phaser.Game(200, 200, Phaser.CANVAS, 'phaser', estados); // types: AUTO, CANVAS, WEBGL
		//var game = new Phaser.Game(360, 500, Phaser.AUTO);
		//game.state.add('phaser', estados);
		//game.state.start('phaser');
		/*
		var texto = 'ANCHO: ' + ancho + '  y  ALTO: ' + alto;
		navigator.notification.alert(
						texto,//: ' + error.code,  // message
						function() {},// callback
						'Dimensiones',  // title
						'OK' // buttonName
			);
		*/
	},
	
	inicioX: function() {
		return Math.floor(Math.random()*(ancho-DIAMETRO));
	},
	
	inicioY: function() {
		return Math.floor(Math.random()*(alto-DIAMETRO));
	},
	
	vigilarSensores: function() {		
		function onError() {
			//document.body.className = 'error';
			navigator.notification.alert(
						'Error de sensores',//: ' + error.code,  // message
						function() {},// callback
						'Atención',  // title
						'OK' // buttonName
			);
			//console.log('Error');
		}		
		navigator.accelerometer.watchAcceleration( this.onSuccess, onError, {frequency: 100} );
	},
			
	onSuccess: function(datosAceleracion) {
		app.detectarAgitacion(datosAceleracion);
		app.representarValores(datosAceleracion);
		//app.obtenerDireccion(datosAceleracion);
	},
	
	detectarAgitacion: function(datosAceleracion) {
		var agitacionX = (datosAceleracion.x > 5) || (datosAceleracion.x < -5);
		var agitacionY = (datosAceleracion.y > 5) || (datosAceleracion.y < -5);
		if (agitacionX || agitacionY) {
		//	setTime( app.comienza(), 1000 );
			document.body.className = 'error';
		} else { 
			document.body.className = '';
		};
	},
	/*
	comienza: function() {
		document.location.reload(true);
	},
	
	obtenerDireccion: function(datosAceleracion) {
		velocidadX = datosAceleracion.x;
		velocidadY = datosAceleracion.y;
	},
	*/
	representarValores: function(datosAceleracion) {
		app.representa(datosAceleracion.x, '#valorx');
		app.representa(datosAceleracion.y, '#valory');
		app.representa(datosAceleracion.z, '#valorz');
	},

	representa: function(dato, elementoHTML){
		var redondeo = Math.round(dato * 100) / 100;
		document.querySelector(elementoHTML).innerHTML = redondeo.toFixed(3);
	}
};

var DIAMETRO;
var alto;
var ancho;		

if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {app.inicio();}, false);
}
