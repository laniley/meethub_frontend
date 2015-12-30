/* global FB */
import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Controller.extend({
  search_term: '',

  search_results: function() {
    return DS.PromiseArray.create({
      promise: this.get('model').get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          return user.get('friends').then(friends => {
            return friends.filter(friend => {
              return friend.get('name').toLowerCase().indexOf(this.get('search_term').toLowerCase()) !== -1;
            });
          });
        }
      })
    });
  }.property('search_term','model.user.friends.content.[]'),

  searchIsEmpty: function() {
    if(this.get('search_term') !== '') {
      return false;
    }
    else {
      return true;
    }
  }.property('search_term'),

  actions: {
    inviteFacebookFriends: function() {
      FB.ui ({
       method: 'apprequests',
       message: 'Meet me on Meethub...',
       filters: ['app_non_users']
      });
    }
  }
});
