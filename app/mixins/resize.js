import Ember from 'ember';

/**
 * @module  Mixin
 *
 * @class ResizeMixin
 * @extends Ember.Mixin
 */
export default Ember.Mixin.create({

  bindResize: function () {

    var onResize, self = this;

    onResize = function ()  {
      return self.resized();
    };

    Ember.$( window ).bind( 'resize', onResize );
  },

  unbindResize: function ()  {
    Ember.$( window ).unbind( 'scroll' );
  }

});
