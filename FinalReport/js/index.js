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
var projectionOption = d3.geo.mercator()
	.center([137, 35])				// 中心の座標を指定
	.scale(1800)					// スケール（ズーム）の指定
	.translate([width  / 2, height  / 2]); // 移動する

var projection = d3.geo.path().projection(projectionOption);

// 色の範囲を指定
var color = d3.scale.quantize()
    //.range(["rgb(51,51,255)","rgb(51,153,255)","rgb(51,255,255)","rgb(51,255,153)","rgb(51,255,51)","rgb(153,255,51)","rgb(255,255,51)"]);
    .range(["rgb(255,255,51)","rgb(153,255,51)","rgb(51,255,51)","rgb(51,255,153)","rgb(51,255,255)","rgb(51,153,255)","rgb(51,51,255)"]);


// 初期表示
draw('2020');

// 描画用関数
function draw(str) {
    $loading.style('display', 'block');
    // CSVデータ取得
    // "/js" + str + ".csv"
    var getCSV = d3.dsv(',', 'text/csv; charset=shift_jis');
    getCSV( "https://yuto-yasuda-1999.github.io/InfoVis2021/FinalReport/"+str+".csv", function (data){
        // CSVのデータから最小値と最大値を取得（色の定義域）
        //console.log(data)
        color.domain([
            d3.min(data, function (d) {
                return 950;
            }),
            d3.max(data, function (d) {
                return 3500;
            })
        ]);
        // JSONデータ取得
        d3.json("https://yuto-yasuda-1999.github.io/InfoVis2021/FinalReport/js/japan.json", function (jpn) {
            // JSONの座標データとCSVデータを連携
            for (var i = 0; i < data.length; i++) {
                var dataState = data[i].state;
                var dataValue = parseFloat(data[i].value);
                for (var j = 0; j < jpn.features.length; j++) {
                    var jsonState = jpn.features[j].properties.name_local;
                    console.log(jsonState)
                    if (dataState == jsonState) {
                        jpn.features[j].properties.value = dataValue;
                        console.log(dataState)
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
                .duration(700)
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
