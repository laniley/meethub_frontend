import Ember from 'ember';

export default Ember.Controller.extend({

  unreadMessages: function() {

    var unreadMessages = [];

    if(this.get('model.messages.length') > 0)
    {
      unreadMessages = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false;
      });
    }

    return unreadMessages;

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

  newMeethubEventInfos: function() {
    var self = this;

    if(this.get('friendEventsOfUpcomingEventsOfMeethubs') !== undefined)
    {
      var newFriendEventInvs = this.get('friendEventsOfUpcomingEventsOfMeethubs').filter(function(friendEventInv) {

        if(friendEventInv.get('updated_at') !== undefined)
        {
          if(friendEventInv.get('updated_at') >= self.get('model').get('last_login'))
          {
            return true;
          }
          else
          {
            return false;
          }
        }

      });

      return newFriendEventInvs;
    }

  }.property('friendEventsOfUpcomingEventsOfMeethubs.@each.updated_at'),

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

  hasNewMeethubEventInfos: function() {

    if(this.get('newMeethubEventInfos.length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('newMeethubEventInfos.length'),

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



});