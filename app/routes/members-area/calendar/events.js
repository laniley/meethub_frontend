import Ember from 'ember';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.all('event'));
  },
  renderTemplate: function() {
    this.render('members-area.sections.events.section-title', { outlet: 'section-title' });
    this.render('members-area.calendar.events', { outlet: 'side-nav-bar' });
    this.render('members-area.side-nav-bar.side-bar-links.events', { outlet: 'side-bar-links' });
  }
});
