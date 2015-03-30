import Ember from 'ember';

export default Ember.Component.extend({

  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  user: null,
  store: null,
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

      if(!this.get('commentIsEmpty'))
      {
        var meethubComment = this.get('store').createRecord('meethubComment', {
          author: this.get('user'),
          text: this.get('comment'),
          meethub: this.get('origContext').get('model')
        });

        meethubComment.save();

        this.set('comment', '');
      }
    },

    cancelCommentCreation: function() {
      this.set('comment', '');
    }
  }

});
