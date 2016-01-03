/* global FB */
import Ember from 'ember';

export default Ember.Mixin.create({

  me: null,
  scope: 'public_profile,email,user_friends',

  login: function() {
    FB.login(() => { this.checkLoginState(); }, { scope: this.get('scope') });
  },

  checkLoginState: function() {
    FB.getLoginStatus(response => {
        this.statusChangeCallback(response);
    });
  },

  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  statusChangeCallback: function(response) {

    console.log('fb login status', response);

    this.set('me', this.store.peekRecord('me', 1));

    if (response.status === 'connected') {
  			// Logged into your app and Facebook.
        if(Ember.isEmpty(this.get('me'))) {
          this.store.createRecord('me', { id: 1, isLoggedIn: true });
        }
        else {
          this.get('me').set('isLoggedIn', true);
        }

  			this.getUserDataFromFB(this.get('store'));

        if(this.controllerFor('application').get('currentRouteName') === 'login') {
          this.transitionTo('index');
        }
  	}
  	else if (response.status === 'not_authorized') {
  			// The person is logged into Facebook, but not your app.
        if(Ember.isEmpty(this.me)) {
          this.get('store').createRecord('me', { id: 1, isLoggedIn: false });
        }
        else {
          this.get('me').set('isLoggedIn', false);
        }
        this.transitionTo('login');
  	}
  	else {
  			// The person is not logged into Facebook, so we're not sure if
  			// they are logged into this app or not.
        if(Ember.isEmpty(this.get('me'))) {
          this.get('store').createRecord('me', { id: 1, isLoggedIn: false });
        }
        else {
          this.get('me').set('isLoggedIn', false);
        }
        this.transitionTo('login');
  	}

  },

  // Here we receive the user data from the FB Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  getUserDataFromFB: function() {

    console.log('Welcome!  Fetching your information.... ');

  	FB.api('/me', {fields: 'id,email,first_name,last_name,picture.width(120).height(120),gender,friends'}, response => {
  		if( !response.error ) {
        console.log('Successful login for: ' + response.first_name + " " + response.last_name, response);

        this.store.query('user', { fb_id: response.id }).then(users => {

            var user = null;

            if(Ember.isEmpty(users)) {
              user = this.store.createRecord('user');
              user.set('fb_id', response.id);
              user.set('first_login', true);
              user.set('last_login', new Date());
            }
            else {
              user = users.get('firstObject');
              user.set('first_login', false);
              user.set('last_login', user.get('updated_at'));
            }

            user.set('email', response.email);
            user.set('first_name', response.first_name);
            user.set('last_name', response.last_name);
            user.set('picture', 'http://graph.facebook.com/' + response.id + '/picture');

            user.save().then(user => {
              this.get('me').set('user', user);
              this.saveFriends(response, () => {
                this.controllerFor('application').syncWithFB();
              });
            });
        });
      }
  		else {
  			console.log(response.error);
        this.transitionTo('login');
  		}
  	});
  },

  saveFriends: function(response, callback) {
    console.log('friends', response["friends"]);
    // for each friend
    response.friends.data.forEach(aFriend => {
      FB.api(aFriend.id, {fields: 'id,first_name,last_name'}, friend => {
        this.store.query('user', { fb_id: friend.id }).then(users => {
          var user_friend = null;
          if(Ember.isEmpty(users)) {
            user_friend = this.store.createRecord('user', {
              fb_id: friend.id // real user-id
            });
          }
          else {
            user_friend = users.get('firstObject');
          }
          user_friend.set('picture', 'http://graph.facebook.com/' + friend.id + '/picture');
          user_friend.set('first_name', friend.first_name);
          user_friend.set('last_name', friend.last_name);
          user_friend.save().then(user_friend => {
          var me = this.store.peekRecord('me', 1);
            this.store.query('friend', { 'user_id': me.get('user').get('id'), 'friend_id': user_friend.get('id') }).then(friends => {
              var aFriend = null;
              if(Ember.isEmpty(friends)) {
                aFriend = this.store.createRecord('friend', {
                  user: me.get('user'),
                  friend: user_friend
                });
              }
              else {
                aFriend = friends.get('firstObject');
              }
              aFriend.save().then(() => {
                if(callback) {
                  callback();
                }
              });
            });
          });
        });
      });
    });
  }

});
