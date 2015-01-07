import Ember from 'ember';
import ResizeMixin from 'meethub-frontend/mixins/resize';

module('ResizeMixin');

// Replace this with your real tests.
test('it works', function() {
  var ResizeObject = Ember.Object.extend(ResizeMixin);
  var subject = ResizeObject.create();
  ok(subject);
});
