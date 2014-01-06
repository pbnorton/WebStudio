/************************************************************************************
/*	Global namespace, event flags, and node/path functions
/************************************************************************************/

var WebStudio = (function() {
	var whiteboard = d3.select("body")
						.append("svg")
						.attr("id", "whiteboard");
	$("#whiteboard").droppable( { // jQueryUI functionality to allow dropping of nodes from the toolbox
		accept: ".icon",
		drop: function(e, ui) {
			addNode(WebStudio.moduleSource, ui.offset.left, ui.offset.top);
			//addNode(WebStudio.moduleSource, ui.offset.left, e.pageY);
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
		
		var p = d3.select(this);
	
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
				d3.select("#" + p.data()[0].id).append("path")
					.attr("class", "selection")
					.attr("d", "M 0 0 H 100 M 100 0 V 100 M 100 100 H 0 M 0 100 V 0")
					.attr("stroke", "black")
					.attr("stroke-dasharray", "20, 20");
			}
			else {
				d3.select("#" + p.data()[0].id)
					.attr("class", "selection")
					.attr("stroke-width", "5")
					.attr("stroke", "aqua");
			}
		}
		else { // open the modal
			if(p.attr("class") === "pNode")
				modal.open({width: 300, height: 300, content: p.data()[0].id});
			else
				modal.open({width: 300, height: 300, content: p.data()[0].id});
		}
			
	//console.log(data.paths);
		d3.event.stopPropagation();	// stop the parent SVG from registering the click
	}

	whiteboard.on("click", deselect);
	
	// node and path handlers
	var addNode = function(type, x, y) {
		var pNode = new PNode("node" + nodeCount, type, x, y);
		data.nodes.push(pNode);
		
		pNodeGeom.createNode(pNode, nodes);
		
		nodeCount++;				
		
		deselect(); //deselect any selected items, just in case
	};
	
	var addPath = function(d) {
		pPathGeom.createPath(d, whiteboard);
		
		//this.pathCount++;
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

