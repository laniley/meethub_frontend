import Ember from 'ember';

export default Ember.Controller.extend({
  needs: [
    'members-area',
    'members-area/friendships',
    'members-area/friendships/calendar',
    'members-area/friendships/calendar/list',
    'members-area/friendships/calendar/list/friendship'
  ],
  friendship_controller: Ember.computed.alias("controllers.members-area/friendships/calendar/list/friendship"),

  friendship: function() {
    return this.get('friendship_controller').get('model');
  }.property('friendship_controller.model')

});
