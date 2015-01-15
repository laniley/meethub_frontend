import Ember from 'ember';
import CalendarTools from '../../components/utilities/calendartools';

export default Ember.Route.extend({
  setupController: function(controller) {
    controller.set('model', this.store.all('event'));
  },
  renderTemplate: function() {
    this.render({
      outlet: 'main-area'
    });
    this.render('members-area.top-nav-bar-links.calendar', {
      outlet: 'top-nav-bar-links',
      controller: 'members-area'
    });
    this.render('members-area.side-nav-bar.filter.calendar', {
      outlet: 'area-filter'
    });
  }
});
