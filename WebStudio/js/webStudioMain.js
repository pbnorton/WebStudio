$(document).ready(function() {
	var whiteboard = WebStudio.whiteboard;
	
	WebStudio.addNode();
	data.nodes[0].setOrigin([200, 200]);
	
	WebStudio.addNode();
	data.nodes[1].setOrigin([450, 200]);
	
	WebStudio.addNode();
	data.nodes[2].setOrigin([700, 100]);
	
	WebStudio.addNode();
	data.nodes[3].setOrigin([700, 300]);
		
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

