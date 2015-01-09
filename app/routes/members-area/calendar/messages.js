import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.all('message'));
  },
  renderTemplate: function() {
    this.render('members-area.map.messages', { outlet: 'side-nav-bar' });
    this.render('members-area.side-bar-links.messages', { outlet: 'side-bar-links' });
  }
});
