import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  short_description: DS.attr('string'),

  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),

  founder: DS.belongsTo('user', { async: true }),
  members: DS.hasMany('user', { async: true }),
  invitations: DS.hasMany('meethub-invitation', { async: true }),

  isOpen: DS.attr('boolean', {defaultValue: false}),
  showAddMembersForm: DS.attr('boolean', {defaultValue: false}),

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
