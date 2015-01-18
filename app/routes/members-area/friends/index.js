import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    var membersAreaController = this.controllerFor('members-area');
    var user = membersAreaController.get('model');
    controller.set('model', user.get('friends'));
  },
  beforeModel: function() {

    var currentSection = this.controllerFor('members-area').get('currentSection');

    if(currentSection === 'calendar')
    {
      this.transitionTo('members-area.friends.calendar');
    }
    else
    {
      this.transitionTo('members-area.friends.map');
    }
  },
  renderTemplate: function() {
    this.render('members-area.friends.side-nav-buttons', { outlet: 'side-nav-buttons' });
    this.render('members-area.friends', { outlet: 'side-nav-bar' });
  }
});
