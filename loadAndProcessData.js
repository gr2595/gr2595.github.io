export const loadAndProcessData = () =>
  Promise.all([
      csv('strokeData.csv'),
      json('https://raw.githubusercontent.com/OpenDataDE/State-zip-code-GeoJSON/master/ca_california_zip_codes_geo.min.json'),
    ]).then(([csvData, geoJSONdata]) => {
      const rowByZipCode = csvData.reduce((accumulator, d) => {
        accumulator[d.zipCode] = d.zipCode;
        return accumulator;
      }, {});


      /*const zipcodeNumber = {};
      csvData.forEach(d => {
        zipcodeNumber[d.zipCode] = d.zipCode;
      });
      */

      const zipcodes = geoJSONdata;

      zipcodes.features.forEach(d => {
        Object.assign(d.properties rowByZipCode[d.properties.ZCTA5CE10]);
        );
        
        