$(document).ready(function() {
	var nodes = [];
	var startLine = false;

	var path;
	var vis = d3.select(".container").append("svg");
	
	$(".node").draggable({handle:"#node-content"});
	
	$("#node-handles").mousedown(function(e) {
		if(e.target === this)	// make sure the click doesn't register inside the node-content
			startLine = true;
			startPath(path, vis);
	});
	$(document).mouseup(function(e) {
		if(startLine) {
			startLine = false;
			endPath(vis);
		}
	});
	
	$("#node-handles").click(function(e) {
		console.log("position = " + $(this).parent().position().left + " " + $(this).parent().position().top);
	});
})

var dataSet = {
	nodes: [],
	paths: []
};

var Node = {
	id: -1,
	type: "ghost",
	prevNode: -1,
	nextNode: -1
};

var Path = {
	source: -1,
	target: -1
}

function addNode() {
	node = new Node();
	node.id = 1;
	$(".container").append();
}

function startPath(line, vis) {
	console.log(this);
	var m = d3.mouse($(this)[0]);
	line = vis.append("line")
		.attr("x1", m[0])
		.attr("y1", m[1])
		.attr("x2", m[0])
		.attr("y2", m[1]);
		
	vis.on("mousemove", drawPath(line));
}

function drawPath(line) {
	var m = d3.mouse(this);
	line.attr("x2", m[0])
		.attr("y2", m[1]);
}

function endPath(vis) {
	vis.on("mousemove", null);
}