import Ember from 'ember';
import {MAP_TYPES} from '../../components/google-map';

export default Ember.Controller.extend({
  needs: "members-area",

  lat:        0,
  lng:        0,
  lat_cache:  0,
  lng_cache:  0,

  zoom:     14,
  type:     'road',
  mapTypes: MAP_TYPES,

  markers: [],

  hasMarkerForCurrentPosition: false,

  getCurrentPosition: function() {
    console.log('Getting your current position...');

    var browserSupportFlag = false;

    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation)
    {
      browserSupportFlag = true;

      var self = this;

      navigator.geolocation.getCurrentPosition
      (
        function(position)
        {
          console.log('Your current position: ', position);
          self.set('lat', position.coords.latitude);
          self.set('lat_cache', position.coords.latitude);
          self.set('lng', position.coords.longitude);
          self.set('lng_cache', position.coords.longitude);

          if(!self.get('hasMarkerForCurrentPosition'))
          {
            self.get('markers').addObject({title: 'your position', lat: position.coords.latitude, lng: position.coords.longitude, isDraggable: false});

            self.set('hasMarkerForCurrentPosition', true);
          }
        },
        function()
        {
          self.handleNoGeolocation(browserSupportFlag);
        }
      );
    }
    // Browser doesn't support Geolocation
    else
    {
      this.handleNoGeolocation(browserSupportFlag);
    }
  },
  handleNoGeolocation: function(errorFlag) {
    var lat = 40.730610;
    var lng = -73.935242;

    if (errorFlag === true) {
      console.error("Geolocation service failed. We've placed you in New York.");
    }
    else {
      console.error("Your browser doesn't support geolocation. We've placed you in New York.");
    }

    this.set('lat', lat);
    this.set('lng', lng);
  },

  actions: {
    center_map: function(location) {
      this.set('lat', location.get('latitude'));
      this.set('lat_cache', location.get('latitude'));
      this.set('lng', location.get('longitude'));
      this.set('lng_cache', location.get('longitude'));
    },
    centerMapOnCurrentPosition: function() {
      this.getCurrentPosition();
    }
  }

});
