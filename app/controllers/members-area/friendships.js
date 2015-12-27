import Ember from 'ember';

export default Ember.Controller.extend({

  actions: {

    resetSearch: function() {
      this.set('search_term', '');
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
