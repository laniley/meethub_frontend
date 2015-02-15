import DS from 'ember-data';

export default DS.Model.extend({
  invited_user: DS.belongsTo('user'),
  message: DS.belongsTo('message'),
  meethub: DS.belongsTo('meethub'),
  status: DS.attr('string'),

  hasBeenAccepted: function() {
    if(this.get('status') === 'attending')
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('status'),

  hasBeenDeclined: function() {
    if(this.get('status') === 'declined')
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('status'),
});
