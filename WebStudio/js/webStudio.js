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
			if(ui.position.left > $(".panel").outerWidth()) // make sure user clears the toolbox
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
	//paths.selectAll(".pPath").data(data.paths);	
	//nodes.selectAll(".pNode").data(data.nodes);
	
	// deselect a selected node or path
	function deselect(selection) {
		var selection = selection || d3.selectAll(".selection");
	
		if(selection[0].length !== 0) {
			selection.data()[0].isSelected = false;

			if(d3.select(selection[0][0].parentNode).attr("class") === "PPath") {
				selection.data(selection.data())
					.attr("class", null)
					.attr("stroke-width", "1");
					//.attr("stroke", "red");
			}
			else {
				selection.remove();
			}
		}
		
		pSelected = null;
	};
	
	// handle select and deselect events for nodes and paths
	function clickHandler(d) {
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
				 .attr("stroke-width", "5");
				 //.attr("stroke", "aqua");
			}
		}
		else // open the modal
			modal.open(p.data()[0]);
	
		d3.event.stopPropagation();	// stop the parent SVG from registering the click
	}

	whiteboard.on("click", deselect);
	
	// node and path handlers
	
	function deleteNode(node) {	
		if(node !== "node0" && node !== "node1") {
			var index = lookup("id", node, data.nodes);
		
			while(data.nodes[index].sourcePaths.length > 0) 
				deletePath(data.nodes[index].sourcePaths[0]);
			
			while(data.nodes[index].targetPaths.length > 0)
				deletePath(data.nodes[index].targetPaths[0]);
			
			data.nodes.splice(index, 1); // remove the node from data
			d3.select("#" + node).remove(); // remove the node from d3
		}
		else
			alert("Cannot delete default nodes");
			d3.event.stopPropagation();
	}
	
	function deletePath(path) {
		if(path.id !== "path0") {
			var index = lookup("id", path.id, data.paths);		
			var source = lookup("id", path.source.id, data.nodes);
			var target = lookup("id", path.target.id, data.nodes);
		
			data.nodes[source].removeTarget(path.id);
			data.nodes[target].removeSource(path.id);
			//console.log(d3.select("#" + path.id).node().parentNode);
			d3.select("#" + path.id).node().parentNode.remove();
			data.paths.splice(index, 1);
		}
		else
			alert("Cannot delete default path");
	}
	
	function addNode(type, x, y) {
		var pNode = new PNode("node" + nodeCount, type, x, y);
		data.nodes.push(pNode);
		
		pNodeGeom.createNode(pNode);
		
		nodeCount++;				
		
		deselect(); //deselect any selected items, just in case
		
		return pNode; // we need this when adding new ghost nodes
	};
	
	function addPath(d) {
		pPathGeom.createPath(d, whiteboard);
	}
	
	// create tree root using start arrow, path, ghost node
	function init() {
		paths.selectAll(".pPath").data(data.paths);	
		nodes.selectAll(".pNode").data(data.nodes);
			
		addNode("start", 50, 50);
		addNode("twitter", 150, 150);
		pPathGeom.generatePath(data.nodes[0], data.nodes[1], "goto");
		
		d3.json("root.json", function(json) {
			console.log(json);
		});
	/*
		d3.json("root.json", function(json) {
			console.log(json);
			paths.selectAll(".pPath").data(json.paths);	
			nodes.selectAll(".pNode").data(json.nodes);
			
			update(json);
		});
	*/
	}
	
	function update(data) {
		forEach(data.nodes, addNode);
		forEach(data.paths, pPathGeom.generatePath);
	}
	
	return {
		whiteboard: whiteboard,
		nodeCount: nodeCount,
		pathCount: pathCount,
		addNode: addNode,
		deleteNode: deleteNode,
		addPath: addPath,
		clickHandler: clickHandler,
		isPath: isPath,
		init: init
	};
})();

