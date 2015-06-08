import Ember from 'ember';
import Base from 'simple-auth/authorizers/base';

export default Base.extend({
  authorize: function(jqXHR, requestOptions) {
    var token = this.get('session').get('secure.userId');
    console.log("TEST", token);
    if (this.get('session.isAuthenticated') && !Ember.isEmpty(token)) {
      jqXHR.setRequestHeader('X-CSRF-Token', token);
      jqXHR.crossDomain = true;
      jqXHR.xhrFields = {withCredentials: true};
    }
  }
});
