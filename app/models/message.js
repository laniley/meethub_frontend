import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  from_user: DS.belongsTo('user'),
  to_user: DS.belongsTo('user'),
  subject: DS.attr('string'),
  text: DS.attr('string'),
  isOpen: DS.attr('boolean', {defaultValue: false}),
  hasBeenRead: DS.attr('boolean', {defaultValue: true}),
  eventInvitation: DS.belongsTo('eventInvitation', { async: true }),
  meethubInvitation: DS.belongsTo('meethubInvitation', { async: true }),
  created_at: DS.attr(),
  updated_at: DS.attr(),

  isEventInvitation: function() {
    if(Ember.isEmpty(this.get('eventInvitation.id')))
    {
      return false;
    }
    else
    {
      return true;
    }
  }.property('eventInvitation'),

  isMeethubInvitation: function() {
    if(Ember.isEmpty(this.get('meethubInvitation.id')))
    {
      return false;
    }
    else
    {
      return true;
    }
  }.property('meethubInvitation')
});
