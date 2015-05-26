// import Ember from 'ember';
import AuthenticateRoute from './authenticate';
// import Torii from 'simple-auth-torii/authenticators/torii';
import ENV from '../config/environment';

/* global FB */

export default AuthenticateRoute.extend({

  setupController: function(controller) {

    var self = this;

    if(this.controllerFor('members-area').get('hasFacebook'))
    {
      console.log("FB ready");

      this.getUserInfos(controller);
    }
    else
    {
      console.log("FB not ready");

      window.fbAsyncInit = function() {

        FB.init({
          appId      : ENV.fb_app_id,
          cookie     : true,  // enable cookies to allow the server to access
                              // the session
          xfbml      : true,  // parse social plugins on this page
          version    : 'v2.2' // use version 2.2
        });

        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id)) return;
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        self.controllerFor('members-area').set('hasFacebook', true);
        self.controllerFor('members-area').set('FB', FB);

        self.controllerFor('members-area').get('FB').getLoginStatus(function(response) {

          console.log("FB response status: ", response.status);

          if(response.status === "connected")
          {
            self.getUserInfos(controller);
          }
        });

      };
    }
  },

  getUserInfos: function(controller) {

    console.log('get user infos from FB');

    var self = this;

    self.controllerFor('members-area').get('FB').api(
        '/me',
        {fields: 'id,email,first_name,last_name,picture.width(120).height(120),friends'},
        function(response)
    {
      if( !response.error )
      {
        console.log('Successful login to FB for: ' + response.first_name + ' ' + response.last_name, response);

        self.store.find('user', { fb_id: response.id }).then(function(users)
        {
          var last_login = new Date();

          if(Ember.isEmpty(users))
          {
            var user = self.store.createRecord('user', {
              fb_id: response.id,
              first_name: response.first_name,
              last_name: response.last_name,
              picture: 'http://graph.facebook.com/' + response.id + '/picture',
              first_login: true,
              last_login: last_login
            });

            user.save().then
            (
              function()
              {
                user.set('isMe', true);
                controller.set('model', user);
                controller.update();
                self.prepareController(controller, user, response);
              }
            );
          }
          else
          {
            var user = users.get('firstObject');
            user.set('isMe', true);
            user.set('last_login', last_login);
            user.set('first_login', false);
            user.save().then
            (
              function() {
                controller.set('model', user);
                controller.update();
                self.prepareController(controller, user, response);
              }
            );
          }
        });
      }
      else
      {
        console.log(response.error);
      }

    });
  },

  prepareController: function(controller, user, response) {

    var self = this;

    if(response.friends.data.length > 0)
    {
      for(var i = 0; i < response.friends.data.length; i++)
      {
        var friend_id = response.friends.data[i].id;

        self.store.find('friend', { fb_id: friend_id });

        self.store.find('user', { fb_id: friend_id }).then(function(users)
        {
          if(Ember.isEmpty(users))
          {
            self.controllerFor('members-area').get('FB').api('/' + friend_id, function(friend_response)
            {
              if( !friend_response.error )
              {
                // console.log('friend: ', friend_response);

                self.store.createRecord('friend', {
                    fb_id: friend_response.id,
                    first_name: friend_response.first_name,
                    last_name: friend_response.last_name,
                    picture: 'http://graph.facebook.com/' + friend_response.id + '/picture',
                    gender: friend_response.gender,
                    first_login: true
                });

                var friend = self.store.createRecord('user', {
                    fb_id: friend_response.id,
                    first_name: friend_response.first_name,
                    last_name: friend_response.last_name,
                    picture: 'http://graph.facebook.com/' + friend_response.id + '/picture',
                    gender: friend_response.gender,
                    first_login: true
                });

                friend.save().then(function() {
                  user.get('friends').then(function(friends) {
                    friends.pushObject(friend);
                    user.save();
                  });
                });
              }
              else
              {
                console.log(friend_response.error);
              }
            });
          }
          else
          {
            user.get('friends').then(function(friends) {
              friends.pushObject(users.get('firstObject'));
              user.save();
            });
          }
        });
      }
    }

    self.controllerFor('members-area.index').set('model', user);
    self.controllerFor('members-area.meethubs.index').set('model', user);
    self.controllerFor('members-area.messages.index').set('model', user);
    self.controllerFor('members-area.friends').set('model', user);
    self.controllerFor('members-area.friends.index').set('model', user);
  }

});
