import Ember from 'ember';

export default Ember.Route.extend({
  // model: function(params) {
  //   var meethub = this.store.all('meethub', params.meethub_id);
  //   return meethub.comments;
  //   // return this.store.all('meethubComment', { meethub_id: params.meethub_id });
  // },
  renderTemplate: function() {
    this.render('members-area.meethubs.news.title', {
      into: 'members-area.meethubs.news',
      outlet: 'title'
    });

    this.render('members-area.meethubs.news.create-comment', {
      into: 'members-area.meethubs.news',
      outlet: 'create_comment'
    });

    this.render('members-area.meethubs.news.comment-list', {
      into: 'members-area.meethubs.news',
      outlet: 'comment_list'
    });
  }
});
