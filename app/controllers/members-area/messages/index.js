import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area', 'members-area/index'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),
  membersArea_index_controller: Ember.computed.alias("controllers.members-area/index"),

  isSidebarOpen: function() {
    return this.get('membersArea_controller').get('isSidebarOpen');
  }.property('membersArea_controller.isSidebarOpen'),



  hasUnreadMeethubInvitations: function() {
    return this.get('membersArea_controller').get('hasUnreadMeethubInvitations');
  }.property('membersArea_controller.hasUnreadMeethubInvitations'),

  hasUnreadEventInvitations: function() {
    return this.get('membersArea_controller').get('hasUnreadEventInvitations');
  }.property('membersArea_controller.hasUnreadEventInvitations'),



  number_of_new_meethub_invitations: function() {
    return this.get('membersArea_controller.number_of_new_meethub_invitations');
  }.property('membersArea_controller.number_of_new_meethub_invitations'),

  number_of_new_event_invitations: function() {
    return this.get('membersArea_controller.number_of_new_event_invitations');
  }.property('membersArea_controller.number_of_new_event_invitations')

});
