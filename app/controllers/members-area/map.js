import Ember from 'ember';
import {MAP_TYPES} from '../../components/google-map';

export default Ember.Controller.extend({

  lat:      0,
  lng:      0,
  zoom:     5,
  type:     'road',
  mapTypes: MAP_TYPES

});
