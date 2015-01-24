import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    this.controllerFor('members-area').set('currentSection', 'calendar');

    var currentSection = this.controllerFor('members-area/meethubs').get('currentSection');

    if(currentSection === 'create')
    {
      this.transitionTo('members-area.meethubs.calendar.create');
    }
    else if(currentSection === 'search')
    {
      this.transitionTo('members-area.meethubs.calendar.search');
    }
  },
  setupController: function(controller) {
    controller = this.controllerFor('members-area/calendar');
    controller.set('model', this.store.all('event'));
  },
  renderTemplate: function() {
    this.render('members-area.calendar', { outlet: 'main-area' });
    this.render('members-area.meethubs.calendar.section-buttons', {
      outlet: 'section-buttons',
      into: 'members-area.meethubs'
    });
  }
});
