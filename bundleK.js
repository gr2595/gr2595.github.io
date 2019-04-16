(function (d3) {
  'use strict';
//
//import { select, json, geoPath, geoMercator, csv, zoom, event, scaleOrdinal, schemeSpectral  } from 'd3';
    
    
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
    	d3.csv('strokeData_2016.csv'),
    	d3.json('ca_simplified_1.geojson')
    ])
    .then(([csvData, geoJSONdata]) => {
        
        var formattedData = formatData(csvData)
         map(formattedData,geoJSONdata)
    });
    
    function formatData(csvData){
        const zipcodeNumber = {};
            	csvData.forEach(d => {
                zipcodeNumber[d.zipCode] = d.Count;
              });
              return zipcodeNumber
    }

    
      function map(data,zipcodes){
      	g.selectAll('path')
        	.data(zipcodes.features)
          .enter().append('path')
      		.attr('class', 'zipcode')
          	.attr('d', pathGenerator)
          .attr("fill",function(d){
              var zipcode = d.properties.ZCTA5CE10
              var deaths = data[zipcode]
              var colorScale = d3.scaleOrdinal(d3.schemeSpectral)
              colorScale.domain(map(deaths))
              if(data[zipcode]==undefined){
                  console.log("undefined")
                  return "grey"
              }
              else{colorScale(deaths(d))}
              //translate number death to color
          })
          //.on("mouseover",function(d){
          //    var zipcode = d.properties.ZCTA5CE10
          //    var deaths = data[zipcode]
          //    console.log(deaths)
          //    console.log(d.properties.ZCTA5CE10)
          //})
      }
    
    	/*const zipcodeNumber = {};
    	csvData.forEach(d => {
        zipcodeNumber[d.zipCode] = d.zipCode;
      });
      */
    	//const zipcodes = geoJSONdata;
        
    	
    	//.append('title')
        //.text(function(d){
        //    if(zipcodeNumber[d.properties.ZCTA5CE10]==undefined){
        //            console.log(d.properties.ZCTA5CE10)
        //    }
        //    
        //});

}(d3));