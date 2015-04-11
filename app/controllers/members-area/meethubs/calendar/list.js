import Ember from 'ember';

export default Ember.Controller.extend({
  // needs: ['members-area/meethubs'],
  // meethubs_controller: Ember.computed.alias("controllers.members-area/meethubs"),

  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  sortProperties: ['start_date:asc', 'social_points:desc'],
  sortedEvents: Ember.computed.sort('upcomingEventsOfMeethubs', 'sortProperties'),

  user: function() {
    return this.get('membersArea_controller').get('model');
  }.property(),

  myAcceptedMeethubInvitations: function() {
    var self = this;

    var filteredMeethubInvitations = self.get('model').filter(function(meethubInvitation) {
      return meethubInvitation.get('invited_user') !== null && meethubInvitation.get('invited_user').get('id') === self.get('user').get('id') && meethubInvitation.get('status') === 'accepted';
    });

    return filteredMeethubInvitations;
  }.property('model.@each', 'model.@each.status'),

  myAcceptedMeethubs: function() {
    return this.get('myAcceptedMeethubInvitations').mapBy('meethub');
  }.property('myAcceptedMeethubInvitations.@each.meethub'),

  membersOfmyAcceptedMeethubs: function() {
    var self = this;

    var members = [];

    self.get('myAcceptedMeethubs').forEach(function(meethub) {
      var acceptedInvs = meethub.get('acceptedInvitations');

      acceptedInvs.forEach(function(acceptedInv) {
        var member = acceptedInv.get('invited_user');

        if(members.indexOf(member) === -1)
        {
          members.push(member);
        }
      });

    });

    return members;

  }.property('myAcceptedMeethubs.@each.acceptedInvitations'),

  eventInvitationsOfmembersOfmyAcceptedMeethubs: function() {

    var eventInvMessages = [];

    this.get('membersOfmyAcceptedMeethubs').forEach(function(member) {

      var messagesOfMember = member.get('messages');

      messagesOfMember.forEach(function(message) {

        if(message.get('isEventInvitation') === true && eventInvMessages.indexOf(message) === -1)
        {
          eventInvMessages.push(message);
        }
      });

    });

    return eventInvMessages.mapBy('eventInvitation');

  }.property('membersOfmyAcceptedMeethubs.@each.messages'),

  upcomingEventsOfMeethubs: function() {

    var events = [];

    this.get('eventInvitationsOfmembersOfmyAcceptedMeethubs').forEach(function(eventInv) {

      var anEvent = eventInv.get('event');
      var today = new Date();

      if(events.indexOf(anEvent) === -1 && anEvent.get('start') > today)
      {
        events.push(anEvent);
      }

    });

    return events;

  }.property('eventInvitationsOfmembersOfmyAcceptedMeethubs.@each.event')

});
