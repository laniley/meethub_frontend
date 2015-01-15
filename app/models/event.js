import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  name: DS.attr('string'),
  description: DS.attr('string'),
  start: DS.attr('string'),
  start_time: DS.attr('string'),
  start_date: DS.attr('string'),
  end: DS.attr('string'),
  location: DS.belongsTo('location'),

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
