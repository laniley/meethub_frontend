import DS from 'ember-data';

export default DS.Model.extend({
  reported_by: DS.belongsTo('user'),
  browserCodeNmae: DS.attr('string'),
  browserOfficialName: DS.attr('string'),
  browserVersion: DS.attr('string'),
  platform: DS.attr('string'),
  text: DS.attr('string'),
  status: DS.attr('string')
});
