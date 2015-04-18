import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area/map', 'members-area/index'],
  map_controller: Ember.computed.alias("controllers.members-area/map"),
  membersArea_index_controller: Ember.computed.alias("controllers.members-area/index"),

  FB: null,

  showSidebar: false,
  isSidebarOpen: true,

  currentSection: 'news',

  pendingFBEventRequests: [],

  init: function() {

    // var self = this;

    setInterval
    (
      function() {
        // self.update();
      },
      10000
    );
  },

  update: function() {
    var self = this;
    self.loadUserEventsFromFB();
    self.loadFriendEventsFromFB();
    self.store.find('meethubInvitation', { invited_user: self.get('model').get('id') });
    self.store.find('message', { user: self.get('model').get('id') });
    self.store.find('meethubComment', { user: self.get('model').get('id') });
  },


  newMeethubInfosCount: function() {
    return this.get('membersArea_index_controller.newMeethubComments.length') + this.get('membersArea_index_controller.socialPointUpdates');
  }.property('membersArea_index_controller.newMeethubComments.length', 'membersArea_index_controller.socialPointUpdates'),

  hasNewMeethubInfos: function() {
    if(this.get('newMeethubInfosCount') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('newMeethubInfosCount'),

  hasUnreadMessages: function() {

    if(this.get('unreadMessages').get('length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('unreadMessages.@each'),

  number_of_new_meethub_invitations: function() {

    var unreadMessages = [];

    if(this.get('model.messages.length') > 0)
    {
      unreadMessages = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false;
      });
    }

    var unreadMeethubInvitations = [];

    if(unreadMessages.get('length') > 0)
    {
      unreadMeethubInvitations = unreadMessages.filter(function(message) {
        return message.get('isMeethubInvitation') === true;
      });
    }

    return unreadMeethubInvitations.get('length');

  }.property('model.messages.@each.hasBeenRead', 'model.messages.@each.isMeethubInvitation'),

  number_of_new_event_invitations: function() {

    var unreadMessages = [];

    if(this.get('model.messages.length') > 0)
    {
      unreadMessages = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false;
      });
    }

    var unreadEventInvitations = [];

    if(unreadMessages.get('length') > 0)
    {
      unreadEventInvitations = unreadMessages.filter(function(message) {
        return message.get('isEventInvitation') === true;
      });
    }

    return unreadEventInvitations.get('length');

  }.property('model.messages.@each.hasBeenRead', 'model.messages.@each.isEventInvitation'),

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

  loadUserEventsFromFB: function () {

    var self = this;

    this.get('FB').api('/me/events/attending', function(response)
    {
      if( !response.error )
      {
        console.log('user events - attending: ', response);

        for(var i = 0; i < response.data.length; i++)
        {
          self.handleFBEventResponse(response.data[i], 'attending', 'me');
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

        for(var i = 0; i < response.data.length; i++)
        {
          self.handleFBEventResponse(response.data[i], 'maybe', 'me');
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

        for(var i = 0; i < response.data.length; i++)
        {
          self.handleFBEventResponse(response.data[i], 'not_replied', 'me');
        }
      }
      else
      {
        console.log(response.error);
      }
    });
  },

  loadFriendEventsFromFB: function () {

    var self = this;

    var user = self.get('model');

    user.get('friends').then(function(friends) {

      friends.forEach(function(friend) {

        self.store.find('user', friend.get('id')).then(function(user) {

          self.get('FB').api('/' + user.get('fb_id') + '/events/attending', function(response)
          {
            if( !response.error )
            {
              console.log('friend events - attending: ', response);

              for(var i = 0; i < response.data.length; i++)
              {
                self.handleFBEventResponse(response.data[i], 'attending', user.get('fb_id'));
              }
            }
            else
            {
              console.log(response.error);
            }
          });

          self.get('FB').api('/' + user.get('fb_id') + '/events/maybe', function(response)
          {
            if( !response.error )
            {
              console.log('friend events - maybe: ', response);

              for(var i = 0; i < response.data.length; i++)
              {
                self.handleFBEventResponse(response.data[i], 'maybe', user.get('fb_id'));
              }
            }
            else
            {
              console.log(response.error);
            }
          });

          self.get('FB').api('/' + user.get('fb_id') + '/events/not_replied', function(response)
          {
            if( !response.error )
            {
              console.log('friend events - not_replied: ', response);

              for(var i = 0; i < response.data.length; i++)
              {
                self.handleFBEventResponse(response.data[i], 'not_replied', user.get('fb_id'));
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
  },

  handleFBEventResponse: function(response, status, user_fb_id) {

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

        location.save().then(function() {
          self.handleFBEvent(response, location, status, user_fb_id);
        });
      }
      else
      {
        location = locations.get('firstObject');
        self.handleFBEvent(response, location, status, user_fb_id);
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

            location.save().then(function() {
              self.handleFBEvent(response, location, status, user_fb_id);
            });
          }
          // location already in the DB
          else
          {
            // console.log('location already in DB');

            self.handleFBEvent(response, location, status, user_fb_id);
          }
        });
      }
      else // location befindet sich bereits im store
      {
        // console.log('location already in store');

        location = locations.get('firstObject');
        self.handleFBEvent(response, location, status, user_fb_id);
      }
    }
  },

  handleFBEvent: function(response, location, status, user_fb_id) {

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
      console.log('event not yet in store', response.name);

      this.get('pendingFBEventRequests').push(response.id);

      self.store.find('event', { fb_id: response.id}).then(function(store_response) {

        event = store_response.get('firstObject');

        // if event not already in the DB, create it
        if(Ember.isEmpty(event))
        {
          console.log('event not yet in DB - create new', response.name);
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

          event.save().then(function() {
            self.handleFBMessage(response, event, status, user_fb_id);
          });
        }
        else
        {
          console.log('event in DB', response.name);
          self.handleFBMessage(response, event, status, user_fb_id);
        }
      });
    }
    // event befindet sich noch nicht im store
    // aber es wurde bereits ein request ans backend abgesetzt
    else if(Ember.isEmpty(filtered_events) && this.get('pendingFBEventRequests').indexOf(response.id) !== -1)
    {
      console.log('event request pending', response.name);

      setTimeout
      (
        function() {
          self.handleFBEvent(response, location, status, user_fb_id);
        },
        1000
      );
    }
    // event befindet sich im store
    else
    {
      console.log('event in store already', response.name);
      event = filtered_events.get('firstObject');

      event.save().then(function() {
        self.handleFBMessage(response, event, status, user_fb_id);
      });
    }
  },

  handleFBMessage: function(response, event, status, user_fb_id) {

    var self = this;

    var unfiltered_messages = this.store.all('message');

    var messages = unfiltered_messages.filterBy('fb_id', response.id);

    // if it is an eventInv of a friend, handle eventInv for friend
    if(user_fb_id !== 'me')
    {
      var unfiltered_users = this.store.all('user');
      var filtered_users = unfiltered_users.filterBy('fb_id', user_fb_id);
      var friend = filtered_users.get('firstObject');

      var eventInvitation = self.store.createRecord('eventInvitation', {
        me: self.get('model'),
        event: event,
        invited_user: friend,
        status: status,
        message: null
      });

      eventInvitation.save();
    }

    // handle eventInv for me
    if(Ember.isEmpty(messages))
    {
      var message = self.store.createRecord('message', {
        fb_id: response.id,
        subject: response.name,
        to_user: self.get('model')
      });

      message.save().then(function() {

        var eventInvitation = self.store.createRecord('eventInvitation', {
          me: self.get('model'),
          event: event,
          invited_user: self.get('model'),
          status: status,
          message: message
        });

        eventInvitation.save().then(function() {
          message.set('eventInvitation', eventInvitation);
        });
      });
    }
  },

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
    }
  }
});
