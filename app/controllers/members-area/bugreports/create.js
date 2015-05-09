import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  description: '',

  showThankYou: false,

  user: function() {
    return this.get('membersArea_controller').get('model');
  }.property(),

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
    sendMail: function() {

      if(this.get('description.length') > 0)
      {
        var newBug = this.store.createRecord('bug', {
          reported_by: this.get('user'),
          browserCodeName: navigator.appCodeName,
          browserOfficialName: navigator.appName,
          browserVersion: navigator.appVersion,
          platform: navigator.platform,
          text: escape(this.get('description')),
          status: 'open'
        });

        newBug.save();

        this.set('description', '');
        this.set('showThankYou', true);
      }
    }
  }
});
