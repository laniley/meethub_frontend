import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({

  queryParams: ['show_events', 'show_friends'],
  show_events: true,
  show_friends: true,

  sorted_messages: function() {
    return Ember.ArrayProxy.extend(Ember.SortableMixin).create({
      sortProperties: ['created_at'],
      sortAscending: false,
      content: this.get('filtered_messages.content')
    });
  }.property('filtered_messages.[]'),

  filtered_messages: function() {
    return DS.PromiseArray.create({
      promise: this.get('computed_messages').then(computed_messages => {
        return computed_messages.filter(message => {
          return (this.get('show_events') && message.message_type === 'event') || (this.get('show_friends') && message.message_type === 'friend');
        });
      })
    });
  }.property('computed_messages.[]', 'show_events', 'show_friends'),

  computed_messages: function() {
    var computed_messages = [];
    return DS.PromiseArray.create({
      promise: this.get('model').get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          user.get('friends').then(friends => {
            friends.forEach(friend => {
              var computed_message = Ember.Object.create({
                message_type: 'friend',
                is_open: false,
                created_at: friend.get('created_at'),
                reference_object: friend
              });
              computed_messages.pushObject(computed_message);
            });
          });
          user.get('eventInvitations').then(eventInvitations => {
            eventInvitations.forEach(eventInvitation => {
              eventInvitation.get('event').then(event => {
                var computed_message = Ember.Object.create({
                  message_type: 'event',
                  subject: event.get('name'),
                  is_open: false,
                  created_at: eventInvitation.get('created_at'),
                  reference_object: eventInvitation
                });
                computed_messages.pushObject(computed_message);
              });
            });
          });
        }
        return computed_messages;
      })
    });
  }.property('model.user.content.friends.content','model.user.content.eventInvitations.content'),

  social_points_threshold: Ember.computed('model.user.eventInvitations.@each.event.social_points', function() {
    return DS.PromiseObject.create({
      promise: this.get('model').get('user').then(user => {
        var max_social_points = 0;
        if(!Ember.isEmpty(user)) {
          var events = user.get('eventInvitations').mapBy('event');
          events.forEach(event => {
            if(event.get('content').get('social_points') > max_social_points) {
              max_social_points = event.get('content').get('social_points');
              console.log('social_points_threshold', max_social_points / 2);
            }
          });
          return max_social_points / 2;
        }
        else {
          return max_social_points / 2;
        }
      })
    });
  }),

  actions: {
    toggleQueryParam: function(param) {
      this.toggleProperty(param);
    }
  }
});
