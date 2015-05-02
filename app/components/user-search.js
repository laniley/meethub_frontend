import Ember from 'ember';
import DS from 'ember-data';

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

    return DS.PromiseArray.create({
      promise: self.get('friends').then(function(friends) {
        return Ember.RSVP.filter(friends.toArray(), function(friend) {
          return friend.get('name').toLowerCase().indexOf(self.get('search_term').toLowerCase()) !== -1;
        });
      })
    });

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
    },

    inviteFacebookFriends: function() {
      FB.ui ({
       method: 'apprequests',
       message: 'Meet me on Meethub...',
       filters: ['app_non_users']
      });

      // FB.api(
      //     "/me/invitable_friends",
      //     function (response) {
      //       if (response && !response.error) {

      //         var friend_ids = [];

      //         for(var i = 0; i < response.length; i++)
      //         {
      //           friend_ids.push(reponse.data[i].id);
      //         }

      //         FB.ui ({
      //          method: 'apprequests',
      //          message: 'Invite your friends'
      //         });
      //       }
      //     }
      // );
    }
  }
});
