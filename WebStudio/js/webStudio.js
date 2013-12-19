/************************************************************************************
/*	Global namespace and utility functions for interacting with the app
/************************************************************************************/

var WebStudio = (function() {
	var whiteboard = d3.select(".container").append("svg").attr("id", "whiteboard");
	var nodeCount = 0;
	
	var addNode = function() {
		var pNode = new PNode(this.nodeCount);
		data.nodes.push(pNode);
		
		var x = pNode.getOrigin()[0];
		var y = pNode.getOrigin()[1];
		
		pNodeGeom.renderNode(pNode, whiteboard, x, y);
		
		this.nodeCount++;				
	};
	
	return {
		whiteboard: whiteboard,
		nodeCount: nodeCount,
		addNode: addNode
	};
})();


