function PNode(id, type, x, y) {
	this.id = id;
	this.type = type;
	
	this.isSelected = false;
	
	this.origin = [x, y]; // top left
	this.width = 100;
	this.height = 100;
	this.x = this.origin[0] + (this.width / 2);
	this.y = this.origin[1] + (this.height / 2);
	
	this.caption = "";
	
	this.sourceNodes = [];
	this.targetNodes = [];
	
	this.paths = [];
}

PNode.prototype.getID = function() { return this.id; }

PNode.prototype.setID = function(id) { this.id = id; }

PNode.prototype.getOrigin = function() { return this.origin; }

PNode.prototype.setOrigin = function(o) { 
	this.origin = o; 
	this.x = this.origin[0] + (this.width / 2);
	this.y = this.origin[1] + (this.height / 2);
	
	d3.select("#node" + this.id).data([this]);
	d3.select("#node" + this.id + "-handles").data([this.origin]);
	pNodeGeom.updateNodePos(this);
}

PNode.prototype.setSource = function(pNode) {
	this.sourceNodes.push(pNode);
}

PNode.prototype.removeSource = function(pNode) {
	var index = lookup(pNode, this.sourceNodes);
	this.sourceNodes.splice(index, 1);
}

PNode.prototype.setTarget = function(pNode) {
	this.targetNodes.push(pNode);
}

PNode.prototype.removeTarget = function(pNode) {
	var index = lookup(pNode, this.targetNodes);
	this.targetNodes.splice(index, 1);
}

PNode.prototype.addPath = function(path) { this.paths.push(path); }

PNode.prototype.removePath = function(path) { 
	var index = lookup(path, this.paths);
	this.paths.splice(index, 1); 
}

PNode.prototype.updatePaths = function(paths) {	
	for(var i in paths)
		paths[i].updatePath();
}
