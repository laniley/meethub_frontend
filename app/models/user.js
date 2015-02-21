import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  picture: DS.attr(),
  locale: DS.attr('string'),
  gender: DS.attr('string'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  isMe: DS.attr('boolean', {defaultValue: false}),
  friends: DS.hasMany('user', { async: true }),
  meethubInvitations: DS.hasMany('meethub-invitation', { async: true }),
  messages: DS.hasMany('message', {
    inverse: 'to_user'
  }),

  name: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  }.property('first_name,last_name')
});
