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
    acceptEvent: function(event) {
      event.get('attendees_accepted').pushObject(this.get('user'));
    },
    maybeEvent: function(event) {
      event.get('attendees_accepted').pushObject(this.get('user'));
    },
    declineEvent: function(event) {

    }
  }
});
