import Ember from 'ember';
import {MAP_TYPES} from '../../components/google-map';

export default Ember.Controller.extend({

  lat:      0,
  lng:      0,
  zoom:     14,
  type:     'road',
  mapTypes: MAP_TYPES,

  getCurrentPosition: function()
  {
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
          self.set('lng', position.coords.longitude);
        },
        function()
        {
          handleNoGeolocation(browserSupportFlag);
        }
      );
    }
    // Browser doesn't support Geolocation
    else
    {
      controller.handleNoGeolocation(browserSupportFlag);
    }
  },

  handleNoGeolocation: function(errorFlag)
  {
    var lat = 40.730610;
    var lng = -73.935242;

    if (errorFlag == true) {
      console.error("Geolocation service failed. We've placed you in New York.");
    }
    else {
      console.error("Your browser doesn't support geolocation. We've placed you in New York.");
    }

    this.set('lat', lat);
    this.set('lng', lng);
  }

});
