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

        self.store.find('user', { fb_id: response.id }).then(function(users)
        {
          if(Ember.isEmpty(users))
          {
            var user = self.store.createRecord('user', {
              fb_id: response.id,
              first_name: response.first_name,
              last_name: response.last_name,
              picture: 'http://graph.facebook.com/' + response.id + '/picture'
            });

            user.save().then
            (
              function()
              {
                self.prepareController(controller, user, response);
              }
            );
          }
          else
          {
            var user = users.get('firstObject');
            self.prepareController(controller, user, response);
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

    controller.set('model', user);

    // load Meethubs from BE
    self.store.find('meethub', { member: user.get('id') });
    // load Messages from BE
    // self.store.find('message', { user: user.get('id') });
    // load EventInvitations from BE
    // self.store.find('eventInvitation', { invited_user: user.get('id') });

    if(response.friends.data.length > 0)
    {
      for(var i = 0; i < response.friends.data.length; i++)
      {
        var friend_id = response.friends.data[i].id;

        self.store.find('user', { fb_id: friend_id }).then(function(users)
        {
          if(Ember.isEmpty(users))
          {
            FB.api('/' + friend_id, function(friend_response)
            {
              if( !friend_response.error )
              {
                console.log('friend: ', friend_response);

                var friend = self.store.createRecord('user', {
                    fb_id: friend_response.id,
                    first_name: friend_response.first_name,
                    last_name: friend_response.last_name,
                    picture: 'http://graph.facebook.com/' + friend_response.id + '/picture',
                    gender: friend_response.gender
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
            var friend = users.get('firstObject');
            user.get('friends').then(function(friends) {
              friends.pushObject(friend);
              user.save();
            });
          }
        });
      }
    }

    // self.controllerFor('members-area').loadUserEventsFromFB();

    var map_controller = self.controllerFor('members-area.map');
        map_controller.getCurrentPosition();

    self.transitionTo('members-area.meethubs.map');
  }

});
