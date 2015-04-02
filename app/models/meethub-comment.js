import DS from 'ember-data';

export default DS.Model.extend({
  author: DS.belongsTo('user', { async: true }),
  text: DS.attr('string'),
  meethub: DS.belongsTo('meethub', { async: true }),
  created_at: DS.attr('date'),
  isNew: DS.attr('boolean', { defaultValue: true })
});
