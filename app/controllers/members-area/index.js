import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  isSyncing: function() {
    return this.get('membersArea_controller').get('isSyncing');
  }.property('membersArea_controller.isSyncing'),


  // friendEventsOfUpcomingEventsOfMeethubs: function() {
  //   var upcomingEvents = this.get('membersArea_controller.model.upcomingEventsOfMeethubs');

  //   if(upcomingEvents !== null)
  //   {
  //     var friendEventInvs = [];

  //     upcomingEvents.forEach(function(upcomingEvent) {

  //       var eventInvs = upcomingEvent.get('friend_event_invitations');

  //       eventInvs.forEach(function(eventInv) {

  //         if(friendEventInvs.indexOf(eventInv) === -1)
  //         {
  //           friendEventInvs.push(eventInv);
  //         }

  //       });

  //     });

  //     return friendEventInvs;
  //   }
  // }.property('membersArea_controller.model.upcomingEventsOfMeethubs.@each.friend_event_invitations'),

  // socialPointUpdates: function() {

  //   var upcomingEventsOfMeethubs = this.get('membersArea_controller.model.upcomingEventsOfMeethubs');
  //   var socialPointUpdates = 0;

  //   if(upcomingEventsOfMeethubs !== null)
  //   {
  //     upcomingEventsOfMeethubs.forEach(function(upcomingEvent) {
  //       socialPointUpdates += upcomingEvent.get('friend_event_invitations_updated_since_last_login.length');
  //     });

  //     return socialPointUpdates;
  //   }

  // }.property('membersArea_controller.model.upcomingEventsOfMeethubs.@each.friend_event_invitations_updated_since_last_login.length'),

  hasUnreadMeethubInvitations: function() {
    return this.get('membersArea_controller').get('hasUnreadMeethubInvitations');
  }.property('membersArea_controller.hasUnreadMeethubInvitations'),

  hasUnreadEventInvitations: function() {
    return this.get('membersArea_controller').get('hasUnreadEventInvitations');
  }.property('membersArea_controller.hasUnreadEventInvitations'),

  hasNewMeethubComments: function() {
    return this.get('membersArea_controller').get('hasNewMeethubComments');
  }.property('membersArea_controller.hasNewMeethubComments'),

  hasUnseenNewFriendships: function() {
    return this.get('membersArea_controller').get('hasUnseenNewFriendships');
  }.property('membersArea_controller.hasUnseenNewFriendships'),

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


  number_of_new_meethub_comments: function() {
    return this.get('membersArea_controller').get('number_of_new_meethub_comments');
  }.property('membersArea_controller.number_of_new_meethub_comments'),

  number_of_new_meethub_invitations: function() {
    return this.get('membersArea_controller.number_of_new_meethub_invitations');
  }.property('membersArea_controller.number_of_new_meethub_invitations'),

  number_of_new_event_invitations: function() {
    return this.get('membersArea_controller.number_of_new_event_invitations');
  }.property('membersArea_controller.number_of_new_event_invitations'),

  number_of_unseen_new_friendships: function() {
    return this.get('membersArea_controller.number_of_unseen_new_friendships');
  }.property('membersArea_controller.number_of_unseen_new_friendships')

});
