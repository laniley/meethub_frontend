import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  short_description: DS.attr('string'),
  isOpen: DS.attr('boolean', {defaultValue: false}),

  founder: DS.belongsTo('user'),
  members: DS.hasMany('user')
});
