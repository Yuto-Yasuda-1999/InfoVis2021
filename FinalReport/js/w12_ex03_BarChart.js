class BarChart {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
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
            .rangeRoundBands([0, self.inner_width])

        self.yscale = d3.scale.linear()
            .range([self.inner_height, 0]);

        self.xaxis = d3.svg.axis()
            .scale(self.xscale)
            .orient("bottom")
            .ticks(5)
            

        self.yaxis = d3.svg.axis()
            .scale(self.xscale)
            .orient("left")
            .ticks(5)
    
            

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        const xlabel_space = 40;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('x', self.config.width / 2)
            .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
            .text( self.config.xlabel );

        const ylabel_space = 50;
        self.svg.append('text')
            .style('font-size', '12px')
            .attr('transform', `rotate(-90)`)
            .attr('y', self.config.margin.left - ylabel_space)
            .attr('x', -(self.config.height / 2))
            .attr('text-anchor', 'middle')
            .attr('dy', '1em')
            .text( self.config.ylabel );
    }

    update() {
        let self = this;
        console.log(self.data)
        //const data_map = d3.rollup( self.data, v => v.length, d => d.amount );
        self.data_map = d3.nest()
                .key(function(d) { return d.amount; })
                .rollup(function(values){return values.length})
                .entries(self.data);
        console.log(self.data_map)
        // self.aggregated_data = Array.from( data_map, ([key,count]) => ({key,count}) );
        // console.log(self.aggregated_data)

        self.cvalue = d => d.key;
        self.xvalue = d => d.key;
        self.yvalue = d => d.values;


        const items = self.data_map.map( self.xvalue );
        self.xscale.domain(items);
        console.log(items)

        const ymin = 0;
        const ymax = d3.max( self.data_map, self.yvalue );
        self.yscale.domain([ymin, ymax]);
        console.log(ymax)

        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll(".bar")
            .data(self.data_map)
            .enter().append("rect")
            .attr("x", d => self.xscale( self.xvalue(d) ) )
            .attr("y", d => self.yscale( self.yvalue(d) ) )
            .attr("width", self.xscale.rangeBand())
            .attr("height", d => self.inner_height - self.yscale( self.yvalue(d) ))
            .attr("fill", d => self.config.cscale( self.cvalue(d) ));

        self.xaxis_group
            .call(self.xaxis);

        self.yaxis_group
            .call(self.yaxis);
    }
}
