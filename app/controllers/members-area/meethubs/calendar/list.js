import Ember from 'ember';

export default Ember.Controller.extend({
  // needs: ['members-area/index'],
  // membersArea_index_controller: Ember.computed.alias("controllers.members-area/index"),

  sortProperties: ['start_date:asc', 'social_points:desc'],
  sortedEvents: Ember.computed.sort('upcomingEventsOfMeethubs', 'sortProperties'),

  upcomingEventsOfMeethubs: function() {
    return this.get('model').filterBy('is_upcoming', true);
  }.property('model.@each.is_upcoming')

});
