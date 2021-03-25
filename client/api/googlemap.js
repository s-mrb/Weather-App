
const apikey = "AIzaSyBs6SimhQJsAdTjaQjwfDsr3cukixnOYNk";
function set(latitide, longitude, zoom){
   return function initMap(){
    const location = new google.maps.Map(document.getElementById("map"),{
        zoom : zoom,
        center : location
    });
    const marker = new google.maps.Marker({
        position : location,
    })

}}

module.exports = {set: set, apikey:apikey}