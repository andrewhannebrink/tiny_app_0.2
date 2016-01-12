// Script for operating canvas object. uses pmpm.js, which is included in index.html
(function () {
  var iconSz = 16;

  // short-hand function for getting the context from a canvas id string
  var retContext = function(canvasId) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext('2d');
    return context;
  };

  // loads the canvas that will hold the mosaic image
  var loadCanvas = function (dataURL) {
    var w, h;
    var context = retContext('canvas');
    context.canvas.width  = window.innerWidth;
    context.canvas.height = window.innerHeight;
    w = context.canvas.width;
    h = context.canvas.height;
  
    // load image from data url
    var imageObj = new Image();
    imageObj.onload = function() {
      context.drawImage(this, 0, 0, w, h);
      loadSelect('emoji', {backgrounds: true});
    };
    imageObj.src = dataURL;
  };

  var loadSelect = function(dir, filters) {
    var context = retContext('select');
    pmpm.loadLib(context, dir, iconSz, filters);
  };

  loadCanvas('dawson.jpg');
  //loadSelect('emoji', ['backgrounds']);
  //loadSelect('emoji', [])
})(); 
