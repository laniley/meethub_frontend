import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    this.controllerFor('members-area.friendships').set('isSidebarOpen', false);
  }
});
