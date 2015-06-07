import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area', 'members-area/index'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  sortProperties: ['start_date:asc', 'social_points:desc'],
  sortedEvents: Ember.computed.sort('unsortedUpcomingEvents', 'sortProperties'),

  isSidebarOpen: false,

  unsortedUpcomingEvents: function() {
    return this.get('model').filterBy('is_upcoming', true);
  }.property('model.@each.is_upcoming')

});
