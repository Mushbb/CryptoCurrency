class Bar {
	constructor(g, x, y, width, height, tags) {
		this.grp_x = x; this.grp_y = y;
		
		this.svg = g.append("g")
			.attr("transform", "translate(" + x + "," + y + ")");
		
		this.x = d3.scaleLinear()
		.range([0, width]);
		this.y = d3.scaleBand()
		.rangeRound([0, height])
		.padding(.15);
		
		this.xAxis = d3.axisTop(this.x)
						.tickSize(-height)
						.tickFormat(d3.format("u"))
						.tickPadding(10)
						.ticks(5);
		
		this.svg.append("g").attr("class", "x axis");
		
		this.svg.append("g")
				.attr("class", "y axis")
				.append("line")
				.attr("class", "domain")
				.attr("y2", height);
		
		/////////////////////////////////////////////////////
		// number tag
		
		if( tags === undefined ) this.tags = 10;
		else this.tags = tags;
		
		this.nst_x = -10;
		this.nst_y = 28;
		this.nst_dist = 33;
		this.nst_font = "bold 25px Arial Narrow";
		
		this.nst = [];
		for (let i = 0; i < this.tags; i++) {
			this.nst[i] = this.svg.append("text")
					.attr("text-anchor", "end")
					.attr("x", this.nst_x)
					.attr("y", this.nst_y + (this.nst_dist * i))
					.text(function () {
						if (i%10 === 0)
							return ""+(i+1)+"st";
						else if (i%10 === 1)
							return ""+(i+1)+"nd";
						else if (i%10 === 2)
							return ""+(i+1)+"rd";
						else
							return ""+(i + 1) + "th";
					})
					.style("fill", "white")
					.style("font", this.nst_font);
		}
		
		this.back = this.svg.append("rect").attr("x", -100).attr("y", 0)
				.attr("width", 100). attr("height", height). attr("class","back");
		
		//////////////////////////////////////////////////////
		// default settings
		this.easing = d3.easePolyOut.exponent(4.0);
		this.duration = 1000;
		this.refresh = 50;
		this.moving = 0;
		this.reprint = 0;
		
		this.height = height;
		this.width = width;
		this.color_arr = super.color_arr;
		this.dom_x = 1500;
		this.dom_y = 1800;
		this._front = 300;
		this._back = 200;
		this._diff = 10;
		this.fix_x = undefined;
		this.fix_y = undefined;
		this.valueformat = d3.format("u");
		this.valuefront = "";
		
		this.id = "";
		this.value = "";
		this.value1 = "";
		this.value2 = "";
		this.label = "";
		this.age = "";
		this.colorkey = "";
		this.image = "";
		this.imageext = "png";
		this.imagepath = "flags";
		this.flg_blk = 85;
		this.round = 0;
	}
	
	addColor(color_arr){
		this.color_arr = color_arr;
	}
	
	setData(data){
		this.tops = data;
	}
	
	begin(){
		let this_ = this;
		this.moving = 1;
		this.interv = setInterval( function(){ this_.redraw(); }, this.refresh );
	}
	
	end(){
		clearInterval(this.interv);
	}
	
	redraw() {
		let tops = this.tops;
		let x = this.x, y = this.y, xAxis = this.xAxis;
		let color_arr = this.color_arr;
		
		let id = this.id, value = this.value, value1 = this.value1, value2 = this.value2, label = this.label;
		let age = this.age, colorkey = this.colorkey, image = this.image, imagepath = this.imagepath;
		let imageext = this.imageext;
		let flg_blk = this.flg_blk;
		let valueformat = this.valueformat, valuefront = this.valuefront;
		
		let dom_x = this.dom_x, dom_y = this.dom_y;
		let max = tops[0][value];
		let min = tops[9 < (tops.length - 1) ? 9 : (tops.length - 1)][value];
		let front = this._front, back = this._back, diff = this._diff;
		let round = this.round, reprint = this.reprint;
		
		if( this.fix_x !== undefined ) dom_x = this.fix_x;
		else {
			if (dom_x > (min - (x.invert(front) - x.invert(0)))) {
				dom_x = (min - (x.invert(front) - x.invert(0))) > (dom_x - (x.invert(diff) - x.invert(0))) ?
					(min - (x.invert(front) - x.invert(0))) : (dom_x - (x.invert(diff) - x.invert(0)));
			}
			else if (dom_x < (min - (x.invert(front) - x.invert(0)))) {
				dom_x = (min - (x.invert(front) - x.invert(0))) < (dom_x + (x.invert(diff) - x.invert(0))) ?
					(min - (x.invert(front) - x.invert(0))) : (dom_x + (x.invert(diff) - x.invert(0)));
			}
		}
		
		if( this.fix_y !== undefined ) dom_y = this.fix_y;
		else {
			if (dom_y < (max + (x.invert(back) - x.invert(0)))) {
				dom_y = (max + (x.invert(back) - x.invert(0))) < (dom_y + (x.invert(diff) - x.invert(0))) ?
					(max + (x.invert(back) - x.invert(0))) : (dom_y + (x.invert(diff) - x.invert(0)));
			}
			else if (dom_y > (max + (x.invert(back) - x.invert(0)))) {
				dom_y = (max + (x.invert(back) - x.invert(0))) > (dom_y - (x.invert(diff) - x.invert(0))) ?
					(max + (x.invert(back) - x.invert(0))) : (dom_y - (x.invert(diff) - x.invert(0)));
			}
		}
		
		x.domain([dom_x, dom_y]);
		y.domain(tops.map(function (d) {
			return d[id];
		}));
		
		this.dom_x = dom_x;
		this.dom_y = dom_y;
		
		let bar = this.svg.selectAll(".bar")
		.data(tops, function (d) {
			return d[id];
		});
		
		
		let barEnter = bar.enter().insert("g", ".axis");
		
		barEnter
		.attr("class", "bar")
		.attr("transform", "translate(0," + (this.height * 1.1) + ")")
		.style("fill-opacity", 1);
		
		barEnter.append("rect")
		.attr("width", function (d) {
			if (x(d[value]) > 0) return x(d[value]);
		})
		.attr("height", y.bandwidth())
		.style("fill", function (d) {
			if (color_arr[d[colorkey]] === undefined)
				return color_arr['Unaffiliated'];
			return color_arr[d[colorkey]];
		});
		
		barEnter.append("text")
		.attr("class", "label")
		.attr("x", function (d) {
			return x(d[value]) - 10;
		})
		.attr("y", y.bandwidth() / 2)
		.attr("dy", ".35em")
		.attr("text-anchor", "end")
		//.style("fill", "white")
		.text(function (d) {
			return d[label];
		})
		.each(function (d) {
			d["twidth"] = this.getBBox().width
		});
		
		barEnter.append("svg:image")
			.attr("class", "image")
			.attr("x", function (d) {
				return x(d[value]) - d["twidth"] - 95;
			})
			.attr("y", y.bandwidth() / 10)
			.attr("xlink:href", function(d) {
				let filename = d[image] + "." + imageext;
				if(image !== "")
					return "" + imagepath + "/" + filename;
			})
			.attr("height", y.bandwidth() * 8 / 10)
			.attr("width", y.bandwidth() * 32 / 25);
		
		barEnter.append("text")
		.attr("class", "value")
		.attr("x", function (d) {
			return x(d[value]) + 10;
		})
		.attr("y", y.bandwidth() / 2)
		.attr("dy", ".35em")
		.text(function (d) {
			return d[value];
		});
		
		if (value2 !== "") {
			barEnter.append("text")
			.attr("class", "value2")
			.attr("x", function (d) {
				return x(d[value]) + 100;
			})
			.attr("y", y.bandwidth() / 2)
			.attr("dy", ".35em")
			.text(function (d) {
				return d[value2];
			});
		}
		
		let barUpdate = bar.transition().duration(this.duration).ease(this.easing);
		
		barUpdate
		.attr("transform", function (d) {
			return "translate(0," + y(d[id]) + ")";
		})
		.style("fill-opacity", 1);
		
		barUpdate.select("rect")
		.attr("width", function (d) {
			if (x(d[value]) > 0) return x(d[value]);
		})
		.attr("y", 0)
		.attr("height", y.bandwidth());
		
		barUpdate.select(".value")
		.attr("x", function (d) {
			return x(d[value]) + 10;
		})
		.attr("y", y.bandwidth() / 2)
		.text(function (d) {
			return round ? Math.round(d[value1]) : d[value1];
		});
		
		barUpdate.select(".label")
		.attr("x", function (d) {
			return x(d[value]) - 10;
		})
		.attr("y", y.bandwidth() / 2)
		.text(function (d) {
			if( age !== "" )
				return d[label] + " (" + d[age] + ")";
			return d[label];
		})
		.each(function(d){ d["twidth"] = this.getBBox().width });
		
		if( value2 !== "") {
			barUpdate.select(".value2")
			.attr("x", function (d) {
				return x(d[value]) + 100;
			})
			.attr("y", y.bandwidth() / 2)
			.text(function (d) {
				return d[value2];
			});
		}
		
		d3.transition(this.svg).select(".x.axis").duration(this.duration).ease(this.easing)
		.call(xAxis);
			
		barUpdate.select(".image")
			.attr("x", function(d) { return x(d[value]) - d["twidth"] - flg_blk; })
			.attr("y", y.bandwidth() / 10 );

		if( reprint ) {
            barUpdate.select(".image")
                .attr("xlink:href", function (d) {
                    if (image !== "") {
                        let filename = d[image] + "." + imageext;
                        return "" + imagepath + "/" + filename;
                    }
                });
            this.reprint = 0;
        }



		/*
		if (fame === 1) {
			svg.select(".peak").transition().duration(dur_all * 1.5).ease(d3.easeLinear)
			.attr("x", x(950000));
		}*/
		
		this.svg.select(".x.axis").moveToBack();
		
		let barExit = bar.exit().transition();
		
		barExit
		//.attr("transform", function(d) { return "translate(0," + (y0[d.id] + height) + ")"; })
		//.style("fill-opacity", 1)
		.attr("y", this.height*1.1);
		
		barExit.select("rect")
		.attr("y", this.height*1.1)
		.attr("width", 0);
		
		barExit.select(".value")
		.attr("y", this.height*1.1)
		.attr("x", 0);
		//.text(function(d) { return format(d.score); });
		
		barExit.select(".value2")
		.attr("y", this.height*1.1)
		.attr("x", 0);
		
		barExit.select(".label")
		.attr("y", this.height*1.1)
		.attr("x", 0);
		
		barExit.select(".image")
		.attr("x", 0 )
		.attr("y", this.height*1.1);
		
		barEnter.moveToFront();
		this.back.moveToFront();
		for(let i=0;i<this.tags;i++) this.nst[i].moveToFront();
	}
	
	setNametag(x, y, dist, font){
		this.nst_x = 	(x === undefined) ? this.nst_x : x ;
		this.nst_y = 	(y === undefined) ? this.nst_y : y ;
		this.nst_dist = (dist === undefined) ? this.nst_dist : dist ;
		this.nst_font = (font === undefined) ? this.nst_font : font ;
		
		for(let i=0;i<this.tags;i++){
			this.nst[i].attr("x", this.nst_x).attr("y", this.nst_y + (this.nst_dist*i))
				.style("font", this.nst_font);
		}
	}
}