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
    var sortedEventInvs = [];

    if(eventInvs !== undefined) {

      eventInvs.forEach(function(eventInv) {
        var currentEvent = eventInv.get('event');

        if(currentEvent.get('is_upcoming') === true)
        {
          upcomingEventInvs.push(eventInv);
        }
      });

      for(var i = 0; i < upcomingEventInvs.length; i++)
      {
        if(sortedEventInvs.length === 0)
        {
          sortedEventInvs.push(upcomingEventInvs[i]);
        }
        else
        {
          var index = 0;

          for(var k = 0; k < sortedEventInvs.length; k++)
          {
            if(!upcomingEventInvs[i].get('event').get('start').isAfter(sortedEventInvs[k].get('event').get('start')))
            {
              index = k;
              break;
            }
          }

          sortedEventInvs.splice(index, 0, upcomingEventInvs[i]);
        }
      }

    }

    return sortedEventInvs;

  }.property('model.eventInvitations.@each')

});
