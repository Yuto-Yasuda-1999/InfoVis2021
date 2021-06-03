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
    .range(["rgb(191,223,255)", "rgb(153,204,255)", "rgb(115,185,253)", "rgb(77,166,255)", "rgb(38,147,255)", "rgb(0,128,255)", "rgb(0,109,217)", "rgb(0,89,178)", "rgb(0,70,140)", "rgb(0,51,102)"]);

// 初期表示
draw('mikan');

// 描画用関数
function draw(str) {
    $loading.style('display', 'block');
    // CSVデータ取得
    // "/js" + str + ".csv"
    var getCSV = d3.dsv(',', 'text/csv; charset=shift_jis');
    getCSV( "https://yuto-yasuda-1999.github.io/InfoVis2021/FinalReport/"+str+".csv", function (data){
        // CSVのデータから最小値と最大値を取得（色の定義域）
        console.log(data)
        color.domain([
            d3.min(data, function (d) {
                return Number(d.value);
            }),
            d3.max(data, function (d) {
                return Number(d.value);
            })
        ]);
        // JSONデータ取得
        d3.json("https://yuto-yasuda-1999.github.io/InfoVis2021/FinalReport/js/japan.topojson", function (jpn) {
            // JSONの座標データとCSVデータを連携
            for (var i = 0; i < data.length; i++) {
                var dataState = data[i].state;
                var dataValue = parseFloat(data[i].value);
                for (var j = 0; j < jpn.features.length; j++) {
                    var jsonState = jpn.features[j].properties.name_local;
                    if (dataState == jsonState) {
                        jpn.features[j].properties.value = dataValue;
                        console.log(dataState)
                        break;
                    }
                }
            }

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
                    .style("fill", '#FFF4D5')
                    .on("mouseover", function (d) {
                    	if (d.properties.value) {
	                        return $tooltip
	                            .style("visibility", "visible")
	                            .text(d.properties.name_local + "の出荷量：約" + d.properties.value + "トン");
                    	} else {
	                        return $tooltip
	                            .style("visibility", "visible")
	                            .text(d.properties.name_local + "の出荷量：データなし");
                    	}
                    })
                    .on("mousemove", function (d) {
                        return $tooltip
                            .style("top", (event.pageY - 20) + "px")
                            .style("left", (event.pageX + 10) + "px");
                    })
                    .on("mouseout", function (d) {
                        return $tooltip
                            .style("visibility", "hidden");
                    });
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
