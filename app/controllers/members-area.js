import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area/map'],
  map_controller: Ember.computed.alias("controllers.members-area/map"),

  FB: null,
  isSidebarOpen: true,

  currentSection: 'map',

  hasUnreadMessages: function() {

    var unreadMessages = [];

    if(this.get('model.messages.length') > 0)
    {
      unreadMessages = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false;
      });
    }

    if(unreadMessages.get('length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('model.messages.@each.hasBeenRead'),

  init: function() {

    var self = this;

    setInterval
    (
      function() {
        self.loadUserEventsFromFB();
        self.store.find('meethub', { member: self.get('model').get('id') });
        // self.store.find('message', { user: self.get('model').get('id') });
        // self.store.find('eventInvitation', { invited_user: self.get('model').get('id') });
      },
      10000
    );

    // setInterval
    // (
    //   function() {
    //     self.loadFriendEventsFromFB();
    //   },
    //   10000
    // );
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

    var unfiltered_events = this.store.all('event');
    var events = unfiltered_events.filterBy('fb_id', response.id);
    var event = undefined;

    // if event not already in the store, create it
    if(Ember.isEmpty(events))
    {
      var date_time_arr = response.start_time.split('T');
      var date_time = date_time_arr[1].trim();
      var date_day = date_time_arr[0].trim();

      event = this.store.createRecord('event', {
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
      event = events.get('firstObject');
    }

    // if the user is not me
    if(user_fb_id !== 'me')
    {
      var unfiltered_users = this.store.all('user');
      var user = unfiltered_users.findBy('fb_id', user_fb_id);

      if(status === 'attending')
      {
        event.get('friends_attending').pushObject(user);
        console.log('friend is attending');
      }
      else if(status === 'maybe')
      {
        event.get('friends_attending_maybe').pushObject(user);
      }
    }

    event.save().then(function() {
      self.handleFBMessage(response, event);
    });
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
        user: self.get('model')
      });

      message.save().then(function() {

        var eventInvitation = self.store.createRecord('eventInvitation', {
          event: event,
          invited_user: self.get('model'),
          status: status,
          message: message
        });

        eventInvitation.save();

        message.set('eventInvitation', eventInvitation);
      });
    }
  },

  loadFriendEventsFromFB: function (fb_id) {

    var self = this;

    FB.api('/' + fb_id + '/events/attending', function(response)
    {
      if( !response.error )
      {
        console.log('friend events - attending: ', response);

        for(var i = 0; i < response.data.length; i++)
        {
          self.handleFBEventResponse(response.data[i], 'attending', fb_id);
        }
      }
      else
      {
        console.log(response.error);
      }
    });

    FB.api('/' + fb_id + '/events/maybe', function(response)
    {
      if( !response.error )
      {
        console.log('friend events - maybe: ', response);

        for(var i = 0; i < response.data.length; i++)
        {
          self.handleFBEventResponse(response.data[i], 'maybe', fb_id);
        }
      }
      else
      {
        console.log(response.error);
      }
    });

    FB.api('/' + fb_id + '/events/not_replied', function(response)
    {
      if( !response.error )
      {
        console.log('friend events - not_replied: ', response);

        for(var i = 0; i < response.data.length; i++)
        {
          self.handleFBEventResponse(response.data[i], 'not_replied', fb_id);
        }
      }
      else
      {
        console.log(response.error);
      }
    });
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
