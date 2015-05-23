import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area', 'members-area/index'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),
  membersArea_index_controller: Ember.computed.alias("controllers.members-area/index"),

  isSidebarOpen: function() {
    return this.get('membersArea_controller').get('isSidebarOpen');
  }.property('membersArea_controller.isSidebarOpen'),

  number_of_unseen_friends: function() {

    // var unreadMessages = [];

    // if(this.get('model.messages.length') > 0)
    // {
    //   unreadMessages = this.get('model.messages').filter(function(message) {
    //     return message.get('hasBeenRead') === false;
    //   });
    // }

    // var unreadEventInvitations = [];

    // if(unreadMessages.get('length') > 0)
    // {
    //   unreadEventInvitations = unreadMessages.filter(function(message) {
    //     return message.get('isEventInvitation') === true;
    //   });
    // }

    // return unreadEventInvitations.get('length');

  }.property('model.@each')

});
