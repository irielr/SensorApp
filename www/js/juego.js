var app = {
	
	inicio: function() {
		DIAMETRO = 50;
		alto 	= 550;	//document.documentElement.clientHeight-106;
		ancho 	= 360;	//document.getElementById('phaser').clientWidth;		
				
		if (cordova.platformId == 'android') {
			StatusBar.overlaysWebView(true);
			StatusBar.backgroundColorByHexString('#004F4F00');
			StatusBar.show();
		};		
		
		if (window.DeviceMotionEvent) {
				//alert("devicemotion is Supported!");
				window.addEventListener("compassneedscalibration", function(event) { 
							alert('Se necesita calibrar el dispositivo. Por favor, haga un movimiento en forma de ocho.');    
							event.preventDefault(); 
					}, true);
				window.addEventListener('devicemotion', function() {app.vigilarSensores();}, false);
				app.iniciarJuego();
		} else {
				alert("devicemotion is NOT Supported!");
		};
	},
	
	iniciarFastClick: function(){
		FastClick.attach(document.body);
	},
	
	iniciarJuego: function() {
		velocidadX = 0;
		velocidadY = 0;
		puntuacion = 0;
		
		var config = {
					type: Phaser.AUTO,
					width: ancho,
					height: alto,
					backgroundColor: '#E0FFFF',
					parent: 'phaser',
					physics: {
						default: 'arcade',
						arcade: {
							gravity: { x:150, y:150 },
							debug: false
						}
					},
					scene: {
						preload: preload,
						create: create,
						update: update
					}
				};

		var game = new Phaser.Game(config);

		function preload ()	{
			this.load.image('ball', 'assets/ball50x50.png');
			this.load.image('diana', 'assets/target50x50.png');
		}
		
		function create ()	{
			// Inluimos un Texto para represntar una puntucación
			scoreText = this.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#5F9EA0' });
			//se añade la imagen al juego en una posición incial y con pripiedades físicas
			diana = this.physics.add.sprite(app.inicioX(), app.inicioY(), 'diana');
			diana.setImmovable(true);
			diana.body.allowGravity = false;
			diana.setVelocityX(0);
			diana.setVelocityY(0);
			bola = this.physics.add.sprite(app.inicioX(), app.inicioY(), 'ball');
			
			// Habilita los 4 bordes del panel
			this.physics.world.setBoundsCollision(true, true, true, true);
			// Restringir la bola a los límites 
			bola.setBounce(0.2);
			bola.setCollideWorldBounds(true);
		}
		
		function update (){
			// Aplicar movimientos a 'bola'
			bola.setVelocityX(velocidadX * -150);
			bola.setVelocityY(velocidadY * 150);		
			// Modificamos la puntuación con cada colisión de la bola	
			if (bola.x>310 || bola.x<50) {
					app.decrementaPuntuacion();
			};
			if (bola.y>500 || bola.y<50) {
					app.decrementaPuntuacion();
			};
			if ((bola.x>diana.x-47) && (bola.x<diana.x+47) && (bola.y>diana.y-47) && (bola.y<diana.y+47)) {
					app.incrementaPuntuacion();
			};
		}
		var pantalla = document.querySelector('#phaser');
		pantalla.addEventListener('click', this.reiniciar, false);
		
	},
	
	inicioX: function() {
		return (DIAMETRO + Math.floor(Math.random()*(ancho-DIAMETRO)));
	},
	
	inicioY: function() {
		return (DIAMETRO + Math.floor(Math.random()*(alto-DIAMETRO)));
	},
	
	incrementaPuntuacion: function(){
		puntuacion += 1;
		scoreText.setText('Score: ' + puntuacion);
	},
	
	decrementaPuntuacion: function(){
		puntuacion -= 1;
		scoreText.setText('Score: ' + puntuacion);
	},
	
	///////////////////////////////////////////////////////////////
	vigilarSensores: function() {		
		function onError() {
			alert('Error de sensores');
		}		
		navigator.accelerometer.watchAcceleration( this.onSuccess, onError, {frequency: 10} );	
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
			document.body.className = 'error';
			//cordova.plugins.diagnostic.restart(null, false);
			//app.reiniciar();
			//setTime( app.reiniciar(), 1000 );
		} else { 
			document.body.className = '';
		};
	},
	
	reiniciar: function() {
		bola.x = app.inicioX();
		bola.y = app.inicioY();
		diana.x = app.inicioX();
		diana.y = app.inicioY();
		bola.setVelocityX(0);
		bola.setVelocityY(0);
        puntuacion = 0;
        //this.game.state.start("GameOver");
		//document.location.reload(true);
	},
	
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
var scoreText;
var puntuacion;
var bola;
var diana;

if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {app.iniciarFastClick();}, false);
	document.addEventListener('deviceready', function() { app.inicio(); }, false);	
}