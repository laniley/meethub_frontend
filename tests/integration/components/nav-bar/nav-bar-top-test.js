import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('nav-bar/nav-bar-top', 'Integration | Component | nav bar/nav bar top', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{nav-bar/nav-bar-top}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#nav-bar/nav-bar-top}}
      template block text
    {{/nav-bar/nav-bar-top}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
