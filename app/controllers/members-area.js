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

  syncWithFB: function() {
    this.set('isSyncing', true);
    this.set('userEventsSynced', true);
    this.set('friendsSynced', true);

    var self = this;

    this.loadUserEventsFromFB(function() {
      console.log('finished loading user events from FB');
      self.set('userEventsSynced', true);
      if(self.get('friendsSynced'))
      {
        self.set('isSyncing', false);
      }
    });

    this.getFriendsFromFB(function() {
      console.log('finished loading friend events from FB');
      self.set('friendsSynced', true);
      if(self.get('userEventsSynced'))
      {
        self.set('isSyncing', false);
      }
    });
  },

  getFriendsFromFB: function(callback) {

    this.set('friendsSynced', false);

    var self = this;

    self.get('FB').api('/me/friends', function(response)
    {
      if( !response.error )
      {
        console.log('Successfully loaded friends from FB: ', response);

        var friend_response_length = response.data.length;
        var finished_friend_response_counter = 0;

        if(friend_response_length > 0)
        {
          for(var i = 0; i < friend_response_length; i++)
          {
            self.handleResponseForAFBFriend(response.data[i].id, function() {

              finished_friend_response_counter++;

              if(finished_friend_response_counter === friend_response_length)
              {
                self.loadFriendEventsFromFB(function() {
                  callback();
                });
              }
            });
          }
        }
      }
      else
      {
        console.log(response.error);
      }

    });
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

        friendship.save().then(friendship => {
          callback();
        })
      }
      // friendship in store
      else
      {
        callback();
      }
    });
  },

  loadUserEventsFromFB: function (callback) {

    this.set('userEventsSynced', false);

    var self = this;

    if(this.get('FB') != null)
    {
      var finished_requests = 0;

      this.get('FB').api('/me/events/attending', function(response)
      {
        if( !response.error )
        {
          console.log('user events - attending: ', response);

          var attending_reponses = response.data.length;
          var finished_attending_responses = 0;

          if(response.data.length > 0)
          {
            for(var i = 0; i < response.data.length; i++)
            {
              self.handleFBEventResponse(response.data[i], 'attending', 'me', function() {

                finished_attending_responses++;

                if(finished_attending_responses === attending_reponses)
                {
                  finished_requests++;

                  if(finished_requests === 3)
                  {
                    callback();
                  }
                }
              });
            }
          }
          else
          {
            finished_requests++;

            if(finished_requests === 3)
            {
              callback();
            }
          }
        }
        else
        {
          console.log(response.error);
        }
      });

      this.get('FB').api('/me/events/maybe', function(response)
      {
        if( !response.error )
        {
          console.log('user events - maybe: ', response);

          var maybe_reponses = response.data.length;
          var finished_maybe_responses = 0;

          if(response.data.length > 0)
          {
            for(var i = 0; i < response.data.length; i++)
            {
              self.handleFBEventResponse(response.data[i], 'maybe', 'me', function() {

                finished_maybe_responses++;

                if(finished_maybe_responses === maybe_reponses)
                {
                  finished_requests++;

                  if(finished_requests === 3)
                  {
                    callback();
                  }
                }
              });
            }
          }
          else
          {
            finished_requests++;

            if(finished_requests === 3)
            {
              callback();
            }
          }
        }
        else
        {
          console.log(response.error);
        }
      });

      this.get('FB').api('/me/events/not_replied', function(response)
      {
        if( !response.error )
        {
          console.log('user events - not_replied: ', response);

          var not_replied_reponses = response.data.length;
          var finished_not_replied_responses = 0;

          if(response.data.length > 0)
          {
            for(var i = 0; i < response.data.length; i++)
            {
              self.handleFBEventResponse(response.data[i], 'not_replied', 'me', function() {

                finished_not_replied_responses++;

                if(finished_not_replied_responses === not_replied_reponses)
                {
                  finished_requests++;

                  if(finished_requests === 3)
                  {
                    callback();
                  }
                }
              });
            }
          }
          else
          {
            finished_requests++;

            if(finished_requests === 3)
            {
              callback();
            }
          }
        }
        else
        {
          console.log(response.error);
        }
      });
    }
    else
    {
      console.log('FB is not defined!');
    }
  },

  loadFriendEventsFromFB: function (callback) {

    var self = this;

    var user = self.get('model');

    user.get('friendships').then(friendships => {

      var friends_length = friendships.get('length');
      var finished_friends_counter = 0;

      if(friends_length > 0)
      {
        friendships.forEach(friendship => {

          friendship.get('friend').then(friend => {
            self.store.find('eventInvitation', { 'invited_user': friend.get('id') });

            self.store.find('user', friend.get('id')).then(function(friend) {

              var finished_requests = 0;

              self.get('FB').api('/' + friend.get('fb_id') + '/events/attending', function(response)
              {
                if( !response.error )
                {
                  console.log('friend events - attending: ', response);

                  if(response.data.length > 0)
                  {
                    var attending_reponses = response.data.length;
                    var finished_attending_responses = 0;

                    for(var i = 0; i < response.data.length; i++)
                    {
                      self.handleFBEventResponse(response.data[i], 'attending', friend.get('fb_id'), function() {

                        finished_attending_responses++;

                        if(finished_attending_responses === attending_reponses)
                        {
                          finished_requests++;

                          if(finished_requests === 3)
                          {
                            finished_friends_counter++;

                            if(finished_friends_counter === friends_length)
                            {
                              callback();
                            }
                          }
                        }

                      });
                    }
                  }
                  else
                  {
                    finished_requests++;

                    if(finished_requests === 3)
                    {
                      finished_friends_counter++;

                      if(finished_friends_counter === friends_length)
                      {
                        callback();
                      }
                    }
                  }
                }
                else
                {
                  console.log(response.error);
                }
              });

              self.get('FB').api('/' + friend.get('fb_id') + '/events/maybe', function(response)
              {
                if( !response.error )
                {
                  console.log('friend events - maybe: ', response);

                  if(response.data.length > 0)
                  {
                    var maybe_reponses = response.data.length;
                    var finished_maybe_responses = 0;

                    for(var i = 0; i < response.data.length; i++)
                    {
                      self.handleFBEventResponse(response.data[i], 'maybe', friend.get('fb_id'), function() {

                        finished_maybe_responses++;

                        if(finished_maybe_responses === maybe_reponses)
                        {
                          finished_requests++;

                          if(finished_requests === 3)
                          {
                            finished_friends_counter++;

                            if(finished_friends_counter === friends_length)
                            {
                              callback();
                            }
                          }
                        }
                      });
                    }
                  }
                  else
                  {
                    finished_requests++;

                    if(finished_requests === 3)
                    {
                      finished_friends_counter++;

                      if(finished_friends_counter === friends_length)
                      {
                        callback();
                      }
                    }
                  }
                }
                else
                {
                  console.log(response.error);
                }
              });

              self.get('FB').api('/' + friend.get('fb_id') + '/events/not_replied', function(response)
              {
                if( !response.error )
                {
                  console.log('friend events - not_replied: ', response);

                  if(response.data.length > 0)
                  {
                    var not_replied_reponses = response.data.length;
                    var finished_not_replied_responses = 0;

                    for(var i = 0; i < response.data.length; i++)
                    {
                      self.handleFBEventResponse(response.data[i], 'not_replied', friend.get('fb_id'), function() {

                        finished_not_replied_responses++;

                        if(finished_not_replied_responses === not_replied_reponses)
                        {
                          finished_requests++;

                          if(finished_requests === 3)
                          {
                            finished_friends_counter++;

                            if(finished_friends_counter === friends_length)
                            {
                              callback();
                            }
                          }
                        }
                      });
                    }
                  }
                  else
                  {
                    finished_requests++;

                    if(finished_requests === 3)
                    {
                      finished_friends_counter++;

                      if(finished_friends_counter === friends_length)
                      {
                        callback();
                      }
                    }
                  }
                }
                else
                {
                  console.log(response.error);
                }
              });

            });

          });

        });
      }
      else
      {
        console.log('no friendships');
      }

    });
  },

  handleFBEventResponse: function(response, status, user_fb_id, callback) {

    var self = this;

    var unfiltered_locations = self.store.all('location');
    var location = null;
    var locations = [];

    if(response.venue)
    {
      locations = unfiltered_locations.filterBy('fb_id', response.venue.id);

      if(Ember.isEmpty(locations))
      {
        location = this.store.createRecord('location', {
          fb_id: response.venue.id,
          name: response.location,
          country: response.venue.country,
          city: response.venue.city,
          zip: response.venue.zip,
          street: response.venue.street,
          latitude: response.venue.latitude,
          longitude: response.venue.longitude
        });

        self.get('map_controller').get('markers').addObject({title: response.location, lat: response.venue.latitude, lng: response.venue.longitude, isDraggable: false});

        location.save().then(function(location) {
          self.handleFBEvent(response, location, status, user_fb_id, function() {
            callback();
          });
        });
      }
      else
      {
        location = locations.get('firstObject');
        self.handleFBEvent(response, location, status, user_fb_id, function() {
          callback();
        });
      }
    }
    else
    {
      locations = unfiltered_locations.filterBy('name', response.location);

      if(Ember.isEmpty(locations)) // location befindet sich noch nicht im store
      {
        self.store.find('location', { name: response.location }).then(function(store_response) {

          location = store_response.get('firstObject');

          // location not already in the DB, create it
          if(Ember.isEmpty(location))
          {
            // console.log('location not yet in DB');

            location = self.store.createRecord('location', {
              name: response.location
            });

            location.save().then(function(location) {
              self.handleFBEvent(response, location, status, user_fb_id, function() {
                callback();
              });
            });
          }
          // location already in the DB
          else
          {
            // console.log('location already in DB');
            self.handleFBEvent(response, location, status, user_fb_id, function() {
              console.log(callback);
              callback();
            });
          }
        });
      }
      else // location befindet sich bereits im store
      {
        // console.log('location already in store');
        location = locations.get('firstObject');
        self.handleFBEvent(response, location, status, user_fb_id, function() {
          callback();
        });
      }
    }
  },

  handleFBEvent: function(response, location, status, user_fb_id, callback) {

    var self = this;
    var unfiltered_events = [];
    var filtered_events = [];
    var event = null;

    unfiltered_events = self.store.all('event');

    filtered_events = unfiltered_events.filterBy('fb_id', response.id);

    // event befindet sich noch nicht im store
    // und es wurde noch kein request ans backend abgesetzt
    if(Ember.isEmpty(filtered_events) && this.get('pendingFBEventRequests').indexOf(response.id) === -1)
    {
      // console.log('event not yet in store', response.name);

      this.get('pendingFBEventRequests').push(response.id);

      self.store.find('event', { fb_id: response.id}).then(function(store_response) {

        event = store_response.get('firstObject');

        // event not already in the DB, create it
        if(Ember.isEmpty(event))
        {
          // console.log('event not yet in DB - create new', response.name);

          var date_time_arr = response.start_time.split('T');
          var date_time = '';
          var date_day = '';

          if(date_time_arr[1])
          {
            date_time = date_time_arr[1].trim();
          }

          if(date_time_arr[0])
          {
            date_day = date_time_arr[0].trim();
          }

          event = self.store.createRecord('event', {
            fb_id: response.id,
            name: response.name,
            description: response.descrption,
            start_time: date_time,
            start_date: date_day,
            timezone: response.timezone,
            location: location
          });

          event.save().then(function(event) {

            event.set('me', self.get('model'));

            self.handleFBMessage(response, event, status, user_fb_id, function() {
              callback();
            });
          });
        }
        // event already in the DB
        else
        {
          // console.log('event in DB', response.name);

          event.set('me', self.get('model'));

          self.handleFBMessage(response, event, status, user_fb_id, function() {
            callback();
          });
        }
      });
    }
    // event befindet sich noch nicht im store
    // aber es wurde bereits ein request ans backend abgesetzt
    else if(Ember.isEmpty(filtered_events) && this.get('pendingFBEventRequests').indexOf(response.id) !== -1)
    {
      // console.log('event request pending', response.name);

      setTimeout
      (
        function() {
          self.handleFBEvent(response, location, status, user_fb_id, function() {
            callback();
          });
        },
        1000
      );
    }
    // event befindet sich im store
    else
    {
      // console.log('event in store already', response.name);

      event = filtered_events.get('firstObject');

      event.set('me', self.get('model'));

      self.handleFBMessage(response, event, status, user_fb_id, function() {
        callback();
      });
    }
  },

  handleFBMessage: function(response, event, status, user_fb_id, callback) {

    console.log('handle FB message');

    var self = this;
    var unfiltered_users = null;
    var filtered_users = null;
    var message = null;

    self.store.find('message', { fb_id: event.get('fb_id') }).then(function(store_response) {

      var user_id = null;

      if(user_fb_id !== 'me')
      {
        unfiltered_users = self.store.all('user');
        filtered_users = unfiltered_users.filterBy('fb_id', user_fb_id);
        user_id = filtered_users.get('firstObject').get('id');
      }
      else
      {
        user_id = self.get('model').get('id');
      }

      var filtered_messages = store_response.filter(function(response) {
        return response.get('to_user').get('id') === user_id;
      });

      message = filtered_messages.get('firstObject');

      // if message not already in the DB, create it
      if(Ember.isEmpty(message))
      {
        // console.log('message not already in the DB');

        // if it is an eventInv of a friend, handle eventInv for friend
        if(user_fb_id !== 'me')
        {
          // console.log('message for a friend');

          unfiltered_users = self.store.all('user');
          filtered_users = unfiltered_users.filterBy('fb_id', user_fb_id);
          var friend = filtered_users.get('firstObject');

          message = self.store.createRecord('message', {
            fb_id: event.get('fb_id'),
            subject: response.name,
            to_user: friend
          });

          message.save().then(function(message) {

            var belongsToMe = false;

            if(user_fb_id === "me")
            {
              belongsToMe = true;
            }

            var eventInvitation = self.store.createRecord('eventInvitation', {
              me: self.get('model'),
              event: event,
              invited_user: friend,
              status: status,
              message: message,
              belongsToMe: belongsToMe
            });

            eventInvitation.save().then(function(eventInvitation) {
              message.set('eventInvitation', eventInvitation);
            });

          });
        }

        // console.log('message for me');
        // handle eventInv for me
        message = self.store.createRecord('message', {
          fb_id: event.get('fb_id'),
          subject: response.name,
          to_user: self.get('model')
        });

        message.save().then(function(message) {

          var belongsToMe = false;

          if(user_fb_id === "me")
          {
            belongsToMe = true;
          }

          var eventInvitation = self.store.createRecord('eventInvitation', {
            me: self.get('model'),
            event: event,
            invited_user: self.get('model'),
            status: status,
            message: message,
            belongsToMe: belongsToMe
          });

          eventInvitation.save().then(function(eventInvitation) {
            message.set('eventInvitation', eventInvitation);
            callback();
          });
        });

      }
      // message already in the DB
      else
      {
        // console.log('message already in the DB', message.get('eventInvitation').get('id'));
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
              return event.get('is_upcoming') === true
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

    var unreadEventInvitations = [];

    if(this.get('myEventInvsOfUpcomingEvents.length') > 0)
    {
      unreadEventInvitations = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false && message.get('isEventInvitation') === true;
      });
    }

    return unreadEventInvitations.get('length');


    return DS.PromiseArray.create({

      promise: this.get('myEventInvsOfUpcomingEvents').then(eventInvs => {

        return Ember.RSVP.all(eventInvs.map(eventInv => {

          return eventInv.get('messages').then(message => {

            return message;

          });

        })).then(messages => {

          return Ember.RSVP.filter(messages.toArray(), message => {

            return message.get('event').then(event => {

              return event.get('is_upcoming') === true;

            });

          });

        });

      })

    });

  }.property('myEventInvsOfUpcomingEvents.@each.messages.@each.hasBeenRead'),

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
