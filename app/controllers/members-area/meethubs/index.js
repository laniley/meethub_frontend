import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area', 'members-area/index'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),
  membersArea_index_controller: Ember.computed.alias("controllers.members-area/index"),

  isSidebarOpen: function() {
    return this.get('membersArea_controller').get('isSidebarOpen');
  }.property('membersArea_controller.isSidebarOpen'),



  hasNewMeethubComments: function() {
    return this.get('membersArea_controller').get('hasNewMeethubComments');
  }.property('membersArea_controller.hasNewMeethubComments'),

  hasSocialPointUpdates: function() {
    return this.get('membersArea_index_controller.hasSocialPointUpdates');
  }.property('membersArea_index_controller.hasSocialPointUpdates'),

  socialPointUpdates: function() {
    return this.get('membersArea_index_controller.socialPointUpdates');
  }.property('membersArea_index_controller.socialPointUpdates'),


  number_of_new_meethub_comments: function() {
    return this.get('membersArea_controller').get('number_of_new_meethub_comments');
  }.property('membersArea_controller.number_of_new_meethub_comments')

});
