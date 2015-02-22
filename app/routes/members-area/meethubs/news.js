import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('members-area.meethubs.news', { outlet: 'main-area' });
  }
});
