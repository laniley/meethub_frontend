import DS from 'ember-data';

export default DS.Model.extend({
  subject: DS.attr('string'),
  text: DS.attr('string'),
  isOpen: DS.attr('boolean', {defaultValue: false}),
  hasBeenRead: DS.attr('boolean', {defaultValue: false}),
  user: DS.belongsTo('user'),
  event: DS.belongsTo('event'),

  isEvent: function() {
    if(event != null)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('event')
});
