function FilterReset(selector){
  this.htmlElement = $('#' + selector);
  this.bind = function(){
    var that = this;
    this.htmlElement.click(function(event){
      event.preventDefault();
      _.each(that.filters, function(filter){
        filter.reset()
      });
      that.updatable.showAll();
    });
    return this;
  }
  this.setUpdatable = function(updatable){
    this.updatable = updatable;
    return this;
  }
  this.setFilters = function(filters){
    this.filters = filters;
    return this;
  }
  this.bind();
}
