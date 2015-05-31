import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  searchIsOpen: false,

  search_term: '',

  search_results: function() {
    var self = this;
    var filteredFriends = [];

    if(self.get('model') !== null)
    {
      filteredFriends = self.get('model').get('friends').filter(function(friend) {
        return friend.get('first_name') !== undefined && friend.get('name').toLowerCase().indexOf(self.get('search_term').toLowerCase()) !== -1;
      });
    }

    return filteredFriends;

  }.property('search_term','model.friends.@each'),

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
    }

  }

});
