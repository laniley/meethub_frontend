import DS from 'ember-data';
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
  assert.ok(!!model);
});

// Relationships
test('friends relationship', function(assert) {
  var User = this.store().modelFor('user');
  var relationship = Ember.get(User, 'relationshipsByName').get('friends');

  assert.equal(relationship.key, 'friends');
  assert.equal(relationship.kind, 'hasMany');
});

test('meethubInvitations relationship', function(assert) {
  var User = this.store().modelFor('user');
  var relationship = Ember.get(User, 'relationshipsByName').get('meethubInvitations');

  assert.equal(relationship.key, 'meethubInvitations');
  assert.equal(relationship.kind, 'hasMany');
});

test('meethubComments relationship', function(assert) {
  var User = this.store().modelFor('user');
  var relationship = Ember.get(User, 'relationshipsByName').get('meethubComments');

  assert.equal(relationship.key, 'meethubComments');
  assert.equal(relationship.kind, 'hasMany');
});

test('eventInvitations relationship', function(assert) {
  var User = this.store().modelFor('user');
  var relationship = Ember.get(User, 'relationshipsByName').get('eventInvitations');

  assert.equal(relationship.key, 'eventInvitations');
  assert.equal(relationship.kind, 'hasMany');
});

test('messages relationship', function(assert) {
  var User = this.store().modelFor('user');
  var relationship = Ember.get(User, 'relationshipsByName').get('messages');

  assert.equal(relationship.key, 'messages');
  assert.equal(relationship.kind, 'hasMany');
});

// Computed Properties
test('name correctly concats first_name and last_name', function(assert) {
  var user = this.subject({
    first_name: 'Erika',
    last_name: 'Mustermann'
  });

  assert.equal(user.get('name'), 'Erika Mustermann', 'Concats full_name');

  Ember.run(function(assert) {
    user.set('first_name', 'Julia');
    user.set('last_name', 'September');
  });

  assert.equal(user.get('name'), 'Julia September', 'Updates full_name');
});

test('acceptedMeethubInvitations correctly returns all accepted meethub-invitations of the current user', function(assert) {

  var store = this.store();

  Ember.run(function(){

    var currentUser = store.createRecord('user', {
      id: 1,
      first_name: 'Melanie',
      last_name: 'Mende'
    });

    assert.ok(currentUser, "currentUser is ok");
    assert.ok(currentUser instanceof DS.Model, "currentUser is an instance of DS.Model");

    var notCurrentUser = store.createRecord('user', {
      id: 2,
      first_name: 'Dennis',
      last_name: 'Mende'
    });

    assert.ok(notCurrentUser, "notCurrentUser is ok");
    assert.ok(notCurrentUser instanceof DS.Model, "notCurrentUser is an instance of DS.Model");

    var meethub_inv_1 = store.createRecord('meethub-invitation', {
      id: 1,
      invited_user: currentUser,
      status: 'accepted'
    });

    assert.ok(meethub_inv_1, "meethub_inv_1 is ok");
    assert.ok(meethub_inv_1 instanceof DS.Model, "meethub_inv_1 is an instance of DS.Model");

    var meethub_inv_2 = store.createRecord('meethub-invitation', {
      id: 2,
      invited_user: currentUser,
      status: 'pending'
    });

    assert.ok(meethub_inv_2, "meethub_inv_2 is ok");
    assert.ok(meethub_inv_2 instanceof DS.Model, "meethub_inv_2 is an instance of DS.Model");

    var meethub_inv_3 = store.createRecord('meethub-invitation', {
      id: 3,
      invited_user: notCurrentUser,
      status: 'accepted'
    });

    assert.ok(meethub_inv_3, "meethub_inv_3 is ok");
    assert.ok(meethub_inv_3 instanceof DS.Model, "meethub_inv_3 is an instance of DS.Model");

    currentUser.get('meethubInvitations')
      .pushObject(meethub_inv_1);

    currentUser.get('meethubInvitations')
      .pushObject(meethub_inv_2);

    notCurrentUser.get('meethubInvitations')
      .pushObject(meethub_inv_3);

    assert.ok(currentUser.get('meethubInvitations'), "currentUser.meethubInvitations is ok");
    assert.ok(notCurrentUser.get('meethubInvitations'), "notCurrentUser.meethubInvitations is ok");

    assert.equal(currentUser.get('meethubInvitations').get('length'), 2, 'Returns all meethub invitations of current user');

    currentUser.get('acceptedMeethubInvitations').then(function() {
      assert.equal(currentUser.get('acceptedMeethubInvitations').get('length'), 1, 'Returns accepted meethub invitations of current user before status update');

      meethub_inv_2.set('status', 'accepted');

      currentUser.get('acceptedMeethubInvitations').then(function() {
        assert.equal(currentUser.get('acceptedMeethubInvitations').get('length'), 2, 'Returns accepted meethub invitations of current user after status update');
      });
    });

  });

});
