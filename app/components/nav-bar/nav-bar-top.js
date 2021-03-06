/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({

  me: null,

  actions: {
    logout() {
      var me = this.store.peekRecord('me', 1);
      me.set('isLoggedIn', false);
      FB.api( 'me/permissions', 'DELETE', function(response) {
        console.log(response);
      });
      this.router.transitionTo('login');
    }
  }
});
