d3.csv("https://yuto-yasuda-1999.github.io/InfoVis2021/W10/w10_task01.csv")
    .then( data => {
        
        
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 256,
            margin: {top:50, right:10, bottom:50, left:150}
        };
        
        const org_data = data;
        console.log(org_data)
        const bar_chart = new BarChart( config, data );

        

        d3.select('#reverse')
            .on('click', d => {
                data.reverse();
                bar_chart.update(data);})
        
        d3.select('#random')
            .on('click', d => {
                data.sort(
                    function() {
                        return Math.random() - 0.5;});
                bar_chart.update(data);})

        d3.select('#descend')
        .on('click', d => {
            data.sort(function(first, second){
                if (Number(first.Num) > Number(second.Num)){
                  return 1;
                }else if (Number(first.Num) < Number(second.Num)){
                  return -1;
                }else{
                  return 0;
                }
              });
            
            bar_chart.update(data);})

        d3.select('#ascend')
        .on('click', d => {
            data.sort(function(first, second){
                if (Number(first.Num) > Number(second.Num)){
                  return 1;
                }else if (Number(first.Num) < Number(second.Num)){
                  return -1;
                }else{
                  return 0;
                }
              });
            data.reverse();
            bar_chart.update(data);})
    
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
            .text("Keep Dogs")
            .attr('stroke', 'green')
            .style("font-size", 30);

        //Xlabel
        self.svg.append("text")
            .attr("text-anchor", "end")
            .attr("x", (self.config.width-self.config.margin.left)/2 + 1.5*self.config.margin.left  )
            .attr("y", self.config.height )
            .text("Number of breeders")
            .style("font-size", 20);
        
        //Ylabel
        self.svg.append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y",  self.config.margin.left /4)
            .attr("x", (-self.config.height + self.config.margin.bottom + self.config.margin.top)/2 - self.config.margin.top)
            .text("Dog")
            .style("font-size", 20);

        self.xscale = d3.scaleLinear()
            .domain([0, d3.max(self.data, d => Number(d.Num))])
            .range( [1, self.inner_width] );

        self.yscale = d3.scaleBand()
            .domain(self.data.map(d => d.Dog))
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
        
        self.render(self.data)

        
            
        
    }

    update() {
        let self = this;

        const xmax = d3.max( self.data, d => Number(d.Num) );
        //const xmin = d3.min( self.data, d => Number(d.Num) );
        self.xscale.domain( [0, xmax] );
        //console.log(xmax)
        //console.log(xmin)
        
        self.yscale.domain( self.data.map(d => d.Dog));
        //console.log(self.data.map(d => d.Dog))

        self.render()
    }

    render() {
        let self = this;

        
        //console.log(self.data)
        self.chart.selectAll("rect")
            .data(self.data)
            .join("rect")
            .transition().duration(1000)
            .attr("x", 0)
            .attr("y", d => self.yscale(d.Dog))
            .attr("width", d => self.xscale(d.Num))
            .attr("height",  self.yscale.bandwidth())
            .attr("fill", d => d.Color);


        self.xaxis_group
            .call( self.xaxis );
        self.yaxis_group
            .call( self.yaxis );
    }
}
