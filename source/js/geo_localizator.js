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
  this.getLatLng = function(city, success, error) {
    this.geocoder.geocode({'address': city + ', Argentina' }, function(results, status){
      if (status == google.maps.GeocoderStatus.OK) {
        if (success !== undefined ) success(results);
      } else {
        if (error !== undefined ) error(status);
      }
    })
  };
  this.errorHandler = function(msg){
  };
}
