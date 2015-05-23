import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('members-area.friends.calendar.title', {
      into: 'members-area.friends.calendar',
      outlet: 'title'
    });

    this.render('members-area.friends.calendar.list.friend', {
      into: 'members-area.friends.calendar',
      outlet: 'content'
    });

    // this.render('members-area.friends.calendar.list');
  }
});
