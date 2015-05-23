import Ember from 'ember';

export default Ember.Controller.extend({
  // needs: ['members-area/index'],
  // membersArea_index_controller: Ember.computed.alias("controllers.members-area/index"),

  sortProperties: ['start_date:asc', 'social_points:desc'],
  sortedEvents: Ember.computed.sort('upcomingEventsOfFriend', 'sortProperties'),

  eventInvitationsOfFriend: function() {
    return this.get('model').get('eventInvitations');
  }.property('model.eventInvitations.@each'),

  upcomingEventsOfFriend: function() {
    var eventInvs = this.get('model').get('eventInvitations');
    var events = eventInvs.mapBy('event');
    var upcomingEvents = events.filterBy('is_upcoming', true);
    return upcomingEvents;
  }.property('model.eventInvitations.@each')

});
