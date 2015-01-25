import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    cancelActivity: function() {
      this.controllerFor('members-area/meethubs').set('currentSection', null);
      this.transitionTo('members-area.meethubs');
    }
  }
});
