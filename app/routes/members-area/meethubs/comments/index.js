import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('members-area.meethubs.comments.comment-list', {
      into: 'members-area.meethubs.comments',
      outlet: 'comment_list'
    });
  }
});
