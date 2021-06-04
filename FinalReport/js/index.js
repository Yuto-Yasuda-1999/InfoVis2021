var width = 600;
var height = 650;
var init = true;

// 要素選択
var $body = d3.select("body");
var $tooltip = d3.select("#tooltip");
var $loading = d3.select("#loading");
var $item = d3.selectAll("#menu li");

// SVG要素作成
var svg = $body
	.append("svg")
	.attr({
        'width': width,
        'height': height
    });

// 投影法の指定
var projectionOption = d3.geoMercator()
	.center([137, 35])				// 中心の座標を指定
	.scale(1500)					// スケール（ズーム）の指定
	.translate([width  / 2, height  / 2]); // 移動する

var projection = d3.geoPath().projection(projectionOption);

// 色の範囲を指定
var color = d3.scaleQuantize()
     .range(["rgb(255,255,51)","rgb(153,255,51)","rgb(51,255,51)","rgb(51,255,153)","rgb(51,255,255)","rgb(51,153,255)","rgb(51,51,255)"]);


// 初期表示
draw('2020');

// 描画用関数
function draw(str) {
    $loading.style('display', 'block');
    // CSVデータ取得
    d3.csv( "https://yuto-yasuda-1999.github.io/InfoVis2021/FinalReport/"+str+".csv", function (data){
        //地図版画
        color.domain([950,3500]);
        // JSONデータ取得
        d3.json("https://yuto-yasuda-1999.github.io/InfoVis2021/FinalReport/js/ne_10m_admin_1_states_provinces.geo.json", function (jpn) {
            // JSONの座標データとCSVデータを連携
            for (var i = 0; i < data.length; i++) {
                var dataState = data[i].state;
                var dataValue = parseFloat(data[i].value);
                for (var j = 0; j < jpn.features.length; j++) {
                    var jsonState = jpn.features[j].properties.name_ja;
                    if (dataState == jsonState) {
                        jpn.features[j].properties.value = dataValue;
                        break;
                    }
                }
            }
            //console.log(jpn.features)

            // HTMLの要素とJSONデータを連携（初回はPATH要素が無いのでenterセレクションに保管される）
            var map = svg.selectAll("path")
                    .data(jpn.features);

            if (init) {
                map.enter() // enterセレクションに保管
                    .append("path") // PATH要素の不足分を作成
                    .attr({
                        'stroke': '#333',
                        'stroke-width': '0.5',
                        'd': projection
                    })
                    
                init = false;
            }

            map.transition()
                .duration(400)
                .style("fill", function (d) {
                    $loading.style('display', 'none');
                    var value = d.properties.value;
                    if (value) {
                        return color(value);
                    } else {
                        return "#FFF4D5";
                    }
                })
        });
        //berchart版画
        console.log(data)
        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['0 ~ 1000','1000 ~ 2000','2000 ~ 3000','3000 ~ 4000','4000 ~']);
        bar_chart = new BarChart( {
            parent: '#drawing_region_barchart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Amount',
            cscale: color_scale
        }, data );
        bar_chart.update();
    
    });
}

// クリックイベント追加
$item.each( function(d, i) {
    var $this = d3.select(this);
    $this.on("click", function () {
        $item.select("a").classed('on' ,false);
        $this.select("a").classed('on', true);
        draw($this.attr("class"));
    });
});
