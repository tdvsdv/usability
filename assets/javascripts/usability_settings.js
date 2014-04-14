var RMPlus = (function(my){
  return my;
})(RMPlus || {});

RMPlus.Utils = (function(my){
  var my = my || {};

  // function checks existence of the property in the RMPlus namespace recursively
  my.exists = function(prop) {
    obj = RMPlus;
    var parts = prop.split('.');
    for(var i = 0, l = parts.length; i < l; i++) {
      var part = parts[i];
      if(obj !== null && typeof obj === "object" && part in obj) {
          obj = obj[part];
      }
      else {
          return false;
      }
    }
    return true;
  }

  return my;
})(RMPlus.Utils || {});