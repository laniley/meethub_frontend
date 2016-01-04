/* global FB */
import Ember from 'ember';
import FacebookLoginMixin from './../../mixins/facebook-login';

export default Ember.Component.extend(FacebookLoginMixin, {
  classNames: ['item'],
  classNameBindings: ['message.is_open:open'],
  message: null,
  social_points_threshold: 0,
  participation_status_changed: false,

  actions: {
    toggleMessage: function() {
      if(this.get('message').get('is_open')) {
        this.get('message').set('is_open', false);
      }
      else {
        this.get('message').set('is_open', true);
        if(!this.get('message').get('reference_object').get('has_been_seen')) {
          this.get('message').get('reference_object').set('has_been_seen', true);
          this.get('message').get('reference_object').save();
        }
      }
    },
    setEventInvitationStatus: function(eventInvitation, status) {
      eventInvitation.set('status', status);
      eventInvitation.save();
      this.set('participation_status_changed', true);
    },
    postStatusToFB: function(eventInvitation) {
      var status = eventInvitation.get('status');
      var event_id = eventInvitation.get('event').get('fb_id');
      var user_id = eventInvitation.get('user').get('fb_id');
      var access_token = this.store.peekRecord('me', 1).get('fb_access_token');
      console.log(event_id, status, user_id);
      // var url = 'https://graph.facebook.com/'+eventid+'/attending/'+userid+'?access_token='+accessToken;
      // check permissions
      FB.api(user_id + '/permissions', response => {
        if( !response.error ) {
          var rsvp_event_is_granted = false;
          response.data.forEach(permission => {
            if(permission.permission === 'rsvp_event' && permission.status === 'granted') {
              rsvp_event_is_granted = true;
            }
          });

          if(rsvp_event_is_granted) {
            Ember.$.post('https://graph.facebook.com/'+event_id+'/'+status+'/'+user_id+'?access_token='+access_token, response => {
              if( !response.error ) {
                this.set('participation_status_changed', false);
              }
              else {
                console.log('ERROR: ', response);
              }
            });
          }
          else {
            this.login();
          }
        }
        else {
          console.log('ERROR: ', response);
        }
      });
    }
  }
});
