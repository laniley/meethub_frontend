import DS from 'ember-data';

export default DS.Model.extend({
  text: DS.attr('string'),
  user: DS.belongsTo('user'),
  event: DS.belongsTo('event'),

  isEvent: function() {
    if(event != null)
      return true;
    else
      return false;
  }.property('event')
});
