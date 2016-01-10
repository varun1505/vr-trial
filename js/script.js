window.WebVRConfig.SHOW_EYE_CENTERS = true;

var width = window.innerWidth;
var height = window.innerHeight;

var t3 = THREE;

var scene = new t3.Scene();
var camera = new t3.PerspectiveCamera(70, width/height, 0.1, 10000);

var renderer = new t3.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var effect = new THREE.VREffect(renderer);
var manager = new WebVRManager(renderer, effect);
var controls = new THREE.VRControls(camera);

var reticle = vreticle.Reticle(camera);
scene.add(camera);

var light = new THREE.AmbientLight( 0xf0f0f0 );
scene.add(light);


var createTile = function(x, y, z, imageUrl, link) {
  	var geometry = new t3.PlaneGeometry(1, 1);
	// var material = new t3.MeshLambertMaterial({color: 'red'});

	THREE.ImageUtils.crossOrigin = '';
	var texture = THREE.ImageUtils.loadTexture('https://unsplash.it/128/128/?random&time=' + new Date().getTime() + Math.random());
	// var texture = THREE.ImageUtils.loadTexture('http://10.0.0.9:8080/img/box.png');
	
	var material = new t3.MeshBasicMaterial({map: texture});
	var tile = new t3.Mesh(geometry, material);
	tile.position.set(x, y, z);
	tile.lookAt(new t3.Vector3(0,0,0));

	reticle.add_collider(tile);

	tile.ongazelong = function() {
		scaleUp(this);
	}
	tile.ongazeover = function() {
		scaleUp(this);
	}
	tile.ongazeout = function() {
		scaleDown(this);
	}

	

	scene.add(tile);
	return tile;
}

var noOfTiles = 100;
var radius = 6;
var tiles = [];
for( var i = 0 ; i < noOfTiles; i++) {
  
	var angle = 15 * i * Math.PI / 180;

	var phi = Math.acos( -1 + ( 2 * i ) / noOfTiles );
	var theta = Math.sqrt( noOfTiles * Math.PI ) * phi;

	var x = radius * Math.cos( theta ) * Math.sin( phi );
	var y = radius * Math.sin( theta ) * Math.sin( phi );
	var z = radius * Math.cos( phi );

	tiles.push(createTile(x, y, z, '', ''));

	/*var x = 5 * Math.sin(angle);
	var z = 5 * Math.cos(angle);
	for( var y = -4; y <= 4; y += 2) {
		tiles.push(createTile(x, y, z, '', ''));		
	}*/

}

function scaleUp(tile) {
	new TWEEN
	.Tween( tile.scale )
	.to( { x: 1.5, y: 1.5 }, 500 )
	.easing( TWEEN.Easing.Exponential.InOut )
	.start();	
}

function scaleDown(tile) {
	new TWEEN
	.Tween( tile.scale )
	.to( { x: 1, y: 1 }, 500 )
	.easing( TWEEN.Easing.Exponential.InOut )
	.start();
}


// Spherecial SkyBox
var boxWidth = 500;
var loader = new THREE.TextureLoader();
loader.load('img/sky1.png', onTextureLoaded);

function onTextureLoaded(texture) {
  /*texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(boxWidth, boxWidth);*/

  var geometry = new THREE.SphereGeometry(boxWidth, boxWidth, boxWidth);
  var material = new THREE.MeshBasicMaterial({
    map: texture,
    color: 0xFFFFFF,
    side: THREE.BackSide
  });

  var skybox = new THREE.Mesh(geometry, material);
  scene.add(skybox);
}


function render() {	
	requestAnimationFrame(render);
	TWEEN.update();
	controls.update();
	reticle.reticle_loop();
	manager.render(scene, camera);
}
render();