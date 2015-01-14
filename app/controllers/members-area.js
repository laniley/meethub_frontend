import Ember from 'ember';

export default Ember.Controller.extend({

  isSidebarOpen: true,

  hasUnreadMessages: function() {

    var unreadMessages = [];

    if(this.get('model.messages.length') > 0)
    {
      unreadMessages = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false;
      });
    }

    if(unreadMessages.get('length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('model.messages.@each.hasBeenRead'),

  actions: {
    toggleSidebar: function() {
      if(this.get('isSidebarOpen'))
      {
        Ember.$('.side-nav-bar').addClass('closed');
        Ember.$('.side-nav-bar > .section-content').addClass('closed');
        Ember.$('.google-map').addClass('closed');
        Ember.$('.calendar').addClass('closed');
        this.set('isSidebarOpen', false);
      }
      else
      {
        Ember.$('.side-nav-bar').removeClass('closed');
        Ember.$('.side-nav-bar > .section-content').removeClass('closed');
        Ember.$('.google-map').removeClass('closed');
        Ember.$('.calendar').removeClass('closed');
        this.set('isSidebarOpen', true);
      }
    }
  }
});
