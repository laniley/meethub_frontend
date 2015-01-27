import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  short_description: DS.attr('string'),
  isOpen: DS.attr('boolean', {defaultValue: false}),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  founder: DS.belongsTo('user', { async: true }),
  members: DS.hasMany('user')
});
