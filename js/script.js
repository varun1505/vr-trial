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

var geometry = new t3.PlaneGeometry(1, 1);
var material = new t3.MeshLambertMaterial({color: 'red'});

// var light = new t3.HemisphereLight( 0xffffff, 0x080820, 1 );
var light = new THREE.AmbientLight( 0xf0f0f0 );
scene.add(light);

var l = 100;

var radius = 5;

for( var i = 0 ; i< l; i++) {
  
  var angle = 15 * i * Math.PI / 180;
  
  var phi = Math.acos( -1 + ( 2 * i ) / l );
  var theta = Math.sqrt( l * Math.PI ) * phi;



  var x = radius * Math.cos( theta ) * Math.sin( phi );
  var y = radius * Math.sin( theta ) * Math.sin( phi );
  var z = radius * Math.cos( phi );

  /*var x = 5 * Math.sin(angle);
  var z = 5 * Math.cos(angle);*/

  var vector = new t3.Vector3();

  // for (var y = -4; y <= 4; y = y + 2) {
    var cube = new t3.Mesh(geometry, material);
    cube.position.set(x, y, z);
    var cubeContainer = new t3.Object3D();
    cubeContainer.add(cube);

    vector.copy( cube.position ).multiplyScalar( 2 );
    cube.lookAt(new t3.Vector3(0,0,0));
    scene.add(cube);
  // }
}



camera.position.y = 0;
camera.position.z = 0;


var cubeYPos = 0;

function render() {
  requestAnimationFrame(render); 

  controls.update();

  manager.render(scene, camera);
}


render();