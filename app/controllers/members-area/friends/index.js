import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area', 'members-area/index'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),
  membersArea_index_controller: Ember.computed.alias("controllers.members-area/index"),

  isSidebarOpen: function() {
    return this.get('membersArea_controller').get('isSidebarOpen');
  }.property('membersArea_controller.isSidebarOpen')

});
