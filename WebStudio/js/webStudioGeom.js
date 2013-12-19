/************************************************************************************
/*	d3.js interface and event handlers for the node icons and connecting paths
/************************************************************************************/

var pNodeGeom = (function() {
	var id;

	var drag = d3.behavior.drag()
		.on("drag", function(d) {
			var node = d3.select(this);
			
			d.x += d3.event.dx;
			d.y += d3.event.dy;
			node.attr("transform", function(d) {
				return "translate(" + [d.x, d.y] + ")";
			})
			console.log(node.attr("id"));
			
		});	
		
	var info = function() {
		//console.log("test");
	}

	var renderNode = function(pNode, whiteboard, x, y) {
		this.id = pNode.getID();
		
		var node = whiteboard.append("g")
			.data([ {"x":x, "y":y} ])
			.attr("id", "node" + this.id)
			.attr("transform", "translate(" + x + "," + y + ")")
			.on("click", info)
			.call(drag);
	
		node.append("polygon")
			.attr("id", "node-handles")
			.attr("points", "50,0 100,50 50,100, 0,50")
			.attr("stroke", "black")
			.attr("fill", "black")
			.on("mousedown", PPathGeom.startPath);
			
		node.append("rect")
			.attr("id", "node-border")
			.attr("x", "10")
			.attr("y", "10")
			.attr("width", "80")
			.attr("height", "80")
			.attr("stroke", "white")
			.attr("fill", "white");
			
		node.append("rect")
			.attr("id", "node-content")
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
	
	return { renderNode: renderNode };
})();

/************************************************************************************/

var PPathGeom = (function() {
	var line;			
				
	function startPath() {
		var vis = d3.select(WebStudio.whiteboard.node());
		var m = d3.mouse(vis.node());
		
		line = vis.append("line")
				.attr("x1", m[0])
				.attr("y1", m[1])
				.attr("x2", m[0])
				.attr("y2", m[1])
				.attr("stroke", "black")
				.attr("stroke-width", "2px");
		
		d3.event.stopPropagation(); 
		
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
		
		d3.select(WebStudio.whiteboard.node()).on("mousemove", null);
		d3.select(WebStudio.whiteboard.node()).on("mouseup", null);
	}
	
	return { startPath: startPath,
			 drawPath: drawPath,
			 endPath: endPath };

})();