/* jshint node: true */

module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'meethub-frontend',
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      }
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    ENV.APP.LOG_VIEW_LOOKUPS = true;

    ENV['torii'] = {
      providers: {
        'facebook-oauth2': {
          apiKey: '560143030797393',
          redirectUri: 'http://localhost:4200/'
        },
        'facebook-connect': {
          appId: '560143030797393',
          scope: 'public_profile, user_friends'
          //redirectUri: 'http://localhost:4200/members-area'
        }
      }
    };

    ENV['simple-auth'] = {
      routeAfterAuthentication: 'members-area',
      routeIfAlreadyAuthenticated: 'members-area'
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/';
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
  }

  if (environment === 'production') {

  }

  return ENV;
};
