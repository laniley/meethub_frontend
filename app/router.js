import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login', { path: '/'});
  this.resource('members-area', { path: '/members-area' }, function() {
    this.route('map', { path: '/map' }, function() {
      this.route('meethubs', { path: '/meethubs' }, function() {
        this.route('create');
        this.route('search');
      });
      this.route('friends');
      this.route('events');
      this.route('locations');
      this.route('messages');
    });
    this.route('calendar', { path: '/' }, function() {
      this.route('meethubs');
      this.route('friends');
      this.route('events');
      this.route('locations');
      this.route('messages');
    });
  });
});

export default Router;
