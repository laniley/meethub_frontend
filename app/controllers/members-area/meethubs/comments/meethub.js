import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area', 'members-area/meethubs'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),
  meethubs_controller: Ember.computed.alias("controllers.members-area/meethubs"),

  sortProperties: ['created_at:desc'],
  sortedComments: Ember.computed.sort('comments', 'sortProperties'),

  disabled: true,
  selected: null,

  user: function() {
    return this.get('membersArea_controller').get('model');
  }.property('membersArea_controller.model'),

  comments: function() {
    return this.get('model').get('comments');
  }.property('model.@each'),

  store: function() {
    return this.store;
  }.property(),

  meethubs: function() {

    var meethubs = [];

    var meethub = this.get('model');
    this.set('selected', meethub);
    meethubs.push(meethub);

    return meethubs;

  }.property('model.@each')
});
