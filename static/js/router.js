// Router for the app
app.router = function () {
  var R = Backbone.Router.extend({
    routes: {
      '': 'home',
      'm/:lib/:sz(/:bg)': 'changeCMP',
      'a/:lib/:sz(/:bg)': 'applyCMP',
      '*anything': 'goHome'
    }
  });

  // Converts hex string from router and returns an rgb array
  var hexToRgb = function (hex) {
    var r = parseInt(hex.slice(0, 2), 16);
    var g = parseInt(hex.slice(2, 4), 16);
    var b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  };

  //TODO fix so that app.cmp.attributes.lib doesnt get assigned a value while app.cmp.attributes is still undefined (usually only on initial page load
  var updateCMP = function (lib, sz, bg) {
    app.cmp.attributes.lib = lib; 
    sz = sz.split('-');
    if (sz.length === 1) {
      app.cmp.tileX = sz[0]; 
      app.cmp.tileY = sz[0]; 
    } else {
      app.cmp.tileX = sz[0]; 
      app.cmp.tileY = sz[1]; 
    }
    if (bg === 'random' || bg === 'clear') {
      app.cmp.opt.bg = bg;
    } else if (bg !== null) {
      app.cmp.opt.bg = hexToRgb(bg);
    } else {
      app.cmp.opt.bg = undefined;
    }
  };
  
  var r = new R;
  
  //TODO dont make router available until app.cmp initializes (after image load)
  r.on('route:changeCMP', function(lib, sz, bg) {
    console.log('hit changeCMP route');
    updateCMP(lib, sz, bg);
  });

  r.on('route:applyCMP', function(lib, sz, bg) {
    console.log('hit applyCMP route');
    updateCMP(lib, sz, bg);
    app.pmpm.makeMosaic(app.cmp);
  });

  r.on('route:home', function () {
    console.log('now home');
  });

  r.on('route:goHome', function () {
    console.log('go home');
    r.navigate('', {trigger: true});
  });
  
  Backbone.history.start();
  
  return r;
}();
