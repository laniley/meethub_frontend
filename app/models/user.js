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

  meethubInvitations: DS.hasMany('meethub-invitation', { async: true }),
  meethubComments: DS.hasMany('meethub-comment', { async: true, inverse: 'user' }),
  eventInvitations: DS.hasMany('event-invitation', { async: true, inverse: 'invited_user'}),
  messages: DS.hasMany('message', { async: true, inverse: 'to_user' }),
  friends: DS.hasMany('friend', { async: true, inverse: 'user' }),

  created_at: DS.attr(),
  updated_at: DS.attr(),
  first_login: DS.attr('boolean', { defaultValue: true }),
  last_login: DS.attr(),

  /* unit-test exists */
  name: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  }.property('first_name', 'last_name'),

  /* unit-test exists */
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

  }.property('meethubInvitations.@each.status'),

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

  }.property('acceptedMeethubInvitations.length'),

  membersOfAcceptedMeethubs: function() {

    return DS.PromiseArray.create({

      promise: this.get('acceptedMeethubs').then(acceptedMeethubs => {

        return Ember.RSVP.all(acceptedMeethubs.map(acceptedMeethub => {

          return acceptedMeethub.get('acceptedInvitations').then(acceptedInvitations => {

            return Ember.RSVP.all(acceptedInvitations.map(acceptedInvitation => {

              return acceptedInvitation.get('invited_user').then(invitedUser => {

                return invitedUser;

              });

            })).then(invitedUsers => {

              return invitedUsers.uniq();

            });

          });

        })).then(invitedUsers => {

          if(invitedUsers.length > 0)
          {
            return invitedUsers.reduce((previousValue, currentValue) => {

              return previousValue.concat(currentValue);

            }).uniq();
          }
          else
          {
            return [];
          }

        });

      })

    });

  }.property('acceptedMeethubs.@each'),

  eventInvitationsOfMembersOfAcceptedMeethubs: function() {

    return DS.PromiseArray.create({

      promise: this.get('membersOfAcceptedMeethubs').then(members => {

        // map members on messages, that are eventInvitations
        return Ember.RSVP.all(members.map(member => {

          return member.get('messages').then(messages => {

            return messages.filterBy('isEventInvitation', true);

          });

        })).then(eventInvitationMessagesPerMember => {

          if(eventInvitationMessagesPerMember.length > 0)
          {
            return Ember.RSVP.all(eventInvitationMessagesPerMember.reduce((previousValue, currentValue) => {

              return previousValue.concat(currentValue);

            }).uniq().map(eventInvitationMessage => {

              return eventInvitationMessage.get('eventInvitation').then(eventInvitation => {

                return eventInvitation;

              });

            })).then(eventInvitations => {

              return eventInvitations.uniq();

            });
          }
          else
          {
            return [];
          }

        });

      })

    });

  }.property('membersOfAcceptedMeethubs.@each'),

  upcomingEventsOfMeethubs: function() {

    return DS.PromiseArray.create({

      promise: this.get('eventInvitationsOfMembersOfAcceptedMeethubs').then(eventInvitationsOfMembersOfAcceptedMeethubs => {

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

      })

    });

  }.property('eventInvitationsOfmembersOfAcceptedMeethubs.@each')

});
