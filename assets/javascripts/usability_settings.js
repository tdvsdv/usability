// Passing plugin settings from server to client
var RMPlus = (function(my){
  return my;
})(RMPlus || {});

RMPlus.Utils = (function(my){
  var my = my || {};

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

RMPlus.Usability = (function(my){
  var my = my || {};

  my.settings = <%= settings.to_json.html_safe %>;

  return my;
})(RMPlus.Usability || {});