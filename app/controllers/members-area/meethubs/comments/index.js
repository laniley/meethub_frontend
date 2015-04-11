import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area', 'members-area/meethubs'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),
  meethubs_controller: Ember.computed.alias("controllers.members-area/meethubs"),

  sortProperties: ['created_at:desc'],
  sortedComments: Ember.computed.sort('comments', 'sortProperties'),

  disabled: false,
  selected: null,

  user: function() {
    return this.get('membersArea_controller').get('model');
  }.property('membersArea_controller.model'),

  comments: function() {
    return this.get('model');
  }.property('model.@each'),

  store: function() {
    return this.store;
  }.property(),

  meethubs: function() {

    var meethubInvitations = this.get('meethubs_controller').get('model');

    var acceptedMeethubInvitations = meethubInvitations.filterBy('hasBeenAccepted', true);

    var meethubs = [];
    var self = this;

    acceptedMeethubInvitations.forEach(function(invite, index) {

      if(index === 0)
      {
        self.set('selected', invite.get('meethub'));
      }

      meethubs.push(invite.get('meethub'));

    });

    return meethubs;

  }.property('controllers.members-area/meethubs.model.@each')
});
