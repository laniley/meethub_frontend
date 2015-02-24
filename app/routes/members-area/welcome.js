import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    this.controllerFor('members-area').set('showSidebar', false);
  },
  renderTemplate: function() {
    this.render('members-area.welcome', {
        into: 'members-area',
        outlet: 'main-area'
    });
  }
});
