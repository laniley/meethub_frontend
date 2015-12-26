/* global FB */
import Ember from 'ember';

export default Ember.Controller.extend({

  syncMessage: '',

  syncWithFB: function() {
    console.log('Syncing with FB ...');

    this.set('model.isSyncingWithFB', true);

    this.loadUserEventsFromFB(() => {
      console.log('finished loading your events from FB');
      this.loadFriendEventsFromFB(() => {
        console.log('finished loading the events of your friends from FB');
        this.set('model.isSyncingWithFB', false);
      });
    });
  },

  loadUserEventsFromFB: function (callback) {
    console.log('loading your events from FB ...');

    this.set('userEventsSynced', false);

    var finished_requests = 0;

    FB.api('/me/events/attending', response => {
      if( !response.error ) {
        console.log('user events - attending: ', response);
          var attending_reponses = response.data.length;
          var finished_attending_responses = 0;
          if(response.data.length > 0) {
            for(var i = 0; i < response.data.length; i++) {
              this.handleFBEventResponse(response.data[i], 'attending', 'me', () => {
                finished_attending_responses++;
                if(finished_attending_responses === attending_reponses) {
                  finished_requests++;
                  if(finished_requests === 3) {
                    callback();
                  }
                }
              });
            }
          }
          else {
            finished_requests++;
            if(finished_requests === 3) {
              callback();
            }
          }
        }
      else {
        console.log(response.error);
        finished_requests++;
        if(finished_requests === 3) {
          callback();
        }
      }
    });

    FB.api('/me/events/maybe', response => {
      if( !response.error ) {
        console.log('user events - maybe: ', response);
        var maybe_reponses = response.data.length;
        var finished_maybe_responses = 0;

        if(response.data.length > 0) {
          for(var i = 0; i < response.data.length; i++) {
            this.handleFBEventResponse(response.data[i], 'maybe', 'me', () => {
              finished_maybe_responses++;
              if(finished_maybe_responses === maybe_reponses) {
                finished_requests++;
                if(finished_requests === 3) {
                  callback();
                }
              }
            });
          }
        }
        else {
          finished_requests++;
          if(finished_requests === 3) {
            callback();
          }
        }
      }
      else
      {
        console.log(response.error);
        finished_requests++;
        if(finished_requests === 3) {
          callback();
        }
      }
    });

    FB.api('/me/events/not_replied', response => {
      if( !response.error ) {
        console.log('user events - not_replied: ', response);
        var not_replied_reponses = response.data.length;
        var finished_not_replied_responses = 0;

        if(response.data.length > 0) {
          for(var i = 0; i < response.data.length; i++) {
            this.handleFBEventResponse(response.data[i], 'not_replied', 'me', () => {
              finished_not_replied_responses++;
              if(finished_not_replied_responses === not_replied_reponses) {
                finished_requests++;
                if(finished_requests === 3) {
                  callback();
                }
              }
            });
          }
        }
        else {
          finished_requests++;
          if(finished_requests === 3) {
            callback();
          }
        }
      }
      else {
        console.log(response.error);
        finished_requests++;
        if(finished_requests === 3) {
          callback();
        }
      }
    });
  },

  loadFriendEventsFromFB: function (callback) {
    console.log('loading your friend events from FB ...');
    var friends = this.store.peekAll('friend');
    friends.forEach(friend => {
      this.loadEventsOfAFriendFromFB(friend, () => {
        if(Ember.isEqual(friend, friends.get('lastObject'))) {
          if(callback) {
            callback();
          }
        }
      });
    });
  },

  loadEventsOfAFriendFromFB: function(friend, callback) {
    console.log('loading events of ' + friend.get('name'));
    var finished_request_types = 0;
    var number_of_request_types = 3;
    FB.api('/' + friend.get('user').get('fb_id') + '/events/attending', response => {
      if( !response.error ) {
        console.log('friend events - attending: ', response);
        if(response.data.length > 0) {
          for(var i = 0; i < response.data.length; i++) {
            this.handleFBEventResponse(response.data[i], 'attending', friend.get('friend_fb_id'), () => {
              if(i === response.data.length - 1) {
                finished_request_types++;
                if(finished_request_types === number_of_request_types) {
                  if(callback) {
                    callback();
                  }
                }
              }
            });
          }
        }
        else {
          finished_request_types++;
          if(finished_request_types === number_of_request_types) {
            if(callback) {
              callback();
            }
          }
        }
      }
      else {
        console.log(response.error);
        finished_request_types++;
        if(finished_request_types === number_of_request_types) {
          if(callback) {
            callback();
          }
        }
      }
    });
    FB.api('/' + friend.get('user').get('fb_id') + '/events/maybe', response => {
      if( !response.error ) {
        console.log('friend events - maybe: ', response);
        if(response.data.length > 0) {
          for(var i = 0; i < response.data.length; i++) {
            this.handleFBEventResponse(response.data[i], 'maybe', friend.get('friend_fb_id'), () => {
              if(i === response.data.length - 1) {
                finished_request_types++;
                if(finished_request_types === number_of_request_types) {
                  if(callback) {
                    callback();
                  }
                }
              }
            });
          }
        }
        else {
          finished_request_types++;
          if(finished_request_types === number_of_request_types) {
            if(callback) {
              callback();
            }
          }
        }
      }
      else
      {
        console.log(response.error);
        finished_request_types++;
        if(finished_request_types === number_of_request_types) {
          if(callback) {
            callback();
          }
        }
      }
    });
    FB.api('/' + friend.get('user').get('fb_id') + '/events/not_replied', response => {
      if( !response.error ) {
        console.log('friend events - not_replied: ', response);
        if(response.data.length > 0) {
          for(var i = 0; i < response.data.length; i++) {
            this.handleFBEventResponse(response.data[i], 'not_replied', friend.get('fb_id'), () => {
              if(i === response.data.length - 1) {
                finished_request_types++;
                if(finished_request_types === number_of_request_types) {
                  if(callback) {
                    callback();
                  }
                }
              }
            });
          }
        }
        else {
          finished_request_types++;
          if(finished_request_types === number_of_request_types) {
            if(callback) {
              callback();
            }
          }
        }
      }
      else
      {
        console.log(response.error);
        finished_request_types++;
        if(finished_request_types === number_of_request_types) {
          if(callback) {
            callback();
          }
        }
      }
    });
  },

  handleFBEventResponse: function(response, event_status, user_fb_id, callback) {

    if(callback) {
      callback();
    }

    var event = null;

    this.store.query('event', { 'fb_id': response.id }).then(events => {
      if(Ember.isEmpty(events)) {
        console.log('event not yet in DB - ', response.name);
        var date_time_arr = response.start_time.split('T');
        var date_time = '';
        var date_day = '';

        if(date_time_arr[1]) {
          date_time = date_time_arr[1].trim();
        }

        if(date_time_arr[0]) {
          date_day = date_time_arr[0].trim();
        }

        var location = null;

        if(response.venue) {
          location = this.getLocationByVenueInformation(response);
        }
        else {
          location = this.getLocationByName(response);
        }

        location.then(location => {
          event = this.store.createRecord('event', {
            fb_id: response.id,
            name: response.name,
            description: response.descrption,
            start_time: date_time,
            start_date: date_day,
            location: location,
            timezone: response.timezone
          });

          event.save().then(event => {
            this.handleFBMessage(response, event, event_status, user_fb_id);
          });
        });

      }
      else {
        event = events.get('firstObject');
        this.handleFBMessage(response, event, event_status, user_fb_id);
      }
    });
  },

  getLocationByVenueInformation: function(response) {
    return this.store.query('location', { 'fb_id': response.venue.id }).then(locations => {

      this.get('map_controller').get('markers').addObject({title: response.location, lat: response.venue.latitude, lng: response.venue.longitude, isDraggable: false});

      var location = null;

      if(Ember.isEmpty(locations)) {
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
        return location.save().then(location => {
          return location;
        });
      }
      else {
        return locations.get('firstObject');
      }
    });
  },

  getLocationByName: function(response) {
    return this.store.query('location', { 'name': response.location }).then(locations => {
      if(Ember.isEmpty(locations)) {
        var location = this.store.createRecord('location', {
          name: response.location
        });
        return location.save().then(location => {
          return location;
        });
      }
      else {
        return locations.get('firstObject');
      }
    });
  },

  handleFBMessage: function(response, event, status, user_fb_id, callback) {

    var me = this.store.peekRecord('me', 1);

    me.get('user').then(user => {
      this.store.query('message', { fb_id: event.get('fb_id'), to_user_id: user.get('id') }).then(messages => {
        var message = null;
        // if message not already in the DB, create it
        if(Ember.isEmpty(messages)) {
          console.log('message not already in the DB');
          message = this.store.createRecord('message', {
            fb_id: event.get('fb_id'),
            subject: response.name,
            to_user: user
          });
          message.save().then(message => {
            this.handleEventInvitation(event, message, user, status, callback);
          });
        }
        // message already in the DB
        else {
          message = messages.get('firstObject');
          console.log('message already in the DB', message);
          this.handleEventInvitation(event, message, user, status, callback);
        }
      });
    });
  },

  handleEventInvitation: function(event, message, user, status, callback) {
    this.store.query('eventInvitation', {
      'event_id': event.get('id'),
      'invited_user_id': user.get('id')
    }).then(eventInvs => {
      var eventInvitation = null;
      if(Ember.isEmpty(eventInvs)) {
        console.log('eventInvitation not already in the DB');
        eventInvitation = this.store.createRecord('eventInvitation', {
          event: event,
          invited_user: user,
          status: status,
          message: message
        });
      }
      else {
        console.log('eventInvitation already in the DB');
        eventInvitation = eventInvs.get('firstObject');
        eventInvitation.set('message', message);
      }

      eventInvitation.save().then(eventInvitation => {
        message.set('eventInvitation', eventInvitation);
        if(callback) {
          callback();
        }
      });
    });
  }

});
