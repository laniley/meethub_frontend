import Ember from 'ember';

export default Ember.Route.extend({

  renderTemplate: function() {
    this.render('members-area.welcome', {
      into: 'members-area',
      outlet: 'main-area'
    });
  }

});
