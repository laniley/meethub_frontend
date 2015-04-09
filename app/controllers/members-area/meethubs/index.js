import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  isSidebarOpen: function() {
    return this.get('membersArea_controller').get('isSidebarOpen');
  }.property('membersArea_controller.isSidebarOpen'),

  newMeethubComments: function() {

    var newMeethubComments = [];

    if(this.get('model.meethubComments.length') > 0)
    {
      var self = this;

      newMeethubComments = this.get('model.meethubComments').filter(function(comment) {
        return comment.get('new_comment') === true && comment.get('author').get('id') !== self.get('model').get('id');
      });
    }

    return newMeethubComments;

  }.property('model.meethubComments.@each.new_comment'),

  hasNewMeethubComments: function() {

    if(this.get('newMeethubComments').get('length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }

  }.property('newMeethubComments.@each')

});
