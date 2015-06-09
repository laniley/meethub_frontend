import Ember from 'ember';
import DS from 'ember-data';
import ENV from '../config/environment';

export default DS.RESTAdapter.extend({
  host: ENV.backend_url,
  headers: {
    'user_id': self.get('session').get('secure.userId')
  }
});
