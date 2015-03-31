import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render('members-area.meethubs.news.comment-list', {
      into: 'members-area.meethubs.news',
      outlet: 'comment_list'
    });
  }
});
