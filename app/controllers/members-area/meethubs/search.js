import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area','members-area/meethubs'],
  meethubs_controller: Ember.computed.alias("controllers.members-area/meethubs"),

  search_term: '',

  search_results: function() {
    var self = this;

    var meethubs = this.store.all('meethub');

    var filteredMeethubs = meethubs.filter(function(meethub) {
      return meethub.get('name').indexOf(self.get('search_term')) !== -1;
    });

    this.get('meethubs_controller').set('model', filteredMeethubs);

    return filteredMeethubs;

  }.property('search_term','meethubs_controller.@each'),

	actions: {
    cancelActivity: function() {
      var meethubs = this.store.all('meethub');

      this.set('search_term', '');
      this.get('meethubs_controller').set('model', meethubs);

      this.get('meethubs_controller').set('currentSection', null);
      this.transitionTo('members-area.meethubs');
    }
 	}

});
