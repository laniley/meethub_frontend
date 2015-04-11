import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    var membersAreaController = this.controllerFor('members-area');
    var user = membersAreaController.get('model');
    controller.set('model', user.get('friends'));

    var currentSection = this.controllerFor('members-area').get('currentSection');

    if(currentSection === 'calendar')
    {
      this.transitionTo('members-area.friends.calendar');
    }
    else
    {
      this.transitionTo('members-area.friends.map');
    }

    this.controllerFor('members-area').set('showSidebar', true);
  },
  renderTemplate: function() {
    this.render('members-area.friends.side-nav-buttons', {
      into: 'members-area',
      outlet: 'side-nav-buttons'
    });
    this.render('members-area.friends', {
      into: 'members-area',
      outlet: 'side-nav-bar'
    });
  }
});
