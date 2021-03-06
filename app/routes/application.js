import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Route.extend( FacebookLoginMixin, {
  beforeModel() {
    this.checkLoginState();
  },

  model: function() {
    var me = this.store.peekRecord('me', 1);

    if(Ember.isEmpty(me)) {
      return this.store.createRecord('me', { id: 1 });
    }
    else {
      return me;
    }
  }
});
