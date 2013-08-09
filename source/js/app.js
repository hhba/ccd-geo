function isBlank(str) {
  return (!str || /^\s*$/.test(str));
}

$(document).ready(function(){
  if($('#fusion').length){
    ccd();
  }
});
