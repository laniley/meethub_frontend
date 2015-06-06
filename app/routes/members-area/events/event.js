import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('event', params.event_id);
  },
  setupController: function(controller, model) {
    controller.set('model', model);
    this.controllerFor('members-area').set('showSidebar', true);
    this.controllerFor('members-area').set('isSidebarOpen', true);
  },
  renderTemplate: function() {
    this.render('members-area.events.event', {
      into: 'members-area',
      outlet: 'side-nav-bar'
    });
  }
});
