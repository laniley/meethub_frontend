import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('members-area.sections.meethubs.section-title', { outlet: 'section-title' });
    this.render('members-area.map.meethubs', { outlet: 'side-nav-bar' });
    this.render('members-area.side-nav-bar.side-bar-links.meethubs', { outlet: 'side-bar-links' });
  }
});
