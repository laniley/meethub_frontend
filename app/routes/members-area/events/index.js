import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    // controller.set('model', this.store.all('event'));
    this.controllerFor('members-area').set('showSidebar', false);
    this.controllerFor('members-area').set('isSidebarOpen', false);
  }
});
