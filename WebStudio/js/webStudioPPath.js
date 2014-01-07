function PPath(id, source, target) {
	this.id = id;
	this.x1;
	this.y1;
	this.x2;
	this.y2;
	
	this.cx;
	this.cy;
	
	this.isSelected = false;
	
	this.source = source;
	this.target = target;
}

PPath.prototype.setSource = function(source) { this.source = source; }

PPath.prototype.getSource = function() { d3.select("#" + source); }

PPath.prototype.setTarget = function(target) { this.target = target; }

PPath.prototype.getTarget = function() { d3.select("#" + target); }


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
}