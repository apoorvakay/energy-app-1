const years = ['1990', '1991', '1992', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014'];
var margin = { top: 50, right: 30, bottom: 30, left: 60 }
width = 1000 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var xScale = d3.scaleLinear().domain([parseInt(years[0]), parseInt(years[years.length - 1])]).range([0, width]);
var yScale = d3.scaleLinear().domain([0, 105]).range([height, 0]);

function derivedLineChart(derived_data,) {


    var min = [];
    var max = [];
    var mean = [];

    for (var i = 0; i < derived_data.length; i++) {
        min.push(derived_data[i].min)
        max.push(derived_data[i].max)
        mean.push(derived_data[i].mean)
    }



    var lineChartSvg = d3.select('#lineChartSVG').append('svg');
    lineChartSvg.attr('id', 'lineChart')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);



    lineChartSvg.append("g")
    .attr("transform", "translate("+margin.left+"," + height + ")")
        .call(d3.axisBottom(xScale).ticks(years.length));

    lineChartSvg.append("g")
    .attr("transform", "translate(" + margin.left + ",0)")
        .call(d3.axisLeft(yScale));

    addLine(null, min, "red", null);
    addLine(null, max, "blue", null);
    addLine(null, mean, "green", null);

    lineChartSvg.append("circle").attr("cx", width).attr("cy", 170).attr("r", 4).style("fill", "red")
    lineChartSvg.append("circle").attr("cx", width).attr("cy", 130).attr("r", 4).style("fill", "blue")
    lineChartSvg.append("circle").attr("cx", width).attr("cy", 150).attr("r", 4).style("fill", "green")
    
    lineChartSvg.append("text").attr("x", width+20).attr("y", 170).text("Minimum").style("font-size", "15px").attr("alignment-baseline", "middle")
    lineChartSvg.append("text").attr("x", width+20).attr("y", 130).text("Maximum").style("font-size", "15px").attr("alignment-baseline", "middle")
    lineChartSvg.append("text").attr("x", width+20).attr("y", 150).text("Mean").style("font-size", "15px").attr("alignment-baseline", "middle")


}

function handleZoom(e) {
    console.log(e)
  }
  

function updateLineChart(countryData, energy) {

    addLine(countryData, energy, "purple", "remove")
}

function addLine(country, data, colour, clas) {


    var xScale = d3.scaleLinear().domain([parseInt(years[0]), parseInt(years[years.length - 1])]).range([0, width]);
    var yScale = d3.scaleLinear().domain([0, 105]).range([height, 0]);

    d3.selectAll(".remove").remove()

    d3.select('#lineChart').append("path")
        .datum(data)
        .attr("class", clas)
        .attr("fill", "none")
        .attr("stroke", colour)
        .attr("stroke-width", 1.5)
        .attr("transform", "translate("+ parseInt(margin.left) +",0)")
        .attr("d", d3.line()
            .x(function (d, i) { return xScale(years[i]) })
            .y(function (d, i) { return yScale(d) })
        )

    if(country!=null){
        d3.select('#lineChart').append("circle").attr("cx", width).attr("cy", 190).attr("r", 4).style("fill", colour).attr("class", clas)
        d3.select('#lineChart').append("text").attr("x", width+20).attr("y", 190).text(country).style("font-size", "15px").attr("alignment-baseline", "middle").attr("class", clas)
    }
}