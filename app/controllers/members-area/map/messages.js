import Ember from 'ember';

export default Ember.Controller.extend({
  needs: 'members-area/map',
  map_controller: Ember.computed.alias("controllers.members-area/map"),

  isGerman: function() {
    if(Ember.I18n.locale == 'de')
      return true;
    else
      return false;
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
    centerMap: function(location) {
      this.get('map_controller').centerMap(location);
    },
    acceptEventInvitation: function(eventInvitation) {
      eventInvitation.set('status', 'attending');
      eventInvitation.save();
    },
    maybeAcceptEventInvitation: function(eventInvitation) {
      eventInvitation.set('status', 'maybe');
      eventInvitation.save();
    },
    declineEventInvitation: function(eventInvitation) {
      eventInvitation.set('status', 'declined');
      eventInvitation.save();
    }
  }
});
