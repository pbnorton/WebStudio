function PPath(_id) {
	this.id = _id;
	this.nodeSource;
	this.nodeTarget;
}

PPath.prototype.setSource = function(source) { this.nodeSource = source; }

PPath.prototype.getSource = function() { d3.select("#" + nodeSource); }

PPath.prototype.getTarget = function() { d3.select("#" + nodeTarget); }

PPath.prototype.setTarget = function(target) { this.nodeTarget = target; }

PPath.prototype.updatePath = function() {	
	var source = this.nodeSource;
	var target = this.nodeTarget;
	
	source = {x: source.data()[0].x, y: source.data()[0].y };
	target = {x: target.data()[0].x, y: target.data()[0].y };

	var diagonal = d3.svg.diagonal()
		.source(source)
		.target(target);
	
	d3.select("#" + this.id).attr("d", diagonal);
}