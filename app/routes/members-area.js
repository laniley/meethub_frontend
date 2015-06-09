import Ember from 'ember';
import ENV from '../config/environment';
import AuthenticateRoute from './authenticate';

export default AuthenticateRoute.extend({

  // model: function() {
  //   var userArray = this.store.find('user', { 'fb_id': Ember.$.cookie('user_id') });
  //   return userArray.get('firstObject');
  // },

  setupController: function(controller) {
    // controller.set('model', model);
    this.initFB(controller);
  },

  initFB: function(controller) {

    var self = this;

    if(controller.get('hasFacebook'))
    {
      console.log("FB ready");

      self.getUserInfosFromFB(controller);
    }
    else
    {
      console.log("FB not ready - initialising...");

      this.get('session').restore('simple-auth-authenticator:torii', 'facebook-connect').then(
        function() {

          console.log("SESSION", self.get('session').get('content'));
          console.log("SESSION", self.get('session').get('store'));

          // window.fbAsyncInit = function() {

          //   (function(d, s, id) {
          //     var js, fjs = d.getElementsByTagName(s)[0];
          //     if (d.getElementById(id))
          //     {
          //       return;
          //     }
          //     js = d.createElement(s); js.id = id;
          //     js.src = "//connect.facebook.net/en_US/sdk.js";
          //     fjs.parentNode.insertBefore(js, fjs);
          //   }(document, 'script', 'facebook-jssdk'));

          //   FB.init({
          //     appId      : ENV.fb_app_id,
          //     cookie     : true,  // enable cookies to allow the server to access the session
          //     xfbml      : true,  // parse social plugins on this page
          //     version    : 'v2.2' // use version 2.2
          //   });

          //   controller.set('hasFacebook', true);
          //   controller.set('FB', FB);

          //   console.log('FB initialised');

          //   controller.get('FB').getLoginStatus(function(response) {

          //     console.log("FB response status: ", response.status);

          //     if(response.status === "connected")
          //     {
          //       self.getUserInfosFromFB(controller);
          //     }
          //     else
          //     {
          //       self.get('session').invalidate();
          //       self.transitionTo('login');
          //     }

          //   });

          // };
        },
        function(error) {
          console.error(error.stack);
        }
      );

    }
  },

  getUserInfosFromFB: function(controller) {

    var self = this;

    controller.get('FB').api(
        '/me',
        {fields: 'id, email, first_name, last_name, picture.width(120).height(120)'},
        function(response)
    {
      if( !response.error )
      {
        console.log('Successful login to FB for: ' + response.first_name + ' ' + response.last_name, response);

        var user = null;

        self.store.find('user', { fb_id: response.id }).then(function(users)
        {
          var last_login = new Date();

          if(Ember.isEmpty(users))
          {
            user = self.store.createRecord('user', {
              fb_id: response.id,
              email: response.email,
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
                controller.syncWithFB();
              }
            );
          }
          else
          {
            user = users.get('firstObject');
            user.set('isMe', true);
            user.set('email', response.email);
            user.set('last_login', user.get('updated_at'));
            user.set('first_login', false);
            user.save().then
            (
              function() {
                controller.set('model', user);
                controller.update();
                controller.syncWithFB();
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
  }

});
