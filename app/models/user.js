import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  name: DS.attr('string'),
  picture: DS.attr(),
  locale: DS.attr('string'),
  friends: DS.hasMany('user'),
  messages: DS.hasMany('message')
});
