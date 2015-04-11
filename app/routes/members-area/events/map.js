import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    this.controllerFor('members-area').set('currentSection', 'map');
  },
  renderTemplate: function() {
    this.render('members-area.map');
  }
});
