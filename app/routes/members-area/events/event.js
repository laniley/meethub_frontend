import Ember from 'ember';
import AuthenticateRoute from './../../authenticate';

export default AuthenticateRoute.extend({
  model: function(params) {
    return this.store.find('event', params.event_id);
  },
  setupController: function(controller, model) {

    controller.set('model', model);

    model.get('my_event_invitation').then(myEventInvitation => {
      if(myEventInvitation)
      {
        myEventInvitation.get('message').then(message => {
          if(message)
          {
            message.set('hasBeenRead', true);
            message.save();
          }
        });
      }
    });

    this.controllerFor('members-area.events').set('isSidebarOpen', true);
  }
});
