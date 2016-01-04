import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', { async: true }),
  fb_access_token: DS.attr('string'),
  isLoggedIn: DS.attr('boolean', { defaultValue: false }),
  isSyncingWithFB: DS.attr('boolean', { defaultValue: true })
});
