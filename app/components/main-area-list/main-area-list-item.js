import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['item'],
  classNameBindings: ['message.is_open:open'],
  message: null,
  social_points_threshold: 0,

  actions: {
    toggleMessage: function() {
      if(this.get('message').get('is_open')) {
        this.get('message').set('is_open', false);
      }
      else {
        this.get('message').set('is_open', true);
      }
    }
  }
});
