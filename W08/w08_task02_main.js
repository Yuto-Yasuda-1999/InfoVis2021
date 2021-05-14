d3.csv("https://yuto-yasuda-1999.github.io/InfoVis2021/W08/data.csv")
    .then( data => {
        
        
        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 128,
            margin: {top:10, right:10, bottom:20, left:60}
        };

        const line = new Line( config, data );
        line.update();
    })
    .catch( error => {
        console.log( error );
    });

class Line {

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

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.yaxis = d3.axisLeft( self.yscale )
            .ticks(3)
            .tickSize(5)
            .tickPadding(5);

        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`);

        self.yaxis_group = self.chart.append('g');

        // const title_space = 10;
        // self.svg.append('text')
        //     .style('font-size', '20px')
        //     .style('font-weight', 'bold')
        //     .attr('text-anchor', 'middle')
        //     .attr('x', self.config.width / 2)
        //     .attr('y', self.config.margin.top - title_space)
        //     .text( self.config.title );

        // const xlabel_space = 40;
        // self.svg.append('text')
        //     .attr('x', self.config.width / 2)
        //     .attr('y', self.inner_height + self.config.margin.top + xlabel_space)
        //     .text( self.config.xlabel );

        // const ylabel_space = 50;
        // self.svg.append('text')
        //     .attr('transform', `rotate(-90)`)
        //     .attr('y', self.config.margin.left - ylabel_space)
        //     .attr('x', -(self.config.height / 2))
        //     .attr('text-anchor', 'middle')
        //     .attr('dy', '1em')
        //     .text( self.config.ylabel );

        self.area = d3.area()
                    .x( d => d.x )
                    .y1( d => d3.max(self.data, d => Number(d.y) ) - d.y )
                    .y0( d3.max(self.data, d => Number(d.y) )  );
                        
        
    }

    update() {
        let self = this;

        console.log(self.data)
        const xmin = d3.min( self.data, d => Number(d.x) ) ;
        const xmax = d3.max( self.data, d => Number(d.x) ) ;
        console.log(xmin)
        console.log(xmax)
        self.xscale.domain( [xmin, xmax] );

        const ymin = d3.min( self.data, d => Number(d.y) ) ;
        const ymax = d3.max( self.data, d => Number(d.y) ) ;
        self.yscale.domain( [ymax, ymin] );
        console.log(ymax)
        console.log(ymin)

        self.render();
    }

    render() {
        let self = this;
  
        self.chart.append('path')
            .attr('d', self.area(self.data))
            .attr('stroke', 'red')
            .attr('fill', 'pink');
            

        self.xaxis_group
            .call( self.xaxis );
        self.yaxis_group
            .call( self.yaxis );
    }
}
