var indexOf = require('indexof');
var extend = require('extend');

/**
 * DOM Event wrapper for IE8+. The event object is broken in
 * IE. This module allows us to bind to events on elements
 * and have an event wrapper for cross-browser consistency.
 *
 * The idea is to make the event object behave the way does
 * in good browsers. I've extracted relevant parts from jQuery
 * and other libraries to help fix the event object in IE.
 *
 * This only provides minimal functionality. If you're looking
 * for something more advanced, like custom events, use jQuery or
 * something larger.
 *
 * If I've missed anything, submit an issue on Github.
 */

var bubbleEvents = [ "select", "scroll", "click", "dblclick",
    "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "wheel", "textinput",
    "keydown", "keypress", "keyup"];

var mouseEvents = [ "button", "buttons", "clientX", "clientY", 
    "fromElement", "offsetX", "offsetY", "pageX", "pageY", "screenX", "screenY", "toElement"];

var keyEvents = [ "char", "charCode", "key", "keyCode" ];

/**
 * The event wrapper object. This is passed to event
 * callbacks instead of the original event. All properties from
 * the original event are copied over to this event. We then
 * extend it will some other properties and methods.
 * @param {DOMEvent} e Event fired from DOM event
 */
var Event = function(e) {
  this.original = e;

  // Pull over all properties from the event object
  extend(this, e);

  // Set target
  if( !e.target ) {
    this.target = e.srcElement || document;
  }

  // Target should not be a text node
  if ( e.target.nodeType === 3 ) {
    this.target = e.target.parentNode;
  }

  // For mouse/key events, metaKey==false if it's undefined 
  this.metaKey = !!e.metaKey;

  // Buddling boolean
  if( !e.bubbles ) {
    this.bubbles = indexof(bubbleEvents, e.type) > -1;
  }

  // Key events
  if ( indexof(keyEvents, e.type) !== -1 && e.which == null ) {
    this.which = e.charCode || e.keyCode;
  }

  // Mouse events
  if ( indexof(mouseEvents, e.type) !== -1) {

    // Calculate pageX/Y if missing and clientX/Y available
    if ( this.pageX == null && this.clientX != null ) {
      var eventDoc = this.target.ownerDocument || document;
      var doc = eventDoc.documentElement;
      var body = eventDoc.body;
      this.pageX = e.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
      this.pageY = e.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
    }

    // Add relatedTarget, if necessary
    var fromElement = e.fromElement;
    if ( !e.relatedTarget && fromElement ) {
      this.relatedTarget = fromElement === this.target ? e.toElement : fromElement;
    }

    // Add which for click: 1 === left; 2 === middle; 3 === right
    // Note: button is not normalized, so don't use it
    var button = e.button;
    if ( !e.which && button !== undefined ) {
      this.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
    }
  }
};

/**
 * Prevent default browser event
 * @return {[type]} [description]
 */
Event.prototype.preventDefault = function() {
  var e = this.original;
  this.defaultPrevented = true;

  if( e.preventDefault ) {
    return e.preventDefault();
  }
  else {
    e.returnValue = false;
  }
};

/**
 * @return {void}
 */
Event.prototype.stopPropagation = function() {
  var e = this.original;

  if( e.stopPropagation ) {
    e.stopPropagation();
  }
  else {
    e.cancelBubble = true;    
  }
};

module.exports = Event;