/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

var app = new EmberApp({
  'ember-cli-bootstrap-sass': {
    'importBootstrapJS': true,
    'components': false
  }
});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

app.import( 'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.min.js' );

app.import( 'bower_components/ember-i18n/lib/i18n.js' );
app.import( 'bower_components/ember-i18n/lib/i18n-plurals.js' );

app.import( 'bower_components/momentjs/min/moment-with-locales.min.js' );

app.import( 'bower_components/jquery-cookie/jquery.cookie.js' );

module.exports = app.toTree();
