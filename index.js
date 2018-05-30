//Variables

var map;
var pointcenter = {lat:40.7291, lng:-73.9965}

var districtsBronx = [], districtsBrooklyn = [], districtsManhattan = [], districtsQueens = [], districtsStaten = [];
var distritosPolygon = [];

//Constantes

const URL_VECINDARIOS = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
const URL_DISTRITOS = "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
const URL_HOUSE = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";


$(document).ready(function(){
    var seleccion = $('select').formSelect();
    console.log(seleccion);
  });

function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
  zoom: 10,
  center: pointcenter
  });

  var distritosDibujar = districtsBronx.concat(districtsBrooklyn).concat(districtsStaten).concat(districtsQueens).concat(districtsManhattan);

  var markers = distritosDibujar.map(function(location, i){
    return new google.maps.Marker({
      position: location,
      map: map,
      label: i.toString()
    });
  });

  var markerCluster = new MarkerClusterer(map, markers,
    {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});

/*
  for (var i = 0; i < distritosPolygon.length; i++) {
    var poligono = new google.maps.Polygon({
      paths: distritosPolygon[i],
      fillColor: '#FF0000',
      strokeColor: '#FF0000',
      fillOpacity: 0.35
    })
    poligono.setMap(map)
  }*/

  map.data.loadGeoJson(URL_DISTRITOS);

  map.data.setStyle({
        fillColor: 'blue',
        strokeWeight: 2,
        strokeColor: 'grey'
    });

}

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.sidenav');
    var instances = M.Sidenav.init(elems);
  });

function getDataHome(URL){
    var data = $.get(URL, function(){})

    .done(function(){
        for (var i = 0; i < data.responseJSON.data.length; i++) {

          switch (data.responseJSON.data[i][15]) {
            case "Bronx":
              if (Number(data.responseJSON.data[i][23]) != 0) {
                districtsBronx.push({lat:Number(data.responseJSON.data[i][23]), lng:Number(data.responseJSON.data[i][24])});
              }
              break;
            case "Brooklyn":
            if (Number(data.responseJSON.data[i][23]) != 0) {
              districtsBrooklyn.push({lat:Number(data.responseJSON.data[i][23]), lng:Number(data.responseJSON.data[i][24])});
            }
              break;
            case "Manhattan":
            if (Number(data.responseJSON.data[i][23]) != 0) {
              districtsManhattan.push({lat:Number(data.responseJSON.data[i][23]), lng:Number(data.responseJSON.data[i][24])});
            }
              break;
            case "Queens":
            if (Number(data.responseJSON.data[i][23]) != 0) {
              districtsQueens.push({lat:Number(data.responseJSON.data[i][23]), lng:Number(data.responseJSON.data[i][24])});
            }
              break;
            case "Staten Island":
            if (Number(data.responseJSON.data[i][23]) != 0) {
              districtsStaten.push({lat:Number(data.responseJSON.data[i][23]), lng:Number(data.responseJSON.data[i][24])});
            }
              break;
            default:

          }
        }
    })

    .fail(function(error){
        console.log(error);
    })
}

function getDataDistritos(URL){
  var data = $.get(URL, function(){})

  .done(function(){

    var datos = data.responseText.split(/[\[\],:]+/);

    var leer = false;
    var j = -1;
    for (var i = 0; i < datos.length; i++) {
      if (datos[i] == "\"coordinates\"") {
        leer = true;
        j = j+1;
        distritosPolygon[j] = [];
        continue
      }

      if (datos[i] == "}") {
        leer = false;

        continue
      }

      if (leer) {
        distritosPolygon[j].push({lat:Number(datos[i+1]), lng:Number(datos[i])})
        i = i+1;
      }
    }
    initMap();
  })

  .fail(function(error){
      console.log(error);
  })
}

getDataHome(URL_HOUSE)
getDataDistritos(URL_DISTRITOS);
