import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  short_description: DS.attr('string'),

  created_at: DS.attr(),
  updated_at: DS.attr(),

  founder: DS.belongsTo('user', { async: true }),
  invitations: DS.hasMany('meethub-invitation', { async: true }),
  comments: DS.hasMany('meethub-comment', { async: true }),

  isOpen: DS.attr('boolean', {defaultValue: false}),
  isInEditMode: DS.attr('boolean', {defaultValue: false}),
  selectNewAdmin: DS.attr('boolean', {defaultValue: false}),
  showAddMembersForm: DS.attr('boolean', {defaultValue: false}),

  invitedUsers: function() {

    return DS.PromiseArray.create({

      promise: this.get('invitations').then(invitations => {

        return Ember.RSVP.all(invitations.map(invitation => {

          return invitation.get('invited_user').then(invitedUser => {

            return invitedUser;

          });

        }));

      })

    });

  }.property('invitations.@each'),

  acceptedInvitations: function() {

    return DS.PromiseArray.create({

      promise: this.get('invitations').then(invitations => {

        return invitations.filterBy('status', 'accepted');

      })

    });

  }.property('invitations.@each.status'),

  pendingInvitations: function() {

    return DS.PromiseArray.create({

      promise: this.get('invitations').then(invitations => {

        return invitations.filterBy('status', 'pending');

      })

    });

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
  }.property('short_description'),

  newComments: function() {
    var comments = this.get('comments');
    var new_comments = comments.filterBy('new_comment', true);

    var new_comments_not_from_me = new_comments.filter(function(comment) {
      return comment.get('author').get('isMe') === false;
    });

    return new_comments_not_from_me;
  }.property('comments.@each.new_comment'),

  hasNewComments: function() {
    if(this.get('newComments.length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('newComments.length')
});
