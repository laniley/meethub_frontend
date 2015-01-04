import Ember from 'ember';

export default Ember.Controller.extend({

  hasMessages: function() {
    if(this.get('model.messages.length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('model.messages.length')
});
