import Ember from 'ember';

export default Ember.Component.extend({
  parent: null,
  user: null,
  search_term: '',
  type: '',

  isAMeethubInvite: function() {
    if(this.get('type') === 'meethubInvite')
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property(),

  search_results: function() {
    var self = this;

    var filteredItems = self.get('friends').filter(function(item) {
      return item.get('name').toLowerCase().indexOf(self.get('search_term').toLowerCase()) !== -1;
    });

    return filteredItems;
  }.property('friends.@each', 'search_term'),

  actions: {
    makeAdmin: function(friend) {
      var meethubInvitation = this.get('parent');
      var meethub = meethubInvitation.get('meethub');
      var meethubInvitations = meethub.get('invitations');
      var friendInvitations = meethubInvitations.filterBy('invited_user', friend);
      var friendInvitation = friendInvitations.get('firstObject');
      friendInvitation.set('role', 'admin');
      friendInvitation.save();
      meethub.set('selectNewAdmin', false);
      meethubInvitation.set('status', 'declined');
      meethubInvitation.save();
    }
  }
});
