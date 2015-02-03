import Ember from 'ember';

export default Ember.Controller.extend({

<<<<<<< HEAD
	actions: {
	   cancelActivity: function() {
	      this.controllerFor('members-area/meethubs').set('currentSection', null);
	      this.transitionTo('members-area.meethubs');
	   }
 	}
=======
  search_term: ''

>>>>>>> search-term
});
