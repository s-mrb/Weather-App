
/*          
                      ~~~~~~IMPORTANT~~~~~~

                      --IF YOU ARE ON LOCALHOST THEN DO JUST ONE CHANGE, 
                      WRITE PORT NUMBER BELOW AND IN client/js/weather.js and client/js/index.js

                      IF ON HEROKU THEN JUST COMMENT port_no from client/js/weather.js and client/js/index.js
*/
// var port_no = 3000;

// if doing on heroku
if (process.env.PORT) {
  var port = process.env.PORT;
  var domain = "https://this-weather.herokuapp.com";
}

// else we are on localhost
else {
  var port = port_no;
  var domain = "http://localhost:" + port_no;
}

const moment = require("moment-timezone");

const request = require("request");
const express = require("express");
const config = require("./config/config.js");
const app = express();
const mapbox = require("./api/mapbox.js");
const openweather = require("./api/openweather.js");
const hbs = require("hbs");
const handlers = require("./handlers/handlers.js");
const bodyParser = require("body-parser");
const static_dir = config.get_static_dir_path();
const views_path = config.get_views_path();
const partials_path = config.get_partials_path();

// support json encoded bodies
app.use(bodyParser.json());

// support encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// set handlebars as view engine
app.set("view engine", "hbs");
app.set("views", views_path);

// partials
hbs.registerPartials(partials_path);

// set static files directory
app.use(express.static(static_dir));

// landing page
app.get("", (req, res) => {
  res.render("index");
});

/*
                    submit event in index.js find coordinates and then
                    redirects to this route for processing and api usage
*/
app.get("/search", (req, res) => {
  // index.js and weather.js sent input=lat,lng   as parameter in url.
  var latlng = req.param("input").split(",");
  var lat = latlng[0];
  var lng = latlng[1];

  var location = "";

  // get location name using mapbox
  var url =
    domain + "/search/get_locationName?latitude=" + lat + "&longitude=" + lng;

  request({ url: url, json: true }, function (error, response) {
    if (error) console.log(error);
    else {
      location = response.body;

      // get weather using openweather
      url = domain + "/search/weather?latitude=" + lat + "&longitude=" + lng;

      request({ url: url, json: true }, function (error, response) {
        if (error) console.log(error);
        else {
          // get readable time from unix time
          // var time = response.body.current.dt;
          // time = time * 1000;
          // time = new Date(time);
          // var readable_time = time.toLocaleString();


          var readable_time =  moment
          .unix(response.body.current.dt)
          .tz(response.body.timezone)
          .format("YYYY-MM-DD HH:mm:ss");

          // create day, temperature and description arrays
          var day = [];
          var temp_min = [];
          var temp_max = [];
          var desc = [];
          var icon = [];

          // unix time to day of week conversion
          var weekday = new Array(7);
          weekday[0] = "Sun";
          weekday[1] = "Mon";
          weekday[2] = "Tue";
          weekday[3] = "Wed";
          weekday[4] = "Thu";
          weekday[5] = "Fri";
          weekday[6] = "Sat";

          // icon url making
          var icon_url_a = "http://openweathermap.org/img/wn/";
          var icon_url_b = "@2x.png";

          // fill day, temperature and description arrays
          for (i = 0; i < 8; i++) {
            day[i] = response.body.daily[i].dt * 1000;
            day[i] = new Date(day[i]);

            day[i] = weekday[day[i].getDay()];
            temp_max[i] = response.body.daily[i].temp.max;
            temp_min[i] = response.body.daily[i].temp.min;
            desc[i] = response.body.daily[i].weather[0].description;
            icon[i] =
              icon_url_a + response.body.daily[i].weather[0].icon + icon_url_b;
          }

          // send lat and lng for it is used for map
          res.render("weather", {
            lat: lat,
            lng: lng,
            day: day,
            temp_max: temp_max,
            temp_min: temp_min,
            desc: desc,
            icon: icon,
            time: readable_time,
            location: location,
            data: response.body,
          });
        }
      });
    }
  });
});

// http://localhost:3300/search/find_me?locationName=place
app.get("/search/find_me", (req, res) => {
  mapbox
    .get_coordinates(req.param("locationName"))
    .then((coordinates) => res.send(coordinates));
});

/*
                 api, receive Location Name, returns coordinates
*/

// http://localhost:3100/search/get_coordinates?locationName=place
app.get("/search/get_coordinates", (req, res) => {
  mapbox
    .get_coordinates(req.param("locationName"))
    .then(function (coordinates) {
      if (coordinates === "-1") {
        res.render("index", { location_err: "Please type correct location" });
      } else {
        res.send(coordinates);
      }
    });
});

/*
                api,  receive coordinates, return accurate location Name
*/
// http://localhost:3100/search/get_locationName?latitude=lat&longitude=long
app.get("/search/get_locationName", (req, res) => {
  mapbox
    .get_place_name(req.param("latitude"), req.param("longitude"))
    .then(function (placeName) {
      if (placeName === "-1") {
        res.render("index", { location_err: "Please type correct location" });
      } else {
        res.send(placeName);
      }
    });
});

/*
                api,  receive coordinate, returns weather (one call)
*/
// http://localhost:3100/search/weather?latitude=lat&longitude=long
app.get("/search/weather", (req, res) => {
  const latitide = req.param("latitude");
  const longitude = req.param("longitude");

  openweather
    .get_weather(latitide, longitude)
    .then((weather_data) => res.send(weather_data));
});

/*
                  404
*/
app.get("*", (req, res) => {
  handlers.page_dont_exist(res, req);
});

app.listen(port);
