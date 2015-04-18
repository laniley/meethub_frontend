import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  picture: DS.attr(),
  locale: DS.attr('string'),
  gender: DS.attr('string'),
  isMe: DS.attr('boolean', { defaultValue: false }),

  friends: DS.hasMany('user', { async: true }),
  meethubInvitations: DS.hasMany('meethub-invitation', { async: true }),
  meethubComments: DS.hasMany('meethub-comment', { async: true, inverse: 'user' }),
  eventInvitations: DS.hasMany('event-invitations', { asnyc: true, inverse: 'invited_user'}),
  messages: DS.hasMany('message', { inverse: 'to_user' }),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  first_login: DS.attr('boolean', { defaultValue: true }),
  last_login: DS.attr('date'),

  name: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  }.property('first_name', 'last_name'),

  acceptedMeethubInvitations: function() {
    var self = this;

    var filteredMeethubInvitations = self.get('meethubInvitations').filter(function(meethubInvitation) {
      return meethubInvitation.get('invited_user') !== null && meethubInvitation.get('invited_user').get('id') === self.get('id') && meethubInvitation.get('status') === 'accepted';
    });

    return filteredMeethubInvitations;
  }.property('meethubInvitations.@each'),

  acceptedMeethubs: function() {
    return this.get('acceptedMeethubInvitations').mapBy('meethub');
  }.property('acceptedMeethubInvitations.@each'),

  membersOfAcceptedMeethubs: function() {
    var self = this;

    var members = [];

    self.get('acceptedMeethubs').forEach(function(meethub) {
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

  }.property('acceptedMeethubs.@each.acceptedInvitations'),

  eventInvitationsOfmembersOfAcceptedMeethubs: function() {

    var eventInvMessages = [];

    this.get('membersOfAcceptedMeethubs').forEach(function(member) {

      var messagesOfMember = member.get('messages');

      messagesOfMember.forEach(function(message) {

        if(message.get('isEventInvitation') === true && eventInvMessages.indexOf(message) === -1)
        {
          eventInvMessages.push(message);
        }
      });

    });

    return eventInvMessages.mapBy('eventInvitation');

  }.property('membersOfAcceptedMeethubs.@each.messages'),

  upcomingEventsOfMeethubs: function() {
    var events = [];

    this.get('eventInvitationsOfmembersOfAcceptedMeethubs').forEach(function(eventInv) {

      var anEvent = eventInv.get('event');

      if(events.indexOf(anEvent) === -1 && anEvent.get('is_upcoming') === true)
      {
        events.push(anEvent);
      }

    });

    return events;

  }.property('eventInvitationsOfmembersOfAcceptedMeethubs.@each.event')
});
