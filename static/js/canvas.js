// Script for operating canvas object. uses pmpm.js, which is included in index.html
(function () {
  var screenW = 320;
  var screenH = 568;
  var iconSz = 16;
;

  // short-hand function for getting the context from a canvas id string
  var retContext = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext('2d');
    return context;
  };

  // loads the canvas that will hold the mosaic image
  var loadCanvas = function (dataURL) {
    var context = retContext('canvas');
  
    // load image from data url
    var imageObj = new Image();
    imageObj.onload = function() {
      var w = this.naturalWidth; 
      var h = this.naturalHeight; 
      console.log(w + ' ' + h);
      adjustScreenSz(context, w, h);
      context.canvas.width = w;
      context.canvas.height = h;
      context.drawImage(this, 0, 0, w, h);
    };
    imageObj.src = dataURL;
  };

  var adjustScreenSz = function(context, w, h) {
    context.canvas.width = w;
    context.canvas.height = h;
  };
  

  var loadSelect = function(dir, filters) {
    var screenH = 3500;//TODO adjust for scroll so i dont have to overwrite screenH each time
    var context = retContext('select');
    adjustScreenSz(context, screenW, screenH);
    pmpm.loadLib(context, dir, screenW, screenH, iconSz, filters);
  };

  loadCanvas('dawson.jpg');
  //loadSelect('emoji', ['backgrounds']);
  loadSelect('emoji', []);
})(); 
