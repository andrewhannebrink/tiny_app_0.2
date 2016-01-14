(function () {
  var R = Backbone.Router.extend({
  
    routes: {
      'm-:lib/:sz(/:bg)': 'mosaic'
    }
  
  });
  
  var r = new R;
  
  r.on('route:mosaic', function(lib, sz, bg) {
    console.log('hit mosaic route');
    pmpm.cmp.attributes.lib = lib;
    pmpm.cmp.tileX = sz;
    pmpm.cmp.tileY = sz;
    if (bg !== null) {
      pmpm.cmp.opt.bg = bg;
    } else {
      pmpm.cmp.opt.bg = undefined;
    }
    pmpm.makeMosaic(pmpm.cmp);
  });
  
  Backbone.history.start();
})();
