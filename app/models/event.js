import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  me: DS.belongsTo('user'),
  fb_id: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  start_time: DS.attr('string'),
  start_date: DS.attr('string'),
  location: DS.belongsTo('location', { async: true }),
  eventInvitations: DS.hasMany('eventInvitation', { async: true, inverse: 'event' }),

  created_at: DS.attr(),
  updated_at: DS.attr(),

  my_event_invitation: function() {

    return DS.PromiseObject.create({

      promise: this.get('eventInvitations').then(eventInvitations => {

        return eventInvitations.filter(eventInvitation => {

          return Ember.isEqual(eventInvitation.get('belongsToMe'), true);

        }).get('firstObject');

      })

    });

  }.property('eventInvitations.@each.belongsToMe'),

  newSinceLastLogin: function() {

    return DS.PromiseObject.create({

      promise: this.get('my_event_invitation').then(myEventInvitation => {

        if(!Ember.isEmpty(myEventInvitation))
        {
          return myEventInvitation.get('message').then(message => {

            return !message.get('hasBeenRead');

          });
        }

      })

    });

  }.property('my_event_invitation.message.hasBeenRead'),

  friend_event_invitations: function() {

    return DS.PromiseArray.create({

      promise: this.get('eventInvitations').then(eventInvitations => {

        return eventInvitations.filter(eventInvitation => {

          return Ember.isEqual(eventInvitation.get('belongsToMe'), false);

        });

      })

    });

  }.property('eventInvitations.@each.belongsToMe'),

  // friend_event_invitations_updated_since_last_login: function() {
  //   return this.get('eventInvitations').filter(function(eventInv) {
  //     return eventInv.get('invited_user').get('isMe') === false && eventInv.get('updatedSinceLastLogin') === true;
  //   });
  // }.property('eventInvitations.length', 'eventInvitations.@each.updatedSinceLastLogin'),

  friend_event_invitations_attending: function() {

    return DS.PromiseArray.create({

      promise: this.get('friend_event_invitations').then(eventInvitations => {

        return Ember.RSVP.filter(eventInvitations.toArray(), eventInvitation => {

          return Ember.isEqual(eventInvitation.get('status'), 'attending');

        });

      })

    });

  }.property('friend_event_invitations.@each.status'),

  friend_event_invitations_attending_maybe: function() {

    return DS.PromiseArray.create({

      promise: this.get('friend_event_invitations').then(eventInvitations => {

        return Ember.RSVP.filter(eventInvitations.toArray(), eventInvitation => {

          return Ember.isEqual(eventInvitation.get('status'), 'maybe');

        });

      })

    });

  }.property('friend_event_invitations.@each.status'),

  friend_event_invitations_declined: function() {

    return DS.PromiseArray.create({

      promise: this.get('friend_event_invitations').then(eventInvitations => {

        return Ember.RSVP.filter(eventInvitations.toArray(), eventInvitation => {

          return Ember.isEqual(eventInvitation.get('status'), 'declined');

        });

      })

    });

  }.property('friend_event_invitations.@each.status'),

  friends_attending: function() {

    return DS.PromiseArray.create({

      promise: this.get('friend_event_invitations_attending').then(eventInvitations => {

        return Ember.RSVP.all(eventInvitations.map(eventInvitation => {

          return eventInvitation.get('invited_user').then(invited_user => {

            return invited_user;

          });

        }));

      })

    });

  }.property('friend_event_invitations_attending.length'),

  friends_attending_maybe: function() {

    return DS.PromiseArray.create({

      promise: this.get('friend_event_invitations_attending_maybe').then(eventInvitations => {

        return Ember.RSVP.all(eventInvitations.map(eventInvitation => {

          return eventInvitation.get('invited_user').then(invited_user => {

            return invited_user;

          });

        }));

      })

    });

  }.property('friend_event_invitations_attending.length'),

  friends_declined: function() {

    return DS.PromiseArray.create({

      promise: this.get('friend_event_invitations_declined').then(eventInvitations => {

        return Ember.RSVP.all(eventInvitations.map(eventInvitation => {

          return eventInvitation.get('invited_user').then(invited_user => {

            return invited_user;

          });

        }));

      })

    });

  }.property('friend_event_invitations_attending.length'),

  connected_friends_length: function() {
    return this.get('friends_attending').get('length') + this.get('friends_attending_maybe').get('length') + this.get('friends_declined').get('length');
  }.property('friends_attending.length', 'friends_attending_maybe.length', 'friends_declined.length'),

  hasConnectedFriends: function() {
    if(this.get('connected_friends_length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('connected_friends_length'),

  social_points: function() {
    return this.get('friends_attending').get('length') * 3 + this.get('friends_attending_maybe').get('length');
  }.property('friends_attending.length', 'friends_attending_maybe.length', 'friends_declined.length'),

  hasSocialPoints: function() {
    if(this.get('social_points') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('social_points'),

  hasSocialPointUpdates: function() {
    if(this.get('friend_event_invitations_updated_since_last_login.length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('friend_event_invitations_updated_since_last_login.length'),

  start: function() {
    return moment(this.get('start_date'), "YYYY-MM-DDTHH:mm:ss.SSSSZ");
  }.property('start_time'),

  end: function() {
    return moment(this.get('start_date'), "YYYY-MM-DDTHH:mm:ss.SSSSZ").add(1, 'hours');
  }.property('start_time'),

  start_time_converted: function() {
    return this.get('start_time').substr(0,5);
  }.property('start_time'),

  start_date_converted_to_de: function() {
    var date_arr = this.get('start_date').split('-');
    return date_arr[2] + '.' + date_arr[1] + '.' + date_arr[0];
  }.property('start_date'),

  start_date_converted_to_us: function() {
    var date_arr = this.get('start_date').split('-');
    return date_arr[1] + '/' + date_arr[2] + '/' + date_arr[0];
  }.property('start_date'),

  is_upcoming: function() {
    var yesterday = moment().add(-1, 'd');

    if(this.get('start').isSame(yesterday) || this.get('start').isAfter(yesterday))
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('start')
});
