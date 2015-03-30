import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.get('store').find('meethub', params.meethub_id);
  },
  renderTemplate: function() {
    this.render('members-area.meethubs.news.title', {
      into: 'members-area.meethubs.news',
      outlet: 'title'
    });

    this.render('members-area.meethubs.news.meethub', {
      into: 'members-area.meethubs.news',
      outlet: 'create-comment'
    });
  }
});
