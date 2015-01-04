import Ember from 'ember';
import AuthenticateRoute from './authenticate';

/* global FB */

export default AuthenticateRoute.extend({

  setupController: function(controller) {

    var self = this;

    if(this.controllerFor('login').get('hasFacebook'))
    {
      this.getUserInfos(controller);
    }
    else
    {
      this.get('torii').open('facebook-connect').then(function(authorization){
        // FB.api is now available. authorization contains the UID and
        // accessToken.
        self.controllerFor('login').set('hasFacebook', true);

        self.getUserInfos(controller);
      });
    }
  },

  getUserInfos: function(controller) {

    console.log('get user infos from FB');

    var self = this;

    FB.api('/me', {fields: 'id,name,picture.width(120).height(120),friends'}, function(response)
    {
      if( !response.error )
      {
        console.log('Successful login to FB for: ' + response.name, response);

        var user = self.store.createRecord('user', {
          fb_id: response.id,
          name: response.name,
          picture: response.picture.data.url
        });

        if(response.friends.data.length > 0)
        {

        }

        user.save().then
        (
          function()
          {
            controller.set('model', user);

            FB.api('/me/events/attending', function(response)
            {
              if( !response.error )
              {
                console.log(response);

                for(var i = 0; i < response.data.length; i++)
                {
                  self.handleFBEventResponse(response.data[i]);
                }
              }
              else
              {
                console.log(response.error);
              }
            });

            FB.api('/me/events/maybe', function(response)
            {
              if( !response.error )
              {
                console.log(response);

                for(var i = 0; i < response.data.length; i++)
                {
                  self.handleFBEventResponse(response.data[i]);
                }
              }
              else
              {
                console.log(response.error);
              }
            });

            FB.api('/1523279254598611', function(response)
            {
              if( !response.error )
              {
                console.log(response);

                self.handleFBEventResponse(response);
              }
              else
              {
                console.log(response.error);
              }
            });

            self.transitionTo('members-area.map.meethubs');
          }
        );
      }
      else
      {
        console.log(response.error);
      }

    });
  },

  handleFBEventResponse: function(response) {
    var location = this.store.createRecord('location', {
      fb_id: response.venue.id,
      name: response.location,
      country: response.venue.country,
      city: response.venue.city,
      zip: response.venue.zip,
      street: response.venue.street,
      latitude: response.venue.latitude,
      longitude: response.venue.longitude
    });

    var event = this.store.createRecord('event', {
      fb_id: response.id,
      name: response.name,
      description: response.descrption,
      start_time: response.start_time,
      timezone: response.timezone,
      location: location
    });

    var map_controller = this.controllerFor('members-area.map');

        map_controller.get('markers').addObject({title: response.location, lat: response.venue.latitude, lng: response.venue.longitude, isDraggable: false});

        map_controller.getCurrentPosition();
  }

});
