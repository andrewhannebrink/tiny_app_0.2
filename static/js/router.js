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

  //
  var updateCMP = function (lib, sz, bg) {
    app.cmp.attributes.lib = lib; 
    app.cmp.tileX = sz; 
    app.cmp.tileY = sz; 
    if (app.cmp.opt.bg === 'random' || app.cmp.opt === 'clear') {
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
