import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.all('message'));
  },
  beforeModel: function(transition) {

    var currentSection = this.controllerFor('members-area').get('currentSection');

    if(currentSection === 'calendar')
    {
      this.transitionTo('members-area.messages.calendar');
    }
    else
    {
      this.transitionTo('members-area.messages.map');
    }
  },
  renderTemplate: function() {
    this.render('members-area.messages', { outlet: 'side-nav-bar' });
  }
});
