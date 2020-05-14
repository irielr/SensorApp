var app = {
	
	inicio: function() {
		DIAMETRO = 50;
		alto = 800; //document.documentElement.clientHeight-100; //document.getElementById('phaser').clientHeight; //300; //
		ancho = 600; //document.getElementById('phaser').clientWidth;
		
		if (cordova.platformId == 'android') {
			StatusBar.overlaysWebView(true);
			StatusBar.backgroundColorByHexString('#2F4F4F00');
			StatusBar.show();
		};
		
		velocidadX = 0;
		velocidadY = 0;
		app.vigilarSensores(); // detecta el movimiento
		app.iniciarJuego(); 
		//document.addEventListener('deviceready', function() {}, false);
	},
	
	iniciarJuego: function() {
		var estados = { 
				preload: function() {			
					//game.physics.startSystem(Phaser.Physics.ARCADE); //iniciar uno de los motores (ARCADE) de Física del Phaser
					this.stage.backgroundColor = '#B0E0E6';
					this.load.image('bola', 'img/balling.png');
					//game.load.image('hongo', 'img/mushroom.png');
				},
				create: function() {
					this.add.sprite(app.inicioX(), app.inicioY(), 'bola');
					//game.add.sprite(100, 150, 'bola');
					//var bola = game.add.sprite(app.inicioX(), app.inicioY(), 'bola');
					//game.physics.arcade.enable(bola); //se le asignan propiedades físicas al objeto bola
				},
				update: function() {
					bola.body.velocity.x = (velocidadX * -100); // negativo porque las coordenadas X tienen comportamiento inverso
					bola.body.velocity.y = (velocidadY * 100);
				}
			};			

		var game = new Phaser.Game(ancho, alto, Phaser.CANVAS, 'phaser', estados, false); // types: AUTO, CANVAS, WEBGL
		//var estados = { preload: preload, create: create, update: update }; //
		//var game = new Phaser.Game(ancho, alto, Phaser.AUTO);
		//game.state.add('phaser', estados);
		//game.state.start('phaser');
		
		var texto = 'ANCHO: ' + ancho + '  y  ALTO: ' + alto;
		navigator.notification.alert(
						texto,//: ' + error.code,  // message
						function() {},// callback
						'Dimensiones',  // title
						'OK' // buttonName
			);
		/**/
	},
	
	inicioX: function() {
		return Math.floor(Math.random()*(ancho-DIAMETRO));
	},
	
	inicioY: function() {
		return Math.floor(Math.random()*(alto-DIAMETRO));
	},
	
	///////////////////////////////////////////////////////////////
	vigilarSensores: function() {		
		function onError() {
			navigator.notification.alert(
						'Error de sensores',//: ' + error.code,  // message
						function() {},// callback
						'Atención',  // title
						'OK' // buttonName
			);
		}		
		navigator.accelerometer.watchAcceleration( this.onSuccess, onError, {frequency: 100} );
	},
			
	onSuccess: function(datosAceleracion) {
		app.detectarMovimiento(datosAceleracion);
		app.representarValores(datosAceleracion);
		app.obtenerDireccion(datosAceleracion);
	},
	
	///////////////////////////////////////////////////////////////
	detectarMovimiento: function(datosAceleracion) {
		var movimientoX = (datosAceleracion.x > 5) || (datosAceleracion.x < -5);
		var movimientoY = (datosAceleracion.y > 5) || (datosAceleracion.y < -5);
		if (movimientoX || movimientoY) {
			//setTime( app.comienza(), 1000 );
			document.body.className = 'error';
		} else { 
			document.body.className = '';
		};
	},
	/*
	comienza: function() {
		document.location.reload(true);
	},
	
	*/
	obtenerDireccion: function(datosAceleracion) {
		velocidadX = datosAceleracion.x;
		velocidadY = datosAceleracion.y;
	},
	
	///////////////////////////////////////////////////////////////
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
var velocidadX;
var velocidadY;

if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {app.inicio();}, false);
}