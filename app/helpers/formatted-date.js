import Ember from 'ember';

export function formattedDate(date, format) {
  return moment(date).locale(Ember.I18n.locale).format(format);
}

export default Ember.Handlebars.makeBoundHelper(formattedDate);
