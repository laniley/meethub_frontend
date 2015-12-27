import Ember from 'ember';

export function initialize(instance) {

  var locale = Ember.$.cookie( 'user-lang' );

  if ( locale === undefined ) {
    if ( typeof window.clientInformation !== 'undefined' && typeof window.clientInformation.browserLanguage !== 'undefined' ) {
      locale = window.clientInformation.browserLanguage.substring(0,2);
    }
    else if ( typeof window.navigator !== 'undefined' && typeof window.navigator.language !== 'undefined' ) {
      locale = window.navigator.language.substring(0,2);
    }
    else {
      locale = 'en';
    }

    Ember.$.cookie( 'user-lang', locale, { expires: 365, path: '/' } );
  }

  instance.container.lookup('service:i18n').set('locale', locale);
}

export default {
  name: 'i18n',
  initialize: initialize
};
