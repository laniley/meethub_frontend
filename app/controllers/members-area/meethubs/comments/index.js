import Ember from 'ember';

export default Ember.Controller.extend({
  sortProperties: ['created_at:desc'],
  sortedComments: Ember.computed.sort('comments', 'sortProperties'),

  comments: function() {

    return this.get('model');

  }.property('model.@each')
});
