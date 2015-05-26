import Ember from 'ember';
import Torii from 'simple-auth-torii/authenticators/torii';

/* global FB */

export default Ember.Controller.extend({
  actions: {
    login: function()
    {
      var self = this;
      // this.get('session').open('facebook-oauth2').then(
      this.get('session').authenticate('simple-auth-authenticator:torii', 'facebook-oauth2').then(
        function(authorization) {
          // FB.api is now available. authorization contains the UID and
          // accessToken.
          console.log('SUCCESS: ' + self.get('session.token'));

          self.controllerFor('members-area').set('FB', FB);
          self.controllerFor('members-area').set('hasFacebook', true);
        },
        function(error) {
          console.error(error.stack);
        }
      );
    }
  }
});
