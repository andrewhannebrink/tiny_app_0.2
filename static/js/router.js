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

  var updateCMP = function (lib, sz, bg) {
    app.cmp.attributes.lib = lib; 
    app.cmp.tileX = sz; 
    app.cmp.tileY = sz; 
    if (bg !== null) {
      app.cmp.opt.bg = bg;
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
