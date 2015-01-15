
/* global _ */
import Ember from 'ember';
var component;

component = Ember.Mixin.create({

  calendarevents: [],

  mergeEvents: function(occurences) {

    var calendarevents, filteredOccurences, occurence, i, k;

    calendarevents = this.get('calendarevents');

    filteredOccurences = [];

    for (i = 0; i < occurences.length; i++)
    {
      occurence = occurences[i];
      var found = false;

      for(k = 0; k < calendarevents.length; k++)
      {
        if(calendarevents[k].payload.id === occurence.payload.id)
        {
          found = true;
          break;
        }
      }

      if(!found)
      {
        filteredOccurences.push(occurence);
      }
    }
    return this.get('calendarevents').pushObjects(filteredOccurences);
  },

  getEvents: function() {
    return this.get('calendarevents');
  }
});

export default component;
