Simple Autocomplete Class Javascript
======

# Author
devjul - https://www.twitter.com/devjul

# Usage
## Script arguments

1. Url Service to call
2. List options
  * elements: list of input tag to listen
  * resultList: DOM element if you want to use an existing ul, if 'false' a new ul element will be created
  * resultClassName: add a CSS class to your resultList element
  * inputName: assign a get variable for urlService call
  * delayCheck: delay between last user tap and the request start
  * minChars: minimum character needed
  * killerFn: close the result element if user click outside
  * cacheResult: activate / desactivate local storage cache
  * cacheTimeValid: local storage valid duration
3. Callback function to call in order to inject response items

## JavaScript

```javascript
<script type="/path/autocomplete.js"></script>
<script>
'use strict';

var test = new Autocomplete("test", {
	elements: document.querySelectorAll('input'),
	resultList: document.getElementById('timeline')
}, function(li, item) {
	li.innerHTML = 'add ' + item.msg + item.id;

    li.addEventListener('click', function(e) {
    	e.preventDefault();
        var value = li.innerHTML;
		console.log('click on :' + value);
    });
});
</script>
```

## RequireJS

```javascript
<script>
define(['path/autocomplete'],
	function(autocomplete) {
        'use strict';
        var autocomplete = new autocomplete();
    }
);
</script>
```    