'use strict';

function three_start() {
    if(!Detector.webgl) Detector.addGetWebGLMessage();
    
    init_three();
    init_camera();
    init_scene();
    init_light();
    init_object();
    init_control();
    window.addEventListener('resize', on_window_resize, false);
    animate();
}

var renderer, buffet_element;
function init_three() {
    renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    $("#three_center")[0].appendChild(renderer.domElement);
}

var camera;
function init_camera() {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
    camera.up.set(0, 1, 0);
    camera.position.set(0, 0, 800);
    camera.lookAt(0, 0, 0);
}

var scene, group;
function init_scene() {
    scene = new THREE.Scene();
    var background_texture = new THREE.TextureLoader().load("res/img/stars.png");
    scene.background = background_texture;
    group = new THREE.Group();
    scene.add(group);
}

var hemisphere_light1, hemisphere_light2;
function init_light() {
    hemisphere_light1 = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
    hemisphere_light1.position.set(0, 0, -200);
    group.add(hemisphere_light1);
    hemisphere_light2 = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
    hemisphere_light2.position.set(0, 0, 200);
    group.add(hemisphere_light2);
}

function init_object() {
    init_earth();
    init_airports();
    init_routes();  
}

var orbit_control;
function init_control() {
    orbit_control = new THREE.OrbitControls(camera, renderer.domElement);
    orbit_control.target.set(0, 0, 0);
    orbit_control.minDistrance = 20;
    orbit_control.maxDistrance = 50;
    orbit_control.maxPolarAngle = Math.PI;
    console.log(orbit_control);
}

var earth;
function init_earth() {
    var earth_texture_loader = new THREE.TextureLoader();
    earth_texture_loader.load('res/img/earth.jpg', function(texture) {
        var earth_geometry = new THREE.SphereGeometry(200, 100, 100);
        var earth_material = new THREE.MeshPhongMaterial({
            shininess: 10,
            map: texture
        });
        earth = new THREE.Mesh(earth_geometry, earth_material);
        earth.position.set(0, 0, 0);
        group.add(earth);
        group.rotation.x = THREE.Math.degToRad(40);
        group.rotation.y = THREE.Math.degToRad(170);
    });
}

var airports_group, airports_points;
function init_airports() {
    airports_group = new THREE.Group();
    airports_points = new Array(airports.length);
    var airport_geometry = new THREE.SphereGeometry(1, 5, 5);
    var airport_material = new  THREE.MeshBasicMaterial({color: 0xff0000});
    for(var i = 0; i < airports.length; ++i) {
        airports_points[i] = new THREE.Mesh(airport_geometry, airport_material);
        var pos = translate_position(airports[i].latitude, airports[i].longitude, 0);
        airports_points[i].position.set(pos.x, pos.y, pos.z);
        airports_group.add(airports_points[i]);
    }
    group.add(airports_group);
}

var planes, planes_pos, route_curves, planes_group, route_lines, lines_group;
function init_routes() {
    planes_group = new THREE.Group();
    lines_group = new THREE.Group();
    var material = new THREE.LineBasicMaterial({
            color: 0x00ff00
        });
    var plane_geometry = new THREE.SphereGeometry(0.5, 3, 3);
    var plane_material = new THREE.MeshBasicMaterial({color: 0x40E0D0});

    planes = new Array(routes.length);
    planes_pos = new Array(routes.length);
    route_curves = new Array(routes.length);
    route_lines = new Array(routes.length);

    var line_material = new THREE.LineBasicMaterial({color : 0x00ff00});

    for(var i = 0; i < routes.length; ++i) {
        init_single_route(routes[i].source_latitude, routes[i].source_longitude, 
            routes[i].destination_latitude, routes[i].destination_longitude, material, i);
        planes[i] = new THREE.Mesh(plane_geometry, plane_material);
        var begin_pos = translate_position(routes[i].source_latitude, routes[i].source_longitude, 1);
        planes[i].position.set(begin_pos.x, begin_pos.y, begin_pos.z);
        planes_group.add(planes[i]);
        planes_pos[i] = 0;
        var line_geometry = new THREE.Geometry();
        line_geometry.vertices = route_curves[i].getPoints(50);
        route_lines[i] = new THREE.Line(line_geometry, line_material);
        lines_group.add(route_lines[i]);
    }
    group.add(planes_group);
    group.add(lines_group)
}

function init_single_route(la1, lo1, la2, lo2, route_material, i) {
    var dis = (Math.abs(la1 - la2) + Math.abs(lo1 - lo2));
    var pos1, pos2, pos3;
    if(Math.abs(lo1 - lo2) <= 180) {
        pos1 = translate_position(la1, lo1, 1);
        pos2 = translate_position(la1 + (la2 - la1) / 3, lo1 + (lo2 - lo1) / 3, 0.89 * dis);
        pos3 = translate_position(la1 + 2 * (la2 - la1) / 3, lo1 + 2 * (lo2 - lo1) / 3, 0.89 * dis);
    }
    else {
        var longitude1, longitude2;
        if(lo1 < lo2) {
            var temp = lo1;
            lo1 = lo2;
            lo2 = temp;
            temp = la1;
            la1 = la2;
            la2 = temp;
        }
        dis = (Math.abs(la1 - la2) + Math.abs(360 - lo1 + lo2));
        longitude1 = lo1 + (360 - lo1 + lo2) / 3;
        if (longitude1 > 180)
            longitude1 -= 360;
        longitude2 = lo1 + 2 * (360 - lo1 + lo2) / 3;
        if (longitude2 > 180)
            longitude2 -= 360;
        pos1 = translate_position(la1, lo1, 1);
        pos2 = translate_position(la1 + (la2 - la1) / 3, longitude1, 0.89 * dis);
        pos3 = translate_position(la1 + 2 * (la2 - la1) / 3, longitude2, 0.89 * dis);
    }
    var pos4 = translate_position(la2, lo2, 1);
    route_curves[i]  = new THREE.CubicBezierCurve3(
        new THREE.Vector3(pos1.x, pos1.y, pos1.z),
        new THREE.Vector3(pos2.x, pos2.y, pos2.z),
        new THREE.Vector3(pos3.x, pos3.y, pos3.z),
        new THREE.Vector3(pos4.x, pos4.y, pos4.z)
    );
}

function plane_update() {
    for(var i = 0; i < routes.length; ++i) {
        if (route_curves[i] === undefined)
            continue;
        if (planes_pos[i] < 1) {
            var pos = route_curves[i].getPointAt(planes_pos[i])
            planes[i].position.set(pos.x, pos.y, pos.z);
            planes_pos[i] += 2 / route_curves[i].getLength();
        } else {
            planes_pos[i] = 0;
        }
    }
}

function on_window_resize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function translate_position(latitude, longitude, altitude) {
    var a = latitude * (Math.PI / 180);
    var b = longitude * (Math.PI / 180);
    return {
        x: (200 + altitude) * Math.cos(a) * Math.cos(b),
        y: (200 + altitude) * Math.sin(a),
        z: -(200 + altitude)* Math.cos(a) * Math.sin(b),
    }
}

var auto_rotate_flag = true;

function render() {
    if(auto_rotate_flag)
        group.rotation.y -= 0.005;
    plane_update();
    renderer.render(scene, camera);
}

function animate() {
    requestAnimationFrame(animate);
    render();
}
