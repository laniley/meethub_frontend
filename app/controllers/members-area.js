import Ember from 'ember';

export default Ember.Controller.extend({

  isSidebarOpen: true,

  hasUnreadMessages: function() {

    if(this.get('model.messages.length') > 0)
    {
      var unreadMessages = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false;
      });
    }
    else
    {
      var unreadMessages = []
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
      Ember.$('.side-nav-bar').toggleClass('closed');
      Ember.$('.side-nav-bar > .section-content').toggleClass('closed');
      Ember.$('.google-map').toggleClass('closed');

      if(this.get('isSidebarOpen'))
      {
        this.set('isSidebarOpen', false);
      }
      else
      {
        this.set('isSidebarOpen', true);
      }
    }
  }
});
