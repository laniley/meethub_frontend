import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area/map', 'members-area/index'],
  map_controller: Ember.computed.alias("controllers.members-area/map"),
  membersArea_index_controller: Ember.computed.alias("controllers.members-area/index"),

  handleFriendship: function (user, friend, callback) {
    this.store.find('friendship', { user_id: user.get('id'), friend_id: friend.get('id') }).then(friendships => {
      // friendship not in store
      if(Ember.isEmpty(friendships))
      {
        var friendship = this.store.createRecord('friendship', {
            user: user,
            friend: friend
        });

        friendship.save().then(() => {
          callback();
        });
      }
      // friendship in store
      else
      {
        callback();
      }
    });
  },

  number_of_new_event_invitations: function() {
    if(this.get('myUnseenEventInvs'))
    {
      return this.get('myUnseenEventInvs').get('length');
    }
    else
    {
      return 0;
    }

  }.property('myUnseenEventInvs.length'),

  number_of_unseen_new_friendships: function() {

    return this.get('unseenNewFriendships').get('length');

  }.property('unseenNewFriendships.length'),



  actions: {
    toggleSidebar: function() {
      if(this.get('isSidebarOpen'))
      {
        this.set('isSidebarOpen', false);
      }
      else
      {
        this.set('isSidebarOpen', true);
      }
    },

    resyncWithFB : function() {
      this.syncWithFB();
    }
  }
});
