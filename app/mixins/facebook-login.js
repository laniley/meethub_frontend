/* global FB */
import Ember from 'ember';

export default Ember.Mixin.create({

  me: null,
  scope: 'public_profile,email,user_friends,publish_actions',

  login: function() {
    FB.login(() => { this.checkLoginState(); }, { scope: this.get('scope') });
  },

  checkLoginState: function() {
    FB.getLoginStatus(response => {
        this.statusChangeCallback(response);
    });
  },

  getAllComponentModels: function(component) {
    return this.store.query('rocket-component-model', { 'type': component.get('type') }).then(models => {
      return models;
    });
  },

  getMyComponentModelMms: function(component) {
    return component.get('rocketComponentModelMms').then(rocketComponentModelMms => {
      return rocketComponentModelMms;
    });
  },

  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  statusChangeCallback: function(response) {

    console.log('fb login status', response);

    this.set('me', this.get('store').peekRecord('me', 1));

    if (response.status === 'connected')
  	{
  			// Logged into your app and Facebook.
        if(Ember.isEmpty(this.get('me'))) {
          this.get('store').createRecord('me', { id: 1, isLoggedIn: true });
        }
        else {
          this.get('me').set('isLoggedIn', true);
        }

  			this.getUserDataFromFB(this.get('store'));
  	}
  	else if (response.status === 'not_authorized')
  	{
  			// The person is logged into Facebook, but not your app.
        if(Ember.isEmpty(this.me)) {
          this.get('store').createRecord('me', { id: 1, isLoggedIn: false });
        }
        else {
          this.get('me').set('isLoggedIn', false);
          this.transitionTo('login');
        }
  	}
  	else
  	{
  			// The person is not logged into Facebook, so we're not sure if
  			// they are logged into this app or not.
        if(Ember.isEmpty(this.get('me'))) {
          this.get('store').createRecord('me', { id: 1, isLoggedIn: false });
        }
        else {
          this.get('me').set('isLoggedIn', false);
          this.transitionTo('login');
        }
  	}

  },

  // Here we receive the user data from the FB Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  getUserDataFromFB: function() {

    console.log('Welcome!  Fetching your information.... ');

    // var self = this;
    // var store = this.get('store');

  	FB.api('/me', {fields: 'id,email,first_name,last_name,picture.width(120).height(120),gender,friends'}, function(response)
  	{
  		if( !response.error )
  		{
        console.log('Successful login for: ' + response.first_name + " " + response.last_name, response);

        // var user = store.query('user', { fb_id: response.id }).then(users => {
        //
        //     if(Ember.isEmpty(users)) {
        //       user = store.createRecord('user');
        //     }
        //     else {
        //       user = users.get('firstObject');
        //     }
        //
        //     user.set('fb_id', response.id);
        //     user.set('email', response.email);
        //     user.set('first_name', response.first_name);
        //     user.set('last_name', response.last_name);
        //     user.set('img_url', response.picture.data.url);
        //     user.set('gender', response.gender);
        //
        //     user.save().then(user => {
        //
        //       var me = store.peekRecord('me', 1);
        //       me.set('user', user);
        //
        //       self.loadRocket(user);
        //       self.loadLab(user);
        //       self.loadFriends(me, response);
        //     });
        // });
  		}
  		else
  		{
  			console.log(response.error);
        this.transitionTo('login');
  		}
  	});
  }

  // loadFriends: function(me, response) {
  //   console.log('friends', response["friends"]);
  //   response.friends.data.forEach(friend => {
  //     this.store.createRecord('friend', {
  //       me: me,
  //       long_fb_id: friend.id, // real user-id
  //       name: friend.name,
  //       img_url: 'http://graph.facebook.com/' + friend.id + '/picture',
  //       isAlreadyPlaying: true
  //     });
  //   });
  //   console.log('invitable_friends', response.invitable_friends);
  //   response.invitable_friends.data.forEach(friend => {
  //     this.store.createRecord('friend', {
  //       me: me,
  //       long_fb_id: friend.id, // seesion-id
  //       name: friend.name,
  //       img_url: friend.picture.data.url,
  //       isAlreadyPlaying: false
  //     });
  //   });
  // },

});
