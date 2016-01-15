app.views = function () { 
  var that = {};

  // Takes cmp's rgb array and turns it into a hex string
  var toHexStr = function (rgb) {
    var hex = '', i;
    for (i = 0; i < 3; i += 1) {
      hex += rgb[i].toString(16);
    }
    return hex;
  };

  // Concats pathStr with processed app.cmp parameters to make route
  var cmpToRoute = function (pathStr, cmp) {
    pathStr += cmp.attributes.lib + '/';
    if (cmp.tileX === cmp.tileY) {
      pathStr += cmp.tileX;
    } else {
      pathStr += cmp.tileX + '-';
      pathStr += cmp.tileY;
    }
    if (cmp.opt.bg === 'clear' || cmp.opt.bg === 'random') {
      pathStr += '/' + cmp.opt.bg;
    } else if (typeof cmp.opt.bg !== 'undefined') {
      pathStr += '/' + toHexStr(cmp.opt.bg);
    }
    return pathStr;
  };

  var NavBar = Backbone.View.extend({
    el: '#navtable',
    events: {
      'click #iconify': 'iconify',
    },
    iconify: function () {
      var route = cmpToRoute('a/', app.cmp);
      console.log('inside iconify');
      console.log(route);
      app.router.navigate(route, {trigger: true, replace: true});
    }
  });

  var navBar = new NavBar;
  
  that.navBar = navBar;
  return that;
}();
