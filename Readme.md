
# dom-event

Simple DOM event wrapper for cross-browser support from IE8+. Basically wraps the event that gets sent back in the callback for IE. This is so we don't need to rely on large libraries just to bind events cross-browser. 

The the spirit of Component, I'm aiming to keep this simple

**This is a work in progress**

## Installation

  $ component install anthonyshort/dom-event

## API

```js
  var Event = require('anthonyshort-dom-event');
  Event.on(el, 'click', function(event){
    event.preventDefault();
  });
```

## License

  MIT
