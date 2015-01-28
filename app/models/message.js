import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  subject: DS.attr('string'),
  text: DS.attr('string'),
  isOpen: DS.attr('boolean', {defaultValue: false}),
  hasBeenRead: DS.attr('boolean', {defaultValue: true}),
  user: DS.belongsTo('user'),
  eventInvitation: DS.belongsTo('eventInvitation'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  isEventInvitation: function() {
    if(this.get('eventInvitation') != null)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('eventInvitation')
});
