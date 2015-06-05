import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area', 'members-area/index'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  sortProperties: ['start_date:asc', 'social_points:desc'],
  sortedEvents: Ember.computed.sort('unsortedUpcomingEvents', 'sortProperties'),

  isSidebarOpen: function() {
    return this.get('membersArea_controller').get('isSidebarOpen');
  }.property('membersArea_controller.isSidebarOpen'),

  user: function() {
    return this.get('membersArea_controller').get('model');
  }.property('membersArea_controller.model'),

  unsortedUpcomingEvents: function() {

    return this.get('model').filterBy('is_upcoming', true);

  }.property('model.@each.is_upcoming')

});
