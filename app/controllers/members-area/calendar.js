// Importing Ember
import Ember from 'ember';

// Importing Calendar resources
import CalendarRangeStoreMixin from '../../mixins/range-store';
import CalendarEventStoreMixin from '../../mixins/event-store';
import CalendarTools from '../../components/utilities/calendartools';

// Your controller should extend CalendarRangeStoreMixin and CalendarEventStoreMixin
// CalendarEventStoreMixin offers convenient routines to store and merge calendar events efficiently
// CalendarRangeStoreMixin handles date-ranges, and determines if a range has already been fetched or not (useful for AJAX event sources)
export default Ember.Controller.extend( CalendarRangeStoreMixin, CalendarEventStoreMixin, {

    // this holds the reference to the calendar component
    calendar: null,

    // // the selected event, if any
    selectedEvent: null,

    // // class binding to handle the "Selected event tab" in the view
    displayClass: (function() {
        if (this.get('selectedEvent')) { return 'col-sm-9'; }
        return 'col-sm-12';
    }).property('selectedEvent'),

    showEvents: function() {
      var events = this.get('model');

      var response = events.map(function(event) {
        return CalendarTools.DisplayedEvent.create({
            start: event.get('start'),
            end: event.get('end'),
            label: event.get('name'),
            payload: event   // If events were fetched by an API, this is where your would put your own event model
        });
      });

      this.mergeEvents(response);
    },

    actions: {

        // Called when a calendar event is selected
        // It's the controller responsibility to do something with the selected calendar event
        // Here, we inform the event that it's active, so that depending views may update (color changes, notably)
        eventSelected: function(event) {
            this.set('selectedEvent', event);
            this.get('selectedEvent').set('active', true);
            return false;
        },

        // Called when a calendar event is unselected
        eventUnselected: function() {
            this.get('selectedEvent').set('active', false);
            this.set('selectedEvent', false);
            return false;
        },

        // Called when the "Close" button is clicked for the selected event
        // This action is initialized by our controller, not by the calendar component
        closeEvent: (function() {
            return this.calendar.unselectEvent();
        }),

        // Called when the displayed month changes
        // Our controller should fetch calendar events to respond to this
        viewChanged: function(range, oldrange) {

            if (this.isRangeFetched(range)) {
                // CalendarRangeStoreMixin says that this range has been fetched already
                // We do nothing
                return;
            } else {
                // CalendarRangeStoreMixin says that this range has NOT already been fetched
                // We aggregate the range to the already fetched range, to keep track of this
                this.aggregateRange(range);
            }

            this.showEvents();
        }
    }
});
