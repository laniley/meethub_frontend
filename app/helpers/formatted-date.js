import Ember from 'ember';

export function formattedDate(date, format) {
  var offset = new Date().getTimezoneOffset() * -1;
  return moment(date)
          .add(offset, 'm')
          .locale(Ember.I18n.locale)
          .format(format);
}

export default Ember.Handlebars.makeBoundHelper(formattedDate);
