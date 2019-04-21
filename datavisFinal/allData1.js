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
    
//Draw a background rectangle for map

    
  Promise.all([
    	d3.csv('data.csv'),
    	d3.json('ca_simplified_1.geojson')
    ])
    .then(([csvData, geoJSONdata]) => {
        
        var formattedData = formatData(csvData)
         map(formattedData,geoJSONdata)
    });
    
    function formatData(csvData){
        const zipcodeNumber = {};
            	csvData.forEach(d => {
                zipcodeNumber[d.ZIP] = d.Deaths_By_Stroke;
              });
              return zipcodeNumber
    
    //introduce Asthma_Pctl data    
//        const zipcodeNumberA = {};
//            	csvData.forEach(d => {
//                zipcodeNumberA[d.ZIP] = d.Asthma_Pctl;
//              });
//              return zipcodeNumberA
    }

    
      function map(data,zipcodes){
              var colorScale = d3.scaleLinear().domain([0,45])
              .range(['#E99D3A','#BE3D3A'])
          
          
          
        g.selectAll('path')
            .data(zipcodes.features)
            .enter().append('path')
            .attr('class', "test")//'zipcode')
            .attr('d', pathGenerator)
            .attr("stroke-width", ".05")
            .attr("fill",function(d){
                  var zipcode = d.properties.ZCTA5CE10
                  var strokedeaths = data[zipcode] 
                  //console.log(deaths)
              if(data[zipcode]==undefined){
                  return "grey"
              }
              else{
                  return colorScale(strokedeaths)
              }
          //translate number death to color
            })
          .on("mouseover",function(d){
              var zipcode = d.properties.ZCTA5CE10
              var strokedeaths = data[zipcode]
    //create asthmapctl variable
              var asthmapctl = data[zipcode]
              console.log(strokedeaths)
              console.log(d.properties.ZCTA5CE10)
    //check asthmapctl values
              console.log(asthmapctl)
              d3.select(this)
                  .attr("stroke", "#197EC4")
                  .attr("stroke-width", ".5")
                  .attr("opacity", ".75")
              d3.select("#zipcode")
                   .text(zipcode)              
              d3.select("#moreInfo")
                   .style("left", 900 + "px")
                   .style("top", 100 + "px")			
                   .select("#strokeDeaths")
                   .text( function(d){
                  if(data[zipcode]==undefined){
                      return "Unknown number of"
                  }
                  else{
                      return strokedeaths
                  }
              });
            
              d3.select("#moreInfo").classed("hidden", false);
            
          })
          .on("mouseout", function(d){
              d3.select(this)
                  .attr("stroke",function(d){
                  var zipcode = d.properties.ZCTA5CE10
                  var strokedeaths = data[zipcode] 
                  //console.log(deaths)
                  if(data[zipcode]==undefined){
                      return "grey"
                  }
                  else{
                      return colorScale(strokedeaths)
                  }
                  })
                  .attr("stroke-width", ".05")
                  .attr("opacity", "1")
            d3.select("#tooltip").remove()
            d3.select("#tooltip2").remove();
        })
      }    
    
// Visual Cinnamon Legend: https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
    
    //Append a defs (for definition) element to your SVG
    var defs = svg.append("defs");

    //Append a linearGradient element to the defs and give it a unique id
    var linearGradient = defs.append("linearGradient")
        .attr("id", "linear-gradient");

    //Horizontal gradient
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    //Set the color for the start (0%)
    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#E99D3A"); //low deaths

    //Set the color for the end (100%)
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#BE3D3A"); //high deaths
    
    //Draw a legend background rectangle
    svg.append("rect")
        .attr("width", 220)
        .attr("height", 70)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("transform", "translate(10, 475)")
        .style("fill", "white");

    //Draw the rectangle and fill with gradient
    svg.append("rect")
        .attr("width", 200)
        .attr("height", 20)
        .attr("transform", "translate(20, 500)")
        .style("fill", "url(#linear-gradient)");

    svg.append("text").text("# of Stroke-Induced Deaths")
        .attr("transform", "translate(47.5, 490)")
        .attr("font-family", "palatino")
        .attr("font-size", "12px")
        .attr("fill", "#404040");

    svg.append("text").text("0")
        .attr("transform", "translate(17, 538)")
        .attr("font-size", "12px")
        .attr("fill", "grey");

    svg.append("text").text("45")
        .attr("transform", "translate(212, 538)")
        .attr("font-size", "12px")
        .attr("fill", "grey");   
    


}(d3));