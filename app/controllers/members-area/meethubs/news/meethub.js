import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  sortProperties: ['created_at:desc'],
  sortedComments: Ember.computed.sort('comments', 'sortProperties'),

  comments: function() {

    return this.get('model').get('comments');

  }.property('model.@each'),

  store: function() {
    return this.store;
  }.property(),

  user: function() {
    return this.get('membersArea_controller').get('model');
  }.property('membersArea_controller.model'),

  picture: function() {
    return this.get('membersArea_controller').get('model').get('picture');
  }.property('membersArea_controller.model.picture')
});
