import Ember from 'ember';

export default Ember.Controller.extend({

  sortProperties: ['created_at:desc'],
  sortedMeethubs: Ember.computed.sort('search_results', 'sortProperties'),

  currentSection: null,

  searchIsOpen: false,

  search_term: '',

  search_results: function() {
    var self = this;

    var filteredMeethubs = self.get('model').filter(function(meethub) {
      return meethub.get('name').indexOf(self.get('search_term')) !== -1;
    });

    return filteredMeethubs;

  }.property('search_term','model.@each'),

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

  actions: {
    toggleMeethub: function(meethub) {
      if(meethub.get('isOpen') === false)
      {
        meethub.set('isOpen', true);

        if(meethub.get('hasBeenRead') === false)
        {
          meethub.set('hasBeenRead', true);
          meethub.save();
        }
      }
      else
      {
        meethub.set('isOpen', false);
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
        this.set('searchIsOpen', true);
      }
    }
 }
});
