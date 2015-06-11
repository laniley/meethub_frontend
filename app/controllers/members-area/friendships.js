import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  isSidebarOpen: false,
  searchIsOpen: false,

  search_term: '',

  search_results: function() {
    var self = this;
    var filteredFriends = [];

    if(self.get('membersArea_controller').get('model') !== null)
    {
      filteredFriends = self.get('membersArea_controller').get('model').get('friendships').filter(function(friendship) {
        return friendship.get('friend').get('first_name') !== undefined && friendship.get('friend').get('name').toLowerCase().indexOf(self.get('search_term').toLowerCase()) !== -1;
      });
    }

    return filteredFriends;

  }.property('search_term','membersArea_controller.model.friendships.@each'),

  searchIsEmpty: function() {
    if(this.get('search_term') !== '')
    {
      return false;
    }
    else
    {
      return true;
    }
  }.property('search_term'),

  actions: {

    resetSearch: function() {
      this.set('search_term', '');
    },

    toggleSearch: function() {
      if(this.get('searchIsOpen') === true)
      {
        this.set('searchIsOpen', false);
      }
      else
      {
        this.set('searchIsOpen', true);
      }
    },

    inviteFacebookFriends: function() {
      this.get('membersArea_controller').get('FB').ui ({
       method: 'apprequests',
       message: 'Meet me on Meethub...',
       filters: ['app_non_users']
      });
    },

    openFriendship: function(friendship) {
      // console.log(friendship_id);
      // this.store.find('friendship', friendship_id).then(function(friendship) {
        friendship.set('has_been_seen', true);
        friendship.save();
      // });
    }

  }

});
