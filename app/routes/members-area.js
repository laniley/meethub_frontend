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

                var location = self.store.createRecord('location', {
                  fb_id: response.venue.id,
                  name: response.location,
                  country: response.venue.country,
                  city: response.venue.city,
                  zip: response.venue.zip,
                  street: response.venue.street,
                  latitude: response.venue.latitude,
                  longitude: response.venue.longitude
                });

                var event = self.store.createRecord('event', {
                  fb_id: response.id,
                  name: response.name,
                  description: response.descrption,
                  start_time: response.start_time,
                  timezone: response.timezone,
                  location: location
                });

                var map_controller = self.controllerFor('members-area.map');
                    map_controller.getCurrentPosition();

                self.transitionTo('members-area.map.meethubs');
              }
              else
              {
                console.log(response.error);
              }
            });
          }
        );
      }
      else
      {
        console.log(response.error);
      }

    });
  },

  loadUserData: function(callback) {
    // $.ajax
    // ({
    //   url: controller_path_user + "?mode=get" +
    //       "&id=" + userModel.id

    //   ,success: function( data )
    //   {
    //     console.log(data);

    //     if(data.indexOf("ERROR") == -1)
    //     {
    //       var json = JSON.parse(data);

    //       userModel.volume = json[0].volume;
    //       userModel.setLanguage(json[0].locale);

    //       if( json[0].first_login == 1 )
    //         userModel.first_login = true;
    //       else
    //         userModel.first_login = false;

    //       i18n.setLng(json[0].locale, function(t)
    //       {
    //         if(userModel.first_login)
    //           hasher.setHash('section/settings');
    //         else if(charactersCache.length > 0)
    //           hasher.setHash('section/characters');
    //         else
    //           hasher.setHash('section/characters/new?race=human');

    //         callback();
    //       });
    //     }
    //   }
    // });
  }

});
