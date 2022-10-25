const urls = [worldDataUrl, energyAccessUrl, lineChartUrl];

Promise.all(urls.map(url => d3.json(url))).then(run);

function run(dataset) {
   worldChoropleth(dataset[0], dataset[1]);
   derivedLineChart(dataset[2]);

};