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
    return this;
  };
  this.drawCCDs = function(){
    var that = this;
    _.each(this.mapCCDs, function(mapCCD){
      mapCCD.drawOn(that.map);
    });
    return this;
  };
  this.show = function(option){
    _.each(this.mapCCDs, function(mapCCD){
      if(mapCCD[option.filter] == option.value){
        mapCCD.show();
      }
    });
  };
  this.hideAll = function(){
    _.each(this.mapCCDs, function(mapCCD){
      mapCCD.hide();
    });
  };
  this.showAll = function(){
    _.each(this.mapCCDs, function(mapCCD){
      mapCCD.show();
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
