import Ember from 'ember';

export default Ember.Component.extend({

  store: null,
  inEditMode: false,

  commentIsEmpty: function() {
    if(this.get('comment.text.length') > 0)
    {
      return false;
    }
    else
    {
      return true;
    }
  }.property('comment.text.length'),

  actions: {
    editComment: function(comment) {
      this.set('inEditMode', true);
    },
    cancelEditing: function(comment) {
      comment.rollback();
      this.set('inEditMode', false);
    },
    updateComment: function(comment) {

      if(!this.get('commentIsEmpty'))
      {
        comment.save();

        this.set('comment', '');
      }
    },
    deleteComment: function(comment) {
      console.log('delete');
    }
  }
});
