import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('members-area.map.events', { outlet: 'side-nav-bar' });
    this.render('members-area.side-bar-links.events', { outlet: 'side-bar-links' });
  }
});
