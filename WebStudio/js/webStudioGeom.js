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
		.on("dragstart", function(d) { 
				$(this).css("cursor", "move"); 
				d3.selectAll(".pNode").sort(function(a, b) {	// bring the current pNode to the top of the z-order
					if(a.id != d.id)
						return -1
					else	
						return 1;
				});
			})
		.on("drag", function(d) {
			var node = d3.select(this);
			
			if(WebStudio.isPath === true) {
				pNodeGeom.nodeSource = d3.select(this).data()[0];
			}
			else {
				d.origin[0] += d3.event.dx;
				d.origin[1] += d3.event.dy;
				node.attr("transform", function(d) {
					return "translate(" + [d.origin[0], d.origin[1]] + ")";
				});
				
				node.data()[0].setOrigin(node.data()[0].getOrigin());
				node.data()[0].updatePaths();
			}
		})
		.on("dragend", function(d) { 
			$(this).css("cursor", "default"); 
			isIntersect(d, d3.select(this).data()[0]);
			d3.event.sourceEvent.stopPropagation();
		});
			
	var isNextNode = function(node) {
		pNodeGeom.nodeTarget = d3.select(node).data()[0];
	}
	
	var createPath = function(d) {
		WebStudio.addPath(d);
	}
	
	 // check for intersection in order to overwrite nodes or splice into paths
	var isIntersect = function(d, node) {
		// check if the mouseup position falls within the bounds of another node
		for(var i = 0; i < data.nodes.length; ++i) {
			if(data.nodes[i].id !== node.id) {
				if((d.x >= data.nodes[i].x - (data.nodes[i].width / 2)) &&
				   (d.x <= data.nodes[i].x + (data.nodes[i].width / 2)) &&
				   (d.y >= data.nodes[i].y - (data.nodes[i].height / 2)) &&
				   (d.y <= data.nodes[i].y + (data.nodes[i].height / 2))) {
						replaceNode(node.id, data.nodes[i].id);
						return;
					}
			}
		}
		
		for(var i = 0; i < data.paths.length; ++i) {
			if((node.sourcePaths.length === 0) && (node.targetPaths.length === 0)) {
				var ppath = d3.select("#" + data.paths[i].id);
			 
				var bbox = ppath.node().getBBox(); // get bounding box of path
				var cx = bbox.x + bbox.width / 2; // get center point of bounding box
				var cy = bbox.y + bbox.height / 2;
				
				// check if the center of a path falls within the bounds of the node being moved
				if((cx >= node.x - node.width / 2) &&
				   (cx <= node.x + node.width / 2) &&
				   (cy >= node.y - node.height / 2) &&
				   (cy <= node.y + node.height / 2)) {
						var pathSource = data.paths[i].source;
						var pathTarget = data.paths[i].target;
				
						// set source for spliced node. Remove source from second existing node
						node.setSource(data.paths[i]);
						pathTarget.removeSource(data.paths[i]);
						
						// update existing path
						data.paths[i].setTarget(node);
						data.paths[i].updatePath();
				
						// create new second path, sets target for spliced node
						pPathGeom.generatePath(node, pathTarget);
						
						return;
				}
			}
		}
	}
	
	// drag and drop a node onto an existing to replace it
	var replaceNode = function(node1, node2) {
		console.log(node1 + " will replace " + node2);
		console.log(d3.select("#" + node1));
		console.log(d3.select("#" + node2));
	}
	
/* node rendering *************************************************************************************/
	
	/**************************************************************************************************
	/* create the group and handles for a node. Specific node type will be set later in the function
	/* based on the "id" of the DOM element 													      */
	var createNode = function(pNode, nodeGroup) {
		this.id = pNode.getID();
	
		var node = nodeGroup.append("g")
			.data([pNode])
			.attr("class", "pNode")
			.attr("id", this.id)
			.attr("transform", function(d) { return "translate(" + d.getOrigin()[0] + "," + d.getOrigin()[1] + ")"; } )
			.on("mousedown", function() { nodeTarget = this.id; })
			.on("mouseover", function() { 
					if(WebStudio.isPath === true){isNextNode(this);} 
				})
			.on("mouseout", function() {
					if(WebStudio.isPath === true){isNextNode(null);}
				})
			.on("click", WebStudio.clickHandler)
			.call(drag);
	
		// triangular handles surrounding the node
		node.append("path")
			.data([pNode.origin])
			.attr("id", "node" + this.id + "-handles")
			.attr("d", "M 0 50 L 10 40 L 10 60 L 0 50 M 50 0 L 60 10 L 40 10 L 50 0 M 100 50 L 90 60 L 90 40 L 100 50 M 50 100 L 40 90 L 60 90 L 50 100")
			.attr("fill", "black")
			.on("mousedown", createPath);
		
		if(node.data()[0].type === "start")
			startNode(node);
		else if(node.data()[0].type === "ghost")
			ghostNode(node);
		else if(node.data()[0].type === "twitter")
			twitterNode(node);
		else if(node.data()[0].type === "decision")
			decisionNode(node);
		else if(node.data()[0].type === "end")
			endNode(node);
			
		node.append("text")
			.attr("dx", 35)
			.attr("dy", 55)
			.text(this.id);
		
	}
	
	var startNode = function(node) {
			// start arrow
			node.append("path")
				.attr("transform", "scale(.75), translate(20, 20), rotate(45, 50, 50)")
				.attr("d", "M 0 25 L 15 25 L 15 75 L 0 75 L 0 25 M 20 25 L 60 25 L 60 0 L 100 50 L 60 100 L 60 75 L 20 75 L 20 25")
				.attr("stroke", "black")
				.attr("fill", "greenyellow");
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
			 createNode: createNode};
})();



/*****************************************************************************************************/

/************************************************************************************
/* Create and draw a path between two nodes
/************************************************************************************/
var pPathGeom = (function() {
	var id;
	var line;			

/* Path rendering *****************************************************************************/	
	var createPath = function(d, whiteboard) {
		WebStudio.isPath = true;
		
		startPath(d, whiteboard); 
	}
	
	function startPath(d) {
		var vis = d3.select(whiteboard);
		var m = d3.mouse(vis.node());
	
		//$("#"+this).css("cursor", "default");
	
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
		var m = d3.mouse(vis.node()) || [0, 0];
		
		line.attr("x2", m[0])
			.attr("y2", m[1]);
	}
					
	function endPath() {
		var m = d3.mouse(this);
		
		WebStudio.isPath = false;
		
		/* make sure we have a target and that we're not drawing a line from a node to itself */
		if(pNodeGeom.nodeTarget && (pNodeGeom.nodeSource !== pNodeGeom.nodeTarget))
			generatePath(pNodeGeom.nodeSource, pNodeGeom.nodeTarget);
		
		pNodeGeom.nodeSource = null;
		pNodeGeom.nodeTarget = null;
		
		d3.selectAll("#ghost-line").remove();
		
		d3.select(WebStudio.whiteboard.node()).on("mousemove", null);
		d3.select(WebStudio.whiteboard.node()).on("mouseup", null);
	}
	
	var generatePath = function(source, target) {
		var s = {x: source.x, y: source.y};
		var t = {x: target.x, y: target.y};

		var diagonal = d3.svg.diagonal()
			.source(s)
			.target(t);
	
		var pathID = "path" + WebStudio.pathCount;

		/* save the path and add its source and target node data to the path data */
		var pPath = new PPath(pathID, source, target);
		WebStudio.pathCount++;
		
		pPath.x1 = s.x;
		pPath.y1 = s.y;
		pPath.x2 = t.x;
		pPath.y2 = t.y;
		
		data.paths.push(pPath);
	
		d3.select("#paths").append("path")
			.data([pPath])
			.attr("id", pathID)
			.attr("fill", "none")
			.attr("stroke", "black")
			.attr("stroke-width", "2")
			.attr("d", diagonal)
			.on("click", WebStudio.clickHandler)
			.on("mouseover", function(d) { 
				if(d.isSelected !== true)
					d3.select(d3.event.target).attr("stroke-width", "5").attr("stroke", "red"); 
				})
			.on("mouseout", function(d) { 
				if(d.isSelected !== true)
					d3.select(d3.event.target).attr("stroke-width", "2").attr("stroke", "black"); 
				});
						
		/* add the path to the appropriate node data */
		d3.select("#" + source.id).data()[0].setTarget(pPath);		
		d3.select("#" + target.id).data()[0].setSource(pPath);
	}
	
	return { createPath: createPath,
			 generatePath: generatePath
			};

})();