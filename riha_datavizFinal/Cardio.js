(function() {
  const chart2 = d3.select('#area2');

  var w = 760;
  var h = 600;

  const projection = d3.geoMercator()
  								   .center([ -120, 37 ])
  								   .translate([  w/2.7, h/2.2 ])
  								   .scale([ w*3.3 ]);

  const pathGenerator = d3.geoPath().projection(projection);

  const g2 = chart2.append('g'); 

  chart2.call(d3.zoom().on('zoom', () => {
    g2.attr('transform', d3.event.transform);
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
        //NEW: this use your code, but make a dictionary with zipcod as key, and all the columns as the value so you only need 1 data dictionary
        const allDataByZip = {};
            	csvData.forEach(d => {
                    allDataByZip[d.ZIP] = d
              });
              //console.log(allDataByZip)
              return allDataByZip
    }

    
      function map(data,zipcodes){
          //console.log(data)
              var colorScale = d3.scaleLinear().domain([0,100])
              .range(['#E99D3A','#89063A'])
          
          
          
        g2.selectAll('path')
            .data(zipcodes.features)
            .enter().append('path')
            .attr('class', "test")//'zipcode')
            .attr('d', pathGenerator)
            .attr("stroke-width", ".05")
            .attr("fill",function(d){
                  var zipcode = d.properties.ZCTA5CE10
                //NEW: now data[zipcode] has all the data columns of that zipcode, so to get stroke death, you can go 1 layer deeper and get "Deaths_By_Stroke" I put this code inside the if else statement                
              if(data[zipcode]==undefined){
                  return "#A9A9A9"
              }
              else{
                //console.log(data[zipcode]["Deaths_By_Stroke"])
                  //var strokedeaths = data[zipcode]["Deaths_By_Stroke"]
                  var cardio = data[zipcode]["Cardiovascular_Disease_Pctl"]
                  //return colorScale(strokedeaths)
                  return colorScale(cardio)
              }
          //translate number death to color
            })
          .on("mouseover",function(d){
              
              //NEW: now the rollover has all the info you need
              
              var zipcode = d.properties.ZCTA5CE10
              var airpollution = data[zipcode]["PM25_Pctl"]
              var Asthma_Pctl = data[zipcode]["Asthma_Pctl"]
              var Cardio_Pctl = data[zipcode]["Cardiovascular_Disease_Pctl"]
              var Stroke_Pctl = data[zipcode]["Stroke_Pctl"]
              var Heart_Disease_Pctl = data[zipcode]["Heart_Disease_Pctl"]
              
              
              d3.select(this)
                  .attr("stroke", "#197EC4")
                  .attr("stroke-width", ".25")
                  .attr("opacity", ".75")
              d3.select("#moreInfo")
                   .style("left", 90 + "px")
                   .style("top", 5750 + "px")
              d3.select("#zipcode")
                   .text(zipcode)
              d3.select("#airPollution")
                   .text(function(d){
                  if(data[zipcode]==undefined){
                      return "Unknown number of"
                  }
                  else{
                      return airpollution 
                  }
              })
              d3.select("#asthmaPctl")
                   .text(function(d){
                  if(data[zipcode]==undefined){
                      return "Unknown number of"
                  }
                  else{
                      return Asthma_Pctl 
                  }
              })
              d3.select("#cardioPctl")
                   .text(function(d){
                  if(data[zipcode]==undefined){
                      return "Unknown number of"
                  }
                  else{
                      return Cardio_Pctl 
                  }
              })
              d3.select("#strokeDeaths")
                   .text(function(d){
                  if(data[zipcode]==undefined){
                      return "Unknown number of"
                  }
                  else{
                      return Stroke_Pctl 
                  }
              })
              d3.select("#heartDisease")
                   .text(function(d){
                  if(data[zipcode]==undefined){
                      return "Unknown number of"
                  }
                  else{
                      return Heart_Disease_Pctl 
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
                  .attr("stroke", "#D3D3D3")
                  .attr("opacity", "1")
            d3.select("#tooltip").remove()
            d3.select("#tooltip2").remove();
        })
      }    
    
// Visual Cinnamon Legend: https://www.visualcinnamon.com/2016/05/smooth-color-legend-d3-svg-gradient.html
    
    //Append a defs (for definition) element to your SVG
    var defs = chart2.append("defs");

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
        .attr("stop-color", "#89063A"); //high deaths
    
    //Draw a legend background rectangle
    chart2.append("rect")
        .attr("width", 220)
        .attr("height", 70)
        .attr("rx", 6)
        .attr("ry", 6)
        .attr("transform", "translate(10, 475)")
        .style("fill", "white");

    //Draw the rectangle and fill with gradient
    chart2.append("rect")
        .attr("width", 200)
        .attr("height", 20)
        .attr("transform", "translate(20, 500)")
        .style("fill", "url(#linear-gradient)");

    chart2.append("text").text("Cardiovascular Disease Percentile")
        .attr("transform", "translate(30.135, 490)")
        .attr("font-family", "palatino")
        .attr("font-size", "12px")
        .attr("fill", "grey");

    chart2.append("text").text("0")
        .attr("transform", "translate(17, 538)")
        .attr("font-size", "12px")
        .attr("fill", "grey");

    chart2.append("text").text("100")
        .attr("transform", "translate(211, 538)")
        .attr("font-size", "12px")
        .attr("fill", "grey");   
})();