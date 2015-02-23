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
    this.render('members-area.side-nav-bar', {
      into: 'members-area',
      outlet: 'side-nav-bar-container'
    });
    this.render('members-area.messages.side-nav-buttons', {
      into: 'members-area.side-nav-bar',
      outlet: 'side-nav-buttons'
    });
    this.render('members-area.messages', {
      into: 'members-area.side-nav-bar',
      outlet: 'side-nav-bar'
    });
  }
});
