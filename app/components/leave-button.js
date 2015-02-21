import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['item-option','leave-button'],

  parent: null,

  actions: {
    leave: function() {
      var invitation = this.get('parent');
      var meethub = invitation.get('meethub');
      var invitations = meethub.get('invitations');
      var admins = invitations.filterBy('role', 'admin');
      var role = invitation.get('role');
      var store = this.get('targetObject.store');

      if(role === 'admin' && invitations.get('length') > 1 && admins.get('length') < 2)
      {
        invitation.get('meethub').set('selectNewAdmin', true);
      }
      else
      {
        invitation.set('status', 'declined');
        invitation.save();
      }
    }
  }
});
