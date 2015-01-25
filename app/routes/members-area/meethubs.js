import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    var membersAreaController = this.controllerFor('members-area');
    var user = membersAreaController.get('model');

    if(user !== null)
    {
      controller.set('model', this.store.find('meethub', { member: user.get('id') }));
    }
  },
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
