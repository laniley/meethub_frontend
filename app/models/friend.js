import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', { async: true }),
  friend: DS.belongsTo('user', { async: true }),
  has_been_seen: DS.attr('boolean', { defaultValue: false }),

  created_at: DS.attr()
});
