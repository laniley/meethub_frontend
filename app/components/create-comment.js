import Ember from 'ember';

export default Ember.Component.extend({
  comment: '',

  commentIsEmpty: function() {
    if(this.get('comment.length') > 0)
    {
      return false;
    }
    else
    {
      return true;
    }
  }.property('comment.length'),

  actions: {
    createComment: function() {

      if(!this.get('nameIsEmpty'))
      {
        var self = this;
        var user = this.get('membersArea_controller').get('model');

        var meethub = this.store.createRecord('meethub', {
          name: this.get('name'),
          short_description: this.get('short_description'),
          isOpen: true,

          founder: user
        });

        meethub.save().then(function() {
          var meethubInvitation = self.store.createRecord('meethubInvitation', {
            invited_user: user,
            meethub: meethub,
            role: 'admin',
            status: 'accepted'
          });

          meethubInvitation.save();

          meethub.set('showAddMembersForm', true);
        });

        this.set('name', '');
        this.set('short_description', '');
        this.set('createIsOpen', false);
      }
    },

    cancelCommentCreation: function() {
      this.set('comment', '');
    }
  }

});
