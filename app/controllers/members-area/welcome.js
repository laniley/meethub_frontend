import Ember from 'ember';

export default Ember.Controller.extend({

  number_of_new_messages: function() {
    return this.get('unreadMessages.length');
  }.property('unreadMessages.@each'),

  hasUnreadMessages: function() {

    if(this.get('unreadMessages.length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('unreadMessages.@each'),

  unreadMessages: function() {
    var unreadMessages = [];

    if(this.get('model.messages.length') > 0)
    {
      unreadMessages = this.get('model.messages').filter(function(message) {
        return message.get('hasBeenRead') === false;
      });
    }

    return unreadMessages;
  }.property('model.messages.@each.hasBeenRead')
});
