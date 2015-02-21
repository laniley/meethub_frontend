import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['item-option','edit-button'],
  classNameBindings: ['isAdmin:visible:do-not-display'],

  user: null,
  parent: null,

  isAdmin: function() {
    if(this.get('parent').get('role') === 'admin')
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('parent.role'),

  actions: {
    toggleEditView: function() {
      this.get('parent').get('meethub').toggleProperty('isInEditMode');
    }
  }
});
