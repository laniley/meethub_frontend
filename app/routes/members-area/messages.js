import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function(transition)
  {
    if(transition.queryParams["event_inv"] !== undefined) {
      this.controllerFor('members-area/messages').set('event_inv', transition.queryParams["event_inv"]);
    }
    else {
      this.controllerFor('members-area/messages').set('event_inv', true);
    }

    if(transition.queryParams["meethub_inv"] !== undefined) {
      this.controllerFor('members-area/messages').set('meethub_inv', transition.queryParams["meethub_inv"]);
    }
    else {
      this.controllerFor('members-area/messages').set('meethub_inv', true);
    }

    this.controllerFor('members-area').set('showSidebar', true);
  },
  setupController: function(controller) {
    controller.set('model', this.store.all('message'));
  },
  renderTemplate: function() {
    this.render('members-area.messages.side-nav-buttons', {
      into: 'members-area',
      outlet: 'side-nav-buttons'
    });
    this.render('members-area.messages', {
      into: 'members-area',
      outlet: 'side-nav-bar'
    });
  }
});
