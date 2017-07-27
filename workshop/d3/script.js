//Width and height
var w = window.innerWidth
var h = window.innerHeight
//Define map projection
var projection = d3.geoMercator()
	.center([ -100, 45 ])
	.translate([ w/2, h/2 ])
	.scale([ w/2 ]);

//Define path generator
var path = d3.geoPath()
	.projection(projection);

//Create SVG
var map = d3.select("body")
	.append("svg")
	.attr("class", "map")
	.attr("width", w)
	.attr("height", h);

// Create time graph
var graph = d3.select("body")
	.append("svg")
	.attr("class", "graph")
	.attr("width", w-100)
	.attr("height", h/4-100);

//Create Legend
var legend = d3.select("body")
	.append("svg")
	.attr("class", "legend")
	.attr("width", w)
	.attr("height", h/2);

//Function for drawing World Map
function makeMap(json){
	//Bind data and create one path per GeoJSON feature
	map.selectAll("path")
		.data(json.features)
		.enter()
		.append("path")
		.attr("d", path)
		.style("fill", "#313030")
		.style("stroke", "#5a5959");
}

//Load in GeoJSON data for World Map
d3.json("../../data/world.geojson", function(json) {
	makeMap(json);
}); 

//Function for making a Legend
function makeLegend(data){
	//Data
	var unique_values = d3.map(data.features, function(d){return d.properties.styleUrl;}).keys();

	//Legend objects
	legend.selectAll("circle")
		.data(unique_values)
		.enter()
		.append("circle")
		.attr("class", "cl")
		.attr("cx", 10)
		.attr("cy", function(d, i) { return i * 30 + 15;})
		.attr("r", 8)
		.style("fill", function(d){
			if (d == "#a") {return "red"}
			else if (d == "#b") {return "blue"}
			else { return "yellow"}
		})
		.style("opacity", 0.8);

	//Legend text
	legend.selectAll("text")
		.data(unique_values)
		.enter()
		.append("text")
		.text(function(d){
			return "class " + d 
		})
		.attr("x", 30 )
		.attr("y", function(d, i) { return i * 30 + 20;})
		.attr("fill", "#ffffff")
		.style("text-align","left")
		.style("font-size", "16px");
}

//Function for drawing points on map
function makePoints(data){
	//Create a circle for each city
	map.selectAll("circle")
		.data(data.features)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			//[0] returns the first coordinate (x) of the projected value
			return projection(d.geometry.coordinates)[0];
		})
		.attr("cy", function(d) {
			//[1] returns the second coordinate (y) of the projected value
			return projection(d.geometry.coordinates)[1];
		})
		.attr("r", 3)
		.style("fill", function(d){
			if (d.properties.styleUrl == "#a") {return "red"}
			else if (d.properties.styleUrl == "#b") {return "blue"}
			else { return "yellow"}
		})
		.style("opacity", 0.5)
		.on("mouseover", handleMouseOver)
		.on("mouseout", handleMouseOut);
}


//Function for making a time graph of the data
function makeGraph(data){
	//Getting Unique time range values
	var formatDate = d3.timeFormat("%Y");
	var time_range = data.features.map(function(d){
		d.date = formatDate(new Date(d.properties.timestamp))
		return d.date
	});
	time_range = d3.map(time_range, function(d){return d;}).keys();
	time_range.sort();
	console.log(time_range)
	// //Histogram counts
	// // var bins = histogram(time_range);
	// // console.log(bins);

	// var yscale = d3.scaleLinear()
	// 	.range([h/2-100, 0])
		

	// var histogram = d3.histogram()
	// 	.value(function(d){return d;})
	// 	.domain(x.domain())
	// 	.thresholds(x.ticks(d3.	timeYear));

	// y.domain([0, d3.max(bins, function(d){return d.length})]);
	
	//XAxis Time range of years
	var xScale = d3.scaleTime()
		.range([0, w-150])
		.domain([time_range[1], time_range[time_range.length-2]]);
	
	var xAxis = d3.axisBottom(xScale)
		.ticks( 20)
		.tickFormat(d3.timeFormat("%Y"));

	//YAxis count range
	var yScale = d3.scaleLinear()
		.range([h/4-130,0])
		.domain([0,100]);
	var yAxis = d3.axisLeft(yScale)
		.ticks(5);

	graph.append("g")
		.call(yAxis)
		.attr("transform","translate(30,10)");
	
	graph.append("g")
		.call(xAxis)
		.attr("transform","translate(30,110)");
	// Styling 
	graph
		.selectAll("path")
		.style("stroke", "#ffffff");
	graph
		.selectAll("g")
		.style("stroke", "#ffffff");
	d3.forceCollide([0.5])
	//Scatter plot
	graph.append("g").selectAll("circle")
		.data(data.features)
		.enter()
		.append("circle")
		.attr("r", 10)
		.attr("cy", 50 )
		.attr("cx", function(d){return xScale(formatDate(new Date(d.properties.timestamp)))})
		.style("fill", "#ffffff");
	
	function force(alpha) {
	  for (var i = 0, n = nodes.length, node, k = alpha * 0.1; i < n; ++i) {
	    node = nodes[i];
	    node.vx -= node.x * k;
	    node.vy -= node.y * k;
	  }
	}
	
	// //Drawing graph
	// graph.selectAll("graph")
	// 	.data(time_range.sort())
	// 	.enter()
	// 	.append("rect")
	// 	.attr("class", function(d){
	// 		return (d)}
	// 	)
	// 	.attr("width", "10px")
	// 	.attr("height", "10px")
	// 	.attr("x",function(d,i){
	// 		return i*10
	// 	})
	// 	.style("fill", "#ffffff")
	// 	;

}



// Create Event Handlers for mouse
function handleMouseOver(d, i) {  // Add interactivity
// Use D3 to select element, change color and size
	d3.select(this)
		.style("fill", "orange")
		.attr("r", 15);
	

	// // Specify where to put label of text
	// svg.append("text").attr({
	//    id: "t" + d.x + "-" + d.y + "-" + i,  // Create an id for text so we can select it later for removing on mouseout
	//     x: function() { return xScale(d.x) - 30; },
	//     y: function() { return yScale(d.y) - 15; }
	// })
	// .text(function() {
	//   return [d.x, d.y];  // Value of the text
	// });
};

function handleMouseOut(d, i) {
// Use D3 to select element, change color back to normal
	d3.select(this)
		.style("fill", function(d){
			if (d.properties.styleUrl == "#a") {return "red"}
			else if (d.properties.styleUrl == "#b") {return "blue"}
			else { return "yellow"}
		})
		.attr("r", 3);

	// // Select text by id and then remove
	// d3.select("#t" + d.x + "-" + d.y + "-" + i).remove();  // Remove text location
};


//Load in GeoJSON data for Bigfoot Points and make all elements of the page
d3.json("../../data/All_BFRO_Reports_points.geojson", function(error,data){
	makeLegend(data);
	makePoints(data);
	makeGraph(data);
});









