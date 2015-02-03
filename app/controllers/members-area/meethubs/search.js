import Ember from 'ember';

export default Ember.Controller.extend({

  search_term: '',

	actions: {
	   cancelActivity: function() {
	      this.controllerFor('members-area/meethubs').set('currentSection', null);
	      this.transitionTo('members-area.meethubs');
	   }
 	}

});
