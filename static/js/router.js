// Router for the app
app.router = function () {
  var R = Backbone.Router.extend({
    routes: {
      'm/:lib/:sz(/:bg)': 'mosaic'
    }
  });
  
  var r = new R;
  
  //TODO dont make router available until app.cmp initializes (after image load)
  r.on('route:mosaic', function(lib, sz, bg) {
    console.log('hit mosaic route');
    app.cmp.attributes.lib = lib;
    app.cmp.tileX = sz;
    app.cmp.tileY = sz;
    //TODO parse color rr-gg-bb format bg
    if (bg !== null) {
      app.cmp.opt.bg = bg;
    } else {
      app.cmp.opt.bg = undefined;
    }
    app.pmpm.makeMosaic(app.cmp);
  });
  
  Backbone.history.start();
  
  return r;
}();
