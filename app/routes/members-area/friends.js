import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function() {
    // controller.set('model', this.store.all('friend'));

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
