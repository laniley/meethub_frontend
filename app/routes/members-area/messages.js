import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition) {
    console.log('transition', transition);
    this.transitionTo('messages.map');
  },
  renderTemplate: function() {
    this.render('members-area.messages', { outlet: 'side-nav-bar' });
  }
});
