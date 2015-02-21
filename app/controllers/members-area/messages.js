import Ember from 'ember';

export default Ember.Controller.extend({

  sortProperties: ['created_at:desc'],
  sortedMessages: Ember.computed.sort('model', 'sortProperties'),

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
