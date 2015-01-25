import Ember from 'ember';

export default Ember.Controller.extend({

  name: '',
  short_description: '',

  nameIsNotEmpty: function() {
    if(this.get('name.length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('name.length'),

  actions: {
    cancelActivity: function() {
      this.controllerFor('members-area/meethubs').set('currentSection', null);
      this.transitionTo('members-area.meethubs');
    }
  }
});
