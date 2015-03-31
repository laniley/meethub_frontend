import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  short_description: DS.attr('string'),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  founder: DS.belongsTo('user', { async: true }),
  invitations: DS.hasMany('meethub-invitation', { async: true }),
  comments: DS.hasMany('meethub-comment', { async: true }),

  isOpen: DS.attr('boolean', {defaultValue: false}),
  isInEditMode: DS.attr('boolean', {defaultValue: false}),
  selectNewAdmin: DS.attr('boolean', {defaultValue: false}),
  showAddMembersForm: DS.attr('boolean', {defaultValue: false}),

  invitedUser: function() {
    var invitations = this.get('invitations');
    var user = invitations.mapBy('invited_user');
    return user;
  }.property('invitations.@each'),

  acceptedInvitations: function() {
    var invitations = this.get('invitations');
    return invitations.filterBy('status', 'accepted');
  }.property('invitations.@each.status'),

  pendingInvitations: function() {
    var invitations = this.get('invitations');
    return invitations.filterBy('status', 'pending');
  }.property('invitations.@each.status'),

  hasShortDescription: function() {
    if(this.get('short_description.length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('short_description')
});
