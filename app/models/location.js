import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  name: DS.attr('string'),
  country: DS.attr('string'),
  city: DS.attr('string'),
  zip: DS.attr('string'),
  street: DS.attr('string'),
  latitude: DS.attr('string'),
  longitude: DS.attr('string'),
  events: DS.hasMany('event')
});
