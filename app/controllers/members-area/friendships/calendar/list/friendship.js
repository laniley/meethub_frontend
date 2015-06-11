import Ember from 'ember';

export default Ember.Controller.extend({

  sortProperties: ['event.start_date:asc', 'event.social_points:desc'],
  sortedEventsInvs: Ember.computed.sort('upcomingEventInvsOfFriend', 'sortProperties'),

  friend: function() {

    return DS.PromiseObject.create({

      promise: this.get('model').get('friend').then(friend => {

        return friend;

      })

    });

  }.property('model.friend'),

  eventInvitationsOfFriend: function() {

    return DS.PromiseObject.create({

      promise: this.get('friend').then(friend => {

        return friend.get('eventInvitations').then(eventInvs => {
          return eventInvs;
        });

      })

    });

  }.property('friend.eventInvitations.length'),

  upcomingEventInvsOfFriend: function() {

    return DS.PromiseArray.create({

      promise: this.get('eventInvitationsOfFriend').then(eventInvs => {

        return Ember.RSVP.filter(eventInvs.toArray(), eventInv => {

          return eventInv.get('event').then(event => {
            return event.get('is_upcoming') === true
          });

        });

      })

    });

  }.property('eventInvitationsOfFriend.@each')

});
