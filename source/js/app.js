function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

function GeoLocalizator() {
  this.currentPosition = function(callback){
    var that = this;
    this.callback = callback;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function(position){
          var newCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, {timeout: 5000});
          that.callback(newCenter);
        }, function(){
          that.errorHandler();
        }
      );
    }
  };
  this.errorHandler = function(msg){
  };
}

function FusionProxy(fusion_id){
  this.fusion_id = fusion_id;
  this.getData = function(callback){
    var that = this;
    ft2json.query('SELECT * FROM ' + this.fusion_id, function(results){
      callback(that.formatter(results));
    });
  };
  this.formatter = function(results){
    var that = this;
    this.data = _.map(results.data, function(result){
      var lat = result.geo.split(", ")[0];
      var lng = result.geo.split(", ")[1];
      return {
        name:              result["ccd"],
        address:           result["geo"],
        city:              result["nom_prov"],
        icon:              'icons/glyphicons_290_skull.png',
        latLng:            new google.maps.LatLng(lat, lng),
        latitude:          lat,
        longitude:         lng
      };
    });
    return this.data;
  };
  this.iconSelector = function(organization){
    if (organization["Servicio 1"].length > 0 && organization["Servicio 2"].length > 0){
      return "img/expert.png";
    } else if (organization["Servicio 1"] == "Patrocinio jurídico"){
      return "img/court.png";
    } else if (organization["Servicio 1"] =="Asesoramiento"){
      return "img/group.png";
    } else if (organization["Servicio 1"] == "Atención psicológica"){
      return "img/communitycentre.png";
    } else {
      return "img/expert.png";
    }
  };
}

$(document).ready(function(){
  var fusion_table_id = $("#fusion").data("fusion");
  var fusionProxy = new FusionProxy(fusion_table_id);
  fusionProxy.getData(function(ccds){
    $("#debug").html(ccds);
  });
});
