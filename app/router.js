import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login', { path: '/'});
  this.resource('members-area', { path: 'members-area' }, function() { });
});

export default Router;
