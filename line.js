class Line{
    constructor(g, x, y, width, height) {
        this.grp_x = x;
        this.grp_y = y;

        this.svg = g.append("g")
            .attr("transform", "translate(" + x + "," + y + ")");

        this.data = [];
        this.lines = [];

        this.height = height;
        this.width = width;

        this.refresh = 50;
        this.duration = 100;
        this.easing = d3.easeLinear;
        this.curve = d3.curveCardinal;

        this.up = "up";
        this.right = "right";
        this.logo = "";
        this.board = 0;
        this.bdpos = "";

        this.f_domain = 0;
        this.l_domain = 0;
        this.fy_domain = 0;
        this.ly_domain = 100;

        this.r_margin = 0;

        this.dots = [];
        this.dotx = [];
        this.doty = [];
        //////////////////////////////////////////////////
        this.dotease = d3.easeExp;
        //////////////////////////////////////////////////

        this.garbage = [];
        this.g_line = [];
    }

    addColor(color_arr){
        this.color_arr = color_arr;
    }

    setData(data){
        // 동일한 엔티티인지 확인하고
		// 맞으면 뒤에다 붙이고 아니면 이전거 가비지 새거추가
		// 데이터 갯수는 밖에서 판단하는거고 얘는 그냥 넣어주는대로 하면 됨
		// 데이터 구조는 {id, data = {up, right} }[]

		for(let i in this.data){
			this.data[i].f = 0;
		}

		for(let i=0;i<data.length;i++){
			if( this.data[data[i].id] === undefined ){

				// make new line
				this.data[data[i].id] = [];
				this.data[data[i].id].push(data[i].data);

				this.lines[data[i].id] = this.svg.append("g")
							.append("path")
							.datum(this.data[data[i].id])
							.attr("class", data[i].id)
							.transition()
							.duration(this.duration)
							.ease(this.easing);

				this.addDot(data[i].id, data[i].data[this.right], data[i].data[this.up], 5);
			} else {
				// extend line
				this.data[data[i].id].push(data[i].data);
				if(this.data[data[i].id].length >= 3)
                    this.movDot(data[i].id, this.data[data[i].id][this.data[data[i].id].length-3][this.right], this.data[data[i].id][this.data[data[i].id].length-3][this.up]);
			}
			this.data[data[i].id].f = 1;
		}

		for(let i in this.data){
			if( this.data[i].f === 0 ){
				// move to garbage
				this.garbage.push(this.data[i]);
				this.g_line.push(this.lines[this.data[i].id]);
				this.data.splice(i, 1);
				this.lines.splice(this.data[i].id, 1);

				this.delDot(this.data[i].id);
			}
		}
    }

    // 점의 위치도 저장해놔야해
    addDot(id, cx, cy, r){
    	this.dotx[id] = cx;
    	this.doty[id] = cy;
    	this.dots[id] = this.svg.append("circle")
            .attr("class", id+"d")
            .attr("r", r);
	}

	movDot(id, cx, cy){
        this.dotx[id] = cx;
        this.doty[id] = cy;
    }

    delDot(id){
        this.dots[id].remove();
    }

    begin(){
        let x = d3.scaleTime()
            .domain([this.f_domain, this.l_domain])
            .range([0, this.width]);

        let y = d3.scaleLinear()
            .domain([this.fy_domain, this.ly_domain])
            .range([this.height, 0]);

        this.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + y(0) + ")")
            .call(d3.axisBottom(x).ticks(5));

        this.svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(y).ticks(10));

        this.x = x; this.y = y;

        let this_ = this;
        this.moving = 1;
        this.interv = setInterval( function(){ this_.redraw(); }, this.refresh );
    }

    end(){
        clearInterval(this.interv);
    }

    redraw(){
        let x = this.x, y = this.y;

        x.domain([this.f_domain, this.l_domain + (x.invert(this.r_margin) - x.invert(0))]);
        y.domain([this.fy_domain, this.ly_domain]);

        let up = this.up, right = this.right;
        let line = d3.line()
            .curve(this.curve)
            .x(function(d) { return x(d[right]); })
            .y(function(d) { return y(d[up]); });

        // Redraw the line.
        for(let i in this.data) {
        	this.svg.select("."+i)
                    .transition().duration(this.duration).ease(this.easing)
                    .attr("d", line(this.data[i]));

        }

        // Redraw the garbages
        for(let i in this.garbage) {
			this.g_line[this.garbage[i].id].transition().duration(this.duration).ease(this.easing)
				.attr("d", line(this.garbage[i]));
		}

        // Redraw the dots
        for(let i in this.dots){
            this.dots[i].transition().duration(this.duration).ease(this.dotease)
                .attr("cx", x(this.dotx[i])).attr("cy", y(this.doty[i]));
        }

        d3.transition(this.svg).select(".x.axis").duration(this.duration).ease(this.easing)
            .call(d3.axisBottom(x).ticks(5));
        d3.transition(this.svg).select(".y.axis").duration(this.duration).ease(this.easing)
            .call(d3.axisLeft(y).ticks(10));

        this.x = x;
        this.y = y;
        this.line = line;
    }
}