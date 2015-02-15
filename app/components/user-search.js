import Ember from 'ember';

export default Ember.Component.extend({
  parent: null,
  user: null,
  search_term: '',
  search_results: function() {
    var self = this;

    var filteredItems = self.get('friends').filter(function(item) {
      return item.get('name').toLowerCase().indexOf(self.get('search_term').toLowerCase()) !== -1;
    });

    return filteredItems;
  }.property('friends.@each', 'search_term')
});
