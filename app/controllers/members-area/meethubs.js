import Ember from 'ember';

export default Ember.Controller.extend({

  sortProperties: ['created_at:desc'],
  sortedMeethubs: Ember.computed.sort('model', 'sortProperties'),

  currentSection: null,

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
    }
 }
});
