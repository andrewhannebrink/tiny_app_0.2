app.views = function () { 
  var that = {};

  // Takes cmp's rgb array and turns it into a hex string
  var toHexStr = function (rgb) {
    var hex = '', i;
    for (i = 0; i < 3; i += 1) {
      hex += rgb[i].toString(16);
    }
    return hex;
  };

  // Concats pathStr with processed app.cmp parameters to make route
  var cmpToRoute = function (pathStr, cmp) {
    pathStr += cmp.attributes.lib + '/';
    if (cmp.tileX === cmp.tileY) {
      pathStr += cmp.tileX;
    } else {
      pathStr += cmp.tileX + '-';
      pathStr += cmp.tileY;
    }
    if (cmp.opt.bg === 'clear' || cmp.opt.bg === 'random') {
      pathStr += '/' + cmp.opt.bg;
    } else if (typeof cmp.opt.bg !== 'undefined') {
      pathStr += '/' + toHexStr(cmp.opt.bg);
    }
    return pathStr;
  };

  // Populates subnav bar with element from template.html (specified by id parameter)
  var populateSubNav = function (id) {
    $('#templates').load('template.html #' + id, function () {
      var measurementsMenu = document.getElementById(id).innerHTML;
      $("#subnav").html(measurementsMenu);
    });
  };

  // Only control is clicking screen to hide subnav bar
  var CanvasView = Backbone.View.extend({
    el: '#canvasWrap',
    events: {
      'click #canvas': 'hideSubNav'
    },
    hideSubNav: function () {
      $('screen clicked');
      $('#subnav').hide();
    }
  });

  var NavBar = Backbone.View.extend({
    el: '#navtable',
    events: {
      'click #iconifyB': 'iconify',
      'click #measurementsB': 'showMeasurements',
      'click #libsB': 'showLibs'
    },
    iconify: function () {
      console.log('inside iconify');
      $('#subnav').hide();
      app.pmpm.makeMosaic(app.cmp);
    },
    showMeasurements: function () {
      console.log('show measurements btton');
      populateSubNav('measurements');
      $('#subnav').show();
    },
    showLibs: function () {
      console.log('showing libs');
      populateSubNav('libsMenu');
      $('#subnav').show();
    }
  });

  var SubNavBar = Backbone.View.extend({
    el: '#subnav',
    events: {
      'change #tileSzSlider': 'changeTileSz',
      'input #tileSzSlider': 'renderSzExample'
    },
    changeTileSz: function () {
      console.log('tileSzChangede!');
    },
    renderSzExample: function () {
      var sz = $('#tileSzSlider').val();
      $('#tileSzExample').css({'width': sz + 'px', 'height': sz + 'px'}); 
    }
  });

  var navBar = new NavBar;
  var canvasView = new CanvasView;
  var subNavBar = new SubNavBar;
  
  that.navBar = navBar;
  that.canvasView = canvasView;
  that.subNavBar = subNavBar;

  return that;
}();
