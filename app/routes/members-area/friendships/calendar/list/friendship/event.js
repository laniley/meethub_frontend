import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('event', params.event_id);
  },
  setupController: function(controller, model) {

    controller.set('model', model);

    this.controllerFor('members-area.friendships.calendar.list.friendship').set('isSidebarOpen', true);
  }
});
