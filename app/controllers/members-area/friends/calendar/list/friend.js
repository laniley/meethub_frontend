import Ember from 'ember';

export default Ember.Controller.extend({
  // needs: ['members-area/index'],
  // membersArea_index_controller: Ember.computed.alias("controllers.members-area/index"),

  sortProperties: ['start_date:asc', 'social_points:desc'],
  // sortedEventsInvs: Ember.computed.sort('upcomingEventsInvsOfFriend', 'sortProperties'),

  eventInvitationsOfFriend: function() {
    return this.get('model').get('eventInvitations');
  }.property('model.eventInvitations.@each'),

  upcomingEventInvsOfFriend: function() {
    var eventInvs = this.get('model').get('eventInvitations');

    var upcomingEventInvs = [];

    if(eventInvs !== undefined) {
      eventInvs.forEach(function(eventInv) {
        var currentEvent = eventInv.get('event');

        if(currentEvent.get('is_upcoming') === true)
        {
          upcomingEventInvs.push(eventInv);
        }
      });
    }

    return upcomingEventInvs;
  }.property('model.eventInvitations.@each')

});
