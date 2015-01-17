import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition) {

    var currentSection = this.controllerFor('members-area').get('currentSection');

    if(currentSection === 'calendar')
    {
      this.transitionTo('members-area.locations.calendar');
    }
    else
    {
      this.transitionTo('members-area.locations.map');
    }
  },
  renderTemplate: function() {
    this.render('members-area.locations.side-nav-buttons', { outlet: 'side-nav-buttons' });
    this.render('members-area.locations', { outlet: 'side-nav-bar' });
  }
});
