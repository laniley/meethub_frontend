import Ember from 'ember';

export default Ember.Controller.extend({

  number_of_new_meethub_invitations: function() {
    var unreadMeethubInvitations = [];

    if(this.get('unreadMessages.length') > 0)
    {
      unreadMeethubInvitations = this.get('unreadMessages').filter(function(message) {
        return message.get('isMeethubInvitation') === true;
      });
    }

    return unreadMeethubInvitations.get('length');
  }.property('unreadMessages.@each'),

  number_of_new_event_invitations: function() {
    var unreadEventInvitations = [];

    if(this.get('unreadMessages.length') > 0)
    {
      unreadEventInvitations = this.get('unreadMessages').filter(function(message) {
        return message.get('isEventInvitation') === true;
      });
    }

    return unreadEventInvitations.get('length');
  }.property('unreadMessages.@each'),

  hasUnreadMeethubInvitations: function() {

    if(this.get('number_of_new_meethub_invitations') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('number_of_new_meethub_invitations'),

  hasUnreadEventInvitations: function() {

    if(this.get('number_of_new_event_invitations') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('number_of_new_event_invitations'),

  unreadMessages: function() {
    var unreadMessages = [];

    if(this.get('model.messages.length') > 0)
    {
      unreadMessages = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false;
      });
    }

    return unreadMessages;
  }.property('model.messages.@each.hasBeenRead')
});
