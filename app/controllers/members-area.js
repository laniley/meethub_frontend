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
  }.property('model.messages.length'),

  actions: {
    toggleSidebar: function() {
      Ember.$('.side-nav-bar').toggleClass('closed');
      Ember.$('.side-nav-bar > .section-content').toggleClass('closed');
      Ember.$('.map-canvas').toggleClass('closed');
    }
  }
});
