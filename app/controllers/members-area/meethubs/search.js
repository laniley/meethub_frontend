import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area','members-area/meethubs'],
  meethubs_controller: Ember.computed.alias("controllers.members-area/meethubs"),

  search_term: '',

  search_results: function() {
    var self = this;

    var unreadMessages = this.get('meethubs_controller').get('model').filter(function(meethub) {
      return meethub.get('name').indexOf(self.get('search_term')) !== -1;
    });

    return unreadMessages;

  }.property('search_term','meethubs_controller.@each'),

	actions: {
	   cancelActivity: function() {
	      this.controllerFor('members-area/meethubs').set('currentSection', null);
	      this.transitionTo('members-area.meethubs');
	   }
 	}

});
