import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', { async: true }),
  author: DS.belongsTo('user', { async: true }),
  text: DS.attr('string'),
  meethub: DS.belongsTo('meethub', { async: true }),
  created_at: DS.attr(),

  new_comment: function() {
    if(this.get('created_at') > this.get('user.last_login'))
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('created_at', 'user.last_login')
});
