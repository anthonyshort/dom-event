
# dom-event

Simple DOM event wrapper for cross-browser support from IE8+. This is so we don't need to rely on large libraries just to bind events cross-browser. 

The the spirit of Component, I'm aiming to keep this simple.

**This is a work in progress**

## Installation

  $ component install anthonyshort/dom-event

## API

```js
  var EventWrapper = require('anthonyshort-dom-event');
  var dom = require('component-domify');
  
  dom(el).bind('click', function(event){
    event = new EventWrapper(event);
    event.preventDefault();
  });
```

## License

  MIT
