/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


var serviceURL = "http://localhost/jq/ee/services/";
//var serviceURL = "http://10.14.9.57/jq/ee/services/";
//var serviceURL = "http://ee.net46.net/services/";

var category;
var categoryName;
var defaultLatLng;

$(document).bind("mobileinit", function(){
    $.mobile.allowCrossDomainPages = true;
    $.mobile.page.prototype.options.addBackBtn = true;
    $.mobile.defaultTransition = "slideup";
});

$('#categoryPage').live('pageinit', function(event) {
    getCategoryList();
});

$('#categoryNamePage').live('pageshow', function(event) {
    getCategoryNameList();
});

$('#addressPage').live('pageshow', function(event) {
    var id = getUrlVars()["id"];
    $.getJSON(serviceURL + 'getAddress.php?id='+id, displayAddress);
    console.log("ID ALAMAT " + id);
    
    displayMap();
});

function getCategoryList() {
    $.getJSON(serviceURL + 'getCategorys.php', function(data) {
        $('#categoryList li').remove();
        category = data.items;
        console.log(category);
        $.each(category, function(index, i) {
            $('#categoryList').append('<li><a href="categoryName.html?id=' + i.id_kategori + '">' +
                '<img src="img/' + i.icon + '"/>' + '<h1>' + i.kategori + '</h1>' +
                '<span class="ui-li-count">' + i.namaCount + '</span></a></li>');
        });
        $('#categoryList').listview('refresh');
    });
}

function getCategoryNameList() {
    var id = getUrlVars()["id"];
    console.log("ID " + id);
    $.getJSON(serviceURL + 'getCategory.php?id='+id, function(data) {
        $('#categoryNameList li').remove();
        categoryName = data.items;
        console.log(categoryName);
        $.each(categoryName, function(index, i) {
            $('#categoryNameList').append('<li><a href="address.html?id=' + i.id_alamat + '">' +
                i.nama + '</a></li>');
            $('#headerName').text(i.kategori);
        });
        $('#categoryNameList').listview('refresh');
        
    });
}

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function displayAddress(data) {
    var address = data.item;
    console.log(address);
    $('#addressHeader').text(address.kategori);
    $('#addressName').text(address.nama);
    $('#addressKodePos').text("Kode Pos : " + address.kode_pos);
    $('#addressTelepon').text("No Telepon : " + address.no_telepon);
    $('#addressAddress').text(address.alamat);
    
    defaultLatLng = new google.maps.LatLng(address.latitude, address.longtitude);
    console.log("latLang = " + defaultLatLng);
}

function drawMap(latlng) {
    var myOptions = {
        zoom: 17,
        center: latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
		
    var map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
		
    // Add an overlay to the map of current lat/lng
    var marker = new google.maps.Marker({
        position: latlng,
        map: map,
        title: "Greetings!"
    });
}

function displayMap() {
    console.log("callMap");
	
    //    var defaultLatLng = new google.maps.LatLng(34.0983425, -118.3267434);  // Default to Hollywood, CA when no geolocation support
	
    if ( navigator.geolocation ) {
        function success(pos) {
            // Location found, show map with these coordinates
            //            drawMap(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            drawMap(defaultLatLng);
        }
		
        function fail(error) {
            console.log(error);
            drawMap(defaultLatLng);  // Failed to find location, show default map
        }
		
        // Find the users current position.  Cache the location for 5 minutes, timeout after 6 seconds
        navigator.geolocation.getCurrentPosition(success, fail, {
            maximumAge: 500000, 
            enableHighAccuracy:true, 
            timeout: 6000
        });
    } else {
        drawMap(defaultLatLng);  // No geolocation support, show default map	
    }
}
