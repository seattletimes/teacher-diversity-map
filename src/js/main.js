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

var overallLegend = require("./_overallLegend.html");
ich.addTemplate("overallLegend", overallLegend);

var dataAll = require("./allDistrict.geo.json");
var dataAsian = require("./asian.geo.json");
var dataBlack = require("./black.geo.json");
var dataLatino = require("./latino.geo.json");
var dataMulti = require("./multi.geo.json");
var dataNative = require("./native.geo.json");
var dataPi = require("./pi.geo.json");
var dataWhite = require("./white.geo.json");
var data = dataAll;

// var raceOn = tab;

var commafy = s => (s * 1).toLocaleString().replace(/\.0+$/, "");

data.features.forEach(function(f) {
	["persoc", "pertoc"].forEach(function(prop) {
		f.properties[prop] = (f.properties[prop] * 100).toFixed(1);
	});
	["totalstudents", "soc", "totalteachers", "toc"].forEach(function(prop) {
		f.properties[prop] = commafy ((f.properties[prop]));
	});
  ["ratio"].forEach(function(prop) {f.properties[prop] =(f.properties[prop] * 1).toFixed(2);
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

// var onEachFeature = function(feature, layer) {
//   layer.bindPopup(ich.popup({
//     // dataAll: dataAll
//     }))
//       layer.on({
//       mouseover: highlightFeature,
//       mouseout: resetHighlight
//       });
// };

var onEachFeature = function(feature, layer) {
  layer.bindPopup(ich.popup(feature.properties))
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

     return value == "-0.2" ? '#a3a3a3' :
        value == "-0.1" ? '#d9d9d9' :
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
      color: '#003531',
      fillOpacity: 0.6
    };
    return s;
  }

  var geojson = L.geoJson(data, {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

 map.scrollWheelZoom.disable();

 document.querySelector(".key").innerHTML = ich.overallLegend();

// var select = document.querySelector('click');
// var para = document.querySelector('p');

Array.prototype.slice.call(document.querySelectorAll('.tab')).forEach(function(tab) {
  tab.addEventListener("click", function() {
    if (document.querySelector(".selected")) document.querySelector(".selected").classList.remove("selected");
    tab.classList.add("selected");
    var race = tab.innerHTML;

    if (race === 'ALL STUDENTS OF COLOR') {
      data = dataAll;
    } else if (race === 'Asian') {
      data = dataAsian;
    } else if (race === 'Black') {
      data = dataBlack;
    } else if (race === 'Latino') {
      data = dataLatino;
    } else if (race === 'Multiracial') {
      data = dataMulti;
    } else if (race === 'Native') {
      data = dataNative;
    } else if (race === 'Pacific Islander') {
      data = dataPi;
    } else if (race === 'White') {
      data = dataWhite;
    }

    data.features.forEach(function(f) {
      ["persoc", "pertoc"].forEach(function(prop) {
        f.properties[prop] = (f.properties[prop] * 100).toFixed(1);
      });
      ["totalstudents", "soc", "totalteachers", "toc"].forEach(function(prop) {
        f.properties[prop] = commafy ((f.properties[prop]));
      });
      ["ratio"].forEach(function(prop) {f.properties[prop] =(f.properties[prop] * 1).toFixed(2);
      });
    });

    map.removeLayer(geojson);
    geojson = L.geoJson(data, {
      style: style,
      onEachFeature: onEachFeature
    }).addTo(map);
  })
});