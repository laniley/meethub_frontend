import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', { async: true }),
  author: DS.belongsTo('user', { async: true }),
  text: DS.attr('string'),
  meethub: DS.belongsTo('meethub', { async: true }),
  created_at: DS.attr('date'),
  new_comment: DS.attr('boolean', { defaultValue: false })
});
