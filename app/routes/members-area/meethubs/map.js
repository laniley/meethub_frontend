import Ember from 'ember';

export default Ember.Route.extend({
  beforeModel: function() {
    this.controllerFor('members-area').set('currentSection', 'map');

    var currentSection = this.controllerFor('members-area/meethubs').get('currentSection');

    if(currentSection === 'create')
    {
      this.transitionTo('members-area.meethubs.map.create');
    }
    else if(currentSection === 'search')
    {
      this.transitionTo('members-area.meethubs.map.search');
    }
  },
  renderTemplate: function() {
    this.render('members-area.map', { outlet: 'main-area' });
    this.render('members-area.meethubs.map.section-buttons', {
      outlet: 'section-buttons',
      into: 'members-area.meethubs'
    });
  }
});
