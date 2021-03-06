import DS from 'ember-data';

export default DS.Model.extend({
  invited_user: DS.belongsTo('user', {async: true}),
  message: DS.belongsTo('message', {async: true}),
  meethub: DS.belongsTo('meethub', {async: true}),
  role: DS.attr('string'),
  status: DS.attr('string'),

  hasBeenAccepted: function() {
    if(this.get('status') === 'accepted')
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
