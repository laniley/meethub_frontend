import DS from 'ember-data';
import User from './user';

export default User.extend({
  me: DS.belongsTo('user'),
  has_been_seen: DS.attr('boolean', { defaultValue: false }),

  is_a_new_friend: function() {
    if(this.get('created_at') > this.get('logged_in_user.last_login'))
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('created_at', 'logged_in_user.last_login')
});
