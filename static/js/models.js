var models = function () {
  var that = {};

  // Model for mosaic parameters
  var MosaicParams = Backbone.Model.extend({
    // Resets mosaicParams, called when new lib is loaded
    initialize: function (attributes) {
      var tileSz;
      if (typeof attributes.tileSz === 'undefined') {
        tileSz = 16;
      } else {
        tileSz = attributes.tileSz;
      }
      var canv = document.getElementById('canvas');
      var canvCtx = canv.getContext('2d');
      this.w = canvCtx.canvas.width;
      this.h = canvCtx.canvas.height;
      this.context = canvCtx;
      this.scale = 1;
      this.skip = 5;
      this.tileX = tileSz;
      this.tileY = tileSz;
      this.attributes.lib = attributes.lib;
      this.opt = {
        bg: undefined
      };
    }
  });

  that.MosaicParams = MosaicParams;
  return that;
}();
