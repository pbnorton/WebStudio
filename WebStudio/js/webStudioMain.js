$(document).ready(function() {
	var whiteboard = WebStudio.whiteboard;
	
	WebStudio.addNode();
	WebStudio.addNode();
	//data.nodes[1].setOrigin([100, 100]);
	data.nodes[1].setOrigin([300, 300]);
		
/*
	var diagonal = d3.svg.diagonal()
		.source({x: data.nodes[0].x, y: data.nodes[0].y})
		.target({x: data.nodes[1].x, y: data.nodes[1].y});
	
	whiteboard.append("path")
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("d", diagonal);
*/
})

