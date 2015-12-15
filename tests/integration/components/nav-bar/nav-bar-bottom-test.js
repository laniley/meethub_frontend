import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('nav-bar/nav-bar-bottom', 'Integration | Component | nav bar/nav bar bottom', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{nav-bar/nav-bar-bottom}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#nav-bar/nav-bar-bottom}}
      template block text
    {{/nav-bar/nav-bar-bottom}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
