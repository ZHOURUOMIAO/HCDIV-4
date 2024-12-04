// Set up map
const map = L.map('map').setView([1.3521, 103.8198], 11); // Coordinates for Singapore

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Load GeoJSON map data (sgmap.json)
d3.json('https://raw.githubusercontent.com/ZHOURUOMIAO/HCDIV-4/main/sgmap.json').then(geoData => {
  // Load population data (population2023.csv)
  d3.csv('https://raw.githubusercontent.com/ZHOURUOMIAO/HCDIV-4/main/population2023.csv').then(popData => {
    // Process population data to create a lookup map
    const populationMap = {};
    popData.forEach(d => {
      populationMap[d.Subzone] = +d.Population;  // Subzone as key, population as value
    });

    // Define color scale for population
    const colorScale = d3.scaleLinear()
      .domain([0, d3.max(popData, d => +d.Population)])
      .range(["lightgreen", "darkgreen"]);

    // Style function for GeoJSON features
    function style(feature) {
      const pop = populationMap[feature.properties.name] || 0;
      return {
        fillColor: colorScale(pop),
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: '3',
        fillOpacity: 0.7
      };
    }

    // Add GeoJSON layer to map
    L.geoJSON(geoData, {
      style: style,
      onEachFeature: (feature, layer) => {
        layer.bindPopup(`<h3>${feature.properties.name}</h3><p>Population: ${populationMap[feature.properties.name] || 'N/A'}</p>`);
      }
    }).addTo(map);
  });
});

