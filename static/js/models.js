app.models = function () {
  var that = {};

  // Model for mosaic parameters
  var MosaicParams = Backbone.Model.extend({
    // Resets mosaicParams, called when new lib is loaded
    initialize: function (attributes) {
      if (typeof attributes.tileSz === 'undefined') {
        this.attributes.tileSz = 16;
      }
      //TODO get context somehow else (pass as param maybe?)
      var canv = document.getElementById('canvas');
      var canvCtx = canv.getContext('2d');
      this.w = canvCtx.canvas.width;
      this.h = canvCtx.canvas.height;
      this.context = canvCtx;
      this.scale = 1;
      this.skip = 5;
      this.attributes.tileX = this.attributes.tileSz;
      this.attributes.tileY = this.attributes.tileSz;
      this.attributes.lib = attributes.lib;
      this.attributes.bg = undefined;
    }
  });

  that.MosaicParams = MosaicParams;
  return that;
}();
