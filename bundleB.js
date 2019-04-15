(function (d3) {
  'use strict';

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

  Promise.all([
    	d3.csv('strokeData.csv'),
    	d3.json('ca_simplified_1.geojson')
    ]).then(([csvData, geoJSONdata]) => {
    	const zipcodeNumber = csvData.reduce((accumulator, d) => {
      	accumulator[d.zipCode] = d;
        return accumulator;
      }, {});
    
    
    	/*const zipcodeNumber = {};
    	csvData.forEach(d => {
        zipcodeNumber[d.zipCode] = d.zipCode;
      });
      */
    
    	const zipcodes = geoJSONdata;
    	g.selectAll('path')
      	.data(zipcodes.features)
        .enter().append('path')
    			.attr('class', 'zipcode')
        	.attr('d', pathGenerator)
    		.append('title')
    			.text(d => console.log([ zipcodeNumber[d.properties.ZCTA5CE10], d.zipCode]
                            ));
    
    
    

  });

}(d3));