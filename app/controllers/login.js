import Ember from 'ember';
// import Torii from 'simple-auth-torii/authenticators/torii';

/* global FB */

export default Ember.Controller.extend({
  actions: {
    login: function()
    {
      var self = this;

      this.get('session').authenticate('simple-auth-authenticator:torii', 'facebook-connect').then(
        function() {
          // FB.api is now available. authorization contains the UID and
          // accessToken.
          // console.log('SUCCESS: ', self.get('session').get('secure'));

          // Ember.$.cookie('user_id', self.get('session').get('secure.userId'));
          // Ember.$.cookie('accessToken', self.get('session').get('secure.accessToken'));

          // self.controllerFor('members-area').set('FB', FB);
          // self.controllerFor('members-area').set('hasFacebook', true);
        },
        function(error) {
          console.error(error.stack);
        }
      );
    }
  }
});
