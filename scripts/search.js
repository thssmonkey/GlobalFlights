var m_search_choose;

function search_init() {
    set_search_style(1);
    search_choose = 1;
}

function choose_route() {
    set_search_style(1);
}

function choose_airport() {
    set_search_style(2);
}

function choose_airline() {
    set_search_style(3);
}

function set_search_style(search_choose) {
    m_search_choose = search_choose;
    if(search_choose === 1) {
        $("p#search_item_route")[0].style.opacity = 1;
        $("p#search_item_airport")[0].style.opacity = 0.5;
        $("p#search_item_airline")[0].style.opacity = 0.5;
        $("div#search_choose_bar")[0].style.width = "55px";
        $("div#search_choose_bar")[0].style.left = "0px";
        $("#search_route_block").show();
        $("input#search_content_source")[0].value = "";
        $("input#search_content_destination")[0].value = "";
        $("input#search_content_airport").hide();
        $("input#search_content_airline").hide();

    }
    else if(search_choose === 2) {
        $("p#search_item_route")[0].style.opacity = 0.5;
        $("p#search_item_airport")[0].style.opacity = 1;
        $("p#search_item_airline")[0].style.opacity = 0.5;
        $("div#search_choose_bar")[0].style.width = "63px";
        $("div#search_choose_bar")[0].style.left = "75px";
        $("div#search_route_block").hide();
        $("input#search_content_airport")[0].value = "";
        $("input#search_content_airport").show();
        $("input#search_content_airline").hide();

    }
    else if(search_choose === 3) {
        $("p#search_item_route")[0].style.opacity = 0.5;
        $("p#search_item_airport")[0].style.opacity = 0.5;
        $("p#search_item_airline")[0].style.opacity = 1;
        $("div#search_choose_bar")[0].style.width = "55px";
        $("div#search_choose_bar")[0].style.left = "160px";
        $("div#search_route_block").hide();
        $("input#search_content_airport").hide();
        $("input#search_content_airline")[0].value = "";
        $("input#search_content_airline").show();
    }
}

function search() {
    $("ul#result_ul").children("*").remove();
    if(m_search_choose === 1) {
        search_src = $("input#search_content_source")[0].value;
        search_des = $("input#search_content_destination")[0].value;
        for(var i = 0; i < routes.length; ++i) {
            if(routes[i].source_name.indexOf(search_src) >= 0 &&
                routes[i].destination_name.indexOf(search_des) >= 0) {
                var item = $("<li></li>");
                item.html(routes[i].source_name + " -> " + routes[i].destination_name);
                item.attr("onclick", "lookfor_info(\"route " + i.toString() + "\");");
                $("ul#result_ul").append(item);
            }
        }
    }
    else if(m_search_choose === 2) {
        search_airport = $("input#search_content_airport")[0].value;
        for(var i = 0; i < airports.length; ++i) {
            if(airports[i].name.indexOf(search_airport) >= 0) {
                var item = $("<li></li>");
                item.html(airports[i].name);
                item.attr("onclick", "lookfor_info(\"airport " + i.toString() + "\");");
                $("ul#result_ul").append(item);
            }
        }
    }
    else if(m_search_choose === 3) {
        search_airline = $("input#search_content_airline")[0].value;
        for(var i = 0; i < airlines.length; ++i) {
            if(airlines[i].name.indexOf(search_airline) >= 0) {
                var item = $("<li></li>");
                item.html(airlines[i].name);
                item.attr("onclick", "lookfor_info(\"airline " + i.toString() + "\");");
                $("ul#result_ul").append(item);
            }
        }
    }
}