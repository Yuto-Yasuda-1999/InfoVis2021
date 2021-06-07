class BarChart {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:30, bottom:10, left:30},
            xlabel: config.xlabel || '降水量',
            ylabel: config.ylabel || '度数',
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scale.ordinal()
            .rangeRoundBands([0, self.inner_width],.1)

        self.yscale = d3.scale.linear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.svg.axis()
            .scale(self.xscale)
            .orient("bottom")
            .ticks(5)
            

        self.yaxis = d3.svg.axis()
            .scale(self.yscale)
            .orient("left")
            .ticks(5)
    
            

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size', '17px')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );

        const ylabel_space = 50;
        self.svg.append('text')
            .style('font-size', '17px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );
    }

    update() {
        let self = this;
        //console.log(self.data)
        //const data_map = d3.rollup( self.data, v => v.length, d => d.amount );
        self.data_map = d3.nest()
                .key(function(d) { return d.amount; })
                .rollup(function(values){return values.length})
                .entries(self.data);
        console.log(self.data_map)
        // self.aggregated_data = Array.from( data_map, ([key,count]) => ({key,count}) );
        // console.log(self.aggregated_data)

        self.cvalue = d => d.key;
        console.log(self.cvalue)
        self.xvalue = d => d.key;
        console.log(self.xvalue)
        self.yvalue = d => d.values;
        console.log(self.yvalue)


        //const items = self.data_map.map( self.xvalue );
        self.items = ["0","1","2","3"]
        self.xscale.domain(self.items);
        console.log(self.items)

        self.yscale.domain([0, 47]);
        //console.log(ymax)

        self.render();
    }

    render() {
        let self = this;
        
        self.chart.selectAll(".bar")
                .data(self.data_map)
                .enter()
                .append("rect")
                .attr("x", d => self.xscale( self.xvalue(d) ) )
                .attr("y", d => self.yscale( self.yvalue(d) ))
                .attr("width", self.xscale.rangeBand()-30)
                .attr("height", d => self.inner_height - self.yscale( self.yvalue(d) ))
                .attr("fill", "#6495ed")

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }

    
}
