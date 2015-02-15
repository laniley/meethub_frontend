import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  from_user: DS.belongsTo('user'),
  to_user: DS.belongsTo('user'),
  subject: DS.attr('string'),
  text: DS.attr('string'),
  isOpen: DS.attr('boolean', {defaultValue: false}),
  hasBeenRead: DS.attr('boolean', {defaultValue: true}),
  eventInvitation: DS.belongsTo('eventInvitation'),
  meethubInvitation: DS.belongsTo('meethubInvitation'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  isEventInvitation: function() {
    if(this.get('eventInvitation') !== null)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('eventInvitation'),

  isMeethubInvitation: function() {
    if(this.get('meethubInvitation') !== null)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('meethubInvitation')
});
