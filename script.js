const map = L.map('map').setView([1.3521, 103.8198], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

d3.json('https://raw.githubusercontent.com/ZHOURUOMIAO/HCDIV-4/main/sgmap.json').then(function(data) {
    L.geoJSON(data, {
        style: function (feature) {
            let population = getPopulation(feature.properties.name);
            return {
                color: getColor(population),
                weight: 1,
                opacity: 1,
                fillOpacity: 0.7
            };
        },
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Region: " + feature.properties.name + "<br>Population: " + getPopulation(feature.properties.name));
        }
    }).addTo(map);
});

function getPopulation(region) {
    const populationData = {
        "Central": 120000, 
        "East": 150000,
        "North": 110000,
        "West": 140000
    };
    return populationData[region] || 0;
}

function getColor(population) {
    return population > 150000 ? '#800026' :
           population > 120000 ? '#BD0026' :
           population > 100000 ? '#E31A1C' :
           '#FFEDA0';
}
