function init() {
    search_init();
    three_init();
    show_routes();
}

var show_airports_flag = true;
var show_planes_flag = true;
var show_routes_flag = true;

function show_airports() {
    if(show_airports_flag) {
        $("#show_control_item_airports")[0].style.opacity = 0.5;
        $("img#airport_logo")[0].style.opacity = 0.5;
        show_airports_flag = false;
        group.remove(airports_group);
    }
    else {
        $("#show_control_item_airports")[0].style.opacity = 1;
        $("img#airport_logo")[0].style.opacity = 1;
        show_airports_flag = true;
        group.add(airports_group);
    }
}

function show_planes() {
    if(show_planes_flag) {
        $("#show_control_item_planes")[0].style.opacity = 0.5;
        $("img#plane_logo")[0].style.opacity = 0.5;
        show_planes_flag = false;
        group.remove(planes_group);
    }
    else {
        $("#show_control_item_planes")[0].style.opacity = 1;
        $("img#plane_logo")[0].style.opacity = 1;
        show_planes_flag = true;
        group.add(planes_group);
    }
}

function show_routes() {
    if(show_routes_flag) {
        $("#show_control_item_routes")[0].style.opacity = 0.5;
        $("img#route_logo")[0].style.opacity = 0.5;
        show_routes_flag = false;
        group.remove(lines_group);
    }
    else {
        $("#show_control_item_routes")[0].style.opacity = 1;
        $("img#route_logo")[0].style.opacity = 1;
        show_routes_flag = true;
        group.add(lines_group);
    }
}

function lookfor_info(item) {
    item_index = item.split(" ");
    //three clear
    for(var i = 0; i < airports_points.length; ++i)
        airports_group.remove(airports_points[i]);
    for(var i = 0; i < routes.length; ++i)
        planes_group.remove(planes[i]);
    for(var i = 0; i < routes.length; ++i)
        lines_group.remove(route_lines[i]);
    auto_rotate_flag = false;
    //info block set
    if(item_index[0] === "route") {
        var route = routes[item_index[1]];
        var src = airports.filter(function(x){
            return x.id === route.source_id;
        })[0];
        var des = airports.filter(function(x){
            return x.id === route.destination_id;
        })[0];
        //set info
        $("div#info_route p#info_route_source").html(route.source_name);
        $("div#info_route p#info_route_source_airport").html("(" + src.name + ")");
        $("div#info_route p#info_route_destination").html(route.destination_name);
        $("div#info_route p#info_route_destination_airport").html("(" + des.name + ")");
        $("div#info_route p#info_route_airline").html(route.airline_name);
        //three change
        planes_group.add(planes[item_index[1]]);
        airports_group.add(airports_points[airports.indexOf(src)]);
        airports_group.add(airports_points[airports.indexOf(des)]);
        lines_group.add(route_lines[item_index[1]]);
        rotate_to(src.latitude, src.longitude);
        //info block change
        $("#info_airport").hide();
        $("#info_airline").hide();
        $("#info_route").show();
    }
    else if(item_index[0] === "airport") {
        var airport = airports[item_index[1]];
        //set info
        $("div#info_airport p#info_airport_name").html(airport.name);
        $("div#info_airport p#info_airport_city").html(airport.city);
        $("div#info_airport p#info_airport_country").html(airport.country);
        $("div#info_airport p#info_airport_latitude").html(airport.latitude);
        $("div#info_airport p#info_airport_longitude").html(airport.longitude);
        $("div#info_airport p#info_airport_altitude").html(airport.altitude);
        $("div#info_airport p#info_airport_timezone").html(airport.timezone);
        //three change
        $("ul#result_ul").children("*").remove();
        airports_group.add(airports_points[item_index[1]]);
        var id = airports[item_index[1]].id;
        for(var i = 0; i < routes.length; ++i) {
            if(routes[i].source_id === id || routes[i].destination_id === id) {
                planes_group.add(planes[i]);
                lines_group.add(route_lines[i]);
                if(routes[i].source_id === id) {
                    var des = airports.filter(function(x){
                        return x.id === routes[i].destination_id;
                    })[0];
                    airports_group.add(airports_points[airports.indexOf(des)]);
                }
                else {
                    var src = airports.filter(function(x){
                        return x.id === routes[i].source_id;
                    })[0];
                    airports_group.add(airports_points[airports.indexOf(src)]);
                }
                var item = $("<li></li>");
                item.html(routes[i].source_name + " -> " + routes[i].destination_name);
                item.attr("onclick", "lookfor_info(\"route " + i.toString() + "\");");
                $("ul#result_ul").append(item);
            }
        }
        rotate_to(airports[item_index[1]].latitude, airports[item_index[1]].longitude);
        //info block change
        $("#info_route").hide();
        $("#info_airline").hide();
        $("#info_airport").show();
    }
    else if(item_index[0] === "airline") {
        var airline = airlines[item_index[1]];
        //set info
        $("div#info_airline p#info_airline_name").html(airline.name);
        //three change
        $("ul#result_ul").children("*").remove();
        var id = airlines[item_index[1]].id;
        var rotate_flag = false;
        for(var i = 0; i < routes.length; ++i) {
            if(routes[i].airline_id === id) {
                planes_group.add(planes[i]);
                lines_group.add(route_lines[i]);
                var src = airports.filter(function(x) {
                    return x.id === routes[i].source_id;
                })[0];
                airports_group.add(airports_points[airports.indexOf(src)]);
                var des = airports.filter(function(x) {
                    return x.id === routes[i].destination_id;
                })[0];
                airports_group.add(airports_points[airports.indexOf(des)]);
                if(!rotate_flag) {
                    rotate_to(src.latitude, src.longitude);
                    rotate_flag = true;
                }
                var item = $("<li></li>");
                item.html(routes[i].source_name + " -> " + routes[i].destination_name);
                item.attr("onclick", "lookfor_info(\"route " + i.toString() + "\");");
                $("ul#result_ul").append(item);
            }
        }
        //info block change
        $("#info_route").hide();
        $("#info_airport").hide();
        $("#info_airline").show();
    }
    show_airports_flag = false;
    show_planes_flag = false;
    show_routes_flag = false;
    show_airports();
    show_planes();
    show_routes();
}

function rotate_to(la, lo) {
     group.rotation.x = THREE.Math.degToRad(la);
        if(lo >= 0)
            group.rotation.y = THREE.Math.degToRad(270 - lo);
        else
            group.rotation.y = THREE.Math.degToRad(-90 - lo);
        group.rotation.z = 0;
        orbit_control.reset();
}