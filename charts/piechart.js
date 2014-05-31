//Takes as input collection of items [data]. Each item has two values [x] and [y].
function d3pieChart(data, element,options) {
    var el = getElementAndCheckData(element, data);
    if (el == null)
        return;

    var color;
    if (options.colors != null) {
        color = options.colors;
    } else {
        color = d3.scale.category20();
        var keys = data.map(function (item) { return item.x; });
        color.domain(keys);
    }
   

    var width = options.width / 2;
    var height = options.height;
    var outerRadius = Math.min(width, height) / 2 - 3,
    innerRadius = outerRadius * .3,
    donut = d3.layout.pie(),
    arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);
    donut.value(function (d) { return d.y; });
    var max = d3.sum(data, function (item) { return item.y; });
    showStandardLegend(el, data, function (i) { return i.x; }, color, options.legend, height, function (i) {
        if (options.unitTransform != null)
            return options.unitTransform(i.y);
        return i.y;
    });
    var vis = el.append("svg")
      .data([data])
      .attr("width", width)
      .attr("height", height);

    var arcs = vis.selectAll("g.arc")
        .data(donut)
      .enter().append("g")
        .attr("class", "arc")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    arcs.append("path")
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.x); })
        .style("stroke-width", 2)
        .style("stroke", "none")
        .on("mouseover", arcMouseOver)
        .on("mouseout", arcMouseOut)
        .style("cursor", "pointer")
        .style("opacity",0.7)
        .each(function(d) { 
            d.percentage = d.data.y / max;
            if (options.unitTransform != null) {
                d.formatted = options.unitTransform(d.data.y);
            }
        });
}

function arcMouseOver(d) {
    d3.select(this).style("stroke", 'black');
    d3.select(this).style("opacity", 1);
    var info = {};
    var value = d.formatted + " (" + (d.percentage * 100).toFixed(1) + "%)";
    info[d.data.x] = value;
    showTooltip(info);
}

function arcMouseOut() {
    d3.select(this).style("stroke", 'none');
    d3.select(this).style("opacity", 0.7);
    hideTooltip();
}
