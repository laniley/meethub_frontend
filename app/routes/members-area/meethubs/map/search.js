import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    this.controllerFor('members-area/meethubs').set('currentSection', 'search');
  },
  renderTemplate: function() {
    this.render('members-area.meethubs.search', {
      outlet: 'form',
      into: 'members-area.meethubs'
    });
  }
});
