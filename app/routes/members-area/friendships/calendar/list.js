import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.all('event');
  },
  renderTemplate: function() {
    this.render('members-area.friendships.calendar.list', {
      into: 'members-area.friendships.calendar',
      outlet: 'content'
    });
  }
});
