import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  email: DS.attr('string'),
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
  messages: DS.hasMany('message', { async: true, inverse: 'to_user' }),

  created_at: DS.attr(),
  updated_at: DS.attr(),
  first_login: DS.attr('boolean', { defaultValue: true }),
  last_login: DS.attr(),

  name: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  }.property('first_name', 'last_name'),

  acceptedMeethubInvitations: function() {

    return DS.PromiseArray.create({

      promise: this.get('meethubInvitations').then(meethubInvitations => {

        return Ember.RSVP.filter(meethubInvitations.toArray(), meethubInvitation => {

          return meethubInvitation.get('invited_user').then(invitedUser => {

            return !Ember.isEmpty(invitedUser) && Ember.isEqual(invitedUser.get('id'), this.get('id')) && Ember.isEqual(meethubInvitation.get('status'),'accepted');

          });

        });

      })

    });

  }.property('meethubInvitations.@each'),

  acceptedMeethubs: function() {

    return DS.PromiseArray.create({

      promise: this.get('acceptedMeethubInvitations').then(acceptedInvitations => {

          return Ember.RSVP.all(acceptedInvitations.map(acceptedInvitation => {

            return acceptedInvitation.get('meethub').then(meethub => {

              return meethub;

            });

          }));

      })

    });

  }.property('acceptedMeethubInvitations.@each'),

  membersOfAcceptedMeethubs: function() {

    return DS.PromiseArray.create({

      promise: this.get('acceptedMeethubs').then(acceptedMeethubs => {

        return Ember.RSVP.all(acceptedMeethubs.map(acceptedMeethub => {

          return acceptedMeethub.get('acceptedInvitations').then(acceptedInvitations => {

            return Ember.RSVP.all(acceptedInvitations.map(acceptedInvitation => {

              return acceptedInvitation.get('invitedUser').then(invitedUser => {

                return invitedUser;

              });

            })).then(invitedUsers => {

              return invitedUsers.uniq();

            });

          });

        })).then(invitedUsers => {

          return invitedUsers.reduce((previousValue, currentValue) => {

            return previousValue.concat(currentValue);

          }).uniq();

        });

      })

    });

  }.property('acceptedMeethubs.@each.acceptedInvitations'),

  eventInvitationsOfMembersOfAcceptedMeethubs: function() {

    return this.get('membersOfAcceptedMeethubs').then(members => {

      return Ember.RSVP.all(members.map(member => {

        return member.get('messages').then(messages => {

          return messages.filter(message => {

            return message.get('isEventInvitation');

          });

        });

      })).then(eventInvitationMessages => {

        return Ember.RSVP.all(eventInvitationMessages.uniq().map(eventInvitationMessage => {

          return eventInvitationMessage.get('eventInvitation').then(eventInvitation => {

            return eventInvitation;

          });

        })).then(eventInvitations => {

          return eventInvitations.uniq();

        });

      });

    });

  }.property('membersOfAcceptedMeethubs.@each.messages'),

  upcomingEventsOfMeethubs: function() {

    return this.get('eventInvitationsOfMembersOfAcceptedMeethubs').then(eventInvitationsOfMembersOfAcceptedMeethubs => {

      return Ember.RSVP.all(eventInvitationsOfMembersOfAcceptedMeethubs.map(eventInvitation => {

        return eventInvitation.get('event').then(event => {

          if(event.get('is_upcoming'))
          {
            return event;
          }

        });

      })).then(events => {

        return events.uniq();

      });

    });

  }.property('eventInvitationsOfmembersOfAcceptedMeethubs.@each.event')

});
