import Ember from 'ember';
import ENV from '../config/environment';
import AuthenticatorTorii from 'simple-auth-torii/authenticators/torii';

export var initialize = function() {
  AuthenticatorTorii.reopen({    
    // session data has changed or app that already had persisted session was opened
    restore: function(data) {     
      var resolveData = data || {};
      this.provider = resolveData.provider;

      console.log(FB);

      // var settings = {
      //                 appId      : ENV.fb_app_id,
      //                 cookie     : true,  // enable cookies to allow the server to access the session
      //                 xfbml      : true,  // parse social plugins on this page
      //                 version    : 'v2.2' // use version 2.2
      //               };

      // var original = window.fbAsyncInit;
      
      // new Ember.RSVP.Promise(function(resolve, reject){

      //   window.fbAsyncInit = function(){

      //     FB.init(settings);
      //     Ember.run(null, resolve);

      //   };

      //   $.getScript('//connect.facebook.net/en_US/sdk.js');

      // }).then(function(){

      //   window.fbAsyncInit = original;

      //   if (window.fbAsyncInit) {
      //     window.fbAsyncInit.hasRun = true;
      //     window.fbAsyncInit();
      //   }

      // });


      // return new Ember.RSVP.Promise(function(resolve) { resolve(resolveData); });
    }

  });
};

export default {
  name: 'reopen-authenticator-torii',
  before: 'simple-auth-torii',
  initialize: initialize
};