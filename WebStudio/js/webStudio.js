/************************************************************************************
/*	Global namespace, event flags, and node/path functions
/***********************	*************************************************************/

var WebStudio = (function() {
	var whiteboard = d3.select("body")
						.append("svg")
						.attr("id", "whiteboard");
	$("#whiteboard").droppable( { // jQueryUI functionality to allow dropping of nodes from the toolbox
		accept: ".icon",
		drop: function(e, ui) {
			addNode(WebStudio.moduleSource, ui.offset.left, ui.offset.top);
		}
	});
	
	var paths = whiteboard.append("g").attr("id", "paths"); 
	var pathCount = 0;
	
	var nodes = whiteboard.append("g").attr("id", "nodes");
	var nodeCount = 0;
	
	// Event flags
	var isPath = false;
	var pSelected = null;
	
	// store the ID of a module being dragged off the tool box
	var moduleSource = "";
	
	// bind data to the gui
	paths.selectAll(".pPath").data(data.paths);	
	nodes.selectAll(".pNode").data(data.nodes);
	
	// deselect a selected node or path
	var deselect = function(selection) {
		var selection = selection || d3.selectAll(".selection");
	
		if(selection[0].length !== 0) {
			selection.data()[0].isSelected = false;

			if(d3.select(selection[0][0].parentNode).attr("id") === "paths") {
				selection.data(selection.data())
					.attr("class", null)
					.attr("stroke-width", "2")
					.attr("stroke", "black");
			}
			else {
				selection.remove();
			}
		}
		
		pSelected = null;
	};
	
	// handle select and deselect events for nodes and paths
	var clickHandler = function(d) {
		if(d3.event.defaultPrevented) 
			return;
		
		var p = d3.select(this); // variable p is used because selection could be node or path
	
		// check if anything is already selected
		var selection = d3.selectAll(".selection");
		//deselect(selection)
		if(selection[0].length !== 0 && pSelected !== this.id) {
			deselect(selection); // this function is also used to deselect an item by clicking on the empty whiteboard
		}
		
		if(p.data()[0].isSelected === false) { // select the item
			p.data()[0].isSelected = true;
			pSelected = p.data()[0].id;
			
			// nodes and paths need to be handled slightly differently due to the nature of the underlying object
			if(p.attr("class") === "pNode") {
					p.append("path")
						.attr("class", "selection")
						.attr("d", "M 0 0 H 100 M 100 0 V 100 M 100 100 H 0 M 0 100 V 0")
						.attr("stroke", "black")
						.attr("stroke-dasharray", "20, 20");
						
					if(p.attr("id") !== "node0") { // do not add a delete button to the start node
						p.append("image")
							.data([this.id])
							.attr("class", "selection")
							.attr("xlink:href", "img/close.png")
							.attr("x", "76")
							.attr("y", "0")
							.attr("width", "24")
							.attr("height", "24")
							.on("click", function(d) { deleteNode(d); });
					}
			}
			else {
				p.attr("class", "selection")
				 .attr("stroke-width", "5")
				 .attr("stroke", "aqua");
			}
		}
		else // open the modal
			modal.open({content: p.data()[0]});
		
			
		d3.event.stopPropagation();	// stop the parent SVG from registering the click
	}

	whiteboard.on("click", deselect);
	
	// node and path handlers
	
	var deleteNode = function(node) {	
		var index = lookup(node, data.nodes);
	
		while(data.nodes[index].sourcePaths.length > 0) 
			deletePath(data.nodes[index].sourcePaths[0]);
		
		while(data.nodes[index].targetPaths.length > 0)
			deletePath(data.nodes[index].targetPaths[0]);
		
		data.nodes.splice(index, 1); // remove the node from data
		d3.select("#" + node).remove(); // remove the node from d3
		
		d3.event.stopPropagation();
	}
	
	var deletePath = function(path) {
		var index = lookup(path.id, data.paths);		
		var source = lookup(path.source.id, data.nodes);
		var target = lookup(path.target.id, data.nodes);
	
		data.nodes[source].removeTarget(path.id);
		data.nodes[target].removeSource(path.id);
		d3.select("#" + path.id).remove();
		data.paths.splice(index, 1);
	}
	
	var addNode = function(type, x, y) {
		var pNode = new PNode("node" + nodeCount, type, x, y);
		data.nodes.push(pNode);
		
		pNodeGeom.createNode(pNode, nodes);
		
		nodeCount++;				
		
		deselect(); //deselect any selected items, just in case
	};
	
	var addPath = function(d) {
		pPathGeom.createPath(d, whiteboard);
	}
	
	// create tree root using start arrow, path, ghost node
	var init = function() {
		addNode("start", 20, 20);
		addNode("ghost", 120, 120);
		pPathGeom.generatePath(data.nodes[0], data.nodes[1]);
	}
	
	return {
		whiteboard: whiteboard,
		nodeCount: nodeCount,
		pathCount: pathCount,
		addNode: addNode,
		addPath: addPath,
		clickHandler: clickHandler,
		isPath: isPath,
		init: init
	};
})();

