import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render({ outlet: 'main-area' });
    this.render('members-area.top-nav-bar-links.map', {
      outlet: 'top-nav-bar-links',
      controller: 'members-area'
    });
    this.render('members-area.side-nav-bar.filter.map', {
      outlet: 'area-filter'
    });
  }
});
