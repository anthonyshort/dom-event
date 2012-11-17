var indexOf = require('component-indexof');
var extend = require('anthonyshort-extend');

/**
 * DOM Event helper for IE7+. The event object is broken in
 * IE. This module allows us to bind to events on elements
 * and have an event wrapper for cross-browser consistency.
 *
 * The idea is to make the event object behave the way does
 * in good browsers.
 *
 * If you're not supporting IE7 you could just modify the getters
 * on the event prototype like https://github.com/jwmcpeak/EventShim/blob/master/eventShim.js.
 *
 * This only provides minimal functionality. If you're looking
 * for something more advanced, like custom events, use jQuery or
 * something larger.
 */

// not a complete list of DOM3 events; some of these IE8 doesn't support
var bubbleEvents = [ "select", "scroll", "click", "dblclick",
    "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "wheel", "textinput",
    "keydown", "keypress", "keyup"];

/**
 * The event wrapper object. This is passed to event
 * callbacks instead of the original event. All properties from
 * the original event are copied over to this event. We then
 * extend it will some other properties and methods.
 * @param {DOMEvent} e Event fired from DOM event
 */
var Event = function(e) {
  extend(this, e);
  this.bubbles = indexof(bubbleEvents, this.type) > -1;
  if (this.type === "mouseover" || this.type === "mouseout") {
    this.relatedTarget = (type === "mouseover") ? this.fromElement : this.toElement;
  }
  this.target = this.srcElement;
};

/**
 * Whether the event bubbles
 * @type {Boolean}
 */
Event.prototype.bubbles = false;

/**
 * Whether the default has been prevented
 * @type {Boolean}
 */
Event.prototype.defaultPrevented = false;

/**
 * Gets the secondary targets of mouseover and mouseout events (toElement and fromElement)
 * @type {DOMElement} or {null}
 */
Event.prototype.relatedTarget = null;

/**
 * The element the event was fired on
 * @type {DOMElement}
 */
Event.prototype.target = null;

/**
 * Prevent default browser event
 * @return {[type]} [description]
 */
Event.prototype.preventDefault = function() {
  this.e.returnValue = false;
  this.defaultPrevented = true;
};

/**
 * @return {void}
 */
Event.prototype.stopPropagation = function() {
  this.e.cancelBubble = true;
};

/**
 * Bind to a DOM event. An improved event object will be sent
 * to the callback to help IE7+.
 *  
 *   DOMEvent.on(el, 'click', function(event){});
 * 
 * @param  {DOMElement}   el      The DOM element to bind to
 * @param  {String}       type    Event name
 * @param  {Function}     fn      Callback function
 * @param  {Boolean}      capture 
 * @return {Function} The callback function
 */
exports.on = function(el, type, fn, capture) {
  if (!el.addEventListener) {
    var callback = function(event) {
      var e = new Event(event);
      fn.call(this, e);
    };
    el.attachEvent('on' + type, callback);
    return callback;
  } else {
    el.addEventListener(type, fn, capture);
    return fn;
  }  
};

/**
 * Remove
 * @param  {DOMElement}   el
 * @param  {String}       type    Event name
 * @param  {Function}     fn      Callback function
 * @param  {Boolean}      capture
 * @return {void}
 */
exports.off = function(el, type, fn, capture){
  if (el.removeEventListener) {
    el.removeEventListener(type, fn, capture);
  } else {
    el.detachEvent('on' + type, fn);
  }
};
