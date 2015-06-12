import Ember from 'ember';

export default Ember.Controller.extend({

  sortProperties: ['event.start_date:asc', 'event.social_points:desc'],
  sortedEventsInvs: Ember.computed.sort('upcomingEventInvsOfFriend', 'sortProperties'),

  isSidebarOpen: false,

  friend: function() {

    if(this.get('model'))
    {
      return DS.PromiseObject.create({

        promise: this.get('model').get('friend').then(friend => {

          return friend;

        })

      });
    }
    else
    {
      return null;
    }

  }.property('model.friend'),

  eventInvitationsOfFriend: function() {

    if(this.get('friend'))
    {
      return DS.PromiseObject.create({

        promise: this.get('friend').then(friend => {

          return friend.get('eventInvitations').then(eventInvs => {
            return eventInvs;
          });

        })

      });
    }
    else
    {
      return null;
    }

  }.property('friend.eventInvitations.length'),

  upcomingEventInvsOfFriend: function() {

    if(this.get('eventInvitationsOfFriend'))
    {
      return DS.PromiseArray.create({

        promise: this.get('eventInvitationsOfFriend').then(eventInvs => {

          return Ember.RSVP.filter(eventInvs.toArray(), eventInv => {

            return eventInv.get('event').then(event => {
              return event.get('is_upcoming') === true
            });

          });

        })

      });
    }
    else
    {
      return null;
    }

  }.property('eventInvitationsOfFriend.@each')

});
