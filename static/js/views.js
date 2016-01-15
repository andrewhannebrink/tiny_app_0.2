app.views = function () { 
  var that = {};
  var NavBar = Backbone.View.extend({
    el: '#navtable',
    events: {
      'click #iconify': 'iconify',
    },
    iconify: function () {
      console.log('inside iconify');
      app.router.navigate('a/emoji/60/random', {trigger: true});
    }
  });

  var navBar = new NavBar;
  
  that.navBar = navBar;
  return that;
}();
