import Ember from 'ember';
import Torii from 'simple-auth-torii/authenticators/torii';

export default Ember.Controller.extend({
  actions: {
    login: function()
    {
      this.get('session').authenticate('simple-auth-authenticator:torii', 'facebook-connect').then(
        function(authorization) {
          // FB.api is now available. authorization contains the UID and
          // accessToken.
          console.log('SUCCESS: ' + authorization);
        },
        function(error) {
          console.error(error.stack);
        }
      );
    }
  }
});
