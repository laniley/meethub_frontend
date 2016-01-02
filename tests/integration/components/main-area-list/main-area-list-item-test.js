import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('main-area-list/main-area-list-item', 'Integration | Component | main area list/main area list item', {
  integration: true
});

test('it renders', function(assert) {
  
  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });" + EOL + EOL +

  this.render(hbs`{{main-area-list/main-area-list-item}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#main-area-list/main-area-list-item}}
      template block text
    {{/main-area-list/main-area-list-item}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
