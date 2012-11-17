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

// Events that will bubble in IE8
var bubbleEvents = [ "select", "scroll", "click", "dblclick",
    "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "wheel", "textinput",
    "keydown", "keypress", "keyup"];

// Used to determine if the event was a mouse event
var mouseEvents = [ "button", "buttons", "clientX", "clientY", 
    "fromElement", "offsetX", "offsetY", "pageX", "pageY", "screenX", "screenY", "toElement"];

// Used to determine if the event fire was a key event
var keyEvents = [ "char", "charCode", "key", "keyCode" ];

// Used for calculating mouse event positions
var doc = document || {};
var root = doc.documentElement || {};

/**
 * The event wrapper object. This is passed to event
 * callbacks instead of the original event. All properties from
 * the original event are copied over to this event. We then
 * extend it will some other properties and methods.
 * @param {DOMEvent} e Event fired from DOM event
 */
function Event(e) {
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

  // Normalize different event types
  this._normalizeKeyEvent();
  this._normalizeMouseEvent();
};

/**
 * If the native event function has been prevented
 * @type {Boolean}
 */
Event.prototype.defaultPrevented = false;

/**
 * Is this event a mouse event.
 * @return {Boolean}
 */
Event.prototype.isMouseEvent = function() {
  return indexof(mouseEvents, this.type) !== -1;
};

/**
 * Is this event a keypress event
 * @return {Boolean}
 */
Event.prototype.isKeyEvent = function() {
  return indexof(keyEvents, this.type) !== -1;
};

/**
 * Normalize the event if it is a key event.
 * @api private
 * @return {void}
 */
Event.prototype._normalizeKeyEvent = function() {
  if ( this.isKeyEvent() === false ) {
    return false;
  }
  this.keyCode = e.keyCode || e.which;
};

/**
 * Normalize the event if it is a mouse event. We set the
 * rightClick flag and fix the page coordinates. Also
 * fixes the relatedElement.
 * @api private
 * @return {void}
 */
Event.prototype._normalizeMouseEvent = function() {
  if ( this.isMouseEvent() === false ) {
    return false;
  }

  var e = this.original;

  // Was this a right click event?
  this.rightClick = e.which === 3 || e.button === 2;

  // Calculate pageX/Y if missing and clientX/Y available
  if (e.pageX || e.pageY) {
    this.clientX = e.pageX;
    this.clientY = e.pageY;
  } else if (e.clientX || e.clientY) {
    this.clientX = e.clientX + doc.body.scrollLeft + root.scrollLeft;
    this.clientY = e.clientY + doc.body.scrollTop + root.scrollTop;
  }

  // Add relatedTarget, if necessary
  if ( !e.relatedTarget && e.fromElement ) {
    this.relatedTarget = e.fromElement === this.target ? e.toElement : e.fromElement;
  }
};

/**
 * Prevent default browser event
 * @return {void}
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
 * Stop the event from propagating upwards
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