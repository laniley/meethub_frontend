import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.all('event'));
  },
  beforeModel: function(transition) {

    var currentSection = this.controllerFor('members-area').get('currentSection');

    if(currentSection === 'calendar')
    {
      this.transitionTo('members-area.events.calendar');
    }
    else
    {
      this.transitionTo('members-area.events.map');
    }
  },
  renderTemplate: function() {
    this.render('members-area.events.side-nav-buttons', { outlet: 'side-nav-buttons' });
    this.render('members-area.events', { outlet: 'side-nav-bar' });
  }
});
