// import Ember from 'ember';
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
      this.get('torii').open('facebook-connect').then(function(){
        // FB.api is now available. authorization contains the UID and accessToken.
        // var UID = authorization.UID;
        // var accessToken = authorization.accessToken;

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
          for(var i = 0; i < response.friends.data.length; i++)
          {
            FB.api('/' + response.friends.data[i].id, function(friend_response)
            {
              if( !friend_response.error )
              {
                console.log(friend_response);

                // for(var i = 0; i < response.data.length; i++)
                // {
                //   self.handleFBEventResponse(response.data[i], 'attending');
                // }
              }
              else
              {
                console.log(friend_response.error);
              }
            });
          }
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
                  self.handleFBEventResponse(response.data[i], 'attending');
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
                  self.handleFBEventResponse(response.data[i], 'maybe');
                }
              }
              else
              {
                console.log(response.error);
              }
            });

            FB.api('/me/events/not_replied', function(response)
            {
              if( !response.error )
              {
                console.log(response);

                for(var i = 0; i < response.data.length; i++)
                {
                  self.handleFBEventResponse(response.data[i], 'not_replied');
                }
              }
              else
              {
                console.log(response.error);
              }
            });

            var map_controller = self.controllerFor('members-area.map');
                map_controller.getCurrentPosition();

            self.transitionTo('members-area.meethubs.map');
          }
        );
      }
      else
      {
        console.log(response.error);
      }

    });
  },

  handleFBEventResponse: function(response, status) {

    var map_controller = this.controllerFor('members-area.map');

    var self = this;

    var location = null;

    if(response.venue)
    {
      location = this.store.createRecord('location', {
        fb_id: response.venue.id,
        name: response.location,
        country: response.venue.country,
        city: response.venue.city,
        zip: response.venue.zip,
        street: response.venue.street,
        latitude: response.venue.latitude,
        longitude: response.venue.longitude
      });

      map_controller.get('markers').addObject({title: response.location, lat: response.venue.latitude, lng: response.venue.longitude, isDraggable: false});
    }
    else
    {
        location = this.store.createRecord('location', {
        name: response.location,
      });
    }

    location.save().then(function() {
      var date_time_arr = response.start_time.split('T');
      var date_time = date_time_arr[1];
      var date_day = date_time_arr[0];

      var event = self.store.createRecord('event', {
        fb_id: response.id,
        name: response.name,
        description: response.descrption,
        start: moment(response.start_time, "YYYY-MM-DDTHH:mm:ss.SSSSZ"),
        end: moment(response.start_time, "YYYY-MM-DDTHH:mm:ss.SSSSZ").add(1, 'hours'),
        start_time: date_time,
        start_date: date_day,
        timezone: response.timezone,
        location: location,
      });

      event.save().then(function() {

        var message = self.store.createRecord('message', {
          fb_id: response.id,
          subject: response.name,
          user: self.get('controller').get('model')
        });

        message.save().then(function() {

          var eventInvitation = self.store.createRecord('eventInvitation', {
            event: event,
            invited_user: self.get('controller').get('model'),
            status: status,
            message: message
          });

          eventInvitation.save();

          message.set('eventInvitation', eventInvitation);
        });

      });

    });
  }

});
