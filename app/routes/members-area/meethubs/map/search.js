import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    this.controllerFor('members-area/meethubs').set('currentSection', 'search');
  },
});
