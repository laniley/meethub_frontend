import Ember from 'ember';

export default Ember.Controller.extend({

  sortProperties: ['created_at:desc'],
  sortedMessages: Ember.computed.sort('filteredMessages', 'sortProperties'),

  queryParams: ['event_inv', 'meethub_inv'],
  event_inv: null,
  meethub_inv: null,

  filteredMessages: function() {

    var self = this;
    var messages = this.get('model');
    var event_inv = this.get('event_inv');
    var meethub_inv = this.get('meethub_inv');
    var filteredMessages = messages;

    if(event_inv === 'true') {
      console.log('event');
      filteredMessages = filteredMessages.filter(function(message) {
        return message.get('isEventInvitation') === true;
      });
    }

    if(meethub_inv === 'true')
    {
      filteredMessages = filteredMessages.filter(function(message) {
        return message.get('isMeethubInvitation') === true;
      });
    }

    return filteredMessages;

  }.property('model.@each', 'event_inv', 'meethub_inv'),

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
    acceptEventInvitation: function(eventInvitation_id) {
      this.store.find('eventInvitation', eventInvitation_id).then(function(eventInvitation) {
        eventInvitation.set('status', 'attending');
        eventInvitation.save();
      });
    },
    maybeAcceptEventInvitation: function(eventInvitation_id) {
      this.store.find('eventInvitation', eventInvitation_id).then(function(eventInvitation) {
        eventInvitation.set('status', 'maybe');
        eventInvitation.save();
      });
    },
    declineEventInvitation: function(eventInvitation_id) {
      this.store.find('eventInvitation', eventInvitation_id).then(function(eventInvitation) {
        eventInvitation.set('status', 'declined');
        eventInvitation.save();
      });
    }
  }
});
