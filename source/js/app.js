function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}
function MapCCD(ccd, mapper){
  this.ccd = ccd;
  this.mapper = mapper;
  this.infowindowTemplate = _.template($("#infowindowTemplate").html());
}
MapCCD.prototype.generateMarker = function(map){
  this.marker = new google.maps.Marker({
      position: this.ccd.latLng,
      map: map,
      title: this.ccd.title,
      icon: this.ccd.icon
  });
};
MapCCD.prototype.generateInfowindow = function(map){
  var that = this;
  this.infoWindow = new google.maps.InfoWindow({
    content: this.infowindowTemplate(this.ccd),
    maxWidth: 300
  });
  google.maps.event.addListener(this.marker, 'click', function() {
    if (that.mapper.lastInfoWindow) that.mapper.lastInfoWindow.close();
    that.infoWindow.open(map, that.marker);
    that.mapper.lastInfoWindow = that.infoWindow;
  });
};
MapCCD.prototype.drawOn = function(map){
  this.generateMarker(map);
  this.generateInfowindow(map);
};

function Mapper(selector) {
  this.lastInfoWindow = null;
  this.selector = selector;
  this.mapCCDs = [];
  this.init = function(){
    this.map = new google.maps.Map(document.getElementById(this.selector), {
      center: new google.maps.LatLng(-33.65682940830173, -63.85107421875),
      zoom: 5
    });
    return this.styleMap();
  };
  this.styleMap = function(){
    var style = [
      {
        featureType: 'all',
        elementType: 'all',
        stylers: [
          { saturation: -90 }
        ]
      }
    ];
    var styledMapType = new google.maps.StyledMapType(style, {
      map: this.map,
      name: 'Styled Map'
    });
    this.map.mapTypes.set('map-style', styledMapType);
    this.map.setMapTypeId('map-style');
    return this;
  };
  this.addCCDs = function(ccds){
    var that = this;
    this.mapCCDs = _.map(ccds, function(ccd){
      return new MapCCD(ccd, that);
    });
  };
  this.drawCCDs = function(){
    var that = this;
    _.each(this.mapCCDs, function(mapCCD){
      mapCCD.drawOn(that.map);
    });
  };
  this.addMarker = function(position, text){
    var marker = new google.maps.Marker({
        position: position,
        map: this.map,
        animation: google.maps.Animation.DROP,
        title: text
    });
  };
  this.centerMap = function(location, zoom) {
    zoom = typeof zoom !== 'undefined' ? zoom : 15;
    this.map.setCenter(location);
    this.map.setZoom(zoom);
    return this;
  };
}

function GeoLocalizator(geoDriver) {
  this.geocoder = new google.maps.Geocoder();
  this.geoDriver = geoDriver;
  this.currentAddress;
  this.currentPosition = function(callback){
    var that = this;
    this.callback = callback;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function(position){
          var newCenter = new google.maps.LatLng(position.coords.latitude, position.coords.longitude, {timeout: 5000});
          that.latLng = newCenter;
          that.getAddress();
          that.callback(newCenter);
        }, function(){
          that.errorHandler();
        }
      );
    }
  };
  this.getAddress = function(){
    var that = this;
    this.geocoder.geocode({'latLng': this.latLng}, function(results, status){
      if(status == google.maps.GeocoderStatus.OK){
        that.currentAddress = results[0].formatted_address;
        that.geoDriver.setOriginAddress(that.currentAddress);
      } else {
        that.currentAddress = "";
      }
    });
  };
  this.errorHandler = function(msg){
  };
}

function FusionProxy(fusion_id, apiKey){
  this.fusion_id = fusion_id;
  this.apiKey = apiKey;
  this.getClosest = function(location, callback){
    var lat = location.lat();
    var lng = location.lng();
    ftToJSON('SELECT * FROM ' + this.fusion_id + ' LIMIT 1 ORDER BY ST_DISTANCE(geoposta, LATLNG(' + lat + ', ' + lng + '))', this.apiKey, function(result){
      callback(result);
    });
  };
  this.getData = function(callback){
    var that = this;
    ftToJSON('SELECT * FROM ' + this.fusion_id, this.apiKey, function(results){
      callback(that.formatter(results));
    });
  };
  this.formatter = function(results){
    var that = this;
    this.data = _.map(results, function(result){
      var lat = result.geoposta.split(", ")[0];
      var lng = result.geoposta.split(", ")[1];
      return {
        name:      result["ccd"],
        otherName: result["ccd_otras_denom"],
        address:   result["ubic"],
        city:      result["nom_depto"],
        state:     result["nom_prov"],
        ccdType:   result["tipo_estab_ccd"],
        icon:      'icons/glyphicons_242_google_maps.png',
        latLng:    new google.maps.LatLng(lat, lng),
        latitude:  lat,
        longitude: lng
      };
    });
    return this.data;
  };
  this.iconSelector = function(ccd){
  };
}

function GeoDriver(mapper){
  this.mapper = mapper;
  this.originAddressFlag = false;
  this.destinationAddressFlag = false;
  this.directionsService = new google.maps.DirectionsService();
  this.directionsDisplay = new google.maps.DirectionsRenderer();

  this.setOriginAddress = function(address){
    this.originAddress = address;
    this.originAddressFlag = true;
    if(this.destinationAddressFlag){
      this.drawMap();
    }
  };
  this.setDestinationAddress = function(address){
    this.destinationAddress = address;
    this.destinationAddressFlag = true;
    if(this.originAddressFlag){
      this.drawMap();
    }
  };
  this.drawMap = function(){
    var that = this;
    var request = {
      origin: this.originAddress,
      destination: this.destinationAddress,
      travelMode: google.maps.TravelMode.WALKING,
      unitSystem: google.maps.UnitSystem.METRIC
    };
    this.directionsDisplay.setMap(mapper.map);
    /*distance = google.maps.geometry.spherical.computeDistanceBetween(currentPosition, closestCCD);*/
    this.directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        that.directionsDisplay.setDirections(result);
      }
    });
  };
}

$(document).ready(function(){
  var fusion_table_id = $("#fusion").data("fusion");
  var apiKey = $("#fusion").data("api");
  var mapper = new Mapper("map");
  var fusionProxy = new FusionProxy(fusion_table_id, apiKey);
  var geoDriver = new GeoDriver(mapper);
  var geoLocalizator = new GeoLocalizator(geoDriver);
  mapper.init();
  fusionProxy.getData(function(ccds){
    mapper.addCCDs(ccds);
    mapper.drawCCDs();
  });
  /*geoLocalizator.currentPosition(function(currentPosition){*/
  /*mapper.centerMap(currentPosition);*/
  /*mapper.addMarker(currentPosition, "Ud. está aquí.");*/
  /*fusionProxy.getClosest(currentPosition, function(result){*/
  /*geoDriver.setDestinationAddress(result[0].geo);*/
  /*});*/
  /*});*/
});

