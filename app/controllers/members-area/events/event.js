import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    acceptEventInvitation: function(eventInvitation_id) {
      this.store.find('eventInvitation', eventInvitation_id).then(function(eventInvitation) {
        eventInvitation.set('status', 'attending');
        eventInvitation.save();
      });
    },
    maybeAcceptEventInvitation: function(eventInvitation_id) {
      this.store.find('eventInvitation', eventInvitation_id).then(function(eventInvitation) {
        eventInvitation.set('status', 'maybe');
        eventInvitation.save();
      });
    },
    declineEventInvitation: function(eventInvitation_id) {
      this.store.find('eventInvitation', eventInvitation_id).then(function(eventInvitation) {
        eventInvitation.set('status', 'declined');
        eventInvitation.save();
      });
    }
  }
});
