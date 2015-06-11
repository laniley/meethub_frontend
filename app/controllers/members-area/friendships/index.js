import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area', 'members-area/index'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),
  membersArea_index_controller: Ember.computed.alias("controllers.members-area/index"),

  isSidebarOpen: function() {
    return this.get('membersArea_controller').get('isSidebarOpen');
  }.property('membersArea_controller.isSidebarOpen')

  // unseen_new_friends: function() {
  //   var unseenFriends = [];

  //   if(this.get('membersArea_controller').get('model.length') > 0)
  //   {
  //     unseenFriends = this.get('membersArea_controller').get('model').get('friends').filter(function(friend) {
  //       return friend.get('is_a_new_friend') === true && friend.get('has_been_seen') === false;
  //     });
  //   }

  //   return unseenFriends;
  // }.property('membersArea_controller.model.friends.@each'),

  // number_of_unseen_new_friends: function() {

  //   return this.get('unseen_new_friends.length');

  // }.property('unseen_new_friends'),

  // hasUnseenNewFriends: function() {
  //   if(this.get('number_of_unseen_new_friends') > 0)
  //   {
  //     return true;
  //   }
  //   else
  //   {
  //     return false;
  //   }
  // }.property('number_of_unseen_new_friends')

});
