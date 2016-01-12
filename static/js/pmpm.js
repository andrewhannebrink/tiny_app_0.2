// pmpm.js - Photo-Mosaic Photo Module
// Andrew Hannebrink 2015
/*
This is a durable module for creating photo mosaic images with html canvas.
This durable module follows the functional modular inheritance pattern, as specified by Douglas Crockford's 'JavaScript: The Good Parts' (pg 52 - 55)
*/

// TODO implement spec
var pmpm = function (spec) {

  var that = {};
  var libs = {};
  
  //TODO replace this with a backbone model and move it out of here
  var mosaicParams = {}; 
  var initMosaicParams = function () { 
    var testSz = 24;
    var canv = document.getElementById('canvas');
    var canvCtx = canv.getContext('2d');
    var tileX = testSz; 
    var tileY = testSz; 
    var scale = 1;
    var skip = 5;
    var lib = 'emoji';
    var w = canvCtx.canvas.width;
    var h = canvCtx.canvas.height;
    mosaicParams.context = canvCtx;
    mosaicParams.w = w;
    mosaicParams.h = h;
    mosaicParams.scale = scale;
    mosaicParams.tileX = tileX;
    mosaicParams.tileY = tileY;
    mosaicParams.lib = lib;
    mosaicParams.skip = skip;
    mosaicParams.opt = {
      bg: undefined
    }
  };

  // Reads libs from json and adds them to the 'libs' object
  var libsFromJSON = function (res) {
    for (var lib in res) {
      if (res.hasOwnProperty(lib)) {
        libs[lib] = res[lib];
        console.log(libs);
        initMosaicParams();    
        makeMosaic(mosaicParams); //TODO dont always run makeMosaic() after loading libs from json
      }
    }
    console.log('json loaded with preloaded averages');
  };

  // Populates select canvas and calculates average rgbs
  var populateSelect = function (res, dir, iconSz, filters, write, context) {
    var img, avg, imgPath, cropImgParams;
    var w = context.width;
    var h = context.height;
    var yPos = 0;
    var xPos = 0;
    var i = 0;
    while (yPos + iconSz < h) {
      while (xPos + 2*iconSz < w) {
        // prevents 8000/emoji/domain 404 not found error
        if (i >= res.length) {
          yPos = h; 
          break;
        } else if (libs[dir].complete === true) {
          // if lib gets marked as complete
          yPos = h; 
          break;
        } else {
          imgPath = dir + '/' + res[i];
          cropImgParams = {
            mode: 'image',
            path: imgPath,
            context: context,
            x: xPos,
            y: yPos,
            w: iconSz,
            h: iconSz,
            opt: {
              swab: true
            }, //TODO twin matching mode
            dir: dir // used in swab mode to find which lib to push avg rgb values to
          };
          if (filters.hasOwnProperty('backgrounds')) {
            if (filters.backgrounds === 'random') {
              cropImgParams.opt.bg = 'random';
            }
          }
          crop(cropImgParams);
          xPos += 2*iconSz; 
          i += 1;
        }
      }
      yPos += iconSz;
      xPos = 0;
    }
  };

  // private function for generating random rgb values, with an optional filters array
  var randomRGB = function (filters) {
    // TODO implement filters
    var r, g, b;
    if (typeof filters === 'undefined') {
      r = Math.floor(Math.random()*256);
      g = Math.floor(Math.random()*256);
      b = Math.floor(Math.random()*256);
    }
    return [r, g, b];
  };

  // private function for return avg rgb in a region
  var getAvgRGB = function (context, skip, x, y, w, h) {
    var imgd = context.getImageData(x, y, w, h);
    var pix = imgd.data;
    var i, avg;
    var r = 0;
    var g = 0;
    var b = 0;
    var n = 0;

    for (i = 0; i < pix.length; i += 4) {
      if (pix[i] === 0 && pix[i+1] === 0 && pix[i+2] === 0 && pix[i+3] === 0) {
        r += 255;
        g += 255;
        b += 255;
        n += 1;
      } else {
        r += pix[i]; 
        g += pix[i + 1]; 
        b += pix[i + 2]; 
        n += 1;
      }
    }
    avg = [Math.floor(r/n), Math.floor(g/n), Math.floor(b/n)];
    return avg; 
  };

  //private function for finding the distance (squared) between points in R3
  var distance = function (a, b) {
    var d = Math.pow(a[0]-b[0], 2);
    d += Math.pow(a[1]-b[1], 2);
    d += Math.pow(a[2]-b[2], 2);
    return d;
  };
  
  // this function is from here (http://codepen.io/KryptoniteDove/post/load-json-file-locally-using-pure-javascript) - much thanks
  var loadJSON = function (jsonPath, callback) {   
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', jsonPath, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
      // OK to use '==' here
      if (xobj.readyState == 4 && xobj.status == 200) {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(JSON.parse(xobj.responseText));
      }
    };
    xobj.send(null);  
  };

  // That inherits this function
  var crop = function (p) {
    var img = new Image();
    if (p.mode === 'image') {
      img.src = p.path; 
      img.onload = function () {
        var avg, colParams, bgParams, r, g, b, iconObj;
        // Add background to image
        if (typeof p.opt.bg !== 'undefined') {
          bgParams = Object.create(p);
          bgParams.mode = 'color';
          if (p.opt.bg === 'random') {
            bgParams.path = randomRGB(p.filters);
            crop(bgParams);
          } else if (p.opt.bg === 'clear') {
            // Do nothing
          } else {
            // case where bg is a color or array of colors
            bgParams.path = p.opt.bg;
            crop(bgParams);
          }
        }
        p.context.drawImage(img, p.x, p.y, p.w, p.h);
        // Swab option is only used for populating 'select' canvas
        if (typeof p.opt.swab !== 'undefined') {
          avg = getAvgRGB(p.context, 5, p.x, p.y, p.w, p.h);
          colParams = Object.create(p);
          colParams.mode = 'color';
          colParams.path = avg;
          colParams.x += p.w;
          colParams.opt.bg = undefined;
          iconObj = {
            path: p.path,
            avg: avg
          };
          if (typeof p.opt.bg !== 'undefined') {
            iconObj.opt.bg = bgParams.path;  
          }
          libs[p.dir].icons.push(iconObj);
          crop(colParams);
          // if the last icon pushed is the last icon of the whole lib, mark it as complete
          if (libs[p.dir].icons.length >= libs[p.dir].tot) {
            libs[p.dir].complete = true;
            console.log('loaded lib ' + p.dir + ' (' + libs[p.dir].icons.length + ' total images)');
            console.log(JSON.stringify(libs)); // TODO take out stringify from here
            initMosaicParams();
            makeMosaic(mosaicParams); //TODO dont run makeMosaic everytime after populated 'select' canvas
          }
        }
      };
    } else if (p.mode === 'color') {
      p.context.fillStyle = 'rgb(' + Math.floor(p.path[0]) + ',' + Math.floor(p.path[1]) + ',' + Math.floor(p.path[2]) + ')';
      p.context.fillRect(p.x, p.y, p.w, p.h);
      p.context.save();
    } else {
      throw 'not a valid mode';
    }
  };

  // function for finding closest images and returning details about it, bg param is optional
  var getClosest = function(lib, avg) {
    var closest = {
      path: '',
      dis: 256 * 256 * 256
    };
    var i, d;
    for (i = 0; i < lib.length; i += 1) {
      d = distance(lib[i].avg, avg);
      if (d < closest.dis) {
        closest.path = lib[i].path;
        closest.dis = d;
        closest.bg = lib[i].bg;
      }
    }
    return closest;
  };

  var makeMosaic = function(p) {
    var imgd = p.context.getImageData(0, 0, p.w, p.h);
    var pix = imgd.data;
    var xt = Math.floor(p.w * p.scale);
    var yt = Math.floor(p.h * p.scale);
    var totXImg = Math.floor(xt / p.tileX);
    var totYImg = Math.floor(yt / p.tileY);
    var extraXPix = xt - (totXImg * p.tileX);
    var extraYPix = yt - (totYImg * p.tileY);
    var xBuf = Math.floor(extraXPix / 2); 
    var yBuf = Math.floor(extraYPix / 2); 
    var xi, yi, rgba, np, obj, cropParams, x, y, avg; 
    console.log(yt);
    console.log(extraYPix);
    console.log(totYImg);
    for (yi = 0; yi < totYImg; yi += 1) {
      for (xi = 0; xi < totXImg; xi += 1) {
        x = xBuf + p.tileX * xi;
        y = yBuf + p.tileY * yi;
        avg = getAvgRGB(p.context, 5, x, y, p.tileX, p.tileY);
        obj = getClosest(libs[p.lib].icons, avg);
        //console.log('closest: ' + path);
        cropParams = {
          mode: 'image',
          path: obj.path,
          context: p.context,
          x: xBuf + p.tileX*xi,
          y: yBuf + p.tileY*yi,
          w: p.tileX,
          h: p.tileY,
          opt: {
            bg: p.opt.bg
          },
        };
        if (typeof obj.bg !== 'undefined') {
          if (typeof p.opt.bg === 'undefined') {
            cropParams.opt.bg = obj.bg;
          }
        }
        crop(cropParams);
      }
    }
  };

  var loadLib = function (context, dir, iconSz, filters, write) {
    var jsonPath = dir + '/' + dir + '.json';
    loadJSON(jsonPath, function (res) {
      if (res.hasOwnProperty(dir)) {
        // Case where json comes preloaded with each image's avg color
        libsFromJSON(res);
      } else {
        // Case where json is just an array of image names
        // Add lib to active libs after loaded (switch complete to true)
        libs[dir] = {
          complete: false,
          icons: [],
          tot: res.length
        };
        populateSelect(res, dir, iconSz, filters, write, context);
      }
    }); 
  };

  // Bind certain methods to "that" and return the durable module
  that.libs = libs;
  that.crop = crop;
  that.getClosest = getClosest;
  that.makeMosaic = makeMosaic;
  that.mosaicParams = mosaicParams; //TODO move this to backbone model
  that.loadLib = loadLib;
  return that;

}();
