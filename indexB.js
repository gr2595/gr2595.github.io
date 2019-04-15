import { select, json, geoPath, geoMercator, zoom, event  } from 'd3';

  const svg = d3.select('svg');

  var w = 760;
  var h = 600;

  const projection = d3.geoMercator()
  								   .center([ -120, 37 ])
  								   .translate([ w/2, h/2 ])
  								   .scale([ w*3.3 ]);

  const pathGenerator = d3.geoPath().projection(projection);

  const g = svg.append('g'); 

  svg.call(d3.zoom().on('zoom', () => {
    g.attr('transform', d3.event.transform);
  }));

  d3.json('ca_simplified_1.geojson')
  	.then(data => {

    	g.selectAll('path')
      	.data(data.features)
        .enter().append('path')
    			.attr('class', 'zipcode')
    			.attr('d', pathGenerator)
    		.append('title')
    			.text(d => d.properties.ZCTA5CE10);
  });
  