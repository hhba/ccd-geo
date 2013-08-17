function Filter(selector, filter){
  this.afterUpdate = undefined;
  this.data = [];
  this.htmlElement = $("#" + selector);
  this.filter = filter;
  this.template = _.template($("#optionsSelect").html());
  this.loadData = function(ccds){
    this.data = _.uniq(_.map(ccds, function(ccd){
      return ccd[filter];
    })).sort();
    return this;
  }
  this.render = function(){
    this.htmlElement.html(this.template({options: this.data}));
    return this;
  }
  this.setUpdatable = function(updatable){
    this.updatable = updatable;
  }
  this.update = function(value){
    if(value === 'Todos') {
      this.updatable.showAll();
      this.updatable.reset();
    } else {
      this.updatable.hideAll();
      this.updatable.show({
        filter: this.filter,
        value: value
      });
    }
    if(this.afterUpdate){
      this.afterUpdate(value);
    }
    return this;
  }
  this.bind = function(){
    var that = this;
    this.htmlElement.change(function(event){
      event.preventDefault();
      that.update($(this).val());
    });
    return this;
  }
  this.reset = function(){
    this.htmlElement.val('TODOS');
    return this;
  }
}
