function PPath(id, source, target, type) {
	this.id = id;
	this.type = type || "";
	
	this.x1;
	this.y1;
	this.x2;
	this.y2;
	
	this.label = "";
	
	this.isSelected = false;
	
	this.source = source;
	this.target = target;
}

PPath.prototype.setSource = function(source) { this.source = source; }

PPath.prototype.getSource = function() { d3.select("#" + source); }

PPath.prototype.setTarget = function(target) { this.target = target; }

PPath.prototype.getTarget = function() { d3.select("#" + target); }

PPath.prototype.getCentroid = function() {
	var path = d3.select("#" + this.id).node()
	var length = path.getTotalLength()
	var ctr = path.getPointAtLength(length * .5);
	
	return ctr; 
}

PPath.prototype.updatePath = function() {	
	var source = this.source;
	var target = this.target;
	
	source = {x: source.x, y: source.y };
	target = {x: target.x, y: target.y };

	var diagonal = d3.svg.diagonal()
		.source(source)
		.target(target);
	
	this.x1 = source.x;
	this.y1 = source.y;
	this.x2 = target.x;
	this.y2 = target.y;

	d3.select("#" + this.id).attr("d", diagonal);
	
	this.updateLabel();
}

PPath.prototype.updateLabel = function() {
	var ctr = this.getCentroid();
	
	d3.select("#" + this.id + "-label")
			.attr("x", ctr.x)
			.attr("y", ctr.y + 20); 
}

/************************************************************************************
/*	d3.js interface, drawing, and event handlers for the paths
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
	
	function generatePath(source, target, type) {
//console.log(source);
//console.log(target);
//console.log(type);	
		var s = {x: source.x, y: source.y};
		var t = {x: target.x, y: target.y};

		var diagonal = d3.svg.diagonal()
			.source(s)
			.target(t);
	
		var pathID = "path" + WebStudio.pathCount;

		/* save the path and add its source and target node data to the path data */
		var pPath = new PPath((pathID + "-path"), source, target, type);
		WebStudio.pathCount++;
		
		pPath.x1 = s.x;
		pPath.y1 = s.y;
		pPath.x2 = t.x;
		pPath.y2 = t.y;
		
		data.paths.push(pPath);
	
		var newPath = d3.select("#paths").append("g")
			.data([pPath])
			.attr("class", "PPath")
			.attr("id", pathID);
			
	console.log(pPath.type.length);		
		newPath.append("path")
			.attr("id", pPath.id)
			.attr("fill", "none")
			.attr("stroke", function() { return pPath.type.length === 0 ? "red" : "black"; })
			//.attr("stroke-width", 1)
			.attr("stroke-dasharray", function() { return pPath.type.length === 0 ? "5,5" : null; })
			.attr("fill", "white")
			.attr("d", diagonal)
			.on("click", WebStudio.clickHandler)
			.on("mouseover", function(d) { 
				if(d.isSelected !== true)
					d3.select(d3.event.target).attr("stroke-width", "5"); 
				})
			.on("mouseout", function(d) { 
				if(d.isSelected !== true)
					d3.select(d3.event.target).attr("stroke-width", "1"); 
				});
		
		var ctr = pPath.getCentroid();
		newPath.append("text")
			.attr("id", pPath.id + "-label")
			.attr("x", ctr.x)
			.attr("y", ctr.y + 20)
			.text(pathID);
			
		/* add the path to the appropriate node data */
		d3.select("#" + source.id).data()[0].setTarget(pPath);		
		d3.select("#" + target.id).data()[0].setSource(pPath);
	}
	
	return { createPath: createPath,
			 generatePath: generatePath
			};

})();