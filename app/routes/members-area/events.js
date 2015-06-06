import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.all('event'));

    this.controllerFor('members-area').set('isSidebarOpen', false);
    this.controllerFor('members-area').set('showSidebar', false);
  },
  renderTemplate: function() {
    // this.render('members-area.events.side-nav-buttons', {
    //   into: 'members-area',
    //   outlet: 'side-nav-buttons'
    // });
    this.render('members-area.events', {
      into: 'members-area'
    });
  }
});
