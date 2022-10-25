function worldChoropleth(dataset, energy_access){
    const world = dataset;
    const countries = topojson.feature(world, world.objects.countries);
    const countryColourMap = new Map(energy_access.map(d => [d.CountryName, d]));
    const renameCountries = new Map([
        ["W. Sahara", "Western Sahara"],
        ["United States of America", "United States"],
        ["Dem. Rep. Congo","Congo, Dem. Rep."],
        ["Dominican Rep.","Dominican Republic"],
        ["Russia","Russian Federation"],
        ["Bahamas","Bahamas, The"],
        ["Falkland Is.","Falkland Islands"],
        ["Venezuela","Venezuela, RB"],
        ["CÃ´te d'Ivoire","Cote d'Ivoire"],
        ["Central African Rep.","Central African Republic"],
        ["Congo","Congo, Rep."],
        ["Eq. Guinea","Equatorial Guinea"],
        ["Slovakia","Slovak Republic"],
        ["Brunei","Brunei Darussalam"],
        ["Taiwan","Taiwan, China"],
        ["Solomon Is.","Solomon Islands"],
        ["Syria","Syrian Arab Republic"],
        ["Iran","Iran, Islamic Rep."],
        ["South Korea","Korea, Rep."],
        ["North Korea","Korea, Dem. Rep."],
        ["Laos",""],
        ["Gambia",""],
        ["Czechia","Czech Republic"],
        ["Yemen","Yemen, Rep."],
        ["N. Cyprus","Cyprus"],
        ["Egypt","Egypt, Arab Rep."],
        ["Bosnia and Herz.","Bosnia and Herzegovina"],
        ["Macedonia","Macedonia, FYR"],
        ["S. Sudan","South Sudan"],
      ]);

    const years = ['1990', '1991', '1992', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014'];

    
    var height = '400';
    var width = '1000';

    const projection = d3.geoEquirectangular();
    const path = d3.geoPath(projection);
    
    const svg = d3.select('#choroplethSVG').append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", [0, 0, width, height]);

    svg.append('text').attr('id', 'yeartext').text('Year 1990').style('font-size', '40px').attr("transform", "translate(100,350)");

    svg.call(d3.zoom().on("zoom", function () {
        countryElements.attr("transform", d3.event.transform);
    }));


    svg.append("g")
        .selectAll("path")
        .data(countries.features)
            .enter()
            .append("path")
            .attr('class', 'countryElements')
            .attr('country', function(d) {return d.properties.name})
            .style('stroke-width', 1)
            .style('stroke', 'white')
            .attr('opacity',0.6)
            .attr("d", path);
    
    var countryElements = svg.selectAll('.countryElements');

    d3.select('#scrub').append("input")
				.attr("type", "range")
				.attr("min", 1990)
				.attr("max", 2014)
				.attr("step", "1")
				.attr("id", "year")
				.on("input", function input() {
					var currentYear = document.getElementById("year").value;
                    setCountryColours(currentYear, countryColourMap, countryColour, renameCountries);
                    d3.select('#yeartext').text('Year '+currentYear)
				});

    const countryColour = d3.scaleSequential([0, 100], d3.interpolateCividis);
    setCountryColours(1990, countryColourMap, countryColour, renameCountries);
    countryElements.on("click", function(){
        var countrySelected = d3.select(this).attr('country');
        var engVal = [];
        console.log(countrySelected)
       
        //hotfix
        for(var i in Object.keys(energy_access)){
            var obj = energy_access[i];
            if(obj['CountryName'] == countrySelected){
                for(var year in years)
                     engVal.push(obj['y'+years[year]]);
            }
        }
        updateLineChart(countrySelected, engVal);
    })    

    var x_colourBarContainer = d3.scalePoint()
        .domain([0, 100])
        .range([10, 200]);       


    var defs = svg.append("defs");
    var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    //Set the color for the start (0%)
    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#002051");

    //Set the color for the end (100%)
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#fdea45");

    svg.attr("transform", "translate(0,50)")      
        .call(d3.axisBottom(x_colourBarContainer))
        .attr('id', 'colorBox')
        .attr("x", "600px")
        .attr("y", "50px")
        .style("fill", "url(#linear-gradient)");
}

function setCountryColours(year, countryColourMap, countryColour, renameCountries){
    var yearStr = "y"+ year;
    d3.selectAll('.countryElements')
            .transition()
            .duration(500)
            .on("start", function repeat() {
                d3.active(this)
                .attr("fill",  function() {
                    if(countryColourMap.has(d3.select(this).attr('country'))){
                       if(countryColourMap.get(d3.select(this).attr('country'))[yearStr] != "..")                        
                    
                      return countryColour(countryColourMap.get(d3.select(this).attr('country'))[yearStr]);
                      else 
                        return "gray";
                
                    }
                    else if(renameCountries.has(d3.select(this).attr('country'))){
                            if(countryColourMap.has(renameCountries.get(d3.select(this).attr('country')))){
                                
                        if(countryColourMap.get(renameCountries.get(d3.select(this).attr('country')))[yearStr] != "..") ;
                         return countryColour(countryColourMap.get(renameCountries.get(d3.select(this).attr('country')))[yearStr])}
                         else 
                        return "gray";
                
                     }
                    else 
                        return "gray";
                });
            }
    );
}

