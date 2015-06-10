import Ember from 'ember';
import AuthenticatorTorii from 'simple-auth-torii/authenticators/torii';

export var initialize = function() {
  AuthenticatorTorii.reopen({    
    // session data has changed or app that already had persisted session was opened
    restore: function(data) {     
      var resolveData = data || {};
      this.provider = resolveData.provider;
      return new Ember.RSVP.Promise(function(resolve) { resolve(resolveData); });
    }

  });
};

export default {
  name: 'reopen-authenticator-torii',
  before: 'simple-auth-torii',
  initialize: initialize
};