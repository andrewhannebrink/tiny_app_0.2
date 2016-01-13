// Script for operating canvas object. uses pmpm.js, which is included in index.html
(function () {
  var iconSz = 16;

  // loads the canvas that will hold the mosaic image
  var loadCanvas = function (dataURL) {
    var w, h;
    var context = pmpm.retContext('canvas');
    var select = pmpm.retContext('select');
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    select.canvas.width = window.innerWidth;
    select.canvas.height = window.innerHeight;
    w = context.canvas.width;
    h = context.canvas.height;
  
    // load image from data url
    var imageObj = new Image();
    imageObj.onload = function() {
      context.drawImage(this, 0, 0, w, h);
      pmpm.loadSelect('emoji', {});
    };
    imageObj.src = dataURL;
  };

  loadCanvas('dawson.jpg');
})(); 
