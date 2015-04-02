import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('members-area.meethubs.comments.title', {
      into: 'members-area.meethubs.comments',
      outlet: 'title'
    });

    this.render('members-area.meethubs.comments.create-comment', {
      into: 'members-area.meethubs.comments',
      outlet: 'create_comment'
    });

    this.render('members-area.meethubs.comments.comment-list', {
      into: 'members-area.meethubs.comments',
      outlet: 'comment_list'
    });
  }
});
