import Ember from "ember";
import { module, test } from 'qunit';
import startApp from '../../helpers/start-app';
var App;

module('route:login', {
  beforeEach: function() {
    App = startApp();
  },
  afterEach: function() {
    Ember.run(App, App.destroy);
  }
});

// test('it exists', function(assert) {
//   var route = this.subject();
//   assert.ok(route);
// });

test("login route", function(assert) {
  visit('/login').then(function() {
    assert.equal(find('.fb-login-button').length, 1, "Page contains fb login button");
  });
});
