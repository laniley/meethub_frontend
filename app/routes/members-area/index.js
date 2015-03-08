import Ember from 'ember';

export default Ember.Route.extend({

  setupController: function(controller) {

    this.controllerFor('membersArea').set('showSidebar', false);

    // controller.set('model', this.controllerFor('membersArea').get('model'));

  }

});
