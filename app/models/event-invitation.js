import DS from 'ember-data';

export default DS.Model.extend({
  event: DS.belongsTo('event'),
  invited_user: DS.belongsTo('user'),
  message: DS.belongsTo('message'),
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

  hasBeenAcceptedMaybe: function() {
    if(this.get('status') === 'maybe')
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
