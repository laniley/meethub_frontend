import DS from 'ember-data';

export default DS.Model.extend({

  fb_id: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  start_time: DS.attr('string'),
  start_date: DS.attr('string'),
  location: DS.belongsTo('location', { async: true }),
  eventInvitations: DS.hasMany('eventInvitation', { async: true, inverse: 'event' }),

  created_at: DS.attr(),
  updated_at: DS.attr(),

  friends_attending: function() {
    return this.get('eventInvitations').filter(eventInvitation => {
      return eventInvitation.get('status') === 'attending';
    });
  }.property('eventInvitations.[].status'),

  friends_attending_maybe: function() {
    return this.get('eventInvitations').filter(eventInvitation => {
      return eventInvitation.get('status') === 'maybe';
    });
  }.property('eventInvitations.[].status'),

  social_points: function() {
    return this.get('friends_attending').get('length') * 3 + this.get('friends_attending_maybe').get('length');
  }.property('friends_attending.length', 'friends_attending_maybe.length')
});
