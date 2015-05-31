import {
  moduleForModel,
  test
} from 'ember-qunit';

moduleForModel('friend', {
  // Specify the other units that are required for this test.
  needs: [
    'model:user',
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
