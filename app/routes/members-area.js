import ENV from '../config/environment';
import AuthenticateRoute from './authenticate';

export default AuthenticateRoute.extend({

  setupController: function(controller) {
    this.initFB(controller);
  },

  initFB: function(controller) {
    var self = this;

    if(controller.get('hasFacebook'))
    {
      console.log("FB ready");

      controller.getUserInfosFromFB();
    }
    else
    {
      console.log("FB not ready");

      window.fbAsyncInit = function() {

        (function(d, s, id) {
          var js, fjs = d.getElementsByTagName(s)[0];
          if (d.getElementById(id))
          {
            return;
          }
          js = d.createElement(s); js.id = id;
          js.src = "//connect.facebook.net/en_US/sdk.js";
          fjs.parentNode.insertBefore(js, fjs);
        }(document, 'script', 'facebook-jssdk'));

        FB.init({
          appId      : ENV.fb_app_id,
          cookie     : true,  // enable cookies to allow the server to access the session
          xfbml      : true,  // parse social plugins on this page
          version    : 'v2.2' // use version 2.2
        });

        controller.set('hasFacebook', true);
        controller.set('FB', FB);

        controller.get('FB').getLoginStatus(function(response) {

            console.log("FB response status: ", response.status);

            if(response.status === "connected")
            {
              controller.getUserInfosFromFB();
            }
            else
            {
              self.get('session').invalidate();
              self.transitionTo('login');
            }

        });

      };
    }
  },

});
