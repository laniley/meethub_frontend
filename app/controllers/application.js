/* global FB */
import Ember from 'ember';

export default Ember.Controller.extend({
  map_controller: Ember.inject.controller("map"),

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

    var me = this.store.peekRecord('me', 1);

    me.get('user').then(user => {
      FB.api('/me/events/attending', response => {
        if( !response.error ) {
          console.log('user events - attending: ', response);
            var attending_reponses = response.data.length;
            var finished_attending_responses = 0;
            if(response.data.length > 0) {
              for(var i = 0; i < response.data.length; i++) {
                this.handleFBEventResponse(true, response.data[i], 'attending', user, () => {
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
              this.handleFBEventResponse(true, response.data[i], 'maybe', user, () => {
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
              this.handleFBEventResponse(true, response.data[i], 'not_replied', user, () => {
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
    friend.get('friend').then(friend => {
      FB.api('/' + friend.get('fb_id') + '/events/attending', response => {
        if( !response.error ) {
          console.log('friend events - attending: ', response);
          if(response.data.length > 0) {
            for(var i = 0; i < response.data.length; i++) {
              var event_data = response.data[i];
              // for the friend
              this.handleFBEventResponse(true, event_data, 'attending', friend, () => {
                if(i === response.data.length - 1) {
                  finished_request_types++;
                  if(finished_request_types === number_of_request_types) {
                    if(callback) {
                      callback();
                    }
                  }
                }
              });
              // for me
              var me = this.store.peekRecord('me', 1);
              me.get('user').then(user => {
                this.handleFBEventResponse(false, event_data, '', user);
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
      FB.api('/' + friend.get('fb_id') + '/events/maybe', response => {
        if( !response.error ) {
          console.log('friend events - maybe: ', response);
          if(response.data.length > 0) {
            for(var i = 0; i < response.data.length; i++) {
              var event_data = response.data[i];
              // for the friend
              this.handleFBEventResponse(true, event_data, 'maybe', friend, () => {
                if(i === response.data.length - 1) {
                  finished_request_types++;
                  if(finished_request_types === number_of_request_types) {
                    if(callback) {
                      callback();
                    }
                  }
                }
              });
              // for me
              var me = this.store.peekRecord('me', 1);
              me.get('user').then(user => {
                this.handleFBEventResponse(false, event_data, '', user);
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
      FB.api('/' + friend.get('fb_id') + '/events/not_replied', response => {
        if( !response.error ) {
          console.log('friend events - not_replied: ', response);
          if(response.data.length > 0) {
            for(var i = 0; i < response.data.length; i++) {
              var event_data = response.data[i];
              // for the friend
              this.handleFBEventResponse(true, event_data, 'not_replied', friend, () => {
                if(i === response.data.length - 1) {
                  finished_request_types++;
                  if(finished_request_types === number_of_request_types) {
                    if(callback) {
                      callback();
                    }
                  }
                }
              });
              // for me
              var me = this.store.peekRecord('me', 1);
              me.get('user').then(user => {
                this.handleFBEventResponse(false, event_data, '', user);
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
    });
  },

  handleFBEventResponse: function(owned_by_user /* true or false */, response, event_status, invited_user, callback) {
    if(callback) {
      callback();
    }
    this.store.query('event', { 'fb_id': response.id }).then(events => {
      var event = null;
      if(Ember.isEmpty(events)) {
        // console.log('event not yet in DB - ', response);
        var date_time_arr = response.start_time.split('T');
        var date_time = '';
        var date_day = '';

        if(date_time_arr[1]) {
          date_time = date_time_arr[1].trim();
        }
        if(date_time_arr[0]) {
          date_day = date_time_arr[0].trim();
        }

        // load location-data from FB
        FB.api(response.id, {fields: 'id,name,description,cover,start_time,location,venue'}, response => {
          if( !response.error ) {
            this.getLocation(response).then(location => {
              this.setMapMarker(location);
              event = this.store.createRecord('event', {
                fb_id: response.id,
                name: response.name,
                description: response.description,
                start_time: date_time,
                start_date: date_day,
                timezone: response.timezone,
                location: location,
                picture: response.cover.source
              });
              event.save().then(event => {
                this.handleEventInvitation(owned_by_user /* true or false */, event, event_status, invited_user, callback);
              });
            });
          }
          else {
            console.log(response.error);
          }
        });
      }
      else {
        // console.log('event already in DB - ', response);
        event = events.get('firstObject');
        event.get('location').then(location => {
          this.setMapMarker(location);
        });
        this.handleEventInvitation(owned_by_user /* true or false */, event, event_status, invited_user, callback);
      }
    });
  },

  setMapMarker: function(location) {
    this.get('map_controller').get('markers').addObject({title: location.get('name'), lat: location.get('latitude'), lng: location.get('longitude'), isDraggable: false});
  },

  getLocation: function(response) {
    if(response.venue) {
      return this.getLocationByVenueInformation(response);
    }
    else {
      return this.getLocationByName(response);
    }
  },

  getLocationByVenueInformation: function(response) {
    // console.log('getLocationByVenueInformation');
    return this.store.query('location', { 'fb_id': response.venue.id }).then(locations => {
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
    // console.log('getLocationByName');
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

  handleEventInvitation: function(owned_by_user /* true or false */, event, status, invited_user, callback) {
    this.store.query('eventInvitation', {
      'event_id': event.get('id'),
      'invited_user_id': invited_user.get('id')
    }).then(eventInvs => {
      var eventInvitation = null;
      if(Ember.isEmpty(eventInvs)) {
        if(!owned_by_user) {
          status = 'not_replied';
        }
        eventInvitation = this.store.createRecord('eventInvitation', {
          event: event,
          user: invited_user,
          status: status
        });
        eventInvitation.save().then(() => {
          if(callback) {
            callback();
          }
        });
      }
      else {
        if(callback) {
          callback();
        }
      }
    });
  }
});
