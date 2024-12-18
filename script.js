<script>
let width = 1000, height = 600;

let svg = d3.select("svg")
    .attr("viewBox", "0 0 " + width + " " + height)

// Load external data and boot
Promise.all([d3.json("sgmap.json"), d3.csv("population2023.csv")]).then(data => {

let mapData = data[0].features;
let popData = data[1];

// Merge pop data with map data
mapData.forEach(d => {
  let subzone = popData.find(e => e.Subzone.toUpperCase() == d.properties.Name);
  d.popdata = (subzone != undefined) ? parseInt(subzone.Population) : 0;
})

console.log(mapData);

// Color scale based on population
let colorScale = d3.scaleSequential(d3.interpolateGreens)
    .domain([0, d3.max(mapData, d => d.popdata)]);

// Map and projection
let projection = d3.geoMercator()
    .center([103.851959, 1.290270])
    .fitExtent([[20, 20], [980, 580]], data[0]);

let geopath = d3.geoPath().projection(projection);

svg.append("g")
    .attr("id", "districts")
    .selectAll("path")
    .data(mapData)
    .enter()
    .append("path")
    .attr("d", geopath)
    .attr("stroke", "black")
    .attr("fill", d => colorScale(d.popdata)); // Apply color based on population
})

</script>
