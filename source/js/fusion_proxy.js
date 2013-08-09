function FusionProxy(fusion_id, apiKey){
  this.fusion_id = fusion_id;
  this.apiKey = apiKey;
  this.getClosest = function(location, callback){
    var lat = location.lat();
    var lng = location.lng();
    ftToJSON(
      'SELECT * FROM ' + this.fusion_id + ' ORDER BY ST_DISTANCE(geoposta, LATLNG(' + lat + ', ' + lng + ')) LIMIT 1',
      this.apiKey,
      function(result){
        callback(result);
      }
    );
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
        icon:      that.iconSelector(result),
        latLng:    new google.maps.LatLng(lat, lng),
        latitude:  lat,
        longitude: lng
      };
    });
    return this.data;
  };
  this.iconSelector = function(ccd){
    var iconName,
        iconNames = _.keys(gmIcons),
        institution = ccd['tipo_estab_ccd']; // I hate myself to call institution a place where people got tortured
    iconName = _.find(iconNames, function(iconName){
      return gmIcons[iconName].regExp.test(institution);
    });

    return gmIcons[iconName].icon;
  };
}
