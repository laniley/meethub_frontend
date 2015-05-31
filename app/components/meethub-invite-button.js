import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['friend_search_button'],
  meethub: null,
  friend_id: null,
  user: null,
  status: '',
  cssClass: '',

  isMember: function() {

    var friend_id = this.get('friend_id');
    var accepted_invitations = this.get('meethub').get('acceptedInvitations');

    var isInMeethub = accepted_invitations.some(function(invitation) {

      if(invitation.get('invited_user').get('id') === friend_id)
      {
        return true;
      }
      else
      {
        return false;
      }
    });

    if(isInMeethub === true)
    {
      this.set('status', 'isMember');
      this.set('cssClass', 'isMember');
    }

    return isInMeethub;

  }.property('meethub.acceptedInvitations.@each'),

  isPending: function() {

    var friend_id = this.get('friend_id');
    var pending_invitations = this.get('meethub').get('pendingInvitations');

    var isPending = pending_invitations.some(function(invitation) {

      if(invitation.get('invited_user').get('id') === friend_id)
      {
        return true;
      }
      else
      {
        return false;
      }

    });

    if(isPending === true)
    {
      this.set('status', 'isPending');
      this.set('cssClass', 'pending');
    }
    else
    {
      this.set('cssClass', 'invite');
    }

    return isPending;

  }.property('meethub.pendingInvitations.@each'),

  actions: {
    handleButtonClick: function() {
      if(this.get('status') !== 'isMember' && this.get('status') !== 'isPending')
      {
        var self = this;

        var friends = self.get('parentView.targetObject.store').all('user');
        var filtered_friends = friends.filterBy('id', this.get('friend_id'));
        var friend = filtered_friends.get('firstObject');

        var message = self.get('parentView.targetObject.store').createRecord('message', {
          from_user: self.get('user'),
          to_user: friend,
          subject: 'Meethub Invitation',
          text: 'Du wurdest von ' + self.get('user').get('name') + ' in den Meethub ' + self.get('meethub').get('name') + ' eingeladen.'
        });

        message.save().then(function(message) {

          var meethubInvitation = self.get('parentView.targetObject.store').createRecord('meethubInvitation', {
            invited_user: friend,
            meethub: self.get('meethub'),
            message: message,
            role: 'standard',
            status: 'pending'
          });

          meethubInvitation.save();

          message.set('meethubInvitation', meethubInvitation);
        });

        this.set('status', 'pending');

        var messageText = '';

        if(Ember.I18n.locale === 'de')
        {
          messageText = self.get('user').get('name') + ' hat dich in den Meethub ' + self.get('meethub').get('name') + ' eingeladen';
        }
        else
        {
          messageText = self.get('user').get('name') + ' invited you to the Meethub ' + self.get('meethub').get('name');
        }

        this.controllerFor('members-area').get('FB').ui ({
         method: 'apprequests',
         message: messageText,
         to:[friend.get('fb_id')]
        });

        console.log('invited');
      }
    }
  }
});
