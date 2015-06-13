import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.all('event');
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    controller.set('model', model);
  },
  renderTemplate: function() {
    this.render('members-area.events', {
      into: 'members-area'
    });
  }
});
