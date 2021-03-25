let request = require("request");



// get coordinates via location name
// returns [latitude, longitude]
const get_coordinates = function (city) {
  return new Promise(function (resolve, reject) {
    const base_url = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
    const query = `${city}.json?limit=1&access_token=${global.api_key_mb}`;
    const url = base_url + query;

    request({ url: url, json: true }, function (error, response) {
      if (error) resolve(error);
      else {
        try{
        const longitude = response.body.features[0].center[0];
        const latitude = response.body.features[0].center[1];
        const coordinates = {lat:latitude, lng:longitude};
        resolve(coordinates);
      }
        catch(catch_error){
          resolve("-1");
        }
        
      }
    });
  });
};


// get place name via coordinates
const get_place_name = function (latitude, longitude) {
  return new Promise(function (resolve, reject) {
    const base_url = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
    const query = `${longitude},${latitude}.json?limit=1&access_token=${global.api_key_mb}`;
    const url = base_url + query;

    request({ url: url, json: true }, function (error, response) {
      if (error) {
        resolve(error);
      } else {
        try{
        const place_name = response.body.features[0].place_name;
        resolve(place_name);
        }
        catch(catch_error){
          resolve("-1");
        }
      }
    });
  });
};

module.exports = {
  get_coordinates: get_coordinates,
  get_place_name: get_place_name,
};
