'use strict';

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    initControl();
    window.addEventListener('resize', onWindowResize, false);
    animate();
}

var renderer;
var width, height;

function initThree() {
    renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("center").appendChild(renderer.domElement);
}

var camera;

function initCamera() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
    camera.up.set(0, 1, 0);
    camera.position.set(0, 0, 800);
    camera.lookAt(0, 0, 0);
}

var scene, group;

function initScene() {
    scene = new THREE.Scene();
    var background_texture = new THREE.TextureLoader().load("res/img/stars.png");
    scene.background = background_texture;
    group = new THREE.Group();
    scene.add(group);
}

var hemisphereLight1, hemisphereLight2;

function initLight() {
    hemisphereLight1 = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
    hemisphereLight1.position.set(0, 0, -200);
    group.add(hemisphereLight1);
    hemisphereLight2 = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
    hemisphereLight2.position.set(0, 0, 200);
    group.add(hemisphereLight2);
}

var earth;

function initObject() {
    var earthTextureLoader = new THREE.TextureLoader();
    earthTextureLoader.load('res/img/earth.jpg', function(texture) {
        var earthGgeometry = new THREE.SphereGeometry(200, 100, 100);
        var earthMaterial = new THREE.MeshPhongMaterial({
            shininess:10,
            map: texture
        });
        earth = new THREE.Mesh(earthGgeometry, earthMaterial);
        earth.position.set(0, 0, 0);
        group.add(earth);
        group.rotation.x = THREE.Math.degToRad(35);
        group.rotation.y = THREE.Math.degToRad(160);
    });

    var g = new THREE.SphereGeometry(1, 100, 100);
    var m = new  THREE.MeshBasicMaterial({color: 0xff0000});
    for(var i = 0; i < airports.length; ++i) {
        var point = new THREE.Mesh(g, m);
        var pos = translate_position(airports[i].latitude, airports[i].longitude);
        point.position.set(pos.x, pos.y, pos.z);
        console.log(i);
        group.add(point);
    }

    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 500, 0, 0 ) );//在x轴上定义两个点p1(-500,0,0)
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );//p2(500,0,0)
    var line = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1 } ) );
    group.add(line);
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 500, 0 ) );//在x轴上定义两个点p1(-500,0,0)
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );//p2(500,0,0)
    var line2 = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color: 0xffff00, opacity: 1 } ) );
    group.add(line2);
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vector3( 0, 0, 500 ) );//在x轴上定义两个点p1(-500,0,0)
    geometry.vertices.push( new THREE.Vector3( 0, 0, 0 ) );//p2(500,0,0)
    var line3 = new THREE.Line(geometry, new THREE.LineBasicMaterial( { color: 0x00ff00, opacity: 1 } ) );
    group.add(line3);
}

var orbitControl;

function initControl() {
    orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.target.set(0, 0, 0);
    orbitControl.minDistrance = 20;
    orbitControl.maxDistrance = 50;
    orbitControl.maxPolarAngle = Math.PI;
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function translate_position(latitude, longitude) {
    var a = latitude * (Math.PI / 180);
    var b = longitude * (Math.PI / 180);
    return {
        x: 200 * Math.cos(a) * Math.cos(b),
        y: 200 * Math.sin(a),
        z: -200 * Math.cos(a) * Math.sin(b),
    }
}

function render() {
    group.rotation.y -= 0.005;
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}
