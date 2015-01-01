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
          id: response.id,
          name: response.name,
          picture: response.picture.data.url
        });

        if(response.friends.data.length > 0)
        {

        }

        // user.save().then
        // (
        //   function()
        //   {
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
                  id: response.venue.id,
                  name: response.location,
                  country: response.venue.country,
                  city: response.venue.city,
                  zip: response.venue.zip,
                  street: response.venue.street,
                  latitude: response.venue.latitude,
                  longitude: response.venue.longitude
                });

                var event = self.store.createRecord('event', {
                  id: response.id,
                  name: response.name,
                  description: response.descrption,
                  start_time: response.start_time,
                  timezone: response.timezone,
                  location: location
                });

                var map_controller = self.controllerFor('members-area.map');
                    map_controller.getCurrentPosition();
                    // map_controller.set('lat', response.venue.latitude);
                    // map_controller.set('lng', response.venue.longitude);

                self.transitionTo('members-area.map.meethubs');
              }
              else
              {
                console.log(response.error);
              }
            });

        //     console.log('charachters', user.get('characters.length'));


        //     // if(userModel.first_login)
        //     //   self.transitionTo('members-area.settings');
        //     if(user.get('characters.length') > 0)
        //     {
        //       self.transitionTo('members-area.characters');
        //     }
        //     else
        //     {
        //       var new_char = self.store.createRecord('character', {
        //         name: '',
        //         user: user,
        //         race: 'human',
        //         char_class: 'mage',
        //         gender: 'female'
        //       });

        //       self.controllerFor('members-area.characters.new').set('model', new_char);

        //       self.transitionTo('members-area.characters.new');
        //     }

        //   // loadUserData(function()
        //   // {
        //     // $('#audio-player').mediaelementplayer
        //     // ({
        //     //         alwaysShowControls: true,
        //     //         features: ['volume'],
        //     //         audioVolume: 'horizontal',
        //     //         startVolume: userModel.volume,
        //     //         success: function(player, node)
        //     //         {
        //     //             $(".mejs-horizontal-volume-slider").show();

        //     //             if(userModel.volume == 0)
        //     //             {
        //     //               player.muted = true;
        //     //             }

        //     //             player.play();

        //     //             player.addEventListener('ended', function(e)
        //     //             {
        //     //               // player.src = 'audio/forest_song.mp3';
        //     //               player.src = 'audio/choral.mp3';
        //     //                 // player.src = 'audio/guitar_loop.mp3';
        //     //                 player.load();
        //     //                 player.play();
        //     //             });

        //     //             player.addEventListener('volumechange', function(e)
        //     //             {
        //     //               if(player.muted)
        //     //               {
        //     //                 saveVolume(0);
        //     //             $("#mute-unmute > i").removeClass("fa-volume-up");
        //     //             $("#mute-unmute > i").addClass("fa-volume-off");
        //     //                 $("#current-volume").width(0);
        //     //               }
        //     //               else
        //     //               {
        //     //                 saveVolume(player.volume);

        //     //                 if(player.volume == 0)
        //     //                 {
        //     //                   $(".mejs-volume-button").removeClass("mejs-mute");
        //     //                   $(".mejs-volume-button").addClass("mejs-unmute");

        //     //                   $("#mute-unmute > i").removeClass("fa-volume-up");
        //     //               $("#mute-unmute > i").addClass("fa-volume-off");
        //     //                 }
        //     //                 else
        //     //                 {
        //     //                   $("#mute-unmute > i").removeClass("fa-volume-off");
        //     //               $("#mute-unmute > i").addClass("fa-volume-up");
        //     //                 }

        //     //                 $("#current-volume").width(100 * player.volume);
        //     //               }
        //     //             });
        //     //         }
        //     // });
        //   // });
        //   },
        //   function(resp)
        //   {
        //     console.log(resp);
        //   }
        // );

        // $("#fb-like").html('<iframe src="//www.facebook.com/plugins/like.php?href=https%3A%2F%2Fwww.facebook.com%2Fskillforgegame&amp;width=200&amp;layout=button_count&amp;action=like&amp;show_faces=false&amp;share=true&amp;height=21&amp;appId=609402455837135" scrolling="no" frameborder="0" style="border:none; overflow:hidden; width:200px; height:21px;" allowTransparency="true"></iframe>');
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
