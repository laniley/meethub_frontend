import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  hasFB: function() {
    if(this.get('membersArea_controller').get('FB') !== null)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('membersArea_controller.FB'),

  unreadMessages: function() {

    if(this.get('model.messages.length')) {

      return this.get('model.messages').then(messages => {

        messages.filter(message => {

          return !message.get('hasBeenRead');

        });

      });

    }

  }.property('model.messages.@each.hasBeenRead'),

  newMeethubComments: function() {

    var newMeethubComments = [];

    if(this.get('model.meethubComments.length') > 0)
    {
      var self = this;

      newMeethubComments = this.get('model.meethubComments').filter(function(comment) {
        return comment.get('new_comment') === true && comment.get('author').get('id') !== self.get('model').get('id');
      });
    }

    return newMeethubComments;

  }.property('model.meethubComments.@each.new_comment'),

  upcomingEventsOfMeethubs: function() {
    return this.get('model.upcomingEventsOfMeethubs');
  }.property('model.upcomingEventsOfMeethubs.@each'),

  friendEventsOfUpcomingEventsOfMeethubs: function() {
    var upcomingEvents = this.get('upcomingEventsOfMeethubs');

    if(upcomingEvents !== null)
    {
      var friendEventInvs = [];

      upcomingEvents.forEach(function(upcomingEvent) {

        var eventInvs = upcomingEvent.get('friend_event_invitations');

        eventInvs.forEach(function(eventInv) {

          if(friendEventInvs.indexOf(eventInv) === -1)
          {
            friendEventInvs.push(eventInv);
          }

        });

      });

      return friendEventInvs;
    }
  }.property('upcomingEventsOfMeethubs.@each.friend_event_invitations'),

  socialPointUpdates: function() {
    var self = this;
    var upcomingEventsOfMeethubs = this.get('upcomingEventsOfMeethubs');
    var socialPointUpdates = 0;

    if(upcomingEventsOfMeethubs !== null)
    {
      upcomingEventsOfMeethubs.forEach(function(upcomingEvent) {
        socialPointUpdates += upcomingEvent.get('friend_event_invitations_updated_since_last_login.length');
      });

      return socialPointUpdates;
    }

  }.property('upcomingEventsOfMeethubs.@each.friend_event_invitations_updated_since_last_login.length'),

  hasUnreadMessages: function() {

    if(this.get('unreadMessages').get('length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('unreadMessages.length'),

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

  hasNewMeethubComments: function() {

    if(this.get('newMeethubComments').get('length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('newMeethubComments.@each'),

  hasSocialPointUpdates: function() {

    if(this.get('socialPointUpdates') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('socialPointUpdates'),

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

  }.property('model.messages.@each.hasBeenRead', 'model.messages.@each.isEventInvitation')

});
