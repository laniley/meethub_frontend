import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

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
