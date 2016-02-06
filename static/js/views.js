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

  // Loads lib from json using pmpm.loadLib if app.pmpm.libs doen't already contain it
  var loadLibIfNot = function (lib) {
    if ( !app.pmpm.libs.hasOwnProperty(lib) ) {
      app.pmpm.loadSelect(app.cmp, lib, {});
    }
  };


  // Concats pathStr with processed app.cmp parameters to make route
  var cmpToRoute = function (pathStr, cmp) {
    pathStr += cmp.attributes.lib + '/';
    if (cmp.attributes.tileX === cmp.attributes.tileY) {
      pathStr += cmp.attributes.tileX;
    } else {
      pathStr += cmp.attributes.tileX + '-';
      pathStr += cmp.attributes.tileY;
    }
    if (cmp.attributes.bg === 'clear' || cmp.attributes.bg === 'random') {
      pathStr += '/' + cmp.attributes.bg;
    } else if (typeof cmp.attributes.bg !== 'undefined') {
      pathStr += '/' + toHexStr(cmp.attributes.bg);
    }
    return pathStr;
  };

  // Populates subnav bar with element from template.html (specified by id parameter)
  var populateSubNav = function (id) {
    $('#templates').load('template.html #' + id, function () {
      var subMenu = document.getElementById(id).innerHTML;
      var libStr;
      $("#subnav").html(subMenu);
      if (id === 'measurements') {
        $('#tileSzSlider').val(app.cmp.attributes.tileX);
        subNavBar.renderSzExample();
      } else if (id === 'libsMenu') {
        that.subNavBar.changeLib(app.cmp.attributes.lib, app.cmp.attributes.bg);
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
      'change #imageLoader': 'upload',
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
      $('#subnav').hide();
      $('#picB').addClass('navtable_sel');
    },
    upload: function (e) {
      console.log('in upload function');
      var reader = new FileReader();
      var canvas = document.getElementById('canvas');
      var ctx = canvas.getContext('2d');
      reader.onload = function(event){
        console.log('reader loaded');
        var img = new Image();
        img.onload = function(){
        console.log('img loaded');
          ctx.drawImage(img,0,0,canvas.width,canvas.height);
        }
        img.src = event.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
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
      'click #pokeLibB': 'pokeLib',
      'click #andLibB': 'andLib',
      'click #sailorLibB': 'sailorLib',
      'click .subsubnavcell': 'subsubButClicked',
      'click #clearB': 'clear',
      'click #colorsB': 'colors',
      'click #colorB': 'color',
      'click #randomB': 'random'
    },
    changeTileSz: function () {
      var sz = $('#tileSzSlider').val();
      // Don't call set twice as to not fire a change event twice
      app.cmp.set({tileX: sz});
      app.cmp.attributes.tileY = sz;
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
      this.changeLib('emoji', undefined);
    },
    winLib: function () {
      this.changeLib('win', undefined);
    },
    pokeLib: function () {
      this.changeLib('poke', undefined);
    },
    andLib: function () {
      this.changeLib('and', undefined);
    },
    sailorLib: function () {
      this.changeLib('sailor');
    },
    clear: function () {
      $('#clearB').addClass('subsubnav_sel');
      app.cmp.set({bg: 'clear'});
    },
    colors: function () {
      var libStr = this.currentLibBase + '-1';
      $('#colorsB').addClass('special_sel');
      app.cmp.set({lib: libStr});
      app.cmp.set({bg: undefined});
    },
    color: function () {
      $('#colorB').addClass('subsubnav_sel');
      // TODO dynamic color selection
      app.cmp.set({bg: [255, 255, 255]});
    },
    random: function () {
      $('#randomB').addClass('subsubnav_sel');
      app.cmp.set({bg: 'random'});
    },
    changeLib: function (lib, bg) {
      var libStr = lib.split('-')[0]
      $('#' + libStr + 'LibB').addClass('subnav_sel');
      if (lib.slice(-2) !== '-1') {
        $('#colorsB').removeClass('special_sel');
      } else {
        $('#colorsB').addClass('special_sel');
      }
      loadLibIfNot(lib);
      this.currentLibBase = libStr;
      app.cmp.set({lib: lib});
      if (bg === 'clear') {
        this.clear();
      } else if (bg === 'random') {
        this.random();
      } else if (Array.isArray(bg) === true) {
        this.color();
      } else if (typeof bg === 'undefined') {
        app.cmp.set({bg: bg});
        $('.subsubnavcell').removeClass('subsubnav_sel');
      } else {
        throw 'not valid inpute for bg';
      }
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
