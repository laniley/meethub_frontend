import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

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
    },

    createMeethub: function() {

      var user = this.get('membersArea_controller').get('model');

      var meethub = this.store.createRecord('meethub', {
        name: this.get('name'),
        short_description: this.get('short_description'),

        founder: user
      });

      meethub.get('members').pushObject(user);

      meethub.save();

      this.set('name', '');
      this.set('short_description', '');

      this.controllerFor('members-area/meethubs').set('currentSection', null);
      this.transitionTo('members-area.meethubs');
    }
  }
});
