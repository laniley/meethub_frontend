import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  start_time: DS.attr('string'),
  start_date: DS.attr('string'),
  location: DS.belongsTo('location', { async: true }),
  eventInvitations: DS.hasMany('eventInvitation'),
  created_at: DS.attr('date'),
  updated_at: DS.attr('date'),
  new_event: DS.attr('boolean', { defaultValue: false }),

  friends_attending: DS.hasMany('user'),
  friends_attending_maybe: DS.hasMany('user'),
  friends_declined: DS.hasMany('user'),

  hasConnectedFriends: function() {
    if(this.get('connected_friends_length') > 0)
    {
      return true;
    }
    else
    {
      return false;
    }
  }.property('connected_friends_length'),

  connected_friends_length: function() {
    return this.get('friends_attending').get('length') + this.get('friends_attending_maybe').get('length') + this.get('friends_declined').get('length');
  }.property('friends_attending.length', 'friends_attending_maybe.length', 'friends_declined.length'),

  social_points: function() {
    return this.get('friends_attending').get('length') * 3 + this.get('friends_attending_maybe').get('length') * 2 + this.get('friends_declined').get('length');
  }.property('friends_attending.length', 'friends_attending_maybe.length', 'friends_declined.length'),

  start: function() {
    return moment(this.get('start_date'), "YYYY-MM-DDTHH:mm:ss.SSSSZ");
  }.property('start_time'),

  end: function() {
    return moment(this.get('start_date'), "YYYY-MM-DDTHH:mm:ss.SSSSZ").add(1, 'hours');
  }.property('start_time'),

  start_time_converted: function() {
    return this.get('start_time').substr(0,5);
  }.property('start_time'),

  start_date_converted_to_de: function() {
    var date_arr = this.get('start_date').split('-');
    return date_arr[2] + '.' + date_arr[1] + '.' + date_arr[0];
  }.property('start_date'),

  start_date_converted_to_us: function() {
    var date_arr = this.get('start_date').split('-');
    return date_arr[1] + '/' + date_arr[2] + '/' + date_arr[0];
  }.property('start_date')
});
