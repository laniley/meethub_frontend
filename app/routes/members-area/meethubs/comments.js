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
  },
  actions: {
    willTransition: function(transition) {
      if(transition.targetName.indexOf('members-area.meethubs.comments') === -1)
      {
        var comments = this.controllerFor('members-area.meethubs.comments').get('model');

        comments.forEach(function(comment) {
          comment.set('new_comment', false);
        });
      }
    }
  }
});
