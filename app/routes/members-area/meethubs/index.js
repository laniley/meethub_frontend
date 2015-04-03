import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    this.controllerFor('members-area').set('showSidebar', true);
  }
});
