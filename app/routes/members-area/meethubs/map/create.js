import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    this.controllerFor('members-area/meethubs').set('currentSection', 'create');
  },
  renderTemplate: function() {
    var controller = this.controllerFor('members-area/meethubs/create');

    this.render('members-area.meethubs.create', {
      outlet: 'form',
      into: 'members-area.meethubs',
      controller: controller
    });
  }
});
