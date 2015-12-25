import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area/map', 'members-area/index'],
  map_controller: Ember.computed.alias("controllers.members-area/map"),
  membersArea_index_controller: Ember.computed.alias("controllers.members-area/index"),

  FB: null,

  isSyncing: true,
  userEventsSynced: false,
  friendsSynced: false,

  pendingFBEventRequests: [],

  onInit: function() {

    var self = this;

    setInterval
    (
      function() {
        self.update();
      },
      10000
    );
  }.on('init'),

  update: function() {
    // var self = this;

    // self.store.find('meethubInvitation', { invited_user: self.get('model').get('id') });
    // self.store.find('eventInvitation', { invited_user: self.get('model').get('id') });
    // self.store.find('message', { user: self.get('model').get('id') });
    // self.store.find('meethubComment', { user: self.get('model').get('id') });
  },

  handleResponseForAFBFriend: function(friend_fb_id, callback) {

    var self = this;

    self.store.find('user', { fb_id: friend_fb_id }).then(function(friends)
    {
      if(Ember.isEmpty(friends))
      {
        console.log("friend not yet in store");

        self.controllerFor('members-area').get('FB').api('/' + friend_fb_id, function(friend_response)
        {
          if( !friend_response.error )
          {
            var friend = self.store.createRecord('user', {
                fb_id: friend_response.id,
                first_name: friend_response.first_name,
                last_name: friend_response.last_name,
                picture: 'http://graph.facebook.com/' + friend_response.id + '/picture',
                gender: friend_response.gender,
                first_login: true
            });

            friend.save().then(newFriend => {

              var friend = newFriend;
              var user = self.get('model');

              self.handleFriendship(user, friend, function() {
                callback();
              });

            });
          }
          else
          {
            console.log(friend_response.error);
          }
        });
      }
      else
      {
        console.log("friend in store already");

        var friend = friends.get('firstObject');
        var user = self.get('model');

        self.handleFriendship(user, friend, function() {
          callback();
        });
      }
    });
  },

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

  
  logout: function() {
    this.get('session').invalidate();
    this.transitionTo('login');
  },

  // newMeethubComments: function() {

  //   var newMeethubComments = [];

  //   if(this.get('model.meethubComments.length') > 0)
  //   {
  //     var self = this;

  //     newMeethubComments = this.get('model.meethubComments').filter(function(comment) {
  //       return comment.get('new_comment') === true && comment.get('author').get('id') !== self.get('model').get('id');
  //     });
  //   }

  //   return newMeethubComments;

  // }.property('model.meethubComments.length'),


  // newMeethubInfosCount: function() {
  //   return this.get('model.newMeethubComments.length') + this.get('model.socialPointUpdates');
  // }.property('model.newMeethubComments.length', 'model.socialPointUpdates'),

  // hasNewMeethubInfos: function() {
  //   if(this.get('newMeethubInfosCount') > 0)
  //   {
  //     return true;
  //   }
  //   else
  //   {
  //     return false;
  //   }
  // }.property('newMeethubInfosCount'),


  unreadMessages: function() {
    var unreadMessages = [];

    if(this.get('model.messages.length') > 0)
    {
      unreadMessages = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false;
      });
    }

    return unreadMessages;
  }.property('model.messages.@each.hasBeenRead'),

  unseenNewFriendships: function() {
    var unseenNewFriendships = [];

    if(this.get('model.friendships.length') > 0)
    {
      unseenNewFriendships = this.get('model.friendships').filter(function(friendship) {
        return friendship.get('has_been_seen') === false;
      });
    }

    return unseenNewFriendships;
  }.property('model.friendships.@each.has_been_seen'),

  myEventInvsOfUpcomingEvents: function() {

    if(this.get('model'))
    {
      return DS.PromiseArray.create({

        promise: this.get('model.eventInvitations').then(eventInvs => {

          return Ember.RSVP.filter(eventInvs.toArray(), eventInv => {

            return eventInv.get('event').then(event => {
              return event.get('is_upcoming') === true;
            });

          });

        })

      });
    }
    else
    {
      return null;
    }

  }.property('model.eventInvitations.@each.event.is_upcoming'),

  messagesOfMyEventInvsOfUpcomingEvents: function() {

    if(this.get('myEventInvsOfUpcomingEvents'))
    {

      return DS.PromiseArray.create({

        promise: this.get('myEventInvsOfUpcomingEvents').then(eventInvs => {

          return Ember.RSVP.all(eventInvs.map(eventInv => {

            return eventInv.get('message').then(message => {

              return message;

            });

          }));

        })

      });

    }
    else
    {
      return null;
    }

  }.property('myEventInvsOfUpcomingEvents.@each'),

  myUnseenEventInvs: function() {

    if(this.get('messagesOfMyEventInvsOfUpcomingEvents'))
    {

      return DS.PromiseArray.create({

        promise: this.get('messagesOfMyEventInvsOfUpcomingEvents').then(messages => {

          return Ember.RSVP.filter(messages.toArray(), message => {

            return !Ember.isEmpty(message) && message.get('hasBeenRead') === false;

          });

        })

      });

    }
    else
    {
      return null;
    }

  }.property('messagesOfMyEventInvsOfUpcomingEvents.@each.hasBeenRead'),



  hasUnreadMessages: function() {

    if(this.get('unreadMessages').get('length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('unreadMessages.length'),

  hasUnreadMeethubInvitations: function() {

    if(this.get('number_of_new_meethub_invitations') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('number_of_new_meethub_invitations'),

  hasUnreadEventInvitations: function() {

    if(this.get('number_of_new_event_invitations') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('number_of_new_event_invitations'),

  hasUnseenNewFriendships: function() {

    if(this.get('number_of_unseen_new_friendships') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('number_of_unseen_new_friendships'),

  // hasNewMeethubComments: function() {

  //   if(this.get('newMeethubComments').get('length') > 0)
  //   {
  //     return true;
  //   }
  //   else
  //   {
  //     return false;
  //   }

  // }.property('newMeethubComments.length'),



  // number_of_new_meethub_comments: function() {

  //   return this.get('newMeethubComments').get('length');

  // }.property('newMeethubComments.length'),

  // number_of_new_meethub_invitations: function() {

  //   var unreadMessages = [];

  //   if(this.get('model.messages.length') > 0)
  //   {
  //     unreadMessages = this.get('model.messages').filter(function(message) {
  //       return message.get('hasBeenRead') === false;
  //     });
  //   }

  //   var unreadMeethubInvitations = [];

  //   if(unreadMessages.get('length') > 0)
  //   {
  //     unreadMeethubInvitations = unreadMessages.filter(function(message) {
  //       return message.get('isMeethubInvitation') === true;
  //     });
  //   }

  //   return unreadMeethubInvitations.get('length');

  // }.property('model.messages.@each.hasBeenRead', 'model.messages.@each.isMeethubInvitation'),

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
