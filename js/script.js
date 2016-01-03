var width = window.innerWidth;
var height = window.innerHeight;

var t3 = THREE;

var scene = new t3.Scene();
var camera = new t3.PerspectiveCamera(70, width/height, 1, 10000);

var renderer = new t3.WebGLRenderer();
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

var effect = new THREE.VREffect(renderer);
var manager = new WebVRManager(renderer, effect);
var controls = new THREE.VRControls(camera);

var light = new THREE.AmbientLight( 0xf0f0f0 );
scene.add(light);

var createTile = function(x, y, z, imageUrl, link) {
  	var geometry = new t3.PlaneGeometry(1, 1);
	// var material = new t3.MeshLambertMaterial({color: 'red'});

	THREE.ImageUtils.crossOrigin = '';
	var texture = THREE.ImageUtils.loadTexture('https://unsplash.it/128/128/?random&time=' + new Date().getTime() + Math.random());
	
	var material = new t3.MeshBasicMaterial({map: texture});
	var tile = new t3.Mesh(geometry, material);
	tile.position.set(x, y, z);
	tile.lookAt(new t3.Vector3(0,0,0));
	scene.add(tile);
}

var noOfTiles = 100;
var radius = 6;

for( var i = 0 ; i < noOfTiles; i++) {
  
	var angle = 15 * i * Math.PI / 180;

	var phi = Math.acos( -1 + ( 2 * i ) / noOfTiles );
	var theta = Math.sqrt( noOfTiles * Math.PI ) * phi;

	var x = radius * Math.cos( theta ) * Math.sin( phi );
	var y = radius * Math.sin( theta ) * Math.sin( phi );
	var z = radius * Math.cos( phi );

	/*var x = 5 * Math.sin(angle);
	var z = 5 * Math.cos(angle);*/

	// 

	createTile(x, y, z, '', '');

}

function render() {
	requestAnimationFrame(render); 
	controls.update();
	manager.render(scene, camera);
}
render();