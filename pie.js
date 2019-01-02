let path;

class Pie {
	constructor(x, y, width, height){
		this.svg = d3.select("svg").append("g")
		.attr("transform", "translate(" + x + "," + y + ")");
		
		this.width = width;
		this.height = height;
		this.radius = Math.min(width, height) / 2;
		
		this.title = this.svg.append("text").attr("text-anchor", "middle")
					.attr("y", 0);
		
		this.below = this.svg.append("text").attr("text-anchor", "middle")
					.attr("y", height);
		
		this.class = "race";
		this.value = "winlose";
		
		this.easing = d3.easePolyOut.exponent(4.0);
		this.duration = 50;
		this.refresh = 50;
		this.moving = 0;
		this.format = d3.format("u");
		
		this.colorkey = "";
		
		let classify = this.class, value = this.value;
		
		this.pie = d3.pie()
		.sort(function(a, b){ return a[classify] > b[classify]; })
		.value(function(d) { return d[value]; });
		
		path = d3.arc()
		.outerRadius(this.radius - 10)
		.innerRadius(0);
		
		this.label = d3.arc()
		.innerRadius(2 * this.radius / 3)
		.outerRadius(this.radius);
	}
	
	addColor(color_arr){
		this.color_arr = color_arr;
	}
	
	setData(data){
		let classify = this.class, value = this.value;
		
		this.pie = d3.pie()
			.sort(function(a, b){ return a[classify] > b[classify]; })
			.value(function(d) { return d[value]; })(data);
	}
	
	begin(){
		let color_arr = this.color_arr, classify = this.class;
		let label = this.label, format = this.format, value = this.value;
		
		this.arcs = this.svg.selectAll(".arc1")
		.data(this.pie)
		.enter().append("g")
		.attr("class", "arc1")
		.attr("transform", "translate (250, 40)");
		
		this.arcs.append("path")
		.attr("class", "pat1")
		.attr("d", path)
		.attr("fill", function(d) { return color_arr[d.data[classify]]; });
		
		this.arcs.append("text")
		.attr("class", "label1")
		.attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; })
		.attr("dy", "0.35em")
		.attr("text-anchor", function(d, i){
			if( i === 0 )
				return "end";
		})
		.text(function(d) { return format(d[value]); });
		
		let this_ = this;
		this.moving = 1;
		this.interv = setInterval( function(){ this_.redraw(); }, this.refresh );
	}
	
	end(){
		clearInterval(this.interv);
	}
	
	arcTween(a) {
		let i = d3.interpolate(this._current, a);
		this._current = i(0);
		return function(t) {
			return path(i(t));
		};
	}
	
	redraw() {
		let color_arr = this.color_arr, classify = this.class;
		let label = this.label, format = this.format, value = this.value;
		
		let paths = this.svg.selectAll(".pat1").data(this.pie); // Compute the new angles
		paths.transition().duration(this.duration*2).attrTween("d", this.arcTween); // redrawing the path
		
		this.svg.selectAll(".label1").data(this.pie).transition().duration(this.duration*2)
		.text(function(d) { return format(d[value]); })
		.attr("text-anchor", function(d, i){
			if( i === 1 )
				return "end";
		})
		.attr("transform", function(d) { return "translate(" + label.centroid(d) + ")"; });
	}
}