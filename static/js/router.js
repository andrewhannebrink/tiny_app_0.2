(function () {
  var R = Backbone.Router.extend({
  
    routes: {
      'm-:lib': 'mosaic'
    }
  
  });
  
  var r = new R;
  
  r.on('route:mosaic', function(lib) {
    console.log('reached mosaic route');
    pmpm.cmp.attributes.lib = lib;
  });
  
  Backbone.history.start();
})();
