import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['item-option','leave-button'],

  user: null,
  parent: null,

  actions: {
    leave: function() {
      var parent = this.get('parent');
      var user = this.get('user');
      var founder = parent.get('meethub').get('founder');
      var store = this.get('targetObject.store');

      if(founder.get('id') === user.get('id') && parent.get('meethub').get('invitations.length') > 1)
      {
        parent.get('meethub').set('selectNewAdmin', true);
      }
      else
      {
        // parent.set('status', 'declined');
        // parent.save();
      }
    }
  }
});
