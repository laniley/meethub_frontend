import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition) {

    var currentSection = this.controllerFor('members-area').get('currentSection');

    if(currentSection === 'calendar')
    {
      this.transitionTo('members-area.meethubs.calendar');
    }
    else
    {
      this.transitionTo('members-area.meethubs.map');
    }
  },
  renderTemplate: function() {
    this.render('members-area.meethubs.side-nav-buttons', { outlet: 'side-nav-buttons' });
    this.render('members-area.meethubs', { outlet: 'side-nav-bar' });
  }
});