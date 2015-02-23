import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  // first_name: function() {
  //   return this.get('membersArea_controller').get('model').get('first_name');
  // }.property()
});
