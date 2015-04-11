import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  sortProperties: ['created_at:desc'],
  sortedComments: Ember.computed.sort('comments', 'sortProperties'),

  comments: function() {
    return this.get('model');
  }.property('model.@each'),

  isSidebarOpen: function() {
    return this.get('membersArea_controller').get('isSidebarOpen');
  }.property('membersArea_controller.isSidebarOpen')
});
