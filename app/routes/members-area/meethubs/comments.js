import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.all('meethubComment');
  },
  beforeModel: function() {
    this.controllerFor('members-area').set('currentSection', 'comments');
  },
  renderTemplate: function() {
    this.render('members-area.meethubs.comments', {
      into: 'members-area'
    });

    this.render('members-area.meethubs.comments.comment-list', {
      into: 'members-area.meethubs.comments',
      outlet: 'comment_list'
    });
  }
});
