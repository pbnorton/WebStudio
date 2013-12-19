function PNode(id) {
	this.id = id;
	this.type = "ghost";
	this.origin = [100, 100];
	
	this.paths = [];
}

PNode.prototype.getID = function() { return this.id; }

PNode.prototype.setID = function(id) { this.id = id; }

PNode.prototype.getOrigin = function() { return this.origin; }

PNode.prototype.setOrigin = function(o) { this.origin = o; }