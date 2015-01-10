import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    toggleMessage: function(message) {
      if(message.get('isOpen') === false)
      {
        message.set('isOpen', true);
      }
      else
      {
        message.set('isOpen', false);
      }
    }
  }
});
