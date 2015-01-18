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
      },
      10000
    );
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
          self.handleFBEventResponse(response.data[i], 'attending');
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
          self.handleFBEventResponse(response.data[i], 'maybe');
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
          self.handleFBEventResponse(response.data[i], 'not_replied');
        }
      }
      else
      {
        console.log(response.error);
      }
    });
  },

  handleFBEventResponse: function(response, status) {

    var self = this;

    var location = null;

    if(response.venue)
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
    }
    else
    {
      var found_location = self.store.find('location', { name: response.location });
      // console.log(found_location);

      // if(found_location.length <= 0)
      // {
      //   location = this.store.createRecord('location', {
      //     name: response.location
      //   });
      // }
    }

    // location.save().then(function() {
    //   var date_time_arr = response.start_time.split('T');
    //   var date_time = date_time_arr[1];
    //   var date_day = date_time_arr[0];

    //   var event = self.store.createRecord('event', {
    //     fb_id: response.id,
    //     name: response.name,
    //     description: response.descrption,
    //     start: moment(response.start_time, "YYYY-MM-DDTHH:mm:ss.SSSSZ"),
    //     end: moment(response.start_time, "YYYY-MM-DDTHH:mm:ss.SSSSZ").add(1, 'hours'),
    //     start_time: date_time,
    //     start_date: date_day,
    //     timezone: response.timezone,
    //     location: location,
    //   });

    //   event.save().then(function() {

    //     var message = self.store.createRecord('message', {
    //       fb_id: response.id,
    //       subject: response.name,
    //       user: self.get('controller').get('model')
    //     });

    //     message.save().then(function() {

    //       var eventInvitation = self.store.createRecord('eventInvitation', {
    //         event: event,
    //         invited_user: self.get('controller').get('model'),
    //         status: status,
    //         message: message
    //       });

    //       eventInvitation.save();

    //       message.set('eventInvitation', eventInvitation);
    //     });

    //   });

    // });
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
