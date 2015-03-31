import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.all('meethubComment');
  },
  beforeModel: function() {
    this.controllerFor('members-area').set('currentSection', 'news');
  },
  renderTemplate: function() {
    this.render('members-area.meethubs.news');
  }
});
