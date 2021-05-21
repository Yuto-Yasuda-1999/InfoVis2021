d3.csv("https://yuto-yasuda-1999.github.io/InfoVis2021/W06/w06_task1.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:100, right:20, bottom:100, left:100}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;
        
        //Title
        self.svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", (self.config.width-self.config.margin.left)/2 + self.config.margin.left )
            .attr("y", self.config.margin.top/2)
            .text("Title")
            .attr('stroke', 'green')
            .style("font-size", 30);

        //Xlabel
        self.svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", (self.config.width-self.config.margin.left)/2 + self.config.margin.left )
            .attr("y", self.config.height - self.config.margin.bottom/2)
            .text("X")
            .style("font-size", 20);
        
        //Ylabel
        self.svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y",  self.config.margin.left/2 )
            .attr("x", (-self.config.height + self.config.margin.bottom + self.config.margin.top)/2 - self.config.margin.top)
            .text("Y")
            .style("font-size", 20);

        self.xscale = d3.scaleLinear()
            .range( [1, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [self.inner_height , 0] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(10)
            .tickSize([5]);
          
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);  
        
        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(10)
            .tickSize([5]);
            
        self.yaxis_group = self.chart.append('g')

        
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        console.log(xmax)
        console.log(self.data)
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ ymin, ymax] );

        self.render();
    }

    render() {
        let self = this;

        let circles = self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y ) )
            .attr("r", d => d.r )
            .attr("fill", d => d.color);

        circles
        .on('mouseover', (e,d) => {
            d3.select('#tooltip')
                .style('opacity', 1)
                .html(`<div class="tooltip-label">Position</div>(${d.x}, ${d.y})`);
        })
        .on('mousemove', (e) => {
            const padding = 10;
            d3.select('#tooltip')
                .style('left', (e.pageX + padding) + 'px')
                .style('top', (e.pageY + padding) + 'px');
        })
        .on('mouseleave', () => {
            d3.select('#tooltip')
                .style('opacity', 0);
        });

        

        self.xaxis_group
            .call( self.xaxis );
        self.yaxis_group
            .call( self.yaxis );
    }
}
