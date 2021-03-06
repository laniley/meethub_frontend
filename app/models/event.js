import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({

  fb_id: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  picture: DS.attr('string'),
  start_time: DS.attr('string'),
  start_date: DS.attr('string'),
  location: DS.belongsTo('location', { async: true }),
  eventInvitations: DS.hasMany('eventInvitation', { async: true, inverse: 'event' }),

  created_at: DS.attr(),
  updated_at: DS.attr(),

  hasConnectedFriends: Ember.computed(
    'friends_attending.length',
    'friends_attending_maybe.length' ,
    'friends_declined.length',
    'friends_not_replied.length',
    function() {
      return this.get('friends_attending.length') + this.get('friends_attending_maybe.length') + this.get('friends_declined.length') + this.get('friends_not_replied.length') > 0;
  }),

  friends_attending: Ember.computed('eventInvitations.@each.status', function() {
    var me = this.store.peekRecord('me', 1);
    return DS.PromiseArray.create({
      promise: me.get('user').then(user => {
        return this.get('eventInvitations').filter(eventInvitation => {
          return eventInvitation.get('status') === 'attending' && eventInvitation.get('user').get('id') !== user.get('id');
        });
      })
    });
  }),

  friends_attending_maybe: Ember.computed('eventInvitations.@each.status', function() {
    var me = this.store.peekRecord('me', 1);
    return DS.PromiseArray.create({
      promise: me.get('user').then(user => {
        return this.get('eventInvitations').filter(eventInvitation => {
          return eventInvitation.get('status') === 'maybe' && eventInvitation.get('user').get('id') !== user.get('id');
        });
      })
    });
  }),

  friends_declined: Ember.computed('eventInvitations.@each.status', function() {
    var me = this.store.peekRecord('me', 1);
    return DS.PromiseArray.create({
      promise: me.get('user').then(user => {
        return this.get('eventInvitations').filter(eventInvitation => {
          return eventInvitation.get('status') === 'declined' && eventInvitation.get('user').get('id') !== user.get('id');
        });
      })
    });
  }),

  friends_not_replied: Ember.computed('eventInvitations.@each.status', function() {
    var me = this.store.peekRecord('me', 1);
    return DS.PromiseArray.create({
      promise: me.get('user').then(user => {
        return this.get('eventInvitations').filter(eventInvitation => {
          return eventInvitation.get('status') === 'not_replied' && eventInvitation.get('user').get('id') !== user.get('id');
        });
      })
    });
  }),

  social_points: function() {
    return this.get('friends_attending').get('length') * 3 + this.get('friends_attending_maybe').get('length');
  }.property('friends_attending.length', 'friends_attending_maybe.length'),

  start_time_converted: function() {
    return this.get('start_time').substr(0,5);
  }.property('start_time')
});
