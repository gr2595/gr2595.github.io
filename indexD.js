import { select, json, geoPath, geoMercator, csv, zoom, event, schemeSpectral  } from 'd3';

import { loadAndProcessData } from 'loadAndProcessData';

const svg = select('svg');

var w = 760;
var h = 600;

const projection = geoMercator()
								   .center([ -120, 37 ])
								   .translate([ w/2, h/2 ])
								   .scale([ w*3.3 ]);

const pathGenerator = geoPath().projection(projection);

const g = svg.append('g');

svg.call(zoom().on('zoom', () => {
  g.attr('transform', event.transform);
}));

const colorScale = scaleOrdinal(schemeSpectral));

const colorValue = d => d.properties.Stroke;

loadAndProcessData().then(zipcodes => {
  
  colorScale
  	.domain(zipcodes.features.map(colorValue))
  	.domain(colorScale.domain().sort());
  
  g.selectAll('path')
    	.data(zipcodes.features)
      .enter().append('path')
  			.attr('class', 'zipcode')
      	.attr('d', pathGenerator)
      	.attr('fill', d => colorScale(colorValue(d))
  		.append('title')
  			.text(d => d.properties.zipCode);
  
  
  

});

//csv('strokeData.csv')
	//.then(data => console.log(data));


//json('https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ca_california_zip_codes_geo.min.json')
	//.then(data => {

