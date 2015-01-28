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

        controller.set('FB', FB);
        self.controllerFor('login').set('hasFacebook', true);

        self.getUserInfos(controller);
      });
    }
  },

  getUserInfos: function(controller) {

    console.log('get user infos from FB');

    var self = this;

    FB.api('/me', {fields: 'id,first_name,last_name,picture.width(120).height(120),friends'}, function(response)
    {
      if( !response.error )
      {
        console.log('Successful login to FB for: ' + response.first_name + ' ' + response.last_name, response);

        var user = self.store.createRecord('user', {
          fb_id: response.id,
          first_name: response.first_name,
          last_name: response.last_name,
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
                console.log('friend: ', friend_response);

                self.handleFBFriendResponse(user, friend_response);
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

            // load Meethubs from BE
            self.store.find('meethub', { member: user.get('id') });
            // load Messages from BE
            // self.store.find('message', { user: user.get('id') });
            // load EventInvitations from BE
            // self.store.find('eventInvitation', { invited_user: user.get('id') });

            self.controllerFor('members-area').loadUserEventsFromFB();

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

  handleFBFriendResponse: function(user, response) {

    var self = this;

    var friend = this.store.createRecord('user', {
        fb_id: response.id,
        first_name: response.first_name,
        last_name: response.last_name,
        picture: 'http://graph.facebook.com/' + response.id + '/picture',
        gender: response.gender
    });

    user.get('friends').pushObject(friend);

    self.controllerFor('members-area').loadFriendEventsFromFB(response.id);
  }

});
