'use strict';

function threeStart() {
    initThree();
    initCamera();
    initScene();
    initLight();
    initObject();
    initControl();
    animate();
}

var renderer;
var width, height;

function initThree() {
    width = document.getElementById("center").clientWidth;
    height = document.getElementById("center").clientHeight;
    renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    document.getElementById("center").appendChild(renderer.domElement);
}

var camera;

function initCamera() {
    camera = new THREE.PerspectiveCamera(50, width / height, 1, 2000);
    camera.up.x = 0;
    camera.up.y = 1;
    camera.up.z = 0;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 800;
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

var hemisphereLight;

function initLight() {
    hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
    hemisphereLight.position.x = 0;
    hemisphereLight.position.y = 0;
    hemisphereLight.position.z = -200;
    group.add(hemisphereLight);
}

var earth;

function initObject() {
    var earthTextureLoader = new THREE.TextureLoader();
    earthTextureLoader.load('res/img/earth2.jpg', function(texture) {
        var earthGgeometry = new THREE.SphereGeometry(200, 100, 100);
        var earthMaterial = new THREE.MeshStandardMaterial({
            map: texture
        });
        earth = new THREE.Mesh(earthGgeometry, earthMaterial);
        earth.position.set(0, 50, 0);
        console.log(earth);
        group.add(earth);
        group.rotation.x = THREE.Math.degToRad(35);
        group.rotation.y = THREE.Math.degToRad(170);
    });
}

var orbitControl;

function initControl() {
    orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
    orbitControl.minDistrance = 20;
    orbitControl.maxDistrance = 50;
    orbitControl.maxPolarAngle = Math.PI / 2;
}

function render() {
    group.rotation.y -= 0.0005;
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}
