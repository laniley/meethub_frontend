import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    this.controllerFor('members-area').set('showSidebar', true);
  },
  renderTemplate: function() {
    this.render('members-area.messages.index', {
      into: 'members-area'
    });
  }
});
