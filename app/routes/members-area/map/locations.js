import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.all('location'));
  },
  renderTemplate: function() {
    this.render('members-area.sections.locations.section-title', { outlet: 'section-title' });
    this.render('members-area.map.locations', { outlet: 'side-nav-bar' });
    this.render('members-area.side-nav-bar.side-bar-links.locations', { outlet: 'side-bar-links' });
  }
});
