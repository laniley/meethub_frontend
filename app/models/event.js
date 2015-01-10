import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  start_time: DS.attr('string'),
  start_date: DS.attr('string'),
  location: DS.belongsTo('location')
});
