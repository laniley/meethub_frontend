import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller) {

    this.controllerFor('membersArea').set('showSidebar', false);

  }

});
