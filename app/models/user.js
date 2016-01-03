import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  email: DS.attr('string'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  picture: DS.attr(),
  locale: DS.attr('string'),
  gender: DS.attr('string'),

  meethubInvitations: DS.hasMany('meethub-invitation', { async: true }),
  meethubComments: DS.hasMany('meethub-comment', { async: true, inverse: 'user' }),
  eventInvitations: DS.hasMany('event-invitation', { async: true }),
  messages: DS.hasMany('message', { async: true, inverse: 'to_user' }),
  friends: DS.hasMany('friend', { async: true, inverse: 'user' }),

  created_at: DS.attr(),
  updated_at: DS.attr(),
  first_login: DS.attr('boolean', { defaultValue: true }),
  last_login: DS.attr(),

  /* unit-test exists */
  name: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  }.property('first_name', 'last_name')
});
