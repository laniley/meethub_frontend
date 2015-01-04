import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.all('location'));
  },
  renderTemplate: function() {
    this.render({ outlet: 'side-nav-bar' });
  }
});
