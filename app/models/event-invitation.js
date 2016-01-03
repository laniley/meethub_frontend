import DS from 'ember-data';

export default DS.Model.extend({
  event: DS.belongsTo('event', { async: true }),
  user: DS.belongsTo('user', { async: true }),
  status: DS.attr('string'),
  has_been_seen: DS.attr('boolean', { defaultValue: false }),

  created_at: DS.attr(),
  updated_at: DS.attr()
});
