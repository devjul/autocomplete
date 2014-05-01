;(function (window, document) {

    'use strict';

    var nextTick, ajaxLoad;

    nextTick = window.requestAnimationFrame ||
               window.mozRequestAnimationFrame ||
               window.webkitRequestAnimationFrame ||
               function (callback) {
                   window.setTimeout(callback, 1000 / 60);
               };

    ajaxLoad = function(url, callback) {
        if (url && typeof (url) !== 'string') {
            return;
        }

        function reqListener () {
            if (callback && typeof (callback) === 'function') {
                callback(this.responseText);
            }
        }

        var oReq = new XMLHttpRequest();
        oReq.onload = reqListener;
        oReq.open("get", url, true);
        oReq.send();
    };

    function Autocomplete(urlService, options, customFunctions) {
        if (typeof(urlService) !== 'string' || !urlService) {
            return;
        }
        this.urlService = urlService;
        this.timeout = 0;
        this.lastCheck = '';
        this.inputActive = false;

        this.options = {
            elements: {},
            resultList: false,
            resultClassName: 'result',
            delayCheck: 300,
            minChars: 3,
            killerFn: true
        };

        this.customFunctions = false;
        if (customFunctions && typeof(customFunctions === 'function')) {
            this.customFunctions = customFunctions;
        }

        options = options || {};

        Object.keys(options).forEach(function (item) {
            this.options[item] = options[item];
        }.bind(this));

        this.elementsList = [].slice.call(this.options.elements);

        nextTick(function() {
            this.init();
        }.bind(this));
    }

    Autocomplete.prototype.init = function() {
        this.initialized = true;

        this.createResultList();

        this.elementsList.forEach(function(item) { 
            this.addEvents(item);
        }.bind(this));
    };

    Autocomplete.prototype.createResultList = function() {
        if (typeof(this.options.resultList) === 'object' && this.options.resultList.tagName) {
            this.resultList = this.options.resultList;
            return;
        }

        this.resultList = document.createElement("ul");
        if (typeof (this.options.resultClassName) === 'string') {
            this.resultList.classList.add(this.options.resultClassName);
        }

        document.body.appendChild(this.resultList);
    };

    Autocomplete.prototype.addEvents = function(item) {
        item.addEventListener('keypress', function(e) {
            this.inputActive = item;
            clearTimeout(this.timeoutFn);
            this.timeoutFn = setTimeout(function() {
                this.checkNeedSuggest(item, e);
            }.bind(this), this.options.delayCheck);
        }.bind(this));
    };

    Autocomplete.prototype.checkNeedSuggest = function(item, key) {
        var value = false;
        if (item.value) {
            value = item.value;
        }
        else {
            // TODO: Contenteditable support
            return;
        }

        if (value && value.length >= this.options.minChars && value !== this.lastCheck) {
            this.lastCheck = value;
            this.checkSuggest(this.lastCheck);
            return;
        }

        this.resultList.style.display = 'none';
    };

    Autocomplete.prototype.checkSuggest = function(value) {
        ajaxLoad(this.urlService, function(result) {
            this.showResult(result);
        }.bind(this));
    };

    Autocomplete.prototype.showResult = function(result) {
        this.resultList.innerHTML = '';
        this.resultList.style.display = 'block';
        if (result && typeof (result) === 'object') {
            result.forEach(function(item) {
                this.addResponse(item);
            }.bind(this));
        }

        if (this.options.killerFn) {
            var listener = function (e) {
                var eltCheck = e.target;
                var hide = true;

                if (eltCheck && eltCheck === this.inputActive) {
                    hide = false;
                }
                else {
                    while (eltCheck && eltCheck.parent !== 'null' && eltCheck.parentNode !== document.body) {
                        eltCheck = eltCheck.parentNode;

                        if (eltCheck === this.resultList) {
                            hide = false;
                            break;
                        }
                    }
                }

                if (hide) {
                    clearTimeout(this.timeoutFn);
                    this.resultList.style.display = 'none';
                    document.body.removeEventListener('click', listener);
                }
            }.bind(this);
            document.body.addEventListener('click', listener, false);
        }
    };

    Autocomplete.prototype.addResponse = function(item) {
        var li = document.createElement("li");
        if (this.customFunctions) {
            this.customFunctions(li, item);
        }
        else {
            li.innerHTML = item.msg;
        }
        this.resultList.appendChild(li);
    };

    /* global module, exports: true, define */
    if (typeof module === 'object' && typeof module.exports === 'object') {
        // CommonJS, just export
        module.exports = exports = Autocomplete;
    } else if (typeof define === 'function' && define.amd) {
        // AMD support
        define(function () { return Autocomplete; });
    } else if (typeof window === 'object') {
        // If no AMD and we are in the browser, attach to window
        window.Autocomplete = Autocomplete;
    }
    /* global -module, -exports, -define */

}(window, document));