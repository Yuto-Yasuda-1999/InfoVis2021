d3.csv("https://yuto-yasuda-1999.github.io/InfoVis2021/W04/w04_task2.csv")
    .then( data => {
        
        
        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:50, right:10, bottom:50, left:150}
        };

        const pie_chart = new PieChart( config, data );
        pie_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class PieChart {

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
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.width/2}, ${self.config.height/2})`);

        self.radius = Math.min( self.config.width, self.config.height ) / 2;

        self.pie = d3.pie()
            .value( d => Number(d.Num) );
        
      
        self.arc = d3.arc()
            .innerRadius(self.radius/2)
            .outerRadius(self.radius);   
        
        
        
    }

    update() {
        let self = this;


        self.render();
    }

    render() {
        let self = this;

        //詰まったこところメモ
        //function(d)ではdata()でしているデータ限定になる
        //なのでcolorとかをdata.Colorでしても無理で
        //新しくできたself.pie(self.data)の要素のdataの要素のcolorという風にアクセスする

        console.log(self.pie(self.data))
        self.svg.selectAll("pie")
            .data(self.pie(self.data))
            .enter()
            .append("path")
            .attr("d", self.arc)
            .attr('fill', d => d.data.Color)
            .attr('stroke', 'white')
            .style('stroke-width','2px');
            
        self.svg.selectAll("text")
            .data(self.pie(self.data))
            .enter()
            .append("text")
            .attr("transform", function(d){
              return "translate(" + self.arc.centroid(d) + ")";})
            .text(function(d){ return String(d.data.Dog)})
            .style("text-anchor", "middle")
            .style("font-size", 15)
            


    }
}
