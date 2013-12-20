/************************************************************************************
/*	Global namespace and utility functions for interacting with the app
/************************************************************************************/

var WebStudio = (function() {
	var whiteboard = d3.select(".container").append("svg").attr("id", "whiteboard");
	var nodeCount = 0;
	var pathCount = 0;
	var isPath = false;
	
	var addNode = function(x, y) {
		var pNode = new PNode(this.nodeCount, x, y);
		data.nodes.push(pNode);
		
		pNodeGeom.createNode(pNode, whiteboard);
		
		this.nodeCount++;				
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


