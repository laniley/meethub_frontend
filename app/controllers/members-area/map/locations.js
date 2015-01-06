import Ember from 'ember';

export default Ember.Controller.extend({
  needs: "members-area/map",
  map_controller: Ember.computed.alias("controllers.members-area/map"),

  actions: {
    center_map: function(location) {
      this.get('map_controller').set('lat', location.get('latitude'));
      this.get('map_controller').set('lng', location.get('longitude'));
    },
    centerMapOnCurrentPosition: function() {
      this.get('map_controller').getCurrentPosition();
    }
  }
});