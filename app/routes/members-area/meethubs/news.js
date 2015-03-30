import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('meethub-comment', { user: this.controllerFor('members-area').get('model').get('id') });
  },
  beforeModel: function() {
    this.controllerFor('members-area').set('currentSection', 'news');
  },
  renderTemplate: function() {
    this.render('members-area.meethubs.news');
  }
});
