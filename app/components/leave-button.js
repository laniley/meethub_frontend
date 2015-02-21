import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['item-option','leave-button'],

  user: null,
  parent: null,

  actions: {
    leave: function() {
      var parent = this.get('parent');
      var user = this.get('user');
      var founder = parent.get('founder');

      if(founder.get('id') === user.get('id'))
      {
        alert('yes');
      }
      else
      {
        alert('no');
      }
    }
  }
});
