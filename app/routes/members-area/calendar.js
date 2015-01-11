import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render({ outlet: 'main-area' });
    this.render('members-area.top-nav-bar-links.calendar', {
      outlet: 'top-nav-bar-links',
      controller: 'members-area'
    });
    this.render('members-area.side-nav-bar.filter.calendar', {
      outlet: 'area-filter'
    });
  }
});