import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('members-area.friendships.calendar.title', {
      into: 'members-area.friendships.calendar',
      outlet: 'title'
    });

    this.render('members-area.friendships.calendar.list.friendship', {
      into: 'members-area.friendships.calendar',
      outlet: 'content'
    });
  }
});
