import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  sortProperties: ['created_at:desc'],
  sortedMessages: Ember.computed.sort('filteredMessages', 'sortProperties'),

  queryParams: ['event_inv', 'meethub_inv'],
  event_inv: true,
  meethub_inv: true,

  filteredMessages: function() {

    var me = this.get('membersArea_controller').get('model');
    var messages = this.get('model').filterBy('to_user', me);
    var event_inv = this.get('event_inv');
    var meethub_inv = this.get('meethub_inv');
    var filteredMessages = messages;

    if(event_inv === false || event_inv === 'false') {
      filteredMessages = filteredMessages.filter(function(message) {
        return message.get('isEventInvitation') === false;
      });
    }

    if(meethub_inv === false || meethub_inv === 'false')
    {
      filteredMessages = filteredMessages.filter(function(message) {
        return message.get('isMeethubInvitation') === false;
      });
    }

    return filteredMessages;

  }.property('model.@each', 'event_inv', 'meethub_inv', 'membersArea_controller.model'),

  isGerman: function() {
    if(Ember.I18n.locale === 'de')
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('Ember.I18n.locale'),

  actions: {
    toggleMessage: function(message) {
      if(message.get('isOpen') === false)
      {
        message.set('isOpen', true);

        if(message.get('hasBeenRead') === false)
        {
          message.set('hasBeenRead', true);
          message.save();
        }
      }
      else
      {
        message.set('isOpen', false);
      }
    },
    toggleMeethubInvFilter: function() {
      this.toggleProperty('meethub_inv');
    },
    toggleEventInvFilter: function() {
      this.toggleProperty('event_inv');
    },
    // Event-Invitations
    // acceptEventInvitation: function(eventInvitation_id) {
    //   this.store.find('eventInvitation', eventInvitation_id).then(function(eventInvitation) {
    //     eventInvitation.set('status', 'attending');
    //     eventInvitation.save();
    //   });
    // },
    // maybeAcceptEventInvitation: function(eventInvitation_id) {
    //   this.store.find('eventInvitation', eventInvitation_id).then(function(eventInvitation) {
    //     eventInvitation.set('status', 'maybe');
    //     eventInvitation.save();
    //   });
    // },
    // declineEventInvitation: function(eventInvitation_id) {
    //   this.store.find('eventInvitation', eventInvitation_id).then(function(eventInvitation) {
    //     eventInvitation.set('status', 'declined');
    //     eventInvitation.save();
    //   });
    // },

    // Meethub-Invitations
    acceptMeethubInvitation: function(id) {
      this.store.find('meethubInvitation', id).then(function(meethubInvitation) {
        meethubInvitation.set('status', 'accepted');
        meethubInvitation.save();
      });
    },
    declineMeethubInvitation: function(id) {
      this.store.find('meethubInvitation', id).then(function(meethubInvitation) {
        meethubInvitation.set('status', 'declined');
        meethubInvitation.save();
      });
    }
  }
});
