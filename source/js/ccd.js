function ccd(){
  var fusion_table_id = $("#fusion").data("fusion");
  var apiKey = $("#fusion").data("api");
  var mapper = new Mapper("map");
  var fusionProxy = new FusionProxy(fusion_table_id, apiKey);
  var geoDriver = new GeoDriver(mapper);
  var geoLocalizator = new GeoLocalizator(geoDriver);
  var statesFilter = new Filter('selectState', 'state');
  var buildingFilter = new Filter('selectBuilding', 'ccdType');
  var filterReset = new FilterReset('reset');

  mapper.init();
  fusionProxy.getData(function(ccds){
    mapper.addCCDs(ccds).drawCCDs();
    statesFilter.loadData(ccds).render().bind().setUpdatable(mapper);
    buildingFilter.loadData(ccds).render().bind().setUpdatable(mapper);
  });
  filterReset.setUpdatable(mapper).setFilters([statesFilter, buildingFilter]);

  $('#closestCCD').click(function(event){
    event.preventDefault();
    geoLocalizator.currentPosition(function(currentPosition){
      mapper.centerMap(currentPosition);
      mapper.addMarker(currentPosition, "Ud. está aquí.");
      fusionProxy.getClosest(currentPosition, function(result){
        if(result.length > 0){
          geoDriver.setDestinationAddress(result[0].geo);
        } else {
          alert('No hemos podido encontrar el CCD más cercano a tu ubicación.')
        }
      });
    });
  });
}
