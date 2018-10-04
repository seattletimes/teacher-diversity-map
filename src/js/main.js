//load our custom elements
require("component-leaflet-map");
require("component-responsive-frame");

//get access to Leaflet and the map
var element = document.querySelector("leaflet-map");
var L = element.leaflet;
var map = element.map;

var ich = require("icanhaz");
var templateFile = require("./_popup.html");
ich.addTemplate("popup", templateFile);

var data = require("./allDistrict.geo.json");

var commafy = s => (s * 1).toLocaleString().replace(/\.0+$/, "");

data.features.forEach(function(f) {
	["persoc", "pertoc"].forEach(function(prop) {
		f.properties[prop] = (f.properties[prop] * 100).toFixed(1);
	});
	["totalstudents", "soc", "totalteachers", "toc"].forEach(function(prop) {
		f.properties[prop] = commafy ((f.properties[prop]));
	});
});

var all = "key";

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 3,
        fillOpacity: 1
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popup(feature.properties))
  // layer.on({
  // 	     'mouseover': function(e) {
  //       layer.setStyle({ weight: 2, fillOpacity: .9 });
  //     },
  //     'mouseout': function(e) {
  //       if (focused && focused == layer) { return }
  //       layer.setStyle({ weight: 1, fillOpacity: 0.6 });
  //     }
  //   });
    layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight
    });
};


function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

var getColor = function(d) {
    var value = d[all];
    if (typeof value == "string") {
      value = Number(value.replace(/,/, ""));
    }
    console.log(value)
    if (typeof value != "undefined") {

     return value == "-0.1" ? '#d9d9d9' :
     		value == "0" ? '#fee8c8' :
     		value >= "0.75" ? '#7f0000' :
        value >= "0.5" ? '#d7301f' :
        value >= "0.25" ? '#fc8d59' :
        value >= "0.01" ? '#fdbb84' :
             
             '#f1f2f2' ;
    } else {
      return "gray"
    }
  };

var style = function(feature) {
    var s = {
      fillColor: getColor(feature.properties),
      weight: 1,
      opacity: .5,
      color: '#000',
      fillOpacity: 0.6
    };
    return s;
  }

  var geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

 map.scrollWheelZoom.disable();