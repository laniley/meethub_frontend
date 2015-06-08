import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    this.controllerFor('members-area.friends').set('isSidebarOpen', false);
  }
});
