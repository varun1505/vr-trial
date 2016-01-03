window.WebVRConfig.SHOW_EYE_CENTERS = true;

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
	// var texture = THREE.ImageUtils.loadTexture('https://unsplash.it/128/128/?random&time=' + new Date().getTime() + Math.random());
	var texture = THREE.ImageUtils.loadTexture('http://10.0.0.9:8080/img/box.png');
	
	var material = new t3.MeshBasicMaterial({map: texture});
	var tile = new t3.Mesh(geometry, material);
	tile.position.set(x, y, z);
	tile.lookAt(new t3.Vector3(0,0,0));
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

// scene.updateMatrixWorld();





/*var tween = new TWEEN.Tween( tiles[0].scale ).to( { y: 2 }, 3000 ).easing(
 TWEEN.Easing.Cubic.Out ).start();
	tween.onUpdate(function(){
		
	})*/

function scaleUp(tile) {
	new TWEEN
	.Tween( tile.scale )
	.to( { x: 1.5, y: 1.5 }, 1000 )
	.easing( TWEEN.Easing.Exponential.InOut )
	.start();	
}

function scaleDown(tile) {
	new TWEEN
	.Tween( tile.scale )
	.to( { x: 1, y: 1 }, 1000 )
	.easing( TWEEN.Easing.Exponential.InOut )
	.start();
}


var raycaster = new THREE.Raycaster();

function render() {
	
	// console.log(camera.rotation.x);

	// console.log(tiles[0].rotation);

	var startPoint = new THREE.Vector3(0, 0, 0);
	var direction = camera.getWorldDirection(); //new t3.Vector3(0,0,1);

	var ray = new THREE.Raycaster(startPoint, direction); 
	var rayIntersects = ray.intersectObjects(tiles, false);
	if(rayIntersects.length > 0) {
		scaleUp(rayIntersects[0].object);
		for( var i = 0; i < tiles.length; i++ ) {
			if( tiles[i].position.x != rayIntersects[0].object.position.x && 
				tiles[i].position.y != rayIntersects[0].object.position.y && 
				tiles[i].position.z != rayIntersects[0].object.position.z ) {

				scaleDown(tiles[i]);	
			}			
		}
	} else {
		
	}

	/*for( var i = 0; i < tiles.length; i++ ) {
		var intersections = ray.intersectObject(tiles[i], false);
		if(intersections.length > 0) {
			scaleUp(tiles[i]);
		} else {
			scaleDown(tiles[i]);	
		}
		
	}	*/

	// console.log(rayIntersects);

	
	/*var angle = vector.angleTo( tiles[1].position );
	console.log(angle);*/

	//scaleUp(tiles[0]);
	//console.log(tiles[0].direction);
	/*console.log(vector);
	vector.applyQuaternion(camera.quaternion);*/	

	/*for( var i = 0; i < tiles.length; i++ ) {
		var angle = vector.angleTo( tiles[i].position );
		console.log( i + ' => ' + angle);
		if( angle >= 0 && angle < 0.5) {
			scaleUp(tiles[i]);
		} else {
			// scaleDown(tiles[i]);
		}
	}*/



	requestAnimationFrame(render);
	TWEEN.update();
	controls.update();
	manager.render(scene, camera);
}
render();