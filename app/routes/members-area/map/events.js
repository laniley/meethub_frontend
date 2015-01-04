import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.all('event'));
  },
  renderTemplate: function() {
    this.render('members-area.map.events', { outlet: 'side-nav-bar' });
    this.render('members-area.side-bar-links.events', { outlet: 'side-bar-links' });
  }
});
