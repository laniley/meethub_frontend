import DS from 'ember-data';

export default DS.Model.extend({
  event: DS.belongsTo('event', { async: true }),
  user: DS.belongsTo('user', { async: true }),
  status: DS.attr('string'),
  has_been_seen: DS.attr('boolean', { defaultValue: false }),

  created_at: DS.attr(),
  updated_at: DS.attr(),

  // hasBeenAccepted: function() {
  //   if(this.get('status') === 'attending')
  //   {
  //     return true;
  //   }
  //   else
  //   {
  //     return false;
  //   }
  // }.property('status'),
  //
  // hasBeenAcceptedMaybe: function() {
  //   if(this.get('status') === 'maybe')
  //   {
  //     return true;
  //   }
  //   else
  //   {
  //     return false;
  //   }
  // }.property('status'),
  //
  // hasBeenDeclined: function() {
  //   if(this.get('status') === 'declined')
  //   {
  //     return true;
  //   }
  //   else
  //   {
  //     return false;
  //   }
  // }.property('status')
});
