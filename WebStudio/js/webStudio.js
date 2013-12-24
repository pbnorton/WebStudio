/************************************************************************************
/*	Global namespace, event flags, and node/path functions
/************************************************************************************/

var WebStudio = (function() {
	var whiteboard = d3.select("body").append("svg").attr("id", "whiteboard");
	$("#whiteboard").droppable( {
		accept: ".icon",
		drop: function(e, ui) {
		//console.log(
			addNode(WebStudio.moduleSource, ui.offset.left, ui.offset.top);
			//addNode(WebStudio.moduleSource, event.pageX, ui.offset.top);
		}
	});
	
	var paths = whiteboard.append("g").attr("id", "paths");
	var pathCount = 0;
	
	var nodes = whiteboard.append("g").attr("id", "nodes");
	var nodeCount = 0;
	
	// Event flags
	var isPath = false;
	
	// store the ID of a module being dragged off the tool box
	var moduleSource = "";
	

	paths.selectAll(".pPath")
			.data(data.paths);	

	nodes.selectAll(".pNode")
			.data(data.nodes);
			
	
	var addNode = function(type, x, y) {
		var pNode = new PNode(nodeCount, type, x, y);
		data.nodes.push(pNode);
		
		pNodeGeom.createNode(pNode, nodes);
		
		nodeCount++;				
	};
	
	var addPath = function(d) {
		pPathGeom.createPath(d, whiteboard);
		
		this.pathCount++;
	}
	
	return {
		whiteboard: whiteboard,
		nodeCount: nodeCount,
		pathCount: pathCount,
		addNode: addNode,
		addPath: addPath,
		isPath: isPath
	};
})();


