import Ember from 'ember';

export default Ember.Controller.extend({

  sortProperties: ['start_date:asc', 'social_points:desc'],
  sortedEvents: Ember.computed.sort('upcomingEventsOfMeethubs', 'sortProperties'),

  upcomingEventsOfMeethubs: function() {

    return this.get('model').get('upcomingEventsOfMeethubs');

  }.property('model.upcomingEventsOfMeethubs.@each')

});
