import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.all('location'));

    var currentSection = this.controllerFor('members-area').get('currentSection');

    if(currentSection === 'calendar')
    {
      this.transitionTo('members-area.locations.calendar');
    }
    else
    {
      this.transitionTo('members-area.locations.map');
    }

    this.controllerFor('members-area').set('showSidebar', true);
  },
  renderTemplate: function() {
    this.render('members-area.locations.side-nav-buttons', {
      into: 'members-area',
      outlet: 'side-nav-buttons'
    });
    this.render('members-area.locations', {
      into: 'members-area',
      outlet: 'side-nav-bar'
    });
  }
});
