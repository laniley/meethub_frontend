import Ember from 'ember';
// import ApplicationRouteMixin from 'simple-auth/mixins/application-route-mixin';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Route.extend( FacebookLoginMixin, {

  beforeModel() {
    this.checkLoginState();
  }

});
