
// var port_no = 3000;

// if we have defined port_no then we are on local host

try{
if (port_no){
  var port = port_no;
  var domain = "http://localhost:" + port_no;
}
}
catch(error)
// else on heroku
{
  var domain = "https://this-weather.herokuapp.com";
}



const myForm = document.getElementById("searchbar");
var lat = "";
var lng = "";

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(updateLatLng, showError);
  } else { 
    return "e";
  }
}

function updateLatLng(position) {
  lat = position.coords.latitude;
  lng = position.coords.longitude;

  var input = "";
  input = lat + "," + lng;
  console.log(input);
  var destination = domain + "/search?input="+input;
  console.log(destination)
  location.replace(destination);

}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert("Please allow the access of Geolocation or search for Location not ?.");
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Sorry Location information is unavailable.");
      break;
    case error.TIMEOUT:
      alert("The request to get user location timed out.");
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred. Please try again!");
      break;
  }
}

myForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const search = document.getElementById("search");
  const search_text = search.value.trim();
  // send coordinates to the server when ?   
  if (search_text === "?") 
  { 
    var flag = getLocation();
    if (flag==="e"){
      alert("Geolocation is not supported by your browser!")
      // console.log("Geolocation not supported by your browser.")
    }

  }
  
  // 
  // send place name to the server if not ?, there mapbox api gets coordinates   
  else
  { 

    var input = search_text;
    var url =  domain + "/search/get_coordinates?locationName="+input;
    console.log(url)

    fetch(url).then((response) => response.json()).then(function(response){
      var lat = response.lat;
      var lng = response.lng;
      input = lat + "," +lng;
      var destination =  domain + "/search?input="+input;
      console.log(destination)
      location.replace(destination);
    })

  }

});