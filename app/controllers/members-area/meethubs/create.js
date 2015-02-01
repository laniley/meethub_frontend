import Ember from 'ember';

export default Ember.Controller.extend({
  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  name: '',
  short_description: '',

  nameIsEmpty: function() {
    if(this.get('name.length') > 0)
    {
      return false;
    }
    else
    {
      return true;
    }
  }.property('name.length'),

  isGerman: function() {
    if(Ember.I18n.locale === 'de')
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('Ember.I18n.locale'),

  actions: {
    cancelActivity: function() {
      this.controllerFor('members-area/meethubs').set('currentSection', null);
      this.transitionTo('members-area.meethubs');
    },

    createMeethub: function() {

      if(!this.get('nameIsEmpty'))
      {
        var user = this.get('membersArea_controller').get('model');

        var meethub = this.store.createRecord('meethub', {
          name: this.get('name'),
          short_description: this.get('short_description'),
          isOpen: true,

          founder: user
        });

        meethub.save().then(function() {
          meethub.get('members').then(function(members) {
            members.pushObject(user);
            meethub.save();
          });
        });

        this.set('name', '');
        this.set('short_description', '');

        this.controllerFor('members-area/meethubs').set('currentSection', null);
        this.transitionTo('members-area.meethubs');
      }
    }
  }
});
