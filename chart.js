class Chart {
	
	constructor(){
		this.width = 1600;
		this.height = 900;
		this.color_arr = [];
		this.charts = [];
		this.clipgroup = [];
		
		this.svg = d3.select("#chart").append("svg")
			.attr("width", this.width).attr("height", this.height);
	}
	
	addColor( string, color ){
		this.color_arr[string] = color;
	}
	
	adoptColor( name ){
		this.charts[name].addColor( this.color_arr );
	}
	
	getChart(name) {
		return this.charts[name];
	}
	
	addClippath(name, cx, cy, width, height){
		this.svg.append("clipPath")
			.attr("id", name+"clip")
			.append("rect")
			.attr("x", cx).attr("y", cy).attr("width", width).attr("height", height);
		
		this.clipgroup[name].attr("clip-path", "url(#"+name+"clip)");
	}
	
	addClippath_polygon(name, p1, p2, p3, p4, p5, p6){
		this.svg.append("clipPath")
		.attr("id", name+"clip")
		.append("polygon")
		.attr("points", ""+p1[0]+" "+p1[1]+","+p2[0]+" "+p2[1]+","+p3[0]+" "+p3[1]+
			","+p4[0]+" "+p4[1]+","+p5[0]+" "+p5[1]+","+p6[0]+" "+p6[1]);
		
		this.clipgroup[name].attr("clip-path", "url(#"+name+"clip)");
	}
	
	addBar(name, x, y, width, height, tags){
		let gap = 100;
		
		this.clipgroup[name] = this.svg.append("g")
				.attr("transform", "translate(" + (x-gap) + "," + y + ")");
		
		this.charts[name] = new Bar( this.clipgroup[name], gap, 0, width, height, tags );
		this.charts[name].addColor(this.color_arr);
	}
	
	addBoard(name, x, y, width, height){
		let gap = 100;
		
		this.clipgroup[name] = this.svg.append("g")
			.attr("transform", "translate(" + (x-gap) + "," + y + ")");
		
		this.charts[name] = new Board( this.clipgroup[name], gap, 0, width, height );
		this.charts[name].addColor(this.color_arr);

		return  this.charts[name];
	}
	
	addPie(name, x, y, width, height){
		this.charts[name] = new Pie( x, y, width, height );
		this.charts[name].addColor(this.color_arr);
	}

	addLine(name, x, y, width, height){
        let gap = 100;

        this.clipgroup[name] = this.svg.append("g")
            .attr("transform", "translate(" + (x-gap) + "," + y + ")");

        this.charts[name] = new Line( this.clipgroup[name], x, y, width, height );
        this.charts[name].addColor(this.color_arr);

        return  this.charts[name];
	}
}