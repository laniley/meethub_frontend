import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('members-area.map.friends', { outlet: 'side-nav-bar' });
    this.render('members-area.side-bar-links.friends', { outlet: 'side-bar-links' });
  }
});
