import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('members-area.sections.friends.section-title', { outlet: 'section-title' });
    this.render('members-area.calendar.friends', { outlet: 'side-nav-bar' });
    this.render('members-area.side-nav-bar.side-bar-links.friends', { outlet: 'side-bar-links' });
  }
});
