import Ember from 'ember';

export default Ember.Controller.extend({

  searchIsOpen: false,

  search_term: '',

  search_results: function() {
    var self = this;
    var filteredFriends = [];

    if(self.get('model') !== null)
    {
      filteredFriends = self.get('model').filter(function(friend) {
        return friend.get('first_name') !== undefined && friend.get('name').toLowerCase().indexOf(self.get('search_term').toLowerCase()) !== -1;
      });
    }

    return filteredFriends;

  }.property('search_term','model.@each'),

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
      FB.ui ({
       method: 'apprequests',
       message: 'Meet me on Meethub...',
       filters: ['app_non_users']
      });
    }

  }

});
