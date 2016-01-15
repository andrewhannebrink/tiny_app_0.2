// Script for operating app. uses pmpm.js, which is included in index.html
(function () {
  
  // loads the canvas that will hold the mosaic image
  var loadCanvas = function (dataURL) {
    var w, h;
    //TODO do these two processes with one function
    var context = app.pmpm.retContext('canvas');
    var select = app.pmpm.retContext('select');
    context.canvas.width = window.innerWidth;
    context.canvas.height = window.innerHeight;
    select.canvas.width = window.innerWidth;
    select.canvas.height = window.innerHeight;
    w = context.canvas.width;
    h = context.canvas.height;
  
    // load image from data url
    var imageObj = new Image();
    imageObj.onload = function() {
      app.cmp = new app.models.MosaicParams({lib: 'emoji'});
      context.drawImage(this, 0, 0, w, h);
      app.pmpm.loadSelect(app.cmp, 'emoji', {});
    };
    imageObj.src = dataURL;
  };

  loadCanvas('dawson.jpg');
})(); 
