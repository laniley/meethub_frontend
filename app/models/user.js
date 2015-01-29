import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  picture: DS.attr(),
  locale: DS.attr('string'),
  gender: DS.attr('string'),
  friends: DS.hasMany('user', { async: true }),
  messages: DS.hasMany('message'),

  name: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  }.property('first_name,last_name')
});
