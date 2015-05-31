import Ember from 'ember';
import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('user', 'User Model', {
  // Specify the other units that are required for this test.
  needs: [
    'model:meethub-invitation',
    'model:meethub-comment',
    'model:event-invitation',
    'model:message',
    'model:meethub',
    'model:event'
  ]
});

test('it exists', function(assert) {
  var model = this.subject();
  // var store = this.store();
  assert.ok(!!model);
});

test('name correctly concats first_name and last_name', function(assert) {
  var user = this.subject({
    first_name: 'Erika',
    last_name: 'Mustermann'
  });

  assert.equal(user.get('name'), 'Erika Mustermann', 'Concats full_name');

  Ember.run(function(assert) {
    user.set('first_name', 'Julia');
  });

  assert.equal(user.get('name'), 'Julia Mustermann', 'Updates full_name');
});
