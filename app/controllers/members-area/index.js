import Ember from 'ember';

export default Ember.Controller.extend({

  hasUnreadMessages: function() {

    if(this.get('unreadMessages').get('length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('unreadMessages.@each'),

  number_of_new_meethub_invitations: function() {

    var unreadMessages = [];

    if(this.get('model.messages.length') > 0)
    {
      unreadMessages = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false;
      });
    }

    var unreadMeethubInvitations = [];

    if(unreadMessages.get('length') > 0)
    {
      unreadMeethubInvitations = unreadMessages.filter(function(message) {
        return message.get('isMeethubInvitation') === true;
      });
    }

    return unreadMeethubInvitations.get('length');

  }.property('model.messages.@each.hasBeenRead', 'model.messages.@each.isMeethubInvitation'),

  number_of_new_event_invitations: function() {

    var unreadMessages = [];

    if(this.get('model.messages.length') > 0)
    {
      unreadMessages = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false;
      });
    }

    var unreadEventInvitations = [];

    if(unreadMessages.get('length') > 0)
    {
      unreadEventInvitations = unreadMessages.filter(function(message) {
        return message.get('isEventInvitation') === true;
      });
    }

    return unreadEventInvitations.get('length');

  }.property('model.messages.@each.hasBeenRead', 'model.messages.@each.isEventInvitation'),

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
