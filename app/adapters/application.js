import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.backend_url,
  headers: {
    'user_id': Ember.$.cookie('user_id')
  }
});
