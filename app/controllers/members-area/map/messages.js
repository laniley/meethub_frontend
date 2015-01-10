import Ember from 'ember';

export default Ember.Controller.extend({
  needs: "members-area/map",
  map_controller: Ember.computed.alias("controllers.members-area/map"),

  actions: {
    toggleMessage: function(message) {
      if(message.get('isOpen') === false)
      {
        message.set('isOpen', true);

        if(message.get('hasBeenRead') === false)
        {
          message.set('hasBeenRead', true);
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
  }
});
