import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.all('event'));
  },
  renderTemplate: function() {
    this.render('members-area.events', {
      into: 'members-area'
    });
  }
});
