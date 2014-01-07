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
	
	this.sourcePaths = [];
	this.targetPaths = [];
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

PNode.prototype.setSource = function(path) {
	this.sourcePaths.push(path);
}

PNode.prototype.removeSource = function(path) {
	var index = lookup(path, this.sourcePaths);
	this.sourcePaths.splice(index, 1);
}

PNode.prototype.setTarget = function(path) {
	this.targetPaths.push(path);
}

PNode.prototype.removeTarget = function(path) {
	var index = lookup(path, this.targetPaths);
	this.targetPaths.splice(index, 1);
}

PNode.prototype.updatePaths = function() {	
	for(var i = 0; i < this.sourcePaths.length; ++i)
		this.sourcePaths[i].updatePath();
	
	for(var i in this.targetPaths)
		this.targetPaths[i].updatePath();
}
