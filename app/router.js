import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login', { path: '/'});
  this.resource('members-area', { path: 'members-area' }, function() {
    this.route('map', function() {
      this.route('meethubs');
      this.route('friends');
      this.route('events');
      this.route('locations');
    });
  });
});

export default Router;
