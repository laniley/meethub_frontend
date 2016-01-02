import Ember from 'ember';
// import ENV from '../config/environment';

export function formattedDate(date, format) {
  var offset = new Date().getTimezoneOffset() * -1;
  return moment(date)
          .add(offset, 'm')
          .locale(Ember.$.cookie( 'user-lang' ))
          .format(format);
}

export default Ember.Handlebars.makeBoundHelper(formattedDate);
