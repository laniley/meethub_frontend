import Ember from 'ember';

export default Ember.Route.extend({

  model: function(params) {
    return this.store.find('friendship', params.friendship_id);
  },

  setupController: function(controller, model) {
    controller.set('model', model);
    controller.set('isSidebarOpen', false);
  },

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
