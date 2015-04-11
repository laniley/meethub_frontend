import Ember from 'ember';

export default Ember.Component.extend({

  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  user: null,
  store: null,
  meethubs: null,
  comment: '',

  selected: null,
  disabled: false,

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

  placeholder: function() {
    if(Ember.I18n.locale === 'de')
    {
      return "Schreib einen neuen Kommentar...";
    }
    else
    {
      return "Write a new comment...";
    }
  }.property('Ember.I18n.locale'),

  actions: {
    createComment: function() {

      if(!this.get('commentIsEmpty'))
      {
        var meethubComment = this.get('store').createRecord('meethubComment', {
          author: this.get('user'),
          text: this.get('comment'),
          meethub: this.get('selected')
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
