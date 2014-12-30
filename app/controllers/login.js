import Ember from 'ember';
import Torii from 'simple-auth-torii/authenticators/torii';

export default Ember.Controller.extend({
  actions: {
    login: function()
    {
      var controller = this.controllerFor('login');

      this.get('session').authenticate('simple-auth-authenticator:torii', 'facebook-connect').then(function(authorization){
        // FB.api is now available. authorization contains the UID and
        // accessToken.
        controller.set('hasFacebook', true);
      });
    }
  }
});
