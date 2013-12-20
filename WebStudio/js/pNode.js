function PNode(id) {
	this.id = id;
	this.type = "ghost";
	this.origin = [100, 100];
	this.width = 100;
	this.height = 100;
	this.x = this.origin[0] + (this.width / 2);
	this.y = this.origin[1] + (this.height / 2);
	
	this.sourceNodes = [];
	this.targetNodes = [];
	
	this.pathSources = [];
	this.pathTargets = [];
}

PNode.prototype.getID = function() { return this.id; }

PNode.prototype.setID = function(id) { this.id = id; }

PNode.prototype.getOrigin = function() { return this.origin; }

PNode.prototype.setOrigin = function(o) { 
	this.origin = o; 
	this.x = this.origin[0] + (this.width / 2);
	this.y = this.origin[1] + (this.height / 2);
	pNodeGeom.updateNodePos(this); 
}

PNode.prototype.setSource = function(pNode) {
	console.log(this.id + " -> " + pNode);
}

PNode.prototype.setTarget = function(pNode) {
	console.log(this.id + " -> " + pNode);
}

PNode.prototype.addPathSource = function(path) {
	this.pathSources.push(path);
}

PNode.prototype.getPathSource = function() {
	return this.pathSources;
}

PNode.prototype.addPathTarget = function(path) {
	this.pathTargets.push(path);
}

PNode.prototype.getPathTargets = function() {
	return this.pathTargets;
}

PNode.prototype.updatePaths = function() {
	var newDiagonal = d3.svg.diagonal();
	var oldDiagonal;
/*		
	WebStudio.whiteboard.append("path")
		.attr("id", "path" + WebStudio.pathCount)
		.attr("fill", "none")
		.attr("stroke", "black")
		.attr("d", diagonal);
*/				
	for(var i in this.pathSources) {
		oldDiagonal = d3.select("#" + this.pathSources[i]).attr("id");
		//console.log("oldDiag = " + d3.select("#" + oldDiagonal).attr());
		newDiagonal.source({x: this.x, y: this.y})
				.target({x: 0, y: 0});
	}
}

function PPath(id) {
	this.id = id;
	this.p1 = [0, 0];
	this.p2 = [0, 0];
}