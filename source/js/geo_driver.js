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
    /*distance = google.maps.geometry.spherical.computeDistanceBetween(this.originAddress, this.destinationAddress);*/
    this.directionsService.route(request, function(result, status) {
      if (status == google.maps.DirectionsStatus.OK) {
        that.directionsDisplay.setDirections(result);
      }
    });
  };
}
