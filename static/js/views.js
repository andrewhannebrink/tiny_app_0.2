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
      var subMenu = document.getElementById(id).innerHTML;
      $("#subnav").html(subMenu);
      if (id === 'measurements') {
        $('#tileSzSlider').val(app.cmp.tileX);
        subNavBar.renderSzExample();
      }
      $('#subnav').show();
    });
  };

  // Only control is clicking screen to hide subnav bar
  var CanvasView = Backbone.View.extend({
    el: '#canvasWrap',
    events: {
      'click #canvas': 'hideSubNav'
    },
    hideSubNav: function () {
      $('#subnav').hide();
      $('td').removeClass('navtable_sel');
    }
  });

  // Backbone view for bottom most navigation bar
  var NavBar = Backbone.View.extend({
    el: '#navtable',
    events: {
      'click .navcell': 'butClicked',
      'click #saveB': 'save',
      'click #measurementsB': 'showMeasurements',
      'click #picB': 'pic',
      'click #libsB': 'showLibs',
      'click #iconifyB': 'iconify'
    },
    butClicked: function () {
      console.log('butClicked');
      $('.navcell').removeClass('navtable_sel');
    },
    save: function () {
      $('#subnav').hide(); //TODO take out this line
      // TODO populate sub nav with form
      $('#saveB').addClass('navtable_sel');
    },
    showMeasurements: function () {
      populateSubNav('measurements');
      $('#measurementsB').addClass('navtable_sel');
      //TODO show measurements for x and y rather than base both dimensions off of x
    },
    pic: function () {
      $('#subnav').hide(); //TODO take out this line
      // TODO populate sub nav with form
      $('#picB').addClass('navtable_sel');
    },
    showLibs: function () {
      console.log('showing libs');
      populateSubNav('libsMenu');
      $('#libsB').addClass('navtable_sel');
    },
    iconify: function () {
      console.log('inside iconify');
      $('#subnav').hide();
      $('#iconifyB').addClass('navtable_sel');
      app.pmpm.makeMosaic(app.cmp);
    }
  });
  
  // TODO split into two different views for measurements and libs buttons
  var SubNavBar = Backbone.View.extend({
    el: '#subnav',
    currentLibBase: 'emoji',
    events: {
      'change #tileSzSlider': 'changeTileSz',
      'input #tileSzSlider': 'renderSzExample',
      'click .subnavcell': 'subButClicked',
      'click #emojiLibB': 'emojiLib',
      'click #winLibB': 'winLib',
      'click .subsubnavcell': 'subsubButClicked',
      'click #clearB': 'clear',
      'click #colorsB': 'colors',
      'click #colorB': 'color',
      'click #randomB': 'random'
    },
    changeTileSz: function () {
      var sz = $('#tileSzSlider').val();
      app.cmp.tileX = sz;
      app.cmp.tileY = sz;
    },
    renderSzExample: function () {
      var sz = $('#tileSzSlider').val();
      $('#tileSzExample').css({'width': sz + 'px', 'height': sz + 'px'}); 
    },
    subButClicked: function () {
      console.log('subButClicked');
      $('.subnavcell').removeClass('subnav_sel');
    },
    subsubButClicked: function () {
      console.log('subsubButClicked');
      $('.subsubnavcell').removeClass('subsubnav_sel');
    },
    emojiLib: function () {
      //TODO identify current cmp background parameter for emojiLib and auto select subsubnav background selection
      $('#emojiLibB').addClass('subnav_sel');
      $('#colorsB').removeClass('special_sel');
      this.currentLibBase = 'emoji';
      app.cmp.attributes.lib = this.currentLibBase;
    },
    winLib: function () {
      //TODO identify current cmp background parameter for winLibB and auto select subsubnav background selection
      $('#winLibB').addClass('subnav_sel');
      $('#colorsB').removeClass('special_sel');
      this.currentLibBase = 'win';
      app.cmp.attributes.lib = this.currentLibBase;
    },
    clear: function () {
      $('#clearB').addClass('subsubnav_sel');
      app.cmp.opt.bg = 'clear';
    },
    colors: function () {
      $('#colorsB').addClass('special_sel');
      app.cmp.attributes.lib = this.currentLibBase + '-1';
      app.cmp.opt.bg = undefined;
    },
    color: function () {
      $('#colorB').addClass('subsubnav_sel');
      // TODO dynamic color selection
      app.cmp.opt.bg = [255, 255, 255];
    },
    random: function () {
      $('#randomB').addClass('subsubnav_sel');
      app.cmp.opt.bg = 'random';
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
