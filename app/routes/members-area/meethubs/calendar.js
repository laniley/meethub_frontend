import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    this.controllerFor('members-area').set('currentSection', 'calendar');
  },
  setupController: function(controller) {
    controller = this.controllerFor('members-area/calendar');
    controller.set('model', this.store.all('event'));
  },
  renderTemplate: function() {
    this.render('members-area.calendar');
  }
});
