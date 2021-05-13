d3.csv("https://yuto-yasuda-1999.github.io/InfoVis2021/W08/w08_task02_data.csv")
    .then( data => {
        
        
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 256,
            margin: {top:50, right:10, bottom:50, left:50}
        };

        const bar_chart = new BarChart( config, data );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarChart {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:20, left:60}
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
            .attr("x", (self.config.width-self.config.margin.left)/2 + 1.5*self.config.margin.left  )
            .attr("y", self.config.height )
            .text("X")
            .style("font-size", 20);
        
        //Ylabel
        self.svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y",  self.config.margin.left /4)
            .attr("x", (-self.config.height + self.config.margin.bottom + self.config.margin.top)/2 - self.config.margin.top)
            .text("X")
            .style("font-size", 20);

        self.xscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => d.month)])
            .range( [1, self.inner_width] );

        self.yscale = d3.scaleBand()
            .domain([0, d3.max(self.data, d => d.weight)])
            .range( [1, self.inner_heightv] );

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

        const xmax = d3.max( self.data, d => Number(d.month) );
        //const xmin = d3.min( self.data, d => Number(d.Num) );
        self.xscale.domain( [0, xmax] );
        //console.log(xmax)
        //console.log(xmin)
        //console.log(self.data)
        const ymax = d3.max( self.data, d => Number(d.weight) );
        self.yscale.domain( [0, ymax] );
        //console.log(self.data.map(d => d.Dog))

        self.render();
    }

    render() {
        let self = this;

        const line = d3.line()
        .x( d => d.x )
        .y( d => d.y );
  
        //console.log(self.data)
        self.line.selectAll("line")
            .data(self.data)
            .enter()
            .append("line")
            .attr("x", d => d.month)
            .attr("y", d => d.weight)
            


        self.xaxis_group
            .call( self.xaxis );
        self.yaxis_group
            .call( self.yaxis );
    }
}
