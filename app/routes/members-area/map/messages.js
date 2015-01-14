import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller = this.controllerFor('members-area/sections/messages');
    controller.set('model', this.store.all('message'));
  },
  renderTemplate: function() {
    this.render('members-area.sections.messages.section-title', {
      outlet: 'section-title'
    });
    this.render('members-area.sections.messages.section-content', {
      outlet: 'side-nav-bar',
      controller: 'members-area/sections/messages'
    });
    this.render('members-area.side-nav-bar.side-bar-links.messages', {
      outlet: 'side-bar-links'
    });
  }
});
