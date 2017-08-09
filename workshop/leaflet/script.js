//initialize the map
var map = L.map('map').setView([42.3600825, -71.0588801], 12);

//Create baselayer - tiles
var backgroundMap = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
	attribution: '<a href="http://openstreetmap.org">OpenStreetMap</a>contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
	maxZoom: 19
});

var secondLayer = L.tileLayer(' http://tile.stamen.com/toner/{z}/{x}/{y}.png', {
	maxZoom: 19
});

var layers = {
	"basic" : backgroundMap,
	"extra" : secondLayer
}

backgroundMap.addTo(map);

// map.layers = [backgroundMap, secondLayer]

L.control.layers(layers).addTo(map);

//Add markers
var brewery = L.marker([42.346868, -71.034396]).addTo(map);
brewery.addTo(map);

var aquarium = L.marker([42.359116, -71.049592]);
aquarium.addTo(map);

var hotel = L.marker([42.351340, -71.040495]);
hotel.addTo(map);

var harvard = L.marker([42.376979, -71.116617]);
harvard.addTo(map);

//Add pop-ups
// var popup = "The Harpoon Brewery.";
// brewery.bindPopup(popup);

var popup1 = "Do you sleep in the SeaPort Hotel?";
hotel.bindPopup(popup1)

var popup2 = "The New England Aquarium.";
aquarium.bindPopup(popup2);

var popup3 = "The Harvard University.";
harvard.bindPopup(popup3);

//add a circle
var circle = L.circle([42.359116, -71.049592], 4500, {
	color: 'red',
	fillColor: '#f03',
	fillOpacity: 0.5
}).addTo(map);  

//add a polygon   
var polygon = L.polygon([
	[42.346868, -71.034396],
	[42.351340, -71.040495],
	[42.359116, -71.049592],
	[42.376979, -71.116617]
		]).addTo(map);

// Create a marker first
// var bigfootIcon = {
// 		radius: 8,
// 		fillColor: "#ff7800",
// 		color: "#000",
// 		weight: 1,
// 		opacity: 1,
// 		fillOpacity: 0.8
// };

var bigfootIcon = L.icon({
    iconUrl: '../big_foot_orange.png',
    iconSize:     [15, 25], // size of the icon
});

//create the geojson layer
var geojson = L.geoJson(null,{
pointToLayer: function (geoJsonPoint, latlng) {
	return L.marker(latlng, {icon: bigfootIcon});
}
}).addTo(map);

geojson.addData("../../data/All_BFRO_Reports_points.geojson");


// // new Http Request
// var xhttp = new XMLHttpRequest();

// // set the request method: get the data
// xhttp.open('GET', encodeURI("All_BFRO_Reports_points.geojson" ));

// //specify what must be done with the geojson data to the layer when request is succesfull
// xhttp.onload = function() {
// 	if (xhttp.readyState === 4) {
// 			// add the json data to the geojson layer we created before!
// 			geojson.addData(JSON.parse(xhttp.responseText));
// 		} else {
// 			alert('Request failed.  Returned status of ' + xhttp.readyState );
// 		}
// };

// // send the request
// xhttp.send();

//Jquery method
// $.getJSON("../../data/All_BFRO_Reports_points.geojson", function(data) {
// 
// });




var popup = L.popup();

function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}

map.on('click', onMapClick);