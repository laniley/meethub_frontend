import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['item-option','edit-button'],
  classNameBindings: ['isAdmin:visible:do-not-display'],

  user: null,
  parent: null,

  isAdmin: function() {
    if(this.get('user').get('id') === this.get('parent').get('founder').get('id'))
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('parent.founder'),

  actions: {
    toggleEditView: function() {
      this.get('parent').toggleProperty('isInEditMode');
    }
  }
});
