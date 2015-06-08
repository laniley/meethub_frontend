import DS from 'ember-data';

export default DS.Model.extend({
  event: DS.belongsTo('event', { async: true }),
  invited_user: DS.belongsTo('user', { async: true }),
  message: DS.belongsTo('message', { async: true }),
  status: DS.attr('string'),
  belongsToMe: DS.attr('boolean', { defaultValue: false}),

  created_at: DS.attr(),
  updated_at: DS.attr(),

  // newSinceLastLogin: function() {
  //   if(this.get('created_at') >= this.get('me').get('last_login'))
  //   {
  //     return true;
  //   }
  //   else
  //   {
  //     return false;
  //   }
  // }.property('created_at', 'me.last_login'),

  // updatedSinceLastLogin: function() {
  //   if(this.get('updated_at') >= this.get('me').get('last_login'))
  //   {
  //     return true;
  //   }
  //   else
  //   {
  //     return false;
  //   }
  // }.property('updated_at', 'me.last_login'),

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
  }.property('status')
});
