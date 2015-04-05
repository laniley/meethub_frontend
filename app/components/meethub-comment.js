import Ember from 'ember';

export default Ember.Component.extend({

  inEditMode: false,

  actions: {
    editComment: function(comment) {
      this.set('inEditMode', true);
    },
    cancelEditing: function(comment) {
      comment.rollback();
      this.set('inEditMode', false);
    },
    deleteComment: function(comment) {
      console.log('delete');
    }
  }
});
