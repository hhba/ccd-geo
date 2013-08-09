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
      icon: this.ccd.icon,
      animation: google.maps.Animation.DROP
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
