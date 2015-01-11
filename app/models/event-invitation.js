import DS from 'ember-data';

export default DS.Model.extend({
  event: DS.belongsTo('event'),
  invited_user: DS.belongsTo('user'),
  message: DS.belongsTo('message'),
  status: DS.attr('string')
});
