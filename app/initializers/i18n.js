import Ember from 'ember';

export function initialize(/* container, application */) {

  Ember.TextField.reopen( Ember.I18n.TranslateableAttributes );
  Ember.Select.reopen( Ember.I18n.TranslateableProperties );

  var lang = Ember.$.cookie( 'user-lang' );

  if ( lang === undefined ) {
    if ( typeof window.clientInformation !== 'undefined' && typeof window.clientInformation.browserLanguage !== 'undefined' ) {
      lang = window.clientInformation.browserLanguage.substring(0,2);
    } else if ( typeof window.navigator !== 'undefined' && typeof window.navigator.language !== 'undefined' ) {
      lang = window.navigator.language.substring(0,2);
    } else {
      lang = 'en';
    }
    Ember.$.cookie( 'user-lang', lang, { expires: 365, path: '/' } );
  }

  Ember.I18n.locale = lang;

  Ember.$.ajax
  ( {
    url: './locales/' + Ember.I18n.locale + '.js',
    async: false,
    dataType: 'script',
    error: function () {
      Ember.Logger.warn( 'Default language loaded' );
      Ember.$.ajax
      ( {
        url: './javascript/translations/en.js',
        async: false,
        dataType: 'script',
        error: function () {
          Ember.Logger.warn( 'Language file could not be loaded' );
        }
      } );
    }
  } );

}

export default {
  name: 'i18n',
  initialize: initialize
};
