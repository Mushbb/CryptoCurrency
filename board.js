class Board {
	constructor(g, x, y, width, height) {
		this.boards = []; this.groups = [];
		this.x = []; this.y = [];
		this.duration = 1000;
		this.ease = d3.easeLinear;
		
		this.svg = g.append("g")
			.attr("transform", "translate(" + x + "," + y + ")");
	}
	
	addColor(color_arr){
		this.color_arr = color_arr;
	}
	
	addGroup(name, x, y){
		this.boards[name] = this.svg.append("g").attr("class",name)
				.attr("transform", "translate(" + x + "," + y + ")");
		
		this.x[name] = x; this.y[name] = y;
		
		this.groups[name] = [];
		
		return this.boards[name];
	}
	
	moveGroup(name, x, y) {	// relative position
		if (typeof name === "string") {
			this.x[name] += x; this.y[name] += y;
			this.boards[name].transition().duration(this.duration).ease(this.ease)
			.attr("transform", "translate(" + this.x[name] + "," + this.y[name] + ")");
		} else {
		
		}
	}
	
	getWidth(g, name){
		return this.groups[g][name].node().getBBox().width;
	}
	
	getHeigth(g, name){
		return this.groups[g][name].node().getBBox().height;
	}
	
	addText(g, name, x, y){
		this.groups[g][name] = this.boards[g].append("text").attr("class", name)
				.attr("x", x).attr("y", y);
	}
	
	addEndText(g, name, x, y){
		this.groups[g][name] = this.boards[g].append("text").attr("class", name)
				.attr("x", x).attr("y", y)
				.attr("text-anchor", "end");
	}
	
	addMidText(g, name, x, y){
		this.groups[g][name] = this.boards[g].append("text").attr("class", name)
			.attr("x", x).attr("y", y)
			.attr("text-anchor", "middle");
	}
	
	setText(g, name, text) {
		this.groups[g][name].text(text);
	}
	
	addImage(g, name, x, y, width, height){
		this.groups[g][name] = this.boards[g].append("svg:image").attr("class", name)
				.attr("x", x).attr("y", y)
				.attr("width", width).attr("height", height);
	}
	
	setImage(g, name, src){
		this.groups[g][name].attr("xlink:href",src);
	}
}