import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.all('event');
  },
  renderTemplate: function() {
    this.render('members-area.friends.calendar.list', {
      into: 'members-area.friends.calendar',
      outlet: 'content'
    });
  }
});
