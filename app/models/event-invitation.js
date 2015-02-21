import DS from 'ember-data';

export default DS.Model.extend({
  event: DS.belongsTo('event', { async: true }),
  invited_user: DS.belongsTo('user', { async: true }),
  message: DS.belongsTo('message', { async: true }),
  status: DS.attr('string'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

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
