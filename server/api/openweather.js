const request = require("request");

// get weather via geographic coordinates
const get_weather = function (
  latitude,
  longitude,
  units = "metric",
  exclude = "minutely",
  appid = global.api_key_ow
) {
  return new Promise(function (resolve, reject) {
    const base_url = "http://api.openweathermap.org/data/2.5/onecall";
    const query = `?lat=${latitude}&lon=${longitude}&exclude=${exclude}&units=${units}&appid=${appid}`;
    const url = base_url + query;
    console.log(url)
    request({ url: url, json: true }, function (error, response, body) {
      if (error) {
        reject(error);
      } else resolve(body);
    });
  });
};

exports.get_weather = get_weather;


