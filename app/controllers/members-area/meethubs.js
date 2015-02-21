import Ember from 'ember';

export default Ember.Controller.extend({

  needs: ['members-area'],
  membersArea_controller: Ember.computed.alias("controllers.members-area"),

  sortProperties: ['created_at:desc'],
  sortedMeethubInvitations: Ember.computed.sort('search_results', 'sortProperties'),

  searchIsOpen: false,
  createIsOpen: false,
  status: 'accepted',

  myMeethubInvitations: function() {
    var self = this;

    var filteredMeethubInvitations = self.get('model').filter(function(meethubInvitation) {
      return meethubInvitation.get('invited_user') !== null && meethubInvitation.get('invited_user').get('id') === self.get('user').get('id') && meethubInvitation.get('status') === self.get('status');
    });

    return filteredMeethubInvitations;
  }.property('model.@each', 'model.@each.status'),

  setAutofocus: function() {
    if(this.get('searchIsOpen') === true)
    {
      return false;
    }
    else
    {
      return true;
    }
  }.property('searchIsOpen'),

  user: function() {
    return this.get('membersArea_controller').get('model');
  }.property(),

  // CREATE
  name: '',
  short_description: '',
  // SEARCH
  search_term: '',

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

  friends: function() {
    return this.get('membersArea_controller').get('model').get('friends');
  }.property('membersArea_controller.model.friends.@each'),

  // SEARCH
  search_results: function() {
    var self = this;

    var filteredMeethubInvitations = self.get('myMeethubInvitations').filter(function(meethubInvitation) {
      return meethubInvitation.get('meethub').get('name').toLowerCase().indexOf(self.get('search_term').toLowerCase()) !== -1;
    });

    return filteredMeethubInvitations;
  }.property('search_term','myMeethubInvitations.@each'),

  searchIsEmpty: function() {
    if(this.get('search_term') !== '')
    {
      return false;
    }
    else
    {
      return true;
    }
  }.property('search_term'),

  // CREATE
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

  actions: {
    save: function(meethub) {
      meethub.save();
      meethub.set('isInEditMode', false);
    },

    createMeethub: function() {

      if(!this.get('nameIsEmpty'))
      {
        var self = this;
        var user = this.get('membersArea_controller').get('model');

        var meethub = this.store.createRecord('meethub', {
          name: this.get('name'),
          short_description: this.get('short_description'),
          isOpen: true,

          founder: user
        });

        meethub.save().then(function() {
          var meethubInvitation = self.store.createRecord('meethubInvitation', {
            invited_user: user,
            meethub: meethub,
            status: 'accepted'
          });

          meethubInvitation.save();

          meethub.set('showAddMembersForm', true);
        });

        this.set('name', '');
        this.set('short_description', '');
        this.set('createIsOpen', false);
      }
    },

    cancelMeethubCreation: function() {
      this.set('name', '');
      this.set('short_description', '');
    },

    cancelEditing: function(meethub) {
      meethub.rollback();
      meethub.set('isOpen', true);
    },

    toggleMeethub: function(meethub) {
      if(!meethub.get('isInEditMode'))
      {
        meethub.toggleProperty('isOpen');
      }
    },

    toggle_add_members_form: function(meethub) {

      if(meethub.get('showAddMembersForm') === false)
      {
        meethub.set('showAddMembersForm', true);
      }
      else
      {
        meethub.set('showAddMembersForm', false);
      }
    },

    resetSearch: function() {
      this.set('search_term', '');
    },

    toggleSearch: function() {
      if(this.get('searchIsOpen') === true)
      {
        this.set('searchIsOpen', false);
      }
      else
      {
        this.set('createIsOpen', false);
        this.set('searchIsOpen', true);
      }
    },

    toggleCreate: function() {
      if(this.get('createIsOpen') === true)
      {
        this.set('createIsOpen', false);
      }
      else
      {
        this.set('searchIsOpen', false);
        this.set('createIsOpen', true);
      }
    }
 }
});
