Simple Autocomplete Class Javascript
======

# Author
devjul - https://www.twitter.com/devjul

# Usage
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