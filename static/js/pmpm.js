// pmpm.js - Photo-Mosaic Photo Module
// Andrew Hannebrink 2015

// TODO implement spec
var pmpm = function (spec) {

  var that = {};
  var libs = {};
  var testSz = 10;

  var test = function() {
    var canv = document.getElementById('canvas');
    var canvCtx = canv.getContext('2d');
    var tileX = testSz; 
    var tileY = testSz; 
    var scale = 1;
    var skip = 5;
    var lib = 'emoji';
    var w = canvCtx.canvas.width;
    var h = canvCtx.canvas.height;
    //TODO take this out of loadSelect and give a button an event listener
    var mosaicParams = { 
      context: canvCtx,
      w: w,
      h: h,
      scale: scale,
      tileX: tileX,
      tileY: tileY,
      lib: lib,
      skip: skip,
      bg: [255, 255, 255]
    };
    testSz -= 2;
    makeMosaic(mosaicParams);
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
      if (xobj.readyState == 4 && xobj.status == "200") {
        // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
        callback(JSON.parse(xobj.responseText));
      }
    };
    xobj.send(null);  
  };

  // that inherits this function
  var crop = function (p) {
    var img = new Image();
    if (p.mode === 'image') {
      img.src = p.path; 
      img.onload = function () {
        var avg, colParams, bgParams, r, g, b, iconObj;
        // add background to image
        if (typeof p.bg !== 'undefined') {
          bgParams = Object.create(p);
          bgParams.mode = 'color';
          if (p.bg === 'random') {
            bgParams.path = randomRGB(p.filters);
            crop(bgParams);
          } else if (p.bg === 'clear') {
            //do nothing
          } else {
            // case where bg is a color or array of colors
            bgParams.path = p.bg;
            crop(bgParams);
          }
        }
        p.context.drawImage(img, p.x, p.y, p.w, p.h);
        // swab option is only used for populating 'select' canvas
        if (p.opt.indexOf('swab') !== -1) {
          avg = getAvgRGB(p.context, 5, p.x, p.y, p.w, p.h);
          colParams = Object.create(p);
          colParams.mode = 'color';
          colParams.path = avg;
          colParams.x += p.w;
          colParams.bg = undefined;
          iconObj = {
            path: p.path,
            avg: avg
          };
          if (typeof p.bg !== 'undefined') {
            iconObj.bg = bgParams.path;  
          }
          libs[p.dir].icons.push(iconObj);
          crop(colParams);
          // if the last icon pushed is the last icon of the whole lib, mark it as complete
          if (libs[p.dir].icons.length >= libs[p.dir].tot) {
            libs[p.dir].complete = true;
            console.log('loaded lib ' + p.dir + ' (' + libs[p.dir].icons.length + ' total images)');
            console.log(JSON.stringify(libs)); // TODO take out stringify from here
            pmpm.test(); //TODO dont run pmpm.test here (THIS IS A TEST)
          }
        }
      };
    } else if (p.mode === 'color') {
      p.context.fillStyle = 'rgb(' + Math.floor(p.path[0]) + ',' + Math.floor(p.path[1]) + ',' + Math.floor(p.path[2]) + ')';
      p.context.fillRect(p.x, p.y, p.w, p.h);
      p.context.save()
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
    var xi, yi, rgba, np, obj, cropParams, x, y; 
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
          opt: [],
          bg: p.bg
        };
        if (typeof obj.bg !== 'undefined') {
          if (typeof p.bg === 'undefined') {
            cropParams.bg = obj.bg;
          }
        }
        crop(cropParams);
      }
    }
  };

  var loadLib = function (context, dir, w, h, iconSz, filters, write) {
    var yPos = 0;
    var xPos = 0;
    var jsonPath = dir + '/' + dir + '.json';
    loadJSON(jsonPath, function (res) {
      var i, img, avg, imgPath, cropImgParams, cropColParams;
      if (res.hasOwnProperty(dir)) {
        // Case where json comes preloaded with each image's avg color
        for (var lib in res) {
          if (res.hasOwnProperty(lib)) {
            libs[lib] = res[lib];
            console.log(libs);
            pmpm.test(); //TODO take pmpm test out of here
          }
        }
        console.log('json loaded with preloaded averages');
      } else {
        // Case where json is just an array of image names - takes longer
        // Add lib to active libs after loaded (switch complete to true)
        libs[dir] = {
          complete: false,
          icons: [],
          tot: res.length
        };
        i = 0;
        while (yPos + iconSz < h) {
          while (xPos + 2*iconSz < w) {
            // prevents 8000/emoji/domain 404 not found error
            if (i >= res.length) {
              yPos = h; 
              break;
            }
            // if lib gets marked as complete
            if (libs[dir].complete === true) {
              yPos = h; 
              break;
            }
            imgPath = dir + '/' + res[i];
            cropImgParams = {
              mode: 'image',
              path: imgPath,
              context: context,
              x: xPos,
              y: yPos,
              w: iconSz,
              h: iconSz,
              opt: ['swab'], //TODO twin matching mode
              dir: dir // used in swab mode to find which lib to push avg rgb values to
            };
            if (filters.indexOf('backgrounds') !== -1) {
              cropImgParams.bg = 'random';
            }
            crop(cropImgParams);
            xPos += 2*iconSz; 
            i += 1;
          }
          yPos += iconSz;
          xPos = 0;
        }
      }
    }); 
  };

  // bind certain methods to "that" and return the durable module
  that.libs = libs;
  that.crop = crop;
  that.getClosest = getClosest;
  that.makeMosaic = makeMosaic;
  that.test = test;
  that.loadLib = loadLib;
  return that;

}();
