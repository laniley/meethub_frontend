import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area/map'],
  map_controller: Ember.computed.alias("controllers.members-area/map"),

  FB: null,

  showSidebar: false,
  isSidebarOpen: true,

  currentSection: 'map',

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

  init: function() {

    var self = this;

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
    // load MeethubInvitations from BE
    self.store.find('meethubInvitation', { invited_user: self.get('model').get('id') });
    self.store.find('message', { user: self.get('model').get('id') });
  },

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

      friends.forEach(function(friend, index) {

        self.store.find('user', friend.get('id')).then(function(user) {

          FB.api('/' + user.get('fb_id') + '/events/attending', function(response)
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

          FB.api('/' + user.get('fb_id') + '/events/maybe', function(response)
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

          FB.api('/' + user.get('fb_id') + '/events/not_replied', function(response)
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

      if(Ember.isEmpty(locations))
      {
        location = self.store.createRecord('location', {
          name: response.location
        });

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
  },

  handleFBEvent: function(response, location, status, user_fb_id) {

    var self = this;
    var unfiltered_events = [];
    var events = [];
    var event = null;

    unfiltered_events = self.store.all('event');

    events = unfiltered_events.filterBy('fb_id', response.id);

    // event befindet sich noch nicht im store
    if(Ember.isEmpty(events))
    {
      console.log('event not yet in store', response.name);

      self.store.find('event').then(function(unfiltered_events) {

        events = unfiltered_events.filterBy('fb_id', response.id);

        // if event not already in the DB, create it
        if(Ember.isEmpty(events))
        {
          console.log('event not yet in DB - create new', response.name);

          var date_time_arr = response.start_time.split('T');
          var date_time = date_time_arr[1].trim();
          var date_day = date_time_arr[0].trim();

          event = self.store.createRecord('event', {
            fb_id: response.id,
            name: response.name,
            description: response.descrption,
            start_time: date_time,
            start_date: date_day,
            timezone: response.timezone,
            location: location
          });
        }
        else
        {
          console.log('event in DB', response.name);

          event = events.get('firstObject');

          // console.log('event received', event.get('name'));
        }

        // if the user is not me
        if(user_fb_id !== 'me')
        {
          self.addFriendsToEvent(user_fb_id, event, status);
        }

        event.save().then(function() {
          self.handleFBMessage(response, event);
        });
      });
    }
    // event befindet sich im store
    else
    {
      console.log('event in store already', response.name);

      event = events.get('firstObject');

      // console.log('event received', event.get('name'));

      // if the user is not me
      if(user_fb_id !== 'me')
      {
        self.addFriendsToEvent(user_fb_id, event, status);
      }

      event.save().then(function() {
        self.handleFBMessage(response, event);
      });
    }

  },

  addFriendsToEvent: function(user_fb_id, event, status) {
    var self = this;
    var unfiltered_users = self.store.all('user');
    var user = unfiltered_users.findBy('fb_id', user_fb_id);

    if(status === 'attending')
    {
      event.get('friends_attending').pushObject(user);
      console.log('friend is attending');
    }
    else if(status === 'maybe')
    {
      event.get('friends_attending_maybe').pushObject(user);
      console.log('friend is attending maybe');
    }
  },

  handleFBMessage: function(response, event) {

    var self = this;

    var unfiltered_messages = this.store.all('message');

    var messages = unfiltered_messages.filterBy('fb_id', response.id);

    if(Ember.isEmpty(messages))
    {
      var message = self.store.createRecord('message', {
        fb_id: response.id,
        subject: response.name,
        to_user: self.get('model')
      });

      message.save().then(function() {

        var eventInvitation = self.store.createRecord('eventInvitation', {
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
        Ember.$('.side-nav-bar').addClass('closed');
        Ember.$('.side-nav-bar > .section-content').addClass('closed');
        Ember.$('.google-map').addClass('closed');
        Ember.$('.calendar').addClass('closed');
        this.set('isSidebarOpen', false);
      }
      else
      {
        Ember.$('.side-nav-bar').removeClass('closed');
        Ember.$('.side-nav-bar > .section-content').removeClass('closed');
        Ember.$('.google-map').removeClass('closed');
        Ember.$('.calendar').removeClass('closed');
        this.set('isSidebarOpen', true);
      }
    }
  }
});
