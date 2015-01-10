import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('members-area.sections.events.section-title', { outlet: 'section-title' });
    this.render('members-area.map.events', { outlet: 'side-nav-bar' });
    this.render('members-area.side-nav-bar.side-bar-links.events', { outlet: 'side-bar-links' });
  }
});
