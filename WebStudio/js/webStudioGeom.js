/************************************************************************************
/*	d3.js interface, drawing, and event handlers for the node icons and connecting paths
/************************************************************************************/

var pNodeGeom = (function() {
	var id;
	var nodeSource;
	var nodeTarget;
	
	// event flags
	var isDragging = false;

/* node event handling ***************************************************************/
	var updateNodePos = function(pNode) {
		d3.select("#node" + pNode.getID())
			.data([pNode])
			.attr("transform", function(d) { return "translate(" + d.getOrigin() + ")" });
	};
	
	var drag = d3.behavior.drag()
		.on("drag", function(d) {
			var node = d3.select(this);
			
			if(WebStudio.isPath === true) {
				pNodeGeom.nodeSource = this;
			}
			else {
				d.origin[0] += d3.event.dx;
				d.origin[1] += d3.event.dy;
				node.attr("transform", function(d) {
					return "translate(" + [d.origin[0], d.origin[1]] + ")";
				});
				
				node.data()[0].setOrigin(node.data()[0].getOrigin());
				node.data()[0].updatePaths(node.data()[0].paths);
			}
		});	
			
	var info = function(d) {
		if(d3.event.defaultPrevented) 
			return;
		alert(d3.select("#" + this.id).data()[0].type + " node");
	}

	var isNextNode = function(node) {
		pNodeGeom.nodeTarget = node;
	}
	
	var createPath = function(d) {
		WebStudio.addPath(d);
	}
	
	
/* node rendering **********************************************************************/
	
	/**************************************************************************************************
	/* create the group and handles for a node. Specific node type will be set later in the function
	/* based on the "id" of the DOM element 													      */
	var createNode = function(pNode, nodeGroup) {
		this.id = pNode.getID();
	
		var node = nodeGroup.append("g")
			.data([pNode])
			.attr("class", "pNode")
			.attr("id", "node" + this.id)
			.attr("transform", function(d) { return "translate(" + d.getOrigin()[0] + "," + d.getOrigin()[1] + ")"; } )
			.on("mousedown", function() { nodeTarget = this.id; })
			.on("mouseover", function() { if(WebStudio.isPath === true){isNextNode(this);} } )
			.on("click", info)
			.call(drag);
			
	
		node.append("rect")
			.attr("x", "0")
			.attr("y", "0")
			.attr("width", "100")
			.attr("height", "100")
			.attr("stroke", "black")
			.attr("stroke-dasharray", "10, 10")
			.attr("fill", "none")
			.attr("visibility", "hidden");
	
		// triangular handles surrounding the node
		node.append("path")
			.data([pNode.origin])
			.attr("id", "node" + this.id + "-handles")
			.attr("d", "M 0 50 L 10 40 L 10 60 L 0 50 M 50 0 L 60 10 L 40 10 L 50 0 M 100 50 L 90 60 L 90 40 L 100 50 M 50 100 L 40 90 L 60 90 L 50 100")
			.attr("fill", "black")
			.on("mousedown", createPath);
			
		
		if(node.data()[0].type === "ghost")
			ghostNode(node);
		else if(node.data()[0].type === "twitter")
			twitterNode(node);
		else if(node.data()[0].type === "decision")
			decisionNode(node);
		else if(node.data()[0].type === "end")
			endNode(node);
		
	}
	
	var ghostNode = function (node) {
		node.append("rect")
			.attr("id", "node" + this.id + "-content")
			.attr("x", "15")
			.attr("y", "15")
			.attr("width", "70")
			.attr("height", "70")
			.attr("rx", "20")
			.attr("ry", "20")
			.attr("stroke", "black")
			.attr("stroke-dasharray", "5,5")
			.attr("fill", "white");
	}

	var twitterNode = function(node) {
		node.append("image")
			.attr("xlink:href", "img/Twitter_logo_blue.png")
			.attr("x", "15")
			.attr("y", "15")
			.attr("width", "70")
			.attr("height", "70");
	}
	
	var decisionNode = function(node) {
		node.append("rect")
			.attr("x", "15")
			.attr("y", "15")
			.attr("width", "66")
			.attr("height", "66")
			.attr("stroke", "black")
			.attr("stroke-width", "2")
			.attr("rx", "20")
			.attr("ry", "5")
			.attr("fill", "grey");
	}
	
	var endNode = function(node) {
		node.append("circle")
			.attr("cx", "50")
			.attr("cy", "50")
			.attr("r", "35")
			.attr("stroke", "black")
			.attr("fill", "orange");
	}

	
	return { nodeSource: nodeSource,
			 nodeTarget: nodeTarget,
			 updateNodePos: updateNodePos,
			 createNode: createNode };
})();


/************************************************************************************
/* Create and draw a path between two nodes
/************************************************************************************/
var pPathGeom = (function() {
	var id;
	var line;			

	var createPath = function(d, whiteboard) {
		WebStudio.isPath = true;
		
		startPath(d, whiteboard); 
	}
	
	function startPath(d) {
		var vis = d3.select(whiteboard);
		var m = d3.mouse(vis.node());
		
		line = vis.append("line")
				.data([d])
				.attr("id", "ghost-line")
				.attr("x1", function(d) { return d[0] + 50; })
				.attr("y1", function(d) { return d[1] + 50; })
				.attr("x2", m[0])
				.attr("y2", m[1])
				.attr("stroke", "aqua")
				.attr("stroke-dasharray", ("3,3"))
				.attr("stroke-width", "2px")
				.attr("color", "aqua");
		
		vis.on("mousemove", drawPath);
		vis.on("mouseup", endPath);
	}
					
	function drawPath() {
		var vis = d3.select(WebStudio.whiteboard.node());
		var m = d3.mouse(vis.node());
		
		line.attr("x2", m[0])
			.attr("y2", m[1]);
	}
					
	function endPath() {
		var m = d3.mouse(this);
		
		WebStudio.isPath = false;
		
		/* make sure we have a target and that we're not drawing a line from a node to itself */
		if(pNodeGeom.nodeTarget && (pNodeGeom.nodeSource !== pNodeGeom.nodeTarget)) {			
			var source = {x: d3.select("#" + pNodeGeom.nodeSource.id).data()[0].x, y: d3.select("#" + pNodeGeom.nodeSource.id).data()[0].y};
			var target = {x: d3.select("#" + pNodeGeom.nodeTarget.id).data()[0].x, y: d3.select("#" + pNodeGeom.nodeTarget.id).data()[0].y};
		
			var diagonal = d3.svg.diagonal()
				.source(source)
				.target(target);
		
			var pathID = "path" + WebStudio.pathCount;

			d3.select("#paths").append("path")
				.attr("id", pathID)
				.attr("fill", "none")
				.attr("stroke", "black")
				.attr("stroke-width", "2")
				.attr("d", diagonal)
				.on("click", function(d) { alert(pathID) } )
				.on("mouseover", function(d) { d3.select(d3.event.target).attr("stroke-width", "5").attr("stroke", "red"); } )
				.on("mouseout", function(d) { d3.select(d3.event.target).attr("stroke-width", "2").attr("stroke", "black"); } );
				
			/* save the path and add its source and target node data to the path data */
			var pPath = new PPath(pathID);
			
			pPath.setSource(d3.select("#" + pNodeGeom.nodeSource.id));
			pPath.setTarget(d3.select("#" + pNodeGeom.nodeTarget.id));
			data.paths.push(pPath);
			
			/* add the path to the appropriate node data */
			d3.select("#" + pNodeGeom.nodeSource.id).data()[0].setTarget(pNodeGeom.nodeTarget);
			d3.select("#" + pNodeGeom.nodeSource.id).data()[0].addPath(pPath);
			
			d3.select("#" + pNodeGeom.nodeTarget.id).data()[0].setSource(pNodeGeom.nodeSource);
			d3.select("#" + pNodeGeom.nodeTarget.id).data()[0].addPath(pPath);
		}
		
		pNodeGeom.nodeSource = null;
		pNodeGeom.nodeTarget = null;
		
		d3.selectAll("#ghost-line").remove();
		
		d3.select(WebStudio.whiteboard.node()).on("mousemove", null);
		d3.select(WebStudio.whiteboard.node()).on("mouseup", null);
	}
	
	return { createPath: createPath };

})();