import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  start_time: DS.attr('string'),
  status: DS.attr('string'),
  location: DS.belongsTo('location')
});
