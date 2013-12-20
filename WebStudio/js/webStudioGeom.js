/************************************************************************************
/*	d3.js interface and event handlers for the node icons and connecting paths
/************************************************************************************/

var pNodeGeom = (function() {
	var id;
	var nodeSource;
	var nodeTarget;

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
		//console.log(d);
	}

	var isNextNode = function(node) {
		pNodeGeom.nodeTarget = node;
	}
	
	var createPath = function(d) {
		WebStudio.addPath(d);
	}
	
	var createNode = function(pNode, whiteboard) {
		this.id = pNode.getID();
		
		var node = whiteboard.append("g")
			//.data([pNode.getOrigin()])
			.data([pNode])
			.attr("id", "node" + this.id)
			.attr("transform", function(d) { return "translate(" + d.getOrigin()[0] + "," + d.getOrigin()[1] + ")"; } )
			.on("mousedown", function() { nodeTarget = this.id; })
			.on("mouseover", function() { if(WebStudio.isPath === true){isNextNode(this);} } )
			.on("click", info)
			.call(drag);
	
		node.append("polygon")
			.data([pNode.origin])
			.attr("id", "node" + this.id + "-handles")
			.attr("points", "50,0 100,50 50,100, 0,50")
			.attr("stroke", "black")
			.attr("fill", "black")
			.on("mousedown", createPath);
			
		node.append("rect")
			.attr("id", "node" + this.id + "-border")
			.attr("x", "10")
			.attr("y", "10")
			.attr("width", "80")
			.attr("height", "80")
			.attr("stroke", "white")
			.attr("fill", "white");
			
		node.append("rect")
			.attr("id", "node" + this.id + "-content")
			.attr("x", "15")
			.attr("y", "15")
			.attr("width", "70")
			.attr("height", "70")
			.attr("rx", "20")
			.attr("ry", "20")
			.attr("stroke", "aqua")
			.attr("stroke-dasharray", "5,5")
			.attr("fill", "white");
	}
	
	return { nodeSource: nodeSource,
			 nodeTarget: nodeTarget,
			 updateNodePos: updateNodePos,
			 createNode: createNode };
})();

/************************************************************************************/

var pPathGeom = (function() {
	var id;
	var line;			


				
	var createPath = function(d, whiteboard) {
		WebStudio.isPath = true;
		
		startPath(d); 
	}
	
	function startPath(d) {
		var vis = d3.select(WebStudio.whiteboard.node());
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
			
			WebStudio.whiteboard.append("path")
				.attr("id", pathID)
				.attr("fill", "none")
				.attr("stroke", "aqua")
				.attr("stroke-width", "2")
				.attr("d", diagonal);
				
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