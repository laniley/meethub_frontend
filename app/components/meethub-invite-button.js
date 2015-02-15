import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['invite-button'],
  meethub: null,
  friend: null,
  user: null,
  status: '',
  cssClass: '',

  isMember: function() {

    var members = this.get('meethub').get('members');

    var isInMeethub = members.every(function(member, index, self) {
      if(member === self.get('friend'))
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
    }
    else
    {
      this.set('cssClass', 'accept');
    }

    return isInMeethub;

  }.property('meethub.members.@each'),

  // notInMeethub: function() {
  //   var members = this.get('meethub').get('members');

  //   var isNotInMeethub = members.every(function(member, index, self) {
  //     if(member === self.get('friend'))
  //     {
  //       return false;
  //     }
  //     else
  //     {
  //       return true;
  //     }
  //   });

  //   if(isNotInMeethub === true && this.get('status') === '')
  //   {
  //     this.set('status', 'notInMeethub');
  //   }

  //   return isNotInMeethub;

  // }.property('meethub.members.@each'),

  // isPending: function() {

  // },

  actions: {
    handleButtonClick: function() {
      if(this.get('status') !== 'isMember')
      {
        var self = this;

        var message = self.get('parentView.targetObject.store').createRecord('message', {
          from_user: self.get('user'),
          to_user: self.get('friend'),
          subject: 'Meethub Invitation',
          text: 'Du wurdest von ' + self.get('user').get('name') + ' zu einem Meethub eingeladen.'
        });

        message.save().then(function() {

          var meethubInvitation = self.get('parentView.targetObject.store').createRecord('meethubInvitation', {
            invited_user: self.get('friend'),
            meethub: self.get('meethub'),
            message: message
          });

          meethubInvitation.save();

          message.set('meethubInvitation', meethubInvitation);
        });

        this.set('status', 'pending');
        console.log('invited');
      }
    }
  }
});
