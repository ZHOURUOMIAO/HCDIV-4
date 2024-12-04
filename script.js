let width = 1000, height = 600;
let svg = d3.select("svg")
    .attr("viewBox", "0 0 " + width + " " + height);

Promise.all([d3.json("sgmap.json"), d3.csv("population2023.csv")]).then(data => {
    let mapData = data[0].features;
    let popData = data[1];

    mapData.forEach(d => {
        let subzone = popData.find(e => e.Subzone.toUpperCase() == d.properties.Name);
        d.popdata = (subzone != undefined) ? parseInt(subzone.Population) : 0;
    });

    let projection = d3.geoMercator()
        .center([103.851959, 1.290270])
        .fitExtent([[20, 20], [980, 580]], data[0]);

    let geopath = d3.geoPath().projection(projection);

    // Define color scale based on population
    let colorScale = d3.scaleQuantize()
        .domain([0, d3.max(mapData, d => d.popdata)])
        .range(d3.schemeGreens[9]);

    svg.append("g")
        .attr("id", "districts")
        .selectAll("path")
        .data(mapData)
        .enter()
        .append("path")
        .attr("d", geopath)
        .attr("stroke", "black")
        .attr("fill", d => colorScale(d.popdata))
        .on("mouseover", function(event, d) {
            d3.select(this).attr("stroke", "yellow");
        })
        .on("mouseout", function(event, d) {
            d3.select(this).attr("stroke", "black");
        })
        .on("click", function(event, d) {
            svg.selectAll("path").attr("stroke", "black");  // Reset previous clicks
            d3.select(this).attr("stroke", "red");
        });

    // Add legend
    let legend = svg.append("g")
        .attr("transform", "translate(20, 20)");

    legend.selectAll("rect")
        .data(colorScale.range())
        .enter()
        .append("rect")
        .attr("width", 20)
        .attr("height", 20)
        .attr("x", (d, i) => i * 25)
        .attr("fill", d => d);

    legend.selectAll("text")
        .data(colorScale.domain())
        .enter()
        .append("text")
        .attr("x", (d, i) => i * 25)
        .attr("y", 25)
        .text(d => Math.round(d));
});
