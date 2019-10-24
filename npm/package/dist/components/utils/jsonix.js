"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/* eslint-disable */

/**
 * Copied jsonix locally to make this fix: https://github.com/boundlessgeo/jsonix/commit/3342c011779261a860488b1a692fa09910cd273e
 * Webpack does not like the define. See https://github.com/highsource/jsonix/issues/171
 * 
 * TODO: Get rid of this file and instead maybe monkey patch the dependency in node_modules
 */
var _jsonix_factory = function _jsonix_factory(_jsonix_xmldom, _jsonix_xmlhttprequest, _jsonix_fs) {
  // Complete Jsonix script is included below 
  var Jsonix = {
    singleFile: true
  };
  Jsonix.Util = {};

  Jsonix.Util.extend = function (destination, source) {
    destination = destination || {};

    if (source) {
      /*jslint forin: true */
      for (var property in source) {
        var value = source[property];

        if (value !== undefined) {
          destination[property] = value;
        }
      }
      /**
       * IE doesn't include the toString property when iterating over an
       * object's properties with the for(property in object) syntax.
       * Explicitly check if the source has its own toString property.
       */

      /*
       * FF/Windows < 2.0.0.13 reports "Illegal operation on WrappedNative
       * prototype object" when calling hawOwnProperty if the source object is
       * an instance of window.Event.
       */
      // REWORK
      // Node.js


      sourceIsEvt = typeof window !== 'undefined' && window !== null && typeof window.Event === "function" && source instanceof window.Event;

      if (!sourceIsEvt && source.hasOwnProperty && source.hasOwnProperty('toString')) {
        destination.toString = source.toString;
      }
    }

    return destination;
  };

  Jsonix.Class = function () {
    var Class = function Class() {
      this.initialize.apply(this, arguments);
    };

    var extended = {};

    var empty = function empty() {};

    var parent, initialize, Type;

    for (var i = 0, len = arguments.length; i < len; ++i) {
      Type = arguments[i];

      if (typeof Type == "function") {
        // make the class passed as the first argument the superclass
        if (i === 0 && len > 1) {
          initialize = Type.prototype.initialize; // replace the initialize method with an empty function,
          // because we do not want to create a real instance here

          Type.prototype.initialize = empty; // the line below makes sure that the new class has a
          // superclass

          extended = new Type(); // restore the original initialize method

          if (initialize === undefined) {
            delete Type.prototype.initialize;
          } else {
            Type.prototype.initialize = initialize;
          }
        } // get the prototype of the superclass


        parent = Type.prototype;
      } else {
        // in this case we're extending with the prototype
        parent = Type;
      }

      Jsonix.Util.extend(extended, parent);
    }

    Class.prototype = extended;
    return Class;
  };

  Jsonix.XML = {
    XMLNS_NS: 'http://www.w3.org/2000/xmlns/',
    XMLNS_P: 'xmlns'
  };
  Jsonix.DOM = {
    isDomImplementationAvailable: function isDomImplementationAvailable() {
      if (typeof _jsonix_xmldom !== 'undefined') {
        return true;
      } else if (typeof document !== 'undefined' && Jsonix.Util.Type.exists(document.implementation) && Jsonix.Util.Type.isFunction(document.implementation.createDocument)) {
        return true;
      } else {
        return false;
      }
    },
    createDocument: function createDocument() {
      // REWORK
      // Node.js
      if (typeof _jsonix_xmldom !== 'undefined') {
        return new _jsonix_xmldom.DOMImplementation().createDocument();
      } else if (typeof document !== 'undefined' && Jsonix.Util.Type.exists(document.implementation) && Jsonix.Util.Type.isFunction(document.implementation.createDocument)) {
        return document.implementation.createDocument('', '', null);
      } else if (typeof ActiveXObject !== 'undefined') {
        return new ActiveXObject('MSXML2.DOMDocument');
      } else {
        throw new Error('Error created the DOM document.');
      }
    },
    serialize: function serialize(node) {
      Jsonix.Util.Ensure.ensureExists(node); // REWORK
      // Node.js

      if (typeof _jsonix_xmldom !== 'undefined') {
        return new _jsonix_xmldom.XMLSerializer().serializeToString(node);
      } else if (Jsonix.Util.Type.exists(XMLSerializer)) {
        return new XMLSerializer().serializeToString(node);
      } else if (Jsonix.Util.Type.exists(node.xml)) {
        return node.xml;
      } else {
        throw new Error('Could not serialize the node, neither XMLSerializer nor the [xml] property were found.');
      }
    },
    parse: function parse(text) {
      Jsonix.Util.Ensure.ensureExists(text);

      if (typeof _jsonix_xmldom !== 'undefined') {
        return new _jsonix_xmldom.DOMParser().parseFromString(text, 'application/xml');
      } else if (typeof DOMParser != 'undefined') {
        return new DOMParser().parseFromString(text, 'application/xml');
      } else if (typeof ActiveXObject != 'undefined') {
        var doc = Jsonix.DOM.createDocument('', '');
        doc.loadXML(text);
        return doc;
      } else {
        var url = 'data:text/xml;charset=utf-8,' + encodeURIComponent(text);
        var request = new XMLHttpRequest();
        request.open('GET', url, false);

        if (request.overrideMimeType) {
          request.overrideMimeType("text/xml");
        }

        request.send(null);
        return request.responseXML;
      }
    },
    load: function load(url, callback, options) {
      var request = Jsonix.Request.INSTANCE;
      request.issue(url, function (transport) {
        var result;

        if (Jsonix.Util.Type.exists(transport.responseXML) && Jsonix.Util.Type.exists(transport.responseXML.documentElement)) {
          result = transport.responseXML;
        } else if (Jsonix.Util.Type.isString(transport.responseText)) {
          result = Jsonix.DOM.parse(transport.responseText);
        } else {
          throw new Error('Response does not have valid [responseXML] or [responseText].');
        }

        callback(result);
      }, function (transport) {
        throw new Error('Could not retrieve XML from URL [' + url + '].');
      }, options);
    },
    xlinkFixRequired: null,
    isXlinkFixRequired: function isXlinkFixRequired() {
      if (Jsonix.DOM.xlinkFixRequired === null) {
        if (typeof navigator === 'undefined') {
          Jsonix.DOM.xlinkFixRequired = false;
        } else if (!!navigator.userAgent && /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor)) {
          var doc = Jsonix.DOM.createDocument();
          var el = doc.createElement('test');
          el.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', 'urn:test');
          doc.appendChild(el);
          var testString = Jsonix.DOM.serialize(doc);
          Jsonix.DOM.xlinkFixRequired = testString.indexOf('xmlns:xlink') === -1;
        } else {
          Jsonix.DOM.xlinkFixRequired = false;
        }
      }

      return Jsonix.DOM.xlinkFixRequired;
    }
  };
  Jsonix.Request = Jsonix.Class({
    // REWORK
    factories: [function () {
      return new XMLHttpRequest();
    }, function () {
      return new ActiveXObject('Msxml2.XMLHTTP');
    }, function () {
      return new ActiveXObject("Msxml2.XMLHTTP.6.0");
    }, function () {
      return new ActiveXObject("Msxml2.XMLHTTP.3.0");
    }, function () {
      return new ActiveXObject('Microsoft.XMLHTTP');
    }, function () {
      // Node.js
      if (typeof _jsonix_xmlhttprequest !== 'undefined') {
        var XMLHttpRequest = _jsonix_xmlhttprequest.XMLHttpRequest;
        return new XMLHttpRequest();
      } else {
        return null;
      }
    }],
    initialize: function initialize() {},
    issue: function issue(url, onSuccess, onFailure, options) {
      Jsonix.Util.Ensure.ensureString(url);

      if (Jsonix.Util.Type.exists(onSuccess)) {
        Jsonix.Util.Ensure.ensureFunction(onSuccess);
      } else {
        onSuccess = function onSuccess() {};
      }

      if (Jsonix.Util.Type.exists(onFailure)) {
        Jsonix.Util.Ensure.ensureFunction(onFailure);
      } else {
        onFailure = function onFailure() {};
      }

      if (Jsonix.Util.Type.exists(options)) {
        Jsonix.Util.Ensure.ensureObject(options);
      } else {
        options = {};
      }

      var transport = this.createTransport();
      var method = Jsonix.Util.Type.isString(options.method) ? options.method : 'GET';
      var async = Jsonix.Util.Type.isBoolean(options.async) ? options.async : true;
      var proxy = Jsonix.Util.Type.isString(options.proxy) ? options.proxy : Jsonix.Request.PROXY;
      var user = Jsonix.Util.Type.isString(options.user) ? options.user : null;
      var password = Jsonix.Util.Type.isString(options.password) ? options.password : null;

      if (Jsonix.Util.Type.isString(proxy) && url.indexOf("http") === 0) {
        url = proxy + encodeURIComponent(url);
      }

      if (Jsonix.Util.Type.isString(user)) {
        transport.open(method, url, async, user, password);
      } else {
        transport.open(method, url, async);
      }

      if (Jsonix.Util.Type.isObject(options.headers)) {
        for (var header in options.headers) {
          if (options.headers.hasOwnProperty(header)) {
            transport.setRequestHeader(header, options.headers[header]);
          }
        }
      }

      var data = Jsonix.Util.Type.exists(options.data) ? options.data : null;

      if (!async) {
        transport.send(data);
        this.handleTransport(transport, onSuccess, onFailure);
      } else {
        var that = this;

        if (typeof window !== 'undefined') {
          transport.onreadystatechange = function () {
            that.handleTransport(transport, onSuccess, onFailure);
          };

          window.setTimeout(function () {
            transport.send(data);
          }, 0);
        } else {
          transport.onreadystatechange = function () {
            that.handleTransport(transport, onSuccess, onFailure);
          };

          transport.send(data);
        }
      }

      return transport;
    },
    handleTransport: function handleTransport(transport, onSuccess, onFailure) {
      if (transport.readyState == 4) {
        if (!transport.status || transport.status >= 200 && transport.status < 300) {
          onSuccess(transport);
        }

        if (transport.status && (transport.status < 200 || transport.status >= 300)) {
          onFailure(transport);
        }
      }
    },
    createTransport: function createTransport() {
      for (var index = 0, length = this.factories.length; index < length; index++) {
        try {
          var transport = this.factories[index]();

          if (transport !== null) {
            return transport;
          }
        } catch (e) {// TODO log
        }
      }

      throw new Error('Could not create XML HTTP transport.');
    },
    CLASS_NAME: 'Jsonix.Request'
  });
  Jsonix.Request.INSTANCE = new Jsonix.Request();
  Jsonix.Request.PROXY = null;
  Jsonix.Schema = {};
  Jsonix.Model = {};
  Jsonix.Util.Type = {
    exists: function exists(value) {
      return typeof value !== 'undefined' && value !== null;
    },
    isUndefined: function isUndefined(value) {
      return typeof value === 'undefined';
    },
    isString: function isString(value) {
      return typeof value === 'string';
    },
    isBoolean: function isBoolean(value) {
      return typeof value === 'boolean';
    },
    isObject: function isObject(value) {
      return _typeof(value) === 'object';
    },
    isFunction: function isFunction(value) {
      return typeof value === 'function';
    },
    isNumber: function isNumber(value) {
      return typeof value === 'number' && !isNaN(value);
    },
    isNumberOrNaN: function isNumberOrNaN(value) {
      return value === +value || Object.prototype.toString.call(value) === '[object Number]';
    },
    isNaN: function (_isNaN) {
      function isNaN(_x) {
        return _isNaN.apply(this, arguments);
      }

      isNaN.toString = function () {
        return _isNaN.toString();
      };

      return isNaN;
    }(function (value) {
      return Jsonix.Util.Type.isNumberOrNaN(value) && isNaN(value);
    }),
    isArray: function isArray(value) {
      // return value instanceof Array;
      return !!(value && value.concat && value.unshift && !value.callee);
    },
    isDate: function isDate(value) {
      return !!(value && value.getTimezoneOffset && value.setUTCFullYear);
    },
    isRegExp: function isRegExp(value) {
      return !!(value && value.test && value.exec && (value.ignoreCase || value.ignoreCase === false));
    },
    isNode: function isNode(value) {
      return (typeof Node === "undefined" ? "undefined" : _typeof(Node)) === "object" || typeof Node === "function" ? value instanceof Node : value && _typeof(value) === "object" && typeof value.nodeType === "number" && typeof value.nodeName === "string";
    },
    isEqual: function isEqual(a, b, report) {
      var doReport = Jsonix.Util.Type.isFunction(report); // TODO rework

      var _range = function _range(start, stop, step) {
        var args = slice.call(arguments);
        var solo = args.length <= 1;
        var start_ = solo ? 0 : args[0];
        var stop_ = solo ? args[0] : args[1];
        var step_ = args[2] || 1;
        var len = Math.max(Math.ceil((stop_ - start_) / step_), 0);
        var idx = 0;
        var range = new Array(len);

        while (idx < len) {
          range[idx++] = start_;
          start_ += step_;
        }

        return range;
      };

      var _keys = Object.keys || function (obj) {
        if (Jsonix.Util.Type.isArray(obj)) {
          return _range(0, obj.length);
        }

        var keys = [];

        for (var key in obj) {
          if (obj.hasOwnProperty(key)) {
            keys[keys.length] = key;
          }
        }

        return keys;
      }; // Check object identity.


      if (a === b) {
        return true;
      } // Check if both are NaNs


      if (Jsonix.Util.Type.isNaN(a) && Jsonix.Util.Type.isNaN(b)) {
        return true;
      } // Different types?


      var atype = _typeof(a);

      var btype = _typeof(b);

      if (atype != btype) {
        if (doReport) {
          report('Types differ [' + atype + '], [' + btype + '].');
        }

        return false;
      } // Basic equality test (watch out for coercions).


      if (a == b) {
        return true;
      } // One is falsy and the other truthy.


      if (!a && b || a && !b) {
        if (doReport) {
          report('One is falsy, the other is truthy.');
        }

        return false;
      } // Check dates' integer values.


      if (Jsonix.Util.Type.isDate(a) && Jsonix.Util.Type.isDate(b)) {
        return a.getTime() === b.getTime();
      } // Both are NaN?


      if (Jsonix.Util.Type.isNaN(a) && Jsonix.Util.Type.isNaN(b)) {
        return false;
      } // Compare regular expressions.


      if (Jsonix.Util.Type.isRegExp(a) && Jsonix.Util.Type.isRegExp(b)) {
        return a.source === b.source && a.global === b.global && a.ignoreCase === b.ignoreCase && a.multiline === b.multiline;
      }

      if (Jsonix.Util.Type.isNode(a) && Jsonix.Util.Type.isNode(b)) {
        var aSerialized = Jsonix.DOM.serialize(a);
        var bSerialized = Jsonix.DOM.serialize(b);

        if (aSerialized !== bSerialized) {
          if (doReport) {
            report('Nodes differ.');
            report('A=' + aSerialized);
            report('B=' + bSerialized);
          }

          return false;
        } else {
          return true;
        }
      } // If a is not an object by this point, we can't handle it.


      if (atype !== 'object') {
        return false;
      } // Check for different array lengths before comparing contents.


      if (Jsonix.Util.Type.isArray(a) && a.length !== b.length) {
        if (doReport) {
          report('Lengths differ.');
          report('A.length=' + a.length);
          report('B.length=' + b.length);
        }

        return false;
      } // Nothing else worked, deep compare the contents.


      var aKeys = _keys(a);

      var bKeys = _keys(b); // Different object sizes?


      if (aKeys.length !== bKeys.length) {
        if (doReport) {
          report('Different number of properties [' + aKeys.length + '], [' + bKeys.length + '].');
        }

        for (var andex = 0; andex < aKeys.length; andex++) {
          if (doReport) {
            report('A [' + aKeys[andex] + ']=' + a[aKeys[andex]]);
          }
        }

        for (var bndex = 0; bndex < bKeys.length; bndex++) {
          if (doReport) {
            report('B [' + bKeys[bndex] + ']=' + b[bKeys[bndex]]);
          }
        }

        return false;
      } // Recursive comparison of contents.


      for (var kndex = 0; kndex < aKeys.length; kndex++) {
        var key = aKeys[kndex];

        if (!(key in b) || !Jsonix.Util.Type.isEqual(a[key], b[key], report)) {
          if (doReport) {
            report('One of the properties differ.');
            report('Key: [' + key + '].');
            report('Left: [' + a[key] + '].');
            report('Right: [' + b[key] + '].');
          }

          return false;
        }
      }

      return true;
    },
    cloneObject: function cloneObject(source, target) {
      target = target || {};

      for (var p in source) {
        if (source.hasOwnProperty(p)) {
          target[p] = source[p];
        }
      }

      return target;
    },
    defaultValue: function defaultValue() {
      var args = arguments;

      if (args.length === 0) {
        return undefined;
      } else {
        var defaultValue = args[args.length - 1];

        var typeOfDefaultValue = _typeof(defaultValue);

        for (var index = 0; index < args.length - 1; index++) {
          var candidateValue = args[index];

          if (_typeof(candidateValue) === typeOfDefaultValue) {
            return candidateValue;
          }
        }

        return defaultValue;
      }
    }
  };
  Jsonix.Util.NumberUtils = {
    isInteger: function isInteger(value) {
      return Jsonix.Util.Type.isNumber(value) && value % 1 === 0;
    }
  };
  Jsonix.Util.StringUtils = {
    trim: !!String.prototype.trim ? function (str) {
      Jsonix.Util.Ensure.ensureString(str);
      return str.trim();
    } : function (str) {
      Jsonix.Util.Ensure.ensureString(str);
      return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },

    /* isEmpty : function(str) {
    	var wcm = Jsonix.Util.StringUtils.whitespaceCharactersMap;
    	for (var index = 0; index < str.length; index++)
    	{
    		if (!wcm[str[index]])
    		{
    			return false;
    		}
    	}
    	return true;
    }, */
    isEmpty: function isEmpty(str) {
      var length = str.length;

      if (!length) {
        return true;
      }

      for (var index = 0; index < length; index++) {
        var c = str[index];

        if (c === ' ') {// skip
        } else if (c > "\r" && c < "\x85") {
          return false;
        } else if (c < "\xA0") {
          if (c < "\t") {
            return false;
          } else if (c > "\x85") {
            return false;
          }
        } else if (c > "\xA0") {
          if (c < "\u2028") {
            if (c < "\u180E") {
              if (c < "\u1680") {
                return false;
              } else if (c > "\u1680") {
                return false;
              }
            } else if (c > "\u180E") {
              if (c < "\u2000") {
                return false;
              } else if (c > "\u200A") {
                return false;
              }
            }
          } else if (c > "\u2029") {
            if (c < "\u205F") {
              if (c < "\u202F") {
                return false;
              } else if (c > "\u202F") {
                return false;
              }
            } else if (c > "\u205F") {
              if (c < "\u3000") {
                return false;
              } else if (c > "\u3000") {
                return false;
              }
            }
          }
        }
      }

      return true;
    },
    isNotBlank: function isNotBlank(str) {
      return Jsonix.Util.Type.isString(str) && !Jsonix.Util.StringUtils.isEmpty(str);
    },
    whitespaceCharacters: "\t\n\x0B\f\r \x85\xA0\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u2028\u2029\u202F\u205F\u3000",
    whitespaceCharactersMap: {
      "\t": true,
      "\n": true,
      "\x0B": true,
      "\f": true,
      "\r": true,
      ' ': true,
      "\x85": true,
      "\xA0": true,
      "\u1680": true,
      "\u180E": true,
      "\u2000": true,
      "\u2001": true,
      "\u2002": true,
      "\u2003": true,
      "\u2004": true,
      "\u2005": true,
      "\u2006": true,
      "\u2007": true,
      "\u2008": true,
      "\u2009": true,
      "\u200A": true,
      "\u2028": true,
      "\u2029": true,
      "\u202F": true,
      "\u205F": true,
      "\u3000": true
    },
    splitBySeparatorChars: function splitBySeparatorChars(str, separatorChars) {
      Jsonix.Util.Ensure.ensureString(str);
      Jsonix.Util.Ensure.ensureString(separatorChars);
      var len = str.length;

      if (len === 0) {
        return [];
      }

      if (separatorChars.length === 1) {
        return str.split(separatorChars);
      } else {
        var list = [];
        var sizePlus1 = 1;
        var i = 0;
        var start = 0;
        var match = false;
        var lastMatch = false;
        var max = -1;
        var preserveAllTokens = false; // standard case

        while (i < len) {
          if (separatorChars.indexOf(str.charAt(i)) >= 0) {
            if (match || preserveAllTokens) {
              lastMatch = true;

              if (sizePlus1++ == max) {
                i = len;
                lastMatch = false;
              }

              list.push(str.substring(start, i));
              match = false;
            }

            start = ++i;
            continue;
          }

          lastMatch = false;
          match = true;
          i++;
        }

        if (match || preserveAllTokens && lastMatch) {
          list.push(str.substring(start, i));
        }

        return list;
      }
    }
  };
  Jsonix.Util.Ensure = {
    ensureBoolean: function ensureBoolean(value) {
      if (!Jsonix.Util.Type.isBoolean(value)) {
        throw new Error('Argument [' + value + '] must be a boolean.');
      }
    },
    ensureString: function ensureString(value) {
      if (!Jsonix.Util.Type.isString(value)) {
        throw new Error('Argument [' + value + '] must be a string.');
      }
    },
    ensureNumber: function ensureNumber(value) {
      if (!Jsonix.Util.Type.isNumber(value)) {
        throw new Error('Argument [' + value + '] must be a number.');
      }
    },
    ensureNumberOrNaN: function ensureNumberOrNaN(value) {
      if (!Jsonix.Util.Type.isNumberOrNaN(value)) {
        throw new Error('Argument [' + value + '] must be a number or NaN.');
      }
    },
    ensureInteger: function ensureInteger(value) {
      if (!Jsonix.Util.Type.isNumber(value)) {
        throw new Error('Argument [' + value + '] must be an integer, but it is not a number.');
      } else if (!Jsonix.Util.NumberUtils.isInteger(value)) {
        throw new Error('Argument [' + value + '] must be an integer.');
      }
    },
    ensureDate: function ensureDate(value) {
      if (!(value instanceof Date)) {
        throw new Error('Argument [' + value + '] must be a date.');
      }
    },
    ensureObject: function ensureObject(value) {
      if (!Jsonix.Util.Type.isObject(value)) {
        throw new Error('Argument [' + value + '] must be an object.');
      }
    },
    ensureArray: function ensureArray(value) {
      if (!Jsonix.Util.Type.isArray(value)) {
        throw new Error('Argument [' + value + '] must be an array.');
      }
    },
    ensureFunction: function ensureFunction(value) {
      if (!Jsonix.Util.Type.isFunction(value)) {
        throw new Error('Argument [' + value + '] must be a function.');
      }
    },
    ensureExists: function ensureExists(value) {
      if (!Jsonix.Util.Type.exists(value)) {
        throw new Error('Argument [' + value + '] does not exist.');
      }
    }
  };
  Jsonix.XML.QName = Jsonix.Class({
    key: null,
    namespaceURI: null,
    localPart: null,
    prefix: null,
    string: null,
    initialize: function initialize(one, two, three) {
      var namespaceURI;
      var localPart;
      var prefix;
      var key;
      var string;

      if (!Jsonix.Util.Type.exists(two)) {
        namespaceURI = '';
        localPart = one;
        prefix = '';
      } else if (!Jsonix.Util.Type.exists(three)) {
        namespaceURI = Jsonix.Util.Type.exists(one) ? one : '';
        localPart = two;
        var colonPosition = two.indexOf(':');

        if (colonPosition > 0 && colonPosition < two.length) {
          prefix = two.substring(0, colonPosition);
          localPart = two.substring(colonPosition + 1);
        } else {
          prefix = '';
          localPart = two;
        }
      } else {
        namespaceURI = Jsonix.Util.Type.exists(one) ? one : '';
        localPart = two;
        prefix = Jsonix.Util.Type.exists(three) ? three : '';
      }

      this.namespaceURI = namespaceURI;
      this.localPart = localPart;
      this.prefix = prefix;
      this.key = (namespaceURI !== '' ? '{' + namespaceURI + '}' : '') + localPart;
      this.string = (namespaceURI !== '' ? '{' + namespaceURI + '}' : '') + (prefix !== '' ? prefix + ':' : '') + localPart;
    },
    toString: function toString() {
      return this.string;
    },
    // foo:bar
    toCanonicalString: function toCanonicalString(namespaceContext) {
      var canonicalPrefix = namespaceContext ? namespaceContext.getPrefix(this.namespaceURI, this.prefix) : this.prefix;
      return this.prefix + (this.prefix === '' ? '' : ':') + this.localPart;
    },
    clone: function clone() {
      return new Jsonix.XML.QName(this.namespaceURI, this.localPart, this.prefix);
    },
    equals: function equals(that) {
      if (!that) {
        return false;
      } else {
        return this.namespaceURI == that.namespaceURI && this.localPart == that.localPart;
      }
    },
    CLASS_NAME: "Jsonix.XML.QName"
  });

  Jsonix.XML.QName.fromString = function (qNameAsString, namespaceContext, defaultNamespaceURI) {
    var leftBracket = qNameAsString.indexOf('{');
    var rightBracket = qNameAsString.lastIndexOf('}');
    var namespaceURI;
    var prefixedName;

    if (leftBracket === 0 && rightBracket > 0 && rightBracket < qNameAsString.length) {
      namespaceURI = qNameAsString.substring(1, rightBracket);
      prefixedName = qNameAsString.substring(rightBracket + 1);
    } else {
      namespaceURI = null;
      prefixedName = qNameAsString;
    }

    var colonPosition = prefixedName.indexOf(':');
    var prefix;
    var localPart;

    if (colonPosition > 0 && colonPosition < prefixedName.length) {
      prefix = prefixedName.substring(0, colonPosition);
      localPart = prefixedName.substring(colonPosition + 1);
    } else {
      prefix = '';
      localPart = prefixedName;
    } // If namespace URI was not set and we have a namespace context, try to find the namespace URI via this context


    if (namespaceURI === null) {
      if (prefix === '' && Jsonix.Util.Type.isString(defaultNamespaceURI)) {
        namespaceURI = defaultNamespaceURI;
      } else if (namespaceContext) {
        namespaceURI = namespaceContext.getNamespaceURI(prefix);
      }
    } // If we don't have a namespace URI, assume '' by default
    // TODO document the assumption


    if (!Jsonix.Util.Type.isString(namespaceURI)) {
      namespaceURI = defaultNamespaceURI || '';
    }

    return new Jsonix.XML.QName(namespaceURI, localPart, prefix);
  };

  Jsonix.XML.QName.fromObject = function (object) {
    Jsonix.Util.Ensure.ensureObject(object);

    if (object instanceof Jsonix.XML.QName || Jsonix.Util.Type.isString(object.CLASS_NAME) && object.CLASS_NAME === 'Jsonix.XML.QName') {
      return object;
    }

    var localPart = object.localPart || object.lp || null;
    Jsonix.Util.Ensure.ensureString(localPart);
    var namespaceURI = object.namespaceURI || object.ns || '';
    var prefix = object.prefix || object.p || '';
    return new Jsonix.XML.QName(namespaceURI, localPart, prefix);
  };

  Jsonix.XML.QName.fromObjectOrString = function (value, namespaceContext, defaultNamespaceURI) {
    if (Jsonix.Util.Type.isString(value)) {
      return Jsonix.XML.QName.fromString(value, namespaceContext, defaultNamespaceURI);
    } else {
      return Jsonix.XML.QName.fromObject(value);
    }
  };

  Jsonix.XML.QName.key = function (namespaceURI, localPart) {
    Jsonix.Util.Ensure.ensureString(localPart);

    if (namespaceURI) {
      var colonPosition = localPart.indexOf(':');
      var localName;

      if (colonPosition > 0 && colonPosition < localPart.length) {
        localName = localPart.substring(colonPosition + 1);
      } else {
        localName = localPart;
      }

      return '{' + namespaceURI + '}' + localName;
    } else {
      return localPart;
    }
  };

  Jsonix.XML.Calendar = Jsonix.Class({
    year: NaN,
    month: NaN,
    day: NaN,
    hour: NaN,
    minute: NaN,
    second: NaN,
    fractionalSecond: NaN,
    timezone: NaN,
    date: null,
    initialize: function initialize(data) {
      Jsonix.Util.Ensure.ensureObject(data); // Year

      if (Jsonix.Util.Type.exists(data.year)) {
        Jsonix.Util.Ensure.ensureInteger(data.year);
        Jsonix.XML.Calendar.validateYear(data.year);
        this.year = data.year;
      } else {
        this.year = NaN;
      } // Month


      if (Jsonix.Util.Type.exists(data.month)) {
        Jsonix.Util.Ensure.ensureInteger(data.month);
        Jsonix.XML.Calendar.validateMonth(data.month);
        this.month = data.month;
      } else {
        this.month = NaN;
      } // Day


      if (Jsonix.Util.Type.exists(data.day)) {
        Jsonix.Util.Ensure.ensureInteger(data.day);

        if (Jsonix.Util.NumberUtils.isInteger(data.year) && Jsonix.Util.NumberUtils.isInteger(data.month)) {
          Jsonix.XML.Calendar.validateYearMonthDay(data.year, data.month, data.day);
        } else if (Jsonix.Util.NumberUtils.isInteger(data.month)) {
          Jsonix.XML.Calendar.validateMonthDay(data.month, data.day);
        } else {
          Jsonix.XML.Calendar.validateDay(data.day);
        }

        this.day = data.day;
      } else {
        this.day = NaN;
      } // Hour


      if (Jsonix.Util.Type.exists(data.hour)) {
        Jsonix.Util.Ensure.ensureInteger(data.hour);
        Jsonix.XML.Calendar.validateHour(data.hour);
        this.hour = data.hour;
      } else {
        this.hour = NaN;
      } // Minute


      if (Jsonix.Util.Type.exists(data.minute)) {
        Jsonix.Util.Ensure.ensureInteger(data.minute);
        Jsonix.XML.Calendar.validateMinute(data.minute);
        this.minute = data.minute;
      } else {
        this.minute = NaN;
      } // Second


      if (Jsonix.Util.Type.exists(data.second)) {
        Jsonix.Util.Ensure.ensureInteger(data.second);
        Jsonix.XML.Calendar.validateSecond(data.second);
        this.second = data.second;
      } else {
        this.second = NaN;
      } // Fractional second


      if (Jsonix.Util.Type.exists(data.fractionalSecond)) {
        Jsonix.Util.Ensure.ensureNumber(data.fractionalSecond);
        Jsonix.XML.Calendar.validateFractionalSecond(data.fractionalSecond);
        this.fractionalSecond = data.fractionalSecond;
      } else {
        this.fractionalSecond = NaN;
      } // Timezone


      if (Jsonix.Util.Type.exists(data.timezone)) {
        if (Jsonix.Util.Type.isNaN(data.timezone)) {
          this.timezone = NaN;
        } else {
          Jsonix.Util.Ensure.ensureInteger(data.timezone);
          Jsonix.XML.Calendar.validateTimezone(data.timezone);
          this.timezone = data.timezone;
        }
      } else {
        this.timezone = NaN;
      }

      var initialDate = new Date(0);
      initialDate.setUTCFullYear(this.year || 1970);
      initialDate.setUTCMonth(this.month - 1 || 0);
      initialDate.setUTCDate(this.day || 1);
      initialDate.setUTCHours(this.hour || 0);
      initialDate.setUTCMinutes(this.minute || 0);
      initialDate.setUTCSeconds(this.second || 0);
      initialDate.setUTCMilliseconds((this.fractionalSecond || 0) * 1000);
      var timezoneOffset = -60000 * (this.timezone || 0);
      this.date = new Date(initialDate.getTime() + timezoneOffset);
    },
    CLASS_NAME: "Jsonix.XML.Calendar"
  });
  Jsonix.XML.Calendar.MIN_TIMEZONE = -14 * 60;
  Jsonix.XML.Calendar.MAX_TIMEZONE = 14 * 60;
  Jsonix.XML.Calendar.DAYS_IN_MONTH = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  Jsonix.XML.Calendar.fromObject = function (object) {
    Jsonix.Util.Ensure.ensureObject(object);

    if (Jsonix.Util.Type.isString(object.CLASS_NAME) && object.CLASS_NAME === 'Jsonix.XML.Calendar') {
      return object;
    }

    return new Jsonix.XML.Calendar(object);
  };

  Jsonix.XML.Calendar.validateYear = function (year) {
    if (year === 0) {
      throw new Error('Invalid year [' + year + ']. Year must not be [0].');
    }
  };

  Jsonix.XML.Calendar.validateMonth = function (month) {
    if (month < 1 || month > 12) {
      throw new Error('Invalid month [' + month + ']. Month must be in range [1, 12].');
    }
  };

  Jsonix.XML.Calendar.validateDay = function (day) {
    if (day < 1 || day > 31) {
      throw new Error('Invalid day [' + day + ']. Day must be in range [1, 31].');
    }
  };

  Jsonix.XML.Calendar.validateMonthDay = function (month, day) {
    Jsonix.XML.Calendar.validateMonth(month);
    var maxDaysInMonth = Jsonix.XML.Calendar.DAYS_IN_MONTH[month - 1];

    if (day < 1 || day > Jsonix.XML.Calendar.DAYS_IN_MONTH[month - 1]) {
      throw new Error('Invalid day [' + day + ']. Day must be in range [1, ' + maxDaysInMonth + '].');
    }
  };

  Jsonix.XML.Calendar.validateYearMonthDay = function (year, month, day) {
    // #93 TODO proper validation of 28/29 02
    Jsonix.XML.Calendar.validateYear(year);
    Jsonix.XML.Calendar.validateMonthDay(month, day);
  };

  Jsonix.XML.Calendar.validateHour = function (hour) {
    if (hour < 0 || hour > 23) {
      throw new Error('Invalid hour [' + hour + ']. Hour must be in range [0, 23].');
    }
  };

  Jsonix.XML.Calendar.validateMinute = function (minute) {
    if (minute < 0 || minute > 59) {
      throw new Error('Invalid minute [' + minute + ']. Minute must be in range [0, 59].');
    }
  };

  Jsonix.XML.Calendar.validateSecond = function (second) {
    if (second < 0 || second > 59) {
      throw new Error('Invalid second [' + second + ']. Second must be in range [0, 59].');
    }
  };

  Jsonix.XML.Calendar.validateFractionalSecond = function (fractionalSecond) {
    if (fractionalSecond < 0 || fractionalSecond > 59) {
      throw new Error('Invalid fractional second [' + fractionalSecond + ']. Fractional second must be in range [0, 1).');
    }
  };

  Jsonix.XML.Calendar.validateTimezone = function (timezone) {
    if (timezone < Jsonix.XML.Calendar.MIN_TIMEZONE || timezone > Jsonix.XML.Calendar.MAX_TIMEZONE) {
      throw new Error('Invalid timezone [' + timezone + ']. Timezone must not be in range [' + Jsonix.XML.Calendar.MIN_TIMEZONE + ', ' + Jsonix.XML.Calendar.MAX_TIMEZONE + '].');
    }
  };

  Jsonix.XML.Input = Jsonix.Class({
    root: null,
    node: null,
    attributes: null,
    eventType: null,
    pns: null,
    initialize: function initialize(node) {
      Jsonix.Util.Ensure.ensureExists(node);
      this.root = node;
      var rootPnsItem = {
        '': ''
      };
      rootPnsItem[Jsonix.XML.XMLNS_P] = Jsonix.XML.XMLNS_NS;
      this.pns = [rootPnsItem];
    },
    hasNext: function hasNext() {
      // No current node, we've not started yet
      if (this.node === null) {
        return true;
      } else if (this.node === this.root) {
        var nodeType = this.node.nodeType; // Root node is document, last event type is END_DOCUMENT

        if (nodeType === 9 && this.eventType === 8) {
          return false;
        } // Root node is element, last event type is END_ELEMENT
        else if (nodeType === 1 && this.eventType === 2) {
            return false;
          } else {
            return true;
          }
      } else {
        return true;
      }
    },
    next: function next() {
      if (this.eventType === null) {
        return this.enter(this.root);
      } // START_DOCUMENT


      if (this.eventType === 7) {
        var documentElement = this.node.documentElement;

        if (documentElement) {
          return this.enter(documentElement);
        } else {
          return this.leave(this.node);
        }
      } else if (this.eventType === 1) {
        var firstChild = this.node.firstChild;

        if (firstChild) {
          return this.enter(firstChild);
        } else {
          return this.leave(this.node);
        }
      } else if (this.eventType === 2) {
        var nextSibling = this.node.nextSibling;

        if (nextSibling) {
          return this.enter(nextSibling);
        } else {
          return this.leave(this.node);
        }
      } else {
        return this.leave(this.node);
      }
    },
    enter: function enter(node) {
      var nodeType = node.nodeType;
      this.node = node;
      this.attributes = null; // Document node

      if (nodeType === 1) {
        // START_ELEMENT
        this.eventType = 1;
        this.pushNS(node);
        return this.eventType;
      } else if (nodeType === 2) {
        // ATTRIBUTE
        this.eventType = 10;
        return this.eventType;
      } else if (nodeType === 3) {
        var nodeValue = node.nodeValue;

        if (Jsonix.Util.StringUtils.isEmpty(nodeValue)) {
          // SPACE
          this.eventType = 6;
        } else {
          // CHARACTERS
          this.eventType = 4;
        }

        return this.eventType;
      } else if (nodeType === 4) {
        // CDATA
        this.eventType = 12;
        return this.eventType;
      } else if (nodeType === 5) {
        // ENTITY_REFERENCE_NODE = 5
        // ENTITY_REFERENCE
        this.eventType = 9;
        return this.eventType;
      } else if (nodeType === 6) {
        // ENTITY_DECLARATION
        this.eventType = 15;
        return this.eventType;
      } else if (nodeType === 7) {
        // PROCESSING_INSTRUCTION
        this.eventType = 3;
        return this.eventType;
      } else if (nodeType === 8) {
        // COMMENT
        this.eventType = 5;
        return this.eventType;
      } else if (nodeType === 9) {
        // START_DOCUMENT
        this.eventType = 7;
        return this.eventType;
      } else if (nodeType === 10) {
        // DTD
        this.eventType = 12;
        return this.eventType;
      } else if (nodeType === 12) {
        // NOTATION_DECLARATION
        this.eventType = 14;
        return this.eventType;
      } else {
        // DOCUMENT_FRAGMENT_NODE = 11
        throw new Error("Node type [" + nodeType + '] is not supported.');
      }
    },
    leave: function leave(node) {
      if (node.nodeType === 9) {
        if (this.eventType == 8) {
          throw new Error("Invalid state.");
        } else {
          this.node = node;
          this.attributes = null; // END_ELEMENT

          this.eventType = 8;
          return this.eventType;
        }
      } else if (node.nodeType === 1) {
        if (this.eventType == 2) {
          var nextSibling = node.nextSibling;

          if (nextSibling) {
            return this.enter(nextSibling);
          }
        } else {
          this.node = node;
          this.attributes = null; // END_ELEMENT

          this.eventType = 2;
          this.popNS();
          return this.eventType;
        }
      }

      var nextSibling1 = node.nextSibling;

      if (nextSibling1) {
        return this.enter(nextSibling1);
      } else {
        var parentNode = node.parentNode;
        this.node = parentNode;
        this.attributes = null;

        if (parentNode.nodeType === 9) {
          this.eventType = 8;
        } else {
          this.eventType = 2;
        }

        return this.eventType;
      }
    },
    getName: function getName() {
      var node = this.node;

      if (Jsonix.Util.Type.isString(node.nodeName)) {
        if (Jsonix.Util.Type.isString(node.namespaceURI)) {
          return new Jsonix.XML.QName(node.namespaceURI, node.nodeName);
        } else {
          return new Jsonix.XML.QName(node.nodeName);
        }
      } else {
        return null;
      }
    },
    getNameKey: function getNameKey() {
      var node = this.node;

      if (Jsonix.Util.Type.isString(node.nodeName)) {
        return Jsonix.XML.QName.key(node.namespaceURI, node.nodeName);
      } else {
        return null;
      }
    },
    getText: function getText() {
      return this.node.nodeValue;
    },
    nextTag: function nextTag() {
      var et = this.next(); // TODO isWhiteSpace

      while (et === 7 || et === 4 || et === 12 || et === 6 || et === 3 || et === 5) {
        et = this.next();
      }

      if (et !== 1 && et !== 2) {
        // TODO location
        throw new Error('Expected start or end tag.');
      }

      return et;
    },
    skipElement: function skipElement() {
      if (this.eventType !== Jsonix.XML.Input.START_ELEMENT) {
        throw new Error("Parser must be on START_ELEMENT to skip element.");
      }

      var numberOfOpenTags = 1;
      var et;

      do {
        et = this.nextTag();
        numberOfOpenTags += et === Jsonix.XML.Input.START_ELEMENT ? 1 : -1;
      } while (numberOfOpenTags > 0);

      return et;
    },
    getElementText: function getElementText() {
      if (this.eventType != 1) {
        throw new Error("Parser must be on START_ELEMENT to read next text.");
      }

      var et = this.next();
      var content = '';

      while (et !== 2) {
        if (et === 4 || et === 12 || et === 6 || et === 9) {
          content = content + this.getText();
        } else if (et === 3 || et === 5) {// Skip PI or comment
        } else if (et === 8) {
          // End document
          throw new Error("Unexpected end of document when reading element text content.");
        } else if (et === 1) {
          // End element
          // TODO location
          throw new Error("Element text content may not contain START_ELEMENT.");
        } else {
          // TODO location
          throw new Error("Unexpected event type [" + et + "].");
        }

        et = this.next();
      }

      return content;
    },
    retrieveElement: function retrieveElement() {
      var element;

      if (this.eventType === 1) {
        element = this.node;
      } else if (this.eventType === 10) {
        element = this.node.parentNode;
      } else {
        throw new Error("Element can only be retrieved for START_ELEMENT or ATTRIBUTE nodes.");
      }

      return element;
    },
    retrieveAttributes: function retrieveAttributes() {
      var attributes;

      if (this.attributes) {
        attributes = this.attributes;
      } else if (this.eventType === 1) {
        attributes = this.node.attributes;
        this.attributes = attributes;
      } else if (this.eventType === 10) {
        attributes = this.node.parentNode.attributes;
        this.attributes = attributes;
      } else {
        throw new Error("Attributes can only be retrieved for START_ELEMENT or ATTRIBUTE nodes.");
      }

      return attributes;
    },
    getAttributeCount: function getAttributeCount() {
      var attributes = this.retrieveAttributes();
      return attributes.length;
    },
    getAttributeName: function getAttributeName(index) {
      var attributes = this.retrieveAttributes();

      if (index < 0 || index >= attributes.length) {
        throw new Error("Invalid attribute index [" + index + "].");
      }

      var attribute = attributes[index];

      if (Jsonix.Util.Type.isString(attribute.namespaceURI)) {
        return new Jsonix.XML.QName(attribute.namespaceURI, attribute.nodeName);
      } else {
        return new Jsonix.XML.QName(attribute.nodeName);
      }
    },
    getAttributeNameKey: function getAttributeNameKey(index) {
      var attributes = this.retrieveAttributes();

      if (index < 0 || index >= attributes.length) {
        throw new Error("Invalid attribute index [" + index + "].");
      }

      var attribute = attributes[index];
      return Jsonix.XML.QName.key(attribute.namespaceURI, attribute.nodeName);
    },
    getAttributeValue: function getAttributeValue(index) {
      var attributes = this.retrieveAttributes();

      if (index < 0 || index >= attributes.length) {
        throw new Error("Invalid attribute index [" + index + "].");
      }

      var attribute = attributes[index];
      return attribute.value;
    },
    getAttributeValueNS: null,
    getAttributeValueNSViaElement: function getAttributeValueNSViaElement(namespaceURI, localPart) {
      var element = this.retrieveElement();
      return element.getAttributeNS(namespaceURI, localPart);
    },
    getAttributeValueNSViaAttribute: function getAttributeValueNSViaAttribute(namespaceURI, localPart) {
      var attributeNode = this.getAttributeNodeNS(namespaceURI, localPart);

      if (Jsonix.Util.Type.exists(attributeNode)) {
        return attributeNode.nodeValue;
      } else {
        return null;
      }
    },
    getAttributeNodeNS: null,
    getAttributeNodeNSViaElement: function getAttributeNodeNSViaElement(namespaceURI, localPart) {
      var element = this.retrieveElement();
      return element.getAttributeNodeNS(namespaceURI, localPart);
    },
    getAttributeNodeNSViaAttributes: function getAttributeNodeNSViaAttributes(namespaceURI, localPart) {
      var attributeNode = null;
      var attributes = this.retrieveAttributes();
      var potentialNode, fullName;

      for (var i = 0, len = attributes.length; i < len; ++i) {
        potentialNode = attributes[i];

        if (potentialNode.namespaceURI === namespaceURI) {
          fullName = potentialNode.prefix ? potentialNode.prefix + ':' + localPart : localPart;

          if (fullName === potentialNode.nodeName) {
            attributeNode = potentialNode;
            break;
          }
        }
      }

      return attributeNode;
    },
    getElement: function getElement() {
      if (this.eventType === 1 || this.eventType === 2) {
        // Go to the END_ELEMENT
        this.eventType = 2;
        return this.node;
      } else {
        throw new Error("Parser must be on START_ELEMENT or END_ELEMENT to return current element.");
      }
    },
    pushNS: function pushNS(node) {
      var pindex = this.pns.length - 1;
      var parentPnsItem = this.pns[pindex];
      var pnsItem = Jsonix.Util.Type.isObject(parentPnsItem) ? pindex : parentPnsItem;
      this.pns.push(pnsItem);
      pindex++;
      var reference = true;

      if (node.attributes) {
        var attributes = node.attributes;
        var alength = attributes.length;

        if (alength > 0) {
          // If given node has attributes
          for (var aindex = 0; aindex < alength; aindex++) {
            var attribute = attributes[aindex];
            var attributeName = attribute.nodeName;
            var p = null;
            var ns = null;
            var isNS = false;

            if (attributeName === 'xmlns') {
              p = '';
              ns = attribute.value;
              isNS = true;
            } else if (attributeName.substring(0, 6) === 'xmlns:') {
              p = attributeName.substring(6);
              ns = attribute.value;
              isNS = true;
            } // Attribute is a namespace declaration


            if (isNS) {
              if (reference) {
                pnsItem = Jsonix.Util.Type.cloneObject(this.pns[pnsItem], {});
                this.pns[pindex] = pnsItem;
                reference = false;
              }

              pnsItem[p] = ns;
            }
          }
        }
      }
    },
    popNS: function popNS() {
      this.pns.pop();
    },
    getNamespaceURI: function getNamespaceURI(p) {
      var pindex = this.pns.length - 1;
      var pnsItem = this.pns[pindex];
      pnsItem = Jsonix.Util.Type.isObject(pnsItem) ? pnsItem : this.pns[pnsItem];
      return pnsItem[p];
    },
    CLASS_NAME: "Jsonix.XML.Input"
  });
  Jsonix.XML.Input.prototype.getAttributeValueNS = Jsonix.DOM.isDomImplementationAvailable() ? Jsonix.XML.Input.prototype.getAttributeValueNSViaElement : Jsonix.XML.Input.prototype.getAttributeValueNSViaAttribute;
  Jsonix.XML.Input.prototype.getAttributeNodeNS = Jsonix.DOM.isDomImplementationAvailable() ? Jsonix.XML.Input.prototype.getAttributeNodeNSViaElement : Jsonix.XML.Input.prototype.getAttributeNodeNSViaAttributes;
  Jsonix.XML.Input.START_ELEMENT = 1;
  Jsonix.XML.Input.END_ELEMENT = 2;
  Jsonix.XML.Input.PROCESSING_INSTRUCTION = 3;
  Jsonix.XML.Input.CHARACTERS = 4;
  Jsonix.XML.Input.COMMENT = 5;
  Jsonix.XML.Input.SPACE = 6;
  Jsonix.XML.Input.START_DOCUMENT = 7;
  Jsonix.XML.Input.END_DOCUMENT = 8;
  Jsonix.XML.Input.ENTITY_REFERENCE = 9;
  Jsonix.XML.Input.ATTRIBUTE = 10;
  Jsonix.XML.Input.DTD = 11;
  Jsonix.XML.Input.CDATA = 12;
  Jsonix.XML.Input.NAMESPACE = 13;
  Jsonix.XML.Input.NOTATION_DECLARATION = 14;
  Jsonix.XML.Input.ENTITY_DECLARATION = 15;
  Jsonix.XML.Output = Jsonix.Class({
    document: null,
    documentElement: null,
    node: null,
    nodes: null,
    nsp: null,
    pns: null,
    namespacePrefixIndex: 0,
    xmldom: null,
    initialize: function initialize(options) {
      // REWORK
      if (typeof ActiveXObject !== 'undefined') {
        this.xmldom = new ActiveXObject("Microsoft.XMLDOM");
      } else {
        this.xmldom = null;
      }

      this.nodes = [];
      var rootNspItem = {
        '': ''
      };
      rootNspItem[Jsonix.XML.XMLNS_NS] = Jsonix.XML.XMLNS_P;

      if (Jsonix.Util.Type.isObject(options)) {
        if (Jsonix.Util.Type.isObject(options.namespacePrefixes)) {
          Jsonix.Util.Type.cloneObject(options.namespacePrefixes, rootNspItem);
        }
      }

      this.nsp = [rootNspItem];
      var rootPnsItem = {
        '': ''
      };
      rootPnsItem[Jsonix.XML.XMLNS_P] = Jsonix.XML.XMLNS_NS;
      this.pns = [rootPnsItem];
    },
    destroy: function destroy() {
      this.xmldom = null;
    },
    writeStartDocument: function writeStartDocument() {
      // TODO Check
      var doc = Jsonix.DOM.createDocument();
      this.document = doc;
      return this.push(doc);
    },
    writeEndDocument: function writeEndDocument() {
      return this.pop();
    },
    writeStartElement: function writeStartElement(name) {
      Jsonix.Util.Ensure.ensureObject(name);
      var localPart = name.localPart || name.lp || null;
      Jsonix.Util.Ensure.ensureString(localPart);
      var ns = name.namespaceURI || name.ns || null;
      var namespaceURI = Jsonix.Util.Type.isString(ns) ? ns : '';
      var p = name.prefix || name.p;
      var prefix = this.getPrefix(namespaceURI, p);
      var qualifiedName = !prefix ? localPart : prefix + ':' + localPart;
      var element;

      if (Jsonix.Util.Type.isFunction(this.document.createElementNS)) {
        element = this.document.createElementNS(namespaceURI, qualifiedName);
      } else if (this.xmldom) {
        element = this.xmldom.createNode(1, qualifiedName, namespaceURI);
      } else {
        throw new Error("Could not create an element node.");
      }

      this.peek().appendChild(element);
      this.push(element);
      this.declareNamespace(namespaceURI, prefix);

      if (this.documentElement === null) {
        this.documentElement = element;
        this.declareNamespaces();
      }

      return element;
    },
    writeEndElement: function writeEndElement() {
      return this.pop();
    },
    writeCharacters: function writeCharacters(text) {
      var node;

      if (Jsonix.Util.Type.isFunction(this.document.createTextNode)) {
        node = this.document.createTextNode(text);
      } else if (this.xmldom) {
        node = this.xmldom.createTextNode(text);
      } else {
        throw new Error("Could not create a text node.");
      }

      this.peek().appendChild(node);
      return node;
    },
    writeCdata: function writeCdata(text) {
      var parts = text.split(']]>');

      for (var index = 0; index < parts.length; index++) {
        if (index + 1 < parts.length) {
          parts[index] = parts[index] + ']]';
          parts[index + 1] = '>' + parts[index + 1];
        }
      }

      var node;

      for (var jndex = 0; jndex < parts.length; jndex++) {
        node = this.writeCdataWithoutCdend(parts[jndex]);
      }

      return node;
    },
    writeCdataWithoutCdend: function writeCdataWithoutCdend(text) {
      var node;

      if (Jsonix.Util.Type.isFunction(this.document.createCDATASection)) {
        node = this.document.createCDATASection(text);
      } else if (this.xmldom) {
        node = this.xmldom.createCDATASection(text);
      } else {
        throw new Error("Could not create a CDATA section node.");
      }

      this.peek().appendChild(node);
      return node;
    },
    writeAttribute: function writeAttribute(name, value) {
      Jsonix.Util.Ensure.ensureString(value);
      Jsonix.Util.Ensure.ensureObject(name);
      var localPart = name.localPart || name.lp || null;
      Jsonix.Util.Ensure.ensureString(localPart);
      var ns = name.namespaceURI || name.ns || null;
      var namespaceURI = Jsonix.Util.Type.isString(ns) ? ns : '';
      var p = name.prefix || name.p || null;
      var prefix = this.getPrefix(namespaceURI, p);
      var qualifiedName = !prefix ? localPart : prefix + ':' + localPart;
      var node = this.peek();

      if (namespaceURI === '') {
        node.setAttribute(qualifiedName, value);
      } else {
        if (node.setAttributeNS) {
          node.setAttributeNS(namespaceURI, qualifiedName, value);
        } else {
          if (this.xmldom) {
            var attribute = this.document.createNode(2, qualifiedName, namespaceURI);
            attribute.nodeValue = value;
            node.setAttributeNode(attribute);
          } else if (namespaceURI === Jsonix.XML.XMLNS_NS) {
            // XMLNS namespace may be processed unqualified
            node.setAttribute(qualifiedName, value);
          } else {
            throw new Error("The [setAttributeNS] method is not implemented");
          }
        }

        this.declareNamespace(namespaceURI, prefix);
      }
    },
    writeNode: function writeNode(node) {
      var importedNode;

      if (Jsonix.Util.Type.exists(this.document.importNode)) {
        importedNode = this.document.importNode(node, true);
      } else {
        importedNode = node;
      }

      this.peek().appendChild(importedNode);
      return importedNode;
    },
    push: function push(node) {
      this.nodes.push(node);
      this.pushNS();
      return node;
    },
    peek: function peek() {
      return this.nodes[this.nodes.length - 1];
    },
    pop: function pop() {
      this.popNS();
      var result = this.nodes.pop();
      return result;
    },
    pushNS: function pushNS() {
      var nindex = this.nsp.length - 1;
      var pindex = this.pns.length - 1;
      var parentNspItem = this.nsp[nindex];
      var parentPnsItem = this.pns[pindex];
      var nspItem = Jsonix.Util.Type.isObject(parentNspItem) ? nindex : parentNspItem;
      var pnsItem = Jsonix.Util.Type.isObject(parentPnsItem) ? pindex : parentPnsItem;
      this.nsp.push(nspItem);
      this.pns.push(pnsItem);
    },
    popNS: function popNS() {
      this.nsp.pop();
      this.pns.pop();
    },
    declareNamespaces: function declareNamespaces() {
      var index = this.nsp.length - 1;
      var nspItem = this.nsp[index];
      nspItem = Jsonix.Util.Type.isNumber(nspItem) ? this.nsp[nspItem] : nspItem;
      var ns, p;

      for (ns in nspItem) {
        if (nspItem.hasOwnProperty(ns)) {
          p = nspItem[ns];
          this.declareNamespace(ns, p);
        }
      }
    },
    declareNamespace: function declareNamespace(ns, p) {
      var index = this.pns.length - 1;
      var pnsItem = this.pns[index];
      var reference;

      if (Jsonix.Util.Type.isNumber(pnsItem)) {
        // Resolve the reference
        reference = true;
        pnsItem = this.pns[pnsItem];
      } else {
        reference = false;
      } // If this prefix is mapped to a different namespace and must be redeclared


      if (pnsItem[p] !== ns) {
        if (p === '') {
          this.writeAttribute({
            lp: Jsonix.XML.XMLNS_P
          }, ns);
        } else {
          this.writeAttribute({
            ns: Jsonix.XML.XMLNS_NS,
            lp: p,
            p: Jsonix.XML.XMLNS_P
          }, ns);
        }

        if (reference) {
          // If this was a reference, clone it and replace the reference
          pnsItem = Jsonix.Util.Type.cloneObject(pnsItem, {});
          this.pns[index] = pnsItem;
        }

        pnsItem[p] = ns;
      }
    },
    getPrefix: function getPrefix(ns, p) {
      var index = this.nsp.length - 1;
      var nspItem = this.nsp[index];
      var reference;

      if (Jsonix.Util.Type.isNumber(nspItem)) {
        // This is a reference, the item is the index of the parent item
        reference = true;
        nspItem = this.nsp[nspItem];
      } else {
        reference = false;
      }

      if (Jsonix.Util.Type.isString(p)) {
        var oldp = nspItem[ns]; // If prefix is already declared and equals the proposed prefix

        if (p === oldp) {// Nothing to do
        } else {
          // If this was a reference, we have to clone it now
          if (reference) {
            nspItem = Jsonix.Util.Type.cloneObject(nspItem, {});
            this.nsp[index] = nspItem;
          }

          nspItem[ns] = p;
        }
      } else {
        p = nspItem[ns];

        if (!Jsonix.Util.Type.exists(p)) {
          p = 'p' + this.namespacePrefixIndex++; // If this was a reference, we have to clone it now

          if (reference) {
            nspItem = Jsonix.Util.Type.cloneObject(nspItem, {});
            this.nsp[index] = nspItem;
          }

          nspItem[ns] = p;
        }
      }

      return p;
    },
    getNamespaceURI: function getNamespaceURI(p) {
      var pindex = this.pns.length - 1;
      var pnsItem = this.pns[pindex];
      pnsItem = Jsonix.Util.Type.isObject(pnsItem) ? pnsItem : this.pns[pnsItem];
      return pnsItem[p];
    },
    CLASS_NAME: "Jsonix.XML.Output"
  });
  Jsonix.Mapping = {};
  Jsonix.Mapping.Style = Jsonix.Class({
    marshaller: null,
    unmarshaller: null,
    module: null,
    elementInfo: null,
    classInfo: null,
    enumLeafInfo: null,
    anyAttributePropertyInfo: null,
    anyElementPropertyInfo: null,
    attributePropertyInfo: null,
    elementMapPropertyInfo: null,
    elementPropertyInfo: null,
    elementsPropertyInfo: null,
    elementRefPropertyInfo: null,
    elementRefsPropertyInfo: null,
    valuePropertyInfo: null,
    initialize: function initialize() {},
    CLASS_NAME: 'Jsonix.Mapping.Style'
  });
  Jsonix.Mapping.Style.STYLES = {};
  Jsonix.Mapping.Styled = Jsonix.Class({
    mappingStyle: null,
    initialize: function initialize(options) {
      if (Jsonix.Util.Type.exists(options)) {
        Jsonix.Util.Ensure.ensureObject(options);

        if (Jsonix.Util.Type.isString(options.mappingStyle)) {
          var mappingStyle = Jsonix.Mapping.Style.STYLES[options.mappingStyle];

          if (!mappingStyle) {
            throw new Error("Mapping style [" + options.mappingStyle + "] is not known.");
          }

          this.mappingStyle = mappingStyle;
        } else if (Jsonix.Util.Type.isObject(options.mappingStyle)) {
          this.mappingStyle = options.mappingStyle;
        }
      }

      if (!this.mappingStyle) {
        this.mappingStyle = Jsonix.Mapping.Style.STYLES.standard;
      }
    },
    CLASS_NAME: 'Jsonix.Mapping.Styled'
  });
  Jsonix.Binding = {};
  Jsonix.Binding.Marshalls = {};
  Jsonix.Binding.Marshalls.Element = Jsonix.Class({
    marshalElement: function marshalElement(value, context, output, scope) {
      var elementValue = this.convertToTypedNamedValue(value, context, output, scope);
      var declaredTypeInfo = elementValue.typeInfo;
      var actualTypeInfo = undefined;

      if (context.supportXsiType && Jsonix.Util.Type.exists(elementValue.value)) {
        var typeInfoByValue = context.getTypeInfoByValue(elementValue.value);

        if (typeInfoByValue && typeInfoByValue.typeName) {
          actualTypeInfo = typeInfoByValue;
        }
      }

      var typeInfo = actualTypeInfo || declaredTypeInfo;

      if (typeInfo) {
        output.writeStartElement(elementValue.name);

        if (actualTypeInfo && declaredTypeInfo !== actualTypeInfo) {
          var xsiTypeName = actualTypeInfo.typeName;
          var xsiType = Jsonix.Schema.XSD.QName.INSTANCE.print(xsiTypeName, context, output, scope);
          output.writeAttribute(Jsonix.Schema.XSI.TYPE_QNAME, xsiType);
        }

        if (Jsonix.Util.Type.exists(elementValue.value)) {
          typeInfo.marshal(elementValue.value, context, output, scope);
        }

        output.writeEndElement();
      } else {
        throw new Error("Element [" + elementValue.name.key + "] is not known in this context, could not determine its type.");
      }
    },
    getTypeInfoByElementName: function getTypeInfoByElementName(name, context, scope) {
      var elementInfo = context.getElementInfo(name, scope);

      if (Jsonix.Util.Type.exists(elementInfo)) {
        return elementInfo.typeInfo;
      } else {
        return undefined;
      }
    }
  });
  Jsonix.Binding.Marshalls.Element.AsElementRef = Jsonix.Class({
    convertToTypedNamedValue: function convertToTypedNamedValue(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureObject(value);
      var elementValue = this.convertToNamedValue(value, context, output, scope);
      return {
        name: elementValue.name,
        value: elementValue.value,
        typeInfo: this.getTypeInfoByElementName(elementValue.name, context, scope)
      };
    },
    convertToNamedValue: function convertToNamedValue(elementValue, context, output, scope) {
      var name;
      var value;

      if (Jsonix.Util.Type.exists(elementValue.name) && !Jsonix.Util.Type.isUndefined(elementValue.value)) {
        name = Jsonix.XML.QName.fromObjectOrString(elementValue.name, context);
        value = Jsonix.Util.Type.exists(elementValue.value) ? elementValue.value : null;
        return {
          name: name,
          value: value
        };
      } else {
        for (var propertyName in elementValue) {
          if (elementValue.hasOwnProperty(propertyName)) {
            name = Jsonix.XML.QName.fromObjectOrString(propertyName, context);
            value = elementValue[propertyName];
            return {
              name: name,
              value: value
            };
          }
        }
      }

      throw new Error("Invalid element value [" + elementValue + "]. Element values must either have {name:'myElementName', value: elementValue} or {myElementName:elementValue} structure.");
    }
  });
  Jsonix.Binding.Unmarshalls = {};
  Jsonix.Binding.Unmarshalls.WrapperElement = Jsonix.Class({
    mixed: false,
    unmarshalWrapperElement: function unmarshalWrapperElement(context, input, scope, callback) {
      var et = input.next();

      while (et !== Jsonix.XML.Input.END_ELEMENT) {
        if (et === Jsonix.XML.Input.START_ELEMENT) {
          this.unmarshalElement(context, input, scope, callback);
        } else // Characters
          if (this.mixed && (et === Jsonix.XML.Input.CHARACTERS || et === Jsonix.XML.Input.CDATA || et === Jsonix.XML.Input.ENTITY_REFERENCE)) {
            callback(input.getText());
          } else if (et === Jsonix.XML.Input.SPACE || et === Jsonix.XML.Input.COMMENT || et === Jsonix.XML.Input.PROCESSING_INSTRUCTION) {// Skip whitespace
          } else {
            throw new Error("Illegal state: unexpected event type [" + et + "].");
          }

        et = input.next();
      }
    }
  });
  Jsonix.Binding.Unmarshalls.Element = Jsonix.Class({
    allowTypedObject: true,
    allowDom: false,
    unmarshalElement: function unmarshalElement(context, input, scope, callback) {
      if (input.eventType != 1) {
        throw new Error("Parser must be on START_ELEMENT to read next element.");
      }

      var typeInfo = this.getTypeInfoByInputElement(context, input, scope);
      var name = input.getName();
      var elementValue;

      if (this.allowTypedObject) {
        if (Jsonix.Util.Type.exists(typeInfo)) {
          var value = typeInfo.unmarshal(context, input, scope);
          var typedNamedValue = {
            name: name,
            value: value,
            typeInfo: typeInfo
          };
          elementValue = this.convertFromTypedNamedValue(typedNamedValue, context, input, scope);
        } else if (this.allowDom) {
          elementValue = input.getElement();
        } else {
          throw new Error("Element [" + name.toString() + "] could not be unmarshalled as is not known in this context and the property does not allow DOM content.");
        }
      } else if (this.allowDom) {
        elementValue = input.getElement();
      } else {
        throw new Error("Element [" + name.toString() + "] could not be unmarshalled as the property neither allows typed objects nor DOM as content. This is a sign of invalid mappings, do not use [allowTypedObject : false] and [allowDom : false] at the same time.");
      }

      callback(elementValue);
    },
    getTypeInfoByInputElement: function getTypeInfoByInputElement(context, input, scope) {
      var xsiTypeInfo = null;

      if (context.supportXsiType) {
        var xsiType = input.getAttributeValueNS(Jsonix.Schema.XSI.NAMESPACE_URI, Jsonix.Schema.XSI.TYPE);

        if (Jsonix.Util.StringUtils.isNotBlank(xsiType)) {
          var xsiTypeName = Jsonix.Schema.XSD.QName.INSTANCE.parse(xsiType, context, input, scope);
          xsiTypeInfo = context.getTypeInfoByTypeNameKey(xsiTypeName.key);
        }
      }

      var name = input.getName();
      var typeInfo = xsiTypeInfo ? xsiTypeInfo : this.getTypeInfoByElementName(name, context, scope);
      return typeInfo;
    },
    getTypeInfoByElementName: function getTypeInfoByElementName(name, context, scope) {
      var elementInfo = context.getElementInfo(name, scope);

      if (Jsonix.Util.Type.exists(elementInfo)) {
        return elementInfo.typeInfo;
      } else {
        return undefined;
      }
    }
  });
  Jsonix.Binding.Unmarshalls.Element.AsElementRef = Jsonix.Class({
    convertFromTypedNamedValue: function convertFromTypedNamedValue(typedNamedValue, context, input, scope) {
      return {
        name: typedNamedValue.name,
        value: typedNamedValue.value
      };
    }
  });
  Jsonix.Binding.Unmarshalls.Element.AsSimplifiedElementRef = Jsonix.Class({
    convertFromTypedNamedValue: function convertFromTypedNamedValue(typedNamedValue, context, input, scope) {
      var propertyName = typedNamedValue.name.toCanonicalString(context);
      var value = {};
      value[propertyName] = typedNamedValue.value;
      return value;
    }
  });
  Jsonix.Binding.Marshaller = Jsonix.Class(Jsonix.Binding.Marshalls.Element, Jsonix.Binding.Marshalls.Element.AsElementRef, {
    context: null,
    initialize: function initialize(context) {
      Jsonix.Util.Ensure.ensureObject(context);
      this.context = context;
    },
    marshalString: function marshalString(value) {
      var doc = this.marshalDocument(value);
      var text = Jsonix.DOM.serialize(doc);
      return text;
    },
    marshalDocument: function marshalDocument(value) {
      var output = new Jsonix.XML.Output({
        namespacePrefixes: this.context.namespacePrefixes
      });
      var doc = output.writeStartDocument();
      this.marshalElement(value, this.context, output, undefined);
      output.writeEndDocument();
      return doc;
    },
    CLASS_NAME: 'Jsonix.Binding.Marshaller'
  });
  Jsonix.Binding.Marshaller.Simplified = Jsonix.Class(Jsonix.Binding.Marshaller, {
    CLASS_NAME: 'Jsonix.Binding.Marshaller.Simplified'
  });
  Jsonix.Binding.Unmarshaller = Jsonix.Class(Jsonix.Binding.Unmarshalls.Element, Jsonix.Binding.Unmarshalls.Element.AsElementRef, {
    context: null,
    allowTypedObject: true,
    allowDom: false,
    initialize: function initialize(context) {
      Jsonix.Util.Ensure.ensureObject(context);
      this.context = context;
    },
    unmarshalString: function unmarshalString(text) {
      Jsonix.Util.Ensure.ensureString(text);
      var doc = Jsonix.DOM.parse(text);
      return this.unmarshalDocument(doc);
    },
    unmarshalURL: function unmarshalURL(url, callback, options) {
      Jsonix.Util.Ensure.ensureString(url);
      Jsonix.Util.Ensure.ensureFunction(callback);

      if (Jsonix.Util.Type.exists(options)) {
        Jsonix.Util.Ensure.ensureObject(options);
      }

      that = this;
      Jsonix.DOM.load(url, function (doc) {
        callback(that.unmarshalDocument(doc));
      }, options);
    },
    unmarshalFile: function unmarshalFile(fileName, callback, options) {
      if (typeof _jsonix_fs === 'undefined') {
        throw new Error("File unmarshalling is only available in environments which support file systems.");
      }

      Jsonix.Util.Ensure.ensureString(fileName);
      Jsonix.Util.Ensure.ensureFunction(callback);

      if (Jsonix.Util.Type.exists(options)) {
        Jsonix.Util.Ensure.ensureObject(options);
      }

      that = this;
      var fs = _jsonix_fs;
      fs.readFile(fileName, options, function (err, data) {
        if (err) {
          throw err;
        } else {
          var text = data.toString();
          var doc = Jsonix.DOM.parse(text);
          callback(that.unmarshalDocument(doc));
        }
      });
    },
    unmarshalDocument: function unmarshalDocument(doc, scope) {
      var input = new Jsonix.XML.Input(doc);
      var result = null;

      var callback = function callback(_result) {
        result = _result;
      };

      input.nextTag();
      this.unmarshalElement(this.context, input, scope, callback);
      return result;
    },
    CLASS_NAME: 'Jsonix.Binding.Unmarshaller'
  });
  Jsonix.Binding.Unmarshaller.Simplified = Jsonix.Class(Jsonix.Binding.Unmarshaller, Jsonix.Binding.Unmarshalls.Element.AsSimplifiedElementRef, {
    CLASS_NAME: 'Jsonix.Binding.Unmarshaller.Simplified'
  });
  Jsonix.Model.TypeInfo = Jsonix.Class({
    module: null,
    name: null,
    baseTypeInfo: null,
    initialize: function initialize() {},
    isBasedOn: function isBasedOn(typeInfo) {
      var currentTypeInfo = this;

      while (currentTypeInfo) {
        if (typeInfo === currentTypeInfo) {
          return true;
        }

        currentTypeInfo = currentTypeInfo.baseTypeInfo;
      }

      return false;
    },
    CLASS_NAME: 'Jsonix.Model.TypeInfo'
  });
  Jsonix.Model.ClassInfo = Jsonix.Class(Jsonix.Model.TypeInfo, Jsonix.Mapping.Styled, {
    name: null,
    localName: null,
    typeName: null,
    instanceFactory: null,
    properties: null,
    propertiesMap: null,
    structure: null,
    targetNamespace: '',
    defaultElementNamespaceURI: '',
    defaultAttributeNamespaceURI: '',
    built: false,
    initialize: function initialize(mapping, options) {
      Jsonix.Model.TypeInfo.prototype.initialize.apply(this, []);
      Jsonix.Mapping.Styled.prototype.initialize.apply(this, [options]);
      Jsonix.Util.Ensure.ensureObject(mapping);
      var n = mapping.name || mapping.n || undefined;
      Jsonix.Util.Ensure.ensureString(n);
      this.name = n;
      var ln = mapping.localName || mapping.ln || null;
      this.localName = ln;
      var dens = mapping.defaultElementNamespaceURI || mapping.dens || mapping.targetNamespace || mapping.tns || '';
      this.defaultElementNamespaceURI = dens;
      var tns = mapping.targetNamespace || mapping.tns || mapping.defaultElementNamespaceURI || mapping.dens || this.defaultElementNamespaceURI;
      this.targetNamespace = tns;
      var dans = mapping.defaultAttributeNamespaceURI || mapping.dans || '';
      this.defaultAttributeNamespaceURI = dans;
      var bti = mapping.baseTypeInfo || mapping.bti || null;
      this.baseTypeInfo = bti;
      var inF = mapping.instanceFactory || mapping.inF || undefined;

      if (Jsonix.Util.Type.exists(inF)) {
        // TODO: should we support instanceFactory as functions?
        // For the pure JSON configuration?
        Jsonix.Util.Ensure.ensureFunction(inF);
        this.instanceFactory = inF;
      }

      var tn = mapping.typeName || mapping.tn || undefined;

      if (Jsonix.Util.Type.exists(tn)) {
        if (Jsonix.Util.Type.isString(tn)) {
          this.typeName = new Jsonix.XML.QName(this.targetNamespace, tn);
        } else {
          this.typeName = Jsonix.XML.QName.fromObject(tn);
        }
      } else if (Jsonix.Util.Type.exists(ln)) {
        this.typeName = new Jsonix.XML.QName(tns, ln);
      }

      this.properties = [];
      this.propertiesMap = {};
      var ps = mapping.propertyInfos || mapping.ps || [];
      Jsonix.Util.Ensure.ensureArray(ps);

      for (var index = 0; index < ps.length; index++) {
        this.p(ps[index]);
      }
    },
    getPropertyInfoByName: function getPropertyInfoByName(name) {
      return this.propertiesMap[name];
    },
    // Obsolete
    destroy: function destroy() {},
    build: function build(context) {
      if (!this.built) {
        this.baseTypeInfo = context.resolveTypeInfo(this.baseTypeInfo, this.module);

        if (Jsonix.Util.Type.exists(this.baseTypeInfo)) {
          this.baseTypeInfo.build(context);
        } // Build properties in this context


        for (var index = 0; index < this.properties.length; index++) {
          var propertyInfo = this.properties[index];
          propertyInfo.build(context, this.module);
        } // Build the structure


        var structure = {
          elements: null,
          attributes: {},
          anyAttribute: null,
          value: null,
          any: null
        };
        this.buildStructure(context, structure);
        this.structure = structure;
      }
    },
    buildStructure: function buildStructure(context, structure) {
      if (Jsonix.Util.Type.exists(this.baseTypeInfo)) {
        this.baseTypeInfo.buildStructure(context, structure);
      }

      for (var index = 0; index < this.properties.length; index++) {
        var propertyInfo = this.properties[index];
        propertyInfo.buildStructure(context, structure);
      }
    },
    unmarshal: function unmarshal(context, input) {
      this.build(context);
      var result;

      if (this.instanceFactory) {
        result = new this.instanceFactory();
      } else {
        result = {
          TYPE_NAME: this.name
        };
      }

      if (input.eventType !== 1) {
        throw new Error("Parser must be on START_ELEMENT to read a class info.");
      } // Read attributes


      if (Jsonix.Util.Type.exists(this.structure.attributes)) {
        var attributeCount = input.getAttributeCount();

        if (attributeCount !== 0) {
          for (var index = 0; index < attributeCount; index++) {
            var attributeNameKey = input.getAttributeNameKey(index);

            if (Jsonix.Util.Type.exists(this.structure.attributes[attributeNameKey])) {
              var attributeValue = input.getAttributeValue(index);

              if (Jsonix.Util.Type.isString(attributeValue)) {
                var attributePropertyInfo = this.structure.attributes[attributeNameKey];
                this.unmarshalPropertyValue(context, input, attributePropertyInfo, result, attributeValue);
              }
            }
          }
        }
      } // Read any attribute


      if (Jsonix.Util.Type.exists(this.structure.anyAttribute)) {
        var propertyInfo = this.structure.anyAttribute;
        this.unmarshalProperty(context, input, propertyInfo, result);
      } // Read elements


      if (Jsonix.Util.Type.exists(this.structure.elements)) {
        var et = input.next();

        while (et !== Jsonix.XML.Input.END_ELEMENT) {
          if (et === Jsonix.XML.Input.START_ELEMENT) {
            // New sub-element starts
            var elementNameKey = input.getNameKey();

            if (Jsonix.Util.Type.exists(this.structure.elements[elementNameKey])) {
              var elementPropertyInfo = this.structure.elements[elementNameKey];
              this.unmarshalProperty(context, input, elementPropertyInfo, result);
            } else if (Jsonix.Util.Type.exists(this.structure.any)) {
              // TODO Refactor
              var anyPropertyInfo = this.structure.any;
              this.unmarshalProperty(context, input, anyPropertyInfo, result);
            } else {
              // TODO optionally report a validation error that the element is not expected
              et = input.skipElement();
            }
          } else if (et === Jsonix.XML.Input.CHARACTERS || et === Jsonix.XML.Input.CDATA || et === Jsonix.XML.Input.ENTITY_REFERENCE) {
            if (Jsonix.Util.Type.exists(this.structure.mixed)) {
              // Characters and structure has a mixed property
              var mixedPropertyInfo = this.structure.mixed;
              this.unmarshalProperty(context, input, mixedPropertyInfo, result);
            }
          } else if (et === Jsonix.XML.Input.SPACE || et === Jsonix.XML.Input.COMMENT || et === Jsonix.XML.Input.PROCESSING_INSTRUCTION) {// Ignore
          } else {
            throw new Error("Illegal state: unexpected event type [" + et + "].");
          }

          et = input.next();
        }
      } else if (Jsonix.Util.Type.exists(this.structure.value)) {
        var valuePropertyInfo = this.structure.value;
        this.unmarshalProperty(context, input, valuePropertyInfo, result);
      } else {
        // Just skip everything
        input.nextTag();
      }

      if (input.eventType !== 2) {
        throw new Error("Illegal state: must be END_ELEMENT.");
      }

      return result;
    },
    unmarshalProperty: function unmarshalProperty(context, input, propertyInfo, result) {
      var propertyValue = propertyInfo.unmarshal(context, input, this);
      propertyInfo.setProperty(result, propertyValue);
    },
    unmarshalPropertyValue: function unmarshalPropertyValue(context, input, propertyInfo, result, value) {
      var propertyValue = propertyInfo.unmarshalValue(value, context, input, this);
      propertyInfo.setProperty(result, propertyValue);
    },
    marshal: function marshal(value, context, output, scope) {
      if (this.isMarshallable(value, context, scope)) {
        // TODO This must be reworked
        if (Jsonix.Util.Type.exists(this.baseTypeInfo)) {
          this.baseTypeInfo.marshal(value, context, output);
        }

        for (var index = 0; index < this.properties.length; index++) {
          var propertyInfo = this.properties[index];
          var propertyValue = value[propertyInfo.name];

          if (Jsonix.Util.Type.exists(propertyValue)) {
            propertyInfo.marshal(propertyValue, context, output, this);
          }
        }
      } else {
        // Otherwise if there is just one property, use this property to marshal
        if (this.structure.value) {
          var valuePropertyInfo = this.structure.value;
          valuePropertyInfo.marshal(value, context, output, this);
        } else if (this.properties.length === 1) {
          var singlePropertyInfo = this.properties[0];
          singlePropertyInfo.marshal(value, context, output, this);
        } else {
          // TODO throw an error
          throw new Error("The passed value [" + value + "] is not an object and there is no single suitable property to marshal it.");
        }
      }
    },
    // Checks if the value is marshallable
    isMarshallable: function isMarshallable(value, context, scope) {
      return this.isInstance(value, context, scope) || Jsonix.Util.Type.isObject(value) && !Jsonix.Util.Type.isArray(value);
    },
    isInstance: function isInstance(value, context, scope) {
      if (this.instanceFactory) {
        return value instanceof this.instanceFactory;
      } else {
        return Jsonix.Util.Type.isObject(value) && Jsonix.Util.Type.isString(value.TYPE_NAME) && value.TYPE_NAME === this.name;
      }
    },
    // Obsolete, left for backwards compatibility
    b: function b(baseTypeInfo) {
      Jsonix.Util.Ensure.ensureObject(baseTypeInfo);
      this.baseTypeInfo = baseTypeInfo;
      return this;
    },
    // Obsolete, left for backwards compatibility
    ps: function ps() {
      return this;
    },
    p: function p(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping); // If mapping is an instance of the property class

      if (mapping instanceof Jsonix.Model.PropertyInfo) {
        this.addProperty(mapping);
      } // Else create it via generic mapping configuration
      else {
          mapping = Jsonix.Util.Type.cloneObject(mapping);
          var type = mapping.type || mapping.t || 'element'; // Locate the creator function

          if (Jsonix.Util.Type.isFunction(this.propertyInfoCreators[type])) {
            var propertyInfoCreator = this.propertyInfoCreators[type]; // Call the creator function

            propertyInfoCreator.call(this, mapping);
          } else {
            throw new Error("Unknown property info type [" + type + "].");
          }
        }
    },
    aa: function aa(mapping) {
      this.addDefaultNamespaces(mapping);
      return this.addProperty(new this.mappingStyle.anyAttributePropertyInfo(mapping, {
        mappingStyle: this.mappingStyle
      }));
    },
    ae: function ae(mapping) {
      this.addDefaultNamespaces(mapping);
      return this.addProperty(new this.mappingStyle.anyElementPropertyInfo(mapping, {
        mappingStyle: this.mappingStyle
      }));
    },
    a: function a(mapping) {
      this.addDefaultNamespaces(mapping);
      return this.addProperty(new this.mappingStyle.attributePropertyInfo(mapping, {
        mappingStyle: this.mappingStyle
      }));
    },
    em: function em(mapping) {
      this.addDefaultNamespaces(mapping);
      return this.addProperty(new this.mappingStyle.elementMapPropertyInfo(mapping, {
        mappingStyle: this.mappingStyle
      }));
    },
    e: function e(mapping) {
      this.addDefaultNamespaces(mapping);
      return this.addProperty(new this.mappingStyle.elementPropertyInfo(mapping, {
        mappingStyle: this.mappingStyle
      }));
    },
    es: function es(mapping) {
      this.addDefaultNamespaces(mapping);
      return this.addProperty(new this.mappingStyle.elementsPropertyInfo(mapping, {
        mappingStyle: this.mappingStyle
      }));
    },
    er: function er(mapping) {
      this.addDefaultNamespaces(mapping);
      return this.addProperty(new this.mappingStyle.elementRefPropertyInfo(mapping, {
        mappingStyle: this.mappingStyle
      }));
    },
    ers: function ers(mapping) {
      this.addDefaultNamespaces(mapping);
      return this.addProperty(new this.mappingStyle.elementRefsPropertyInfo(mapping, {
        mappingStyle: this.mappingStyle
      }));
    },
    v: function v(mapping) {
      this.addDefaultNamespaces(mapping);
      return this.addProperty(new this.mappingStyle.valuePropertyInfo(mapping, {
        mappingStyle: this.mappingStyle
      }));
    },
    addDefaultNamespaces: function addDefaultNamespaces(mapping) {
      if (Jsonix.Util.Type.isObject(mapping)) {
        if (!Jsonix.Util.Type.isString(mapping.defaultElementNamespaceURI)) {
          mapping.defaultElementNamespaceURI = this.defaultElementNamespaceURI;
        }

        if (!Jsonix.Util.Type.isString(mapping.defaultAttributeNamespaceURI)) {
          mapping.defaultAttributeNamespaceURI = this.defaultAttributeNamespaceURI;
        }
      }
    },
    addProperty: function addProperty(property) {
      this.properties.push(property);
      this.propertiesMap[property.name] = property;
      return this;
    },
    CLASS_NAME: 'Jsonix.Model.ClassInfo'
  });
  Jsonix.Model.ClassInfo.prototype.propertyInfoCreators = {
    "aa": Jsonix.Model.ClassInfo.prototype.aa,
    "anyAttribute": Jsonix.Model.ClassInfo.prototype.aa,
    "ae": Jsonix.Model.ClassInfo.prototype.ae,
    "anyElement": Jsonix.Model.ClassInfo.prototype.ae,
    "a": Jsonix.Model.ClassInfo.prototype.a,
    "attribute": Jsonix.Model.ClassInfo.prototype.a,
    "em": Jsonix.Model.ClassInfo.prototype.em,
    "elementMap": Jsonix.Model.ClassInfo.prototype.em,
    "e": Jsonix.Model.ClassInfo.prototype.e,
    "element": Jsonix.Model.ClassInfo.prototype.e,
    "es": Jsonix.Model.ClassInfo.prototype.es,
    "elements": Jsonix.Model.ClassInfo.prototype.es,
    "er": Jsonix.Model.ClassInfo.prototype.er,
    "elementRef": Jsonix.Model.ClassInfo.prototype.er,
    "ers": Jsonix.Model.ClassInfo.prototype.ers,
    "elementRefs": Jsonix.Model.ClassInfo.prototype.ers,
    "v": Jsonix.Model.ClassInfo.prototype.v,
    "value": Jsonix.Model.ClassInfo.prototype.v
  };
  Jsonix.Model.EnumLeafInfo = Jsonix.Class(Jsonix.Model.TypeInfo, {
    name: null,
    baseTypeInfo: 'String',
    entries: null,
    keys: null,
    values: null,
    built: false,
    initialize: function initialize(mapping) {
      Jsonix.Model.TypeInfo.prototype.initialize.apply(this, []);
      Jsonix.Util.Ensure.ensureObject(mapping);
      var n = mapping.name || mapping.n || undefined;
      Jsonix.Util.Ensure.ensureString(n);
      this.name = n;
      var bti = mapping.baseTypeInfo || mapping.bti || 'String';
      this.baseTypeInfo = bti;
      var vs = mapping.values || mapping.vs || undefined;
      Jsonix.Util.Ensure.ensureExists(vs);

      if (!(Jsonix.Util.Type.isObject(vs) || Jsonix.Util.Type.isArray(vs))) {
        throw new Error('Enum values must be either an array or an object.');
      } else {
        this.entries = vs;
      }
    },
    build: function build(context) {
      if (!this.built) {
        this.baseTypeInfo = context.resolveTypeInfo(this.baseTypeInfo, this.module);
        this.baseTypeInfo.build(context);
        var items = this.entries;
        var entries = {};
        var keys = [];
        var values = [];
        var index = 0;
        var key;
        var value; // If values is an array, process individual items

        if (Jsonix.Util.Type.isArray(items)) {
          // Build properties in this context
          for (index = 0; index < items.length; index++) {
            value = items[index];

            if (Jsonix.Util.Type.isString(value)) {
              key = value;

              if (!Jsonix.Util.Type.isFunction(this.baseTypeInfo.parse)) {
                throw new Error('Enum value is provided as string but the base type [' + this.baseTypeInfo.name + '] of the enum info [' + this.name + '] does not implement the parse method.');
              } // Using null as input since input is not available


              value = this.baseTypeInfo.parse(value, context, null, this);
            } else {
              if (this.baseTypeInfo.isInstance(value, context, this)) {
                if (!Jsonix.Util.Type.isFunction(this.baseTypeInfo.print)) {
                  throw new Error('The base type [' + this.baseTypeInfo.name + '] of the enum info [' + this.name + '] does not implement the print method, unable to produce the enum key as string.');
                } // Using null as output since output is not available at this moment


                key = this.baseTypeInfo.print(value, context, null, this);
              } else {
                throw new Error('Enum value [' + value + '] is not an instance of the enum base type [' + this.baseTypeInfo.name + '].');
              }
            }

            entries[key] = value;
            keys[index] = key;
            values[index] = value;
          }
        } else if (Jsonix.Util.Type.isObject(items)) {
          for (key in items) {
            if (items.hasOwnProperty(key)) {
              value = items[key];

              if (Jsonix.Util.Type.isString(value)) {
                if (!Jsonix.Util.Type.isFunction(this.baseTypeInfo.parse)) {
                  throw new Error('Enum value is provided as string but the base type [' + this.baseTypeInfo.name + '] of the enum info [' + this.name + '] does not implement the parse method.');
                } // Using null as input since input is not available


                value = this.baseTypeInfo.parse(value, context, null, this);
              } else {
                if (!this.baseTypeInfo.isInstance(value, context, this)) {
                  throw new Error('Enum value [' + value + '] is not an instance of the enum base type [' + this.baseTypeInfo.name + '].');
                }
              }

              entries[key] = value;
              keys[index] = key;
              values[index] = value;
              index++;
            }
          }
        } else {
          throw new Error('Enum values must be either an array or an object.');
        }

        this.entries = entries;
        this.keys = keys;
        this.values = values;
        this.built = true;
      }
    },
    unmarshal: function unmarshal(context, input, scope) {
      var text = input.getElementText();
      return this.parse(text, context, input, scope);
    },
    marshal: function marshal(value, context, output, scope) {
      if (Jsonix.Util.Type.exists(value)) {
        output.writeCharacters(this.reprint(value, context, output, scope));
      }
    },
    reprint: function reprint(value, context, output, scope) {
      if (Jsonix.Util.Type.isString(value) && !this.isInstance(value, context, scope)) {
        // Using null as input since input is not available
        return this.print(this.parse(value, context, null, scope), context, output, scope);
      } else {
        return this.print(value, context, output, scope);
      }
    },
    print: function print(value, context, output, scope) {
      for (var index = 0; index < this.values.length; index++) {
        if (this.values[index] === value) {
          return this.keys[index];
        }
      }

      throw new Error('Value [' + value + '] is invalid for the enum type [' + this.name + '].');
    },
    parse: function parse(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);

      if (this.entries.hasOwnProperty(text)) {
        return this.entries[text];
      } else {
        throw new Error('Value [' + text + '] is invalid for the enum type [' + this.name + '].');
      }
    },
    isInstance: function isInstance(value, context, scope) {
      for (var index = 0; index < this.values.length; index++) {
        if (this.values[index] === value) {
          return true;
        }
      }

      return false;
    },
    CLASS_NAME: 'Jsonix.Model.EnumLeafInfo'
  });
  Jsonix.Model.ElementInfo = Jsonix.Class({
    module: null,
    elementName: null,
    typeInfo: null,
    substitutionHead: null,
    scope: null,
    built: false,
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      var dens = mapping.defaultElementNamespaceURI || mapping.dens || '';
      this.defaultElementNamespaceURI = dens;
      var en = mapping.elementName || mapping.en || undefined;

      if (Jsonix.Util.Type.isObject(en)) {
        this.elementName = Jsonix.XML.QName.fromObject(en);
      } else {
        Jsonix.Util.Ensure.ensureString(en);
        this.elementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, en);
      }

      var ti = mapping.typeInfo || mapping.ti || 'String';
      this.typeInfo = ti;
      var sh = mapping.substitutionHead || mapping.sh || null;
      this.substitutionHead = sh;
      var sc = mapping.scope || mapping.sc || null;
      this.scope = sc;
    },
    build: function build(context) {
      // If element info is not yet built
      if (!this.built) {
        this.typeInfo = context.resolveTypeInfo(this.typeInfo, this.module);
        this.scope = context.resolveTypeInfo(this.scope, this.module);
        this.built = true;
      }
    },
    CLASS_NAME: 'Jsonix.Model.ElementInfo'
  });
  Jsonix.Model.PropertyInfo = Jsonix.Class({
    name: null,
    collection: false,
    targetNamespace: '',
    defaultElementNamespaceURI: '',
    defaultAttributeNamespaceURI: '',
    built: false,
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      var n = mapping.name || mapping.n || undefined;
      Jsonix.Util.Ensure.ensureString(n);
      this.name = n;
      var dens = mapping.defaultElementNamespaceURI || mapping.dens || mapping.targetNamespace || mapping.tns || '';
      this.defaultElementNamespaceURI = dens;
      var tns = mapping.targetNamespace || mapping.tns || mapping.defaultElementNamespaceURI || mapping.dens || this.defaultElementNamespaceURI;
      this.targetNamespace = tns;
      var dans = mapping.defaultAttributeNamespaceURI || mapping.dans || '';
      this.defaultAttributeNamespaceURI = dans;
      var col = mapping.collection || mapping.col || false;
      this.collection = col;
      var rq = mapping.required || mapping.rq || false;
      this.required = rq;

      if (this.collection) {
        var mno;

        if (Jsonix.Util.Type.isNumber(mapping.minOccurs)) {
          mno = mapping.minOccurs;
        } else if (Jsonix.Util.Type.isNumber(mapping.mno)) {
          mno = mapping.mno;
        } else {
          mno = 1;
        }

        this.minOccurs = mno;
        var mxo;

        if (Jsonix.Util.Type.isNumber(mapping.maxOccurs)) {
          mxo = mapping.maxOccurs;
        } else if (Jsonix.Util.Type.isNumber(mapping.mxo)) {
          mxo = mapping.mxo;
        } else {
          mxo = null;
        }

        this.maxOccurs = mxo;
      }
    },
    build: function build(context, module) {
      if (!this.built) {
        this.doBuild(context, module);
        this.built = true;
      }
    },
    doBuild: function doBuild(context, module) {
      throw new Error("Abstract method [doBuild].");
    },
    buildStructure: function buildStructure(context, structure) {
      throw new Error("Abstract method [buildStructure].");
    },
    setProperty: function setProperty(object, value) {
      if (Jsonix.Util.Type.exists(value)) {
        if (this.collection) {
          Jsonix.Util.Ensure.ensureArray(value, 'Collection property requires an array value.');

          if (!Jsonix.Util.Type.exists(object[this.name])) {
            object[this.name] = [];
          }

          for (var index = 0; index < value.length; index++) {
            object[this.name].push(value[index]);
          }
        } else {
          object[this.name] = value;
        }
      }
    },
    CLASS_NAME: 'Jsonix.Model.PropertyInfo'
  });
  Jsonix.Model.AnyAttributePropertyInfo = Jsonix.Class(Jsonix.Model.PropertyInfo, {
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      Jsonix.Model.PropertyInfo.prototype.initialize.apply(this, [mapping]);
    },
    unmarshal: function unmarshal(context, input, scope) {
      var attributeCount = input.getAttributeCount();

      if (attributeCount === 0) {
        return null;
      } else {
        var result = {};

        for (var index = 0; index < attributeCount; index++) {
          var value = input.getAttributeValue(index);

          if (Jsonix.Util.Type.isString(value)) {
            var propertyName = this.convertFromAttributeName(input.getAttributeName(index), context, input, scope);
            result[propertyName] = value;
          }
        }

        return result;
      }
    },
    marshal: function marshal(value, context, output, scope) {
      if (!Jsonix.Util.Type.isObject(value)) {
        // Nothing to do
        return;
      }

      for (var propertyName in value) {
        if (value.hasOwnProperty(propertyName)) {
          var propertyValue = value[propertyName];

          if (Jsonix.Util.Type.isString(propertyValue)) {
            var attributeName = this.convertToAttributeName(propertyName, context, output, scope);
            output.writeAttribute(attributeName, propertyValue);
          }
        }
      }
    },
    convertFromAttributeName: function convertFromAttributeName(attributeName, context, input, scope) {
      return attributeName.key;
    },
    convertToAttributeName: function convertToAttributeName(propertyName, context, output, scope) {
      return Jsonix.XML.QName.fromObjectOrString(propertyName, context);
    },
    doBuild: function doBuild(context, module) {// Nothing to do
    },
    buildStructure: function buildStructure(context, structure) {
      Jsonix.Util.Ensure.ensureObject(structure); // if (Jsonix.Util.Type.exists(structure.anyAttribute))
      // {
      // // TODO better exception
      // throw new Error("The structure already defines an any attribute
      // property.");
      // } else
      // {

      structure.anyAttribute = this; // }
    },
    CLASS_NAME: 'Jsonix.Model.AnyAttributePropertyInfo'
  });
  Jsonix.Model.AnyAttributePropertyInfo.Simplified = Jsonix.Class(Jsonix.Model.AnyAttributePropertyInfo, {
    convertFromAttributeName: function convertFromAttributeName(attributeName, context, input, scope) {
      return attributeName.toCanonicalString(context);
    }
  });
  Jsonix.Model.SingleTypePropertyInfo = Jsonix.Class(Jsonix.Model.PropertyInfo, {
    typeInfo: 'String',
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      Jsonix.Model.PropertyInfo.prototype.initialize.apply(this, [mapping]);
      var ti = mapping.typeInfo || mapping.ti || 'String';
      this.typeInfo = ti;
    },
    doBuild: function doBuild(context, module) {
      this.typeInfo = context.resolveTypeInfo(this.typeInfo, module);
    },
    unmarshalValue: function unmarshalValue(value, context, input, scope) {
      return this.parse(value, context, input, scope);
    },
    parse: function parse(value, context, input, scope) {
      return this.typeInfo.parse(value, context, input, scope);
    },
    print: function print(value, context, output, scope) {
      return this.typeInfo.reprint(value, context, output, scope);
    },
    CLASS_NAME: 'Jsonix.Model.SingleTypePropertyInfo'
  });
  Jsonix.Model.AttributePropertyInfo = Jsonix.Class(Jsonix.Model.SingleTypePropertyInfo, {
    attributeName: null,
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      Jsonix.Model.SingleTypePropertyInfo.prototype.initialize.apply(this, [mapping]);
      var an = mapping.attributeName || mapping.an || undefined;

      if (Jsonix.Util.Type.isObject(an)) {
        this.attributeName = Jsonix.XML.QName.fromObject(an);
      } else if (Jsonix.Util.Type.isString(an)) {
        this.attributeName = new Jsonix.XML.QName(this.defaultAttributeNamespaceURI, an);
      } else {
        this.attributeName = new Jsonix.XML.QName(this.defaultAttributeNamespaceURI, this.name);
      }
    },
    unmarshal: function unmarshal(context, input, scope) {
      var attributeCount = input.getAttributeCount();
      var result = null;

      for (var index = 0; index < attributeCount; index++) {
        var attributeNameKey = input.getAttributeNameKey(index);

        if (this.attributeName.key === attributeNameKey) {
          var attributeValue = input.getAttributeValue(index);

          if (Jsonix.Util.Type.isString(attributeValue)) {
            result = this.unmarshalValue(attributeValue, context, input, scope);
          }
        }
      }

      return result;
    },
    marshal: function marshal(value, context, output, scope) {
      if (Jsonix.Util.Type.exists(value)) {
        output.writeAttribute(this.attributeName, this.print(value, context, output, scope));
      }
    },
    buildStructure: function buildStructure(context, structure) {
      Jsonix.Util.Ensure.ensureObject(structure);
      Jsonix.Util.Ensure.ensureObject(structure.attributes);
      var key = this.attributeName.key; // if (Jsonix.Util.Type.exists(structure.attributes[key])) {
      // // TODO better exception
      // throw new Error("The structure already defines an attribute for the key
      // ["
      // + key + "].");
      // } else
      // {

      structure.attributes[key] = this; // }
    },
    CLASS_NAME: 'Jsonix.Model.AttributePropertyInfo'
  });
  Jsonix.Model.ValuePropertyInfo = Jsonix.Class(Jsonix.Model.SingleTypePropertyInfo, {
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      Jsonix.Model.SingleTypePropertyInfo.prototype.initialize.apply(this, [mapping]);
      var cdata = mapping.asCDATA || mapping.cdata || false;
      this.asCDATA = cdata;
    },
    unmarshal: function unmarshal(context, input, scope) {
      var text = input.getElementText();
      return this.unmarshalValue(text, context, input, scope);
    },
    marshal: function marshal(value, context, output, scope) {
      if (!Jsonix.Util.Type.exists(value)) {
        return;
      }

      if (this.asCDATA) {
        output.writeCdata(this.print(value, context, output, scope));
      } else {
        output.writeCharacters(this.print(value, context, output, scope));
      }
    },
    buildStructure: function buildStructure(context, structure) {
      Jsonix.Util.Ensure.ensureObject(structure); // if (Jsonix.Util.Type.exists(structure.value)) {
      // // TODO better exception
      // throw new Error("The structure already defines a value
      // property.");
      // } else

      if (Jsonix.Util.Type.exists(structure.elements)) {
        // TODO better exception
        throw new Error("The structure already defines element mappings, it cannot define a value property.");
      } else {
        structure.value = this;
      }
    },
    CLASS_NAME: 'Jsonix.Model.ValuePropertyInfo'
  });
  Jsonix.Model.AbstractElementsPropertyInfo = Jsonix.Class(Jsonix.Binding.Unmarshalls.Element, Jsonix.Binding.Unmarshalls.WrapperElement, Jsonix.Model.PropertyInfo, {
    wrapperElementName: null,
    allowDom: false,
    allowTypedObject: true,
    mixed: false,
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      Jsonix.Model.PropertyInfo.prototype.initialize.apply(this, [mapping]);
      var wen = mapping.wrapperElementName || mapping.wen || undefined;

      if (Jsonix.Util.Type.isObject(wen)) {
        this.wrapperElementName = Jsonix.XML.QName.fromObject(wen);
      } else if (Jsonix.Util.Type.isString(wen)) {
        this.wrapperElementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, wen);
      } else {
        this.wrapperElementName = null;
      }
    },
    unmarshal: function unmarshal(context, input, scope) {
      var result = null;
      var that = this;

      var callback = function callback(value) {
        if (that.collection) {
          if (result === null) {
            result = [];
          }

          result.push(value);
        } else {
          if (result === null) {
            result = value;
          } else {
            // TODO Report validation error
            throw new Error("Value already set.");
          }
        }
      };

      if (Jsonix.Util.Type.exists(this.wrapperElementName)) {
        this.unmarshalWrapperElement(context, input, scope, callback);
      } else {
        this.unmarshalElement(context, input, scope, callback);
      }

      return result;
    },
    marshal: function marshal(value, context, output, scope) {
      if (!Jsonix.Util.Type.exists(value)) {
        // Do nothing
        return;
      }

      if (Jsonix.Util.Type.exists(this.wrapperElementName)) {
        output.writeStartElement(this.wrapperElementName);
      }

      if (!this.collection) {
        this.marshalElement(value, context, output, scope);
      } else {
        Jsonix.Util.Ensure.ensureArray(value); // TODO Exception if not array

        for (var index = 0; index < value.length; index++) {
          var item = value[index]; // TODO Exception if item does not exist

          this.marshalElement(item, context, output, scope);
        }
      }

      if (Jsonix.Util.Type.exists(this.wrapperElementName)) {
        output.writeEndElement();
      }
    },
    convertFromTypedNamedValue: function convertFromTypedNamedValue(elementValue, context, input, scope) {
      return elementValue.value;
    },
    buildStructure: function buildStructure(context, structure) {
      Jsonix.Util.Ensure.ensureObject(structure);

      if (Jsonix.Util.Type.exists(structure.value)) {
        // TODO better exception
        throw new Error("The structure already defines a value property.");
      } else if (!Jsonix.Util.Type.exists(structure.elements)) {
        structure.elements = {};
      }

      if (Jsonix.Util.Type.exists(this.wrapperElementName)) {
        structure.elements[this.wrapperElementName.key] = this;
      } else {
        this.buildStructureElements(context, structure);
      }
    },
    buildStructureElements: function buildStructureElements(context, structure) {
      throw new Error("Abstract method [buildStructureElements].");
    },
    CLASS_NAME: 'Jsonix.Model.AbstractElementsPropertyInfo'
  });
  Jsonix.Model.ElementPropertyInfo = Jsonix.Class(Jsonix.Model.AbstractElementsPropertyInfo, Jsonix.Binding.Marshalls.Element, {
    typeInfo: 'String',
    elementName: null,
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      Jsonix.Model.AbstractElementsPropertyInfo.prototype.initialize.apply(this, [mapping]);
      var ti = mapping.typeInfo || mapping.ti || 'String';

      if (Jsonix.Util.Type.isObject(ti)) {
        this.typeInfo = ti;
      } else {
        Jsonix.Util.Ensure.ensureString(ti);
        this.typeInfo = ti;
      }

      var en = mapping.elementName || mapping.en || undefined;

      if (Jsonix.Util.Type.isObject(en)) {
        this.elementName = Jsonix.XML.QName.fromObject(en);
      } else if (Jsonix.Util.Type.isString(en)) {
        this.elementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, en);
      } else {
        this.elementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, this.name);
      }
    },
    getTypeInfoByElementName: function getTypeInfoByElementName(elementName, context, scope) {
      return this.typeInfo;
    },
    convertToTypedNamedValue: function convertToTypedNamedValue(value, context, output, scope) {
      return {
        name: this.elementName,
        value: value,
        typeInfo: this.typeInfo
      };
    },
    doBuild: function doBuild(context, module) {
      this.typeInfo = context.resolveTypeInfo(this.typeInfo, module);
    },
    buildStructureElements: function buildStructureElements(context, structure) {
      structure.elements[this.elementName.key] = this;
    },
    CLASS_NAME: 'Jsonix.Model.ElementPropertyInfo'
  });
  Jsonix.Model.ElementsPropertyInfo = Jsonix.Class(Jsonix.Model.AbstractElementsPropertyInfo, Jsonix.Binding.Marshalls.Element, {
    elementTypeInfos: null,
    elementTypeInfosMap: null,
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      Jsonix.Model.AbstractElementsPropertyInfo.prototype.initialize.apply(this, [mapping]);
      var etis = mapping.elementTypeInfos || mapping.etis || [];
      Jsonix.Util.Ensure.ensureArray(etis);
      this.elementTypeInfos = [];

      for (var index = 0; index < etis.length; index++) {
        this.elementTypeInfos[index] = Jsonix.Util.Type.cloneObject(etis[index]);
      }
    },
    getTypeInfoByElementName: function getTypeInfoByElementName(elementName, context, scope) {
      return this.elementTypeInfosMap[elementName.key];
    },
    convertToTypedNamedValue: function convertToTypedNamedValue(value, context, output, scope) {
      for (var index = 0; index < this.elementTypeInfos.length; index++) {
        var elementTypeInfo = this.elementTypeInfos[index];
        var typeInfo = elementTypeInfo.typeInfo;

        if (typeInfo.isInstance(value, context, scope)) {
          var elementName = elementTypeInfo.elementName;
          return {
            name: elementName,
            value: value,
            typeInfo: typeInfo
          };
        }
      } // If xsi:type is supported


      if (context.supportXsiType) {
        // Find the actual type
        var actualTypeInfo = context.getTypeInfoByValue(value);

        if (actualTypeInfo && actualTypeInfo.typeName) {
          for (var jndex = 0; jndex < this.elementTypeInfos.length; jndex++) {
            var eti = this.elementTypeInfos[jndex];
            var ti = eti.typeInfo; // TODO Can be optimized
            // Find an element type info which has a type info that is a
            // supertype of the actual type info

            if (actualTypeInfo.isBasedOn(ti)) {
              var en = eti.elementName;
              return {
                name: en,
                value: value,
                typeInfo: ti
              };
            }
          }
        }
      } // TODO harmonize error handling. See also marshallElement. Error must
      // only be on one place.


      throw new Error("Could not find an element with type info supporting the value [" + value + "].");
    },
    doBuild: function doBuild(context, module) {
      this.elementTypeInfosMap = {};
      var etiti, etien;

      for (var index = 0; index < this.elementTypeInfos.length; index++) {
        var elementTypeInfo = this.elementTypeInfos[index];
        Jsonix.Util.Ensure.ensureObject(elementTypeInfo);
        etiti = elementTypeInfo.typeInfo || elementTypeInfo.ti || 'String';
        elementTypeInfo.typeInfo = context.resolveTypeInfo(etiti, module);
        etien = elementTypeInfo.elementName || elementTypeInfo.en || undefined;
        elementTypeInfo.elementName = Jsonix.XML.QName.fromObjectOrString(etien, context, this.defaultElementNamespaceURI);
        this.elementTypeInfosMap[elementTypeInfo.elementName.key] = elementTypeInfo.typeInfo;
      }
    },
    buildStructureElements: function buildStructureElements(context, structure) {
      for (var index = 0; index < this.elementTypeInfos.length; index++) {
        var elementTypeInfo = this.elementTypeInfos[index];
        structure.elements[elementTypeInfo.elementName.key] = this;
      }
    },
    CLASS_NAME: 'Jsonix.Model.ElementsPropertyInfo'
  });
  Jsonix.Model.ElementMapPropertyInfo = Jsonix.Class(Jsonix.Model.AbstractElementsPropertyInfo, {
    elementName: null,
    key: null,
    value: null,
    entryTypeInfo: null,
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      Jsonix.Model.AbstractElementsPropertyInfo.prototype.initialize.apply(this, [mapping]); // TODO Ensure correct argument

      var k = mapping.key || mapping.k || undefined;
      Jsonix.Util.Ensure.ensureObject(k);
      var v = mapping.value || mapping.v || undefined;
      Jsonix.Util.Ensure.ensureObject(v); // TODO Ensure correct argument

      var en = mapping.elementName || mapping.en || undefined;

      if (Jsonix.Util.Type.isObject(en)) {
        this.elementName = Jsonix.XML.QName.fromObject(en);
      } else if (Jsonix.Util.Type.isString(en)) {
        this.elementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, en);
      } else {
        this.elementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, this.name);
      }

      this.entryTypeInfo = new Jsonix.Model.ClassInfo({
        name: 'Map<' + k.name + ',' + v.name + '>',
        propertyInfos: [k, v]
      });
    },
    unmarshal: function unmarshal(context, input, scope) {
      var result = null;
      var that = this;

      var callback = function callback(value) {
        if (Jsonix.Util.Type.exists(value)) {
          Jsonix.Util.Ensure.ensureObject(value, 'Map property requires an object.');

          if (!Jsonix.Util.Type.exists(result)) {
            result = {};
          }

          for (var attributeName in value) {
            if (value.hasOwnProperty(attributeName)) {
              var attributeValue = value[attributeName];

              if (that.collection) {
                if (!Jsonix.Util.Type.exists(result[attributeName])) {
                  result[attributeName] = [];
                }

                result[attributeName].push(attributeValue);
              } else {
                if (!Jsonix.Util.Type.exists(result[attributeName])) {
                  result[attributeName] = attributeValue;
                } else {
                  // TODO Report validation error
                  throw new Error("Value was already set.");
                }
              }
            }
          }
        }
      };

      if (Jsonix.Util.Type.exists(this.wrapperElementName)) {
        this.unmarshalWrapperElement(context, input, scope, callback);
      } else {
        this.unmarshalElement(context, input, scope, callback);
      }

      return result;
    },
    getTypeInfoByInputElement: function getTypeInfoByInputElement(context, input, scope) {
      return this.entryTypeInfo;
    },
    convertFromTypedNamedValue: function convertFromTypedNamedValue(elementValue, context, input, scope) {
      var entry = elementValue.value;
      var result = {};

      if (Jsonix.Util.Type.isString(entry[this.key.name])) {
        result[entry[this.key.name]] = entry[this.value.name];
      }

      return result;
    },
    marshal: function marshal(value, context, output, scope) {
      if (!Jsonix.Util.Type.exists(value)) {
        // Do nothing
        return;
      }

      if (Jsonix.Util.Type.exists(this.wrapperElementName)) {
        output.writeStartElement(this.wrapperElementName);
      }

      this.marshalElement(value, context, output, scope);

      if (Jsonix.Util.Type.exists(this.wrapperElementName)) {
        output.writeEndElement();
      }
    },
    marshalElement: function marshalElement(value, context, output, scope) {
      if (!!value) {
        for (var attributeName in value) {
          if (value.hasOwnProperty(attributeName)) {
            var attributeValue = value[attributeName];

            if (!this.collection) {
              var singleEntry = {};
              singleEntry[this.key.name] = attributeName;
              singleEntry[this.value.name] = attributeValue;
              output.writeStartElement(this.elementName);
              this.entryTypeInfo.marshal(singleEntry, context, output, scope);
              output.writeEndElement();
            } else {
              for (var index = 0; index < attributeValue.length; index++) {
                var collectionEntry = {};
                collectionEntry[this.key.name] = attributeName;
                collectionEntry[this.value.name] = attributeValue[index];
                output.writeStartElement(this.elementName);
                this.entryTypeInfo.marshal(collectionEntry, context, output, scope);
                output.writeEndElement();
              }
            }
          }
        }
      }
    },
    doBuild: function doBuild(context, module) {
      this.entryTypeInfo.build(context, module); // TODO get property by name

      this.key = this.entryTypeInfo.properties[0];
      this.value = this.entryTypeInfo.properties[1];
    },
    buildStructureElements: function buildStructureElements(context, structure) {
      structure.elements[this.elementName.key] = this;
    },
    setProperty: function setProperty(object, value) {
      if (Jsonix.Util.Type.exists(value)) {
        Jsonix.Util.Ensure.ensureObject(value, 'Map property requires an object.');

        if (!Jsonix.Util.Type.exists(object[this.name])) {
          object[this.name] = {};
        }

        var map = object[this.name];

        for (var attributeName in value) {
          if (value.hasOwnProperty(attributeName)) {
            var attributeValue = value[attributeName];

            if (this.collection) {
              if (!Jsonix.Util.Type.exists(map[attributeName])) {
                map[attributeName] = [];
              }

              for (var index = 0; index < attributeValue.length; index++) {
                map[attributeName].push(attributeValue[index]);
              }
            } else {
              map[attributeName] = attributeValue;
            }
          }
        }
      }
    },
    CLASS_NAME: 'Jsonix.Model.ElementMapPropertyInfo'
  });
  Jsonix.Model.AbstractElementRefsPropertyInfo = Jsonix.Class(Jsonix.Binding.Marshalls.Element, Jsonix.Binding.Marshalls.Element.AsElementRef, Jsonix.Binding.Unmarshalls.Element, Jsonix.Binding.Unmarshalls.WrapperElement, Jsonix.Binding.Unmarshalls.Element.AsElementRef, Jsonix.Model.PropertyInfo, {
    wrapperElementName: null,
    allowDom: true,
    allowTypedObject: true,
    mixed: true,
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping, 'Mapping must be an object.');
      Jsonix.Model.PropertyInfo.prototype.initialize.apply(this, [mapping]);
      var wen = mapping.wrapperElementName || mapping.wen || undefined;

      if (Jsonix.Util.Type.isObject(wen)) {
        this.wrapperElementName = Jsonix.XML.QName.fromObject(wen);
      } else if (Jsonix.Util.Type.isString(wen)) {
        this.wrapperElementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, wen);
      } else {
        this.wrapperElementName = null;
      }

      var dom = Jsonix.Util.Type.defaultValue(mapping.allowDom, mapping.dom, true);
      var typed = Jsonix.Util.Type.defaultValue(mapping.allowTypedObject, mapping.typed, true);
      var mx = Jsonix.Util.Type.defaultValue(mapping.mixed, mapping.mx, true);
      this.allowDom = dom;
      this.allowTypedObject = typed;
      this.mixed = mx;
    },
    unmarshal: function unmarshal(context, input, scope) {
      var result = null;
      var that = this;

      var callback = function callback(value) {
        if (that.collection) {
          if (result === null) {
            result = [];
          }

          result.push(value);
        } else {
          if (result === null) {
            result = value;
          } else {
            // TODO Report validation error
            throw new Error("Value already set.");
          }
        }
      };

      var et = input.eventType;

      if (et === Jsonix.XML.Input.START_ELEMENT) {
        if (Jsonix.Util.Type.exists(this.wrapperElementName)) {
          this.unmarshalWrapperElement(context, input, scope, callback);
        } else {
          this.unmarshalElement(context, input, scope, callback);
        }
      } else if (this.mixed && (et === Jsonix.XML.Input.CHARACTERS || et === Jsonix.XML.Input.CDATA || et === Jsonix.XML.Input.ENTITY_REFERENCE)) {
        callback(input.getText());
      } else if (et === Jsonix.XML.Input.SPACE || et === Jsonix.XML.Input.COMMENT || et === Jsonix.XML.Input.PROCESSING_INSTRUCTION) {// Skip whitespace
      } else {
        // TODO better exception
        throw new Error("Illegal state: unexpected event type [" + et + "].");
      }

      return result;
    },
    marshal: function marshal(value, context, output, scope) {
      if (Jsonix.Util.Type.exists(value)) {
        if (Jsonix.Util.Type.exists(this.wrapperElementName)) {
          output.writeStartElement(this.wrapperElementName);
        }

        if (!this.collection) {
          this.marshalItem(value, context, output, scope);
        } else {
          Jsonix.Util.Ensure.ensureArray(value, 'Collection property requires an array value.');

          for (var index = 0; index < value.length; index++) {
            var item = value[index];
            this.marshalItem(item, context, output, scope);
          }
        }

        if (Jsonix.Util.Type.exists(this.wrapperElementName)) {
          output.writeEndElement();
        }
      }
    },
    marshalItem: function marshalItem(value, context, output, scope) {
      if (Jsonix.Util.Type.isString(value)) {
        if (!this.mixed) {
          // TODO
          throw new Error("Property is not mixed, can't handle string values.");
        } else {
          output.writeCharacters(value);
        }
      } else if (this.allowDom && Jsonix.Util.Type.exists(value.nodeType)) {
        // DOM node
        output.writeNode(value);
      } else if (Jsonix.Util.Type.isObject(value)) {
        this.marshalElement(value, context, output, scope);
      } else {
        if (this.mixed) {
          throw new Error("Unsupported content type, either objects or strings are supported.");
        } else {
          throw new Error("Unsupported content type, only objects are supported.");
        }
      }
    },
    getTypeInfoByElementName: function getTypeInfoByElementName(elementName, context, scope) {
      var propertyElementTypeInfo = this.getPropertyElementTypeInfo(elementName, context);

      if (Jsonix.Util.Type.exists(propertyElementTypeInfo)) {
        return propertyElementTypeInfo.typeInfo;
      } else {
        var contextElementTypeInfo = context.getElementInfo(elementName, scope);

        if (Jsonix.Util.Type.exists(contextElementTypeInfo)) {
          return contextElementTypeInfo.typeInfo;
        } else {
          return undefined;
        }
      }
    },
    getPropertyElementTypeInfo: function getPropertyElementTypeInfo(elementName, context) {
      throw new Error("Abstract method [getPropertyElementTypeInfo].");
    },
    buildStructure: function buildStructure(context, structure) {
      Jsonix.Util.Ensure.ensureObject(structure);

      if (Jsonix.Util.Type.exists(structure.value)) {
        // TODO better exception
        throw new Error("The structure already defines a value property.");
      } else if (!Jsonix.Util.Type.exists(structure.elements)) {
        structure.elements = {};
      }

      if (Jsonix.Util.Type.exists(this.wrapperElementName)) {
        structure.elements[this.wrapperElementName.key] = this;
      } else {
        this.buildStructureElements(context, structure);
      } // if (Jsonix.Util.Type.exists(structure.elements[key]))
      // {
      // // TODO better exception
      // throw new Error("The structure already defines an element for
      // the key ["
      // + key + "].");
      // } else
      // {
      // structure.elements[key] = this;
      // }


      if (this.allowDom || this.allowTypedObject) {
        structure.any = this;
      }

      if (this.mixed && !Jsonix.Util.Type.exists(this.wrapperElementName)) {
        // if (Jsonix.Util.Type.exists(structure.mixed)) {
        // // TODO better exception
        // throw new Error("The structure already defines the mixed
        // property.");
        // } else
        // {
        structure.mixed = this; // }
      }
    },
    buildStructureElements: function buildStructureElements(context, structure) {
      throw new Error("Abstract method [buildStructureElements].");
    },
    buildStructureElementTypeInfos: function buildStructureElementTypeInfos(context, structure, elementTypeInfo) {
      structure.elements[elementTypeInfo.elementName.key] = this;
      var substitutionMembers = context.getSubstitutionMembers(elementTypeInfo.elementName);

      if (Jsonix.Util.Type.isArray(substitutionMembers)) {
        for (var jndex = 0; jndex < substitutionMembers.length; jndex++) {
          var substitutionElementInfo = substitutionMembers[jndex];
          this.buildStructureElementTypeInfos(context, structure, substitutionElementInfo);
        }
      }
    },
    CLASS_NAME: 'Jsonix.Model.AbstractElementRefsPropertyInfo'
  });
  Jsonix.Model.ElementRefPropertyInfo = Jsonix.Class(Jsonix.Model.AbstractElementRefsPropertyInfo, {
    typeInfo: 'String',
    elementName: null,
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      Jsonix.Model.AbstractElementRefsPropertyInfo.prototype.initialize.apply(this, [mapping]); // TODO Ensure correct argument

      var ti = mapping.typeInfo || mapping.ti || 'String';

      if (Jsonix.Util.Type.isObject(ti)) {
        this.typeInfo = ti;
      } else {
        Jsonix.Util.Ensure.ensureString(ti);
        this.typeInfo = ti;
      }

      var en = mapping.elementName || mapping.en || undefined;

      if (Jsonix.Util.Type.isObject(en)) {
        this.elementName = Jsonix.XML.QName.fromObject(en);
      } else if (Jsonix.Util.Type.isString(en)) {
        this.elementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, en);
      } else {
        this.elementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, this.name);
      }
    },
    getPropertyElementTypeInfo: function getPropertyElementTypeInfo(elementName, context) {
      var name = Jsonix.XML.QName.fromObjectOrString(elementName, context);

      if (name.key === this.elementName.key) {
        return this;
      } else {
        return null;
      }
    },
    doBuild: function doBuild(context, module) {
      this.typeInfo = context.resolveTypeInfo(this.typeInfo, module);
    },
    buildStructureElements: function buildStructureElements(context, structure) {
      this.buildStructureElementTypeInfos(context, structure, this);
    },
    CLASS_NAME: 'Jsonix.Model.ElementRefPropertyInfo'
  });
  Jsonix.Model.ElementRefPropertyInfo.Simplified = Jsonix.Class(Jsonix.Model.ElementRefPropertyInfo, Jsonix.Binding.Unmarshalls.Element.AsSimplifiedElementRef, {
    CLASS_NAME: 'Jsonix.Model.ElementRefPropertyInfo.Simplified'
  });
  Jsonix.Model.ElementRefsPropertyInfo = Jsonix.Class(Jsonix.Model.AbstractElementRefsPropertyInfo, {
    elementTypeInfos: null,
    elementTypeInfosMap: null,
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      Jsonix.Model.AbstractElementRefsPropertyInfo.prototype.initialize.apply(this, [mapping]); // TODO Ensure correct arguments

      var etis = mapping.elementTypeInfos || mapping.etis || [];
      Jsonix.Util.Ensure.ensureArray(etis);
      this.elementTypeInfos = [];

      for (var index = 0; index < etis.length; index++) {
        this.elementTypeInfos[index] = Jsonix.Util.Type.cloneObject(etis[index]);
      }
    },
    getPropertyElementTypeInfo: function getPropertyElementTypeInfo(elementName, context) {
      var name = Jsonix.XML.QName.fromObjectOrString(elementName, context);
      var typeInfo = this.elementTypeInfosMap[name.key];

      if (Jsonix.Util.Type.exists(typeInfo)) {
        return {
          elementName: name,
          typeInfo: typeInfo
        };
      } else {
        return null;
      }
    },
    doBuild: function doBuild(context, module) {
      this.elementTypeInfosMap = {};
      var etiti, etien;

      for (var index = 0; index < this.elementTypeInfos.length; index++) {
        var elementTypeInfo = this.elementTypeInfos[index];
        Jsonix.Util.Ensure.ensureObject(elementTypeInfo);
        etiti = elementTypeInfo.typeInfo || elementTypeInfo.ti || 'String';
        elementTypeInfo.typeInfo = context.resolveTypeInfo(etiti, module);
        etien = elementTypeInfo.elementName || elementTypeInfo.en || undefined;
        elementTypeInfo.elementName = Jsonix.XML.QName.fromObjectOrString(etien, context, this.defaultElementNamespaceURI);
        this.elementTypeInfosMap[elementTypeInfo.elementName.key] = elementTypeInfo.typeInfo;
      }
    },
    buildStructureElements: function buildStructureElements(context, structure) {
      for (var index = 0; index < this.elementTypeInfos.length; index++) {
        var elementTypeInfo = this.elementTypeInfos[index];
        this.buildStructureElementTypeInfos(context, structure, elementTypeInfo);
      }
    },
    CLASS_NAME: 'Jsonix.Model.ElementRefsPropertyInfo'
  });
  Jsonix.Model.ElementRefsPropertyInfo.Simplified = Jsonix.Class(Jsonix.Model.ElementRefsPropertyInfo, Jsonix.Binding.Unmarshalls.Element.AsSimplifiedElementRef, {
    CLASS_NAME: 'Jsonix.Model.ElementRefsPropertyInfo.Simplified'
  });
  Jsonix.Model.AnyElementPropertyInfo = Jsonix.Class(Jsonix.Binding.Marshalls.Element, Jsonix.Binding.Marshalls.Element.AsElementRef, Jsonix.Binding.Unmarshalls.Element, Jsonix.Binding.Unmarshalls.Element.AsElementRef, Jsonix.Model.PropertyInfo, {
    allowDom: true,
    allowTypedObject: true,
    mixed: true,
    initialize: function initialize(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      Jsonix.Model.PropertyInfo.prototype.initialize.apply(this, [mapping]);
      var dom = Jsonix.Util.Type.defaultValue(mapping.allowDom, mapping.dom, true);
      var typed = Jsonix.Util.Type.defaultValue(mapping.allowTypedObject, mapping.typed, true);
      var mx = Jsonix.Util.Type.defaultValue(mapping.mixed, mapping.mx, true);
      this.allowDom = dom;
      this.allowTypedObject = typed;
      this.mixed = mx;
    },
    unmarshal: function unmarshal(context, input, scope) {
      var result = null;
      var that = this;

      var callback = function callback(value) {
        if (that.collection) {
          if (result === null) {
            result = [];
          }

          result.push(value);
        } else {
          if (result === null) {
            result = value;
          } else {
            // TODO Report validation error
            throw new Error("Value already set.");
          }
        }
      };

      var et = input.eventType;

      if (et === Jsonix.XML.Input.START_ELEMENT) {
        this.unmarshalElement(context, input, scope, callback);
      } else if (this.mixed && (et === Jsonix.XML.Input.CHARACTERS || et === Jsonix.XML.Input.CDATA || et === Jsonix.XML.Input.ENTITY_REFERENCE)) {
        callback(input.getText());
      } else if (this.mixed && et === Jsonix.XML.Input.SPACE) {// Whitespace
        // return null;
      } else if (et === Jsonix.XML.Input.COMMENT || et === Jsonix.XML.Input.PROCESSING_INSTRUCTION) {// return null;
      } else {
        // TODO better exception
        throw new Error("Illegal state: unexpected event type [" + et + "].");
      }

      return result;
    },
    marshal: function marshal(value, context, output, scope) {
      if (!Jsonix.Util.Type.exists(value)) {
        return;
      }

      if (!this.collection) {
        this.marshalItem(value, context, output, scope);
      } else {
        Jsonix.Util.Ensure.ensureArray(value);

        for (var index = 0; index < value.length; index++) {
          this.marshalItem(value[index], context, output, scope);
        }
      }
    },
    marshalItem: function marshalItem(value, context, output, scope) {
      if (this.mixed && Jsonix.Util.Type.isString(value)) {
        // Mixed
        output.writeCharacters(value);
      } else if (this.allowDom && Jsonix.Util.Type.exists(value.nodeType)) {
        // DOM node
        output.writeNode(value);
      } else {
        if (this.allowTypedObject) {
          this.marshalElement(value, context, output, scope);
        }
      }
    },
    doBuild: function doBuild(context, module) {// Nothing to do
    },
    buildStructure: function buildStructure(context, structure) {
      Jsonix.Util.Ensure.ensureObject(structure);

      if (Jsonix.Util.Type.exists(structure.value)) {
        // TODO better exception
        throw new Error("The structure already defines a value property.");
      } else if (!Jsonix.Util.Type.exists(structure.elements)) {
        structure.elements = {};
      }

      if (this.allowDom || this.allowTypedObject) {
        // if (Jsonix.Util.Type.exists(structure.any)) {
        // // TODO better exception
        // throw new Error("The structure already defines the any
        // property.");
        // } else
        // {
        structure.any = this; // }
      }

      if (this.mixed) {
        // if (Jsonix.Util.Type.exists(structure.mixed)) {
        // // TODO better exception
        // throw new Error("The structure already defines the mixed
        // property.");
        // } else
        // {
        structure.mixed = this; // }
      }
    },
    CLASS_NAME: 'Jsonix.Model.AnyElementPropertyInfo'
  });
  Jsonix.Model.AnyElementPropertyInfo.Simplified = Jsonix.Class(Jsonix.Model.AnyElementPropertyInfo, Jsonix.Binding.Unmarshalls.Element.AsSimplifiedElementRef, {
    CLASS_NAME: 'Jsonix.Model.AnyElementPropertyInfo.Simplified'
  });
  Jsonix.Model.Module = Jsonix.Class(Jsonix.Mapping.Styled, {
    name: null,
    typeInfos: null,
    elementInfos: null,
    targetNamespace: '',
    defaultElementNamespaceURI: '',
    defaultAttributeNamespaceURI: '',
    initialize: function initialize(mapping, options) {
      Jsonix.Mapping.Styled.prototype.initialize.apply(this, [options]);
      this.typeInfos = [];
      this.elementInfos = [];

      if (typeof mapping !== 'undefined') {
        Jsonix.Util.Ensure.ensureObject(mapping);
        var n = mapping.name || mapping.n || null;
        this.name = n;
        var dens = mapping.defaultElementNamespaceURI || mapping.dens || mapping.targetNamespace || mapping.tns || '';
        this.defaultElementNamespaceURI = dens;
        var tns = mapping.targetNamespace || mapping.tns || mapping.defaultElementNamespaceURI || mapping.dens || this.defaultElementNamespaceURI;
        this.targetNamespace = tns;
        var dans = mapping.defaultAttributeNamespaceURI || mapping.dans || '';
        this.defaultAttributeNamespaceURI = dans; // Initialize type infos

        var tis = mapping.typeInfos || mapping.tis || [];
        this.initializeTypeInfos(tis); // Backwards compatibility: class infos can also be defined
        // as properties of the schema, for instance Schema.MyType

        for (var typeInfoName in mapping) {
          if (mapping.hasOwnProperty(typeInfoName)) {
            if (mapping[typeInfoName] instanceof this.mappingStyle.classInfo) {
              this.typeInfos.push(mapping[typeInfoName]);
            }
          }
        }

        var eis = mapping.elementInfos || mapping.eis || []; // Initialize element infos

        this.initializeElementInfos(eis);
      }
    },
    initializeTypeInfos: function initializeTypeInfos(typeInfoMappings) {
      Jsonix.Util.Ensure.ensureArray(typeInfoMappings);
      var index, typeInfoMapping, typeInfo;

      for (index = 0; index < typeInfoMappings.length; index++) {
        typeInfoMapping = typeInfoMappings[index];
        typeInfo = this.createTypeInfo(typeInfoMapping);
        this.typeInfos.push(typeInfo);
      }
    },
    initializeElementInfos: function initializeElementInfos(elementInfoMappings) {
      Jsonix.Util.Ensure.ensureArray(elementInfoMappings);
      var index, elementInfoMapping, elementInfo;

      for (index = 0; index < elementInfoMappings.length; index++) {
        elementInfoMapping = elementInfoMappings[index];
        elementInfo = this.createElementInfo(elementInfoMapping);
        this.elementInfos.push(elementInfo);
      }
    },
    createTypeInfo: function createTypeInfo(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      var typeInfo; // If mapping is already a type info, do nothing

      if (mapping instanceof Jsonix.Model.TypeInfo) {
        typeInfo = mapping;
      } // Else create it via generic mapping configuration
      else {
          mapping = Jsonix.Util.Type.cloneObject(mapping);
          var type = mapping.type || mapping.t || 'classInfo'; // Locate the creator function

          if (Jsonix.Util.Type.isFunction(this.typeInfoCreators[type])) {
            var typeInfoCreator = this.typeInfoCreators[type]; // Call the creator function

            typeInfo = typeInfoCreator.call(this, mapping);
          } else {
            throw new Error("Unknown type info type [" + type + "].");
          }
        }

      return typeInfo;
    },
    initializeNames: function initializeNames(mapping) {
      var ln = mapping.localName || mapping.ln || null;
      mapping.localName = ln;
      var n = mapping.name || mapping.n || null;
      mapping.name = n; // Calculate both name as well as localName
      // name is provided

      if (Jsonix.Util.Type.isString(mapping.name)) {
        // Obsolete code below
        // // localName is not provided
        // if (!Jsonix.Util.Type.isString(mapping.localName)) {
        // // But module name is provided
        // if (Jsonix.Util.Type.isString(this.name)) {
        // // If name starts with module name, use second part
        // // as local name
        // if (mapping.name.indexOf(this.name + '.') === 0) {
        // mapping.localName = mapping.name
        // .substring(this.name.length + 1);
        // }
        // // Else use name as local name
        // else {
        // mapping.localName = mapping.name;
        // }
        // }
        // // Module name is not provided, use name as local name
        // else {
        // mapping.localName = mapping.name;
        // }
        // }
        if (mapping.name.length > 0 && mapping.name.charAt(0) === '.' && Jsonix.Util.Type.isString(this.name)) {
          mapping.name = this.name + mapping.name;
        }
      } // name is not provided but local name is provided
      else if (Jsonix.Util.Type.isString(ln)) {
          // Module name is provided
          if (Jsonix.Util.Type.isString(this.name)) {
            mapping.name = this.name + '.' + ln;
          } // Module name is not provided
          else {
              mapping.name = ln;
            }
        } else {
          throw new Error("Neither [name/n] nor [localName/ln] was provided for the class info.");
        }
    },
    createClassInfo: function createClassInfo(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      var dens = mapping.defaultElementNamespaceURI || mapping.dens || this.defaultElementNamespaceURI;
      mapping.defaultElementNamespaceURI = dens;
      var tns = mapping.targetNamespace || mapping.tns || this.targetNamespace;
      mapping.targetNamespace = tns;
      var dans = mapping.defaultAttributeNamespaceURI || mapping.dans || this.defaultAttributeNamespaceURI;
      mapping.defaultAttributeNamespaceURI = dans;
      this.initializeNames(mapping); // Now both name an local name are initialized

      var classInfo = new this.mappingStyle.classInfo(mapping, {
        mappingStyle: this.mappingStyle
      });
      classInfo.module = this;
      return classInfo;
    },
    createEnumLeafInfo: function createEnumLeafInfo(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      this.initializeNames(mapping); // Now both name an local name are initialized

      var enumLeafInfo = new this.mappingStyle.enumLeafInfo(mapping, {
        mappingStyle: this.mappingStyle
      });
      enumLeafInfo.module = this;
      return enumLeafInfo;
    },
    createList: function createList(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      var ti = mapping.baseTypeInfo || mapping.typeInfo || mapping.bti || mapping.ti || 'String';
      var tn = mapping.typeName || mapping.tn || null;

      if (Jsonix.Util.Type.exists(tn)) {
        if (Jsonix.Util.Type.isString(tn)) {
          tn = new Jsonix.XML.QName(this.targetNamespace, tn);
        } else {
          tn = Jsonix.XML.QName.fromObject(tn);
        }
      }

      var s = mapping.separator || mapping.sep || ' ';
      Jsonix.Util.Ensure.ensureExists(ti);
      var listTypeInfo = new Jsonix.Schema.XSD.List(ti, tn, s);
      listTypeInfo.module = this;
      return listTypeInfo;
    },
    createElementInfo: function createElementInfo(mapping) {
      Jsonix.Util.Ensure.ensureObject(mapping);
      mapping = Jsonix.Util.Type.cloneObject(mapping);
      var dens = mapping.defaultElementNamespaceURI || mapping.dens || this.defaultElementNamespaceURI;
      mapping.defaultElementNamespaceURI = dens;
      var en = mapping.elementName || mapping.en || undefined;
      Jsonix.Util.Ensure.ensureExists(en);
      var ti = mapping.typeInfo || mapping.ti || 'String';
      Jsonix.Util.Ensure.ensureExists(ti);
      mapping.typeInfo = ti;

      if (Jsonix.Util.Type.isObject(en)) {
        mapping.elementName = Jsonix.XML.QName.fromObject(en);
      } else if (Jsonix.Util.Type.isString(en)) {
        mapping.elementName = new Jsonix.XML.QName(this.defaultElementNamespaceURI, en);
      } else {
        throw new Error('Element info [' + mapping + '] must provide an element name.');
      }

      var sh = mapping.substitutionHead || mapping.sh || null;

      if (Jsonix.Util.Type.exists(sh)) {
        if (Jsonix.Util.Type.isObject(sh)) {
          mapping.substitutionHead = Jsonix.XML.QName.fromObject(sh);
        } else {
          Jsonix.Util.Ensure.ensureString(sh);
          mapping.substitutionHead = new Jsonix.XML.QName(this.defaultElementNamespaceURI, sh);
        }
      }

      var elementInfo = new this.mappingStyle.elementInfo(mapping, {
        mappingStyle: this.mappingStyle
      });
      elementInfo.module = this;
      return elementInfo;
    },
    registerTypeInfos: function registerTypeInfos(context) {
      for (var index = 0; index < this.typeInfos.length; index++) {
        var typeInfo = this.typeInfos[index];
        context.registerTypeInfo(typeInfo, this);
      }
    },
    buildTypeInfos: function buildTypeInfos(context) {
      for (var index = 0; index < this.typeInfos.length; index++) {
        var typeInfo = this.typeInfos[index];
        typeInfo.build(context, this);
      }
    },
    registerElementInfos: function registerElementInfos(context) {
      for (var index = 0; index < this.elementInfos.length; index++) {
        var elementInfo = this.elementInfos[index];
        context.registerElementInfo(elementInfo, this);
      }
    },
    buildElementInfos: function buildElementInfos(context) {
      for (var index = 0; index < this.elementInfos.length; index++) {
        var elementInfo = this.elementInfos[index];
        elementInfo.build(context, this);
      }
    },
    // Obsolete, retained for backwards compatibility
    cs: function cs() {
      return this;
    },
    // Obsolete, retained for backwards compatibility
    es: function es() {
      return this;
    },
    CLASS_NAME: 'Jsonix.Model.Module'
  });
  Jsonix.Model.Module.prototype.typeInfoCreators = {
    "classInfo": Jsonix.Model.Module.prototype.createClassInfo,
    "c": Jsonix.Model.Module.prototype.createClassInfo,
    "enumInfo": Jsonix.Model.Module.prototype.createEnumLeafInfo,
    "enum": Jsonix.Model.Module.prototype.createEnumLeafInfo,
    "list": Jsonix.Model.Module.prototype.createList,
    "l": Jsonix.Model.Module.prototype.createList
  };
  Jsonix.Mapping.Style.Standard = Jsonix.Class(Jsonix.Mapping.Style, {
    marshaller: Jsonix.Binding.Marshaller,
    unmarshaller: Jsonix.Binding.Unmarshaller,
    module: Jsonix.Model.Module,
    elementInfo: Jsonix.Model.ElementInfo,
    classInfo: Jsonix.Model.ClassInfo,
    enumLeafInfo: Jsonix.Model.EnumLeafInfo,
    anyAttributePropertyInfo: Jsonix.Model.AnyAttributePropertyInfo,
    anyElementPropertyInfo: Jsonix.Model.AnyElementPropertyInfo,
    attributePropertyInfo: Jsonix.Model.AttributePropertyInfo,
    elementMapPropertyInfo: Jsonix.Model.ElementMapPropertyInfo,
    elementPropertyInfo: Jsonix.Model.ElementPropertyInfo,
    elementsPropertyInfo: Jsonix.Model.ElementsPropertyInfo,
    elementRefPropertyInfo: Jsonix.Model.ElementRefPropertyInfo,
    elementRefsPropertyInfo: Jsonix.Model.ElementRefsPropertyInfo,
    valuePropertyInfo: Jsonix.Model.ValuePropertyInfo,
    initialize: function initialize() {
      Jsonix.Mapping.Style.prototype.initialize.apply(this);
    },
    CLASS_NAME: 'Jsonix.Mapping.Style.Standard'
  });
  Jsonix.Mapping.Style.STYLES.standard = new Jsonix.Mapping.Style.Standard();
  Jsonix.Mapping.Style.Simplified = Jsonix.Class(Jsonix.Mapping.Style, {
    marshaller: Jsonix.Binding.Marshaller.Simplified,
    unmarshaller: Jsonix.Binding.Unmarshaller.Simplified,
    module: Jsonix.Model.Module,
    elementInfo: Jsonix.Model.ElementInfo,
    classInfo: Jsonix.Model.ClassInfo,
    enumLeafInfo: Jsonix.Model.EnumLeafInfo,
    anyAttributePropertyInfo: Jsonix.Model.AnyAttributePropertyInfo.Simplified,
    anyElementPropertyInfo: Jsonix.Model.AnyElementPropertyInfo.Simplified,
    attributePropertyInfo: Jsonix.Model.AttributePropertyInfo,
    elementMapPropertyInfo: Jsonix.Model.ElementMapPropertyInfo,
    elementPropertyInfo: Jsonix.Model.ElementPropertyInfo,
    elementsPropertyInfo: Jsonix.Model.ElementsPropertyInfo,
    elementRefPropertyInfo: Jsonix.Model.ElementRefPropertyInfo.Simplified,
    elementRefsPropertyInfo: Jsonix.Model.ElementRefsPropertyInfo.Simplified,
    valuePropertyInfo: Jsonix.Model.ValuePropertyInfo,
    initialize: function initialize() {
      Jsonix.Mapping.Style.prototype.initialize.apply(this);
    },
    CLASS_NAME: 'Jsonix.Mapping.Style.Simplified'
  });
  Jsonix.Mapping.Style.STYLES.simplified = new Jsonix.Mapping.Style.Simplified();
  Jsonix.Schema.XSD = {};
  Jsonix.Schema.XSD.NAMESPACE_URI = 'http://www.w3.org/2001/XMLSchema';
  Jsonix.Schema.XSD.PREFIX = 'xsd';

  Jsonix.Schema.XSD.qname = function (localPart) {
    Jsonix.Util.Ensure.ensureString(localPart);
    return new Jsonix.XML.QName(Jsonix.Schema.XSD.NAMESPACE_URI, localPart, Jsonix.Schema.XSD.PREFIX);
  };

  Jsonix.Schema.XSD.AnyType = Jsonix.Class(Jsonix.Model.ClassInfo, {
    typeName: Jsonix.Schema.XSD.qname('anyType'),
    initialize: function initialize() {
      Jsonix.Model.ClassInfo.prototype.initialize.call(this, {
        name: 'AnyType',
        propertyInfos: [{
          type: 'anyAttribute',
          name: 'attributes'
        }, {
          type: 'anyElement',
          name: 'content',
          collection: true
        }]
      });
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.AnyType'
  });
  Jsonix.Schema.XSD.AnyType.INSTANCE = new Jsonix.Schema.XSD.AnyType();
  Jsonix.Schema.XSD.AnySimpleType = Jsonix.Class(Jsonix.Model.TypeInfo, {
    name: 'AnySimpleType',
    typeName: Jsonix.Schema.XSD.qname('anySimpleType'),
    initialize: function initialize() {
      Jsonix.Model.TypeInfo.prototype.initialize.apply(this, []);
    },
    print: function print(value, context, output, scope) {
      return value;
    },
    parse: function parse(text, context, input, scope) {
      return text;
    },
    isInstance: function isInstance(value, context, scope) {
      return true;
    },
    reprint: function reprint(value, context, output, scope) {
      // Only reprint when the value is a string but not an instance
      if (Jsonix.Util.Type.isString(value) && !this.isInstance(value, context, scope)) {
        // Using null as input as input is not available
        return this.print(this.parse(value, context, null, scope), context, output, scope);
      } else {
        return this.print(value, context, output, scope);
      }
    },
    unmarshal: function unmarshal(context, input, scope) {
      var text = input.getElementText();

      if (Jsonix.Util.StringUtils.isNotBlank(text)) {
        return this.parse(text, context, input, scope);
      } else {
        return null;
      }
    },
    marshal: function marshal(value, context, output, scope) {
      if (Jsonix.Util.Type.exists(value)) {
        output.writeCharacters(this.reprint(value, context, output, scope));
      }
    },
    build: function build(context, module) {// Nothing to do
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.AnySimpleType'
  });
  Jsonix.Schema.XSD.AnySimpleType.INSTANCE = new Jsonix.Schema.XSD.AnySimpleType();
  Jsonix.Schema.XSD.List = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: null,
    typeName: null,
    typeInfo: null,
    separator: ' ',
    trimmedSeparator: Jsonix.Util.StringUtils.whitespaceCharacters,
    simpleType: true,
    built: false,
    initialize: function initialize(typeInfo, typeName, separator) {
      Jsonix.Util.Ensure.ensureExists(typeInfo); // TODO Ensure correct argument

      this.typeInfo = typeInfo;

      if (!Jsonix.Util.Type.exists(this.name)) {
        this.name = typeInfo.name + "*";
      }

      if (Jsonix.Util.Type.exists(typeName)) {
        // TODO Ensure correct argument
        this.typeName = typeName;
      }

      if (Jsonix.Util.Type.isString(separator)) {
        // TODO Ensure correct argument
        this.separator = separator;
      } else {
        this.separator = ' ';
      }

      var trimmedSeparator = Jsonix.Util.StringUtils.trim(this.separator);

      if (trimmedSeparator.length === 0) {
        this.trimmedSeparator = Jsonix.Util.StringUtils.whitespaceCharacters;
      } else {
        this.trimmedSeparator = trimmedSeparator;
      }
    },
    build: function build(context) {
      if (!this.built) {
        this.typeInfo = context.resolveTypeInfo(this.typeInfo, this.module);
        this.built = true;
      }
    },
    print: function print(value, context, output, scope) {
      if (!Jsonix.Util.Type.exists(value)) {
        return null;
      } // TODO Exception if not an array


      Jsonix.Util.Ensure.ensureArray(value);
      var result = '';

      for (var index = 0; index < value.length; index++) {
        if (index > 0) {
          result = result + this.separator;
        }

        result = result + this.typeInfo.reprint(value[index], context, output, scope);
      }

      return result;
    },
    parse: function parse(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);
      var items = Jsonix.Util.StringUtils.splitBySeparatorChars(text, this.trimmedSeparator);
      var result = [];

      for (var index = 0; index < items.length; index++) {
        result.push(this.typeInfo.parse(Jsonix.Util.StringUtils.trim(items[index]), context, input, scope));
      }

      return result;
    },
    // TODO isInstance?
    CLASS_NAME: 'Jsonix.Schema.XSD.List'
  });
  Jsonix.Schema.XSD.String = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: 'String',
    typeName: Jsonix.Schema.XSD.qname('string'),
    unmarshal: function unmarshal(context, input, scope) {
      var text = input.getElementText();
      return this.parse(text, context, input, scope);
    },
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureString(value);
      return value;
    },
    parse: function parse(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);
      return text;
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isString(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.String'
  });
  Jsonix.Schema.XSD.String.INSTANCE = new Jsonix.Schema.XSD.String();
  Jsonix.Schema.XSD.String.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.String.INSTANCE);
  Jsonix.Schema.XSD.Strings = Jsonix.Class(Jsonix.Schema.XSD.List, {
    name: 'Strings',
    initialize: function initialize() {
      Jsonix.Schema.XSD.List.prototype.initialize.apply(this, [Jsonix.Schema.XSD.String.INSTANCE, Jsonix.Schema.XSD.qname('strings'), ' ']);
    },
    // TODO Constraints
    CLASS_NAME: 'Jsonix.Schema.XSD.Strings'
  });
  Jsonix.Schema.XSD.Strings.INSTANCE = new Jsonix.Schema.XSD.Strings();
  Jsonix.Schema.XSD.NormalizedString = Jsonix.Class(Jsonix.Schema.XSD.String, {
    name: 'NormalizedString',
    typeName: Jsonix.Schema.XSD.qname('normalizedString'),
    // TODO Constraints
    CLASS_NAME: 'Jsonix.Schema.XSD.NormalizedString'
  });
  Jsonix.Schema.XSD.NormalizedString.INSTANCE = new Jsonix.Schema.XSD.NormalizedString();
  Jsonix.Schema.XSD.NormalizedString.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.NormalizedString.INSTANCE);
  Jsonix.Schema.XSD.Token = Jsonix.Class(Jsonix.Schema.XSD.NormalizedString, {
    name: 'Token',
    typeName: Jsonix.Schema.XSD.qname('token'),
    // TODO Constraints
    CLASS_NAME: 'Jsonix.Schema.XSD.Token'
  });
  Jsonix.Schema.XSD.Token.INSTANCE = new Jsonix.Schema.XSD.Token();
  Jsonix.Schema.XSD.Token.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Token.INSTANCE);
  Jsonix.Schema.XSD.Language = Jsonix.Class(Jsonix.Schema.XSD.Token, {
    name: 'Language',
    typeName: Jsonix.Schema.XSD.qname('language'),
    // TODO Constraints
    CLASS_NAME: 'Jsonix.Schema.XSD.Language'
  });
  Jsonix.Schema.XSD.Language.INSTANCE = new Jsonix.Schema.XSD.Language();
  Jsonix.Schema.XSD.Language.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Language.INSTANCE);
  Jsonix.Schema.XSD.Name = Jsonix.Class(Jsonix.Schema.XSD.Token, {
    name: 'Name',
    typeName: Jsonix.Schema.XSD.qname('Name'),
    // TODO Constraints
    CLASS_NAME: 'Jsonix.Schema.XSD.Name'
  });
  Jsonix.Schema.XSD.Name.INSTANCE = new Jsonix.Schema.XSD.Name();
  Jsonix.Schema.XSD.Name.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Name.INSTANCE);
  Jsonix.Schema.XSD.NCName = Jsonix.Class(Jsonix.Schema.XSD.Name, {
    name: 'NCName',
    typeName: Jsonix.Schema.XSD.qname('NCName'),
    // TODO Constraints
    CLASS_NAME: 'Jsonix.Schema.XSD.NCName'
  });
  Jsonix.Schema.XSD.NCName.INSTANCE = new Jsonix.Schema.XSD.NCName();
  Jsonix.Schema.XSD.NCName.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.NCName.INSTANCE);
  Jsonix.Schema.XSD.NMToken = Jsonix.Class(Jsonix.Schema.XSD.Token, {
    name: 'NMToken',
    typeName: Jsonix.Schema.XSD.qname('NMTOKEN'),
    // TODO Constraints
    CLASS_NAME: 'Jsonix.Schema.XSD.NMToken'
  });
  Jsonix.Schema.XSD.NMToken.INSTANCE = new Jsonix.Schema.XSD.NMToken();
  Jsonix.Schema.XSD.NMTokens = Jsonix.Class(Jsonix.Schema.XSD.List, {
    name: 'NMTokens',
    initialize: function initialize() {
      Jsonix.Schema.XSD.List.prototype.initialize.apply(this, [Jsonix.Schema.XSD.NMToken.INSTANCE, Jsonix.Schema.XSD.qname('NMTOKEN'), ' ']);
    },
    // TODO Constraints
    CLASS_NAME: 'Jsonix.Schema.XSD.NMTokens'
  });
  Jsonix.Schema.XSD.NMTokens.INSTANCE = new Jsonix.Schema.XSD.NMTokens();
  Jsonix.Schema.XSD.Boolean = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: 'Boolean',
    typeName: Jsonix.Schema.XSD.qname('boolean'),
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureBoolean(value);
      return value ? 'true' : 'false';
    },
    parse: function parse(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);

      if (text === 'true' || text === '1') {
        return true;
      } else if (text === 'false' || text === '0') {
        return false;
      } else {
        throw new Error("Either [true], [1], [0] or [false] expected as boolean value.");
      }
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isBoolean(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.Boolean'
  });
  Jsonix.Schema.XSD.Boolean.INSTANCE = new Jsonix.Schema.XSD.Boolean();
  Jsonix.Schema.XSD.Boolean.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Boolean.INSTANCE);
  Jsonix.Schema.XSD.Base64Binary = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: 'Base64Binary',
    typeName: Jsonix.Schema.XSD.qname('base64Binary'),
    charToByte: {},
    byteToChar: [],
    initialize: function initialize() {
      Jsonix.Schema.XSD.AnySimpleType.prototype.initialize.apply(this); // Initialize charToByte and byteToChar table for fast
      // lookups

      var charTable = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

      for (var i = 0; i < charTable.length; i++) {
        var _char = charTable.charAt(i);

        var _byte = charTable.charCodeAt(i);

        this.byteToChar[i] = _char;
        this.charToByte[_char] = i;
      }
    },
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureArray(value);
      return this.encode(value);
    },
    parse: function parse(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);
      return this.decode(text);
    },
    encode: function encode(uarray) {
      var output = "";
      var byte0;
      var byte1;
      var byte2;
      var char0;
      var char1;
      var char2;
      var char3;
      var i = 0;
      var j = 0;
      var length = uarray.length;

      for (i = 0; i < length; i += 3) {
        byte0 = uarray[i] & 0xFF;
        char0 = this.byteToChar[byte0 >> 2];

        if (i + 1 < length) {
          byte1 = uarray[i + 1] & 0xFF;
          char1 = this.byteToChar[(byte0 & 0x03) << 4 | byte1 >> 4];

          if (i + 2 < length) {
            byte2 = uarray[i + 2] & 0xFF;
            char2 = this.byteToChar[(byte1 & 0x0F) << 2 | byte2 >> 6];
            char3 = this.byteToChar[byte2 & 0x3F];
          } else {
            char2 = this.byteToChar[(byte1 & 0x0F) << 2];
            char3 = "=";
          }
        } else {
          char1 = this.byteToChar[(byte0 & 0x03) << 4];
          char2 = "=";
          char3 = "=";
        }

        output = output + char0 + char1 + char2 + char3;
      }

      return output;
    },
    decode: function decode(text) {
      input = text.replace(/[^A-Za-z0-9\+\/\=]/g, "");
      var length = Math.floor(input.length / 4 * 3);

      if (input.charAt(input.length - 1) === "=") {
        length--;
      }

      if (input.charAt(input.length - 2) === "=") {
        length--;
      }

      var uarray = new Array(length);
      var byte0;
      var byte1;
      var byte2;
      var char0;
      var char1;
      var char2;
      var char3;
      var i = 0;
      var j = 0;

      for (i = 0; i < length; i += 3) {
        // get the 3 octects in 4 ascii chars
        char0 = this.charToByte[input.charAt(j++)];
        char1 = this.charToByte[input.charAt(j++)];
        char2 = this.charToByte[input.charAt(j++)];
        char3 = this.charToByte[input.charAt(j++)];
        byte0 = char0 << 2 | char1 >> 4;
        byte1 = (char1 & 0x0F) << 4 | char2 >> 2;
        byte2 = (char2 & 0x03) << 6 | char3;
        uarray[i] = byte0;

        if (char2 != 64) {
          uarray[i + 1] = byte1;
        }

        if (char3 != 64) {
          uarray[i + 2] = byte2;
        }
      }

      return uarray;
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isArray(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.Base64Binary'
  });
  Jsonix.Schema.XSD.Base64Binary.INSTANCE = new Jsonix.Schema.XSD.Base64Binary();
  Jsonix.Schema.XSD.Base64Binary.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Base64Binary.INSTANCE);
  Jsonix.Schema.XSD.HexBinary = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: 'HexBinary',
    typeName: Jsonix.Schema.XSD.qname('hexBinary'),
    charToQuartet: {},
    byteToDuplet: [],
    initialize: function initialize() {
      Jsonix.Schema.XSD.AnySimpleType.prototype.initialize.apply(this);
      var charTableUpperCase = "0123456789ABCDEF";
      var charTableLowerCase = charTableUpperCase.toLowerCase();
      var i;

      for (i = 0; i < 16; i++) {
        this.charToQuartet[charTableUpperCase.charAt(i)] = i;

        if (i >= 0xA) {
          this.charToQuartet[charTableLowerCase.charAt(i)] = i;
        }
      }

      for (i = 0; i < 256; i++) {
        this.byteToDuplet[i] = //
        charTableUpperCase[i >> 4] + charTableUpperCase[i & 0xF];
      }
    },
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureArray(value);
      return this.encode(value);
    },
    parse: function parse(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);
      return this.decode(text);
    },
    encode: function encode(uarray) {
      var output = "";

      for (var i = 0; i < uarray.length; i++) {
        output = output + this.byteToDuplet[uarray[i] & 0xFF];
      }

      return output;
    },
    decode: function decode(text) {
      var input = text.replace(/[^A-Fa-f0-9]/g, ""); // Round by two

      var length = input.length >> 1;
      var uarray = new Array(length);

      for (var i = 0; i < length; i++) {
        var char0 = input.charAt(2 * i);
        var char1 = input.charAt(2 * i + 1);
        uarray[i] = this.charToQuartet[char0] << 4 | this.charToQuartet[char1];
      }

      return uarray;
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isArray(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.HexBinary'
  });
  Jsonix.Schema.XSD.HexBinary.INSTANCE = new Jsonix.Schema.XSD.HexBinary();
  Jsonix.Schema.XSD.HexBinary.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.HexBinary.INSTANCE);
  Jsonix.Schema.XSD.Number = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: 'Number',
    typeName: Jsonix.Schema.XSD.qname('number'),
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureNumberOrNaN(value);

      if (Jsonix.Util.Type.isNaN(value)) {
        return 'NaN';
      } else if (value === Infinity) {
        return 'INF';
      } else if (value === -Infinity) {
        return '-INF';
      } else {
        var text = String(value);
        return text;
      }
    },
    parse: function parse(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);

      if (text === '-INF') {
        return -Infinity;
      } else if (text === 'INF') {
        return Infinity;
      } else if (text === 'NaN') {
        return NaN;
      } else {
        var value = Number(text);
        Jsonix.Util.Ensure.ensureNumber(value);
        return value;
      }
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isNumberOrNaN(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.Number'
  });
  Jsonix.Schema.XSD.Number.INSTANCE = new Jsonix.Schema.XSD.Number();
  Jsonix.Schema.XSD.Number.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Number.INSTANCE);
  Jsonix.Schema.XSD.Float = Jsonix.Class(Jsonix.Schema.XSD.Number, {
    name: 'Float',
    typeName: Jsonix.Schema.XSD.qname('float'),
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isNaN(value) || value === -Infinity || value === Infinity || Jsonix.Util.Type.isNumber(value) && value >= this.MIN_VALUE && value <= this.MAX_VALUE;
    },
    MIN_VALUE: -3.4028235e+38,
    MAX_VALUE: 3.4028235e+38,
    CLASS_NAME: 'Jsonix.Schema.XSD.Float'
  });
  Jsonix.Schema.XSD.Float.INSTANCE = new Jsonix.Schema.XSD.Float();
  Jsonix.Schema.XSD.Float.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Float.INSTANCE);
  Jsonix.Schema.XSD.Decimal = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: 'Decimal',
    typeName: Jsonix.Schema.XSD.qname('decimal'),
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureNumber(value);
      var text = String(value);
      return text;
    },
    parse: function parse(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);
      var value = Number(text);
      Jsonix.Util.Ensure.ensureNumber(value);
      return value;
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isNumber(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.Decimal'
  });
  Jsonix.Schema.XSD.Decimal.INSTANCE = new Jsonix.Schema.XSD.Decimal();
  Jsonix.Schema.XSD.Decimal.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Decimal.INSTANCE);
  Jsonix.Schema.XSD.Integer = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: 'Integer',
    typeName: Jsonix.Schema.XSD.qname('integer'),
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureInteger(value);
      var text = String(value);
      return text;
    },
    parse: function parse(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);
      var value = Number(text);
      Jsonix.Util.Ensure.ensureInteger(value);
      return value;
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.NumberUtils.isInteger(value) && value >= this.MIN_VALUE && value <= this.MAX_VALUE;
    },
    MIN_VALUE: -9223372036854775808,
    MAX_VALUE: 9223372036854775807,
    CLASS_NAME: 'Jsonix.Schema.XSD.Integer'
  });
  Jsonix.Schema.XSD.Integer.INSTANCE = new Jsonix.Schema.XSD.Integer();
  Jsonix.Schema.XSD.Integer.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Integer.INSTANCE);
  Jsonix.Schema.XSD.NonPositiveInteger = Jsonix.Class(Jsonix.Schema.XSD.Integer, {
    name: 'NonPositiveInteger',
    typeName: Jsonix.Schema.XSD.qname('nonPositiveInteger'),
    MIN_VALUE: -9223372036854775808,
    MAX_VALUE: 0,
    CLASS_NAME: 'Jsonix.Schema.XSD.NonPositiveInteger'
  });
  Jsonix.Schema.XSD.NonPositiveInteger.INSTANCE = new Jsonix.Schema.XSD.NonPositiveInteger();
  Jsonix.Schema.XSD.NonPositiveInteger.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.NonPositiveInteger.INSTANCE);
  Jsonix.Schema.XSD.NegativeInteger = Jsonix.Class(Jsonix.Schema.XSD.NonPositiveInteger, {
    name: 'NegativeInteger',
    typeName: Jsonix.Schema.XSD.qname('negativeInteger'),
    MIN_VALUE: -9223372036854775808,
    MAX_VALUE: -1,
    CLASS_NAME: 'Jsonix.Schema.XSD.NegativeInteger'
  });
  Jsonix.Schema.XSD.NegativeInteger.INSTANCE = new Jsonix.Schema.XSD.NegativeInteger();
  Jsonix.Schema.XSD.NegativeInteger.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.NegativeInteger.INSTANCE);
  Jsonix.Schema.XSD.Long = Jsonix.Class(Jsonix.Schema.XSD.Integer, {
    name: 'Long',
    typeName: Jsonix.Schema.XSD.qname('long'),
    MIN_VALUE: -9223372036854775808,
    MAX_VALUE: 9223372036854775807,
    CLASS_NAME: 'Jsonix.Schema.XSD.Long'
  });
  Jsonix.Schema.XSD.Long.INSTANCE = new Jsonix.Schema.XSD.Long();
  Jsonix.Schema.XSD.Long.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Long.INSTANCE);
  Jsonix.Schema.XSD.Int = Jsonix.Class(Jsonix.Schema.XSD.Long, {
    name: 'Int',
    typeName: Jsonix.Schema.XSD.qname('int'),
    MIN_VALUE: -2147483648,
    MAX_VALUE: 2147483647,
    CLASS_NAME: 'Jsonix.Schema.XSD.Int'
  });
  Jsonix.Schema.XSD.Int.INSTANCE = new Jsonix.Schema.XSD.Int();
  Jsonix.Schema.XSD.Int.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Int.INSTANCE);
  Jsonix.Schema.XSD.Short = Jsonix.Class(Jsonix.Schema.XSD.Int, {
    name: 'Short',
    typeName: Jsonix.Schema.XSD.qname('short'),
    MIN_VALUE: -32768,
    MAX_VALUE: 32767,
    CLASS_NAME: 'Jsonix.Schema.XSD.Short'
  });
  Jsonix.Schema.XSD.Short.INSTANCE = new Jsonix.Schema.XSD.Short();
  Jsonix.Schema.XSD.Short.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Short.INSTANCE);
  Jsonix.Schema.XSD.Byte = Jsonix.Class(Jsonix.Schema.XSD.Short, {
    name: 'Byte',
    typeName: Jsonix.Schema.XSD.qname('byte'),
    MIN_VALUE: -128,
    MAX_VALUE: 127,
    CLASS_NAME: 'Jsonix.Schema.XSD.Byte'
  });
  Jsonix.Schema.XSD.Byte.INSTANCE = new Jsonix.Schema.XSD.Byte();
  Jsonix.Schema.XSD.Byte.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Byte.INSTANCE);
  Jsonix.Schema.XSD.NonNegativeInteger = Jsonix.Class(Jsonix.Schema.XSD.Integer, {
    name: 'NonNegativeInteger',
    typeName: Jsonix.Schema.XSD.qname('nonNegativeInteger'),
    MIN_VALUE: 0,
    MAX_VALUE: 9223372036854775807,
    CLASS_NAME: 'Jsonix.Schema.XSD.NonNegativeInteger'
  });
  Jsonix.Schema.XSD.NonNegativeInteger.INSTANCE = new Jsonix.Schema.XSD.NonNegativeInteger();
  Jsonix.Schema.XSD.NonNegativeInteger.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.NonNegativeInteger.INSTANCE);
  Jsonix.Schema.XSD.UnsignedLong = Jsonix.Class(Jsonix.Schema.XSD.NonNegativeInteger, {
    name: 'UnsignedLong',
    typeName: Jsonix.Schema.XSD.qname('unsignedLong'),
    MIN_VALUE: 0,
    MAX_VALUE: 18446744073709551615,
    CLASS_NAME: 'Jsonix.Schema.XSD.UnsignedLong'
  });
  Jsonix.Schema.XSD.UnsignedLong.INSTANCE = new Jsonix.Schema.XSD.UnsignedLong();
  Jsonix.Schema.XSD.UnsignedLong.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.UnsignedLong.INSTANCE);
  Jsonix.Schema.XSD.UnsignedInt = Jsonix.Class(Jsonix.Schema.XSD.UnsignedLong, {
    name: 'UnsignedInt',
    typeName: Jsonix.Schema.XSD.qname('unsignedInt'),
    MIN_VALUE: 0,
    MAX_VALUE: 4294967295,
    CLASS_NAME: 'Jsonix.Schema.XSD.UnsignedInt'
  });
  Jsonix.Schema.XSD.UnsignedInt.INSTANCE = new Jsonix.Schema.XSD.UnsignedInt();
  Jsonix.Schema.XSD.UnsignedInt.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.UnsignedInt.INSTANCE);
  Jsonix.Schema.XSD.UnsignedShort = Jsonix.Class(Jsonix.Schema.XSD.UnsignedInt, {
    name: 'UnsignedShort',
    typeName: Jsonix.Schema.XSD.qname('unsignedShort'),
    MIN_VALUE: 0,
    MAX_VALUE: 65535,
    CLASS_NAME: 'Jsonix.Schema.XSD.UnsignedShort'
  });
  Jsonix.Schema.XSD.UnsignedShort.INSTANCE = new Jsonix.Schema.XSD.UnsignedShort();
  Jsonix.Schema.XSD.UnsignedShort.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.UnsignedShort.INSTANCE);
  Jsonix.Schema.XSD.UnsignedByte = Jsonix.Class(Jsonix.Schema.XSD.UnsignedShort, {
    name: 'UnsignedByte',
    typeName: Jsonix.Schema.XSD.qname('unsignedByte'),
    MIN_VALUE: 0,
    MAX_VALUE: 255,
    CLASS_NAME: 'Jsonix.Schema.XSD.UnsignedByte'
  });
  Jsonix.Schema.XSD.UnsignedByte.INSTANCE = new Jsonix.Schema.XSD.UnsignedByte();
  Jsonix.Schema.XSD.UnsignedByte.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.UnsignedByte.INSTANCE);
  Jsonix.Schema.XSD.PositiveInteger = Jsonix.Class(Jsonix.Schema.XSD.NonNegativeInteger, {
    name: 'PositiveInteger',
    typeName: Jsonix.Schema.XSD.qname('positiveInteger'),
    MIN_VALUE: 1,
    MAX_VALUE: 9223372036854775807,
    CLASS_NAME: 'Jsonix.Schema.XSD.PositiveInteger'
  });
  Jsonix.Schema.XSD.PositiveInteger.INSTANCE = new Jsonix.Schema.XSD.PositiveInteger();
  Jsonix.Schema.XSD.PositiveInteger.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.PositiveInteger.INSTANCE);
  Jsonix.Schema.XSD.Double = Jsonix.Class(Jsonix.Schema.XSD.Number, {
    name: 'Double',
    typeName: Jsonix.Schema.XSD.qname('double'),
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isNaN(value) || value === -Infinity || value === Infinity || Jsonix.Util.Type.isNumber(value) && value >= this.MIN_VALUE && value <= this.MAX_VALUE;
    },
    MIN_VALUE: -1.7976931348623157e+308,
    MAX_VALUE: 1.7976931348623157e+308,
    CLASS_NAME: 'Jsonix.Schema.XSD.Double'
  });
  Jsonix.Schema.XSD.Double.INSTANCE = new Jsonix.Schema.XSD.Double();
  Jsonix.Schema.XSD.Double.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Double.INSTANCE);
  Jsonix.Schema.XSD.AnyURI = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: 'AnyURI',
    typeName: Jsonix.Schema.XSD.qname('anyURI'),
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureString(value);
      return value;
    },
    parse: function parse(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);
      return text;
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isString(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.AnyURI'
  });
  Jsonix.Schema.XSD.AnyURI.INSTANCE = new Jsonix.Schema.XSD.AnyURI();
  Jsonix.Schema.XSD.AnyURI.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.AnyURI.INSTANCE);
  Jsonix.Schema.XSD.QName = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: 'QName',
    typeName: Jsonix.Schema.XSD.qname('QName'),
    print: function print(value, context, output, scope) {
      var qName = Jsonix.XML.QName.fromObject(value);
      var prefix;
      var localPart = qName.localPart;

      if (output) {
        // If QName does not provide the prefix, let it be generated
        prefix = output.getPrefix(qName.namespaceURI, qName.prefix || null);
        output.declareNamespace(qName.namespaceURI, prefix);
      } else {
        prefix = qName.prefix;
      }

      return !prefix ? localPart : prefix + ':' + localPart;
    },
    parse: function parse(value, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(value);
      value = Jsonix.Util.StringUtils.trim(value);
      var prefix;
      var localPart;
      var colonPosition = value.indexOf(':');

      if (colonPosition === -1) {
        prefix = '';
        localPart = value;
      } else if (colonPosition > 0 && colonPosition < value.length - 1) {
        prefix = value.substring(0, colonPosition);
        localPart = value.substring(colonPosition + 1);
      } else {
        throw new Error('Invalid QName [' + value + '].');
      }

      var namespaceContext = input || context || null;

      if (!namespaceContext) {
        return value;
      } else {
        var namespaceURI = namespaceContext.getNamespaceURI(prefix);

        if (Jsonix.Util.Type.isString(namespaceURI)) {
          return new Jsonix.XML.QName(namespaceURI, localPart, prefix);
        } else {
          throw new Error('Prefix [' + prefix + '] of the QName [' + value + '] is not bound in this context.');
        }
      }
    },
    isInstance: function isInstance(value, context, scope) {
      return value instanceof Jsonix.XML.QName || Jsonix.Util.Type.isObject(value) && Jsonix.Util.Type.isString(value.localPart || value.lp);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.QName'
  });
  Jsonix.Schema.XSD.QName.INSTANCE = new Jsonix.Schema.XSD.QName();
  Jsonix.Schema.XSD.QName.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.QName.INSTANCE);
  Jsonix.Schema.XSD.Calendar = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: 'Calendar',
    typeName: Jsonix.Schema.XSD.qname('calendar'),
    parse: function parse(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);

      if (text.match(new RegExp("^" + Jsonix.Schema.XSD.Calendar.DATETIME_PATTERN + "$"))) {
        return this.parseDateTime(text, context, input, scope);
      } else if (text.match(new RegExp("^" + Jsonix.Schema.XSD.Calendar.DATE_PATTERN + "$"))) {
        return this.parseDate(text, context, input, scope);
      } else if (text.match(new RegExp("^" + Jsonix.Schema.XSD.Calendar.TIME_PATTERN + "$"))) {
        return this.parseTime(text, context, input, scope);
      } else if (text.match(new RegExp("^" + Jsonix.Schema.XSD.Calendar.GYEAR_MONTH_PATTERN + "$"))) {
        return this.parseGYearMonth(text, context, input, scope);
      } else if (text.match(new RegExp("^" + Jsonix.Schema.XSD.Calendar.GYEAR_PATTERN + "$"))) {
        return this.parseGYear(text, context, input, scope);
      } else if (text.match(new RegExp("^" + Jsonix.Schema.XSD.Calendar.GMONTH_DAY_PATTERN + "$"))) {
        return this.parseGMonthDay(text, context, input, scope);
      } else if (text.match(new RegExp("^" + Jsonix.Schema.XSD.Calendar.GMONTH_PATTERN + "$"))) {
        return this.parseGMonth(text, context, input, scope);
      } else if (text.match(new RegExp("^" + Jsonix.Schema.XSD.Calendar.GDAY_PATTERN + "$"))) {
        return this.parseGDay(text, context, input, scope);
      } else {
        throw new Error('Value [' + text + '] does not match xs:dateTime, xs:date, xs:time, xs:gYearMonth, xs:gYear, xs:gMonthDay, xs:gMonth or xs:gDay patterns.');
      }
    },
    parseGYearMonth: function parseGYearMonth(value, context, input, scope) {
      var gYearMonthExpression = new RegExp("^" + Jsonix.Schema.XSD.Calendar.GYEAR_MONTH_PATTERN + "$");
      var results = value.match(gYearMonthExpression);

      if (results !== null) {
        var data = {
          year: parseInt(results[1], 10),
          month: parseInt(results[5], 10),
          timezone: this.parseTimezoneString(results[7])
        };
        return new Jsonix.XML.Calendar(data);
      }

      throw new Error('Value [' + value + '] does not match the xs:gYearMonth pattern.');
    },
    parseGYear: function parseGYear(value, context, input, scope) {
      var gYearExpression = new RegExp("^" + Jsonix.Schema.XSD.Calendar.GYEAR_PATTERN + "$");
      var results = value.match(gYearExpression);

      if (results !== null) {
        var data = {
          year: parseInt(results[1], 10),
          timezone: this.parseTimezoneString(results[5])
        };
        return new Jsonix.XML.Calendar(data);
      }

      throw new Error('Value [' + value + '] does not match the xs:gYear pattern.');
    },
    parseGMonthDay: function parseGMonthDay(value, context, input, scope) {
      var gMonthDayExpression = new RegExp("^" + Jsonix.Schema.XSD.Calendar.GMONTH_DAY_PATTERN + "$");
      var results = value.match(gMonthDayExpression);

      if (results !== null) {
        var data = {
          month: parseInt(results[2], 10),
          day: parseInt(results[3], 10),
          timezone: this.parseTimezoneString(results[5])
        };
        return new Jsonix.XML.Calendar(data);
      }

      throw new Error('Value [' + value + '] does not match the xs:gMonthDay pattern.');
    },
    parseGMonth: function parseGMonth(value, context, input, scope) {
      var gMonthExpression = new RegExp("^" + Jsonix.Schema.XSD.Calendar.GMONTH_PATTERN + "$");
      var results = value.match(gMonthExpression);

      if (results !== null) {
        var data = {
          month: parseInt(results[2], 10),
          timezone: this.parseTimezoneString(results[3])
        };
        return new Jsonix.XML.Calendar(data);
      }

      throw new Error('Value [' + value + '] does not match the xs:gMonth pattern.');
    },
    parseGDay: function parseGDay(value, context, input, scope) {
      var gDayExpression = new RegExp("^" + Jsonix.Schema.XSD.Calendar.GDAY_PATTERN + "$");
      var results = value.match(gDayExpression);

      if (results !== null) {
        var data = {
          day: parseInt(results[2], 10),
          timezone: this.parseTimezoneString(results[3])
        };
        return new Jsonix.XML.Calendar(data);
      }

      throw new Error('Value [' + value + '] does not match the xs:gDay pattern.');
    },
    parseDateTime: function parseDateTime(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);
      var expression = new RegExp("^" + Jsonix.Schema.XSD.Calendar.DATETIME_PATTERN + "$");
      var results = text.match(expression);

      if (results !== null) {
        var data = {
          year: parseInt(results[1], 10),
          month: parseInt(results[5], 10),
          day: parseInt(results[7], 10),
          hour: parseInt(results[9], 10),
          minute: parseInt(results[10], 10),
          second: parseInt(results[11], 10),
          fractionalSecond: results[12] ? parseFloat(results[12]) : 0,
          timezone: this.parseTimezoneString(results[14])
        };
        return new Jsonix.XML.Calendar(data);
      }

      throw new Error('Value [' + text + '] does not match the xs:date pattern.');
    },
    parseDate: function parseDate(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);
      var expression = new RegExp("^" + Jsonix.Schema.XSD.Calendar.DATE_PATTERN + "$");
      var results = text.match(expression);

      if (results !== null) {
        var data = {
          year: parseInt(results[1], 10),
          month: parseInt(results[5], 10),
          day: parseInt(results[7], 10),
          timezone: this.parseTimezoneString(results[9])
        };
        return new Jsonix.XML.Calendar(data);
      }

      throw new Error('Value [' + text + '] does not match the xs:date pattern.');
    },
    parseTime: function parseTime(text, context, input, scope) {
      Jsonix.Util.Ensure.ensureString(text);
      var expression = new RegExp("^" + Jsonix.Schema.XSD.Calendar.TIME_PATTERN + "$");
      var results = text.match(expression);

      if (results !== null) {
        var data = {
          hour: parseInt(results[1], 10),
          minute: parseInt(results[2], 10),
          second: parseInt(results[3], 10),
          fractionalSecond: results[4] ? parseFloat(results[4]) : 0,
          timezone: this.parseTimezoneString(results[6])
        };
        return new Jsonix.XML.Calendar(data);
      }

      throw new Error('Value [' + text + '] does not match the xs:time pattern.');
    },
    parseTimezoneString: function parseTimezoneString(text) {
      // (('+' | '-') hh ':' mm) | 'Z'
      if (!Jsonix.Util.Type.isString(text)) {
        return NaN;
      } else if (text === '') {
        return NaN;
      } else if (text === 'Z') {
        return 0;
      } else if (text === '+14:00') {
        return 14 * 60;
      } else if (text === '-14:00') {
        return -14 * 60;
      } else {
        var expression = new RegExp("^" + Jsonix.Schema.XSD.Calendar.TIMEZONE_PATTERN + "$");
        var results = text.match(expression);

        if (results !== null) {
          var sign = results[1] === '+' ? 1 : -1;
          var hour = parseInt(results[4], 10);
          var minute = parseInt(results[5], 10);
          return sign * (hour * 60 + minute);
        }

        throw new Error('Value [' + text + '] does not match the timezone pattern.');
      }
    },
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureObject(value);

      if (Jsonix.Util.NumberUtils.isInteger(value.year) && Jsonix.Util.NumberUtils.isInteger(value.month) && Jsonix.Util.NumberUtils.isInteger(value.day) && Jsonix.Util.NumberUtils.isInteger(value.hour) && Jsonix.Util.NumberUtils.isInteger(value.minute) && Jsonix.Util.NumberUtils.isInteger(value.second)) {
        return this.printDateTime(value);
      } else if (Jsonix.Util.NumberUtils.isInteger(value.year) && Jsonix.Util.NumberUtils.isInteger(value.month) && Jsonix.Util.NumberUtils.isInteger(value.day)) {
        return this.printDate(value);
      } else if (Jsonix.Util.NumberUtils.isInteger(value.hour) && Jsonix.Util.NumberUtils.isInteger(value.minute) && Jsonix.Util.NumberUtils.isInteger(value.second)) {
        return this.printTime(value);
      } else if (Jsonix.Util.NumberUtils.isInteger(value.year) && Jsonix.Util.NumberUtils.isInteger(value.month)) {
        return this.printGYearMonth(value);
      } else if (Jsonix.Util.NumberUtils.isInteger(value.month) && Jsonix.Util.NumberUtils.isInteger(value.day)) {
        return this.printGMonthDay(value);
      } else if (Jsonix.Util.NumberUtils.isInteger(value.year)) {
        return this.printGYear(value);
      } else if (Jsonix.Util.NumberUtils.isInteger(value.month)) {
        return this.printGMonth(value);
      } else if (Jsonix.Util.NumberUtils.isInteger(value.day)) {
        return this.printGDay(value);
      } else {
        throw new Error('Value [' + value + '] is not recognized as dateTime, date or time.');
      }
    },
    printDateTime: function printDateTime(value) {
      Jsonix.Util.Ensure.ensureObject(value);
      Jsonix.Util.Ensure.ensureInteger(value.year);
      Jsonix.Util.Ensure.ensureInteger(value.month);
      Jsonix.Util.Ensure.ensureInteger(value.day);
      Jsonix.Util.Ensure.ensureInteger(value.hour);
      Jsonix.Util.Ensure.ensureInteger(value.minute);
      Jsonix.Util.Ensure.ensureNumber(value.second);

      if (Jsonix.Util.Type.exists(value.fractionalString)) {
        Jsonix.Util.Ensure.ensureNumber(value.fractionalString);
      }

      if (Jsonix.Util.Type.exists(value.timezone) && !Jsonix.Util.Type.isNaN(value.timezone)) {
        Jsonix.Util.Ensure.ensureInteger(value.timezone);
      }

      var result = this.printDateString(value);
      result = result + 'T';
      result = result + this.printTimeString(value);

      if (Jsonix.Util.Type.exists(value.timezone)) {
        result = result + this.printTimezoneString(value.timezone);
      }

      return result;
    },
    printDate: function printDate(value) {
      Jsonix.Util.Ensure.ensureObject(value);
      Jsonix.Util.Ensure.ensureNumber(value.year);
      Jsonix.Util.Ensure.ensureNumber(value.month);
      Jsonix.Util.Ensure.ensureNumber(value.day);

      if (Jsonix.Util.Type.exists(value.timezone) && !Jsonix.Util.Type.isNaN(value.timezone)) {
        Jsonix.Util.Ensure.ensureInteger(value.timezone);
      }

      var result = this.printDateString(value);

      if (Jsonix.Util.Type.exists(value.timezone)) {
        result = result + this.printTimezoneString(value.timezone);
      }

      return result;
    },
    printTime: function printTime(value) {
      Jsonix.Util.Ensure.ensureObject(value);
      Jsonix.Util.Ensure.ensureNumber(value.hour);
      Jsonix.Util.Ensure.ensureNumber(value.minute);
      Jsonix.Util.Ensure.ensureNumber(value.second);

      if (Jsonix.Util.Type.exists(value.fractionalString)) {
        Jsonix.Util.Ensure.ensureNumber(value.fractionalString);
      }

      if (Jsonix.Util.Type.exists(value.timezone) && !Jsonix.Util.Type.isNaN(value.timezone)) {
        Jsonix.Util.Ensure.ensureInteger(value.timezone);
      }

      var result = this.printTimeString(value);

      if (Jsonix.Util.Type.exists(value.timezone)) {
        result = result + this.printTimezoneString(value.timezone);
      }

      return result;
    },
    printDateString: function printDateString(value) {
      Jsonix.Util.Ensure.ensureObject(value);
      Jsonix.Util.Ensure.ensureInteger(value.year);
      Jsonix.Util.Ensure.ensureInteger(value.month);
      Jsonix.Util.Ensure.ensureInteger(value.day);
      return (value.year < 0 ? '-' + this.printYear(-value.year) : this.printYear(value.year)) + '-' + this.printMonth(value.month) + '-' + this.printDay(value.day);
    },
    printTimeString: function printTimeString(value) {
      Jsonix.Util.Ensure.ensureObject(value);
      Jsonix.Util.Ensure.ensureInteger(value.hour);
      Jsonix.Util.Ensure.ensureInteger(value.minute);
      Jsonix.Util.Ensure.ensureInteger(value.second);

      if (Jsonix.Util.Type.exists(value.fractionalSecond)) {
        Jsonix.Util.Ensure.ensureNumber(value.fractionalSecond);
      }

      var result = this.printHour(value.hour);
      result = result + ':';
      result = result + this.printMinute(value.minute);
      result = result + ':';
      result = result + this.printSecond(value.second);

      if (Jsonix.Util.Type.exists(value.fractionalSecond)) {
        result = result + this.printFractionalSecond(value.fractionalSecond);
      }

      return result;
    },
    printTimezoneString: function printTimezoneString(value) {
      if (!Jsonix.Util.Type.exists(value) || Jsonix.Util.Type.isNaN(value)) {
        return '';
      } else {
        Jsonix.Util.Ensure.ensureInteger(value);
        var sign = value < 0 ? -1 : value > 0 ? 1 : 0;
        var data = value * sign;
        var minute = data % 60;
        var hour = Math.floor(data / 60);
        var result;

        if (sign === 0) {
          return 'Z';
        } else {
          if (sign > 0) {
            result = '+';
          } else if (sign < 0) {
            result = '-';
          }

          result = result + this.printHour(hour);
          result = result + ':';
          result = result + this.printMinute(minute);
          return result;
        }
      }
    },
    printGDay: function printGDay(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureObject(value);
      var day = undefined;
      var timezone = undefined;

      if (value instanceof Date) {
        day = value.getDate();
      } else {
        Jsonix.Util.Ensure.ensureInteger(value.day);
        day = value.day;
        timezone = value.timezone;
      }

      Jsonix.XML.Calendar.validateDay(day);
      Jsonix.XML.Calendar.validateTimezone(timezone);
      return "---" + this.printDay(day) + this.printTimezoneString(timezone);
    },
    printGMonth: function printGMonth(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureObject(value);
      var month = undefined;
      var timezone = undefined;

      if (value instanceof Date) {
        month = value.getMonth() + 1;
      } else {
        Jsonix.Util.Ensure.ensureInteger(value.month);
        month = value.month;
        timezone = value.timezone;
      }

      Jsonix.XML.Calendar.validateMonth(month);
      Jsonix.XML.Calendar.validateTimezone(timezone);
      return "--" + this.printMonth(month) + this.printTimezoneString(timezone);
    },
    printGMonthDay: function printGMonthDay(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureObject(value);
      var month = undefined;
      var day = undefined;
      var timezone = undefined;

      if (value instanceof Date) {
        month = value.getMonth() + 1;
        day = value.getDate();
      } else {
        Jsonix.Util.Ensure.ensureInteger(value.month);
        Jsonix.Util.Ensure.ensureInteger(value.day);
        month = value.month;
        day = value.day;
        timezone = value.timezone;
      }

      Jsonix.XML.Calendar.validateMonthDay(month, day);
      Jsonix.XML.Calendar.validateTimezone(timezone);
      return "--" + this.printMonth(month) + "-" + this.printDay(day) + this.printTimezoneString(timezone);
    },
    printGYear: function printGYear(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureObject(value);
      var year = undefined;
      var timezone = undefined;

      if (value instanceof Date) {
        year = value.getFullYear();
      } else {
        Jsonix.Util.Ensure.ensureInteger(value.year);
        year = value.year;
        timezone = value.timezone;
      }

      Jsonix.XML.Calendar.validateYear(year);
      Jsonix.XML.Calendar.validateTimezone(timezone);
      return this.printSignedYear(year) + this.printTimezoneString(timezone);
    },
    printGYearMonth: function printGYearMonth(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureObject(value);
      var year = undefined;
      var month = undefined;
      var timezone = undefined;

      if (value instanceof Date) {
        year = value.getFullYear();
        month = value.getMonth() + 1;
      } else {
        Jsonix.Util.Ensure.ensureInteger(value.year);
        year = value.year;
        month = value.month;
        timezone = value.timezone;
      }

      Jsonix.XML.Calendar.validateYear(year);
      Jsonix.XML.Calendar.validateMonth(month);
      Jsonix.XML.Calendar.validateTimezone(timezone);
      return this.printSignedYear(year) + "-" + this.printMonth(month) + this.printTimezoneString(timezone);
    },
    printSignedYear: function printSignedYear(value) {
      return value < 0 ? "-" + this.printYear(value * -1) : this.printYear(value);
    },
    printYear: function printYear(value) {
      return this.printInteger(value, 4);
    },
    printMonth: function printMonth(value) {
      return this.printInteger(value, 2);
    },
    printDay: function printDay(value) {
      return this.printInteger(value, 2);
    },
    printHour: function printHour(value) {
      return this.printInteger(value, 2);
    },
    printMinute: function printMinute(value) {
      return this.printInteger(value, 2);
    },
    printSecond: function printSecond(value) {
      return this.printInteger(value, 2);
    },
    printFractionalSecond: function printFractionalSecond(value) {
      Jsonix.Util.Ensure.ensureNumber(value);

      if (value < 0 || value >= 1) {
        throw new Error('Fractional second [' + value + '] must be between 0 and 1.');
      } else if (value === 0) {
        return '';
      } else {
        var string = String(value);
        var dotIndex = string.indexOf('.');

        if (dotIndex < 0) {
          return '';
        } else {
          return string.substring(dotIndex);
        }
      }
    },
    printInteger: function printInteger(value, length) {
      Jsonix.Util.Ensure.ensureInteger(value);
      Jsonix.Util.Ensure.ensureInteger(length);

      if (length <= 0) {
        throw new Error('Length [' + value + '] must be positive.');
      }

      if (value < 0) {
        throw new Error('Value [' + value + '] must not be negative.');
      }

      var result = String(value);

      for (var i = result.length; i < length; i++) {
        result = '0' + result;
      }

      return result;
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isObject(value) && (Jsonix.Util.NumberUtils.isInteger(value.year) && Jsonix.Util.NumberUtils.isInteger(value.month) && Jsonix.Util.NumberUtils.isInteger(value.day) || Jsonix.Util.NumberUtils.isInteger(value.hour) && Jsonix.Util.NumberUtils.isInteger(value.minute) && Jsonix.Util.NumberUtils.isInteger(value.second));
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.Calendar'
  });
  Jsonix.Schema.XSD.Calendar.YEAR_PATTERN = "-?([1-9][0-9]*)?((?!(0000))[0-9]{4})";
  Jsonix.Schema.XSD.Calendar.TIMEZONE_PATTERN = "Z|([\\-\\+])(((0[0-9]|1[0-3]):([0-5][0-9]))|(14:00))";
  Jsonix.Schema.XSD.Calendar.MONTH_PATTERN = "(0[1-9]|1[0-2])";
  Jsonix.Schema.XSD.Calendar.SINGLE_MONTH_PATTERN = "\\-\\-" + Jsonix.Schema.XSD.Calendar.MONTH_PATTERN;
  Jsonix.Schema.XSD.Calendar.DAY_PATTERN = "(0[1-9]|[12][0-9]|3[01])";
  Jsonix.Schema.XSD.Calendar.SINGLE_DAY_PATTERN = "\\-\\-\\-" + Jsonix.Schema.XSD.Calendar.DAY_PATTERN;
  Jsonix.Schema.XSD.Calendar.GYEAR_PATTERN = "(" + Jsonix.Schema.XSD.Calendar.YEAR_PATTERN + ")" + "(" + Jsonix.Schema.XSD.Calendar.TIMEZONE_PATTERN + ")?";
  Jsonix.Schema.XSD.Calendar.GMONTH_PATTERN = "(" + Jsonix.Schema.XSD.Calendar.SINGLE_MONTH_PATTERN + ")" + "(" + Jsonix.Schema.XSD.Calendar.TIMEZONE_PATTERN + ")?";
  Jsonix.Schema.XSD.Calendar.GDAY_PATTERN = "(" + Jsonix.Schema.XSD.Calendar.SINGLE_DAY_PATTERN + ")" + "(" + Jsonix.Schema.XSD.Calendar.TIMEZONE_PATTERN + ")?";
  Jsonix.Schema.XSD.Calendar.GYEAR_MONTH_PATTERN = "(" + Jsonix.Schema.XSD.Calendar.YEAR_PATTERN + ")" + "-" + "(" + Jsonix.Schema.XSD.Calendar.DAY_PATTERN + ")" + "(" + Jsonix.Schema.XSD.Calendar.TIMEZONE_PATTERN + ")?";
  Jsonix.Schema.XSD.Calendar.GMONTH_DAY_PATTERN = "(" + Jsonix.Schema.XSD.Calendar.SINGLE_MONTH_PATTERN + ")" + "-" + "(" + Jsonix.Schema.XSD.Calendar.DAY_PATTERN + ")" + "(" + Jsonix.Schema.XSD.Calendar.TIMEZONE_PATTERN + ")?";
  Jsonix.Schema.XSD.Calendar.DATE_PART_PATTERN = "(" + Jsonix.Schema.XSD.Calendar.YEAR_PATTERN + ")" + "-" + "(" + Jsonix.Schema.XSD.Calendar.MONTH_PATTERN + ")" + "-" + "(" + Jsonix.Schema.XSD.Calendar.DAY_PATTERN + ")";
  Jsonix.Schema.XSD.Calendar.TIME_PART_PATTERN = "([0-1][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\\.([0-9]+))?";
  Jsonix.Schema.XSD.Calendar.TIME_PATTERN = Jsonix.Schema.XSD.Calendar.TIME_PART_PATTERN + '(' + Jsonix.Schema.XSD.Calendar.TIMEZONE_PATTERN + ')?';
  Jsonix.Schema.XSD.Calendar.DATE_PATTERN = Jsonix.Schema.XSD.Calendar.DATE_PART_PATTERN + '(' + Jsonix.Schema.XSD.Calendar.TIMEZONE_PATTERN + ')?';
  Jsonix.Schema.XSD.Calendar.DATETIME_PATTERN = Jsonix.Schema.XSD.Calendar.DATE_PART_PATTERN + 'T' + Jsonix.Schema.XSD.Calendar.TIME_PART_PATTERN + '(' + Jsonix.Schema.XSD.Calendar.TIMEZONE_PATTERN + ')?';
  Jsonix.Schema.XSD.Calendar.INSTANCE = new Jsonix.Schema.XSD.Calendar();
  Jsonix.Schema.XSD.Calendar.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Calendar.INSTANCE);
  Jsonix.Schema.XSD.Duration = Jsonix.Class(Jsonix.Schema.XSD.AnySimpleType, {
    name: 'Duration',
    typeName: Jsonix.Schema.XSD.qname('duration'),
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isObject(value) && ((Jsonix.Util.Type.exists(value.sign) ? value.sign === -1 || value.sign === 1 : true)(Jsonix.Util.NumberUtils.isInteger(value.years) && value.years >= 0) || Jsonix.Util.NumberUtils.isInteger(value.months) && value.months >= 0 || Jsonix.Util.NumberUtils.isInteger(value.days) && value.days >= 0 || Jsonix.Util.NumberUtils.isInteger(value.hours) && value.hours >= 0 || Jsonix.Util.NumberUtils.isInteger(value.minutes) && value.minutes >= 0 || Jsonix.Util.Type.isNumber(value.seconds) && value.seconds >= 0);
    },
    validate: function validate(value) {
      Jsonix.Util.Ensure.ensureObject(value);

      if (Jsonix.Util.Type.exists(value.sign)) {
        if (!(value.sign === 1 || value.sign === -1)) {
          throw new Error("Sign of the duration [" + value.sign + "] must be either [1] or [-1].");
        }
      }

      var empty = true;

      var ifExistsEnsureUnsignedInteger = function ifExistsEnsureUnsignedInteger(v, message) {
        if (Jsonix.Util.Type.exists(v)) {
          if (!(Jsonix.Util.NumberUtils.isInteger(v) && v >= 0)) {
            throw new Error(message.replace("{0}", v));
          } else {
            return true;
          }
        } else {
          return false;
        }
      };

      var ifExistsEnsureUnsignedNumber = function ifExistsEnsureUnsignedNumber(v, message) {
        if (Jsonix.Util.Type.exists(v)) {
          if (!(Jsonix.Util.Type.isNumber(v) && v >= 0)) {
            throw new Error(message.replace("{0}", v));
          } else {
            return true;
          }
        } else {
          return false;
        }
      };

      empty = empty && !ifExistsEnsureUnsignedInteger(value.years, "Number of years [{0}] must be an unsigned integer.");
      empty = empty && !ifExistsEnsureUnsignedInteger(value.months, "Number of months [{0}] must be an unsigned integer.");
      empty = empty && !ifExistsEnsureUnsignedInteger(value.days, "Number of days [{0}] must be an unsigned integer.");
      empty = empty && !ifExistsEnsureUnsignedInteger(value.hours, "Number of hours [{0}] must be an unsigned integer.");
      empty = empty && !ifExistsEnsureUnsignedInteger(value.minutes, "Number of minutes [{0}] must be an unsigned integer.");
      empty = empty && !ifExistsEnsureUnsignedNumber(value.seconds, "Number of seconds [{0}] must be an unsigned number.");

      if (empty) {
        throw new Error("At least one of the components (years, months, days, hours, minutes, seconds) must be set.");
      }
    },
    print: function print(value, context, output, scope) {
      this.validate(value);
      var result = '';

      if (value.sign === -1) {
        result += '-';
      }

      result += 'P';

      if (Jsonix.Util.Type.exists(value.years)) {
        result += value.years + 'Y';
      }

      if (Jsonix.Util.Type.exists(value.months)) {
        result += value.months + 'M';
      }

      if (Jsonix.Util.Type.exists(value.days)) {
        result += value.days + 'D';
      }

      if (Jsonix.Util.Type.exists(value.hours) || Jsonix.Util.Type.exists(value.minutes) || Jsonix.Util.Type.exists(value.seconds)) {
        result += 'T';

        if (Jsonix.Util.Type.exists(value.hours)) {
          result += value.hours + 'H';
        }

        if (Jsonix.Util.Type.exists(value.minutes)) {
          result += value.minutes + 'M';
        }

        if (Jsonix.Util.Type.exists(value.seconds)) {
          result += value.seconds + 'S';
        }
      }

      return result;
    },
    parse: function parse(value, context, input, scope) {
      var durationExpression = new RegExp("^" + Jsonix.Schema.XSD.Duration.PATTERN + "$");
      var results = value.match(durationExpression);

      if (results !== null) {
        var empty = true;
        var duration = {};

        if (results[1]) {
          duration.sign = -1;
        }

        if (results[3]) {
          duration.years = parseInt(results[3], 10);
          empty = false;
        }

        if (results[5]) {
          duration.months = parseInt(results[5], 10);
          empty = false;
        }

        if (results[7]) {
          duration.days = parseInt(results[7], 10);
          empty = false;
        }

        if (results[10]) {
          duration.hours = parseInt(results[10], 10);
          empty = false;
        }

        if (results[12]) {
          duration.minutes = parseInt(results[12], 10);
          empty = false;
        }

        if (results[14]) {
          duration.seconds = Number(results[14]);
          empty = false;
        }

        return duration;
      } else {
        throw new Error('Value [' + value + '] does not match the duration pattern.');
      }
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.Duration'
  });
  Jsonix.Schema.XSD.Duration.PATTERN = '(-)?P(([0-9]+)Y)?(([0-9]+)M)?(([0-9]+)D)?(T(([0-9]+)H)?(([0-9]+)M)?(([0-9]+(\\.[0-9]+)?)S)?)?';
  Jsonix.Schema.XSD.Duration.INSTANCE = new Jsonix.Schema.XSD.Duration();
  Jsonix.Schema.XSD.Duration.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Duration.INSTANCE);
  Jsonix.Schema.XSD.DateTime = Jsonix.Class(Jsonix.Schema.XSD.Calendar, {
    name: 'DateTime',
    typeName: Jsonix.Schema.XSD.qname('dateTime'),
    parse: function parse(value, context, input, scope) {
      return this.parseDateTime(value);
    },
    print: function print(value, context, output, scope) {
      return this.printDateTime(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.DateTime'
  });
  Jsonix.Schema.XSD.DateTime.INSTANCE = new Jsonix.Schema.XSD.DateTime();
  Jsonix.Schema.XSD.DateTime.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.DateTime.INSTANCE);
  Jsonix.Schema.XSD.DateTimeAsDate = Jsonix.Class(Jsonix.Schema.XSD.Calendar, {
    name: 'DateTimeAsDate',
    typeName: Jsonix.Schema.XSD.qname('dateTime'),
    parse: function parse(value, context, input, scope) {
      var calendar = this.parseDateTime(value);
      var date = new Date();
      date.setFullYear(calendar.year);
      date.setMonth(calendar.month - 1);
      date.setDate(calendar.day);
      date.setHours(calendar.hour);
      date.setMinutes(calendar.minute);
      date.setSeconds(calendar.second);

      if (Jsonix.Util.Type.isNumber(calendar.fractionalSecond)) {
        date.setMilliseconds(Math.floor(1000 * calendar.fractionalSecond));
      }

      var timezone;
      var unknownTimezone;
      var localTimezone = -date.getTimezoneOffset();

      if (Jsonix.Util.NumberUtils.isInteger(calendar.timezone)) {
        timezone = calendar.timezone;
        unknownTimezone = false;
      } else {
        // Unknown timezone
        timezone = localTimezone;
        unknownTimezone = true;
      } //


      var result = new Date(date.getTime() + 60000 * (-timezone + localTimezone));

      if (unknownTimezone) {
        // null denotes "unknown timezone"
        result.originalTimezone = null;
      } else {
        result.originalTimezone = calendar.timezone;
      }

      return result;
    },
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureDate(value);
      var timezone;
      var localTimezone = -value.getTimezoneOffset();
      var correctedValue; // If original time zone was unknown, print the given value without
      // the timezone

      if (value.originalTimezone === null) {
        return this.printDateTime(new Jsonix.XML.Calendar({
          year: value.getFullYear(),
          month: value.getMonth() + 1,
          day: value.getDate(),
          hour: value.getHours(),
          minute: value.getMinutes(),
          second: value.getSeconds(),
          fractionalSecond: value.getMilliseconds() / 1000
        }));
      } else {
        // If original timezone was known, correct and print the value with the timezone
        if (Jsonix.Util.NumberUtils.isInteger(value.originalTimezone)) {
          timezone = value.originalTimezone;
          correctedValue = new Date(value.getTime() - 60000 * (-timezone + localTimezone));
        } // If original timezone was not specified, do not correct and use the local time zone
        else {
            timezone = localTimezone;
            correctedValue = value;
          }

        var x = this.printDateTime(new Jsonix.XML.Calendar({
          year: correctedValue.getFullYear(),
          month: correctedValue.getMonth() + 1,
          day: correctedValue.getDate(),
          hour: correctedValue.getHours(),
          minute: correctedValue.getMinutes(),
          second: correctedValue.getSeconds(),
          fractionalSecond: correctedValue.getMilliseconds() / 1000,
          timezone: timezone
        }));
        return x;
      }
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isDate(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.DateTimeAsDate'
  });
  Jsonix.Schema.XSD.DateTimeAsDate.INSTANCE = new Jsonix.Schema.XSD.DateTimeAsDate();
  Jsonix.Schema.XSD.DateTimeAsDate.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.DateTimeAsDate.INSTANCE);
  Jsonix.Schema.XSD.Time = Jsonix.Class(Jsonix.Schema.XSD.Calendar, {
    name: 'Time',
    typeName: Jsonix.Schema.XSD.qname('time'),
    parse: function parse(value, context, input, scope) {
      return this.parseTime(value);
    },
    print: function print(value, context, output, scope) {
      return this.printTime(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.Time'
  });
  Jsonix.Schema.XSD.Time.INSTANCE = new Jsonix.Schema.XSD.Time();
  Jsonix.Schema.XSD.Time.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Time.INSTANCE);
  Jsonix.Schema.XSD.TimeAsDate = Jsonix.Class(Jsonix.Schema.XSD.Calendar, {
    name: 'TimeAsDate',
    typeName: Jsonix.Schema.XSD.qname('time'),
    parse: function parse(value, context, input, scope) {
      var calendar = this.parseTime(value);
      var date = new Date();
      date.setFullYear(1970);
      date.setMonth(0);
      date.setDate(1);
      date.setHours(calendar.hour);
      date.setMinutes(calendar.minute);
      date.setSeconds(calendar.second);

      if (Jsonix.Util.Type.isNumber(calendar.fractionalSecond)) {
        date.setMilliseconds(Math.floor(1000 * calendar.fractionalSecond));
      }

      var timezone;
      var unknownTimezone;
      var localTimezone = -date.getTimezoneOffset();

      if (Jsonix.Util.NumberUtils.isInteger(calendar.timezone)) {
        timezone = calendar.timezone;
        unknownTimezone = false;
      } else {
        // Unknown timezone
        timezone = localTimezone;
        unknownTimezone = true;
      } //


      var result = new Date(date.getTime() + 60000 * (-timezone + localTimezone));

      if (unknownTimezone) {
        // null denotes "unknown timezone"
        result.originalTimezone = null;
      } else {
        result.originalTimezone = timezone;
      }

      return result;
    },
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureDate(value);
      var time = value.getTime();

      if (time <= -86400000 && time >= 86400000) {
        throw new Error('Invalid time [' + value + '].');
      } // Original timezone was unknown, just use current time, no timezone


      if (value.originalTimezone === null) {
        return this.printTime(new Jsonix.XML.Calendar({
          hour: value.getHours(),
          minute: value.getMinutes(),
          second: value.getSeconds(),
          fractionalSecond: value.getMilliseconds() / 1000
        }));
      } else {
        var correctedValue;
        var timezone;
        var localTimezone = -value.getTimezoneOffset();

        if (Jsonix.Util.NumberUtils.isInteger(value.originalTimezone)) {
          timezone = value.originalTimezone;
          correctedValue = new Date(value.getTime() - 60000 * (-timezone + localTimezone));
        } else {
          timezone = localTimezone;
          correctedValue = value;
        }

        var correctedTime = correctedValue.getTime();

        if (correctedTime >= -localTimezone * 60000) {
          return this.printTime(new Jsonix.XML.Calendar({
            hour: correctedValue.getHours(),
            minute: correctedValue.getMinutes(),
            second: correctedValue.getSeconds(),
            fractionalSecond: correctedValue.getMilliseconds() / 1000,
            timezone: timezone
          }));
        } else {
          var timezoneHours = Math.ceil(-correctedTime / 3600000);
          var correctedTimeInSeconds = correctedValue.getSeconds() + correctedValue.getMinutes() * 60 + correctedValue.getHours() * 3600 + timezoneHours * 3600 - timezone * 60;
          return this.printTime(new Jsonix.XML.Calendar({
            hour: correctedTimeInSeconds % 86400,
            minute: correctedTimeInSeconds % 3600,
            second: correctedTimeInSeconds % 60,
            fractionalSecond: correctedValue.getMilliseconds() / 1000,
            timezone: timezoneHours * 60
          }));
        }
      }
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isDate(value) && value.getTime() > -86400000 && value.getTime() < 86400000;
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.TimeAsDate'
  });
  Jsonix.Schema.XSD.TimeAsDate.INSTANCE = new Jsonix.Schema.XSD.TimeAsDate();
  Jsonix.Schema.XSD.TimeAsDate.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.TimeAsDate.INSTANCE);
  Jsonix.Schema.XSD.Date = Jsonix.Class(Jsonix.Schema.XSD.Calendar, {
    name: 'Date',
    typeName: Jsonix.Schema.XSD.qname('date'),
    parse: function parse(value, context, input, scope) {
      return this.parseDate(value);
    },
    print: function print(value, context, output, scope) {
      return this.printDate(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.Date'
  });
  Jsonix.Schema.XSD.Date.INSTANCE = new Jsonix.Schema.XSD.Date();
  Jsonix.Schema.XSD.Date.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.Date.INSTANCE);
  Jsonix.Schema.XSD.DateAsDate = Jsonix.Class(Jsonix.Schema.XSD.Calendar, {
    name: 'DateAsDate',
    typeName: Jsonix.Schema.XSD.qname('date'),
    parse: function parse(value, context, input, scope) {
      var calendar = this.parseDate(value);
      var date = new Date();
      date.setFullYear(calendar.year);
      date.setMonth(calendar.month - 1);
      date.setDate(calendar.day);
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);

      if (Jsonix.Util.Type.isNumber(calendar.fractionalSecond)) {
        date.setMilliseconds(Math.floor(1000 * calendar.fractionalSecond));
      }

      var timezone;
      var unknownTimezone;
      var localTimezone = -date.getTimezoneOffset();

      if (Jsonix.Util.NumberUtils.isInteger(calendar.timezone)) {
        timezone = calendar.timezone;
        unknownTimezone = false;
      } else {
        // Unknown timezone
        timezone = localTimezone;
        unknownTimezone = true;
      } //


      var result = new Date(date.getTime() + 60000 * (-timezone + localTimezone));

      if (unknownTimezone) {
        // null denotes "unknown timezone"
        result.originalTimezone = null;
      } else {
        result.originalTimezone = timezone;
      }

      return result;
    },
    print: function print(value, context, output, scope) {
      Jsonix.Util.Ensure.ensureDate(value);
      var localDate = new Date(value.getTime());
      localDate.setHours(0);
      localDate.setMinutes(0);
      localDate.setSeconds(0);
      localDate.setMilliseconds(0); // Original timezone is unknown

      if (value.originalTimezone === null) {
        return this.printDate(new Jsonix.XML.Calendar({
          year: value.getFullYear(),
          month: value.getMonth() + 1,
          day: value.getDate()
        }));
      } else {
        // If original timezone was known, correct and print the value with the timezone
        if (Jsonix.Util.NumberUtils.isInteger(value.originalTimezone)) {
          var correctedValue = new Date(value.getTime() - 60000 * (-value.originalTimezone - value.getTimezoneOffset()));
          return this.printDate(new Jsonix.XML.Calendar({
            year: correctedValue.getFullYear(),
            month: correctedValue.getMonth() + 1,
            day: correctedValue.getDate(),
            timezone: value.originalTimezone
          }));
        } // If original timezone was not specified, do not correct and use the local time zone
        else {
            // We assume that the difference between the date value and local midnight
            // should be interpreted as a timezone offset.
            // In case there's no difference, we assume default/unknown timezone
            var localTimezone = -value.getTime() + localDate.getTime();

            if (localTimezone === 0) {
              return this.printDate(new Jsonix.XML.Calendar({
                year: value.getFullYear(),
                month: value.getMonth() + 1,
                day: value.getDate()
              }));
            } else {
              var timezone = localTimezone - 60000 * value.getTimezoneOffset();

              if (timezone >= -43200000) {
                return this.printDate(new Jsonix.XML.Calendar({
                  year: value.getFullYear(),
                  month: value.getMonth() + 1,
                  day: value.getDate(),
                  timezone: Math.floor(timezone / 60000)
                }));
              } else {
                var nextDay = new Date(value.getTime() + 86400000);
                return this.printDate(new Jsonix.XML.Calendar({
                  year: nextDay.getFullYear(),
                  month: nextDay.getMonth() + 1,
                  day: nextDay.getDate(),
                  timezone: Math.floor(timezone / 60000) + 1440
                }));
              }
            }
          }
      }
    },
    isInstance: function isInstance(value, context, scope) {
      return Jsonix.Util.Type.isDate(value);
    },
    CLASS_NAME: 'Jsonix.Schema.XSD.DateAsDate'
  });
  Jsonix.Schema.XSD.DateAsDate.INSTANCE = new Jsonix.Schema.XSD.DateAsDate();
  Jsonix.Schema.XSD.DateAsDate.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.DateAsDate.INSTANCE);
  Jsonix.Schema.XSD.GYearMonth = Jsonix.Class(Jsonix.Schema.XSD.Calendar, {
    name: 'GYearMonth',
    typeName: Jsonix.Schema.XSD.qname('gYearMonth'),
    CLASS_NAME: 'Jsonix.Schema.XSD.GYearMonth',
    parse: function parse(value, context, input, scope) {
      return this.parseGYearMonth(value, context, input, scope);
    },
    print: function print(value, context, output, scope) {
      return this.printGYearMonth(value, context, output, scope);
    }
  });
  Jsonix.Schema.XSD.GYearMonth.INSTANCE = new Jsonix.Schema.XSD.GYearMonth();
  Jsonix.Schema.XSD.GYearMonth.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.GYearMonth.INSTANCE);
  Jsonix.Schema.XSD.GYear = Jsonix.Class(Jsonix.Schema.XSD.Calendar, {
    name: 'GYear',
    typeName: Jsonix.Schema.XSD.qname('gYear'),
    CLASS_NAME: 'Jsonix.Schema.XSD.GYear',
    parse: function parse(value, context, input, scope) {
      return this.parseGYear(value, context, input, scope);
    },
    print: function print(value, context, output, scope) {
      return this.printGYear(value, context, output, scope);
    }
  });
  Jsonix.Schema.XSD.GYear.INSTANCE = new Jsonix.Schema.XSD.GYear();
  Jsonix.Schema.XSD.GYear.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.GYear.INSTANCE);
  Jsonix.Schema.XSD.GMonthDay = Jsonix.Class(Jsonix.Schema.XSD.Calendar, {
    name: 'GMonthDay',
    typeName: Jsonix.Schema.XSD.qname('gMonthDay'),
    CLASS_NAME: 'Jsonix.Schema.XSD.GMonthDay',
    parse: function parse(value, context, input, scope) {
      return this.parseGMonthDay(value, context, input, scope);
    },
    print: function print(value, context, output, scope) {
      return this.printGMonthDay(value, context, output, scope);
    }
  });
  Jsonix.Schema.XSD.GMonthDay.INSTANCE = new Jsonix.Schema.XSD.GMonthDay();
  Jsonix.Schema.XSD.GMonthDay.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.GMonthDay.INSTANCE);
  Jsonix.Schema.XSD.GDay = Jsonix.Class(Jsonix.Schema.XSD.Calendar, {
    name: 'GDay',
    typeName: Jsonix.Schema.XSD.qname('gDay'),
    CLASS_NAME: 'Jsonix.Schema.XSD.GDay',
    parse: function parse(value, context, input, scope) {
      return this.parseGDay(value, context, input, scope);
    },
    print: function print(value, context, output, scope) {
      return this.printGDay(value, context, output, scope);
    }
  });
  Jsonix.Schema.XSD.GDay.INSTANCE = new Jsonix.Schema.XSD.GDay();
  Jsonix.Schema.XSD.GDay.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.GDay.INSTANCE);
  Jsonix.Schema.XSD.GMonth = Jsonix.Class(Jsonix.Schema.XSD.Calendar, {
    name: 'GMonth',
    typeName: Jsonix.Schema.XSD.qname('gMonth'),
    CLASS_NAME: 'Jsonix.Schema.XSD.GMonth',
    parse: function parse(value, context, input, scope) {
      return this.parseGMonth(value, context, input, scope);
    },
    print: function print(value, context, output, scope) {
      return this.printGMonth(value, context, output, scope);
    }
  });
  Jsonix.Schema.XSD.GMonth.INSTANCE = new Jsonix.Schema.XSD.GMonth();
  Jsonix.Schema.XSD.GMonth.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.GMonth.INSTANCE);
  Jsonix.Schema.XSD.ID = Jsonix.Class(Jsonix.Schema.XSD.String, {
    name: 'ID',
    typeName: Jsonix.Schema.XSD.qname('ID'),
    CLASS_NAME: 'Jsonix.Schema.XSD.ID'
  });
  Jsonix.Schema.XSD.ID.INSTANCE = new Jsonix.Schema.XSD.ID();
  Jsonix.Schema.XSD.ID.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.ID.INSTANCE);
  Jsonix.Schema.XSD.IDREF = Jsonix.Class(Jsonix.Schema.XSD.String, {
    name: 'IDREF',
    typeName: Jsonix.Schema.XSD.qname('IDREF'),
    CLASS_NAME: 'Jsonix.Schema.XSD.IDREF'
  });
  Jsonix.Schema.XSD.IDREF.INSTANCE = new Jsonix.Schema.XSD.IDREF();
  Jsonix.Schema.XSD.IDREF.INSTANCE.LIST = new Jsonix.Schema.XSD.List(Jsonix.Schema.XSD.IDREF.INSTANCE);
  Jsonix.Schema.XSD.IDREFS = Jsonix.Class(Jsonix.Schema.XSD.List, {
    name: 'IDREFS',
    initialize: function initialize() {
      Jsonix.Schema.XSD.List.prototype.initialize.apply(this, [Jsonix.Schema.XSD.IDREF.INSTANCE, Jsonix.Schema.XSD.qname('IDREFS'), ' ']);
    },
    // TODO Constraints
    CLASS_NAME: 'Jsonix.Schema.XSD.IDREFS'
  });
  Jsonix.Schema.XSD.IDREFS.INSTANCE = new Jsonix.Schema.XSD.IDREFS();
  Jsonix.Schema.XSI = {};
  Jsonix.Schema.XSI.NAMESPACE_URI = 'http://www.w3.org/2001/XMLSchema-instance';
  Jsonix.Schema.XSI.PREFIX = 'xsi';
  Jsonix.Schema.XSI.TYPE = 'type';
  Jsonix.Schema.XSI.NIL = 'nil';

  Jsonix.Schema.XSI.qname = function (localPart) {
    Jsonix.Util.Ensure.ensureString(localPart);
    return new Jsonix.XML.QName(Jsonix.Schema.XSI.NAMESPACE_URI, localPart, Jsonix.Schema.XSI.PREFIX);
  };

  Jsonix.Schema.XSI.TYPE_QNAME = Jsonix.Schema.XSI.qname(Jsonix.Schema.XSI.TYPE);
  Jsonix.Context = Jsonix.Class(Jsonix.Mapping.Styled, {
    modules: [],
    typeInfos: null,
    typeNameKeyToTypeInfo: null,
    elementInfos: null,
    options: null,
    substitutionMembersMap: null,
    scopedElementInfosMap: null,
    supportXsiType: true,
    initialize: function initialize(mappings, options) {
      Jsonix.Mapping.Styled.prototype.initialize.apply(this, [options]);
      this.modules = [];
      this.elementInfos = [];
      this.typeInfos = {};
      this.typeNameKeyToTypeInfo = {};
      this.registerBuiltinTypeInfos();
      this.namespacePrefixes = {};
      this.prefixNamespaces = {};
      this.substitutionMembersMap = {};
      this.scopedElementInfosMap = {}; // Initialize options

      if (Jsonix.Util.Type.exists(options)) {
        Jsonix.Util.Ensure.ensureObject(options);

        if (Jsonix.Util.Type.isObject(options.namespacePrefixes)) {
          this.namespacePrefixes = Jsonix.Util.Type.cloneObject(options.namespacePrefixes, {});
        }

        if (Jsonix.Util.Type.isBoolean(options.supportXsiType)) {
          this.supportXsiType = options.supportXsiType;
        }
      } // Initialize prefix/namespace mapping


      for (var ns in this.namespacePrefixes) {
        if (this.namespacePrefixes.hasOwnProperty(ns)) {
          p = this.namespacePrefixes[ns];
          this.prefixNamespaces[p] = ns;
        }
      } // Initialize modules


      if (Jsonix.Util.Type.exists(mappings)) {
        Jsonix.Util.Ensure.ensureArray(mappings); // Initialize modules

        var index, mapping, module;

        for (index = 0; index < mappings.length; index++) {
          mapping = mappings[index];
          module = this.createModule(mapping);
          this.modules[index] = module;
        }
      }

      this.processModules();
    },
    createModule: function createModule(mapping) {
      var module;

      if (mapping instanceof this.mappingStyle.module) {
        module = mapping;
      } else {
        mapping = Jsonix.Util.Type.cloneObject(mapping);
        module = new this.mappingStyle.module(mapping, {
          mappingStyle: this.mappingStyle
        });
      }

      return module;
    },
    registerBuiltinTypeInfos: function registerBuiltinTypeInfos() {
      for (var index = 0; index < this.builtinTypeInfos.length; index++) {
        this.registerTypeInfo(this.builtinTypeInfos[index]);
      }
    },
    processModules: function processModules() {
      var index, module;

      for (index = 0; index < this.modules.length; index++) {
        module = this.modules[index];
        module.registerTypeInfos(this);
      }

      for (index = 0; index < this.modules.length; index++) {
        module = this.modules[index];
        module.registerElementInfos(this);
      }

      for (index = 0; index < this.modules.length; index++) {
        module = this.modules[index];
        module.buildTypeInfos(this);
      }

      for (index = 0; index < this.modules.length; index++) {
        module = this.modules[index];
        module.buildElementInfos(this);
      }
    },
    registerTypeInfo: function registerTypeInfo(typeInfo) {
      Jsonix.Util.Ensure.ensureObject(typeInfo);
      var n = typeInfo.name || typeInfo.n || null;
      Jsonix.Util.Ensure.ensureString(n);
      this.typeInfos[n] = typeInfo;

      if (typeInfo.typeName && typeInfo.typeName.key) {
        this.typeNameKeyToTypeInfo[typeInfo.typeName.key] = typeInfo;
      }
    },
    resolveTypeInfo: function resolveTypeInfo(mapping, module) {
      if (!Jsonix.Util.Type.exists(mapping)) {
        return null;
      } else if (mapping instanceof Jsonix.Model.TypeInfo) {
        return mapping;
      } else if (Jsonix.Util.Type.isString(mapping)) {
        var typeInfoName; // If mapping starts with '.' consider it to be a local type name in this module

        if (mapping.length > 0 && mapping.charAt(0) === '.') {
          var n = module.name || module.n || undefined;
          Jsonix.Util.Ensure.ensureObject(module, 'Type info mapping can only be resolved if module is provided.');
          Jsonix.Util.Ensure.ensureString(n, 'Type info mapping can only be resolved if module name is provided.');
          typeInfoName = n + mapping;
        } else {
          typeInfoName = mapping;
        }

        if (!this.typeInfos[typeInfoName]) {
          throw new Error('Type info [' + typeInfoName + '] is not known in this context.');
        } else {
          return this.typeInfos[typeInfoName];
        }
      } else {
        Jsonix.Util.Ensure.ensureObject(module, 'Type info mapping can only be resolved if module is provided.');
        var typeInfo = module.createTypeInfo(mapping);
        typeInfo.build(this, module);
        return typeInfo;
      }
    },
    registerElementInfo: function registerElementInfo(elementInfo, module) {
      Jsonix.Util.Ensure.ensureObject(elementInfo);
      this.elementInfos.push(elementInfo);

      if (Jsonix.Util.Type.exists(elementInfo.substitutionHead)) {
        var substitutionHead = elementInfo.substitutionHead;
        var substitutionHeadKey = substitutionHead.key;
        var substitutionMembers = this.substitutionMembersMap[substitutionHeadKey];

        if (!Jsonix.Util.Type.isArray(substitutionMembers)) {
          substitutionMembers = [];
          this.substitutionMembersMap[substitutionHeadKey] = substitutionMembers;
        }

        substitutionMembers.push(elementInfo);
      }

      var scopeKey;

      if (Jsonix.Util.Type.exists(elementInfo.scope)) {
        scopeKey = this.resolveTypeInfo(elementInfo.scope, module).name;
      } else {
        scopeKey = '##global';
      }

      var scopedElementInfos = this.scopedElementInfosMap[scopeKey];

      if (!Jsonix.Util.Type.isObject(scopedElementInfos)) {
        scopedElementInfos = {};
        this.scopedElementInfosMap[scopeKey] = scopedElementInfos;
      }

      scopedElementInfos[elementInfo.elementName.key] = elementInfo;
    },
    getTypeInfoByValue: function getTypeInfoByValue(value) {
      if (!Jsonix.Util.Type.exists(value)) {
        return undefined;
      }

      if (Jsonix.Util.Type.isObject(value)) {
        var typeName = value.TYPE_NAME;

        if (Jsonix.Util.Type.isString(typeName)) {
          var typeInfoByName = this.getTypeInfoByName(typeName);

          if (typeInfoByName) {
            return typeInfoByName;
          }
        }
      }

      return undefined;
    },
    // TODO public API
    getTypeInfoByName: function getTypeInfoByName(name) {
      return this.typeInfos[name];
    },
    getTypeInfoByTypeName: function getTypeInfoByTypeName(typeName) {
      var tn = Jsonix.XML.QName.fromObjectOrString(typeName, this);
      return this.typeNameKeyToTypeInfo[tn.key];
    },
    getTypeInfoByTypeNameKey: function getTypeInfoByTypeNameKey(typeNameKey) {
      return this.typeNameKeyToTypeInfo[typeNameKey];
    },
    getElementInfo: function getElementInfo(name, scope) {
      if (Jsonix.Util.Type.exists(scope)) {
        var scopeKey = scope.name;
        var scopedElementInfos = this.scopedElementInfosMap[scopeKey];

        if (Jsonix.Util.Type.exists(scopedElementInfos)) {
          var scopedElementInfo = scopedElementInfos[name.key];

          if (Jsonix.Util.Type.exists(scopedElementInfo)) {
            return scopedElementInfo;
          }
        }
      }

      var globalScopeKey = '##global';
      var globalScopedElementInfos = this.scopedElementInfosMap[globalScopeKey];

      if (Jsonix.Util.Type.exists(globalScopedElementInfos)) {
        var globalScopedElementInfo = globalScopedElementInfos[name.key];

        if (Jsonix.Util.Type.exists(globalScopedElementInfo)) {
          return globalScopedElementInfo;
        }
      }

      return null; //
      // throw new Error("Element [" + name.key
      // + "] could not be found in the given context.");
    },
    getSubstitutionMembers: function getSubstitutionMembers(name) {
      return this.substitutionMembersMap[Jsonix.XML.QName.fromObject(name).key];
    },
    createMarshaller: function createMarshaller() {
      return new this.mappingStyle.marshaller(this);
    },
    createUnmarshaller: function createUnmarshaller() {
      return new this.mappingStyle.unmarshaller(this);
    },
    getNamespaceURI: function getNamespaceURI(prefix) {
      Jsonix.Util.Ensure.ensureString(prefix);
      return this.prefixNamespaces[prefix];
    },
    getPrefix: function getPrefix(namespaceURI, defaultPrefix) {
      Jsonix.Util.Ensure.ensureString(namespaceURI);
      var prefix = this.namespacePrefixes[namespaceURI];

      if (Jsonix.Util.Type.isString(prefix)) {
        return prefix;
      } else {
        return defaultPrefix;
      }
    },

    /**
     * Builtin type infos.
     */
    builtinTypeInfos: [Jsonix.Schema.XSD.AnyType.INSTANCE, Jsonix.Schema.XSD.AnySimpleType.INSTANCE, Jsonix.Schema.XSD.AnyURI.INSTANCE, Jsonix.Schema.XSD.Base64Binary.INSTANCE, Jsonix.Schema.XSD.Boolean.INSTANCE, Jsonix.Schema.XSD.Byte.INSTANCE, Jsonix.Schema.XSD.Calendar.INSTANCE, Jsonix.Schema.XSD.DateAsDate.INSTANCE, Jsonix.Schema.XSD.Date.INSTANCE, Jsonix.Schema.XSD.DateTimeAsDate.INSTANCE, Jsonix.Schema.XSD.DateTime.INSTANCE, Jsonix.Schema.XSD.Decimal.INSTANCE, Jsonix.Schema.XSD.Double.INSTANCE, Jsonix.Schema.XSD.Duration.INSTANCE, Jsonix.Schema.XSD.Float.INSTANCE, Jsonix.Schema.XSD.GDay.INSTANCE, Jsonix.Schema.XSD.GMonth.INSTANCE, Jsonix.Schema.XSD.GMonthDay.INSTANCE, Jsonix.Schema.XSD.GYear.INSTANCE, Jsonix.Schema.XSD.GYearMonth.INSTANCE, Jsonix.Schema.XSD.HexBinary.INSTANCE, Jsonix.Schema.XSD.ID.INSTANCE, Jsonix.Schema.XSD.IDREF.INSTANCE, Jsonix.Schema.XSD.IDREFS.INSTANCE, Jsonix.Schema.XSD.Int.INSTANCE, Jsonix.Schema.XSD.Integer.INSTANCE, Jsonix.Schema.XSD.Language.INSTANCE, Jsonix.Schema.XSD.Long.INSTANCE, Jsonix.Schema.XSD.Name.INSTANCE, Jsonix.Schema.XSD.NCName.INSTANCE, Jsonix.Schema.XSD.NegativeInteger.INSTANCE, Jsonix.Schema.XSD.NMToken.INSTANCE, Jsonix.Schema.XSD.NMTokens.INSTANCE, Jsonix.Schema.XSD.NonNegativeInteger.INSTANCE, Jsonix.Schema.XSD.NonPositiveInteger.INSTANCE, Jsonix.Schema.XSD.NormalizedString.INSTANCE, Jsonix.Schema.XSD.Number.INSTANCE, Jsonix.Schema.XSD.PositiveInteger.INSTANCE, Jsonix.Schema.XSD.QName.INSTANCE, Jsonix.Schema.XSD.Short.INSTANCE, Jsonix.Schema.XSD.String.INSTANCE, Jsonix.Schema.XSD.Strings.INSTANCE, Jsonix.Schema.XSD.TimeAsDate.INSTANCE, Jsonix.Schema.XSD.Time.INSTANCE, Jsonix.Schema.XSD.Token.INSTANCE, Jsonix.Schema.XSD.UnsignedByte.INSTANCE, Jsonix.Schema.XSD.UnsignedInt.INSTANCE, Jsonix.Schema.XSD.UnsignedLong.INSTANCE, Jsonix.Schema.XSD.UnsignedShort.INSTANCE],
    CLASS_NAME: 'Jsonix.Context'
  }); // Complete Jsonix script is included above

  return {
    Jsonix: Jsonix
  };
}; // If the require function exists ...


if (typeof require === 'function') {
  // ... but the define function does not exists
  if (typeof define !== 'function') {
    if (!process.browser) {
      // Load the define function via amdefine
      define = require('amdefine')(module); // Require xmldom, xmlhttprequest and fs

      define(["xmldom", "xmlhttprequest", "fs"], _jsonix_factory);
    } else {
      // We're probably in browser, maybe browserify
      // Do not require xmldom, xmlhttprequest as they'r provided by the browser
      // Do not require fs since file system is not available anyway
      define([], _jsonix_factory);
    }
  } else {
    // Otherwise assume we're in the browser/RequireJS environment
    // Load the module without xmldom and xmlhttprequests dependencies
    define([], _jsonix_factory);
  }
} // If the require function does not exists, we're not in Node.js and therefore in browser environment
else {
    // Just call the factory and set Jsonix as global.
    var Jsonix = _jsonix_factory().Jsonix;
  }
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvY29tcG9uZW50cy91dGlscy9qc29uaXguanMiXSwibmFtZXMiOlsiX2pzb25peF9mYWN0b3J5IiwiX2pzb25peF94bWxkb20iLCJfanNvbml4X3htbGh0dHByZXF1ZXN0IiwiX2pzb25peF9mcyIsIkpzb25peCIsInNpbmdsZUZpbGUiLCJVdGlsIiwiZXh0ZW5kIiwiZGVzdGluYXRpb24iLCJzb3VyY2UiLCJwcm9wZXJ0eSIsInZhbHVlIiwidW5kZWZpbmVkIiwic291cmNlSXNFdnQiLCJ3aW5kb3ciLCJFdmVudCIsImhhc093blByb3BlcnR5IiwidG9TdHJpbmciLCJDbGFzcyIsImluaXRpYWxpemUiLCJhcHBseSIsImFyZ3VtZW50cyIsImV4dGVuZGVkIiwiZW1wdHkiLCJwYXJlbnQiLCJUeXBlIiwiaSIsImxlbiIsImxlbmd0aCIsInByb3RvdHlwZSIsIlhNTCIsIlhNTE5TX05TIiwiWE1MTlNfUCIsIkRPTSIsImlzRG9tSW1wbGVtZW50YXRpb25BdmFpbGFibGUiLCJkb2N1bWVudCIsImV4aXN0cyIsImltcGxlbWVudGF0aW9uIiwiaXNGdW5jdGlvbiIsImNyZWF0ZURvY3VtZW50IiwiRE9NSW1wbGVtZW50YXRpb24iLCJBY3RpdmVYT2JqZWN0IiwiRXJyb3IiLCJzZXJpYWxpemUiLCJub2RlIiwiRW5zdXJlIiwiZW5zdXJlRXhpc3RzIiwiWE1MU2VyaWFsaXplciIsInNlcmlhbGl6ZVRvU3RyaW5nIiwieG1sIiwicGFyc2UiLCJ0ZXh0IiwiRE9NUGFyc2VyIiwicGFyc2VGcm9tU3RyaW5nIiwiZG9jIiwibG9hZFhNTCIsInVybCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlcXVlc3QiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJvdmVycmlkZU1pbWVUeXBlIiwic2VuZCIsInJlc3BvbnNlWE1MIiwibG9hZCIsImNhbGxiYWNrIiwib3B0aW9ucyIsIlJlcXVlc3QiLCJJTlNUQU5DRSIsImlzc3VlIiwidHJhbnNwb3J0IiwicmVzdWx0IiwiZG9jdW1lbnRFbGVtZW50IiwiaXNTdHJpbmciLCJyZXNwb25zZVRleHQiLCJ4bGlua0ZpeFJlcXVpcmVkIiwiaXNYbGlua0ZpeFJlcXVpcmVkIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidGVzdCIsInZlbmRvciIsImVsIiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZU5TIiwiYXBwZW5kQ2hpbGQiLCJ0ZXN0U3RyaW5nIiwiaW5kZXhPZiIsImZhY3RvcmllcyIsIm9uU3VjY2VzcyIsIm9uRmFpbHVyZSIsImVuc3VyZVN0cmluZyIsImVuc3VyZUZ1bmN0aW9uIiwiZW5zdXJlT2JqZWN0IiwiY3JlYXRlVHJhbnNwb3J0IiwibWV0aG9kIiwiYXN5bmMiLCJpc0Jvb2xlYW4iLCJwcm94eSIsIlBST1hZIiwidXNlciIsInBhc3N3b3JkIiwiaXNPYmplY3QiLCJoZWFkZXJzIiwiaGVhZGVyIiwic2V0UmVxdWVzdEhlYWRlciIsImRhdGEiLCJoYW5kbGVUcmFuc3BvcnQiLCJ0aGF0Iiwib25yZWFkeXN0YXRlY2hhbmdlIiwic2V0VGltZW91dCIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJpbmRleCIsImUiLCJDTEFTU19OQU1FIiwiU2NoZW1hIiwiTW9kZWwiLCJpc1VuZGVmaW5lZCIsImlzTnVtYmVyIiwiaXNOYU4iLCJpc051bWJlck9yTmFOIiwiT2JqZWN0IiwiY2FsbCIsImlzQXJyYXkiLCJjb25jYXQiLCJ1bnNoaWZ0IiwiY2FsbGVlIiwiaXNEYXRlIiwiZ2V0VGltZXpvbmVPZmZzZXQiLCJzZXRVVENGdWxsWWVhciIsImlzUmVnRXhwIiwiZXhlYyIsImlnbm9yZUNhc2UiLCJpc05vZGUiLCJOb2RlIiwibm9kZVR5cGUiLCJub2RlTmFtZSIsImlzRXF1YWwiLCJhIiwiYiIsInJlcG9ydCIsImRvUmVwb3J0IiwiX3JhbmdlIiwic3RhcnQiLCJzdG9wIiwic3RlcCIsImFyZ3MiLCJzbGljZSIsInNvbG8iLCJzdGFydF8iLCJzdG9wXyIsInN0ZXBfIiwiTWF0aCIsIm1heCIsImNlaWwiLCJpZHgiLCJyYW5nZSIsIkFycmF5IiwiX2tleXMiLCJrZXlzIiwib2JqIiwia2V5IiwiYXR5cGUiLCJidHlwZSIsImdldFRpbWUiLCJnbG9iYWwiLCJtdWx0aWxpbmUiLCJhU2VyaWFsaXplZCIsImJTZXJpYWxpemVkIiwiYUtleXMiLCJiS2V5cyIsImFuZGV4IiwiYm5kZXgiLCJrbmRleCIsImNsb25lT2JqZWN0IiwidGFyZ2V0IiwicCIsImRlZmF1bHRWYWx1ZSIsInR5cGVPZkRlZmF1bHRWYWx1ZSIsImNhbmRpZGF0ZVZhbHVlIiwiTnVtYmVyVXRpbHMiLCJpc0ludGVnZXIiLCJTdHJpbmdVdGlscyIsInRyaW0iLCJTdHJpbmciLCJzdHIiLCJyZXBsYWNlIiwiaXNFbXB0eSIsImMiLCJpc05vdEJsYW5rIiwid2hpdGVzcGFjZUNoYXJhY3RlcnMiLCJ3aGl0ZXNwYWNlQ2hhcmFjdGVyc01hcCIsInNwbGl0QnlTZXBhcmF0b3JDaGFycyIsInNlcGFyYXRvckNoYXJzIiwic3BsaXQiLCJsaXN0Iiwic2l6ZVBsdXMxIiwibWF0Y2giLCJsYXN0TWF0Y2giLCJwcmVzZXJ2ZUFsbFRva2VucyIsImNoYXJBdCIsInB1c2giLCJzdWJzdHJpbmciLCJlbnN1cmVCb29sZWFuIiwiZW5zdXJlTnVtYmVyIiwiZW5zdXJlTnVtYmVyT3JOYU4iLCJlbnN1cmVJbnRlZ2VyIiwiZW5zdXJlRGF0ZSIsIkRhdGUiLCJlbnN1cmVBcnJheSIsIlFOYW1lIiwibmFtZXNwYWNlVVJJIiwibG9jYWxQYXJ0IiwicHJlZml4Iiwic3RyaW5nIiwib25lIiwidHdvIiwidGhyZWUiLCJjb2xvblBvc2l0aW9uIiwidG9DYW5vbmljYWxTdHJpbmciLCJuYW1lc3BhY2VDb250ZXh0IiwiY2Fub25pY2FsUHJlZml4IiwiZ2V0UHJlZml4IiwiY2xvbmUiLCJlcXVhbHMiLCJmcm9tU3RyaW5nIiwicU5hbWVBc1N0cmluZyIsImRlZmF1bHROYW1lc3BhY2VVUkkiLCJsZWZ0QnJhY2tldCIsInJpZ2h0QnJhY2tldCIsImxhc3RJbmRleE9mIiwicHJlZml4ZWROYW1lIiwiZ2V0TmFtZXNwYWNlVVJJIiwiZnJvbU9iamVjdCIsIm9iamVjdCIsImxwIiwibnMiLCJmcm9tT2JqZWN0T3JTdHJpbmciLCJsb2NhbE5hbWUiLCJDYWxlbmRhciIsInllYXIiLCJOYU4iLCJtb250aCIsImRheSIsImhvdXIiLCJtaW51dGUiLCJzZWNvbmQiLCJmcmFjdGlvbmFsU2Vjb25kIiwidGltZXpvbmUiLCJkYXRlIiwidmFsaWRhdGVZZWFyIiwidmFsaWRhdGVNb250aCIsInZhbGlkYXRlWWVhck1vbnRoRGF5IiwidmFsaWRhdGVNb250aERheSIsInZhbGlkYXRlRGF5IiwidmFsaWRhdGVIb3VyIiwidmFsaWRhdGVNaW51dGUiLCJ2YWxpZGF0ZVNlY29uZCIsInZhbGlkYXRlRnJhY3Rpb25hbFNlY29uZCIsInZhbGlkYXRlVGltZXpvbmUiLCJpbml0aWFsRGF0ZSIsInNldFVUQ01vbnRoIiwic2V0VVRDRGF0ZSIsInNldFVUQ0hvdXJzIiwic2V0VVRDTWludXRlcyIsInNldFVUQ1NlY29uZHMiLCJzZXRVVENNaWxsaXNlY29uZHMiLCJ0aW1lem9uZU9mZnNldCIsIk1JTl9USU1FWk9ORSIsIk1BWF9USU1FWk9ORSIsIkRBWVNfSU5fTU9OVEgiLCJtYXhEYXlzSW5Nb250aCIsIklucHV0Iiwicm9vdCIsImF0dHJpYnV0ZXMiLCJldmVudFR5cGUiLCJwbnMiLCJyb290UG5zSXRlbSIsImhhc05leHQiLCJuZXh0IiwiZW50ZXIiLCJsZWF2ZSIsImZpcnN0Q2hpbGQiLCJuZXh0U2libGluZyIsInB1c2hOUyIsIm5vZGVWYWx1ZSIsInBvcE5TIiwibmV4dFNpYmxpbmcxIiwicGFyZW50Tm9kZSIsImdldE5hbWUiLCJnZXROYW1lS2V5IiwiZ2V0VGV4dCIsIm5leHRUYWciLCJldCIsInNraXBFbGVtZW50IiwiU1RBUlRfRUxFTUVOVCIsIm51bWJlck9mT3BlblRhZ3MiLCJnZXRFbGVtZW50VGV4dCIsImNvbnRlbnQiLCJyZXRyaWV2ZUVsZW1lbnQiLCJlbGVtZW50IiwicmV0cmlldmVBdHRyaWJ1dGVzIiwiZ2V0QXR0cmlidXRlQ291bnQiLCJnZXRBdHRyaWJ1dGVOYW1lIiwiYXR0cmlidXRlIiwiZ2V0QXR0cmlidXRlTmFtZUtleSIsImdldEF0dHJpYnV0ZVZhbHVlIiwiZ2V0QXR0cmlidXRlVmFsdWVOUyIsImdldEF0dHJpYnV0ZVZhbHVlTlNWaWFFbGVtZW50IiwiZ2V0QXR0cmlidXRlTlMiLCJnZXRBdHRyaWJ1dGVWYWx1ZU5TVmlhQXR0cmlidXRlIiwiYXR0cmlidXRlTm9kZSIsImdldEF0dHJpYnV0ZU5vZGVOUyIsImdldEF0dHJpYnV0ZU5vZGVOU1ZpYUVsZW1lbnQiLCJnZXRBdHRyaWJ1dGVOb2RlTlNWaWFBdHRyaWJ1dGVzIiwicG90ZW50aWFsTm9kZSIsImZ1bGxOYW1lIiwiZ2V0RWxlbWVudCIsInBpbmRleCIsInBhcmVudFBuc0l0ZW0iLCJwbnNJdGVtIiwicmVmZXJlbmNlIiwiYWxlbmd0aCIsImFpbmRleCIsImF0dHJpYnV0ZU5hbWUiLCJpc05TIiwicG9wIiwiRU5EX0VMRU1FTlQiLCJQUk9DRVNTSU5HX0lOU1RSVUNUSU9OIiwiQ0hBUkFDVEVSUyIsIkNPTU1FTlQiLCJTUEFDRSIsIlNUQVJUX0RPQ1VNRU5UIiwiRU5EX0RPQ1VNRU5UIiwiRU5USVRZX1JFRkVSRU5DRSIsIkFUVFJJQlVURSIsIkRURCIsIkNEQVRBIiwiTkFNRVNQQUNFIiwiTk9UQVRJT05fREVDTEFSQVRJT04iLCJFTlRJVFlfREVDTEFSQVRJT04iLCJPdXRwdXQiLCJub2RlcyIsIm5zcCIsIm5hbWVzcGFjZVByZWZpeEluZGV4IiwieG1sZG9tIiwicm9vdE5zcEl0ZW0iLCJuYW1lc3BhY2VQcmVmaXhlcyIsImRlc3Ryb3kiLCJ3cml0ZVN0YXJ0RG9jdW1lbnQiLCJ3cml0ZUVuZERvY3VtZW50Iiwid3JpdGVTdGFydEVsZW1lbnQiLCJuYW1lIiwicXVhbGlmaWVkTmFtZSIsImNyZWF0ZUVsZW1lbnROUyIsImNyZWF0ZU5vZGUiLCJwZWVrIiwiZGVjbGFyZU5hbWVzcGFjZSIsImRlY2xhcmVOYW1lc3BhY2VzIiwid3JpdGVFbmRFbGVtZW50Iiwid3JpdGVDaGFyYWN0ZXJzIiwiY3JlYXRlVGV4dE5vZGUiLCJ3cml0ZUNkYXRhIiwicGFydHMiLCJqbmRleCIsIndyaXRlQ2RhdGFXaXRob3V0Q2RlbmQiLCJjcmVhdGVDREFUQVNlY3Rpb24iLCJ3cml0ZUF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZSIsInNldEF0dHJpYnV0ZU5vZGUiLCJ3cml0ZU5vZGUiLCJpbXBvcnRlZE5vZGUiLCJpbXBvcnROb2RlIiwibmluZGV4IiwicGFyZW50TnNwSXRlbSIsIm5zcEl0ZW0iLCJvbGRwIiwiTWFwcGluZyIsIlN0eWxlIiwibWFyc2hhbGxlciIsInVubWFyc2hhbGxlciIsIm1vZHVsZSIsImVsZW1lbnRJbmZvIiwiY2xhc3NJbmZvIiwiZW51bUxlYWZJbmZvIiwiYW55QXR0cmlidXRlUHJvcGVydHlJbmZvIiwiYW55RWxlbWVudFByb3BlcnR5SW5mbyIsImF0dHJpYnV0ZVByb3BlcnR5SW5mbyIsImVsZW1lbnRNYXBQcm9wZXJ0eUluZm8iLCJlbGVtZW50UHJvcGVydHlJbmZvIiwiZWxlbWVudHNQcm9wZXJ0eUluZm8iLCJlbGVtZW50UmVmUHJvcGVydHlJbmZvIiwiZWxlbWVudFJlZnNQcm9wZXJ0eUluZm8iLCJ2YWx1ZVByb3BlcnR5SW5mbyIsIlNUWUxFUyIsIlN0eWxlZCIsIm1hcHBpbmdTdHlsZSIsInN0YW5kYXJkIiwiQmluZGluZyIsIk1hcnNoYWxscyIsIkVsZW1lbnQiLCJtYXJzaGFsRWxlbWVudCIsImNvbnRleHQiLCJvdXRwdXQiLCJzY29wZSIsImVsZW1lbnRWYWx1ZSIsImNvbnZlcnRUb1R5cGVkTmFtZWRWYWx1ZSIsImRlY2xhcmVkVHlwZUluZm8iLCJ0eXBlSW5mbyIsImFjdHVhbFR5cGVJbmZvIiwic3VwcG9ydFhzaVR5cGUiLCJ0eXBlSW5mb0J5VmFsdWUiLCJnZXRUeXBlSW5mb0J5VmFsdWUiLCJ0eXBlTmFtZSIsInhzaVR5cGVOYW1lIiwieHNpVHlwZSIsIlhTRCIsInByaW50IiwiWFNJIiwiVFlQRV9RTkFNRSIsIm1hcnNoYWwiLCJnZXRUeXBlSW5mb0J5RWxlbWVudE5hbWUiLCJnZXRFbGVtZW50SW5mbyIsIkFzRWxlbWVudFJlZiIsImNvbnZlcnRUb05hbWVkVmFsdWUiLCJwcm9wZXJ0eU5hbWUiLCJVbm1hcnNoYWxscyIsIldyYXBwZXJFbGVtZW50IiwibWl4ZWQiLCJ1bm1hcnNoYWxXcmFwcGVyRWxlbWVudCIsImlucHV0IiwidW5tYXJzaGFsRWxlbWVudCIsImFsbG93VHlwZWRPYmplY3QiLCJhbGxvd0RvbSIsImdldFR5cGVJbmZvQnlJbnB1dEVsZW1lbnQiLCJ1bm1hcnNoYWwiLCJ0eXBlZE5hbWVkVmFsdWUiLCJjb252ZXJ0RnJvbVR5cGVkTmFtZWRWYWx1ZSIsInhzaVR5cGVJbmZvIiwiTkFNRVNQQUNFX1VSSSIsIlRZUEUiLCJnZXRUeXBlSW5mb0J5VHlwZU5hbWVLZXkiLCJBc1NpbXBsaWZpZWRFbGVtZW50UmVmIiwiTWFyc2hhbGxlciIsIm1hcnNoYWxTdHJpbmciLCJtYXJzaGFsRG9jdW1lbnQiLCJTaW1wbGlmaWVkIiwiVW5tYXJzaGFsbGVyIiwidW5tYXJzaGFsU3RyaW5nIiwidW5tYXJzaGFsRG9jdW1lbnQiLCJ1bm1hcnNoYWxVUkwiLCJ1bm1hcnNoYWxGaWxlIiwiZmlsZU5hbWUiLCJmcyIsInJlYWRGaWxlIiwiZXJyIiwiX3Jlc3VsdCIsIlR5cGVJbmZvIiwiYmFzZVR5cGVJbmZvIiwiaXNCYXNlZE9uIiwiY3VycmVudFR5cGVJbmZvIiwiQ2xhc3NJbmZvIiwiaW5zdGFuY2VGYWN0b3J5IiwicHJvcGVydGllcyIsInByb3BlcnRpZXNNYXAiLCJzdHJ1Y3R1cmUiLCJ0YXJnZXROYW1lc3BhY2UiLCJkZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSIsImRlZmF1bHRBdHRyaWJ1dGVOYW1lc3BhY2VVUkkiLCJidWlsdCIsIm1hcHBpbmciLCJuIiwibG4iLCJkZW5zIiwidG5zIiwiZGFucyIsImJ0aSIsImluRiIsInRuIiwicHMiLCJwcm9wZXJ0eUluZm9zIiwiZ2V0UHJvcGVydHlJbmZvQnlOYW1lIiwiYnVpbGQiLCJyZXNvbHZlVHlwZUluZm8iLCJwcm9wZXJ0eUluZm8iLCJlbGVtZW50cyIsImFueUF0dHJpYnV0ZSIsImFueSIsImJ1aWxkU3RydWN0dXJlIiwiVFlQRV9OQU1FIiwiYXR0cmlidXRlQ291bnQiLCJhdHRyaWJ1dGVOYW1lS2V5IiwiYXR0cmlidXRlVmFsdWUiLCJ1bm1hcnNoYWxQcm9wZXJ0eVZhbHVlIiwidW5tYXJzaGFsUHJvcGVydHkiLCJlbGVtZW50TmFtZUtleSIsImFueVByb3BlcnR5SW5mbyIsIm1peGVkUHJvcGVydHlJbmZvIiwicHJvcGVydHlWYWx1ZSIsInNldFByb3BlcnR5IiwidW5tYXJzaGFsVmFsdWUiLCJpc01hcnNoYWxsYWJsZSIsInNpbmdsZVByb3BlcnR5SW5mbyIsImlzSW5zdGFuY2UiLCJQcm9wZXJ0eUluZm8iLCJhZGRQcm9wZXJ0eSIsInR5cGUiLCJ0IiwicHJvcGVydHlJbmZvQ3JlYXRvcnMiLCJwcm9wZXJ0eUluZm9DcmVhdG9yIiwiYWEiLCJhZGREZWZhdWx0TmFtZXNwYWNlcyIsImFlIiwiZW0iLCJlcyIsImVyIiwiZXJzIiwidiIsIkVudW1MZWFmSW5mbyIsImVudHJpZXMiLCJ2YWx1ZXMiLCJ2cyIsIml0ZW1zIiwicmVwcmludCIsIkVsZW1lbnRJbmZvIiwiZWxlbWVudE5hbWUiLCJzdWJzdGl0dXRpb25IZWFkIiwiZW4iLCJ0aSIsInNoIiwic2MiLCJjb2xsZWN0aW9uIiwiY29sIiwicnEiLCJyZXF1aXJlZCIsIm1ubyIsIm1pbk9jY3VycyIsIm14byIsIm1heE9jY3VycyIsImRvQnVpbGQiLCJBbnlBdHRyaWJ1dGVQcm9wZXJ0eUluZm8iLCJjb252ZXJ0RnJvbUF0dHJpYnV0ZU5hbWUiLCJjb252ZXJ0VG9BdHRyaWJ1dGVOYW1lIiwiU2luZ2xlVHlwZVByb3BlcnR5SW5mbyIsIkF0dHJpYnV0ZVByb3BlcnR5SW5mbyIsImFuIiwiVmFsdWVQcm9wZXJ0eUluZm8iLCJjZGF0YSIsImFzQ0RBVEEiLCJBYnN0cmFjdEVsZW1lbnRzUHJvcGVydHlJbmZvIiwid3JhcHBlckVsZW1lbnROYW1lIiwid2VuIiwiaXRlbSIsImJ1aWxkU3RydWN0dXJlRWxlbWVudHMiLCJFbGVtZW50UHJvcGVydHlJbmZvIiwiRWxlbWVudHNQcm9wZXJ0eUluZm8iLCJlbGVtZW50VHlwZUluZm9zIiwiZWxlbWVudFR5cGVJbmZvc01hcCIsImV0aXMiLCJlbGVtZW50VHlwZUluZm8iLCJldGkiLCJldGl0aSIsImV0aWVuIiwiRWxlbWVudE1hcFByb3BlcnR5SW5mbyIsImVudHJ5VHlwZUluZm8iLCJrIiwiZW50cnkiLCJzaW5nbGVFbnRyeSIsImNvbGxlY3Rpb25FbnRyeSIsIm1hcCIsIkFic3RyYWN0RWxlbWVudFJlZnNQcm9wZXJ0eUluZm8iLCJkb20iLCJ0eXBlZCIsIm14IiwibWFyc2hhbEl0ZW0iLCJwcm9wZXJ0eUVsZW1lbnRUeXBlSW5mbyIsImdldFByb3BlcnR5RWxlbWVudFR5cGVJbmZvIiwiY29udGV4dEVsZW1lbnRUeXBlSW5mbyIsImJ1aWxkU3RydWN0dXJlRWxlbWVudFR5cGVJbmZvcyIsInN1YnN0aXR1dGlvbk1lbWJlcnMiLCJnZXRTdWJzdGl0dXRpb25NZW1iZXJzIiwic3Vic3RpdHV0aW9uRWxlbWVudEluZm8iLCJFbGVtZW50UmVmUHJvcGVydHlJbmZvIiwiRWxlbWVudFJlZnNQcm9wZXJ0eUluZm8iLCJBbnlFbGVtZW50UHJvcGVydHlJbmZvIiwiTW9kdWxlIiwidHlwZUluZm9zIiwiZWxlbWVudEluZm9zIiwidGlzIiwiaW5pdGlhbGl6ZVR5cGVJbmZvcyIsInR5cGVJbmZvTmFtZSIsImVpcyIsImluaXRpYWxpemVFbGVtZW50SW5mb3MiLCJ0eXBlSW5mb01hcHBpbmdzIiwidHlwZUluZm9NYXBwaW5nIiwiY3JlYXRlVHlwZUluZm8iLCJlbGVtZW50SW5mb01hcHBpbmdzIiwiZWxlbWVudEluZm9NYXBwaW5nIiwiY3JlYXRlRWxlbWVudEluZm8iLCJ0eXBlSW5mb0NyZWF0b3JzIiwidHlwZUluZm9DcmVhdG9yIiwiaW5pdGlhbGl6ZU5hbWVzIiwiY3JlYXRlQ2xhc3NJbmZvIiwiY3JlYXRlRW51bUxlYWZJbmZvIiwiY3JlYXRlTGlzdCIsInMiLCJzZXBhcmF0b3IiLCJzZXAiLCJsaXN0VHlwZUluZm8iLCJMaXN0IiwicmVnaXN0ZXJUeXBlSW5mb3MiLCJyZWdpc3RlclR5cGVJbmZvIiwiYnVpbGRUeXBlSW5mb3MiLCJyZWdpc3RlckVsZW1lbnRJbmZvcyIsInJlZ2lzdGVyRWxlbWVudEluZm8iLCJidWlsZEVsZW1lbnRJbmZvcyIsImNzIiwiU3RhbmRhcmQiLCJzaW1wbGlmaWVkIiwiUFJFRklYIiwicW5hbWUiLCJBbnlUeXBlIiwiQW55U2ltcGxlVHlwZSIsInRyaW1tZWRTZXBhcmF0b3IiLCJzaW1wbGVUeXBlIiwiTElTVCIsIlN0cmluZ3MiLCJOb3JtYWxpemVkU3RyaW5nIiwiVG9rZW4iLCJMYW5ndWFnZSIsIk5hbWUiLCJOQ05hbWUiLCJOTVRva2VuIiwiTk1Ub2tlbnMiLCJCb29sZWFuIiwiQmFzZTY0QmluYXJ5IiwiY2hhclRvQnl0ZSIsImJ5dGVUb0NoYXIiLCJjaGFyVGFibGUiLCJfY2hhciIsIl9ieXRlIiwiY2hhckNvZGVBdCIsImVuY29kZSIsImRlY29kZSIsInVhcnJheSIsImJ5dGUwIiwiYnl0ZTEiLCJieXRlMiIsImNoYXIwIiwiY2hhcjEiLCJjaGFyMiIsImNoYXIzIiwiaiIsImZsb29yIiwiSGV4QmluYXJ5IiwiY2hhclRvUXVhcnRldCIsImJ5dGVUb0R1cGxldCIsImNoYXJUYWJsZVVwcGVyQ2FzZSIsImNoYXJUYWJsZUxvd2VyQ2FzZSIsInRvTG93ZXJDYXNlIiwiTnVtYmVyIiwiSW5maW5pdHkiLCJGbG9hdCIsIk1JTl9WQUxVRSIsIk1BWF9WQUxVRSIsIkRlY2ltYWwiLCJJbnRlZ2VyIiwiTm9uUG9zaXRpdmVJbnRlZ2VyIiwiTmVnYXRpdmVJbnRlZ2VyIiwiTG9uZyIsIkludCIsIlNob3J0IiwiQnl0ZSIsIk5vbk5lZ2F0aXZlSW50ZWdlciIsIlVuc2lnbmVkTG9uZyIsIlVuc2lnbmVkSW50IiwiVW5zaWduZWRTaG9ydCIsIlVuc2lnbmVkQnl0ZSIsIlBvc2l0aXZlSW50ZWdlciIsIkRvdWJsZSIsIkFueVVSSSIsInFOYW1lIiwiUmVnRXhwIiwiREFURVRJTUVfUEFUVEVSTiIsInBhcnNlRGF0ZVRpbWUiLCJEQVRFX1BBVFRFUk4iLCJwYXJzZURhdGUiLCJUSU1FX1BBVFRFUk4iLCJwYXJzZVRpbWUiLCJHWUVBUl9NT05USF9QQVRURVJOIiwicGFyc2VHWWVhck1vbnRoIiwiR1lFQVJfUEFUVEVSTiIsInBhcnNlR1llYXIiLCJHTU9OVEhfREFZX1BBVFRFUk4iLCJwYXJzZUdNb250aERheSIsIkdNT05USF9QQVRURVJOIiwicGFyc2VHTW9udGgiLCJHREFZX1BBVFRFUk4iLCJwYXJzZUdEYXkiLCJnWWVhck1vbnRoRXhwcmVzc2lvbiIsInJlc3VsdHMiLCJwYXJzZUludCIsInBhcnNlVGltZXpvbmVTdHJpbmciLCJnWWVhckV4cHJlc3Npb24iLCJnTW9udGhEYXlFeHByZXNzaW9uIiwiZ01vbnRoRXhwcmVzc2lvbiIsImdEYXlFeHByZXNzaW9uIiwiZXhwcmVzc2lvbiIsInBhcnNlRmxvYXQiLCJUSU1FWk9ORV9QQVRURVJOIiwic2lnbiIsInByaW50RGF0ZVRpbWUiLCJwcmludERhdGUiLCJwcmludFRpbWUiLCJwcmludEdZZWFyTW9udGgiLCJwcmludEdNb250aERheSIsInByaW50R1llYXIiLCJwcmludEdNb250aCIsInByaW50R0RheSIsImZyYWN0aW9uYWxTdHJpbmciLCJwcmludERhdGVTdHJpbmciLCJwcmludFRpbWVTdHJpbmciLCJwcmludFRpbWV6b25lU3RyaW5nIiwicHJpbnRZZWFyIiwicHJpbnRNb250aCIsInByaW50RGF5IiwicHJpbnRIb3VyIiwicHJpbnRNaW51dGUiLCJwcmludFNlY29uZCIsInByaW50RnJhY3Rpb25hbFNlY29uZCIsImdldERhdGUiLCJnZXRNb250aCIsImdldEZ1bGxZZWFyIiwicHJpbnRTaWduZWRZZWFyIiwicHJpbnRJbnRlZ2VyIiwiZG90SW5kZXgiLCJZRUFSX1BBVFRFUk4iLCJNT05USF9QQVRURVJOIiwiU0lOR0xFX01PTlRIX1BBVFRFUk4iLCJEQVlfUEFUVEVSTiIsIlNJTkdMRV9EQVlfUEFUVEVSTiIsIkRBVEVfUEFSVF9QQVRURVJOIiwiVElNRV9QQVJUX1BBVFRFUk4iLCJEdXJhdGlvbiIsInllYXJzIiwibW9udGhzIiwiZGF5cyIsImhvdXJzIiwibWludXRlcyIsInNlY29uZHMiLCJ2YWxpZGF0ZSIsImlmRXhpc3RzRW5zdXJlVW5zaWduZWRJbnRlZ2VyIiwibWVzc2FnZSIsImlmRXhpc3RzRW5zdXJlVW5zaWduZWROdW1iZXIiLCJkdXJhdGlvbkV4cHJlc3Npb24iLCJQQVRURVJOIiwiZHVyYXRpb24iLCJEYXRlVGltZSIsIkRhdGVUaW1lQXNEYXRlIiwiY2FsZW5kYXIiLCJzZXRGdWxsWWVhciIsInNldE1vbnRoIiwic2V0RGF0ZSIsInNldEhvdXJzIiwic2V0TWludXRlcyIsInNldFNlY29uZHMiLCJzZXRNaWxsaXNlY29uZHMiLCJ1bmtub3duVGltZXpvbmUiLCJsb2NhbFRpbWV6b25lIiwib3JpZ2luYWxUaW1lem9uZSIsImNvcnJlY3RlZFZhbHVlIiwiZ2V0SG91cnMiLCJnZXRNaW51dGVzIiwiZ2V0U2Vjb25kcyIsImdldE1pbGxpc2Vjb25kcyIsIngiLCJUaW1lIiwiVGltZUFzRGF0ZSIsInRpbWUiLCJjb3JyZWN0ZWRUaW1lIiwidGltZXpvbmVIb3VycyIsImNvcnJlY3RlZFRpbWVJblNlY29uZHMiLCJEYXRlQXNEYXRlIiwibG9jYWxEYXRlIiwibmV4dERheSIsIkdZZWFyTW9udGgiLCJHWWVhciIsIkdNb250aERheSIsIkdEYXkiLCJHTW9udGgiLCJJRCIsIklEUkVGIiwiSURSRUZTIiwiTklMIiwiQ29udGV4dCIsIm1vZHVsZXMiLCJ0eXBlTmFtZUtleVRvVHlwZUluZm8iLCJzdWJzdGl0dXRpb25NZW1iZXJzTWFwIiwic2NvcGVkRWxlbWVudEluZm9zTWFwIiwibWFwcGluZ3MiLCJyZWdpc3RlckJ1aWx0aW5UeXBlSW5mb3MiLCJwcmVmaXhOYW1lc3BhY2VzIiwiY3JlYXRlTW9kdWxlIiwicHJvY2Vzc01vZHVsZXMiLCJidWlsdGluVHlwZUluZm9zIiwic3Vic3RpdHV0aW9uSGVhZEtleSIsInNjb3BlS2V5Iiwic2NvcGVkRWxlbWVudEluZm9zIiwidHlwZUluZm9CeU5hbWUiLCJnZXRUeXBlSW5mb0J5TmFtZSIsImdldFR5cGVJbmZvQnlUeXBlTmFtZSIsInR5cGVOYW1lS2V5Iiwic2NvcGVkRWxlbWVudEluZm8iLCJnbG9iYWxTY29wZUtleSIsImdsb2JhbFNjb3BlZEVsZW1lbnRJbmZvcyIsImdsb2JhbFNjb3BlZEVsZW1lbnRJbmZvIiwiY3JlYXRlTWFyc2hhbGxlciIsImNyZWF0ZVVubWFyc2hhbGxlciIsImRlZmF1bHRQcmVmaXgiLCJyZXF1aXJlIiwiZGVmaW5lIiwicHJvY2VzcyIsImJyb3dzZXIiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQTs7QUFFQTs7Ozs7O0FBT0EsSUFBSUEsZUFBZSxHQUFHLFNBQWxCQSxlQUFrQixDQUFTQyxjQUFULEVBQXlCQyxzQkFBekIsRUFBaURDLFVBQWpELEVBQ3RCO0FBQ0M7QUFDRCxNQUFJQyxNQUFNLEdBQUc7QUFDWkMsSUFBQUEsVUFBVSxFQUFHO0FBREQsR0FBYjtBQUdBRCxFQUFBQSxNQUFNLENBQUNFLElBQVAsR0FBYyxFQUFkOztBQUVBRixFQUFBQSxNQUFNLENBQUNFLElBQVAsQ0FBWUMsTUFBWixHQUFxQixVQUFTQyxXQUFULEVBQXNCQyxNQUF0QixFQUE4QjtBQUNsREQsSUFBQUEsV0FBVyxHQUFHQSxXQUFXLElBQUksRUFBN0I7O0FBQ0EsUUFBSUMsTUFBSixFQUFZO0FBQ1g7QUFDQSxXQUFNLElBQUlDLFFBQVYsSUFBc0JELE1BQXRCLEVBQThCO0FBQzdCLFlBQUlFLEtBQUssR0FBR0YsTUFBTSxDQUFDQyxRQUFELENBQWxCOztBQUNBLFlBQUlDLEtBQUssS0FBS0MsU0FBZCxFQUF5QjtBQUN4QkosVUFBQUEsV0FBVyxDQUFDRSxR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Q0EsU0FBTztBQUFFOUcsSUFBQUEsTUFBTSxFQUFFQTtBQUFWLEdBQVA7QUFDQSxDQTMvTEQsQyxDQTYvTEE7OztBQUNBLElBQUksT0FBTyt5QixPQUFQLEtBQW1CLFVBQXZCLEVBQW1DO0FBQ2xDO0FBQ0EsTUFBSSxPQUFPQyxNQUFQLEtBQWtCLFVBQXRCLEVBQWtDO0FBQ2pDLFFBQUksQ0FBQ0MsT0FBTyxDQUFDQyxPQUFiLEVBQXNCO0FBQ3JCO0FBQ0FGLE1BQUFBLE1BQU0sR0FBR0QsT0FBTyxDQUFDLFVBQUQsQ0FBUCxDQUFvQnRiLE1BQXBCLENBQVQsQ0FGcUIsQ0FHckI7O0FBQ0F1YixNQUFBQSxNQUFNLENBQUMsQ0FBQyxRQUFELEVBQVcsZ0JBQVgsRUFBNkIsSUFBN0IsQ0FBRCxFQUFxQ3B6QixlQUFyQyxDQUFOO0FBQ0EsS0FMRCxNQU9BO0FBQ0M7QUFDQTtBQUNBO0FBQ0FvekIsTUFBQUEsTUFBTSxDQUFDLEVBQUQsRUFBS3B6QixlQUFMLENBQU47QUFDQTtBQUNELEdBZEQsTUFlSztBQUNKO0FBQ0E7QUFDQW96QixJQUFBQSxNQUFNLENBQUMsRUFBRCxFQUFLcHpCLGVBQUwsQ0FBTjtBQUNBO0FBQ0QsQ0F0QkQsQ0F1QkE7QUF2QkEsS0F5QkE7QUFDQztBQUNBLFFBQUlJLE1BQU0sR0FBR0osZUFBZSxHQUFHSSxNQUEvQjtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgKi9cclxuXHJcbi8qKlxyXG4gKiBDb3BpZWQganNvbml4IGxvY2FsbHkgdG8gbWFrZSB0aGlzIGZpeDogaHR0cHM6Ly9naXRodWIuY29tL2JvdW5kbGVzc2dlby9qc29uaXgvY29tbWl0LzMzNDJjMDExNzc5MjYxYTg2MDQ4OGIxYTY5MmZhMDk5MTBjZDI3M2VcclxuICogV2VicGFjayBkb2VzIG5vdCBsaWtlIHRoZSBkZWZpbmUuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vaGlnaHNvdXJjZS9qc29uaXgvaXNzdWVzLzE3MVxyXG4gKiBcclxuICogVE9ETzogR2V0IHJpZCBvZiB0aGlzIGZpbGUgYW5kIGluc3RlYWQgbWF5YmUgbW9ua2V5IHBhdGNoIHRoZSBkZXBlbmRlbmN5IGluIG5vZGVfbW9kdWxlc1xyXG4gKi9cclxuXHJcbnZhciBfanNvbml4X2ZhY3RvcnkgPSBmdW5jdGlvbihfanNvbml4X3htbGRvbSwgX2pzb25peF94bWxodHRwcmVxdWVzdCwgX2pzb25peF9mcylcclxue1xyXG5cdC8vIENvbXBsZXRlIEpzb25peCBzY3JpcHQgaXMgaW5jbHVkZWQgYmVsb3cgXHJcbnZhciBKc29uaXggPSB7XHJcblx0c2luZ2xlRmlsZSA6IHRydWVcclxufTtcclxuSnNvbml4LlV0aWwgPSB7fTtcclxuXHJcbkpzb25peC5VdGlsLmV4dGVuZCA9IGZ1bmN0aW9uKGRlc3RpbmF0aW9uLCBzb3VyY2UpIHtcclxuXHRkZXN0aW5hdGlvbiA9IGRlc3RpbmF0aW9uIHx8IHt9O1xyXG5cdGlmIChzb3VyY2UpIHtcclxuXHRcdC8qanNsaW50IGZvcmluOiB0cnVlICovXHJcblx0XHRmb3IgKCB2YXIgcHJvcGVydHkgaW4gc291cmNlKSB7XHJcblx0XHRcdHZhciB2YWx1ZSA9IHNvdXJjZVtwcm9wZXJ0eV07XHJcblx0XHRcdGlmICh2YWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0ZGVzdGluYXRpb25bcHJvcGVydHldID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0XHQvKipcclxuXHRcdCAqIElFIGRvZXNuJ3QgaW5jbHVkZSB0aGUgdG9TdHJpbmcgcHJvcGVydHkgd2hlbiBpdGVyYXRpbmcgb3ZlciBhblxyXG5cdFx0ICogb2JqZWN0J3MgcHJvcGVydGllcyB3aXRoIHRoZSBmb3IocHJvcGVydHkgaW4gb2JqZWN0KSBzeW50YXguXHJcblx0XHQgKiBFeHBsaWNpdGx5IGNoZWNrIGlmIHRoZSBzb3VyY2UgaGFzIGl0cyBvd24gdG9TdHJpbmcgcHJvcGVydHkuXHJcblx0XHQgKi9cclxuXHJcblx0XHQvKlxyXG5cdFx0ICogRkYvV2luZG93cyA8IDIuMC4wLjEzIHJlcG9ydHMgXCJJbGxlZ2FsIG9wZXJhdGlvbiBvbiBXcmFwcGVkTmF0aXZlXHJcblx0XHQgKiBwcm90b3R5cGUgb2JqZWN0XCIgd2hlbiBjYWxsaW5nIGhhd093blByb3BlcnR5IGlmIHRoZSBzb3VyY2Ugb2JqZWN0IGlzXHJcblx0XHQgKiBhbiBpbnN0YW5jZSBvZiB3aW5kb3cuRXZlbnQuXHJcblx0XHQgKi9cclxuXHJcblx0XHQvLyBSRVdPUktcclxuXHRcdC8vIE5vZGUuanNcclxuXHRcdHNvdXJjZUlzRXZ0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93ICE9PSBudWxsICYmIHR5cGVvZiB3aW5kb3cuRXZlbnQgPT09IFwiZnVuY3Rpb25cIiAmJiBzb3VyY2UgaW5zdGFuY2VvZiB3aW5kb3cuRXZlbnQ7XHJcblxyXG5cdFx0aWYgKCFzb3VyY2VJc0V2dCAmJiBzb3VyY2UuaGFzT3duUHJvcGVydHkgJiYgc291cmNlLmhhc093blByb3BlcnR5KCd0b1N0cmluZycpKSB7XHJcblx0XHRcdGRlc3RpbmF0aW9uLnRvU3RyaW5nID0gc291cmNlLnRvU3RyaW5nO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gZGVzdGluYXRpb247XHJcbn07XHJcbkpzb25peC5DbGFzcyA9IGZ1bmN0aW9uKCkge1xyXG5cdHZhciBDbGFzcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5pbml0aWFsaXplLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcblx0fTtcclxuXHR2YXIgZXh0ZW5kZWQgPSB7fTtcclxuXHR2YXIgZW1wdHkgPSBmdW5jdGlvbigpIHtcclxuXHR9O1xyXG5cdHZhciBwYXJlbnQsIGluaXRpYWxpemUsIFR5cGU7XHJcblx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG5cdFx0VHlwZSA9IGFyZ3VtZW50c1tpXTtcclxuXHRcdGlmICh0eXBlb2YgVHlwZSA9PSBcImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0Ly8gbWFrZSB0aGUgY2xhc3MgcGFzc2VkIGFzIHRoZSBmaXJzdCBhcmd1bWVudCB0aGUgc3VwZXJjbGFzc1xyXG5cdFx0XHRpZiAoaSA9PT0gMCAmJiBsZW4gPiAxKSB7XHJcblx0XHRcdFx0aW5pdGlhbGl6ZSA9IFR5cGUucHJvdG90eXBlLmluaXRpYWxpemU7XHJcblx0XHRcdFx0Ly8gcmVwbGFjZSB0aGUgaW5pdGlhbGl6ZSBtZXRob2Qgd2l0aCBhbiBlbXB0eSBmdW5jdGlvbixcclxuXHRcdFx0XHQvLyBiZWNhdXNlIHdlIGRvIG5vdCB3YW50IHRvIGNyZWF0ZSBhIHJlYWwgaW5zdGFuY2UgaGVyZVxyXG5cdFx0XHRcdFR5cGUucHJvdG90eXBlLmluaXRpYWxpemUgPSBlbXB0eTtcclxuXHRcdFx0XHQvLyB0aGUgbGluZSBiZWxvdyBtYWtlcyBzdXJlIHRoYXQgdGhlIG5ldyBjbGFzcyBoYXMgYVxyXG5cdFx0XHRcdC8vIHN1cGVyY2xhc3NcclxuXHRcdFx0XHRleHRlbmRlZCA9IG5ldyBUeXBlKCk7XHJcblx0XHRcdFx0Ly8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgaW5pdGlhbGl6ZSBtZXRob2RcclxuXHRcdFx0XHRpZiAoaW5pdGlhbGl6ZSA9PT0gdW5kZWZpbmVkKSB7XHJcblx0XHRcdFx0XHRkZWxldGUgVHlwZS5wcm90b3R5cGUuaW5pdGlhbGl6ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0VHlwZS5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGluaXRpYWxpemU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdC8vIGdldCB0aGUgcHJvdG90eXBlIG9mIHRoZSBzdXBlcmNsYXNzXHJcblx0XHRcdHBhcmVudCA9IFR5cGUucHJvdG90eXBlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gaW4gdGhpcyBjYXNlIHdlJ3JlIGV4dGVuZGluZyB3aXRoIHRoZSBwcm90b3R5cGVcclxuXHRcdFx0cGFyZW50ID0gVHlwZTtcclxuXHRcdH1cclxuXHRcdEpzb25peC5VdGlsLmV4dGVuZChleHRlbmRlZCwgcGFyZW50KTtcclxuXHR9XHJcblx0Q2xhc3MucHJvdG90eXBlID0gZXh0ZW5kZWQ7XHJcblx0cmV0dXJuIENsYXNzO1xyXG59O1xyXG5cclxuSnNvbml4LlhNTCA9IHtcclxuXHRcdFhNTE5TX05TIDogJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAveG1sbnMvJyxcclxuXHRcdFhNTE5TX1AgOiAneG1sbnMnXHJcbn07XHJcblxyXG5cclxuSnNvbml4LkRPTSA9IHtcclxuXHRpc0RvbUltcGxlbWVudGF0aW9uQXZhaWxhYmxlIDogZnVuY3Rpb24gKCkge1xyXG5cdFx0aWYgKHR5cGVvZiBfanNvbml4X3htbGRvbSAhPT0gJ3VuZGVmaW5lZCcpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSBlbHNlIGlmICh0eXBlb2YgZG9jdW1lbnQgIT09ICd1bmRlZmluZWQnICYmIEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGRvY3VtZW50LmltcGxlbWVudGF0aW9uKSAmJiBKc29uaXguVXRpbC5UeXBlLmlzRnVuY3Rpb24oZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlRG9jdW1lbnQpKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Y3JlYXRlRG9jdW1lbnQgOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIFJFV09SS1xyXG5cdFx0Ly8gTm9kZS5qc1xyXG5cdFx0aWYgKHR5cGVvZiBfanNvbml4X3htbGRvbSAhPT0gJ3VuZGVmaW5lZCcpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiBuZXcgKF9qc29uaXhfeG1sZG9tLkRPTUltcGxlbWVudGF0aW9uKSgpLmNyZWF0ZURvY3VtZW50KCk7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZG9jdW1lbnQuaW1wbGVtZW50YXRpb24pICYmIEpzb25peC5VdGlsLlR5cGUuaXNGdW5jdGlvbihkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVEb2N1bWVudCkpIHtcclxuXHRcdFx0cmV0dXJuIGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZURvY3VtZW50KCcnLCAnJywgbnVsbCk7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBBY3RpdmVYT2JqZWN0ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01TWE1MMi5ET01Eb2N1bWVudCcpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFcnJvciBjcmVhdGVkIHRoZSBET00gZG9jdW1lbnQuJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRzZXJpYWxpemUgOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRXhpc3RzKG5vZGUpO1xyXG5cdFx0Ly8gUkVXT1JLXHJcblx0XHQvLyBOb2RlLmpzXHJcblx0XHRpZiAodHlwZW9mIF9qc29uaXhfeG1sZG9tICE9PSAndW5kZWZpbmVkJylcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIChuZXcgKF9qc29uaXhfeG1sZG9tKS5YTUxTZXJpYWxpemVyKCkpLnNlcmlhbGl6ZVRvU3RyaW5nKG5vZGUpO1xyXG5cdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhYTUxTZXJpYWxpemVyKSkge1xyXG5cdFx0XHRyZXR1cm4gKG5ldyBYTUxTZXJpYWxpemVyKCkpLnNlcmlhbGl6ZVRvU3RyaW5nKG5vZGUpO1xyXG5cdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhub2RlLnhtbCkpIHtcclxuXHRcdFx0cmV0dXJuIG5vZGUueG1sO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3Qgc2VyaWFsaXplIHRoZSBub2RlLCBuZWl0aGVyIFhNTFNlcmlhbGl6ZXIgbm9yIHRoZSBbeG1sXSBwcm9wZXJ0eSB3ZXJlIGZvdW5kLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cGFyc2UgOiBmdW5jdGlvbih0ZXh0KSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRXhpc3RzKHRleHQpO1xyXG5cdFx0aWYgKHR5cGVvZiBfanNvbml4X3htbGRvbSAhPT0gJ3VuZGVmaW5lZCcpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiAobmV3IChfanNvbml4X3htbGRvbSkuRE9NUGFyc2VyKCkpLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAnYXBwbGljYXRpb24veG1sJyk7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBET01QYXJzZXIgIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0cmV0dXJuIChuZXcgRE9NUGFyc2VyKCkpLnBhcnNlRnJvbVN0cmluZyh0ZXh0LCAnYXBwbGljYXRpb24veG1sJyk7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBBY3RpdmVYT2JqZWN0ICE9ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHZhciBkb2MgPSBKc29uaXguRE9NLmNyZWF0ZURvY3VtZW50KCcnLCAnJyk7XHJcblx0XHRcdGRvYy5sb2FkWE1MKHRleHQpO1xyXG5cdFx0XHRyZXR1cm4gZG9jO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHVybCA9ICdkYXRhOnRleHQveG1sO2NoYXJzZXQ9dXRmLTgsJyArIGVuY29kZVVSSUNvbXBvbmVudCh0ZXh0KTtcclxuXHRcdFx0dmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0cmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwsIGZhbHNlKTtcclxuXHRcdFx0aWYgKHJlcXVlc3Qub3ZlcnJpZGVNaW1lVHlwZSkge1xyXG5cdFx0XHRcdHJlcXVlc3Qub3ZlcnJpZGVNaW1lVHlwZShcInRleHQveG1sXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJlcXVlc3Quc2VuZChudWxsKTtcclxuXHRcdFx0cmV0dXJuIHJlcXVlc3QucmVzcG9uc2VYTUw7XHJcblx0XHR9XHJcblx0fSxcclxuXHRsb2FkIDogZnVuY3Rpb24odXJsLCBjYWxsYmFjaywgb3B0aW9ucykge1xyXG5cclxuXHRcdHZhciByZXF1ZXN0ID0gSnNvbml4LlJlcXVlc3QuSU5TVEFOQ0U7XHJcblxyXG5cdFx0cmVxdWVzdC5pc3N1ZShcclxuXHRcdFx0XHRcdFx0dXJsLFxyXG5cdFx0XHRcdFx0XHRmdW5jdGlvbih0cmFuc3BvcnQpIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgcmVzdWx0O1xyXG5cdFx0XHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0cmFuc3BvcnQucmVzcG9uc2VYTUwpICYmIEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRyYW5zcG9ydC5yZXNwb25zZVhNTC5kb2N1bWVudEVsZW1lbnQpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQgPSB0cmFuc3BvcnQucmVzcG9uc2VYTUw7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHRyYW5zcG9ydC5yZXNwb25zZVRleHQpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHQgPSBKc29uaXguRE9NLnBhcnNlKHRyYW5zcG9ydC5yZXNwb25zZVRleHQpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1Jlc3BvbnNlIGRvZXMgbm90IGhhdmUgdmFsaWQgW3Jlc3BvbnNlWE1MXSBvciBbcmVzcG9uc2VUZXh0XS4nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0Y2FsbGJhY2socmVzdWx0KTtcclxuXHJcblx0XHRcdFx0XHRcdH0sIGZ1bmN0aW9uKHRyYW5zcG9ydCkge1xyXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IHJldHJpZXZlIFhNTCBmcm9tIFVSTCBbJyArIHVybFx0KyAnXS4nKTtcclxuXHJcblx0XHRcdFx0XHRcdH0sIG9wdGlvbnMpO1xyXG5cdH0sXHJcblx0eGxpbmtGaXhSZXF1aXJlZCA6IG51bGwsXHJcblx0aXNYbGlua0ZpeFJlcXVpcmVkIDogZnVuY3Rpb24gKClcclxuXHR7XHJcblx0XHRpZiAoSnNvbml4LkRPTS54bGlua0ZpeFJlcXVpcmVkID09PSBudWxsKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAodHlwZW9mIG5hdmlnYXRvciA9PT0gJ3VuZGVmaW5lZCcpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRKc29uaXguRE9NLnhsaW5rRml4UmVxdWlyZWQgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmICghIW5hdmlnYXRvci51c2VyQWdlbnQgJiYgKC9DaHJvbWUvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgL0dvb2dsZSBJbmMvLnRlc3QobmF2aWdhdG9yLnZlbmRvcikpKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIGRvYyA9IEpzb25peC5ET00uY3JlYXRlRG9jdW1lbnQoKTtcclxuXHRcdFx0XHR2YXIgZWwgPSBkb2MuY3JlYXRlRWxlbWVudCgndGVzdCcpO1xyXG5cdFx0XHRcdGVsLnNldEF0dHJpYnV0ZU5TKCdodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rJywgJ3hsaW5rOmhyZWYnLCAndXJuOnRlc3QnKTtcclxuXHRcdFx0XHRkb2MuYXBwZW5kQ2hpbGQoZWwpO1xyXG5cdFx0XHRcdHZhciB0ZXN0U3RyaW5nID0gSnNvbml4LkRPTS5zZXJpYWxpemUoZG9jKTtcclxuXHRcdFx0XHRKc29uaXguRE9NLnhsaW5rRml4UmVxdWlyZWQgPSAodGVzdFN0cmluZy5pbmRleE9mKCd4bWxuczp4bGluaycpID09PSAtMSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0SnNvbml4LkRPTS54bGlua0ZpeFJlcXVpcmVkID0gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBKc29uaXguRE9NLnhsaW5rRml4UmVxdWlyZWQ7XHJcblx0fVxyXG59O1xyXG5Kc29uaXguUmVxdWVzdCA9IEpzb25peFxyXG5cdFx0LkNsYXNzKHtcclxuXHRcdFx0Ly8gUkVXT1JLXHJcblx0XHRcdGZhY3RvcmllcyA6IFsgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01zeG1sMi5YTUxIVFRQJyk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgQWN0aXZlWE9iamVjdChcIk1zeG1sMi5YTUxIVFRQLjYuMFwiKTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KFwiTXN4bWwyLlhNTEhUVFAuMy4wXCIpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoJ01pY3Jvc29mdC5YTUxIVFRQJyk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdC8vIE5vZGUuanNcclxuXHRcdFx0XHRpZiAodHlwZW9mIF9qc29uaXhfeG1saHR0cHJlcXVlc3QgIT09ICd1bmRlZmluZWQnKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZhciBYTUxIdHRwUmVxdWVzdCA9IF9qc29uaXhfeG1saHR0cHJlcXVlc3QuWE1MSHR0cFJlcXVlc3Q7XHJcblx0XHRcdFx0XHRyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1dLFxyXG5cdFx0XHRpbml0aWFsaXplIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdH0sXHJcblx0XHRcdGlzc3VlIDogZnVuY3Rpb24odXJsLCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSwgb3B0aW9ucykge1xyXG5cdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodXJsKTtcclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMob25TdWNjZXNzKSkge1xyXG5cdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUZ1bmN0aW9uKG9uU3VjY2Vzcyk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG9uU3VjY2VzcyA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG9uRmFpbHVyZSkpIHtcclxuXHRcdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVGdW5jdGlvbihvbkZhaWx1cmUpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRvbkZhaWx1cmUgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhvcHRpb25zKSkge1xyXG5cdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChvcHRpb25zKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0b3B0aW9ucyA9IHt9O1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIHRyYW5zcG9ydCA9IHRoaXMuY3JlYXRlVHJhbnNwb3J0KCk7XHJcblxyXG5cdFx0XHRcdHZhciBtZXRob2QgPSBKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKG9wdGlvbnMubWV0aG9kKSA/IG9wdGlvbnMubWV0aG9kXHJcblx0XHRcdFx0XHRcdDogJ0dFVCc7XHJcblx0XHRcdFx0dmFyIGFzeW5jID0gSnNvbml4LlV0aWwuVHlwZS5pc0Jvb2xlYW4ob3B0aW9ucy5hc3luYykgPyBvcHRpb25zLmFzeW5jXHJcblx0XHRcdFx0XHRcdDogdHJ1ZTtcclxuXHRcdFx0XHR2YXIgcHJveHkgPSBKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKG9wdGlvbnMucHJveHkpID8gb3B0aW9ucy5wcm94eVxyXG5cdFx0XHRcdFx0XHQ6IEpzb25peC5SZXF1ZXN0LlBST1hZO1xyXG5cclxuXHRcdFx0XHR2YXIgdXNlciA9IEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcob3B0aW9ucy51c2VyKSA/IG9wdGlvbnMudXNlclxyXG5cdFx0XHRcdFx0XHQ6IG51bGw7XHJcblx0XHRcdFx0dmFyIHBhc3N3b3JkID0gSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhvcHRpb25zLnBhc3N3b3JkKSA/IG9wdGlvbnMucGFzc3dvcmRcclxuXHRcdFx0XHRcdFx0OiBudWxsO1xyXG5cclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhwcm94eSkgJiYgKHVybC5pbmRleE9mKFwiaHR0cFwiKSA9PT0gMCkpIHtcclxuXHRcdFx0XHRcdHVybCA9IHByb3h5ICsgZW5jb2RlVVJJQ29tcG9uZW50KHVybCk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh1c2VyKSkge1xyXG5cdFx0XHRcdFx0dHJhbnNwb3J0Lm9wZW4obWV0aG9kLCB1cmwsIGFzeW5jLCB1c2VyLCBwYXNzd29yZCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRyYW5zcG9ydC5vcGVuKG1ldGhvZCwgdXJsLCBhc3luYyk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChvcHRpb25zLmhlYWRlcnMpKSB7XHJcblxyXG5cdFx0XHRcdFx0Zm9yICggdmFyIGhlYWRlciBpbiBvcHRpb25zLmhlYWRlcnMpIHtcclxuXHRcdFx0XHRcdFx0aWYgKG9wdGlvbnMuaGVhZGVycy5oYXNPd25Qcm9wZXJ0eShoZWFkZXIpKSB7XHJcblx0XHRcdFx0XHRcdFx0dHJhbnNwb3J0LnNldFJlcXVlc3RIZWFkZXIoaGVhZGVyLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRvcHRpb25zLmhlYWRlcnNbaGVhZGVyXSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBkYXRhID0gSnNvbml4LlV0aWwuVHlwZS5leGlzdHMob3B0aW9ucy5kYXRhKSA/IG9wdGlvbnMuZGF0YVxyXG5cdFx0XHRcdFx0XHQ6IG51bGw7XHJcblx0XHRcdFx0aWYgKCFhc3luYykge1xyXG5cdFx0XHRcdFx0dHJhbnNwb3J0LnNlbmQoZGF0YSk7XHJcblx0XHRcdFx0XHR0aGlzLmhhbmRsZVRyYW5zcG9ydCh0cmFuc3BvcnQsIG9uU3VjY2Vzcywgb25GYWlsdXJlKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0XHRcdFx0aWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XHJcblxyXG5cdFx0XHRcdFx0XHR0cmFuc3BvcnQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC5oYW5kbGVUcmFuc3BvcnQodHJhbnNwb3J0LCBvblN1Y2Nlc3MsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG9uRmFpbHVyZSk7XHJcblx0XHRcdFx0XHRcdH07XHJcblxyXG5cdFx0XHRcdFx0XHR3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHR0cmFuc3BvcnQuc2VuZChkYXRhKTtcclxuXHRcdFx0XHRcdFx0fSwgMCk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cclxuXHRcdFx0XHRcdFx0dHJhbnNwb3J0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHRoYXQuaGFuZGxlVHJhbnNwb3J0KHRyYW5zcG9ydCwgb25TdWNjZXNzLCBvbkZhaWx1cmUpO1xyXG5cdFx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0XHR0cmFuc3BvcnQuc2VuZChkYXRhKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHRyYW5zcG9ydDtcclxuXHJcblx0XHRcdH0sXHJcblx0XHRcdGhhbmRsZVRyYW5zcG9ydCA6IGZ1bmN0aW9uKHRyYW5zcG9ydCwgb25TdWNjZXNzLCBvbkZhaWx1cmUpIHtcclxuXHRcdFx0XHRpZiAodHJhbnNwb3J0LnJlYWR5U3RhdGUgPT0gNCkge1xyXG5cdFx0XHRcdFx0aWYgKCF0cmFuc3BvcnQuc3RhdHVzIHx8ICh0cmFuc3BvcnQuc3RhdHVzID49IDIwMCAmJiB0cmFuc3BvcnQuc3RhdHVzIDwgMzAwKSkge1xyXG5cdFx0XHRcdFx0XHRvblN1Y2Nlc3ModHJhbnNwb3J0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICh0cmFuc3BvcnQuc3RhdHVzICYmICh0cmFuc3BvcnQuc3RhdHVzIDwgMjAwIHx8IHRyYW5zcG9ydC5zdGF0dXMgPj0gMzAwKSkge1xyXG5cdFx0XHRcdFx0XHRvbkZhaWx1cmUodHJhbnNwb3J0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGNyZWF0ZVRyYW5zcG9ydCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA9IDAsIGxlbmd0aCA9IHRoaXMuZmFjdG9yaWVzLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdHRyeSB7XHJcblx0XHRcdFx0XHRcdHZhciB0cmFuc3BvcnQgPSB0aGlzLmZhY3Rvcmllc1tpbmRleF0oKTtcclxuXHRcdFx0XHRcdFx0aWYgKHRyYW5zcG9ydCAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB0cmFuc3BvcnQ7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gY2F0Y2ggKGUpIHtcclxuXHRcdFx0XHRcdFx0Ly8gVE9ETyBsb2dcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgY3JlYXRlIFhNTCBIVFRQIHRyYW5zcG9ydC4nKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Q0xBU1NfTkFNRSA6ICdKc29uaXguUmVxdWVzdCdcclxuXHRcdH0pO1xyXG5Kc29uaXguUmVxdWVzdC5JTlNUQU5DRSA9IG5ldyBKc29uaXguUmVxdWVzdCgpO1xyXG5Kc29uaXguUmVxdWVzdC5QUk9YWSA9IG51bGw7XHJcbkpzb25peC5TY2hlbWEgPSB7fTtcclxuSnNvbml4Lk1vZGVsID0ge307XHJcbkpzb25peC5VdGlsLlR5cGUgPSB7XHJcblx0ZXhpc3RzIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJyAmJiB2YWx1ZSAhPT0gbnVsbCk7XHJcblx0fSxcclxuXHRpc1VuZGVmaW5lZCA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAndW5kZWZpbmVkJztcclxuXHR9LFxyXG5cdGlzU3RyaW5nIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnO1xyXG5cdH0sXHJcblx0aXNCb29sZWFuIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdib29sZWFuJztcclxuXHR9LFxyXG5cdGlzT2JqZWN0IDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnO1xyXG5cdH0sXHJcblx0aXNGdW5jdGlvbiA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xyXG5cdH0sXHJcblx0aXNOdW1iZXIgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSAmJiAhaXNOYU4odmFsdWUpO1xyXG5cdH0sXHJcblx0aXNOdW1iZXJPck5hTiA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gKHZhbHVlID09PSArdmFsdWUpIHx8IChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodmFsdWUpID09PSAnW29iamVjdCBOdW1iZXJdJyk7XHJcblx0fSxcclxuXHRpc05hTiA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gSnNvbml4LlV0aWwuVHlwZS5pc051bWJlck9yTmFOKHZhbHVlKSAmJiBpc05hTih2YWx1ZSk7XHJcblx0fSxcclxuXHRpc0FycmF5IDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdC8vIHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIEFycmF5O1xyXG5cdFx0cmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLmNvbmNhdCAmJiB2YWx1ZS51bnNoaWZ0ICYmICF2YWx1ZS5jYWxsZWUpO1xyXG5cdH0sXHJcblx0aXNEYXRlIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS5nZXRUaW1lem9uZU9mZnNldCAmJiB2YWx1ZS5zZXRVVENGdWxsWWVhcik7XHJcblx0fSxcclxuXHRpc1JlZ0V4cCA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gISEodmFsdWUgJiYgdmFsdWUudGVzdCAmJiB2YWx1ZS5leGVjICYmICh2YWx1ZS5pZ25vcmVDYXNlIHx8IHZhbHVlLmlnbm9yZUNhc2UgPT09IGZhbHNlKSk7XHJcblx0fSxcclxuXHRpc05vZGUgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuICh0eXBlb2YgTm9kZSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgTm9kZSA9PT0gXCJmdW5jdGlvblwiKSA/ICh2YWx1ZSBpbnN0YW5jZW9mIE5vZGUpIDogKHZhbHVlICYmICh0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIpICYmICh0eXBlb2YgdmFsdWUubm9kZVR5cGUgPT09IFwibnVtYmVyXCIpICYmICh0eXBlb2YgdmFsdWUubm9kZU5hbWU9PT1cInN0cmluZ1wiKSk7XHJcblx0fSxcclxuXHRpc0VxdWFsIDogZnVuY3Rpb24oYSwgYiwgcmVwb3J0KSB7XHJcblx0XHR2YXIgZG9SZXBvcnQgPSBKc29uaXguVXRpbC5UeXBlLmlzRnVuY3Rpb24ocmVwb3J0KTtcclxuXHRcdC8vIFRPRE8gcmV3b3JrXHJcblx0XHR2YXIgX3JhbmdlID0gZnVuY3Rpb24oc3RhcnQsIHN0b3AsIHN0ZXApIHtcclxuXHRcdFx0dmFyIGFyZ3MgPSBzbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcblx0XHRcdHZhciBzb2xvID0gYXJncy5sZW5ndGggPD0gMTtcclxuXHRcdFx0dmFyIHN0YXJ0XyA9IHNvbG8gPyAwIDogYXJnc1swXTtcclxuXHRcdFx0dmFyIHN0b3BfID0gc29sbyA/IGFyZ3NbMF0gOiBhcmdzWzFdO1xyXG5cdFx0XHR2YXIgc3RlcF8gPSBhcmdzWzJdIHx8IDE7XHJcblx0XHRcdHZhciBsZW4gPSBNYXRoLm1heChNYXRoLmNlaWwoKHN0b3BfIC0gc3RhcnRfKSAvIHN0ZXBfKSwgMCk7XHJcblx0XHRcdHZhciBpZHggPSAwO1xyXG5cdFx0XHR2YXIgcmFuZ2UgPSBuZXcgQXJyYXkobGVuKTtcclxuXHRcdFx0d2hpbGUgKGlkeCA8IGxlbikge1xyXG5cdFx0XHRcdHJhbmdlW2lkeCsrXSA9IHN0YXJ0XztcclxuXHRcdFx0XHRzdGFydF8gKz0gc3RlcF87XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHJhbmdlO1xyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgX2tleXMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbihvYmopIHtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNBcnJheShvYmopKSB7XHJcblx0XHRcdFx0cmV0dXJuIF9yYW5nZSgwLCBvYmoubGVuZ3RoKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIga2V5cyA9IFtdO1xyXG5cdFx0XHRmb3IgKCB2YXIga2V5IGluIG9iaikge1xyXG5cdFx0XHRcdGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG5cdFx0XHRcdFx0a2V5c1trZXlzLmxlbmd0aF0gPSBrZXk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBrZXlzO1xyXG5cdFx0fTtcclxuXHJcblx0XHQvLyBDaGVjayBvYmplY3QgaWRlbnRpdHkuXHJcblx0XHRpZiAoYSA9PT0gYikge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBDaGVjayBpZiBib3RoIGFyZSBOYU5zXHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc05hTihhKSAmJiBKc29uaXguVXRpbC5UeXBlLmlzTmFOKGIpKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Ly8gRGlmZmVyZW50IHR5cGVzP1xyXG5cdFx0dmFyIGF0eXBlID0gdHlwZW9mIGE7XHJcblx0XHR2YXIgYnR5cGUgPSB0eXBlb2YgYjtcclxuXHRcdGlmIChhdHlwZSAhPSBidHlwZSkge1xyXG5cdFx0XHRpZiAoZG9SZXBvcnQpIHtcclxuXHRcdFx0XHRyZXBvcnQoJ1R5cGVzIGRpZmZlciBbJyArIGF0eXBlICsgJ10sIFsnICsgYnR5cGUgKyAnXS4nKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHQvLyBCYXNpYyBlcXVhbGl0eSB0ZXN0ICh3YXRjaCBvdXQgZm9yIGNvZXJjaW9ucykuXHJcblx0XHRpZiAoYSA9PSBiKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Ly8gT25lIGlzIGZhbHN5IGFuZCB0aGUgb3RoZXIgdHJ1dGh5LlxyXG5cdFx0aWYgKCghYSAmJiBiKSB8fCAoYSAmJiAhYikpIHtcclxuXHRcdFx0aWYgKGRvUmVwb3J0KSB7XHJcblx0XHRcdFx0cmVwb3J0KCdPbmUgaXMgZmFsc3ksIHRoZSBvdGhlciBpcyB0cnV0aHkuJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Ly8gQ2hlY2sgZGF0ZXMnIGludGVnZXIgdmFsdWVzLlxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNEYXRlKGEpICYmIEpzb25peC5VdGlsLlR5cGUuaXNEYXRlKGIpKSB7XHJcblx0XHRcdHJldHVybiBhLmdldFRpbWUoKSA9PT0gYi5nZXRUaW1lKCk7XHJcblx0XHR9XHJcblx0XHQvLyBCb3RoIGFyZSBOYU4/XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc05hTihhKSAmJiBKc29uaXguVXRpbC5UeXBlLmlzTmFOKGIpKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdC8vIENvbXBhcmUgcmVndWxhciBleHByZXNzaW9ucy5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzUmVnRXhwKGEpICYmIEpzb25peC5VdGlsLlR5cGUuaXNSZWdFeHAoYikpIHtcclxuXHRcdFx0cmV0dXJuIGEuc291cmNlID09PSBiLnNvdXJjZSAmJiBhLmdsb2JhbCA9PT0gYi5nbG9iYWwgJiYgYS5pZ25vcmVDYXNlID09PSBiLmlnbm9yZUNhc2UgJiYgYS5tdWx0aWxpbmUgPT09IGIubXVsdGlsaW5lO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc05vZGUoYSkgJiYgSnNvbml4LlV0aWwuVHlwZS5pc05vZGUoYikpXHJcblx0XHR7XHJcblx0XHRcdHZhciBhU2VyaWFsaXplZCA9IEpzb25peC5ET00uc2VyaWFsaXplKGEpO1xyXG5cdFx0XHR2YXIgYlNlcmlhbGl6ZWQgPSBKc29uaXguRE9NLnNlcmlhbGl6ZShiKTtcclxuXHRcdFx0aWYgKGFTZXJpYWxpemVkICE9PSBiU2VyaWFsaXplZClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmIChkb1JlcG9ydClcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXBvcnQoJ05vZGVzIGRpZmZlci4nKTtcclxuXHRcdFx0XHRcdHJlcG9ydCgnQT0nICsgYVNlcmlhbGl6ZWQpO1xyXG5cdFx0XHRcdFx0cmVwb3J0KCdCPScgKyBiU2VyaWFsaXplZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHQvLyBJZiBhIGlzIG5vdCBhbiBvYmplY3QgYnkgdGhpcyBwb2ludCwgd2UgY2FuJ3QgaGFuZGxlIGl0LlxyXG5cdFx0aWYgKGF0eXBlICE9PSAnb2JqZWN0Jykge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHQvLyBDaGVjayBmb3IgZGlmZmVyZW50IGFycmF5IGxlbmd0aHMgYmVmb3JlIGNvbXBhcmluZyBjb250ZW50cy5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzQXJyYXkoYSkgJiYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkpIHtcclxuXHRcdFx0aWYgKGRvUmVwb3J0KSB7XHJcblx0XHRcdFx0XHRyZXBvcnQoJ0xlbmd0aHMgZGlmZmVyLicpO1xyXG5cdFx0XHRcdFx0cmVwb3J0KCdBLmxlbmd0aD0nICsgYS5sZW5ndGgpO1xyXG5cdFx0XHRcdFx0cmVwb3J0KCdCLmxlbmd0aD0nICsgYi5sZW5ndGgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdC8vIE5vdGhpbmcgZWxzZSB3b3JrZWQsIGRlZXAgY29tcGFyZSB0aGUgY29udGVudHMuXHJcblx0XHR2YXIgYUtleXMgPSBfa2V5cyhhKTtcclxuXHRcdHZhciBiS2V5cyA9IF9rZXlzKGIpO1xyXG5cdFx0Ly8gRGlmZmVyZW50IG9iamVjdCBzaXplcz9cclxuXHRcdGlmIChhS2V5cy5sZW5ndGggIT09IGJLZXlzLmxlbmd0aCkge1xyXG5cdFx0XHRpZiAoZG9SZXBvcnQpIHtcclxuXHRcdFx0XHRyZXBvcnQoJ0RpZmZlcmVudCBudW1iZXIgb2YgcHJvcGVydGllcyBbJyArIGFLZXlzLmxlbmd0aCArICddLCBbJyArIGJLZXlzLmxlbmd0aCArICddLicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGZvciAoIHZhciBhbmRleCA9IDA7IGFuZGV4IDwgYUtleXMubGVuZ3RoOyBhbmRleCsrKSB7XHJcblx0XHRcdFx0aWYgKGRvUmVwb3J0KSB7XHJcblx0XHRcdFx0XHRyZXBvcnQoJ0EgWycgKyBhS2V5c1thbmRleF0gKyAnXT0nICsgYVthS2V5c1thbmRleF1dKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yICggdmFyIGJuZGV4ID0gMDsgYm5kZXggPCBiS2V5cy5sZW5ndGg7IGJuZGV4KyspIHtcclxuXHRcdFx0XHRpZiAoZG9SZXBvcnQpIHtcclxuXHRcdFx0XHRcdHJlcG9ydCgnQiBbJyArIGJLZXlzW2JuZGV4XSArICddPScgKyBiW2JLZXlzW2JuZGV4XV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHQvLyBSZWN1cnNpdmUgY29tcGFyaXNvbiBvZiBjb250ZW50cy5cclxuXHRcdGZvciAodmFyIGtuZGV4ID0gMDsga25kZXggPCBhS2V5cy5sZW5ndGg7IGtuZGV4KyspIHtcclxuXHRcdFx0dmFyIGtleSA9IGFLZXlzW2tuZGV4XTtcclxuXHRcdFx0aWYgKCEoa2V5IGluIGIpIHx8ICFKc29uaXguVXRpbC5UeXBlLmlzRXF1YWwoYVtrZXldLCBiW2tleV0sIHJlcG9ydCkpIHtcclxuXHRcdFx0XHRpZiAoZG9SZXBvcnQpIHtcclxuXHRcdFx0XHRcdHJlcG9ydCgnT25lIG9mIHRoZSBwcm9wZXJ0aWVzIGRpZmZlci4nKTtcclxuXHRcdFx0XHRcdHJlcG9ydCgnS2V5OiBbJyArIGtleSArICddLicpO1xyXG5cdFx0XHRcdFx0cmVwb3J0KCdMZWZ0OiBbJyArIGFba2V5XSArICddLicpO1xyXG5cdFx0XHRcdFx0cmVwb3J0KCdSaWdodDogWycgKyBiW2tleV0gKyAnXS4nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9LFxyXG5cdGNsb25lT2JqZWN0IDogZnVuY3Rpb24gKHNvdXJjZSwgdGFyZ2V0KVxyXG5cdHtcclxuXHRcdHRhcmdldCA9IHRhcmdldCB8fCB7fTtcclxuXHRcdGZvciAodmFyIHAgaW4gc291cmNlKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAoc291cmNlLmhhc093blByb3BlcnR5KHApKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGFyZ2V0W3BdID0gc291cmNlW3BdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGFyZ2V0O1xyXG5cdH0sXHJcblx0ZGVmYXVsdFZhbHVlIDogZnVuY3Rpb24oKVxyXG5cdHtcclxuXHRcdHZhciBhcmdzID0gYXJndW1lbnRzO1xyXG5cdFx0aWYgKGFyZ3MubGVuZ3RoID09PSAwKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgZGVmYXVsdFZhbHVlID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdO1xyXG5cdFx0XHR2YXIgdHlwZU9mRGVmYXVsdFZhbHVlID0gdHlwZW9mIGRlZmF1bHRWYWx1ZTtcclxuXHRcdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGFyZ3MubGVuZ3RoIC0gMTsgaW5kZXgrKylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHZhciBjYW5kaWRhdGVWYWx1ZSA9IGFyZ3NbaW5kZXhdO1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgY2FuZGlkYXRlVmFsdWUgPT09IHR5cGVPZkRlZmF1bHRWYWx1ZSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm4gY2FuZGlkYXRlVmFsdWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBkZWZhdWx0VmFsdWU7XHJcblx0XHRcdFxyXG5cdFx0fVxyXG5cdH1cclxufTtcclxuSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMgPSB7XHJcblx0aXNJbnRlZ2VyIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKHZhbHVlKSAmJiAoKHZhbHVlICUgMSkgPT09IDApO1xyXG5cdH1cclxufTtcclxuSnNvbml4LlV0aWwuU3RyaW5nVXRpbHMgPSB7XHJcblx0dHJpbSA6ICghIVN0cmluZy5wcm90b3R5cGUudHJpbSkgP1xyXG5cdGZ1bmN0aW9uKHN0cikge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhzdHIpO1xyXG5cdFx0cmV0dXJuIHN0ci50cmltKCk7XHJcblx0fSA6XHJcblx0ZnVuY3Rpb24oc3RyKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHN0cik7XHJcblx0XHRyZXR1cm4gc3RyLnJlcGxhY2UoL15cXHNcXHMqLywgJycpLnJlcGxhY2UoL1xcc1xccyokLywgJycpO1xyXG5cdH0sXHJcblx0LyogaXNFbXB0eSA6IGZ1bmN0aW9uKHN0cikge1xyXG5cdFx0dmFyIHdjbSA9IEpzb25peC5VdGlsLlN0cmluZ1V0aWxzLndoaXRlc3BhY2VDaGFyYWN0ZXJzTWFwO1xyXG5cdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHN0ci5sZW5ndGg7IGluZGV4KyspXHJcblx0XHR7XHJcblx0XHRcdGlmICghd2NtW3N0cltpbmRleF1dKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9LCAqL1xyXG5cdGlzRW1wdHkgOiBmdW5jdGlvbihzdHIpIHtcclxuXHRcdHZhciBsZW5ndGggPSBzdHIubGVuZ3RoO1xyXG5cdFx0aWYgKCFsZW5ndGgpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKVxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgYyA9IHN0cltpbmRleF07XHJcblx0XHRcdGlmIChjID09PSAnICcpXHJcblx0XHRcdHtcclxuXHRcdFx0XHQvLyBza2lwXHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoYyA+ICdcXHUwMDBEJyAmJiBjIDwgJ1xcdTAwODUnKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGMgPCAnXFx1MDBBMCcpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoYyA8ICdcXHUwMDA5JylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKGMgPiAnXFx1MDA4NScpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChjID4gJ1xcdTAwQTAnKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKGMgPCAnXFx1MjAyOCcpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYgKGMgPCAnXFx1MTgwRScpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGlmIChjIDwgJ1xcdTE2ODAnKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYoYyA+ICdcXHUxNjgwJylcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAoYyA+ICdcXHUxODBFJylcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0aWYgKGMgPCAnXFx1MjAwMCcpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSBpZiAoYyA+ICdcXHUyMDBBJylcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChjID4gJ1xcdTIwMjknKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmIChjIDwgJ1xcdTIwNUYnKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRpZiAoYyA8ICdcXHUyMDJGJylcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIChjID4gJ1xcdTIwMkYnKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChjID4gJ1xcdTIwNUYnKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRpZiAoYyA8ICdcXHUzMDAwJylcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIChjID4gJ1xcdTMwMDAnKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9LFxyXG5cdGlzTm90QmxhbmsgOiBmdW5jdGlvbihzdHIpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHN0cikgJiYgIUpzb25peC5VdGlsLlN0cmluZ1V0aWxzLmlzRW1wdHkoc3RyKTtcclxuXHR9LFxyXG5cdHdoaXRlc3BhY2VDaGFyYWN0ZXJzOiAnXFx1MDAwOVxcdTAwMEFcXHUwMDBCXFx1MDAwQ1xcdTAwMEQgXFx1MDA4NVxcdTAwQTBcXHUxNjgwXFx1MTgwRVxcdTIwMDBcXHUyMDAxXFx1MjAwMlxcdTIwMDNcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyOFxcdTIwMjlcXHUyMDJGXFx1MjA1RlxcdTMwMDAnLFxyXG5cdHdoaXRlc3BhY2VDaGFyYWN0ZXJzTWFwOiB7XHJcblx0XHQnXFx1MDAwOScgOiB0cnVlLFxyXG5cdFx0J1xcdTAwMEEnIDogdHJ1ZSxcclxuXHRcdCdcXHUwMDBCJyA6IHRydWUsXHJcblx0XHQnXFx1MDAwQycgOiB0cnVlLFxyXG5cdFx0J1xcdTAwMEQnIDogdHJ1ZSxcclxuXHRcdCcgJyA6IHRydWUsXHJcblx0XHQnXFx1MDA4NScgOiB0cnVlLFxyXG5cdFx0J1xcdTAwQTAnIDogdHJ1ZSxcclxuXHRcdCdcXHUxNjgwJyA6IHRydWUsXHJcblx0XHQnXFx1MTgwRScgOiB0cnVlLFxyXG5cdFx0J1xcdTIwMDAnIDogdHJ1ZSxcclxuXHRcdCdcXHUyMDAxJyA6IHRydWUsXHJcblx0XHQnXFx1MjAwMicgOiB0cnVlLFxyXG5cdFx0J1xcdTIwMDMnIDogdHJ1ZSxcclxuXHRcdCdcXHUyMDA0JyA6IHRydWUsXHJcblx0XHQnXFx1MjAwNScgOiB0cnVlLFxyXG5cdFx0J1xcdTIwMDYnIDogdHJ1ZSxcclxuXHRcdCdcXHUyMDA3JyA6IHRydWUsXHJcblx0XHQnXFx1MjAwOCcgOiB0cnVlLFxyXG5cdFx0J1xcdTIwMDknIDogdHJ1ZSxcclxuXHRcdCdcXHUyMDBBJyA6IHRydWUsXHJcblx0XHQnXFx1MjAyOCcgOiB0cnVlLFxyXG5cdFx0J1xcdTIwMjknIDogdHJ1ZSxcclxuXHRcdCdcXHUyMDJGJyA6IHRydWUsXHJcblx0XHQnXFx1MjA1RicgOiB0cnVlLFxyXG5cdFx0J1xcdTMwMDAnIDogdHJ1ZVxyXG5cdH0sXHJcblx0c3BsaXRCeVNlcGFyYXRvckNoYXJzIDogZnVuY3Rpb24oc3RyLCBzZXBhcmF0b3JDaGFycykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhzdHIpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhzZXBhcmF0b3JDaGFycyk7XHJcblx0XHR2YXIgbGVuID0gc3RyLmxlbmd0aDtcclxuXHRcdGlmIChsZW4gPT09IDApIHtcclxuXHRcdFx0cmV0dXJuIFtdO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHNlcGFyYXRvckNoYXJzLmxlbmd0aCA9PT0gMSlcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIHN0ci5zcGxpdChzZXBhcmF0b3JDaGFycyk7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHZhciBsaXN0ID0gW107XHJcblx0XHRcdHZhciBzaXplUGx1czEgPSAxO1xyXG5cdFx0XHR2YXIgaSA9IDA7XHJcblx0XHRcdHZhciBzdGFydCA9IDA7XHJcblx0XHRcdHZhciBtYXRjaCA9IGZhbHNlO1xyXG5cdFx0XHR2YXIgbGFzdE1hdGNoID0gZmFsc2U7XHJcblx0XHRcdHZhciBtYXggPSAtMTtcclxuXHRcdFx0dmFyIHByZXNlcnZlQWxsVG9rZW5zID0gZmFsc2U7XHJcblx0XHRcdC8vIHN0YW5kYXJkIGNhc2VcclxuXHRcdFx0XHR3aGlsZSAoaSA8IGxlbikge1xyXG5cdFx0XHRcdFx0XHRpZiAoc2VwYXJhdG9yQ2hhcnMuaW5kZXhPZihzdHIuY2hhckF0KGkpKSA+PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAobWF0Y2ggfHwgcHJlc2VydmVBbGxUb2tlbnMpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0TWF0Y2ggPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmIChzaXplUGx1czErKyA9PSBtYXgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0aSA9IGxlbjtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0bGFzdE1hdGNoID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxpc3QucHVzaChzdHIuc3Vic3RyaW5nKHN0YXJ0LCBpKSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bWF0Y2ggPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdHN0YXJ0ID0gKytpO1xyXG5cdFx0XHRcdFx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0bGFzdE1hdGNoID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdG1hdGNoID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0aSsrO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAobWF0Y2ggfHwgKHByZXNlcnZlQWxsVG9rZW5zICYmIGxhc3RNYXRjaCkpIHtcclxuXHRcdFx0XHRcdGxpc3QucHVzaChzdHIuc3Vic3RyaW5nKHN0YXJ0LCBpKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGxpc3Q7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5Kc29uaXguVXRpbC5FbnN1cmUgPSB7XHJcblx0ZW5zdXJlQm9vbGVhbiA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuaXNCb29sZWFuKHZhbHVlKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IFsnICsgdmFsdWUgKyAnXSBtdXN0IGJlIGEgYm9vbGVhbi4nKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGVuc3VyZVN0cmluZyA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodmFsdWUpKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgWycgKyB2YWx1ZSArICddIG11c3QgYmUgYSBzdHJpbmcuJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRlbnN1cmVOdW1iZXIgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKHZhbHVlKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IFsnICsgdmFsdWUgKyAnXSBtdXN0IGJlIGEgbnVtYmVyLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZW5zdXJlTnVtYmVyT3JOYU4gOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyT3JOYU4odmFsdWUpKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgWycgKyB2YWx1ZSArICddIG11c3QgYmUgYSBudW1iZXIgb3IgTmFOLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZW5zdXJlSW50ZWdlciA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIodmFsdWUpKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgWycgKyB2YWx1ZSArICddIG11c3QgYmUgYW4gaW50ZWdlciwgYnV0IGl0IGlzIG5vdCBhIG51bWJlci4nKTtcclxuXHRcdH0gZWxzZSBpZiAoIUpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZSkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBbJyArIHZhbHVlICsgJ10gbXVzdCBiZSBhbiBpbnRlZ2VyLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZW5zdXJlRGF0ZSA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRpZiAoISh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgWycgKyB2YWx1ZSArICddIG11c3QgYmUgYSBkYXRlLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZW5zdXJlT2JqZWN0IDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh2YWx1ZSkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBbJyArIHZhbHVlICsgJ10gbXVzdCBiZSBhbiBvYmplY3QuJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRlbnN1cmVBcnJheSA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuaXNBcnJheSh2YWx1ZSkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBbJyArIHZhbHVlICsgJ10gbXVzdCBiZSBhbiBhcnJheS4nKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGVuc3VyZUZ1bmN0aW9uIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5pc0Z1bmN0aW9uKHZhbHVlKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IFsnICsgdmFsdWUgKyAnXSBtdXN0IGJlIGEgZnVuY3Rpb24uJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRlbnN1cmVFeGlzdHMgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZSkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBbJyArIHZhbHVlICsgJ10gZG9lcyBub3QgZXhpc3QuJyk7XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5Kc29uaXguWE1MLlFOYW1lID0gSnNvbml4LkNsYXNzKHtcclxuXHRrZXkgOiBudWxsLFxyXG5cdG5hbWVzcGFjZVVSSSA6IG51bGwsXHJcblx0bG9jYWxQYXJ0IDogbnVsbCxcclxuXHRwcmVmaXggOiBudWxsLFxyXG5cdHN0cmluZyA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG9uZSwgdHdvLCB0aHJlZSkge1xyXG5cdFx0dmFyIG5hbWVzcGFjZVVSSTtcclxuXHRcdHZhciBsb2NhbFBhcnQ7XHJcblx0XHR2YXIgcHJlZml4O1xyXG5cdFx0dmFyIGtleTtcclxuXHRcdHZhciBzdHJpbmc7XHJcblxyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0d28pKSB7XHJcblx0XHRcdG5hbWVzcGFjZVVSSSA9ICcnO1xyXG5cdFx0XHRsb2NhbFBhcnQgPSBvbmU7XHJcblx0XHRcdHByZWZpeCA9ICcnO1xyXG5cdFx0fSBlbHNlIGlmICghSnNvbml4LlV0aWwuVHlwZS5leGlzdHModGhyZWUpKSB7XHJcblx0XHRcdG5hbWVzcGFjZVVSSSA9IEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG9uZSkgPyBvbmUgOiAnJztcclxuXHRcdFx0bG9jYWxQYXJ0ID0gdHdvO1xyXG5cdFx0XHR2YXIgY29sb25Qb3NpdGlvbiA9IHR3by5pbmRleE9mKCc6Jyk7XHJcblx0XHRcdGlmIChjb2xvblBvc2l0aW9uID4gMCAmJiBjb2xvblBvc2l0aW9uIDwgdHdvLmxlbmd0aCkge1xyXG5cdFx0XHRcdHByZWZpeCA9IHR3by5zdWJzdHJpbmcoMCwgY29sb25Qb3NpdGlvbik7XHJcblx0XHRcdFx0bG9jYWxQYXJ0ID0gdHdvLnN1YnN0cmluZyhjb2xvblBvc2l0aW9uICsgMSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cHJlZml4ID0gJyc7XHJcblx0XHRcdFx0bG9jYWxQYXJ0ID0gdHdvO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRuYW1lc3BhY2VVUkkgPSBKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhvbmUpID8gb25lIDogJyc7XHJcblx0XHRcdGxvY2FsUGFydCA9IHR3bztcclxuXHRcdFx0cHJlZml4ID0gSnNvbml4LlV0aWwuVHlwZS5leGlzdHModGhyZWUpID8gdGhyZWUgOiAnJztcclxuXHRcdH1cclxuXHRcdHRoaXMubmFtZXNwYWNlVVJJID0gbmFtZXNwYWNlVVJJO1xyXG5cdFx0dGhpcy5sb2NhbFBhcnQgPSBsb2NhbFBhcnQ7XHJcblx0XHR0aGlzLnByZWZpeCA9IHByZWZpeDtcclxuXHJcblx0XHR0aGlzLmtleSA9IChuYW1lc3BhY2VVUkkgIT09ICcnID8gKCd7JyArIG5hbWVzcGFjZVVSSSArICd9JykgOiAnJykgKyBsb2NhbFBhcnQ7XHJcblx0XHR0aGlzLnN0cmluZyA9IChuYW1lc3BhY2VVUkkgIT09ICcnID8gKCd7JyArIG5hbWVzcGFjZVVSSSArICd9JykgOiAnJykgKyAocHJlZml4ICE9PSAnJyA/IChwcmVmaXggKyAnOicpIDogJycpICsgbG9jYWxQYXJ0O1xyXG5cdH0sXHJcblx0dG9TdHJpbmcgOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLnN0cmluZztcclxuXHR9LFxyXG5cdC8vIGZvbzpiYXJcclxuXHR0b0Nhbm9uaWNhbFN0cmluZzogZnVuY3Rpb24obmFtZXNwYWNlQ29udGV4dCkge1xyXG5cdFx0dmFyIGNhbm9uaWNhbFByZWZpeCA9IG5hbWVzcGFjZUNvbnRleHQgPyBuYW1lc3BhY2VDb250ZXh0LmdldFByZWZpeCh0aGlzLm5hbWVzcGFjZVVSSSwgdGhpcy5wcmVmaXgpIDogdGhpcy5wcmVmaXg7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmVmaXggKyAodGhpcy5wcmVmaXggPT09ICcnID8gJycgOiAnOicpICsgdGhpcy5sb2NhbFBhcnQ7XHJcblx0fSxcclxuXHRjbG9uZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIG5ldyBKc29uaXguWE1MLlFOYW1lKHRoaXMubmFtZXNwYWNlVVJJLCB0aGlzLmxvY2FsUGFydCwgdGhpcy5wcmVmaXgpO1xyXG5cdH0sXHJcblx0ZXF1YWxzIDogZnVuY3Rpb24odGhhdCkge1xyXG5cdFx0aWYgKCF0aGF0KSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiAodGhpcy5uYW1lc3BhY2VVUkkgPT0gdGhhdC5uYW1lc3BhY2VVUkkpICYmICh0aGlzLmxvY2FsUGFydCA9PSB0aGF0LmxvY2FsUGFydCk7XHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6IFwiSnNvbml4LlhNTC5RTmFtZVwiXHJcbn0pO1xyXG5Kc29uaXguWE1MLlFOYW1lLmZyb21TdHJpbmcgPSBmdW5jdGlvbihxTmFtZUFzU3RyaW5nLCBuYW1lc3BhY2VDb250ZXh0LCBkZWZhdWx0TmFtZXNwYWNlVVJJKSB7XHJcblx0dmFyIGxlZnRCcmFja2V0ID0gcU5hbWVBc1N0cmluZy5pbmRleE9mKCd7Jyk7XHJcblx0dmFyIHJpZ2h0QnJhY2tldCA9IHFOYW1lQXNTdHJpbmcubGFzdEluZGV4T2YoJ30nKTtcclxuXHR2YXIgbmFtZXNwYWNlVVJJO1xyXG5cdHZhciBwcmVmaXhlZE5hbWU7XHJcblx0aWYgKChsZWZ0QnJhY2tldCA9PT0gMCkgJiYgKHJpZ2h0QnJhY2tldCA+IDApICYmIChyaWdodEJyYWNrZXQgPCBxTmFtZUFzU3RyaW5nLmxlbmd0aCkpIHtcclxuXHRcdG5hbWVzcGFjZVVSSSA9IHFOYW1lQXNTdHJpbmcuc3Vic3RyaW5nKDEsIHJpZ2h0QnJhY2tldCk7XHJcblx0XHRwcmVmaXhlZE5hbWUgPSBxTmFtZUFzU3RyaW5nLnN1YnN0cmluZyhyaWdodEJyYWNrZXQgKyAxKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0bmFtZXNwYWNlVVJJID0gbnVsbDtcclxuXHRcdHByZWZpeGVkTmFtZSA9IHFOYW1lQXNTdHJpbmc7XHJcblx0fVxyXG5cdHZhciBjb2xvblBvc2l0aW9uID0gcHJlZml4ZWROYW1lLmluZGV4T2YoJzonKTtcclxuXHR2YXIgcHJlZml4O1xyXG5cdHZhciBsb2NhbFBhcnQ7XHJcblx0aWYgKGNvbG9uUG9zaXRpb24gPiAwICYmIGNvbG9uUG9zaXRpb24gPCBwcmVmaXhlZE5hbWUubGVuZ3RoKSB7XHJcblx0XHRwcmVmaXggPSBwcmVmaXhlZE5hbWUuc3Vic3RyaW5nKDAsIGNvbG9uUG9zaXRpb24pO1xyXG5cdFx0bG9jYWxQYXJ0ID0gcHJlZml4ZWROYW1lLnN1YnN0cmluZyhjb2xvblBvc2l0aW9uICsgMSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHByZWZpeCA9ICcnO1xyXG5cdFx0bG9jYWxQYXJ0ID0gcHJlZml4ZWROYW1lO1xyXG5cdH1cclxuXHQvLyBJZiBuYW1lc3BhY2UgVVJJIHdhcyBub3Qgc2V0IGFuZCB3ZSBoYXZlIGEgbmFtZXNwYWNlIGNvbnRleHQsIHRyeSB0byBmaW5kIHRoZSBuYW1lc3BhY2UgVVJJIHZpYSB0aGlzIGNvbnRleHRcclxuXHRpZiAobmFtZXNwYWNlVVJJID09PSBudWxsKVxyXG5cdHtcclxuXHRcdGlmIChwcmVmaXggPT09ICcnICYmIEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcoZGVmYXVsdE5hbWVzcGFjZVVSSSkpXHJcblx0XHR7XHJcblx0XHRcdG5hbWVzcGFjZVVSSSA9IGRlZmF1bHROYW1lc3BhY2VVUkk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmIChuYW1lc3BhY2VDb250ZXh0KVxyXG5cdFx0e1xyXG5cdFx0XHRuYW1lc3BhY2VVUkkgPSBuYW1lc3BhY2VDb250ZXh0LmdldE5hbWVzcGFjZVVSSShwcmVmaXgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvLyBJZiB3ZSBkb24ndCBoYXZlIGEgbmFtZXNwYWNlIFVSSSwgYXNzdW1lICcnIGJ5IGRlZmF1bHRcclxuXHQvLyBUT0RPIGRvY3VtZW50IHRoZSBhc3N1bXB0aW9uXHJcblx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKG5hbWVzcGFjZVVSSSkpXHJcblx0e1xyXG5cdFx0bmFtZXNwYWNlVVJJID0gZGVmYXVsdE5hbWVzcGFjZVVSSSB8fCAnJztcclxuXHR9XHJcblx0cmV0dXJuIG5ldyBKc29uaXguWE1MLlFOYW1lKG5hbWVzcGFjZVVSSSwgbG9jYWxQYXJ0LCBwcmVmaXgpO1xyXG59O1xyXG5Kc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3QgPSBmdW5jdGlvbihvYmplY3QpIHtcclxuXHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG9iamVjdCk7XHJcblx0aWYgKG9iamVjdCBpbnN0YW5jZW9mIEpzb25peC5YTUwuUU5hbWUgfHwgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcob2JqZWN0LkNMQVNTX05BTUUpICYmIG9iamVjdC5DTEFTU19OQU1FID09PSAnSnNvbml4LlhNTC5RTmFtZScpKSB7XHJcblx0XHRyZXR1cm4gb2JqZWN0O1xyXG5cdH1cclxuXHR2YXIgbG9jYWxQYXJ0ID0gb2JqZWN0LmxvY2FsUGFydHx8b2JqZWN0LmxwfHxudWxsO1xyXG5cdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcobG9jYWxQYXJ0KTtcclxuXHR2YXIgbmFtZXNwYWNlVVJJID0gb2JqZWN0Lm5hbWVzcGFjZVVSSXx8b2JqZWN0Lm5zfHwnJztcclxuXHR2YXIgcHJlZml4ID0gb2JqZWN0LnByZWZpeHx8b2JqZWN0LnB8fCcnO1xyXG5cdHJldHVybiBuZXcgSnNvbml4LlhNTC5RTmFtZShuYW1lc3BhY2VVUkksIGxvY2FsUGFydCwgcHJlZml4KTtcclxufTtcclxuSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0T3JTdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSwgbmFtZXNwYWNlQ29udGV4dCwgZGVmYXVsdE5hbWVzcGFjZVVSSSkge1xyXG5cdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHZhbHVlKSlcclxuXHR7XHJcblx0XHRyZXR1cm4gSnNvbml4LlhNTC5RTmFtZS5mcm9tU3RyaW5nKHZhbHVlLCBuYW1lc3BhY2VDb250ZXh0LCBkZWZhdWx0TmFtZXNwYWNlVVJJKTtcclxuXHR9XHJcblx0ZWxzZVxyXG5cdHtcclxuXHRcdHJldHVybiBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3QodmFsdWUpO1xyXG5cdH1cclxufTtcclxuSnNvbml4LlhNTC5RTmFtZS5rZXkgPSBmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsUGFydCkge1xyXG5cdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcobG9jYWxQYXJ0KTtcclxuXHRpZiAobmFtZXNwYWNlVVJJKSB7XHJcblx0XHR2YXIgY29sb25Qb3NpdGlvbiA9IGxvY2FsUGFydC5pbmRleE9mKCc6Jyk7XHJcblx0XHR2YXIgbG9jYWxOYW1lO1xyXG5cdFx0aWYgKGNvbG9uUG9zaXRpb24gPiAwICYmIGNvbG9uUG9zaXRpb24gPCBsb2NhbFBhcnQubGVuZ3RoKSB7XHJcblx0XHRcdGxvY2FsTmFtZSA9IGxvY2FsUGFydC5zdWJzdHJpbmcoY29sb25Qb3NpdGlvbiArIDEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0bG9jYWxOYW1lID0gbG9jYWxQYXJ0O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuICd7JyArIG5hbWVzcGFjZVVSSSArICd9JyArIGxvY2FsTmFtZTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cmV0dXJuIGxvY2FsUGFydDtcclxuXHR9XHJcbn07XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIgPSBKc29uaXguQ2xhc3Moe1xyXG5cdHllYXIgOiBOYU4sXHJcblx0bW9udGggOiBOYU4sXHJcblx0ZGF5IDogTmFOLFxyXG5cdGhvdXIgOiBOYU4sXHJcblx0bWludXRlIDogTmFOLFxyXG5cdHNlY29uZCA6IE5hTixcclxuXHRmcmFjdGlvbmFsU2Vjb25kIDogTmFOLFxyXG5cdHRpbWV6b25lIDogTmFOLFxyXG5cdGRhdGUgOiBudWxsLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihkYXRhKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KGRhdGEpO1xyXG5cdFx0Ly8gWWVhclxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGRhdGEueWVhcikpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIoZGF0YS55ZWFyKTtcclxuXHRcdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVllYXIoZGF0YS55ZWFyKTtcclxuXHRcdFx0dGhpcy55ZWFyID0gZGF0YS55ZWFyO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy55ZWFyID0gTmFOO1xyXG5cdFx0fVxyXG5cdFx0Ly8gTW9udGhcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhkYXRhLm1vbnRoKSkge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcihkYXRhLm1vbnRoKTtcclxuXHRcdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZU1vbnRoKGRhdGEubW9udGgpO1xyXG5cdFx0XHR0aGlzLm1vbnRoID0gZGF0YS5tb250aDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMubW9udGggPSBOYU47XHJcblx0XHR9XHJcblx0XHQvLyBEYXlcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhkYXRhLmRheSkpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIoZGF0YS5kYXkpO1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKGRhdGEueWVhcikgJiYgSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKGRhdGEubW9udGgpKSB7XHJcblx0XHRcdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVllYXJNb250aERheShkYXRhLnllYXIsIGRhdGEubW9udGgsIGRhdGEuZGF5KTtcclxuXHRcdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIoZGF0YS5tb250aCkpIHtcclxuXHRcdFx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlTW9udGhEYXkoZGF0YS5tb250aCwgZGF0YS5kYXkpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVEYXkoZGF0YS5kYXkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZGF5ID0gZGF0YS5kYXk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmRheSA9IE5hTjtcclxuXHRcdH1cclxuXHRcdC8vIEhvdXJcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhkYXRhLmhvdXIpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKGRhdGEuaG91cik7XHJcblx0XHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVIb3VyKGRhdGEuaG91cik7XHJcblx0XHRcdHRoaXMuaG91ciA9IGRhdGEuaG91cjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuaG91ciA9IE5hTjtcclxuXHRcdH1cclxuXHRcdC8vIE1pbnV0ZVxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGRhdGEubWludXRlKSkge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcihkYXRhLm1pbnV0ZSk7XHJcblx0XHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVNaW51dGUoZGF0YS5taW51dGUpO1xyXG5cdFx0XHR0aGlzLm1pbnV0ZSA9IGRhdGEubWludXRlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5taW51dGUgPSBOYU47XHJcblx0XHR9XHJcblx0XHQvLyBTZWNvbmRcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhkYXRhLnNlY29uZCkpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIoZGF0YS5zZWNvbmQpO1xyXG5cdFx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlU2Vjb25kKGRhdGEuc2Vjb25kKTtcclxuXHRcdFx0dGhpcy5zZWNvbmQgPSBkYXRhLnNlY29uZDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuc2Vjb25kID0gTmFOO1xyXG5cdFx0fVxyXG5cdFx0Ly8gRnJhY3Rpb25hbCBzZWNvbmRcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhkYXRhLmZyYWN0aW9uYWxTZWNvbmQpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVOdW1iZXIoZGF0YS5mcmFjdGlvbmFsU2Vjb25kKTtcclxuXHRcdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZUZyYWN0aW9uYWxTZWNvbmQoZGF0YS5mcmFjdGlvbmFsU2Vjb25kKTtcclxuXHRcdFx0dGhpcy5mcmFjdGlvbmFsU2Vjb25kID0gZGF0YS5mcmFjdGlvbmFsU2Vjb25kO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5mcmFjdGlvbmFsU2Vjb25kID0gTmFOO1xyXG5cdFx0fVxyXG5cdFx0Ly8gVGltZXpvbmVcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhkYXRhLnRpbWV6b25lKSkge1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc05hTihkYXRhLnRpbWV6b25lKSkge1xyXG5cdFx0XHRcdHRoaXMudGltZXpvbmUgPSBOYU47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIoZGF0YS50aW1lem9uZSk7XHJcblx0XHRcdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVRpbWV6b25lKGRhdGEudGltZXpvbmUpO1xyXG5cdFx0XHRcdHRoaXMudGltZXpvbmUgPSBkYXRhLnRpbWV6b25lO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnRpbWV6b25lID0gTmFOO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBpbml0aWFsRGF0ZSA9IG5ldyBEYXRlKDApO1xyXG5cdFx0aW5pdGlhbERhdGUuc2V0VVRDRnVsbFllYXIodGhpcy55ZWFyIHx8IDE5NzApO1xyXG5cdFx0aW5pdGlhbERhdGUuc2V0VVRDTW9udGgodGhpcy5tb250aCAtIDEgfHwgMCk7XHJcblx0XHRpbml0aWFsRGF0ZS5zZXRVVENEYXRlKHRoaXMuZGF5IHx8IDEpO1xyXG5cdFx0aW5pdGlhbERhdGUuc2V0VVRDSG91cnModGhpcy5ob3VyIHx8IDApO1xyXG5cdFx0aW5pdGlhbERhdGUuc2V0VVRDTWludXRlcyh0aGlzLm1pbnV0ZSB8fCAwKTtcclxuXHRcdGluaXRpYWxEYXRlLnNldFVUQ1NlY29uZHModGhpcy5zZWNvbmQgfHwgMCk7XHJcblx0XHRpbml0aWFsRGF0ZS5zZXRVVENNaWxsaXNlY29uZHMoKHRoaXMuZnJhY3Rpb25hbFNlY29uZCB8fCAwKSAqIDEwMDApO1xyXG5cdFx0dmFyIHRpbWV6b25lT2Zmc2V0ID0gLTYwMDAwICogKHRoaXMudGltZXpvbmUgfHwgMCk7XHJcblx0XHR0aGlzLmRhdGUgPSBuZXcgRGF0ZShpbml0aWFsRGF0ZS5nZXRUaW1lKCkgKyB0aW1lem9uZU9mZnNldCk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogXCJKc29uaXguWE1MLkNhbGVuZGFyXCJcclxufSk7XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIuTUlOX1RJTUVaT05FID0gLTE0ICogNjA7XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIuTUFYX1RJTUVaT05FID0gMTQgKiA2MDtcclxuSnNvbml4LlhNTC5DYWxlbmRhci5EQVlTX0lOX01PTlRIID0gWyAzMSwgMjksIDMxLCAzMCwgMzEsIDMwLCAzMSwgMzEsIDMwLCAzMSwgMzAsIDMxIF07XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIuZnJvbU9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCkge1xyXG5cdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3Qob2JqZWN0KTtcclxuXHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhvYmplY3QuQ0xBU1NfTkFNRSkgJiYgb2JqZWN0LkNMQVNTX05BTUUgPT09ICdKc29uaXguWE1MLkNhbGVuZGFyJykge1xyXG5cdFx0cmV0dXJuIG9iamVjdDtcclxuXHR9XHJcblx0cmV0dXJuIG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKG9iamVjdCk7XHJcbn07XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVZZWFyID0gZnVuY3Rpb24oeWVhcikge1xyXG5cdGlmICh5ZWFyID09PSAwKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgeWVhciBbJyArIHllYXIgKyAnXS4gWWVhciBtdXN0IG5vdCBiZSBbMF0uJyk7XHJcblx0fVxyXG59O1xyXG5Kc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlTW9udGggPSBmdW5jdGlvbihtb250aCkge1xyXG5cdGlmIChtb250aCA8IDEgfHwgbW9udGggPiAxMikge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1vbnRoIFsnICsgbW9udGggKyAnXS4gTW9udGggbXVzdCBiZSBpbiByYW5nZSBbMSwgMTJdLicpO1xyXG5cdH1cclxufTtcclxuSnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZURheSA9IGZ1bmN0aW9uKGRheSkge1xyXG5cdGlmIChkYXkgPCAxIHx8IGRheSA+IDMxKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZGF5IFsnICsgZGF5ICsgJ10uIERheSBtdXN0IGJlIGluIHJhbmdlIFsxLCAzMV0uJyk7XHJcblx0fVxyXG59O1xyXG5Kc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlTW9udGhEYXkgPSBmdW5jdGlvbihtb250aCwgZGF5KSB7XHJcblx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZU1vbnRoKG1vbnRoKTtcclxuXHR2YXIgbWF4RGF5c0luTW9udGggPSBKc29uaXguWE1MLkNhbGVuZGFyLkRBWVNfSU5fTU9OVEhbbW9udGggLSAxXTtcclxuXHRpZiAoZGF5IDwgMSB8fCBkYXkgPiBKc29uaXguWE1MLkNhbGVuZGFyLkRBWVNfSU5fTU9OVEhbbW9udGggLSAxXSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGRheSBbJyArIGRheSArICddLiBEYXkgbXVzdCBiZSBpbiByYW5nZSBbMSwgJyArIG1heERheXNJbk1vbnRoICsgJ10uJyk7XHJcblx0fVxyXG59O1xyXG5Kc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlWWVhck1vbnRoRGF5ID0gZnVuY3Rpb24oeWVhciwgbW9udGgsIGRheSkge1xyXG5cdC8vICM5MyBUT0RPIHByb3BlciB2YWxpZGF0aW9uIG9mIDI4LzI5IDAyXHJcblx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVllYXIoeWVhcik7XHJcblx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZU1vbnRoRGF5KG1vbnRoLCBkYXkpO1xyXG59O1xyXG5Kc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlSG91ciA9IGZ1bmN0aW9uKGhvdXIpIHtcclxuXHRpZiAoaG91ciA8IDAgfHwgaG91ciA+IDIzKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgaG91ciBbJyArIGhvdXIgKyAnXS4gSG91ciBtdXN0IGJlIGluIHJhbmdlIFswLCAyM10uJyk7XHJcblx0fVxyXG59O1xyXG5Kc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlTWludXRlID0gZnVuY3Rpb24obWludXRlKSB7XHJcblx0aWYgKG1pbnV0ZSA8IDAgfHwgbWludXRlID4gNTkpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBtaW51dGUgWycgKyBtaW51dGUgKyAnXS4gTWludXRlIG11c3QgYmUgaW4gcmFuZ2UgWzAsIDU5XS4nKTtcclxuXHR9XHJcbn07XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVTZWNvbmQgPSBmdW5jdGlvbihzZWNvbmQpIHtcclxuXHRpZiAoc2Vjb25kIDwgMCB8fCBzZWNvbmQgPiA1OSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHNlY29uZCBbJyArIHNlY29uZCArICddLiBTZWNvbmQgbXVzdCBiZSBpbiByYW5nZSBbMCwgNTldLicpO1xyXG5cdH1cclxufTtcclxuSnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZUZyYWN0aW9uYWxTZWNvbmQgPSBmdW5jdGlvbihmcmFjdGlvbmFsU2Vjb25kKSB7XHJcblx0aWYgKGZyYWN0aW9uYWxTZWNvbmQgPCAwIHx8IGZyYWN0aW9uYWxTZWNvbmQgPiA1OSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGZyYWN0aW9uYWwgc2Vjb25kIFsnICsgZnJhY3Rpb25hbFNlY29uZCArICddLiBGcmFjdGlvbmFsIHNlY29uZCBtdXN0IGJlIGluIHJhbmdlIFswLCAxKS4nKTtcclxuXHR9XHJcbn07XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVUaW1lem9uZSA9IGZ1bmN0aW9uKHRpbWV6b25lKSB7XHJcblx0aWYgKHRpbWV6b25lIDwgSnNvbml4LlhNTC5DYWxlbmRhci5NSU5fVElNRVpPTkUgfHwgdGltZXpvbmUgPiBKc29uaXguWE1MLkNhbGVuZGFyLk1BWF9USU1FWk9ORSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRpbWV6b25lIFsnICsgdGltZXpvbmUgKyAnXS4gVGltZXpvbmUgbXVzdCBub3QgYmUgaW4gcmFuZ2UgWycgKyBKc29uaXguWE1MLkNhbGVuZGFyLk1JTl9USU1FWk9ORSArICcsICcgKyBKc29uaXguWE1MLkNhbGVuZGFyLk1BWF9USU1FWk9ORSArICddLicpO1xyXG5cdH1cclxufTtcclxuSnNvbml4LlhNTC5JbnB1dCA9IEpzb25peC5DbGFzcyh7XHJcblx0cm9vdCA6IG51bGwsXHJcblx0bm9kZSA6IG51bGwsXHJcblx0YXR0cmlidXRlcyA6IG51bGwsXHJcblx0ZXZlbnRUeXBlIDogbnVsbCxcclxuXHRwbnMgOiBudWxsLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRXhpc3RzKG5vZGUpO1xyXG5cdFx0dGhpcy5yb290ID0gbm9kZTtcclxuXHRcdHZhciByb290UG5zSXRlbSA9XHJcblx0XHR7XHJcblx0XHRcdCcnIDogJydcclxuXHRcdH07XHJcblx0XHRyb290UG5zSXRlbVtKc29uaXguWE1MLlhNTE5TX1BdID0gSnNvbml4LlhNTC5YTUxOU19OUztcclxuXHRcdHRoaXMucG5zID0gW3Jvb3RQbnNJdGVtXTtcclxuXHR9LFxyXG5cdGhhc05leHQgOiBmdW5jdGlvbigpIHtcclxuXHRcdC8vIE5vIGN1cnJlbnQgbm9kZSwgd2UndmUgbm90IHN0YXJ0ZWQgeWV0XHJcblx0XHRpZiAodGhpcy5ub2RlID09PSBudWxsKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLm5vZGUgPT09IHRoaXMucm9vdCkge1xyXG5cdFx0XHR2YXIgbm9kZVR5cGUgPSB0aGlzLm5vZGUubm9kZVR5cGU7XHJcblx0XHRcdC8vIFJvb3Qgbm9kZSBpcyBkb2N1bWVudCwgbGFzdCBldmVudCB0eXBlIGlzIEVORF9ET0NVTUVOVFxyXG5cdFx0XHRpZiAobm9kZVR5cGUgPT09IDkgJiYgdGhpcy5ldmVudFR5cGUgPT09IDgpIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gUm9vdCBub2RlIGlzIGVsZW1lbnQsIGxhc3QgZXZlbnQgdHlwZSBpcyBFTkRfRUxFTUVOVFxyXG5cdFx0XHRlbHNlIGlmIChub2RlVHlwZSA9PT0gMSAmJiB0aGlzLmV2ZW50VHlwZSA9PT0gMikge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0fSxcclxuXHRuZXh0IDogZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodGhpcy5ldmVudFR5cGUgPT09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZW50ZXIodGhpcy5yb290KTtcclxuXHRcdH1cclxuXHRcdC8vIFNUQVJUX0RPQ1VNRU5UXHJcblx0XHRpZiAodGhpcy5ldmVudFR5cGUgPT09IDcpIHtcclxuXHRcdFx0dmFyIGRvY3VtZW50RWxlbWVudCA9IHRoaXMubm9kZS5kb2N1bWVudEVsZW1lbnQ7XHJcblx0XHRcdGlmIChkb2N1bWVudEVsZW1lbnQpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5lbnRlcihkb2N1bWVudEVsZW1lbnQpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmxlYXZlKHRoaXMubm9kZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5ldmVudFR5cGUgPT09IDEpIHtcclxuXHRcdFx0dmFyIGZpcnN0Q2hpbGQgPSB0aGlzLm5vZGUuZmlyc3RDaGlsZDtcclxuXHRcdFx0aWYgKGZpcnN0Q2hpbGQpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5lbnRlcihmaXJzdENoaWxkKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5sZWF2ZSh0aGlzLm5vZGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuZXZlbnRUeXBlID09PSAyKSB7XHJcblx0XHRcdHZhciBuZXh0U2libGluZyA9IHRoaXMubm9kZS5uZXh0U2libGluZztcclxuXHRcdFx0aWYgKG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZW50ZXIobmV4dFNpYmxpbmcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmxlYXZlKHRoaXMubm9kZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmxlYXZlKHRoaXMubm9kZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRlbnRlciA6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdHZhciBub2RlVHlwZSA9IG5vZGUubm9kZVR5cGU7XHJcblx0XHR0aGlzLm5vZGUgPSBub2RlO1xyXG5cdFx0dGhpcy5hdHRyaWJ1dGVzID0gbnVsbDtcclxuXHRcdC8vIERvY3VtZW50IG5vZGVcclxuXHRcdGlmIChub2RlVHlwZSA9PT0gMSkge1xyXG5cdFx0XHQvLyBTVEFSVF9FTEVNRU5UXHJcblx0XHRcdHRoaXMuZXZlbnRUeXBlID0gMTtcclxuXHRcdFx0dGhpcy5wdXNoTlMobm9kZSk7XHJcblx0XHRcdHJldHVybiB0aGlzLmV2ZW50VHlwZTtcclxuXHRcdH0gZWxzZSBpZiAobm9kZVR5cGUgPT09IDIpIHtcclxuXHRcdFx0Ly8gQVRUUklCVVRFXHJcblx0XHRcdHRoaXMuZXZlbnRUeXBlID0gMTA7XHJcblx0XHRcdHJldHVybiB0aGlzLmV2ZW50VHlwZTtcclxuXHRcdH0gZWxzZSBpZiAobm9kZVR5cGUgPT09IDMpIHtcclxuXHRcdFx0dmFyIG5vZGVWYWx1ZSA9IG5vZGUubm9kZVZhbHVlO1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuU3RyaW5nVXRpbHMuaXNFbXB0eShub2RlVmFsdWUpKSB7XHJcblx0XHRcdFx0Ly8gU1BBQ0VcclxuXHRcdFx0XHR0aGlzLmV2ZW50VHlwZSA9IDY7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Ly8gQ0hBUkFDVEVSU1xyXG5cdFx0XHRcdHRoaXMuZXZlbnRUeXBlID0gNDtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpcy5ldmVudFR5cGU7XHJcblx0XHR9IGVsc2UgaWYgKG5vZGVUeXBlID09PSA0KSB7XHJcblx0XHRcdC8vIENEQVRBXHJcblx0XHRcdHRoaXMuZXZlbnRUeXBlID0gMTI7XHJcblx0XHRcdHJldHVybiB0aGlzLmV2ZW50VHlwZTtcclxuXHRcdH0gZWxzZSBpZiAobm9kZVR5cGUgPT09IDUpIHtcclxuXHRcdFx0Ly8gRU5USVRZX1JFRkVSRU5DRV9OT0RFID0gNVxyXG5cdFx0XHQvLyBFTlRJVFlfUkVGRVJFTkNFXHJcblx0XHRcdHRoaXMuZXZlbnRUeXBlID0gOTtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZXZlbnRUeXBlO1xyXG5cdFx0fSBlbHNlIGlmIChub2RlVHlwZSA9PT0gNikge1xyXG5cdFx0XHQvLyBFTlRJVFlfREVDTEFSQVRJT05cclxuXHRcdFx0dGhpcy5ldmVudFR5cGUgPSAxNTtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZXZlbnRUeXBlO1xyXG5cdFx0fSBlbHNlIGlmIChub2RlVHlwZSA9PT0gNykge1xyXG5cdFx0XHQvLyBQUk9DRVNTSU5HX0lOU1RSVUNUSU9OXHJcblx0XHRcdHRoaXMuZXZlbnRUeXBlID0gMztcclxuXHRcdFx0cmV0dXJuIHRoaXMuZXZlbnRUeXBlO1xyXG5cdFx0fSBlbHNlIGlmIChub2RlVHlwZSA9PT0gOCkge1xyXG5cdFx0XHQvLyBDT01NRU5UXHJcblx0XHRcdHRoaXMuZXZlbnRUeXBlID0gNTtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZXZlbnRUeXBlO1xyXG5cdFx0fSBlbHNlIGlmIChub2RlVHlwZSA9PT0gOSkge1xyXG5cdFx0XHQvLyBTVEFSVF9ET0NVTUVOVFxyXG5cdFx0XHR0aGlzLmV2ZW50VHlwZSA9IDc7XHJcblx0XHRcdHJldHVybiB0aGlzLmV2ZW50VHlwZTtcclxuXHRcdH0gZWxzZSBpZiAobm9kZVR5cGUgPT09IDEwKSB7XHJcblx0XHRcdC8vIERURFxyXG5cdFx0XHR0aGlzLmV2ZW50VHlwZSA9IDEyO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5ldmVudFR5cGU7XHJcblx0XHR9IGVsc2UgaWYgKG5vZGVUeXBlID09PSAxMikge1xyXG5cdFx0XHQvLyBOT1RBVElPTl9ERUNMQVJBVElPTlxyXG5cdFx0XHR0aGlzLmV2ZW50VHlwZSA9IDE0O1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5ldmVudFR5cGU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBET0NVTUVOVF9GUkFHTUVOVF9OT0RFID0gMTFcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiTm9kZSB0eXBlIFtcIiArIG5vZGVUeXBlICsgJ10gaXMgbm90IHN1cHBvcnRlZC4nKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGxlYXZlIDogZnVuY3Rpb24obm9kZSkge1xyXG5cdFx0aWYgKG5vZGUubm9kZVR5cGUgPT09IDkpIHtcclxuXHRcdFx0aWYgKHRoaXMuZXZlbnRUeXBlID09IDgpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHN0YXRlLlwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm5vZGUgPSBub2RlO1xyXG5cdFx0XHRcdHRoaXMuYXR0cmlidXRlcyA9IG51bGw7XHJcblx0XHRcdFx0Ly8gRU5EX0VMRU1FTlRcclxuXHRcdFx0XHR0aGlzLmV2ZW50VHlwZSA9IDg7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZXZlbnRUeXBlO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKG5vZGUubm9kZVR5cGUgPT09IDEpIHtcclxuXHRcdFx0aWYgKHRoaXMuZXZlbnRUeXBlID09IDIpIHtcclxuXHRcdFx0XHR2YXIgbmV4dFNpYmxpbmcgPSBub2RlLm5leHRTaWJsaW5nO1xyXG5cdFx0XHRcdGlmIChuZXh0U2libGluZykge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMuZW50ZXIobmV4dFNpYmxpbmcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLm5vZGUgPSBub2RlO1xyXG5cdFx0XHRcdHRoaXMuYXR0cmlidXRlcyA9IG51bGw7XHJcblx0XHRcdFx0Ly8gRU5EX0VMRU1FTlRcclxuXHRcdFx0XHR0aGlzLmV2ZW50VHlwZSA9IDI7XHJcblx0XHRcdFx0dGhpcy5wb3BOUygpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmV2ZW50VHlwZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBuZXh0U2libGluZzEgPSBub2RlLm5leHRTaWJsaW5nO1xyXG5cdFx0aWYgKG5leHRTaWJsaW5nMSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5lbnRlcihuZXh0U2libGluZzEpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHBhcmVudE5vZGUgPSBub2RlLnBhcmVudE5vZGU7XHJcblx0XHRcdHRoaXMubm9kZSA9IHBhcmVudE5vZGU7XHJcblx0XHRcdHRoaXMuYXR0cmlidXRlcyA9IG51bGw7XHJcblx0XHRcdGlmIChwYXJlbnROb2RlLm5vZGVUeXBlID09PSA5KSB7XHJcblx0XHRcdFx0dGhpcy5ldmVudFR5cGUgPSA4O1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMuZXZlbnRUeXBlID0gMjtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gdGhpcy5ldmVudFR5cGU7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXROYW1lIDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgbm9kZSA9IHRoaXMubm9kZTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKG5vZGUubm9kZU5hbWUpKSB7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKG5vZGUubmFtZXNwYWNlVVJJKSkge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgSnNvbml4LlhNTC5RTmFtZShub2RlLm5hbWVzcGFjZVVSSSwgbm9kZS5ub2RlTmFtZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBKc29uaXguWE1MLlFOYW1lKG5vZGUubm9kZU5hbWUpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldE5hbWVLZXkgOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBub2RlID0gdGhpcy5ub2RlO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcobm9kZS5ub2RlTmFtZSkpIHtcclxuXHRcdFx0cmV0dXJuIEpzb25peC5YTUwuUU5hbWUua2V5KG5vZGUubmFtZXNwYWNlVVJJLCBub2RlLm5vZGVOYW1lKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0VGV4dCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMubm9kZS5ub2RlVmFsdWU7XHJcblx0fSxcclxuXHRuZXh0VGFnIDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZXQgPSB0aGlzLm5leHQoKTtcclxuXHRcdC8vIFRPRE8gaXNXaGl0ZVNwYWNlXHJcblx0XHR3aGlsZSAoZXQgPT09IDcgfHwgZXQgPT09IDQgfHwgZXQgPT09IDEyIHx8IGV0ID09PSA2IHx8IGV0ID09PSAzIHx8IGV0ID09PSA1KSB7XHJcblx0XHRcdGV0ID0gdGhpcy5uZXh0KCk7XHJcblx0XHR9XHJcblx0XHRpZiAoZXQgIT09IDEgJiYgZXQgIT09IDIpIHtcclxuXHRcdFx0Ly8gVE9ETyBsb2NhdGlvblxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0V4cGVjdGVkIHN0YXJ0IG9yIGVuZCB0YWcuJyk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZXQ7XHJcblx0fSxcclxuXHRza2lwRWxlbWVudCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHRoaXMuZXZlbnRUeXBlICE9PSBKc29uaXguWE1MLklucHV0LlNUQVJUX0VMRU1FTlQpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUGFyc2VyIG11c3QgYmUgb24gU1RBUlRfRUxFTUVOVCB0byBza2lwIGVsZW1lbnQuXCIpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG51bWJlck9mT3BlblRhZ3MgPSAxO1xyXG5cdFx0dmFyIGV0O1xyXG5cdFx0ZG8ge1xyXG5cdFx0XHRldCA9IHRoaXMubmV4dFRhZygpO1xyXG5cdFx0ICAgIG51bWJlck9mT3BlblRhZ3MgKz0gKGV0ID09PSBKc29uaXguWE1MLklucHV0LlNUQVJUX0VMRU1FTlQpID8gMSA6IC0xO1xyXG5cdFx0ICB9IHdoaWxlIChudW1iZXJPZk9wZW5UYWdzID4gMCk7XHJcblx0XHRyZXR1cm4gZXQ7XHJcblx0fSxcdFxyXG5cdGdldEVsZW1lbnRUZXh0IDogZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodGhpcy5ldmVudFR5cGUgIT0gMSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJQYXJzZXIgbXVzdCBiZSBvbiBTVEFSVF9FTEVNRU5UIHRvIHJlYWQgbmV4dCB0ZXh0LlwiKTtcclxuXHRcdH1cclxuXHRcdHZhciBldCA9IHRoaXMubmV4dCgpO1xyXG5cdFx0dmFyIGNvbnRlbnQgPSAnJztcclxuXHRcdHdoaWxlIChldCAhPT0gMikge1xyXG5cdFx0XHRpZiAoZXQgPT09IDQgfHwgZXQgPT09IDEyIHx8IGV0ID09PSA2IHx8IGV0ID09PSA5KSB7XHJcblx0XHRcdFx0Y29udGVudCA9IGNvbnRlbnQgKyB0aGlzLmdldFRleHQoKTtcclxuXHRcdFx0fSBlbHNlIGlmIChldCA9PT0gMyB8fCBldCA9PT0gNSkge1xyXG5cdFx0XHRcdC8vIFNraXAgUEkgb3IgY29tbWVudFxyXG5cdFx0XHR9IGVsc2UgaWYgKGV0ID09PSA4KSB7XHJcblx0XHRcdFx0Ly8gRW5kIGRvY3VtZW50XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBlbmQgb2YgZG9jdW1lbnQgd2hlbiByZWFkaW5nIGVsZW1lbnQgdGV4dCBjb250ZW50LlwiKTtcclxuXHRcdFx0fSBlbHNlIGlmIChldCA9PT0gMSkge1xyXG5cdFx0XHRcdC8vIEVuZCBlbGVtZW50XHJcblx0XHRcdFx0Ly8gVE9ETyBsb2NhdGlvblxyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgdGV4dCBjb250ZW50IG1heSBub3QgY29udGFpbiBTVEFSVF9FTEVNRU5ULlwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBUT0RPIGxvY2F0aW9uXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5leHBlY3RlZCBldmVudCB0eXBlIFtcIiArIGV0ICsgXCJdLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRldCA9IHRoaXMubmV4dCgpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNvbnRlbnQ7XHJcblx0fSxcclxuXHRyZXRyaWV2ZUVsZW1lbnQgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgZWxlbWVudDtcclxuXHRcdGlmICh0aGlzLmV2ZW50VHlwZSA9PT0gMSkge1xyXG5cdFx0XHRlbGVtZW50ID0gdGhpcy5ub2RlO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmV2ZW50VHlwZSA9PT0gMTApIHtcclxuXHRcdFx0ZWxlbWVudCA9IHRoaXMubm9kZS5wYXJlbnROb2RlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBjYW4gb25seSBiZSByZXRyaWV2ZWQgZm9yIFNUQVJUX0VMRU1FTlQgb3IgQVRUUklCVVRFIG5vZGVzLlwiKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBlbGVtZW50O1xyXG5cdH0sXHJcblx0cmV0cmlldmVBdHRyaWJ1dGVzIDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyIGF0dHJpYnV0ZXM7XHJcblx0XHRpZiAodGhpcy5hdHRyaWJ1dGVzKVxyXG5cdFx0e1xyXG5cdFx0XHRhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmV2ZW50VHlwZSA9PT0gMSkge1xyXG5cdFx0XHRhdHRyaWJ1dGVzID0gdGhpcy5ub2RlLmF0dHJpYnV0ZXM7XHJcblx0XHRcdHRoaXMuYXR0cmlidXRlcyA9IGF0dHJpYnV0ZXM7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuZXZlbnRUeXBlID09PSAxMCkge1xyXG5cdFx0XHRhdHRyaWJ1dGVzID0gdGhpcy5ub2RlLnBhcmVudE5vZGUuYXR0cmlidXRlcztcclxuXHRcdFx0dGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkF0dHJpYnV0ZXMgY2FuIG9ubHkgYmUgcmV0cmlldmVkIGZvciBTVEFSVF9FTEVNRU5UIG9yIEFUVFJJQlVURSBub2Rlcy5cIik7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYXR0cmlidXRlcztcclxuXHR9LFxyXG5cdGdldEF0dHJpYnV0ZUNvdW50IDogZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgYXR0cmlidXRlcyA9IHRoaXMucmV0cmlldmVBdHRyaWJ1dGVzKCk7XHJcblx0XHRyZXR1cm4gYXR0cmlidXRlcy5sZW5ndGg7XHJcblx0fSxcclxuXHRnZXRBdHRyaWJ1dGVOYW1lIDogZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5yZXRyaWV2ZUF0dHJpYnV0ZXMoKTtcclxuXHRcdGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gYXR0cmlidXRlcy5sZW5ndGgpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBhdHRyaWJ1dGUgaW5kZXggW1wiICsgaW5kZXggKyBcIl0uXCIpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbaW5kZXhdO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcoYXR0cmlidXRlLm5hbWVzcGFjZVVSSSkpIHtcclxuXHRcdFx0cmV0dXJuIG5ldyBKc29uaXguWE1MLlFOYW1lKGF0dHJpYnV0ZS5uYW1lc3BhY2VVUkksIGF0dHJpYnV0ZS5ub2RlTmFtZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEpzb25peC5YTUwuUU5hbWUoYXR0cmlidXRlLm5vZGVOYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldEF0dHJpYnV0ZU5hbWVLZXkgOiBmdW5jdGlvbihpbmRleCkge1xyXG5cdFx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnJldHJpZXZlQXR0cmlidXRlcygpO1xyXG5cdFx0aWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBhdHRyaWJ1dGVzLmxlbmd0aCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGF0dHJpYnV0ZSBpbmRleCBbXCIgKyBpbmRleCArIFwiXS5cIik7XHJcblx0XHR9XHJcblx0XHR2YXIgYXR0cmlidXRlID0gYXR0cmlidXRlc1tpbmRleF07XHJcblxyXG5cdFx0cmV0dXJuIEpzb25peC5YTUwuUU5hbWUua2V5KGF0dHJpYnV0ZS5uYW1lc3BhY2VVUkksIGF0dHJpYnV0ZS5ub2RlTmFtZSk7XHJcblx0fSxcclxuXHRnZXRBdHRyaWJ1dGVWYWx1ZSA6IGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHR2YXIgYXR0cmlidXRlcyA9IHRoaXMucmV0cmlldmVBdHRyaWJ1dGVzKCk7XHJcblx0XHRpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IGF0dHJpYnV0ZXMubGVuZ3RoKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYXR0cmlidXRlIGluZGV4IFtcIiArIGluZGV4ICsgXCJdLlwiKTtcclxuXHRcdH1cclxuXHRcdHZhciBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2luZGV4XTtcclxuXHRcdHJldHVybiBhdHRyaWJ1dGUudmFsdWU7XHJcblx0fSxcclxuXHRnZXRBdHRyaWJ1dGVWYWx1ZU5TIDogbnVsbCxcclxuXHRnZXRBdHRyaWJ1dGVWYWx1ZU5TVmlhRWxlbWVudCA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxQYXJ0KSB7XHJcblx0XHR2YXIgZWxlbWVudCA9IHRoaXMucmV0cmlldmVFbGVtZW50KCk7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGVOUyhuYW1lc3BhY2VVUkksIGxvY2FsUGFydCk7XHJcblx0fSxcclxuXHRnZXRBdHRyaWJ1dGVWYWx1ZU5TVmlhQXR0cmlidXRlIDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbFBhcnQpIHtcclxuXHRcdHZhciBhdHRyaWJ1dGVOb2RlID0gdGhpcy5nZXRBdHRyaWJ1dGVOb2RlTlMobmFtZXNwYWNlVVJJLCBsb2NhbFBhcnQpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGF0dHJpYnV0ZU5vZGUpKSB7XHJcblx0XHRcdHJldHVybiBhdHRyaWJ1dGVOb2RlLm5vZGVWYWx1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRBdHRyaWJ1dGVOb2RlTlMgOiBudWxsLFxyXG5cdGdldEF0dHJpYnV0ZU5vZGVOU1ZpYUVsZW1lbnQgOiBmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsUGFydCkge1xyXG5cdFx0dmFyIGVsZW1lbnQgPSB0aGlzLnJldHJpZXZlRWxlbWVudCgpO1xyXG5cdFx0cmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlTm9kZU5TKG5hbWVzcGFjZVVSSSwgbG9jYWxQYXJ0KTtcclxuXHR9LFxyXG5cdGdldEF0dHJpYnV0ZU5vZGVOU1ZpYUF0dHJpYnV0ZXMgOiBmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsUGFydCkge1xyXG5cdFx0dmFyIGF0dHJpYnV0ZU5vZGUgPSBudWxsO1xyXG5cdFx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnJldHJpZXZlQXR0cmlidXRlcygpO1xyXG5cdFx0dmFyIHBvdGVudGlhbE5vZGUsIGZ1bGxOYW1lO1xyXG5cdFx0Zm9yICh2YXIgaSA9IDAsIGxlbiA9IGF0dHJpYnV0ZXMubGVuZ3RoOyBpIDwgbGVuOyArK2kpIHtcclxuXHRcdFx0cG90ZW50aWFsTm9kZSA9IGF0dHJpYnV0ZXNbaV07XHJcblx0XHRcdGlmIChwb3RlbnRpYWxOb2RlLm5hbWVzcGFjZVVSSSA9PT0gbmFtZXNwYWNlVVJJKSB7XHJcblx0XHRcdFx0ZnVsbE5hbWUgPSAocG90ZW50aWFsTm9kZS5wcmVmaXgpID8gKHBvdGVudGlhbE5vZGUucHJlZml4ICsgJzonICsgbG9jYWxQYXJ0KSA6IGxvY2FsUGFydDtcclxuXHRcdFx0XHRpZiAoZnVsbE5hbWUgPT09IHBvdGVudGlhbE5vZGUubm9kZU5hbWUpIHtcclxuXHRcdFx0XHRcdGF0dHJpYnV0ZU5vZGUgPSBwb3RlbnRpYWxOb2RlO1xyXG5cdFx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYXR0cmlidXRlTm9kZTtcclxuXHR9LFxyXG5cdGdldEVsZW1lbnQgOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0aGlzLmV2ZW50VHlwZSA9PT0gMSB8fCB0aGlzLmV2ZW50VHlwZSA9PT0gMikge1xyXG5cdFx0XHQvLyBHbyB0byB0aGUgRU5EX0VMRU1FTlRcclxuXHRcdFx0dGhpcy5ldmVudFR5cGUgPSAyO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5ub2RlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUGFyc2VyIG11c3QgYmUgb24gU1RBUlRfRUxFTUVOVCBvciBFTkRfRUxFTUVOVCB0byByZXR1cm4gY3VycmVudCBlbGVtZW50LlwiKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHB1c2hOUyA6IGZ1bmN0aW9uIChub2RlKSB7XHJcblx0XHR2YXIgcGluZGV4ID0gdGhpcy5wbnMubGVuZ3RoIC0gMTtcclxuXHRcdHZhciBwYXJlbnRQbnNJdGVtID0gdGhpcy5wbnNbcGluZGV4XTtcclxuXHRcdHZhciBwbnNJdGVtID0gSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChwYXJlbnRQbnNJdGVtKSA/IHBpbmRleCA6IHBhcmVudFBuc0l0ZW07XHJcblx0XHR0aGlzLnBucy5wdXNoKHBuc0l0ZW0pO1xyXG5cdFx0cGluZGV4Kys7XHJcblx0XHR2YXIgcmVmZXJlbmNlID0gdHJ1ZTtcclxuXHRcdGlmIChub2RlLmF0dHJpYnV0ZXMpXHJcblx0XHR7XHJcblx0XHRcdHZhciBhdHRyaWJ1dGVzID0gbm9kZS5hdHRyaWJ1dGVzO1xyXG5cdFx0XHR2YXIgYWxlbmd0aCA9IGF0dHJpYnV0ZXMubGVuZ3RoO1xyXG5cdFx0XHRpZiAoYWxlbmd0aCA+IDApXHJcblx0XHRcdHtcclxuXHRcdFx0XHQvLyBJZiBnaXZlbiBub2RlIGhhcyBhdHRyaWJ1dGVzXHJcblx0XHRcdFx0Zm9yICh2YXIgYWluZGV4ID0gMDsgYWluZGV4IDwgYWxlbmd0aDsgYWluZGV4KyspXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbYWluZGV4XTtcclxuXHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVOYW1lID0gYXR0cmlidXRlLm5vZGVOYW1lO1xyXG5cdFx0XHRcdFx0dmFyIHAgPSBudWxsO1xyXG5cdFx0XHRcdFx0dmFyIG5zID0gbnVsbDtcclxuXHRcdFx0XHRcdHZhciBpc05TID0gZmFsc2U7XHJcblx0XHRcdFx0XHRpZiAoYXR0cmlidXRlTmFtZSA9PT0gJ3htbG5zJylcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cCA9ICcnO1xyXG5cdFx0XHRcdFx0XHRucyA9IGF0dHJpYnV0ZS52YWx1ZTtcclxuXHRcdFx0XHRcdFx0aXNOUyA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChhdHRyaWJ1dGVOYW1lLnN1YnN0cmluZygwLCA2KSA9PT0gJ3htbG5zOicpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHAgPSBhdHRyaWJ1dGVOYW1lLnN1YnN0cmluZyg2KTtcclxuXHRcdFx0XHRcdFx0bnMgPSBhdHRyaWJ1dGUudmFsdWU7XHJcblx0XHRcdFx0XHRcdGlzTlMgPSB0cnVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly8gQXR0cmlidXRlIGlzIGEgbmFtZXNwYWNlIGRlY2xhcmF0aW9uXHJcblx0XHRcdFx0XHRpZiAoaXNOUylcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0aWYgKHJlZmVyZW5jZSlcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHBuc0l0ZW0gPSBKc29uaXguVXRpbC5UeXBlLmNsb25lT2JqZWN0KHRoaXMucG5zW3Buc0l0ZW1dLCB7fSk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5wbnNbcGluZGV4XSA9IHBuc0l0ZW07XHJcblx0XHRcdFx0XHRcdFx0cmVmZXJlbmNlID0gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0cG5zSXRlbVtwXSA9IG5zO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVx0XHRcclxuXHR9LFxyXG5cdHBvcE5TIDogZnVuY3Rpb24gKCkge1xyXG5cdFx0dGhpcy5wbnMucG9wKCk7XHJcblx0fSxcclxuXHRnZXROYW1lc3BhY2VVUkkgOiBmdW5jdGlvbiAocCkge1xyXG5cdFx0dmFyIHBpbmRleCA9IHRoaXMucG5zLmxlbmd0aCAtIDE7XHJcblx0XHR2YXIgcG5zSXRlbSA9IHRoaXMucG5zW3BpbmRleF07XHJcblx0XHRwbnNJdGVtID0gSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChwbnNJdGVtKSA/IHBuc0l0ZW0gOiB0aGlzLnBuc1twbnNJdGVtXTtcclxuXHRcdHJldHVybiBwbnNJdGVtW3BdO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6IFwiSnNvbml4LlhNTC5JbnB1dFwiXHJcblxyXG59KTtcclxuXHJcbkpzb25peC5YTUwuSW5wdXQucHJvdG90eXBlLmdldEF0dHJpYnV0ZVZhbHVlTlMgPSAoSnNvbml4LkRPTS5pc0RvbUltcGxlbWVudGF0aW9uQXZhaWxhYmxlKCkpID8gSnNvbml4LlhNTC5JbnB1dC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlVmFsdWVOU1ZpYUVsZW1lbnQgOiBKc29uaXguWE1MLklucHV0LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVWYWx1ZU5TVmlhQXR0cmlidXRlO1xyXG5Kc29uaXguWE1MLklucHV0LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVOb2RlTlMgPSAoSnNvbml4LkRPTS5pc0RvbUltcGxlbWVudGF0aW9uQXZhaWxhYmxlKCkpID8gSnNvbml4LlhNTC5JbnB1dC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlTm9kZU5TVmlhRWxlbWVudCA6IEpzb25peC5YTUwuSW5wdXQucHJvdG90eXBlLmdldEF0dHJpYnV0ZU5vZGVOU1ZpYUF0dHJpYnV0ZXM7XHJcblxyXG5Kc29uaXguWE1MLklucHV0LlNUQVJUX0VMRU1FTlQgPSAxO1xyXG5Kc29uaXguWE1MLklucHV0LkVORF9FTEVNRU5UID0gMjtcclxuSnNvbml4LlhNTC5JbnB1dC5QUk9DRVNTSU5HX0lOU1RSVUNUSU9OID0gMztcclxuSnNvbml4LlhNTC5JbnB1dC5DSEFSQUNURVJTID0gNDtcclxuSnNvbml4LlhNTC5JbnB1dC5DT01NRU5UID0gNTtcclxuSnNvbml4LlhNTC5JbnB1dC5TUEFDRSA9IDY7XHJcbkpzb25peC5YTUwuSW5wdXQuU1RBUlRfRE9DVU1FTlQgPSA3O1xyXG5Kc29uaXguWE1MLklucHV0LkVORF9ET0NVTUVOVCA9IDg7XHJcbkpzb25peC5YTUwuSW5wdXQuRU5USVRZX1JFRkVSRU5DRSA9IDk7XHJcbkpzb25peC5YTUwuSW5wdXQuQVRUUklCVVRFID0gMTA7XHJcbkpzb25peC5YTUwuSW5wdXQuRFREID0gMTE7XHJcbkpzb25peC5YTUwuSW5wdXQuQ0RBVEEgPSAxMjtcclxuSnNvbml4LlhNTC5JbnB1dC5OQU1FU1BBQ0UgPSAxMztcclxuSnNvbml4LlhNTC5JbnB1dC5OT1RBVElPTl9ERUNMQVJBVElPTiA9IDE0O1xyXG5Kc29uaXguWE1MLklucHV0LkVOVElUWV9ERUNMQVJBVElPTiA9IDE1O1xyXG5cclxuSnNvbml4LlhNTC5PdXRwdXQgPSBKc29uaXguQ2xhc3Moe1xyXG5cdGRvY3VtZW50IDogbnVsbCxcclxuXHRkb2N1bWVudEVsZW1lbnQgOiBudWxsLFxyXG5cdG5vZGUgOiBudWxsLFxyXG5cdG5vZGVzIDogbnVsbCxcclxuXHRuc3AgOiBudWxsLFxyXG5cdHBucyA6IG51bGwsXHJcblx0bmFtZXNwYWNlUHJlZml4SW5kZXggOiAwLFxyXG5cdHhtbGRvbSA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG9wdGlvbnMpIHtcclxuXHRcdC8vIFJFV09SS1xyXG5cdFx0aWYgKHR5cGVvZiBBY3RpdmVYT2JqZWN0ICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHR0aGlzLnhtbGRvbSA9IG5ldyBBY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTERPTVwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMueG1sZG9tID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdHRoaXMubm9kZXMgPSBbXTtcclxuXHRcdHZhciByb290TnNwSXRlbSA9XHJcblx0XHR7XHJcblx0XHRcdCcnIDogJydcclxuXHRcdH07XHJcblx0XHRyb290TnNwSXRlbVtKc29uaXguWE1MLlhNTE5TX05TXSA9IEpzb25peC5YTUwuWE1MTlNfUDtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KG9wdGlvbnMpKSB7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KG9wdGlvbnMubmFtZXNwYWNlUHJlZml4ZXMpKSB7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuVHlwZS5jbG9uZU9iamVjdChvcHRpb25zLm5hbWVzcGFjZVByZWZpeGVzLCByb290TnNwSXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRoaXMubnNwID0gW3Jvb3ROc3BJdGVtXTtcclxuXHRcdHZhciByb290UG5zSXRlbSA9XHJcblx0XHR7XHJcblx0XHRcdCcnIDogJydcclxuXHRcdH07XHJcblx0XHRyb290UG5zSXRlbVtKc29uaXguWE1MLlhNTE5TX1BdID0gSnNvbml4LlhNTC5YTUxOU19OUztcclxuXHRcdHRoaXMucG5zID0gW3Jvb3RQbnNJdGVtXTtcclxuXHR9LFxyXG5cdGRlc3Ryb3kgOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMueG1sZG9tID0gbnVsbDtcclxuXHR9LFxyXG5cdHdyaXRlU3RhcnREb2N1bWVudCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gVE9ETyBDaGVja1xyXG5cdFx0dmFyIGRvYyA9IEpzb25peC5ET00uY3JlYXRlRG9jdW1lbnQoKTtcclxuXHRcdHRoaXMuZG9jdW1lbnQgPSBkb2M7XHJcblx0XHRyZXR1cm4gdGhpcy5wdXNoKGRvYyk7XHJcblx0fSxcclxuXHR3cml0ZUVuZERvY3VtZW50IDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wb3AoKTtcclxuXHJcblx0fSxcclxuXHR3cml0ZVN0YXJ0RWxlbWVudCA6IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobmFtZSk7XHJcblx0XHR2YXIgbG9jYWxQYXJ0ID0gbmFtZS5sb2NhbFBhcnQgfHwgbmFtZS5scCB8fCBudWxsO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhsb2NhbFBhcnQpO1xyXG5cdFx0dmFyIG5zID0gbmFtZS5uYW1lc3BhY2VVUkkgfHwgbmFtZS5ucyB8fCBudWxsO1xyXG5cdFx0dmFyIG5hbWVzcGFjZVVSSSA9IEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcobnMpID8gbnMgOiAnJztcclxuXHJcblx0XHR2YXIgcCA9IG5hbWUucHJlZml4IHx8IG5hbWUucDtcclxuXHRcdHZhciBwcmVmaXggPSB0aGlzLmdldFByZWZpeChuYW1lc3BhY2VVUkksIHApO1xyXG5cclxuXHRcdHZhciBxdWFsaWZpZWROYW1lID0gKCFwcmVmaXggPyBsb2NhbFBhcnQgOiBwcmVmaXggKyAnOicgKyBsb2NhbFBhcnQpO1xyXG5cclxuXHRcdHZhciBlbGVtZW50O1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNGdW5jdGlvbih0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUykpXHR7XHJcblx0XHRcdGVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhuYW1lc3BhY2VVUkksIHF1YWxpZmllZE5hbWUpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy54bWxkb20pIHtcclxuXHRcdFx0ZWxlbWVudCA9IHRoaXMueG1sZG9tLmNyZWF0ZU5vZGUoMSwgcXVhbGlmaWVkTmFtZSwgbmFtZXNwYWNlVVJJKTtcclxuXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgY3JlYXRlIGFuIGVsZW1lbnQgbm9kZS5cIik7XHJcblx0XHR9XHJcblx0XHR0aGlzLnBlZWsoKS5hcHBlbmRDaGlsZChlbGVtZW50KTtcclxuXHRcdHRoaXMucHVzaChlbGVtZW50KTtcclxuXHRcdHRoaXMuZGVjbGFyZU5hbWVzcGFjZShuYW1lc3BhY2VVUkksIHByZWZpeCk7XHJcblx0XHRpZiAodGhpcy5kb2N1bWVudEVsZW1lbnQgPT09IG51bGwpXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuZG9jdW1lbnRFbGVtZW50ID0gZWxlbWVudDtcclxuXHRcdFx0dGhpcy5kZWNsYXJlTmFtZXNwYWNlcygpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVsZW1lbnQ7XHJcblx0fSxcclxuXHR3cml0ZUVuZEVsZW1lbnQgOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLnBvcCgpO1xyXG5cdH0sXHJcblx0d3JpdGVDaGFyYWN0ZXJzIDogZnVuY3Rpb24odGV4dCkge1xyXG5cdFx0dmFyIG5vZGU7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc0Z1bmN0aW9uKHRoaXMuZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUpKVx0e1xyXG5cdFx0XHRub2RlID0gdGhpcy5kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMueG1sZG9tKSB7XHJcblx0XHRcdG5vZGUgPSB0aGlzLnhtbGRvbS5jcmVhdGVUZXh0Tm9kZSh0ZXh0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBjcmVhdGUgYSB0ZXh0IG5vZGUuXCIpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5wZWVrKCkuYXBwZW5kQ2hpbGQobm9kZSk7XHJcblx0XHRyZXR1cm4gbm9kZTtcclxuXHJcblx0fSxcclxuXHR3cml0ZUNkYXRhIDogZnVuY3Rpb24odGV4dCkge1xyXG5cdFx0dmFyIHBhcnRzID0gdGV4dC5zcGxpdCgnXV0+Jyk7XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgcGFydHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGlmIChpbmRleCArIDEgPCBwYXJ0cy5sZW5ndGgpIHtcclxuXHRcdFx0XHRwYXJ0c1tpbmRleF0gPSBwYXJ0c1tpbmRleF0gKyAnXV0nO1xyXG5cdFx0XHRcdHBhcnRzW2luZGV4ICsgMV0gPSAnPicgKyBwYXJ0c1tpbmRleCArIDFdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgbm9kZTtcclxuXHRcdGZvciAodmFyIGpuZGV4ID0gMDsgam5kZXggPCBwYXJ0cy5sZW5ndGg7IGpuZGV4ICsrKSB7XHJcblx0XHRcdG5vZGUgPSB0aGlzLndyaXRlQ2RhdGFXaXRob3V0Q2RlbmQocGFydHNbam5kZXhdKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBub2RlO1xyXG5cdH0sXHJcblx0d3JpdGVDZGF0YVdpdGhvdXRDZGVuZCA6IGZ1bmN0aW9uKHRleHQpIHtcclxuXHRcdHZhciBub2RlO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNGdW5jdGlvbih0aGlzLmRvY3VtZW50LmNyZWF0ZUNEQVRBU2VjdGlvbikpXHR7XHJcblx0XHRcdG5vZGUgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUNEQVRBU2VjdGlvbih0ZXh0KTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKHRoaXMueG1sZG9tKSB7XHJcblx0XHRcdG5vZGUgPSB0aGlzLnhtbGRvbS5jcmVhdGVDREFUQVNlY3Rpb24odGV4dCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgY3JlYXRlIGEgQ0RBVEEgc2VjdGlvbiBub2RlLlwiKTtcclxuXHRcdH1cclxuXHRcdHRoaXMucGVlaygpLmFwcGVuZENoaWxkKG5vZGUpO1xyXG5cdFx0cmV0dXJuIG5vZGU7XHJcblx0fSxcclxuXHR3cml0ZUF0dHJpYnV0ZSA6IGZ1bmN0aW9uKG5hbWUsIHZhbHVlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHZhbHVlKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobmFtZSk7XHJcblx0XHR2YXIgbG9jYWxQYXJ0ID0gbmFtZS5sb2NhbFBhcnQgfHwgbmFtZS5scCB8fCBudWxsO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhsb2NhbFBhcnQpO1xyXG5cdFx0dmFyIG5zID0gbmFtZS5uYW1lc3BhY2VVUkkgfHwgbmFtZS5ucyB8fCBudWxsO1xyXG5cdFx0dmFyIG5hbWVzcGFjZVVSSSA9IEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcobnMpID8gbnMgOiAnJztcclxuXHRcdHZhciBwID0gbmFtZS5wcmVmaXggfHwgbmFtZS5wIHx8IG51bGw7XHJcblx0XHR2YXIgcHJlZml4ID0gdGhpcy5nZXRQcmVmaXgobmFtZXNwYWNlVVJJLCBwKTtcclxuXHJcblx0XHR2YXIgcXVhbGlmaWVkTmFtZSA9ICghcHJlZml4ID8gbG9jYWxQYXJ0IDogcHJlZml4ICsgJzonICsgbG9jYWxQYXJ0KTtcclxuXHJcblx0XHR2YXIgbm9kZSA9IHRoaXMucGVlaygpO1xyXG5cclxuXHRcdGlmIChuYW1lc3BhY2VVUkkgPT09ICcnKSB7XHJcblx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKHF1YWxpZmllZE5hbWUsIHZhbHVlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmIChub2RlLnNldEF0dHJpYnV0ZU5TKSB7XHJcblx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGVOUyhuYW1lc3BhY2VVUkksIHF1YWxpZmllZE5hbWUsIHZhbHVlKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAodGhpcy54bWxkb20pIHtcclxuXHRcdFx0XHRcdHZhciBhdHRyaWJ1dGUgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZU5vZGUoMiwgcXVhbGlmaWVkTmFtZSwgbmFtZXNwYWNlVVJJKTtcclxuXHRcdFx0XHRcdGF0dHJpYnV0ZS5ub2RlVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlTm9kZShhdHRyaWJ1dGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChuYW1lc3BhY2VVUkkgPT09IEpzb25peC5YTUwuWE1MTlNfTlMpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Ly8gWE1MTlMgbmFtZXNwYWNlIG1heSBiZSBwcm9jZXNzZWQgdW5xdWFsaWZpZWRcclxuXHRcdFx0XHRcdG5vZGUuc2V0QXR0cmlidXRlKHF1YWxpZmllZE5hbWUsIHZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBbc2V0QXR0cmlidXRlTlNdIG1ldGhvZCBpcyBub3QgaW1wbGVtZW50ZWRcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZGVjbGFyZU5hbWVzcGFjZShuYW1lc3BhY2VVUkksIHByZWZpeCk7XHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblx0d3JpdGVOb2RlIDogZnVuY3Rpb24obm9kZSkge1xyXG5cdFx0dmFyIGltcG9ydGVkTm9kZTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLmRvY3VtZW50LmltcG9ydE5vZGUpKSB7XHJcblx0XHRcdGltcG9ydGVkTm9kZSA9IHRoaXMuZG9jdW1lbnQuaW1wb3J0Tm9kZShub2RlLCB0cnVlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGltcG9ydGVkTm9kZSA9IG5vZGU7XHJcblx0XHR9XHJcblx0XHR0aGlzLnBlZWsoKS5hcHBlbmRDaGlsZChpbXBvcnRlZE5vZGUpO1xyXG5cdFx0cmV0dXJuIGltcG9ydGVkTm9kZTtcclxuXHR9LFxyXG5cdHB1c2ggOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHR0aGlzLm5vZGVzLnB1c2gobm9kZSk7XHJcblx0XHR0aGlzLnB1c2hOUygpO1xyXG5cdFx0cmV0dXJuIG5vZGU7XHJcblx0fSxcclxuXHRwZWVrIDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5ub2Rlc1t0aGlzLm5vZGVzLmxlbmd0aCAtIDFdO1xyXG5cdH0sXHJcblx0cG9wIDogZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLnBvcE5TKCk7XHJcblx0XHR2YXIgcmVzdWx0ID0gdGhpcy5ub2Rlcy5wb3AoKTtcclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRwdXNoTlMgOiBmdW5jdGlvbiAoKVxyXG5cdHtcclxuXHRcdHZhciBuaW5kZXggPSB0aGlzLm5zcC5sZW5ndGggLSAxO1xyXG5cdFx0dmFyIHBpbmRleCA9IHRoaXMucG5zLmxlbmd0aCAtIDE7XHJcblx0XHR2YXIgcGFyZW50TnNwSXRlbSA9IHRoaXMubnNwW25pbmRleF07XHJcblx0XHR2YXIgcGFyZW50UG5zSXRlbSA9IHRoaXMucG5zW3BpbmRleF07XHJcblx0XHR2YXIgbnNwSXRlbSA9IEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QocGFyZW50TnNwSXRlbSkgPyBuaW5kZXggOiBwYXJlbnROc3BJdGVtO1xyXG5cdFx0dmFyIHBuc0l0ZW0gPSBKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHBhcmVudFBuc0l0ZW0pID8gcGluZGV4IDogcGFyZW50UG5zSXRlbTtcclxuXHRcdHRoaXMubnNwLnB1c2gobnNwSXRlbSk7XHJcblx0XHR0aGlzLnBucy5wdXNoKHBuc0l0ZW0pO1xyXG5cdH0sXHJcblx0cG9wTlMgOiBmdW5jdGlvbiAoKVxyXG5cdHtcclxuXHRcdHRoaXMubnNwLnBvcCgpO1xyXG5cdFx0dGhpcy5wbnMucG9wKCk7XHJcblx0fSxcclxuXHRkZWNsYXJlTmFtZXNwYWNlcyA6IGZ1bmN0aW9uICgpXHJcblx0e1xyXG5cdFx0dmFyIGluZGV4ID0gdGhpcy5uc3AubGVuZ3RoIC0gMTtcclxuXHRcdHZhciBuc3BJdGVtID0gdGhpcy5uc3BbaW5kZXhdO1xyXG5cdFx0bnNwSXRlbSA9IEpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIobnNwSXRlbSkgPyB0aGlzLm5zcFtuc3BJdGVtXSA6IG5zcEl0ZW07XHJcblx0XHR2YXIgbnMsIHA7XHJcblx0XHRmb3IgKG5zIGluIG5zcEl0ZW0pXHJcblx0XHR7XHJcblx0XHRcdGlmIChuc3BJdGVtLmhhc093blByb3BlcnR5KG5zKSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHAgPSBuc3BJdGVtW25zXTtcclxuXHRcdFx0XHR0aGlzLmRlY2xhcmVOYW1lc3BhY2UobnMsIHApO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRkZWNsYXJlTmFtZXNwYWNlIDogZnVuY3Rpb24gKG5zLCBwKVxyXG5cdHtcclxuXHRcdHZhciBpbmRleCA9IHRoaXMucG5zLmxlbmd0aCAtIDE7XHJcblx0XHR2YXIgcG5zSXRlbSA9IHRoaXMucG5zW2luZGV4XTtcclxuXHRcdHZhciByZWZlcmVuY2U7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc051bWJlcihwbnNJdGVtKSlcclxuXHRcdHtcclxuXHRcdFx0Ly8gUmVzb2x2ZSB0aGUgcmVmZXJlbmNlXHJcblx0XHRcdHJlZmVyZW5jZSA9IHRydWU7XHJcblx0XHRcdHBuc0l0ZW0gPSB0aGlzLnBuc1twbnNJdGVtXTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0cmVmZXJlbmNlID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHQvLyBJZiB0aGlzIHByZWZpeCBpcyBtYXBwZWQgdG8gYSBkaWZmZXJlbnQgbmFtZXNwYWNlIGFuZCBtdXN0IGJlIHJlZGVjbGFyZWRcclxuXHRcdGlmIChwbnNJdGVtW3BdICE9PSBucylcclxuXHRcdHtcclxuXHRcdFx0aWYgKHAgPT09ICcnKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGhpcy53cml0ZUF0dHJpYnV0ZSh7bHAgOiBKc29uaXguWE1MLlhNTE5TX1B9LCBucyk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGhpcy53cml0ZUF0dHJpYnV0ZSh7bnMgOiBKc29uaXguWE1MLlhNTE5TX05TLCBscCA6IHAsIHAgOiBKc29uaXguWE1MLlhNTE5TX1B9LCBucyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHJlZmVyZW5jZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vIElmIHRoaXMgd2FzIGEgcmVmZXJlbmNlLCBjbG9uZSBpdCBhbmQgcmVwbGFjZSB0aGUgcmVmZXJlbmNlXHJcblx0XHRcdFx0cG5zSXRlbSA9IEpzb25peC5VdGlsLlR5cGUuY2xvbmVPYmplY3QocG5zSXRlbSwge30pO1xyXG5cdFx0XHRcdHRoaXMucG5zW2luZGV4XSA9IHBuc0l0ZW07XHJcblx0XHRcdH1cclxuXHRcdFx0cG5zSXRlbVtwXSA9IG5zO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0UHJlZml4IDogZnVuY3Rpb24gKG5zLCBwKVxyXG5cdHtcclxuXHRcdHZhciBpbmRleCA9IHRoaXMubnNwLmxlbmd0aCAtIDE7XHJcblx0XHR2YXIgbnNwSXRlbSA9IHRoaXMubnNwW2luZGV4XTtcclxuXHRcdHZhciByZWZlcmVuY2U7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc051bWJlcihuc3BJdGVtKSlcclxuXHRcdHtcclxuXHRcdFx0Ly8gVGhpcyBpcyBhIHJlZmVyZW5jZSwgdGhlIGl0ZW0gaXMgdGhlIGluZGV4IG9mIHRoZSBwYXJlbnQgaXRlbVxyXG5cdFx0XHRyZWZlcmVuY2UgPSB0cnVlO1xyXG5cdFx0XHRuc3BJdGVtID0gdGhpcy5uc3BbbnNwSXRlbV07XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHJlZmVyZW5jZSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcocCkpXHJcblx0XHR7XHJcblx0XHRcdHZhciBvbGRwID0gbnNwSXRlbVtuc107XHJcblx0XHRcdC8vIElmIHByZWZpeCBpcyBhbHJlYWR5IGRlY2xhcmVkIGFuZCBlcXVhbHMgdGhlIHByb3Bvc2VkIHByZWZpeFxyXG5cdFx0XHRpZiAocCA9PT0gb2xkcClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vIE5vdGhpbmcgdG8gZG9cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHQvLyBJZiB0aGlzIHdhcyBhIHJlZmVyZW5jZSwgd2UgaGF2ZSB0byBjbG9uZSBpdCBub3dcclxuXHRcdFx0XHRpZiAocmVmZXJlbmNlKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG5zcEl0ZW0gPSBKc29uaXguVXRpbC5UeXBlLmNsb25lT2JqZWN0KG5zcEl0ZW0sIHt9KTtcclxuXHRcdFx0XHRcdHRoaXMubnNwW2luZGV4XSA9IG5zcEl0ZW07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5zcEl0ZW1bbnNdID0gcDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHRwID0gbnNwSXRlbVtuc107XHJcblx0XHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5leGlzdHMocCkpIHtcclxuXHRcdFx0XHRwID0gJ3AnICsgKHRoaXMubmFtZXNwYWNlUHJlZml4SW5kZXgrKyk7XHJcblx0XHRcdFx0Ly8gSWYgdGhpcyB3YXMgYSByZWZlcmVuY2UsIHdlIGhhdmUgdG8gY2xvbmUgaXQgbm93XHJcblx0XHRcdFx0aWYgKHJlZmVyZW5jZSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRuc3BJdGVtID0gSnNvbml4LlV0aWwuVHlwZS5jbG9uZU9iamVjdChuc3BJdGVtLCB7fSk7XHJcblx0XHRcdFx0XHR0aGlzLm5zcFtpbmRleF0gPSBuc3BJdGVtO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRuc3BJdGVtW25zXSA9IHA7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBwO1xyXG5cdH0sXHJcblx0Z2V0TmFtZXNwYWNlVVJJIDogZnVuY3Rpb24gKHApIHtcclxuXHRcdHZhciBwaW5kZXggPSB0aGlzLnBucy5sZW5ndGggLSAxO1xyXG5cdFx0dmFyIHBuc0l0ZW0gPSB0aGlzLnBuc1twaW5kZXhdO1xyXG5cdFx0cG5zSXRlbSA9IEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QocG5zSXRlbSkgPyBwbnNJdGVtIDogdGhpcy5wbnNbcG5zSXRlbV07XHJcblx0XHRyZXR1cm4gcG5zSXRlbVtwXTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiBcIkpzb25peC5YTUwuT3V0cHV0XCJcclxufSk7XHJcblxyXG5Kc29uaXguTWFwcGluZyA9IHt9O1xyXG5Kc29uaXguTWFwcGluZy5TdHlsZSA9IEpzb25peC5DbGFzcyh7XHJcblx0bWFyc2hhbGxlciA6IG51bGwsXHJcblx0dW5tYXJzaGFsbGVyIDogbnVsbCxcclxuXHRtb2R1bGUgOiBudWxsLFxyXG5cdGVsZW1lbnRJbmZvIDogbnVsbCxcclxuXHRjbGFzc0luZm8gOiBudWxsLFxyXG5cdGVudW1MZWFmSW5mbyA6IG51bGwsXHJcblx0YW55QXR0cmlidXRlUHJvcGVydHlJbmZvIDogbnVsbCxcclxuXHRhbnlFbGVtZW50UHJvcGVydHlJbmZvIDogbnVsbCxcclxuXHRhdHRyaWJ1dGVQcm9wZXJ0eUluZm8gOiBudWxsLFxyXG5cdGVsZW1lbnRNYXBQcm9wZXJ0eUluZm8gOiBudWxsLFxyXG5cdGVsZW1lbnRQcm9wZXJ0eUluZm8gOiBudWxsLFxyXG5cdGVsZW1lbnRzUHJvcGVydHlJbmZvIDogbnVsbCxcclxuXHRlbGVtZW50UmVmUHJvcGVydHlJbmZvIDogbnVsbCxcclxuXHRlbGVtZW50UmVmc1Byb3BlcnR5SW5mbyA6IG51bGwsXHJcblx0dmFsdWVQcm9wZXJ0eUluZm8gOiBudWxsLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1hcHBpbmcuU3R5bGUnXHJcbn0pO1xyXG5cclxuSnNvbml4Lk1hcHBpbmcuU3R5bGUuU1RZTEVTID0ge307XHJcbkpzb25peC5NYXBwaW5nLlN0eWxlZCA9IEpzb25peC5DbGFzcyh7XHJcblx0bWFwcGluZ1N0eWxlIDogbnVsbCxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG9wdGlvbnMpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3Qob3B0aW9ucyk7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKG9wdGlvbnMubWFwcGluZ1N0eWxlKSkge1xyXG5cdFx0XHRcdHZhciBtYXBwaW5nU3R5bGUgPSBKc29uaXguTWFwcGluZy5TdHlsZS5TVFlMRVNbb3B0aW9ucy5tYXBwaW5nU3R5bGVdO1xyXG5cdFx0XHRcdGlmICghbWFwcGluZ1N0eWxlKSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJNYXBwaW5nIHN0eWxlIFtcIiArIG9wdGlvbnMubWFwcGluZ1N0eWxlICsgXCJdIGlzIG5vdCBrbm93bi5cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMubWFwcGluZ1N0eWxlID0gbWFwcGluZ1N0eWxlO1xyXG5cdFx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3Qob3B0aW9ucy5tYXBwaW5nU3R5bGUpKSB7XHJcblx0XHRcdFx0dGhpcy5tYXBwaW5nU3R5bGUgPSBvcHRpb25zLm1hcHBpbmdTdHlsZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLm1hcHBpbmdTdHlsZSkge1xyXG5cdFx0XHR0aGlzLm1hcHBpbmdTdHlsZSA9IEpzb25peC5NYXBwaW5nLlN0eWxlLlNUWUxFUy5zdGFuZGFyZDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1hcHBpbmcuU3R5bGVkJ1xyXG59KTtcclxuSnNvbml4LkJpbmRpbmcgPSB7fTtcclxuSnNvbml4LkJpbmRpbmcuTWFyc2hhbGxzID0ge1xyXG59O1xyXG5cclxuSnNvbml4LkJpbmRpbmcuTWFyc2hhbGxzLkVsZW1lbnQgPSBKc29uaXguQ2xhc3Moe1xyXG5cdG1hcnNoYWxFbGVtZW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciBlbGVtZW50VmFsdWUgPSB0aGlzLmNvbnZlcnRUb1R5cGVkTmFtZWRWYWx1ZSh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHR2YXIgZGVjbGFyZWRUeXBlSW5mbyA9IGVsZW1lbnRWYWx1ZS50eXBlSW5mbztcclxuXHRcdHZhciBhY3R1YWxUeXBlSW5mbyA9IHVuZGVmaW5lZDtcclxuXHRcdGlmIChjb250ZXh0LnN1cHBvcnRYc2lUeXBlICYmIEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGVsZW1lbnRWYWx1ZS52YWx1ZSkpXHJcblx0XHR7XHJcblx0XHRcdHZhciB0eXBlSW5mb0J5VmFsdWUgPSBjb250ZXh0LmdldFR5cGVJbmZvQnlWYWx1ZShlbGVtZW50VmFsdWUudmFsdWUpO1xyXG5cdFx0XHRpZiAodHlwZUluZm9CeVZhbHVlICYmIHR5cGVJbmZvQnlWYWx1ZS50eXBlTmFtZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGFjdHVhbFR5cGVJbmZvID0gdHlwZUluZm9CeVZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgdHlwZUluZm8gPSBhY3R1YWxUeXBlSW5mbyB8fCBkZWNsYXJlZFR5cGVJbmZvO1xyXG5cdFx0aWYgKHR5cGVJbmZvKSB7XHJcblx0XHRcdG91dHB1dC53cml0ZVN0YXJ0RWxlbWVudChlbGVtZW50VmFsdWUubmFtZSk7XHJcblx0XHRcdGlmIChhY3R1YWxUeXBlSW5mbyAmJiBkZWNsYXJlZFR5cGVJbmZvICE9PSBhY3R1YWxUeXBlSW5mbykge1xyXG5cdFx0XHRcdHZhciB4c2lUeXBlTmFtZSA9IGFjdHVhbFR5cGVJbmZvLnR5cGVOYW1lO1xyXG5cdFx0XHRcdHZhciB4c2lUeXBlID0gSnNvbml4LlNjaGVtYS5YU0QuUU5hbWUuSU5TVEFOQ0UucHJpbnQoeHNpVHlwZU5hbWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0XHRcdG91dHB1dC53cml0ZUF0dHJpYnV0ZShKc29uaXguU2NoZW1hLlhTSS5UWVBFX1FOQU1FLCB4c2lUeXBlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZWxlbWVudFZhbHVlLnZhbHVlKSkge1xyXG5cdFx0XHRcdHR5cGVJbmZvLm1hcnNoYWwoZWxlbWVudFZhbHVlLnZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRvdXRwdXQud3JpdGVFbmRFbGVtZW50KCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IFtcIiArIGVsZW1lbnRWYWx1ZS5uYW1lLmtleSArIFwiXSBpcyBub3Qga25vd24gaW4gdGhpcyBjb250ZXh0LCBjb3VsZCBub3QgZGV0ZXJtaW5lIGl0cyB0eXBlLlwiKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldFR5cGVJbmZvQnlFbGVtZW50TmFtZSA6IGZ1bmN0aW9uKG5hbWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHR2YXIgZWxlbWVudEluZm8gPSBjb250ZXh0LmdldEVsZW1lbnRJbmZvKG5hbWUsIHNjb3BlKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhlbGVtZW50SW5mbykpIHtcclxuXHRcdFx0cmV0dXJuIGVsZW1lbnRJbmZvLnR5cGVJbmZvO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5Kc29uaXguQmluZGluZy5NYXJzaGFsbHMuRWxlbWVudC5Bc0VsZW1lbnRSZWYgPSBKc29uaXguQ2xhc3Moe1xyXG5cdGNvbnZlcnRUb1R5cGVkTmFtZWRWYWx1ZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHZhbHVlKTtcclxuXHRcdHZhciBlbGVtZW50VmFsdWUgPSB0aGlzLmNvbnZlcnRUb05hbWVkVmFsdWUodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZSA6IGVsZW1lbnRWYWx1ZS5uYW1lLFxyXG5cdFx0XHR2YWx1ZSA6IGVsZW1lbnRWYWx1ZS52YWx1ZSxcclxuXHRcdFx0dHlwZUluZm8gOiB0aGlzLmdldFR5cGVJbmZvQnlFbGVtZW50TmFtZShlbGVtZW50VmFsdWUubmFtZSwgY29udGV4dCwgc2NvcGUpXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0Y29udmVydFRvTmFtZWRWYWx1ZSA6IGZ1bmN0aW9uKGVsZW1lbnRWYWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIG5hbWU7XHJcblx0XHR2YXIgdmFsdWU7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZWxlbWVudFZhbHVlLm5hbWUpICYmICFKc29uaXguVXRpbC5UeXBlLmlzVW5kZWZpbmVkKGVsZW1lbnRWYWx1ZS52YWx1ZSkpIHtcclxuXHRcdFx0bmFtZSA9IEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdE9yU3RyaW5nKGVsZW1lbnRWYWx1ZS5uYW1lLCBjb250ZXh0KTtcclxuXHRcdFx0dmFsdWUgPSBKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhlbGVtZW50VmFsdWUudmFsdWUpID8gZWxlbWVudFZhbHVlLnZhbHVlIDogbnVsbDtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRuYW1lIDogbmFtZSxcclxuXHRcdFx0XHR2YWx1ZSA6IHZhbHVlXHJcblx0XHRcdH07XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRmb3IgKCB2YXIgcHJvcGVydHlOYW1lIGluIGVsZW1lbnRWYWx1ZSkge1xyXG5cdFx0XHRcdGlmIChlbGVtZW50VmFsdWUuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG5cdFx0XHRcdFx0bmFtZSA9IEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdE9yU3RyaW5nKHByb3BlcnR5TmFtZSwgY29udGV4dCk7XHJcblx0XHRcdFx0XHR2YWx1ZSA9IGVsZW1lbnRWYWx1ZVtwcm9wZXJ0eU5hbWVdO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdFx0bmFtZSA6IG5hbWUsXHJcblx0XHRcdFx0XHRcdHZhbHVlIDogdmFsdWVcclxuXHRcdFx0XHRcdH07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGVsZW1lbnQgdmFsdWUgW1wiICsgZWxlbWVudFZhbHVlICsgXCJdLiBFbGVtZW50IHZhbHVlcyBtdXN0IGVpdGhlciBoYXZlIHtuYW1lOidteUVsZW1lbnROYW1lJywgdmFsdWU6IGVsZW1lbnRWYWx1ZX0gb3Ige215RWxlbWVudE5hbWU6ZWxlbWVudFZhbHVlfSBzdHJ1Y3R1cmUuXCIpO1xyXG5cdH1cclxufSk7XHJcblxyXG5Kc29uaXguQmluZGluZy5Vbm1hcnNoYWxscyA9IHt9O1xyXG5cclxuSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbHMuV3JhcHBlckVsZW1lbnQgPSBKc29uaXguQ2xhc3Moe1xyXG5cdG1peGVkIDogZmFsc2UsXHJcblx0dW5tYXJzaGFsV3JhcHBlckVsZW1lbnQgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgc2NvcGUsIGNhbGxiYWNrKSB7XHJcblx0XHR2YXIgZXQgPSBpbnB1dC5uZXh0KCk7XHJcblx0XHR3aGlsZSAoZXQgIT09IEpzb25peC5YTUwuSW5wdXQuRU5EX0VMRU1FTlQpIHtcclxuXHRcdFx0aWYgKGV0ID09PSBKc29uaXguWE1MLklucHV0LlNUQVJUX0VMRU1FTlQpIHtcclxuXHRcdFx0XHR0aGlzLnVubWFyc2hhbEVsZW1lbnQoY29udGV4dCwgaW5wdXQsIHNjb3BlLCBjYWxsYmFjayk7XHJcblx0XHRcdH0gZWxzZVxyXG5cdFx0XHQvLyBDaGFyYWN0ZXJzXHJcblx0XHRcdGlmICh0aGlzLm1peGVkICYmIChldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5DSEFSQUNURVJTIHx8IGV0ID09PSBKc29uaXguWE1MLklucHV0LkNEQVRBIHx8IGV0ID09PSBKc29uaXguWE1MLklucHV0LkVOVElUWV9SRUZFUkVOQ0UpKSB7XHJcblx0XHRcdFx0Y2FsbGJhY2soaW5wdXQuZ2V0VGV4dCgpKTtcclxuXHRcdFx0fSBlbHNlIGlmIChldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5TUEFDRSB8fCBldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5DT01NRU5UIHx8IGV0ID09PSBKc29uaXguWE1MLklucHV0LlBST0NFU1NJTkdfSU5TVFJVQ1RJT04pIHtcclxuXHRcdFx0XHQvLyBTa2lwIHdoaXRlc3BhY2VcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHN0YXRlOiB1bmV4cGVjdGVkIGV2ZW50IHR5cGUgW1wiICsgZXQgKyBcIl0uXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGV0ID0gaW5wdXQubmV4dCgpO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7XHJcblxyXG5Kc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50ID0gSnNvbml4LkNsYXNzKHtcclxuXHRhbGxvd1R5cGVkT2JqZWN0IDogdHJ1ZSxcclxuXHRhbGxvd0RvbSA6IGZhbHNlLFxyXG5cdHVubWFyc2hhbEVsZW1lbnQgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgc2NvcGUsIGNhbGxiYWNrKSB7XHJcblx0XHRpZiAoaW5wdXQuZXZlbnRUeXBlICE9IDEpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUGFyc2VyIG11c3QgYmUgb24gU1RBUlRfRUxFTUVOVCB0byByZWFkIG5leHQgZWxlbWVudC5cIik7XHJcblx0XHR9XHJcblx0XHR2YXIgdHlwZUluZm8gPSB0aGlzLmdldFR5cGVJbmZvQnlJbnB1dEVsZW1lbnQoY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHRcdHZhciBuYW1lID0gaW5wdXQuZ2V0TmFtZSgpO1xyXG5cdFx0dmFyIGVsZW1lbnRWYWx1ZTtcclxuXHRcdGlmICh0aGlzLmFsbG93VHlwZWRPYmplY3QpIHtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHR5cGVJbmZvKSkge1xyXG5cdFx0XHRcdHZhciB2YWx1ZSA9IHR5cGVJbmZvLnVubWFyc2hhbChjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0XHRcdHZhciB0eXBlZE5hbWVkVmFsdWUgPSB7XHJcblx0XHRcdFx0XHRuYW1lIDogbmFtZSxcclxuXHRcdFx0XHRcdHZhbHVlIDogdmFsdWUsXHJcblx0XHRcdFx0XHR0eXBlSW5mbyA6IHR5cGVJbmZvXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0XHRlbGVtZW50VmFsdWUgPSB0aGlzLmNvbnZlcnRGcm9tVHlwZWROYW1lZFZhbHVlKHR5cGVkTmFtZWRWYWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHRcdFx0fSBlbHNlIGlmICh0aGlzLmFsbG93RG9tKSB7XHJcblx0XHRcdFx0ZWxlbWVudFZhbHVlID0gaW5wdXQuZ2V0RWxlbWVudCgpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgW1wiICsgbmFtZS50b1N0cmluZygpICsgXCJdIGNvdWxkIG5vdCBiZSB1bm1hcnNoYWxsZWQgYXMgaXMgbm90IGtub3duIGluIHRoaXMgY29udGV4dCBhbmQgdGhlIHByb3BlcnR5IGRvZXMgbm90IGFsbG93IERPTSBjb250ZW50LlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmFsbG93RG9tKSB7XHJcblx0XHRcdGVsZW1lbnRWYWx1ZSA9IGlucHV0LmdldEVsZW1lbnQoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgW1wiICsgbmFtZS50b1N0cmluZygpICsgXCJdIGNvdWxkIG5vdCBiZSB1bm1hcnNoYWxsZWQgYXMgdGhlIHByb3BlcnR5IG5laXRoZXIgYWxsb3dzIHR5cGVkIG9iamVjdHMgbm9yIERPTSBhcyBjb250ZW50LiBUaGlzIGlzIGEgc2lnbiBvZiBpbnZhbGlkIG1hcHBpbmdzLCBkbyBub3QgdXNlIFthbGxvd1R5cGVkT2JqZWN0IDogZmFsc2VdIGFuZCBbYWxsb3dEb20gOiBmYWxzZV0gYXQgdGhlIHNhbWUgdGltZS5cIik7XHJcblx0XHR9XHJcblx0XHRjYWxsYmFjayhlbGVtZW50VmFsdWUpO1xyXG5cdH0sXHJcblx0Z2V0VHlwZUluZm9CeUlucHV0RWxlbWVudCA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIHhzaVR5cGVJbmZvID0gbnVsbDtcclxuXHRcdGlmIChjb250ZXh0LnN1cHBvcnRYc2lUeXBlKSB7XHJcblx0XHRcdHZhciB4c2lUeXBlID0gaW5wdXQuZ2V0QXR0cmlidXRlVmFsdWVOUyhKc29uaXguU2NoZW1hLlhTSS5OQU1FU1BBQ0VfVVJJLCBKc29uaXguU2NoZW1hLlhTSS5UWVBFKTtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlN0cmluZ1V0aWxzLmlzTm90QmxhbmsoeHNpVHlwZSkpIHtcclxuXHRcdFx0XHR2YXIgeHNpVHlwZU5hbWUgPSBKc29uaXguU2NoZW1hLlhTRC5RTmFtZS5JTlNUQU5DRS5wYXJzZSh4c2lUeXBlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0XHRcdHhzaVR5cGVJbmZvID0gY29udGV4dC5nZXRUeXBlSW5mb0J5VHlwZU5hbWVLZXkoeHNpVHlwZU5hbWUua2V5KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dmFyIG5hbWUgPSBpbnB1dC5nZXROYW1lKCk7XHJcblx0XHR2YXIgdHlwZUluZm8gPSB4c2lUeXBlSW5mbyA/IHhzaVR5cGVJbmZvIDogdGhpcy5nZXRUeXBlSW5mb0J5RWxlbWVudE5hbWUobmFtZSwgY29udGV4dCwgc2NvcGUpO1xyXG5cdFx0cmV0dXJuIHR5cGVJbmZvO1xyXG5cdH0sXHJcblx0Z2V0VHlwZUluZm9CeUVsZW1lbnROYW1lIDogZnVuY3Rpb24obmFtZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHZhciBlbGVtZW50SW5mbyA9IGNvbnRleHQuZ2V0RWxlbWVudEluZm8obmFtZSwgc2NvcGUpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGVsZW1lbnRJbmZvKSkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudEluZm8udHlwZUluZm87XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7XHJcblxyXG5Kc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50LkFzRWxlbWVudFJlZiA9IEpzb25peC5DbGFzcyh7XHJcblx0Y29udmVydEZyb21UeXBlZE5hbWVkVmFsdWUgOiBmdW5jdGlvbih0eXBlZE5hbWVkVmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZSA6IHR5cGVkTmFtZWRWYWx1ZS5uYW1lLFxyXG5cdFx0XHR2YWx1ZSA6IHR5cGVkTmFtZWRWYWx1ZS52YWx1ZVxyXG5cdFx0fTtcclxuXHR9XHJcbn0pO1xyXG5cclxuSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbHMuRWxlbWVudC5Bc1NpbXBsaWZpZWRFbGVtZW50UmVmID0gSnNvbml4LkNsYXNzKHtcclxuXHRjb252ZXJ0RnJvbVR5cGVkTmFtZWRWYWx1ZSA6IGZ1bmN0aW9uKHR5cGVkTmFtZWRWYWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgcHJvcGVydHlOYW1lID0gdHlwZWROYW1lZFZhbHVlLm5hbWUudG9DYW5vbmljYWxTdHJpbmcoY29udGV4dCk7XHJcblx0XHR2YXIgdmFsdWUgPSB7fTtcclxuXHRcdHZhbHVlW3Byb3BlcnR5TmFtZV0gPSB0eXBlZE5hbWVkVmFsdWUudmFsdWU7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fVxyXG59KTtcclxuSnNvbml4LkJpbmRpbmcuTWFyc2hhbGxlciA9IEpzb25peC5DbGFzcyhKc29uaXguQmluZGluZy5NYXJzaGFsbHMuRWxlbWVudCwgSnNvbml4LkJpbmRpbmcuTWFyc2hhbGxzLkVsZW1lbnQuQXNFbGVtZW50UmVmLCB7XHJcblx0Y29udGV4dCA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QoY29udGV4dCk7XHJcblx0XHR0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG5cdH0sXHJcblx0bWFyc2hhbFN0cmluZyA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YXIgZG9jID0gdGhpcy5tYXJzaGFsRG9jdW1lbnQodmFsdWUpO1xyXG5cdFx0dmFyIHRleHQgPSBKc29uaXguRE9NLnNlcmlhbGl6ZShkb2MpO1xyXG5cdFx0cmV0dXJuIHRleHQ7XHJcblx0fSxcclxuXHRtYXJzaGFsRG9jdW1lbnQgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0dmFyIG91dHB1dCA9IG5ldyBKc29uaXguWE1MLk91dHB1dCh7XHJcblx0XHRcdG5hbWVzcGFjZVByZWZpeGVzIDogdGhpcy5jb250ZXh0Lm5hbWVzcGFjZVByZWZpeGVzXHJcblx0XHR9KTtcclxuXHJcblx0XHR2YXIgZG9jID0gb3V0cHV0LndyaXRlU3RhcnREb2N1bWVudCgpO1xyXG5cdFx0dGhpcy5tYXJzaGFsRWxlbWVudCh2YWx1ZSwgdGhpcy5jb250ZXh0LCBvdXRwdXQsIHVuZGVmaW5lZCk7XHJcblx0XHRvdXRwdXQud3JpdGVFbmREb2N1bWVudCgpO1xyXG5cdFx0cmV0dXJuIGRvYztcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LkJpbmRpbmcuTWFyc2hhbGxlcidcclxufSk7XHJcbkpzb25peC5CaW5kaW5nLk1hcnNoYWxsZXIuU2ltcGxpZmllZCA9IEpzb25peC5DbGFzcyhKc29uaXguQmluZGluZy5NYXJzaGFsbGVyLCB7XHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguQmluZGluZy5NYXJzaGFsbGVyLlNpbXBsaWZpZWQnXHJcbn0pO1xyXG5Kc29uaXguQmluZGluZy5Vbm1hcnNoYWxsZXIgPSBKc29uaXguQ2xhc3MoSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbHMuRWxlbWVudCwgSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbHMuRWxlbWVudC5Bc0VsZW1lbnRSZWYsIHtcclxuXHRjb250ZXh0IDogbnVsbCxcclxuXHRhbGxvd1R5cGVkT2JqZWN0IDogdHJ1ZSxcclxuXHRhbGxvd0RvbSA6IGZhbHNlLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KGNvbnRleHQpO1xyXG5cdFx0dGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuXHR9LFxyXG5cdHVubWFyc2hhbFN0cmluZyA6IGZ1bmN0aW9uKHRleHQpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHR2YXIgZG9jID0gSnNvbml4LkRPTS5wYXJzZSh0ZXh0KTtcclxuXHRcdHJldHVybiB0aGlzLnVubWFyc2hhbERvY3VtZW50KGRvYyk7XHJcblx0fSxcclxuXHR1bm1hcnNoYWxVUkwgOiBmdW5jdGlvbih1cmwsIGNhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHVybCk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRnVuY3Rpb24oY2FsbGJhY2spO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG9wdGlvbnMpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3Qob3B0aW9ucyk7XHJcblx0XHR9XHJcblx0XHR0aGF0ID0gdGhpcztcclxuXHRcdEpzb25peC5ET00ubG9hZCh1cmwsIGZ1bmN0aW9uKGRvYykge1xyXG5cdFx0XHRjYWxsYmFjayh0aGF0LnVubWFyc2hhbERvY3VtZW50KGRvYykpO1xyXG5cdFx0fSwgb3B0aW9ucyk7XHJcblx0fSxcclxuXHR1bm1hcnNoYWxGaWxlIDogZnVuY3Rpb24oZmlsZU5hbWUsIGNhbGxiYWNrLCBvcHRpb25zKSB7XHJcblx0XHRpZiAodHlwZW9mIF9qc29uaXhfZnMgPT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkZpbGUgdW5tYXJzaGFsbGluZyBpcyBvbmx5IGF2YWlsYWJsZSBpbiBlbnZpcm9ubWVudHMgd2hpY2ggc3VwcG9ydCBmaWxlIHN5c3RlbXMuXCIpO1xyXG5cdFx0fVxyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhmaWxlTmFtZSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRnVuY3Rpb24oY2FsbGJhY2spO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG9wdGlvbnMpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3Qob3B0aW9ucyk7XHJcblx0XHR9XHJcblx0XHR0aGF0ID0gdGhpcztcclxuXHRcdHZhciBmcyA9IF9qc29uaXhfZnM7XHJcblx0XHRmcy5yZWFkRmlsZShmaWxlTmFtZSwgb3B0aW9ucywgZnVuY3Rpb24oZXJyLCBkYXRhKSB7XHJcblx0XHRcdGlmIChlcnIpIHtcclxuXHRcdFx0XHR0aHJvdyBlcnI7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHRleHQgPSBkYXRhLnRvU3RyaW5nKCk7XHJcblx0XHRcdFx0dmFyIGRvYyA9IEpzb25peC5ET00ucGFyc2UodGV4dCk7XHJcblx0XHRcdFx0Y2FsbGJhY2sodGhhdC51bm1hcnNoYWxEb2N1bWVudChkb2MpKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHR1bm1hcnNoYWxEb2N1bWVudCA6IGZ1bmN0aW9uKGRvYywgc2NvcGUpIHtcclxuXHRcdHZhciBpbnB1dCA9IG5ldyBKc29uaXguWE1MLklucHV0KGRvYyk7XHJcblx0XHR2YXIgcmVzdWx0ID0gbnVsbDtcclxuXHRcdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKF9yZXN1bHQpIHtcclxuXHRcdFx0cmVzdWx0ID0gX3Jlc3VsdDtcclxuXHRcdH07XHJcblx0XHRpbnB1dC5uZXh0VGFnKCk7XHJcblx0XHR0aGlzLnVubWFyc2hhbEVsZW1lbnQodGhpcy5jb250ZXh0LCBpbnB1dCwgc2NvcGUsIGNhbGxiYWNrKTtcclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblxyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguQmluZGluZy5Vbm1hcnNoYWxsZXInXHJcbn0pO1xyXG5Kc29uaXguQmluZGluZy5Vbm1hcnNoYWxsZXIuU2ltcGxpZmllZCA9IEpzb25peC5DbGFzcyhKc29uaXguQmluZGluZy5Vbm1hcnNoYWxsZXIsIEpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxzLkVsZW1lbnQuQXNTaW1wbGlmaWVkRWxlbWVudFJlZiwge1xyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbGVyLlNpbXBsaWZpZWQnXHJcbn0pO1xyXG5Kc29uaXguTW9kZWwuVHlwZUluZm8gPSBKc29uaXguQ2xhc3Moe1xyXG5cdG1vZHVsZTogbnVsbCxcdFx0XHRcclxuXHRuYW1lIDogbnVsbCxcclxuXHRiYXNlVHlwZUluZm8gOiBudWxsLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHR9LFxyXG5cdGlzQmFzZWRPbiA6IGZ1bmN0aW9uKHR5cGVJbmZvKSB7XHJcblx0XHR2YXIgY3VycmVudFR5cGVJbmZvID0gdGhpcztcclxuXHRcdHdoaWxlIChjdXJyZW50VHlwZUluZm8pIHtcclxuXHRcdFx0aWYgKHR5cGVJbmZvID09PSBjdXJyZW50VHlwZUluZm8pIHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHRjdXJyZW50VHlwZUluZm8gPSBjdXJyZW50VHlwZUluZm8uYmFzZVR5cGVJbmZvO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuVHlwZUluZm8nXHJcbn0pO1xyXG5Kc29uaXguTW9kZWwuQ2xhc3NJbmZvID0gSnNvbml4XHJcblx0XHQuQ2xhc3MoSnNvbml4Lk1vZGVsLlR5cGVJbmZvLCBKc29uaXguTWFwcGluZy5TdHlsZWQsIHtcclxuXHRcdFx0bmFtZSA6IG51bGwsXHJcblx0XHRcdGxvY2FsTmFtZSA6IG51bGwsXHJcblx0XHRcdHR5cGVOYW1lIDogbnVsbCxcclxuXHRcdFx0aW5zdGFuY2VGYWN0b3J5IDogbnVsbCxcclxuXHRcdFx0cHJvcGVydGllcyA6IG51bGwsXHJcblx0XHRcdHByb3BlcnRpZXNNYXAgOiBudWxsLFxyXG5cdFx0XHRzdHJ1Y3R1cmUgOiBudWxsLFxyXG5cdFx0XHR0YXJnZXROYW1lc3BhY2UgOiAnJyxcclxuXHRcdFx0ZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgOiAnJyxcclxuXHRcdFx0ZGVmYXVsdEF0dHJpYnV0ZU5hbWVzcGFjZVVSSSA6ICcnLFxyXG5cdFx0XHRidWlsdCA6IGZhbHNlLFxyXG5cdFx0XHRpbml0aWFsaXplIDogZnVuY3Rpb24obWFwcGluZywgb3B0aW9ucykge1xyXG5cdFx0XHRcdEpzb25peC5Nb2RlbC5UeXBlSW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbXSk7XHJcblx0XHRcdFx0SnNvbml4Lk1hcHBpbmcuU3R5bGVkLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFtvcHRpb25zXSk7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdFx0XHR2YXIgbiA9IG1hcHBpbmcubmFtZXx8bWFwcGluZy5ufHx1bmRlZmluZWQ7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhuKTtcclxuXHRcdFx0XHR0aGlzLm5hbWUgPSBuO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBsbiA9IG1hcHBpbmcubG9jYWxOYW1lfHxtYXBwaW5nLmxufHxudWxsO1xyXG5cdFx0XHRcdHRoaXMubG9jYWxOYW1lID0gbG47XHJcblxyXG5cdFx0XHRcdHZhciBkZW5zID0gbWFwcGluZy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSXx8bWFwcGluZy5kZW5zfHxtYXBwaW5nLnRhcmdldE5hbWVzcGFjZXx8bWFwcGluZy50bnN8fCcnO1xyXG5cdFx0XHRcdHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgPSBkZW5zO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciB0bnMgPSAgbWFwcGluZy50YXJnZXROYW1lc3BhY2V8fG1hcHBpbmcudG5zfHxtYXBwaW5nLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJfHxtYXBwaW5nLmRlbnN8fHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkk7XHJcblx0XHRcdFx0dGhpcy50YXJnZXROYW1lc3BhY2UgPSB0bnM7XHJcblxyXG5cdFx0XHRcdHZhciBkYW5zID0gbWFwcGluZy5kZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJfHxtYXBwaW5nLmRhbnN8fCcnO1xyXG5cdFx0XHRcdHRoaXMuZGVmYXVsdEF0dHJpYnV0ZU5hbWVzcGFjZVVSSSA9IGRhbnM7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIGJ0aSA9IG1hcHBpbmcuYmFzZVR5cGVJbmZvfHxtYXBwaW5nLmJ0aXx8bnVsbDtcclxuXHRcdFx0XHR0aGlzLmJhc2VUeXBlSW5mbyA9IGJ0aTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgaW5GID0gbWFwcGluZy5pbnN0YW5jZUZhY3Rvcnl8fG1hcHBpbmcuaW5GfHx1bmRlZmluZWQ7XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGluRikpIHtcclxuXHRcdFx0XHRcdC8vIFRPRE86IHNob3VsZCB3ZSBzdXBwb3J0IGluc3RhbmNlRmFjdG9yeSBhcyBmdW5jdGlvbnM/XHJcblx0XHRcdFx0XHQvLyBGb3IgdGhlIHB1cmUgSlNPTiBjb25maWd1cmF0aW9uP1xyXG5cdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUZ1bmN0aW9uKGluRik7XHJcblx0XHRcdFx0XHR0aGlzLmluc3RhbmNlRmFjdG9yeSA9IGluRjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIHRuID0gbWFwcGluZy50eXBlTmFtZXx8bWFwcGluZy50bnx8dW5kZWZpbmVkO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0bikpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodG4pKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR0aGlzLnR5cGVOYW1lID0gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy50YXJnZXROYW1lc3BhY2UsIHRuKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnR5cGVOYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0KHRuKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMobG4pKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHRoaXMudHlwZU5hbWUgPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0bnMsIGxuKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dGhpcy5wcm9wZXJ0aWVzID0gW107XHJcblx0XHRcdFx0dGhpcy5wcm9wZXJ0aWVzTWFwID0ge307XHJcblx0XHRcdFx0dmFyIHBzID0gbWFwcGluZy5wcm9wZXJ0eUluZm9zfHxtYXBwaW5nLnBzfHxbXTtcclxuXHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlQXJyYXkocHMpO1xyXG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgcHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0XHR0aGlzLnAocHNbaW5kZXhdKTtcclxuXHRcdFx0XHR9XHRcdFx0XHRcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0UHJvcGVydHlJbmZvQnlOYW1lIDogZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnByb3BlcnRpZXNNYXBbbmFtZV07XHJcblx0XHRcdH0sXHJcblx0XHRcdC8vIE9ic29sZXRlXHJcblx0XHRcdGRlc3Ryb3kgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0fSxcclxuXHRcdFx0YnVpbGQgOiBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0XHRcdFx0aWYgKCF0aGlzLmJ1aWx0KSB7XHJcblx0XHRcdFx0XHR0aGlzLmJhc2VUeXBlSW5mbyA9IGNvbnRleHQucmVzb2x2ZVR5cGVJbmZvKHRoaXMuYmFzZVR5cGVJbmZvLCB0aGlzLm1vZHVsZSk7XHJcblx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModGhpcy5iYXNlVHlwZUluZm8pKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuYmFzZVR5cGVJbmZvLmJ1aWxkKGNvbnRleHQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdC8vIEJ1aWxkIHByb3BlcnRpZXMgaW4gdGhpcyBjb250ZXh0XHJcblx0XHRcdFx0XHRmb3IgKCB2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdFx0dmFyIHByb3BlcnR5SW5mbyA9IHRoaXMucHJvcGVydGllc1tpbmRleF07XHJcblx0XHRcdFx0XHRcdHByb3BlcnR5SW5mby5idWlsZChjb250ZXh0LCB0aGlzLm1vZHVsZSk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gQnVpbGQgdGhlIHN0cnVjdHVyZVxyXG5cdFx0XHRcdFx0dmFyIHN0cnVjdHVyZSA9IHtcclxuXHRcdFx0XHRcdFx0ZWxlbWVudHMgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRhdHRyaWJ1dGVzIDoge30sXHJcblx0XHRcdFx0XHRcdGFueUF0dHJpYnV0ZSA6IG51bGwsXHJcblx0XHRcdFx0XHRcdHZhbHVlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0YW55IDogbnVsbFxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdHRoaXMuYnVpbGRTdHJ1Y3R1cmUoY29udGV4dCwgc3RydWN0dXJlKTtcclxuXHRcdFx0XHRcdHRoaXMuc3RydWN0dXJlID0gc3RydWN0dXJlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0YnVpbGRTdHJ1Y3R1cmUgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModGhpcy5iYXNlVHlwZUluZm8pKSB7XHJcblx0XHRcdFx0XHR0aGlzLmJhc2VUeXBlSW5mby5idWlsZFN0cnVjdHVyZShjb250ZXh0LCBzdHJ1Y3R1cmUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmb3IgKCB2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdHZhciBwcm9wZXJ0eUluZm8gPSB0aGlzLnByb3BlcnRpZXNbaW5kZXhdO1xyXG5cdFx0XHRcdFx0cHJvcGVydHlJbmZvLmJ1aWxkU3RydWN0dXJlKGNvbnRleHQsIHN0cnVjdHVyZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHR1bm1hcnNoYWwgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCkge1xyXG5cdFx0XHRcdHRoaXMuYnVpbGQoY29udGV4dCk7XHJcblx0XHRcdFx0dmFyIHJlc3VsdDtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHRpZiAodGhpcy5pbnN0YW5jZUZhY3RvcnkpIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IG5ldyB0aGlzLmluc3RhbmNlRmFjdG9yeSgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmVzdWx0ID0geyBUWVBFX05BTUUgOiB0aGlzLm5hbWUgfTsgXHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmIChpbnB1dC5ldmVudFR5cGUgIT09IDEpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlBhcnNlciBtdXN0IGJlIG9uIFNUQVJUX0VMRU1FTlQgdG8gcmVhZCBhIGNsYXNzIGluZm8uXCIpO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0Ly8gUmVhZCBhdHRyaWJ1dGVzXHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMuc3RydWN0dXJlLmF0dHJpYnV0ZXMpKSB7XHJcblx0XHRcdFx0XHR2YXIgYXR0cmlidXRlQ291bnQgPSBpbnB1dC5nZXRBdHRyaWJ1dGVDb3VudCgpO1xyXG5cdFx0XHRcdFx0aWYgKGF0dHJpYnV0ZUNvdW50ICE9PSAwKSB7XHJcblx0XHRcdFx0XHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXR0cmlidXRlQ291bnQ7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgYXR0cmlidXRlTmFtZUtleSA9IGlucHV0XHJcblx0XHRcdFx0XHRcdFx0XHRcdC5nZXRBdHRyaWJ1dGVOYW1lS2V5KGluZGV4KTtcclxuXHRcdFx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZVxyXG5cdFx0XHRcdFx0XHRcdFx0XHQuZXhpc3RzKHRoaXMuc3RydWN0dXJlLmF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZUtleV0pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgYXR0cmlidXRlVmFsdWUgPSBpbnB1dFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdC5nZXRBdHRyaWJ1dGVWYWx1ZShpbmRleCk7XHJcblx0XHRcdFx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhhdHRyaWJ1dGVWYWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZVByb3BlcnR5SW5mbyA9IHRoaXMuc3RydWN0dXJlLmF0dHJpYnV0ZXNbYXR0cmlidXRlTmFtZUtleV07XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRoaXMudW5tYXJzaGFsUHJvcGVydHlWYWx1ZShjb250ZXh0LCBpbnB1dCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdGF0dHJpYnV0ZVByb3BlcnR5SW5mbywgcmVzdWx0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXR0cmlidXRlVmFsdWUpO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBSZWFkIGFueSBhdHRyaWJ1dGVcclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModGhpcy5zdHJ1Y3R1cmUuYW55QXR0cmlidXRlKSkge1xyXG5cdFx0XHRcdFx0dmFyIHByb3BlcnR5SW5mbyA9IHRoaXMuc3RydWN0dXJlLmFueUF0dHJpYnV0ZTtcclxuXHRcdFx0XHRcdHRoaXNcclxuXHRcdFx0XHRcdFx0XHQudW5tYXJzaGFsUHJvcGVydHkoY29udGV4dCwgaW5wdXQsIHByb3BlcnR5SW5mbyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0cmVzdWx0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gUmVhZCBlbGVtZW50c1xyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLnN0cnVjdHVyZS5lbGVtZW50cykpIHtcclxuXHJcblx0XHRcdFx0XHR2YXIgZXQgPSBpbnB1dC5uZXh0KCk7XHJcblx0XHRcdFx0XHR3aGlsZSAoZXQgIT09IEpzb25peC5YTUwuSW5wdXQuRU5EX0VMRU1FTlQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGV0ID09PSBKc29uaXguWE1MLklucHV0LlNUQVJUX0VMRU1FTlQpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBOZXcgc3ViLWVsZW1lbnQgc3RhcnRzXHJcblx0XHRcdFx0XHRcdFx0dmFyIGVsZW1lbnROYW1lS2V5ID0gaW5wdXQuZ2V0TmFtZUtleSgpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlXHJcblx0XHRcdFx0XHRcdFx0XHRcdC5leGlzdHModGhpcy5zdHJ1Y3R1cmUuZWxlbWVudHNbZWxlbWVudE5hbWVLZXldKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGVsZW1lbnRQcm9wZXJ0eUluZm8gPSB0aGlzLnN0cnVjdHVyZS5lbGVtZW50c1tlbGVtZW50TmFtZUtleV07XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnVubWFyc2hhbFByb3BlcnR5KGNvbnRleHQsIGlucHV0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGVsZW1lbnRQcm9wZXJ0eUluZm8sIHJlc3VsdCk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlXHJcblx0XHRcdFx0XHRcdFx0XHRcdC5leGlzdHModGhpcy5zdHJ1Y3R1cmUuYW55KSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVE9ETyBSZWZhY3RvclxyXG5cclxuXHRcdFx0XHRcdFx0XHRcdHZhciBhbnlQcm9wZXJ0eUluZm8gPSB0aGlzLnN0cnVjdHVyZS5hbnk7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnVubWFyc2hhbFByb3BlcnR5KGNvbnRleHQsIGlucHV0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGFueVByb3BlcnR5SW5mbywgcmVzdWx0KTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVE9ETyBvcHRpb25hbGx5IHJlcG9ydCBhIHZhbGlkYXRpb24gZXJyb3IgdGhhdCB0aGUgZWxlbWVudCBpcyBub3QgZXhwZWN0ZWRcclxuXHRcdFx0XHRcdFx0XHRcdGV0ID0gaW5wdXQuc2tpcEVsZW1lbnQoKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0gZWxzZSBpZiAoKGV0ID09PSBKc29uaXguWE1MLklucHV0LkNIQVJBQ1RFUlMgfHwgZXQgPT09IEpzb25peC5YTUwuSW5wdXQuQ0RBVEEgfHwgZXQgPT09IEpzb25peC5YTUwuSW5wdXQuRU5USVRZX1JFRkVSRU5DRSkpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModGhpcy5zdHJ1Y3R1cmUubWl4ZWQpKVxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIENoYXJhY3RlcnMgYW5kIHN0cnVjdHVyZSBoYXMgYSBtaXhlZCBwcm9wZXJ0eVxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIG1peGVkUHJvcGVydHlJbmZvID0gdGhpcy5zdHJ1Y3R1cmUubWl4ZWQ7XHJcblx0XHRcdFx0XHRcdFx0XHR0aGlzLnVubWFyc2hhbFByb3BlcnR5KGNvbnRleHQsIGlucHV0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG1peGVkUHJvcGVydHlJbmZvLCByZXN1bHQpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmIChldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5TUEFDRSB8fCBldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5DT01NRU5UXHR8fCBldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5QUk9DRVNTSU5HX0lOU1RSVUNUSU9OKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gSWdub3JlXHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSWxsZWdhbCBzdGF0ZTogdW5leHBlY3RlZCBldmVudCB0eXBlIFtcIiArIGV0XHQrIFwiXS5cIik7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZXQgPSBpbnB1dC5uZXh0KCk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLnN0cnVjdHVyZS52YWx1ZSkpIHtcclxuXHRcdFx0XHRcdHZhciB2YWx1ZVByb3BlcnR5SW5mbyA9IHRoaXMuc3RydWN0dXJlLnZhbHVlO1xyXG5cdFx0XHRcdFx0dGhpcy51bm1hcnNoYWxQcm9wZXJ0eShjb250ZXh0LCBpbnB1dCwgdmFsdWVQcm9wZXJ0eUluZm8sXHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0KTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gSnVzdCBza2lwIGV2ZXJ5dGhpbmdcclxuXHRcdFx0XHRcdGlucHV0Lm5leHRUYWcoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKGlucHV0LmV2ZW50VHlwZSAhPT0gMikge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSWxsZWdhbCBzdGF0ZTogbXVzdCBiZSBFTkRfRUxFTUVOVC5cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHRcdH0sXHJcblx0XHRcdHVubWFyc2hhbFByb3BlcnR5IDogZnVuY3Rpb24oY29udGV4dCwgaW5wdXQsIHByb3BlcnR5SW5mbywgcmVzdWx0KSB7XHJcblx0XHRcdFx0dmFyIHByb3BlcnR5VmFsdWUgPSBwcm9wZXJ0eUluZm9cclxuXHRcdFx0XHRcdFx0LnVubWFyc2hhbChjb250ZXh0LCBpbnB1dCwgdGhpcyk7XHJcblx0XHRcdFx0cHJvcGVydHlJbmZvLnNldFByb3BlcnR5KHJlc3VsdCwgcHJvcGVydHlWYWx1ZSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdHVubWFyc2hhbFByb3BlcnR5VmFsdWUgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgcHJvcGVydHlJbmZvLFxyXG5cdFx0XHRcdFx0cmVzdWx0LCB2YWx1ZSkge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eVZhbHVlID0gcHJvcGVydHlJbmZvLnVubWFyc2hhbFZhbHVlKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgdGhpcyk7XHJcblx0XHRcdFx0cHJvcGVydHlJbmZvLnNldFByb3BlcnR5KHJlc3VsdCwgcHJvcGVydHlWYWx1ZSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdG1hcnNoYWwgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmlzTWFyc2hhbGxhYmxlKHZhbHVlLCBjb250ZXh0LCBzY29wZSkpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Ly8gVE9ETyBUaGlzIG11c3QgYmUgcmV3b3JrZWRcclxuXHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLmJhc2VUeXBlSW5mbykpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5iYXNlVHlwZUluZm8ubWFyc2hhbCh2YWx1ZSwgY29udGV4dCwgb3V0cHV0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcGVydHlJbmZvID0gdGhpcy5wcm9wZXJ0aWVzW2luZGV4XTtcclxuXHRcdFx0XHRcdFx0dmFyIHByb3BlcnR5VmFsdWUgPSB2YWx1ZVtwcm9wZXJ0eUluZm8ubmFtZV07XHJcblx0XHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhwcm9wZXJ0eVZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdHByb3BlcnR5SW5mby5tYXJzaGFsKHByb3BlcnR5VmFsdWUsIGNvbnRleHQsIG91dHB1dCwgdGhpcyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdC8vIE90aGVyd2lzZSBpZiB0aGVyZSBpcyBqdXN0IG9uZSBwcm9wZXJ0eSwgdXNlIHRoaXMgcHJvcGVydHkgdG8gbWFyc2hhbFxyXG5cdFx0XHRcdFx0aWYgKHRoaXMuc3RydWN0dXJlLnZhbHVlKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR2YXIgdmFsdWVQcm9wZXJ0eUluZm8gPSB0aGlzLnN0cnVjdHVyZS52YWx1ZTtcclxuXHRcdFx0XHRcdFx0dmFsdWVQcm9wZXJ0eUluZm8ubWFyc2hhbCh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCB0aGlzKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKHRoaXMucHJvcGVydGllcy5sZW5ndGggPT09IDEpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHZhciBzaW5nbGVQcm9wZXJ0eUluZm8gPSB0aGlzLnByb3BlcnRpZXNbMF07XHJcblx0XHRcdFx0XHRcdHNpbmdsZVByb3BlcnR5SW5mby5tYXJzaGFsKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHRoaXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHQvLyBUT0RPIHRocm93IGFuIGVycm9yXHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBwYXNzZWQgdmFsdWUgW1wiICsgdmFsdWUgKyBcIl0gaXMgbm90IGFuIG9iamVjdCBhbmQgdGhlcmUgaXMgbm8gc2luZ2xlIHN1aXRhYmxlIHByb3BlcnR5IHRvIG1hcnNoYWwgaXQuXCIpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Ly8gQ2hlY2tzIGlmIHRoZSB2YWx1ZSBpcyBtYXJzaGFsbGFibGVcclxuXHRcdFx0aXNNYXJzaGFsbGFibGUgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5pc0luc3RhbmNlKHZhbHVlLCBjb250ZXh0LCBzY29wZSkgfHwgKEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QodmFsdWUpICYmICFKc29uaXguVXRpbC5UeXBlLmlzQXJyYXkodmFsdWUpKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0XHRcdGlmICh0aGlzLmluc3RhbmNlRmFjdG9yeSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgdGhpcy5pbnN0YW5jZUZhY3Rvcnk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QodmFsdWUpICYmIEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodmFsdWUuVFlQRV9OQU1FKSAmJiB2YWx1ZS5UWVBFX05BTUUgPT09IHRoaXMubmFtZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHQvLyBPYnNvbGV0ZSwgbGVmdCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcclxuXHRcdFx0YiA6IGZ1bmN0aW9uKGJhc2VUeXBlSW5mbykge1xyXG5cdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QoYmFzZVR5cGVJbmZvKTtcclxuXHRcdFx0XHR0aGlzLmJhc2VUeXBlSW5mbyA9IGJhc2VUeXBlSW5mbztcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHRcdFx0Ly8gT2Jzb2xldGUsIGxlZnQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XHJcblx0XHRcdHBzIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblx0XHRcdHAgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdFx0XHQvLyBJZiBtYXBwaW5nIGlzIGFuIGluc3RhbmNlIG9mIHRoZSBwcm9wZXJ0eSBjbGFzc1xyXG5cdFx0XHRcdGlmIChtYXBwaW5nIGluc3RhbmNlb2YgSnNvbml4Lk1vZGVsLlByb3BlcnR5SW5mbykge1xyXG5cdFx0XHRcdFx0dGhpcy5hZGRQcm9wZXJ0eShtYXBwaW5nKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gRWxzZSBjcmVhdGUgaXQgdmlhIGdlbmVyaWMgbWFwcGluZyBjb25maWd1cmF0aW9uXHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRtYXBwaW5nID0gSnNvbml4LlV0aWwuVHlwZS5jbG9uZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdFx0XHRcdHZhciB0eXBlID0gbWFwcGluZy50eXBlfHxtYXBwaW5nLnR8fCdlbGVtZW50JztcclxuXHRcdFx0XHRcdC8vIExvY2F0ZSB0aGUgY3JlYXRvciBmdW5jdGlvblxyXG5cdFx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGVcclxuXHRcdFx0XHRcdFx0XHQuaXNGdW5jdGlvbih0aGlzLnByb3BlcnR5SW5mb0NyZWF0b3JzW3R5cGVdKSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcGVydHlJbmZvQ3JlYXRvciA9IHRoaXMucHJvcGVydHlJbmZvQ3JlYXRvcnNbdHlwZV07XHJcblx0XHRcdFx0XHRcdC8vIENhbGwgdGhlIGNyZWF0b3IgZnVuY3Rpb25cclxuXHRcdFx0XHRcdFx0cHJvcGVydHlJbmZvQ3JlYXRvci5jYWxsKHRoaXMsIG1hcHBpbmcpO1xyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biBwcm9wZXJ0eSBpbmZvIHR5cGUgW1wiICsgdHlwZSArIFwiXS5cIik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRhYSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdFx0XHR0aGlzLmFkZERlZmF1bHROYW1lc3BhY2VzKG1hcHBpbmcpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzXHJcblx0XHRcdFx0XHRcdC5hZGRQcm9wZXJ0eShuZXcgdGhpcy5tYXBwaW5nU3R5bGUuYW55QXR0cmlidXRlUHJvcGVydHlJbmZvKFxyXG5cdFx0XHRcdFx0XHRcdFx0bWFwcGluZywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBwaW5nU3R5bGUgOiB0aGlzLm1hcHBpbmdTdHlsZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdFx0XHR0aGlzLmFkZERlZmF1bHROYW1lc3BhY2VzKG1hcHBpbmcpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzXHJcblx0XHRcdFx0XHRcdC5hZGRQcm9wZXJ0eShuZXcgdGhpcy5tYXBwaW5nU3R5bGUuYW55RWxlbWVudFByb3BlcnR5SW5mbyhcclxuXHRcdFx0XHRcdFx0XHRcdG1hcHBpbmcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwcGluZ1N0eWxlIDogdGhpcy5tYXBwaW5nU3R5bGVcclxuXHRcdFx0XHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdFx0XHR0aGlzLmFkZERlZmF1bHROYW1lc3BhY2VzKG1hcHBpbmcpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZFByb3BlcnR5KG5ldyB0aGlzLm1hcHBpbmdTdHlsZS5hdHRyaWJ1dGVQcm9wZXJ0eUluZm8oXHJcblx0XHRcdFx0XHRcdG1hcHBpbmcsIHtcclxuXHRcdFx0XHRcdFx0XHRtYXBwaW5nU3R5bGUgOiB0aGlzLm1hcHBpbmdTdHlsZVxyXG5cdFx0XHRcdFx0XHR9KSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGVtIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0XHRcdHRoaXMuYWRkRGVmYXVsdE5hbWVzcGFjZXMobWFwcGluZyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdFx0XHRcdFx0LmFkZFByb3BlcnR5KG5ldyB0aGlzLm1hcHBpbmdTdHlsZS5lbGVtZW50TWFwUHJvcGVydHlJbmZvKFxyXG5cdFx0XHRcdFx0XHRcdFx0bWFwcGluZywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBwaW5nU3R5bGUgOiB0aGlzLm1hcHBpbmdTdHlsZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRlIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0XHRcdHRoaXMuYWRkRGVmYXVsdE5hbWVzcGFjZXMobWFwcGluZyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkUHJvcGVydHkobmV3IHRoaXMubWFwcGluZ1N0eWxlLmVsZW1lbnRQcm9wZXJ0eUluZm8oXHJcblx0XHRcdFx0XHRcdG1hcHBpbmcsIHtcclxuXHRcdFx0XHRcdFx0XHRtYXBwaW5nU3R5bGUgOiB0aGlzLm1hcHBpbmdTdHlsZVxyXG5cdFx0XHRcdFx0XHR9KSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGVzIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0XHRcdHRoaXMuYWRkRGVmYXVsdE5hbWVzcGFjZXMobWFwcGluZyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkUHJvcGVydHkobmV3IHRoaXMubWFwcGluZ1N0eWxlLmVsZW1lbnRzUHJvcGVydHlJbmZvKFxyXG5cdFx0XHRcdFx0XHRtYXBwaW5nLCB7XHJcblx0XHRcdFx0XHRcdFx0bWFwcGluZ1N0eWxlIDogdGhpcy5tYXBwaW5nU3R5bGVcclxuXHRcdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRlciA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdFx0XHR0aGlzLmFkZERlZmF1bHROYW1lc3BhY2VzKG1hcHBpbmcpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzXHJcblx0XHRcdFx0XHRcdC5hZGRQcm9wZXJ0eShuZXcgdGhpcy5tYXBwaW5nU3R5bGUuZWxlbWVudFJlZlByb3BlcnR5SW5mbyhcclxuXHRcdFx0XHRcdFx0XHRcdG1hcHBpbmcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwcGluZ1N0eWxlIDogdGhpcy5tYXBwaW5nU3R5bGVcclxuXHRcdFx0XHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZXJzIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0XHRcdHRoaXMuYWRkRGVmYXVsdE5hbWVzcGFjZXMobWFwcGluZyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdFx0XHRcdFx0LmFkZFByb3BlcnR5KG5ldyB0aGlzLm1hcHBpbmdTdHlsZS5lbGVtZW50UmVmc1Byb3BlcnR5SW5mbyhcclxuXHRcdFx0XHRcdFx0XHRcdG1hcHBpbmcsIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0bWFwcGluZ1N0eWxlIDogdGhpcy5tYXBwaW5nU3R5bGVcclxuXHRcdFx0XHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0diA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdFx0XHR0aGlzLmFkZERlZmF1bHROYW1lc3BhY2VzKG1hcHBpbmcpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmFkZFByb3BlcnR5KG5ldyB0aGlzLm1hcHBpbmdTdHlsZS52YWx1ZVByb3BlcnR5SW5mbyhcclxuXHRcdFx0XHRcdFx0bWFwcGluZywge1xyXG5cdFx0XHRcdFx0XHRcdG1hcHBpbmdTdHlsZSA6IHRoaXMubWFwcGluZ1N0eWxlXHJcblx0XHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0YWRkRGVmYXVsdE5hbWVzcGFjZXMgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QobWFwcGluZykpIHtcclxuXHRcdFx0XHRcdGlmICghSnNvbml4LlV0aWwuVHlwZVxyXG5cdFx0XHRcdFx0XHRcdC5pc1N0cmluZyhtYXBwaW5nLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJKSkge1xyXG5cdFx0XHRcdFx0XHRtYXBwaW5nLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJID0gdGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICghSnNvbml4LlV0aWwuVHlwZVxyXG5cdFx0XHRcdFx0XHRcdC5pc1N0cmluZyhtYXBwaW5nLmRlZmF1bHRBdHRyaWJ1dGVOYW1lc3BhY2VVUkkpKSB7XHJcblx0XHRcdFx0XHRcdG1hcHBpbmcuZGVmYXVsdEF0dHJpYnV0ZU5hbWVzcGFjZVVSSSA9IHRoaXMuZGVmYXVsdEF0dHJpYnV0ZU5hbWVzcGFjZVVSSTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGFkZFByb3BlcnR5IDogZnVuY3Rpb24ocHJvcGVydHkpIHtcclxuXHRcdFx0XHR0aGlzLnByb3BlcnRpZXMucHVzaChwcm9wZXJ0eSk7XHJcblx0XHRcdFx0dGhpcy5wcm9wZXJ0aWVzTWFwW3Byb3BlcnR5Lm5hbWVdID0gcHJvcGVydHk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHRcdH0sXHJcblx0XHRcdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkNsYXNzSW5mbydcclxuXHRcdH0pO1xyXG5Kc29uaXguTW9kZWwuQ2xhc3NJbmZvLnByb3RvdHlwZS5wcm9wZXJ0eUluZm9DcmVhdG9ycyA9IHtcclxuXHRcImFhXCIgOiBKc29uaXguTW9kZWwuQ2xhc3NJbmZvLnByb3RvdHlwZS5hYSxcclxuXHRcImFueUF0dHJpYnV0ZVwiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuYWEsXHJcblx0XCJhZVwiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuYWUsXHJcblx0XCJhbnlFbGVtZW50XCIgOiBKc29uaXguTW9kZWwuQ2xhc3NJbmZvLnByb3RvdHlwZS5hZSxcclxuXHRcImFcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmEsXHJcblx0XCJhdHRyaWJ1dGVcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmEsXHJcblx0XCJlbVwiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuZW0sXHJcblx0XCJlbGVtZW50TWFwXCIgOiBKc29uaXguTW9kZWwuQ2xhc3NJbmZvLnByb3RvdHlwZS5lbSxcclxuXHRcImVcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmUsXHJcblx0XCJlbGVtZW50XCIgOiBKc29uaXguTW9kZWwuQ2xhc3NJbmZvLnByb3RvdHlwZS5lLFxyXG5cdFwiZXNcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmVzLFxyXG5cdFwiZWxlbWVudHNcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmVzLFxyXG5cdFwiZXJcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmVyLFxyXG5cdFwiZWxlbWVudFJlZlwiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuZXIsXHJcblx0XCJlcnNcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmVycyxcclxuXHRcImVsZW1lbnRSZWZzXCIgOiBKc29uaXguTW9kZWwuQ2xhc3NJbmZvLnByb3RvdHlwZS5lcnMsXHJcblx0XCJ2XCIgOiBKc29uaXguTW9kZWwuQ2xhc3NJbmZvLnByb3RvdHlwZS52LFxyXG5cdFwidmFsdWVcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLnZcclxufTtcclxuSnNvbml4Lk1vZGVsLkVudW1MZWFmSW5mbyA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuVHlwZUluZm8sIHtcclxuXHRuYW1lIDogbnVsbCxcclxuXHRiYXNlVHlwZUluZm8gOiAnU3RyaW5nJyxcclxuXHRlbnRyaWVzIDogbnVsbCxcclxuXHRrZXlzIDogbnVsbCxcclxuXHR2YWx1ZXMgOiBudWxsLFxyXG5cdGJ1aWx0IDogZmFsc2UsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5Nb2RlbC5UeXBlSW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbXSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0XHJcblx0XHR2YXIgbiA9IG1hcHBpbmcubmFtZXx8bWFwcGluZy5ufHx1bmRlZmluZWQ7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKG4pO1xyXG5cdFx0dGhpcy5uYW1lID0gbjtcclxuXHRcdFxyXG5cdFx0dmFyIGJ0aSA9IG1hcHBpbmcuYmFzZVR5cGVJbmZvfHxtYXBwaW5nLmJ0aXx8J1N0cmluZyc7XHJcblx0XHR0aGlzLmJhc2VUeXBlSW5mbyA9IGJ0aTtcclxuXHRcdFxyXG5cdFx0dmFyIHZzID0gbWFwcGluZy52YWx1ZXN8fG1hcHBpbmcudnN8fHVuZGVmaW5lZDtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVFeGlzdHModnMpO1xyXG5cdFx0aWYgKCEoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh2cykgfHwgSnNvbml4LlV0aWwuVHlwZS5pc0FycmF5KHZzKSkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbnVtIHZhbHVlcyBtdXN0IGJlIGVpdGhlciBhbiBhcnJheSBvciBhbiBvYmplY3QuJyk7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuZW50cmllcyA9IHZzO1xyXG5cdFx0fVx0XHRcclxuXHR9LFxyXG5cdGJ1aWxkIDogZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFx0aWYgKCF0aGlzLmJ1aWx0KSB7XHJcblx0XHRcdHRoaXMuYmFzZVR5cGVJbmZvID0gY29udGV4dC5yZXNvbHZlVHlwZUluZm8odGhpcy5iYXNlVHlwZUluZm8sIHRoaXMubW9kdWxlKTtcclxuXHRcdFx0dGhpcy5iYXNlVHlwZUluZm8uYnVpbGQoY29udGV4dCk7XHJcblx0XHRcdHZhciBpdGVtcyA9IHRoaXMuZW50cmllcztcclxuXHRcdFx0dmFyIGVudHJpZXMgPSB7fTtcclxuXHRcdFx0dmFyIGtleXMgPSBbXTtcclxuXHRcdFx0dmFyIHZhbHVlcyA9IFtdO1xyXG5cdFx0XHR2YXIgaW5kZXggPSAwO1xyXG5cdFx0XHR2YXIga2V5O1xyXG5cdFx0XHR2YXIgdmFsdWU7XHJcblx0XHRcdC8vIElmIHZhbHVlcyBpcyBhbiBhcnJheSwgcHJvY2VzcyBpbmRpdmlkdWFsIGl0ZW1zXHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzQXJyYXkoaXRlbXMpKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Ly8gQnVpbGQgcHJvcGVydGllcyBpbiB0aGlzIGNvbnRleHRcclxuXHRcdFx0XHRmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBpdGVtcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdHZhbHVlID0gaXRlbXNbaW5kZXhdO1xyXG5cdFx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdGtleSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0XHRpZiAoIShKc29uaXguVXRpbC5UeXBlLmlzRnVuY3Rpb24odGhpcy5iYXNlVHlwZUluZm8ucGFyc2UpKSlcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRW51bSB2YWx1ZSBpcyBwcm92aWRlZCBhcyBzdHJpbmcgYnV0IHRoZSBiYXNlIHR5cGUgWycrdGhpcy5iYXNlVHlwZUluZm8ubmFtZSsnXSBvZiB0aGUgZW51bSBpbmZvIFsnICsgdGhpcy5uYW1lICsgJ10gZG9lcyBub3QgaW1wbGVtZW50IHRoZSBwYXJzZSBtZXRob2QuJyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0Ly8gVXNpbmcgbnVsbCBhcyBpbnB1dCBzaW5jZSBpbnB1dCBpcyBub3QgYXZhaWxhYmxlXHJcblx0XHRcdFx0XHRcdHZhbHVlID0gdGhpcy5iYXNlVHlwZUluZm8ucGFyc2UodmFsdWUsIGNvbnRleHQsIG51bGwsIHRoaXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRpZiAodGhpcy5iYXNlVHlwZUluZm8uaXNJbnN0YW5jZSh2YWx1ZSwgY29udGV4dCwgdGhpcykpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIShKc29uaXguVXRpbC5UeXBlLmlzRnVuY3Rpb24odGhpcy5iYXNlVHlwZUluZm8ucHJpbnQpKSlcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1RoZSBiYXNlIHR5cGUgWycrdGhpcy5iYXNlVHlwZUluZm8ubmFtZSsnXSBvZiB0aGUgZW51bSBpbmZvIFsnICsgdGhpcy5uYW1lICsgJ10gZG9lcyBub3QgaW1wbGVtZW50IHRoZSBwcmludCBtZXRob2QsIHVuYWJsZSB0byBwcm9kdWNlIHRoZSBlbnVtIGtleSBhcyBzdHJpbmcuJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIFVzaW5nIG51bGwgYXMgb3V0cHV0IHNpbmNlIG91dHB1dCBpcyBub3QgYXZhaWxhYmxlIGF0IHRoaXMgbW9tZW50XHJcblx0XHRcdFx0XHRcdFx0a2V5ID0gdGhpcy5iYXNlVHlwZUluZm8ucHJpbnQodmFsdWUsIGNvbnRleHQsIG51bGwsIHRoaXMpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRW51bSB2YWx1ZSBbJyArIHZhbHVlICsgJ10gaXMgbm90IGFuIGluc3RhbmNlIG9mIHRoZSBlbnVtIGJhc2UgdHlwZSBbJyArIHRoaXMuYmFzZVR5cGVJbmZvLm5hbWUgKyAnXS4nKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZW50cmllc1trZXldID0gdmFsdWU7XHJcblx0XHRcdFx0XHRrZXlzW2luZGV4XSA9IGtleTtcclxuXHRcdFx0XHRcdHZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChpdGVtcykpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRmb3IgKGtleSBpbiBpdGVtcykge1xyXG5cdFx0XHRcdFx0aWYgKGl0ZW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSBpdGVtc1trZXldO1xyXG5cdFx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh2YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIShKc29uaXguVXRpbC5UeXBlLmlzRnVuY3Rpb24odGhpcy5iYXNlVHlwZUluZm8ucGFyc2UpKSlcclxuXHRcdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VudW0gdmFsdWUgaXMgcHJvdmlkZWQgYXMgc3RyaW5nIGJ1dCB0aGUgYmFzZSB0eXBlIFsnK3RoaXMuYmFzZVR5cGVJbmZvLm5hbWUrJ10gb2YgdGhlIGVudW0gaW5mbyBbJyArIHRoaXMubmFtZSArICddIGRvZXMgbm90IGltcGxlbWVudCB0aGUgcGFyc2UgbWV0aG9kLicpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHQvLyBVc2luZyBudWxsIGFzIGlucHV0IHNpbmNlIGlucHV0IGlzIG5vdCBhdmFpbGFibGVcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZSA9IHRoaXMuYmFzZVR5cGVJbmZvLnBhcnNlKHZhbHVlLCBjb250ZXh0LCBudWxsLCB0aGlzKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIXRoaXMuYmFzZVR5cGVJbmZvLmlzSW5zdGFuY2UodmFsdWUsIGNvbnRleHQsIHRoaXMpKVxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRW51bSB2YWx1ZSBbJyArIHZhbHVlICsgJ10gaXMgbm90IGFuIGluc3RhbmNlIG9mIHRoZSBlbnVtIGJhc2UgdHlwZSBbJyArIHRoaXMuYmFzZVR5cGVJbmZvLm5hbWUgKyAnXS4nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZW50cmllc1trZXldID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdGtleXNbaW5kZXhdID0ga2V5O1xyXG5cdFx0XHRcdFx0XHR2YWx1ZXNbaW5kZXhdID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdGluZGV4Kys7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcignRW51bSB2YWx1ZXMgbXVzdCBiZSBlaXRoZXIgYW4gYXJyYXkgb3IgYW4gb2JqZWN0LicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZW50cmllcyA9IGVudHJpZXM7XHJcblx0XHRcdHRoaXMua2V5cyA9IGtleXM7XHJcblx0XHRcdHRoaXMudmFsdWVzID0gdmFsdWVzO1xyXG5cdFx0XHR0aGlzLmJ1aWx0ID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHVubWFyc2hhbCA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIHRleHQgPSBpbnB1dC5nZXRFbGVtZW50VGV4dCgpO1xyXG5cdFx0cmV0dXJuIHRoaXMucGFyc2UodGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHR9LFxyXG5cdG1hcnNoYWwgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlKSkge1xyXG5cdFx0XHRvdXRwdXQud3JpdGVDaGFyYWN0ZXJzKHRoaXMucmVwcmludCh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh2YWx1ZSkgJiYgIXRoaXMuaXNJbnN0YW5jZSh2YWx1ZSwgY29udGV4dCwgc2NvcGUpKSB7XHJcblx0XHRcdC8vIFVzaW5nIG51bGwgYXMgaW5wdXQgc2luY2UgaW5wdXQgaXMgbm90IGF2YWlsYWJsZVxyXG5cdFx0XHRyZXR1cm4gdGhpcy5wcmludCh0aGlzLnBhcnNlKHZhbHVlLCBjb250ZXh0LCBudWxsLCBzY29wZSksIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnQodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMudmFsdWVzLmxlbmd0aDsgaW5kZXgrKylcclxuXHRcdHtcclxuXHRcdFx0aWYgKHRoaXMudmFsdWVzW2luZGV4XSA9PT0gdmFsdWUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5rZXlzW2luZGV4XTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHZhbHVlICsgJ10gaXMgaW52YWxpZCBmb3IgdGhlIGVudW0gdHlwZSBbJyArIHRoaXMubmFtZSArICddLicpO1xyXG5cdH0sXHJcblx0cGFyc2UgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHRpZiAodGhpcy5lbnRyaWVzLmhhc093blByb3BlcnR5KHRleHQpKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5lbnRyaWVzW3RleHRdO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIFsnICsgdGV4dCArICddIGlzIGludmFsaWQgZm9yIHRoZSBlbnVtIHR5cGUgWycgKyB0aGlzLm5hbWUgKyAnXS4nKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnZhbHVlcy5sZW5ndGg7IGluZGV4KyspXHJcblx0XHR7XHJcblx0XHRcdGlmICh0aGlzLnZhbHVlc1tpbmRleF0gPT09IHZhbHVlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBmYWxzZTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkVudW1MZWFmSW5mbydcclxufSk7XHJcbkpzb25peC5Nb2RlbC5FbGVtZW50SW5mbyA9IEpzb25peC5DbGFzcyh7XHJcblx0bW9kdWxlOiBudWxsLFx0XHRcdFxyXG5cdGVsZW1lbnROYW1lIDogbnVsbCxcclxuXHR0eXBlSW5mbyA6IG51bGwsXHJcblx0c3Vic3RpdHV0aW9uSGVhZCA6IG51bGwsXHJcblx0c2NvcGUgOiBudWxsLFxyXG5cdGJ1aWx0IDogZmFsc2UsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRcclxuXHRcdHZhciBkZW5zID0gbWFwcGluZy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSXx8bWFwcGluZy5kZW5zfHwnJztcclxuXHRcdHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgPSBkZW5zO1xyXG5cdFx0XHJcblx0XHR2YXIgZW4gPSBtYXBwaW5nLmVsZW1lbnROYW1lIHx8IG1hcHBpbmcuZW58fHVuZGVmaW5lZDtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KGVuKSkge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnROYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0KGVuKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcoZW4pO1xyXG5cdFx0XHR0aGlzLmVsZW1lbnROYW1lID0gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSwgZW4pO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR2YXIgdGkgPSBtYXBwaW5nLnR5cGVJbmZvfHxtYXBwaW5nLnRpfHwnU3RyaW5nJztcclxuXHRcdHRoaXMudHlwZUluZm8gPSB0aTtcclxuXHRcdFxyXG5cdFx0dmFyIHNoID0gbWFwcGluZy5zdWJzdGl0dXRpb25IZWFkfHxtYXBwaW5nLnNofHxudWxsO1xyXG5cdFx0dGhpcy5zdWJzdGl0dXRpb25IZWFkID0gc2g7XHJcblx0XHRcclxuXHRcdHZhciBzYyA9IG1hcHBpbmcuc2NvcGV8fG1hcHBpbmcuc2N8fG51bGw7XHJcblx0XHR0aGlzLnNjb3BlID0gc2M7XHJcblx0fSxcclxuXHRidWlsZCA6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRcdC8vIElmIGVsZW1lbnQgaW5mbyBpcyBub3QgeWV0IGJ1aWx0XHJcblx0XHRpZiAoIXRoaXMuYnVpbHQpIHtcclxuXHRcdFx0dGhpcy50eXBlSW5mbyA9IGNvbnRleHQucmVzb2x2ZVR5cGVJbmZvKHRoaXMudHlwZUluZm8sIHRoaXMubW9kdWxlKTtcclxuXHRcdFx0dGhpcy5zY29wZSA9IGNvbnRleHQucmVzb2x2ZVR5cGVJbmZvKHRoaXMuc2NvcGUsIHRoaXMubW9kdWxlKTtcclxuXHRcdFx0dGhpcy5idWlsdCA9IHRydWU7XHJcblx0XHR9XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5FbGVtZW50SW5mbydcclxufSk7XHJcbkpzb25peC5Nb2RlbC5Qcm9wZXJ0eUluZm8gPSBKc29uaXguQ2xhc3Moe1xyXG5cdG5hbWUgOiBudWxsLFxyXG5cdGNvbGxlY3Rpb24gOiBmYWxzZSxcclxuXHR0YXJnZXROYW1lc3BhY2UgOiAnJyxcclxuXHRkZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSA6ICcnLFxyXG5cdGRlZmF1bHRBdHRyaWJ1dGVOYW1lc3BhY2VVUkkgOiAnJyxcclxuXHRidWlsdCA6IGZhbHNlLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0dmFyIG4gPSBtYXBwaW5nLm5hbWUgfHwgbWFwcGluZy5uIHx8IHVuZGVmaW5lZDtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcobik7XHJcblx0XHR0aGlzLm5hbWUgPSBuO1xyXG5cdFx0dmFyIGRlbnMgPSBtYXBwaW5nLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJIHx8IG1hcHBpbmcuZGVucyB8fCBtYXBwaW5nLnRhcmdldE5hbWVzcGFjZSB8fCBtYXBwaW5nLnRucyB8fCAnJztcclxuXHRcdHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgPSBkZW5zO1xyXG5cdFx0dmFyIHRucyA9IG1hcHBpbmcudGFyZ2V0TmFtZXNwYWNlIHx8IG1hcHBpbmcudG5zIHx8IG1hcHBpbmcuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgfHwgbWFwcGluZy5kZW5zIHx8IHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkk7XHJcblx0XHR0aGlzLnRhcmdldE5hbWVzcGFjZSA9IHRucztcclxuXHRcdHZhciBkYW5zID0gbWFwcGluZy5kZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJIHx8IG1hcHBpbmcuZGFucyB8fCAnJztcclxuXHRcdHRoaXMuZGVmYXVsdEF0dHJpYnV0ZU5hbWVzcGFjZVVSSSA9IGRhbnM7XHJcblx0XHR2YXIgY29sID0gbWFwcGluZy5jb2xsZWN0aW9uIHx8IG1hcHBpbmcuY29sIHx8IGZhbHNlO1xyXG5cdFx0dGhpcy5jb2xsZWN0aW9uID0gY29sO1xyXG5cdFx0dmFyIHJxID0gbWFwcGluZy5yZXF1aXJlZCB8fCBtYXBwaW5nLnJxIHx8IGZhbHNlO1xyXG5cdFx0dGhpcy5yZXF1aXJlZCA9IHJxO1xyXG5cdFx0aWYgKHRoaXMuY29sbGVjdGlvbikge1xyXG5cdFx0XHR2YXIgbW5vO1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc051bWJlcihtYXBwaW5nLm1pbk9jY3VycykpIHtcclxuXHRcdFx0XHRtbm8gPSBtYXBwaW5nLm1pbk9jY3VycztcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKG1hcHBpbmcubW5vKSkge1xyXG5cdFx0XHRcdG1ubyA9IG1hcHBpbmcubW5vO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdG1ubyA9IDE7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5taW5PY2N1cnMgPSBtbm87XHJcblx0XHRcdHZhciBteG87XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKG1hcHBpbmcubWF4T2NjdXJzKSkge1xyXG5cdFx0XHRcdG14byA9IG1hcHBpbmcubWF4T2NjdXJzO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIobWFwcGluZy5teG8pKSB7XHJcblx0XHRcdFx0bXhvID0gbWFwcGluZy5teG87XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bXhvID0gbnVsbDtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLm1heE9jY3VycyA9IG14bztcclxuXHRcdH1cclxuXHR9LFxyXG5cdGJ1aWxkIDogZnVuY3Rpb24oY29udGV4dCwgbW9kdWxlKSB7XHJcblx0XHRpZiAoIXRoaXMuYnVpbHQpIHtcclxuXHRcdFx0dGhpcy5kb0J1aWxkKGNvbnRleHQsIG1vZHVsZSk7XHJcblx0XHRcdHRoaXMuYnVpbHQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZG9CdWlsZCA6IGZ1bmN0aW9uKGNvbnRleHQsIG1vZHVsZSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQWJzdHJhY3QgbWV0aG9kIFtkb0J1aWxkXS5cIik7XHJcblx0fSxcclxuXHRidWlsZFN0cnVjdHVyZSA6IGZ1bmN0aW9uKGNvbnRleHQsIHN0cnVjdHVyZSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQWJzdHJhY3QgbWV0aG9kIFtidWlsZFN0cnVjdHVyZV0uXCIpO1xyXG5cdH0sXHJcblx0c2V0UHJvcGVydHkgOiBmdW5jdGlvbihvYmplY3QsIHZhbHVlKSB7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUpKSB7XHJcblx0XHRcdGlmICh0aGlzLmNvbGxlY3Rpb24pIHtcclxuXHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlQXJyYXkodmFsdWUsICdDb2xsZWN0aW9uIHByb3BlcnR5IHJlcXVpcmVzIGFuIGFycmF5IHZhbHVlLicpO1xyXG5cdFx0XHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5leGlzdHMob2JqZWN0W3RoaXMubmFtZV0pKSB7XHJcblx0XHRcdFx0XHRvYmplY3RbdGhpcy5uYW1lXSA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0XHRvYmplY3RbdGhpcy5uYW1lXS5wdXNoKHZhbHVlW2luZGV4XSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvYmplY3RbdGhpcy5uYW1lXSA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5Qcm9wZXJ0eUluZm8nXHJcbn0pO1xyXG5Kc29uaXguTW9kZWwuQW55QXR0cmlidXRlUHJvcGVydHlJbmZvID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5Qcm9wZXJ0eUluZm8sIHtcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdEpzb25peC5Nb2RlbC5Qcm9wZXJ0eUluZm8ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgWyBtYXBwaW5nIF0pO1xyXG5cdH0sXHJcblx0dW5tYXJzaGFsIDogZnVuY3Rpb24oY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgYXR0cmlidXRlQ291bnQgPSBpbnB1dC5nZXRBdHRyaWJ1dGVDb3VudCgpO1xyXG5cdFx0aWYgKGF0dHJpYnV0ZUNvdW50ID09PSAwKSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHJlc3VsdCA9IHt9O1xyXG5cdFx0XHRmb3IgKCB2YXIgaW5kZXggPSAwOyBpbmRleCA8IGF0dHJpYnV0ZUNvdW50OyBpbmRleCsrKSB7XHJcblx0XHRcdFx0dmFyIHZhbHVlID0gaW5wdXQuZ2V0QXR0cmlidXRlVmFsdWUoaW5kZXgpO1xyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHZhbHVlKSkge1xyXG5cdFx0XHRcdFx0dmFyIHByb3BlcnR5TmFtZSA9IHRoaXMuY29udmVydEZyb21BdHRyaWJ1dGVOYW1lKGlucHV0LmdldEF0dHJpYnV0ZU5hbWUoaW5kZXgpLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0XHRcdFx0cmVzdWx0W3Byb3BlcnR5TmFtZV0gPSB2YWx1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdG1hcnNoYWwgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHZhbHVlKSkge1xyXG5cdFx0XHQvLyBOb3RoaW5nIHRvIGRvXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGZvciAoIHZhciBwcm9wZXJ0eU5hbWUgaW4gdmFsdWUpIHtcclxuXHRcdFx0aWYgKHZhbHVlLmhhc093blByb3BlcnR5KHByb3BlcnR5TmFtZSkpIHtcclxuXHRcdFx0XHR2YXIgcHJvcGVydHlWYWx1ZSA9IHZhbHVlW3Byb3BlcnR5TmFtZV07XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcocHJvcGVydHlWYWx1ZSkpIHtcclxuXHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVOYW1lID0gdGhpcy5jb252ZXJ0VG9BdHRyaWJ1dGVOYW1lKHByb3BlcnR5TmFtZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHRcdFx0XHRvdXRwdXQud3JpdGVBdHRyaWJ1dGUoYXR0cmlidXRlTmFtZSwgcHJvcGVydHlWYWx1ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRjb252ZXJ0RnJvbUF0dHJpYnV0ZU5hbWUgOiBmdW5jdGlvbihhdHRyaWJ1dGVOYW1lLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiBhdHRyaWJ1dGVOYW1lLmtleTtcclxuXHR9LFxyXG5cdGNvbnZlcnRUb0F0dHJpYnV0ZU5hbWUgOiBmdW5jdGlvbihwcm9wZXJ0eU5hbWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3RPclN0cmluZyhwcm9wZXJ0eU5hbWUsIGNvbnRleHQpO1xyXG5cdH0sXHJcblx0ZG9CdWlsZCA6IGZ1bmN0aW9uKGNvbnRleHQsIG1vZHVsZSlcdHtcclxuXHRcdC8vIE5vdGhpbmcgdG8gZG9cclxuXHR9LFxyXG5cdGJ1aWxkU3RydWN0dXJlIDogZnVuY3Rpb24oY29udGV4dCwgc3RydWN0dXJlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHN0cnVjdHVyZSk7XHJcblx0XHQvLyBpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc3RydWN0dXJlLmFueUF0dHJpYnV0ZSkpXHJcblx0XHQvLyB7XHJcblx0XHQvLyAvLyBUT0RPIGJldHRlciBleGNlcHRpb25cclxuXHRcdC8vIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHJ1Y3R1cmUgYWxyZWFkeSBkZWZpbmVzIGFuIGFueSBhdHRyaWJ1dGVcclxuXHRcdC8vIHByb3BlcnR5LlwiKTtcclxuXHRcdC8vIH0gZWxzZVxyXG5cdFx0Ly8ge1xyXG5cdFx0c3RydWN0dXJlLmFueUF0dHJpYnV0ZSA9IHRoaXM7XHJcblx0XHQvLyB9XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5BbnlBdHRyaWJ1dGVQcm9wZXJ0eUluZm8nXHJcbn0pO1xyXG5Kc29uaXguTW9kZWwuQW55QXR0cmlidXRlUHJvcGVydHlJbmZvLlNpbXBsaWZpZWQgPSBKc29uaXguQ2xhc3MoSnNvbml4Lk1vZGVsLkFueUF0dHJpYnV0ZVByb3BlcnR5SW5mbywge1xyXG5cdGNvbnZlcnRGcm9tQXR0cmlidXRlTmFtZSA6IGZ1bmN0aW9uKGF0dHJpYnV0ZU5hbWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSlcclxuXHR7XHJcblx0XHRyZXR1cm4gYXR0cmlidXRlTmFtZS50b0Nhbm9uaWNhbFN0cmluZyhjb250ZXh0KTtcclxuXHR9XHJcbn0pO1xyXG5cclxuSnNvbml4Lk1vZGVsLlNpbmdsZVR5cGVQcm9wZXJ0eUluZm8gPSBKc29uaXguQ2xhc3MoSnNvbml4Lk1vZGVsLlByb3BlcnR5SW5mbywge1xyXG5cdHR5cGVJbmZvIDogJ1N0cmluZycsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRKc29uaXguTW9kZWwuUHJvcGVydHlJbmZvLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFsgbWFwcGluZyBdKTtcclxuXHRcdHZhciB0aSA9IG1hcHBpbmcudHlwZUluZm8gfHwgbWFwcGluZy50aSB8fCAnU3RyaW5nJztcclxuXHRcdHRoaXMudHlwZUluZm8gPSB0aTtcclxuXHR9LFxyXG5cdGRvQnVpbGQgOiBmdW5jdGlvbihjb250ZXh0LCBtb2R1bGUpIHtcclxuXHRcdHRoaXMudHlwZUluZm8gPSBjb250ZXh0LnJlc29sdmVUeXBlSW5mbyh0aGlzLnR5cGVJbmZvLCBtb2R1bGUpO1xyXG5cdH0sXHJcblx0dW5tYXJzaGFsVmFsdWUgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wYXJzZSh2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHR9LFxyXG5cdHBhcnNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMudHlwZUluZm8ucGFyc2UodmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSk7XHJcblx0fSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy50eXBlSW5mby5yZXByaW50KHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLlNpbmdsZVR5cGVQcm9wZXJ0eUluZm8nXHJcbn0pO1xyXG5cclxuSnNvbml4Lk1vZGVsLkF0dHJpYnV0ZVByb3BlcnR5SW5mbyA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuU2luZ2xlVHlwZVByb3BlcnR5SW5mbywge1xyXG5cdGF0dHJpYnV0ZU5hbWUgOiBudWxsLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0SnNvbml4Lk1vZGVsLlNpbmdsZVR5cGVQcm9wZXJ0eUluZm8ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgWyBtYXBwaW5nIF0pO1xyXG5cdFx0dmFyIGFuID0gbWFwcGluZy5hdHRyaWJ1dGVOYW1lfHxtYXBwaW5nLmFufHx1bmRlZmluZWQ7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChhbikpIHtcclxuXHRcdFx0dGhpcy5hdHRyaWJ1dGVOYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0KGFuKTtcclxuXHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhhbikpIHtcclxuXHRcdFx0dGhpcy5hdHRyaWJ1dGVOYW1lID0gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy5kZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJLCBhbik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmF0dHJpYnV0ZU5hbWUgPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0aGlzLmRlZmF1bHRBdHRyaWJ1dGVOYW1lc3BhY2VVUkksIHRoaXMubmFtZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHR1bm1hcnNoYWwgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciBhdHRyaWJ1dGVDb3VudCA9IGlucHV0LmdldEF0dHJpYnV0ZUNvdW50KCk7XHJcblx0XHR2YXIgcmVzdWx0ID0gbnVsbDtcclxuXHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXR0cmlidXRlQ291bnQ7IGluZGV4KyspIHtcclxuXHRcdFx0dmFyIGF0dHJpYnV0ZU5hbWVLZXkgPSBpbnB1dC5nZXRBdHRyaWJ1dGVOYW1lS2V5KGluZGV4KTtcclxuXHRcdFx0aWYgKHRoaXMuYXR0cmlidXRlTmFtZS5rZXkgPT09IGF0dHJpYnV0ZU5hbWVLZXkpIHtcclxuXHRcdFx0XHR2YXIgYXR0cmlidXRlVmFsdWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGVWYWx1ZShpbmRleCk7XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcoYXR0cmlidXRlVmFsdWUpKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSB0aGlzLnVubWFyc2hhbFZhbHVlKGF0dHJpYnV0ZVZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdG1hcnNoYWwgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlKSkge1xyXG5cdFx0XHRvdXRwdXQud3JpdGVBdHRyaWJ1dGUodGhpcy5hdHRyaWJ1dGVOYW1lLCB0aGlzLnByaW50KHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSk7XHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblx0YnVpbGRTdHJ1Y3R1cmUgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3Qoc3RydWN0dXJlKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3Qoc3RydWN0dXJlLmF0dHJpYnV0ZXMpO1xyXG5cdFx0dmFyIGtleSA9IHRoaXMuYXR0cmlidXRlTmFtZS5rZXk7XHJcblx0XHQvLyBpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc3RydWN0dXJlLmF0dHJpYnV0ZXNba2V5XSkpIHtcclxuXHRcdC8vIC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0Ly8gdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0cnVjdHVyZSBhbHJlYWR5IGRlZmluZXMgYW4gYXR0cmlidXRlIGZvciB0aGUga2V5XHJcblx0XHQvLyBbXCJcclxuXHRcdC8vICsga2V5ICsgXCJdLlwiKTtcclxuXHRcdC8vIH0gZWxzZVxyXG5cdFx0Ly8ge1xyXG5cdFx0c3RydWN0dXJlLmF0dHJpYnV0ZXNba2V5XSA9IHRoaXM7XHJcblx0XHQvLyB9XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5BdHRyaWJ1dGVQcm9wZXJ0eUluZm8nXHJcbn0pO1xyXG5cclxuSnNvbml4Lk1vZGVsLlZhbHVlUHJvcGVydHlJbmZvID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5TaW5nbGVUeXBlUHJvcGVydHlJbmZvLCB7XHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRKc29uaXguTW9kZWwuU2luZ2xlVHlwZVByb3BlcnR5SW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIG1hcHBpbmcgXSk7XHJcblxyXG5cdFx0dmFyIGNkYXRhID0gbWFwcGluZy5hc0NEQVRBIHx8IG1hcHBpbmcuY2RhdGEgfHwgZmFsc2U7XHJcblx0XHR0aGlzLmFzQ0RBVEEgPSBjZGF0YTtcclxuXHR9LFxyXG5cdHVubWFyc2hhbCA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIHRleHQgPSBpbnB1dC5nZXRFbGVtZW50VGV4dCgpO1xyXG5cdFx0cmV0dXJuIHRoaXMudW5tYXJzaGFsVmFsdWUodGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHR9LFxyXG5cdG1hcnNoYWwgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZSkpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmICh0aGlzLmFzQ0RBVEEpIHtcclxuXHRcdFx0b3V0cHV0LndyaXRlQ2RhdGEodGhpcy5wcmludCh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0b3V0cHV0LndyaXRlQ2hhcmFjdGVycyh0aGlzLnByaW50KHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRidWlsZFN0cnVjdHVyZSA6IGZ1bmN0aW9uKGNvbnRleHQsIHN0cnVjdHVyZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChzdHJ1Y3R1cmUpO1xyXG5cdFx0Ly8gaWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHN0cnVjdHVyZS52YWx1ZSkpIHtcclxuXHRcdC8vIC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0Ly8gdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0cnVjdHVyZSBhbHJlYWR5IGRlZmluZXMgYSB2YWx1ZVxyXG5cdFx0Ly8gcHJvcGVydHkuXCIpO1xyXG5cdFx0Ly8gfSBlbHNlXHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc3RydWN0dXJlLmVsZW1lbnRzKSkge1xyXG5cdFx0XHQvLyBUT0RPIGJldHRlciBleGNlcHRpb25cclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0cnVjdHVyZSBhbHJlYWR5IGRlZmluZXMgZWxlbWVudCBtYXBwaW5ncywgaXQgY2Fubm90IGRlZmluZSBhIHZhbHVlIHByb3BlcnR5LlwiKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHN0cnVjdHVyZS52YWx1ZSA9IHRoaXM7XHJcblx0XHR9XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5WYWx1ZVByb3BlcnR5SW5mbydcclxufSk7XHJcblxyXG5Kc29uaXguTW9kZWwuQWJzdHJhY3RFbGVtZW50c1Byb3BlcnR5SW5mbyA9IEpzb25peC5DbGFzcyhKc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50LCBKc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5XcmFwcGVyRWxlbWVudCwgSnNvbml4Lk1vZGVsLlByb3BlcnR5SW5mbywge1xyXG5cdHdyYXBwZXJFbGVtZW50TmFtZSA6IG51bGwsXHJcblx0YWxsb3dEb20gOiBmYWxzZSxcclxuXHRhbGxvd1R5cGVkT2JqZWN0IDogdHJ1ZSxcclxuXHRtaXhlZCA6IGZhbHNlLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0SnNvbml4Lk1vZGVsLlByb3BlcnR5SW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIG1hcHBpbmcgXSk7XHJcblx0XHR2YXIgd2VuID0gbWFwcGluZy53cmFwcGVyRWxlbWVudE5hbWV8fG1hcHBpbmcud2VufHx1bmRlZmluZWQ7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh3ZW4pKSB7XHJcblx0XHRcdHRoaXMud3JhcHBlckVsZW1lbnROYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0KHdlbik7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcod2VuKSkge1xyXG5cdFx0XHR0aGlzLndyYXBwZXJFbGVtZW50TmFtZSA9IG5ldyBKc29uaXguWE1MLlFOYW1lKHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkksIHdlbik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLndyYXBwZXJFbGVtZW50TmFtZSA9IG51bGw7XHJcblx0XHR9XHJcblx0fSxcclxuXHR1bm1hcnNoYWwgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dmFyIGNhbGxiYWNrID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0aWYgKHRoYXQuY29sbGVjdGlvbikge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXN1bHQucHVzaCh2YWx1ZSk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IHZhbHVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBUT0RPIFJlcG9ydCB2YWxpZGF0aW9uIGVycm9yXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJWYWx1ZSBhbHJlYWR5IHNldC5cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSkpIHtcclxuXHRcdFx0dGhpcy51bm1hcnNoYWxXcmFwcGVyRWxlbWVudChjb250ZXh0LCBpbnB1dCwgc2NvcGUsIGNhbGxiYWNrKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMudW5tYXJzaGFsRWxlbWVudChjb250ZXh0LCBpbnB1dCwgc2NvcGUsIGNhbGxiYWNrKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRtYXJzaGFsIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlKSkge1xyXG5cdFx0XHQvLyBEbyBub3RoaW5nXHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModGhpcy53cmFwcGVyRWxlbWVudE5hbWUpKSB7XHJcblx0XHRcdG91dHB1dC53cml0ZVN0YXJ0RWxlbWVudCh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCF0aGlzLmNvbGxlY3Rpb24pIHtcclxuXHRcdFx0dGhpcy5tYXJzaGFsRWxlbWVudCh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlQXJyYXkodmFsdWUpO1xyXG5cdFx0XHQvLyBUT0RPIEV4Y2VwdGlvbiBpZiBub3QgYXJyYXlcclxuXHRcdFx0Zm9yICggdmFyIGluZGV4ID0gMDsgaW5kZXggPCB2YWx1ZS5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHR2YXIgaXRlbSA9IHZhbHVlW2luZGV4XTtcclxuXHRcdFx0XHQvLyBUT0RPIEV4Y2VwdGlvbiBpZiBpdGVtIGRvZXMgbm90IGV4aXN0XHJcblx0XHRcdFx0dGhpcy5tYXJzaGFsRWxlbWVudChpdGVtLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSkpIHtcclxuXHRcdFx0b3V0cHV0LndyaXRlRW5kRWxlbWVudCgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Y29udmVydEZyb21UeXBlZE5hbWVkVmFsdWUgOiBmdW5jdGlvbihlbGVtZW50VmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIGVsZW1lbnRWYWx1ZS52YWx1ZTtcclxuXHR9LFxyXG5cdGJ1aWxkU3RydWN0dXJlIDogZnVuY3Rpb24oY29udGV4dCwgc3RydWN0dXJlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHN0cnVjdHVyZSk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc3RydWN0dXJlLnZhbHVlKSkge1xyXG5cdFx0XHQvLyBUT0RPIGJldHRlciBleGNlcHRpb25cclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0cnVjdHVyZSBhbHJlYWR5IGRlZmluZXMgYSB2YWx1ZSBwcm9wZXJ0eS5cIik7XHJcblx0XHR9IGVsc2UgaWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhzdHJ1Y3R1cmUuZWxlbWVudHMpKSB7XHJcblx0XHRcdHN0cnVjdHVyZS5lbGVtZW50cyA9IHt9O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSkpIHtcclxuXHRcdFx0c3RydWN0dXJlLmVsZW1lbnRzW3RoaXMud3JhcHBlckVsZW1lbnROYW1lLmtleV0gPSB0aGlzO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5idWlsZFN0cnVjdHVyZUVsZW1lbnRzKGNvbnRleHQsIHN0cnVjdHVyZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRidWlsZFN0cnVjdHVyZUVsZW1lbnRzIDogZnVuY3Rpb24oY29udGV4dCwgc3RydWN0dXJlKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJBYnN0cmFjdCBtZXRob2QgW2J1aWxkU3RydWN0dXJlRWxlbWVudHNdLlwiKTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkFic3RyYWN0RWxlbWVudHNQcm9wZXJ0eUluZm8nXHJcbn0pO1xyXG5cclxuSnNvbml4Lk1vZGVsLkVsZW1lbnRQcm9wZXJ0eUluZm8gPSBKc29uaXguQ2xhc3MoSnNvbml4Lk1vZGVsLkFic3RyYWN0RWxlbWVudHNQcm9wZXJ0eUluZm8sIEpzb25peC5CaW5kaW5nLk1hcnNoYWxscy5FbGVtZW50LCB7XHJcblx0dHlwZUluZm8gOiAnU3RyaW5nJyxcclxuXHRlbGVtZW50TmFtZSA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRKc29uaXguTW9kZWwuQWJzdHJhY3RFbGVtZW50c1Byb3BlcnR5SW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIG1hcHBpbmcgXSk7XHJcblx0XHR2YXIgdGkgPSBtYXBwaW5nLnR5cGVJbmZvIHx8IG1hcHBpbmcudGkgfHwgJ1N0cmluZyc7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh0aSkpIHtcclxuXHRcdFx0dGhpcy50eXBlSW5mbyA9IHRpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0aSk7XHJcblx0XHRcdHRoaXMudHlwZUluZm8gPSB0aTtcclxuXHRcdH1cclxuXHRcdHZhciBlbiA9IG1hcHBpbmcuZWxlbWVudE5hbWUgfHwgbWFwcGluZy5lbiB8fCB1bmRlZmluZWQ7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChlbikpIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50TmFtZSA9IEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdChlbik7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcoZW4pKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudE5hbWUgPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0aGlzLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJLCBlbik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnROYW1lID0gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSwgdGhpcy5uYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldFR5cGVJbmZvQnlFbGVtZW50TmFtZSA6IGZ1bmN0aW9uKGVsZW1lbnROYW1lLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMudHlwZUluZm87XHJcblx0fSxcclxuXHRjb252ZXJ0VG9UeXBlZE5hbWVkVmFsdWUgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHtcclxuXHRcdFx0bmFtZSA6IHRoaXMuZWxlbWVudE5hbWUsXHJcblx0XHRcdHZhbHVlIDogdmFsdWUsXHJcblx0XHRcdHR5cGVJbmZvIDogdGhpcy50eXBlSW5mb1xyXG5cdFx0fTtcclxuXHR9LFxyXG5cdGRvQnVpbGQgOiBmdW5jdGlvbihjb250ZXh0LCBtb2R1bGUpIHtcclxuXHRcdHRoaXMudHlwZUluZm8gPSBjb250ZXh0LnJlc29sdmVUeXBlSW5mbyh0aGlzLnR5cGVJbmZvLCBtb2R1bGUpO1xyXG5cdH0sXHJcblx0YnVpbGRTdHJ1Y3R1cmVFbGVtZW50cyA6IGZ1bmN0aW9uKGNvbnRleHQsIHN0cnVjdHVyZSkge1xyXG5cdFx0c3RydWN0dXJlLmVsZW1lbnRzW3RoaXMuZWxlbWVudE5hbWUua2V5XSA9IHRoaXM7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5FbGVtZW50UHJvcGVydHlJbmZvJ1xyXG59KTtcclxuXHJcbkpzb25peC5Nb2RlbC5FbGVtZW50c1Byb3BlcnR5SW5mbyA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuQWJzdHJhY3RFbGVtZW50c1Byb3BlcnR5SW5mbywgSnNvbml4LkJpbmRpbmcuTWFyc2hhbGxzLkVsZW1lbnQsIHtcclxuXHRlbGVtZW50VHlwZUluZm9zIDogbnVsbCxcclxuXHRlbGVtZW50VHlwZUluZm9zTWFwIDogbnVsbCxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdEpzb25peC5Nb2RlbC5BYnN0cmFjdEVsZW1lbnRzUHJvcGVydHlJbmZvLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFsgbWFwcGluZyBdKTtcclxuXHRcdHZhciBldGlzID0gbWFwcGluZy5lbGVtZW50VHlwZUluZm9zIHx8IG1hcHBpbmcuZXRpcyB8fCBbXTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVBcnJheShldGlzKTtcclxuXHRcdHRoaXMuZWxlbWVudFR5cGVJbmZvcyA9IFtdO1xyXG5cdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGV0aXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudFR5cGVJbmZvc1tpbmRleF0gPSBKc29uaXguVXRpbC5UeXBlLmNsb25lT2JqZWN0KGV0aXNbaW5kZXhdKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldFR5cGVJbmZvQnlFbGVtZW50TmFtZSA6IGZ1bmN0aW9uKGVsZW1lbnROYW1lLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuZWxlbWVudFR5cGVJbmZvc01hcFtlbGVtZW50TmFtZS5rZXldO1xyXG5cdH0sXHJcblx0Y29udmVydFRvVHlwZWROYW1lZFZhbHVlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRUeXBlSW5mb3MubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdHZhciBlbGVtZW50VHlwZUluZm8gPSB0aGlzLmVsZW1lbnRUeXBlSW5mb3NbaW5kZXhdO1xyXG5cdFx0XHR2YXIgdHlwZUluZm8gPSBlbGVtZW50VHlwZUluZm8udHlwZUluZm87XHJcblx0XHRcdGlmICh0eXBlSW5mby5pc0luc3RhbmNlKHZhbHVlLCBjb250ZXh0LCBzY29wZSkpIHtcclxuXHRcdFx0XHR2YXIgZWxlbWVudE5hbWUgPSBlbGVtZW50VHlwZUluZm8uZWxlbWVudE5hbWU7XHJcblx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdG5hbWUgOiBlbGVtZW50TmFtZSxcclxuXHRcdFx0XHRcdHZhbHVlIDogdmFsdWUsXHJcblx0XHRcdFx0XHR0eXBlSW5mbyA6IHR5cGVJbmZvXHJcblx0XHRcdFx0fTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gSWYgeHNpOnR5cGUgaXMgc3VwcG9ydGVkXHJcblx0XHRpZiAoY29udGV4dC5zdXBwb3J0WHNpVHlwZSkge1xyXG5cdFx0XHQvLyBGaW5kIHRoZSBhY3R1YWwgdHlwZVxyXG5cdFx0XHR2YXIgYWN0dWFsVHlwZUluZm8gPSBjb250ZXh0LmdldFR5cGVJbmZvQnlWYWx1ZSh2YWx1ZSk7XHJcblx0XHRcdGlmIChhY3R1YWxUeXBlSW5mbyAmJiBhY3R1YWxUeXBlSW5mby50eXBlTmFtZSkge1xyXG5cdFx0XHRcdGZvciAodmFyIGpuZGV4ID0gMDsgam5kZXggPCB0aGlzLmVsZW1lbnRUeXBlSW5mb3MubGVuZ3RoOyBqbmRleCsrKSB7XHJcblx0XHRcdFx0XHR2YXIgZXRpID0gdGhpcy5lbGVtZW50VHlwZUluZm9zW2puZGV4XTtcclxuXHRcdFx0XHRcdHZhciB0aSA9IGV0aS50eXBlSW5mbztcclxuXHRcdFx0XHRcdC8vIFRPRE8gQ2FuIGJlIG9wdGltaXplZFxyXG5cdFx0XHRcdFx0Ly8gRmluZCBhbiBlbGVtZW50IHR5cGUgaW5mbyB3aGljaCBoYXMgYSB0eXBlIGluZm8gdGhhdCBpcyBhXHJcblx0XHRcdFx0XHQvLyBzdXBlcnR5cGUgb2YgdGhlIGFjdHVhbCB0eXBlIGluZm9cclxuXHRcdFx0XHRcdGlmIChhY3R1YWxUeXBlSW5mby5pc0Jhc2VkT24odGkpKSB7XHJcblx0XHRcdFx0XHRcdHZhciBlbiA9IGV0aS5lbGVtZW50TmFtZTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRcdFx0XHRuYW1lIDogZW4sXHJcblx0XHRcdFx0XHRcdFx0dmFsdWUgOiB2YWx1ZSxcclxuXHRcdFx0XHRcdFx0XHR0eXBlSW5mbyA6IHRpXHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBUT0RPIGhhcm1vbml6ZSBlcnJvciBoYW5kbGluZy4gU2VlIGFsc28gbWFyc2hhbGxFbGVtZW50LiBFcnJvciBtdXN0XHJcblx0XHQvLyBvbmx5IGJlIG9uIG9uZSBwbGFjZS5cclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBmaW5kIGFuIGVsZW1lbnQgd2l0aCB0eXBlIGluZm8gc3VwcG9ydGluZyB0aGUgdmFsdWUgW1wiICsgdmFsdWUgKyBcIl0uXCIpO1xyXG5cdH0sXHJcblx0ZG9CdWlsZCA6IGZ1bmN0aW9uKGNvbnRleHQsIG1vZHVsZSkge1xyXG5cdFx0dGhpcy5lbGVtZW50VHlwZUluZm9zTWFwID0ge307XHJcblx0XHR2YXIgZXRpdGksIGV0aWVuO1xyXG5cdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudFR5cGVJbmZvcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0dmFyIGVsZW1lbnRUeXBlSW5mbyA9IHRoaXMuZWxlbWVudFR5cGVJbmZvc1tpbmRleF07XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QoZWxlbWVudFR5cGVJbmZvKTtcclxuXHRcdFx0ZXRpdGkgPSBlbGVtZW50VHlwZUluZm8udHlwZUluZm8gfHwgZWxlbWVudFR5cGVJbmZvLnRpIHx8ICdTdHJpbmcnO1xyXG5cdFx0XHRlbGVtZW50VHlwZUluZm8udHlwZUluZm8gPSBjb250ZXh0LnJlc29sdmVUeXBlSW5mbyhldGl0aSwgbW9kdWxlKTtcclxuXHRcdFx0ZXRpZW4gPSBlbGVtZW50VHlwZUluZm8uZWxlbWVudE5hbWUgfHwgZWxlbWVudFR5cGVJbmZvLmVuIHx8IHVuZGVmaW5lZDtcclxuXHRcdFx0ZWxlbWVudFR5cGVJbmZvLmVsZW1lbnROYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0T3JTdHJpbmcoZXRpZW4sIGNvbnRleHQsIHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkpO1xyXG5cdFx0XHR0aGlzLmVsZW1lbnRUeXBlSW5mb3NNYXBbZWxlbWVudFR5cGVJbmZvLmVsZW1lbnROYW1lLmtleV0gPSBlbGVtZW50VHlwZUluZm8udHlwZUluZm87XHJcblx0XHR9XHJcblx0fSxcclxuXHRidWlsZFN0cnVjdHVyZUVsZW1lbnRzIDogZnVuY3Rpb24oY29udGV4dCwgc3RydWN0dXJlKSB7XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50VHlwZUluZm9zLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHR2YXIgZWxlbWVudFR5cGVJbmZvID0gdGhpcy5lbGVtZW50VHlwZUluZm9zW2luZGV4XTtcclxuXHRcdFx0c3RydWN0dXJlLmVsZW1lbnRzW2VsZW1lbnRUeXBlSW5mby5lbGVtZW50TmFtZS5rZXldID0gdGhpcztcclxuXHRcdH1cclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkVsZW1lbnRzUHJvcGVydHlJbmZvJ1xyXG59KTtcclxuXHJcbkpzb25peC5Nb2RlbC5FbGVtZW50TWFwUHJvcGVydHlJbmZvID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5BYnN0cmFjdEVsZW1lbnRzUHJvcGVydHlJbmZvLCB7XHJcblx0ZWxlbWVudE5hbWUgOiBudWxsLFxyXG5cdGtleSA6IG51bGwsXHJcblx0dmFsdWUgOiBudWxsLFxyXG5cdGVudHJ5VHlwZUluZm8gOiBudWxsLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0SnNvbml4Lk1vZGVsLkFic3RyYWN0RWxlbWVudHNQcm9wZXJ0eUluZm8ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgWyBtYXBwaW5nIF0pO1xyXG5cdFx0Ly8gVE9ETyBFbnN1cmUgY29ycmVjdCBhcmd1bWVudFxyXG5cdFx0dmFyIGsgPSBtYXBwaW5nLmtleSB8fCBtYXBwaW5nLmsgfHwgdW5kZWZpbmVkO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChrKTtcclxuXHRcdHZhciB2ID0gbWFwcGluZy52YWx1ZSB8fCBtYXBwaW5nLnYgfHwgdW5kZWZpbmVkO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdCh2KTtcclxuXHRcdC8vIFRPRE8gRW5zdXJlIGNvcnJlY3QgYXJndW1lbnRcclxuXHRcdHZhciBlbiA9IG1hcHBpbmcuZWxlbWVudE5hbWUgfHwgbWFwcGluZy5lbiB8fCB1bmRlZmluZWQ7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChlbikpIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50TmFtZSA9IEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdChlbik7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcoZW4pKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudE5hbWUgPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0aGlzLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJLCBlbik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnROYW1lID0gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSwgdGhpcy5uYW1lKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuZW50cnlUeXBlSW5mbyA9IG5ldyBKc29uaXguTW9kZWwuQ2xhc3NJbmZvKHtcclxuXHRcdFx0bmFtZSA6ICdNYXA8JyArIGsubmFtZSArICcsJyArIHYubmFtZSArICc+JyxcclxuXHRcdFx0cHJvcGVydHlJbmZvcyA6IFsgaywgdiBdXHJcblx0XHR9KTtcclxuXHJcblx0fSxcclxuXHR1bm1hcnNoYWwgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dmFyIGNhbGxiYWNrID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZSkpIHtcclxuXHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHZhbHVlLCAnTWFwIHByb3BlcnR5IHJlcXVpcmVzIGFuIG9iamVjdC4nKTtcclxuXHRcdFx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHJlc3VsdCkpIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IHt9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRmb3IgKCB2YXIgYXR0cmlidXRlTmFtZSBpbiB2YWx1ZSkge1xyXG5cdFx0XHRcdFx0aWYgKHZhbHVlLmhhc093blByb3BlcnR5KGF0dHJpYnV0ZU5hbWUpKSB7XHJcblx0XHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IHZhbHVlW2F0dHJpYnV0ZU5hbWVdO1xyXG5cdFx0XHRcdFx0XHRpZiAodGhhdC5jb2xsZWN0aW9uKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhyZXN1bHRbYXR0cmlidXRlTmFtZV0pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHRbYXR0cmlidXRlTmFtZV0gPSBbXTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0W2F0dHJpYnV0ZU5hbWVdLnB1c2goYXR0cmlidXRlVmFsdWUpO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5leGlzdHMocmVzdWx0W2F0dHJpYnV0ZU5hbWVdKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0W2F0dHJpYnV0ZU5hbWVdID0gYXR0cmlidXRlVmFsdWU7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdC8vIFRPRE8gUmVwb3J0IHZhbGlkYXRpb24gZXJyb3JcclxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlZhbHVlIHdhcyBhbHJlYWR5IHNldC5cIik7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSkpIHtcclxuXHRcdFx0dGhpcy51bm1hcnNoYWxXcmFwcGVyRWxlbWVudChjb250ZXh0LCBpbnB1dCwgc2NvcGUsIGNhbGxiYWNrKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMudW5tYXJzaGFsRWxlbWVudChjb250ZXh0LCBpbnB1dCwgc2NvcGUsIGNhbGxiYWNrKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRnZXRUeXBlSW5mb0J5SW5wdXRFbGVtZW50IDogZnVuY3Rpb24oY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbnRyeVR5cGVJbmZvO1xyXG5cdH0sXHJcblx0Y29udmVydEZyb21UeXBlZE5hbWVkVmFsdWUgOiBmdW5jdGlvbihlbGVtZW50VmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIGVudHJ5ID0gZWxlbWVudFZhbHVlLnZhbHVlO1xyXG5cdFx0dmFyIHJlc3VsdCA9IHt9O1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcoZW50cnlbdGhpcy5rZXkubmFtZV0pKSB7XHJcblx0XHRcdHJlc3VsdFtlbnRyeVt0aGlzLmtleS5uYW1lXV0gPSBlbnRyeVt0aGlzLnZhbHVlLm5hbWVdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdG1hcnNoYWwgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cclxuXHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUpKSB7XHJcblx0XHRcdC8vIERvIG5vdGhpbmdcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSkpIHtcclxuXHRcdFx0b3V0cHV0LndyaXRlU3RhcnRFbGVtZW50KHRoaXMud3JhcHBlckVsZW1lbnROYW1lKTtcclxuXHRcdH1cclxuXHJcblx0XHR0aGlzLm1hcnNoYWxFbGVtZW50KHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModGhpcy53cmFwcGVyRWxlbWVudE5hbWUpKSB7XHJcblx0XHRcdG91dHB1dC53cml0ZUVuZEVsZW1lbnQoKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdG1hcnNoYWxFbGVtZW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdGlmICghIXZhbHVlKSB7XHJcblx0XHRcdGZvciAoIHZhciBhdHRyaWJ1dGVOYW1lIGluIHZhbHVlKSB7XHJcblx0XHRcdFx0aWYgKHZhbHVlLmhhc093blByb3BlcnR5KGF0dHJpYnV0ZU5hbWUpKSB7XHJcblx0XHRcdFx0XHR2YXIgYXR0cmlidXRlVmFsdWUgPSB2YWx1ZVthdHRyaWJ1dGVOYW1lXTtcclxuXHRcdFx0XHRcdGlmICghdGhpcy5jb2xsZWN0aW9uKSB7XHJcblx0XHRcdFx0XHRcdHZhciBzaW5nbGVFbnRyeSA9IHt9O1xyXG5cdFx0XHRcdFx0XHRzaW5nbGVFbnRyeVt0aGlzLmtleS5uYW1lXSA9IGF0dHJpYnV0ZU5hbWU7XHJcblx0XHRcdFx0XHRcdHNpbmdsZUVudHJ5W3RoaXMudmFsdWUubmFtZV0gPSBhdHRyaWJ1dGVWYWx1ZTtcclxuXHRcdFx0XHRcdFx0b3V0cHV0LndyaXRlU3RhcnRFbGVtZW50KHRoaXMuZWxlbWVudE5hbWUpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLmVudHJ5VHlwZUluZm8ubWFyc2hhbChzaW5nbGVFbnRyeSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHRcdFx0XHRcdG91dHB1dC53cml0ZUVuZEVsZW1lbnQoKTtcclxuXHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXR0cmlidXRlVmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0XHRcdFx0dmFyIGNvbGxlY3Rpb25FbnRyeSA9IHt9O1xyXG5cdFx0XHRcdFx0XHRcdGNvbGxlY3Rpb25FbnRyeVt0aGlzLmtleS5uYW1lXSA9IGF0dHJpYnV0ZU5hbWU7XHJcblx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbkVudHJ5W3RoaXMudmFsdWUubmFtZV0gPSBhdHRyaWJ1dGVWYWx1ZVtpbmRleF07XHJcblx0XHRcdFx0XHRcdFx0b3V0cHV0LndyaXRlU3RhcnRFbGVtZW50KHRoaXMuZWxlbWVudE5hbWUpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuZW50cnlUeXBlSW5mby5tYXJzaGFsKGNvbGxlY3Rpb25FbnRyeSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHRcdFx0XHRcdFx0b3V0cHV0LndyaXRlRW5kRWxlbWVudCgpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRkb0J1aWxkIDogZnVuY3Rpb24oY29udGV4dCwgbW9kdWxlKSB7XHJcblx0XHR0aGlzLmVudHJ5VHlwZUluZm8uYnVpbGQoY29udGV4dCwgbW9kdWxlKTtcclxuXHRcdC8vIFRPRE8gZ2V0IHByb3BlcnR5IGJ5IG5hbWVcclxuXHRcdHRoaXMua2V5ID0gdGhpcy5lbnRyeVR5cGVJbmZvLnByb3BlcnRpZXNbMF07XHJcblx0XHR0aGlzLnZhbHVlID0gdGhpcy5lbnRyeVR5cGVJbmZvLnByb3BlcnRpZXNbMV07XHJcblx0fSxcclxuXHRidWlsZFN0cnVjdHVyZUVsZW1lbnRzIDogZnVuY3Rpb24oY29udGV4dCwgc3RydWN0dXJlKSB7XHJcblx0XHRzdHJ1Y3R1cmUuZWxlbWVudHNbdGhpcy5lbGVtZW50TmFtZS5rZXldID0gdGhpcztcclxuXHR9LFxyXG5cdHNldFByb3BlcnR5IDogZnVuY3Rpb24ob2JqZWN0LCB2YWx1ZSkge1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlKSkge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHZhbHVlLCAnTWFwIHByb3BlcnR5IHJlcXVpcmVzIGFuIG9iamVjdC4nKTtcclxuXHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhvYmplY3RbdGhpcy5uYW1lXSkpIHtcclxuXHRcdFx0XHRvYmplY3RbdGhpcy5uYW1lXSA9IHt9O1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBtYXAgPSBvYmplY3RbdGhpcy5uYW1lXTtcclxuXHRcdFx0Zm9yICggdmFyIGF0dHJpYnV0ZU5hbWUgaW4gdmFsdWUpIHtcclxuXHRcdFx0XHRpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoYXR0cmlidXRlTmFtZSkpIHtcclxuXHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IHZhbHVlW2F0dHJpYnV0ZU5hbWVdO1xyXG5cdFx0XHRcdFx0aWYgKHRoaXMuY29sbGVjdGlvbikge1xyXG5cdFx0XHRcdFx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG1hcFthdHRyaWJ1dGVOYW1lXSkpIHtcclxuXHRcdFx0XHRcdFx0XHRtYXBbYXR0cmlidXRlTmFtZV0gPSBbXTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGF0dHJpYnV0ZVZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0XHRcdG1hcFthdHRyaWJ1dGVOYW1lXS5wdXNoKGF0dHJpYnV0ZVZhbHVlW2luZGV4XSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdG1hcFthdHRyaWJ1dGVOYW1lXSA9IGF0dHJpYnV0ZVZhbHVlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuRWxlbWVudE1hcFByb3BlcnR5SW5mbydcclxufSk7XHJcblxyXG5Kc29uaXguTW9kZWwuQWJzdHJhY3RFbGVtZW50UmVmc1Byb3BlcnR5SW5mbyA9IEpzb25peC5DbGFzcyhKc29uaXguQmluZGluZy5NYXJzaGFsbHMuRWxlbWVudCwgSnNvbml4LkJpbmRpbmcuTWFyc2hhbGxzLkVsZW1lbnQuQXNFbGVtZW50UmVmLCBKc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50LCBKc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5XcmFwcGVyRWxlbWVudCwgSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbHMuRWxlbWVudC5Bc0VsZW1lbnRSZWYsIEpzb25peC5Nb2RlbC5Qcm9wZXJ0eUluZm8sIHtcclxuXHR3cmFwcGVyRWxlbWVudE5hbWUgOiBudWxsLFxyXG5cdGFsbG93RG9tIDogdHJ1ZSxcclxuXHRhbGxvd1R5cGVkT2JqZWN0IDogdHJ1ZSxcclxuXHRtaXhlZCA6IHRydWUsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZywgJ01hcHBpbmcgbXVzdCBiZSBhbiBvYmplY3QuJyk7XHJcblx0XHRKc29uaXguTW9kZWwuUHJvcGVydHlJbmZvLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFsgbWFwcGluZyBdKTtcclxuXHRcdHZhciB3ZW4gPSBtYXBwaW5nLndyYXBwZXJFbGVtZW50TmFtZSB8fCBtYXBwaW5nLndlbiB8fCB1bmRlZmluZWQ7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh3ZW4pKSB7XHJcblx0XHRcdHRoaXMud3JhcHBlckVsZW1lbnROYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0KHdlbik7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcod2VuKSkge1xyXG5cdFx0XHR0aGlzLndyYXBwZXJFbGVtZW50TmFtZSA9IG5ldyBKc29uaXguWE1MLlFOYW1lKHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkksIHdlbik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLndyYXBwZXJFbGVtZW50TmFtZSA9IG51bGw7XHJcblx0XHR9XHJcblx0XHR2YXIgZG9tID0gSnNvbml4LlV0aWwuVHlwZS5kZWZhdWx0VmFsdWUobWFwcGluZy5hbGxvd0RvbSwgbWFwcGluZy5kb20sIHRydWUpO1xyXG5cdFx0dmFyIHR5cGVkID0gSnNvbml4LlV0aWwuVHlwZS5kZWZhdWx0VmFsdWUobWFwcGluZy5hbGxvd1R5cGVkT2JqZWN0LCBtYXBwaW5nLnR5cGVkLCB0cnVlKTtcclxuXHRcdHZhciBteCA9IEpzb25peC5VdGlsLlR5cGUuZGVmYXVsdFZhbHVlKG1hcHBpbmcubWl4ZWQsIG1hcHBpbmcubXgsIHRydWUpO1xyXG5cdFx0dGhpcy5hbGxvd0RvbSA9IGRvbTtcclxuXHRcdHRoaXMuYWxsb3dUeXBlZE9iamVjdCA9IHR5cGVkO1xyXG5cdFx0dGhpcy5taXhlZCA9IG14O1xyXG5cdH0sXHJcblx0dW5tYXJzaGFsIDogZnVuY3Rpb24oY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gbnVsbDtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGlmICh0aGF0LmNvbGxlY3Rpb24pIHtcclxuXHRcdFx0XHRpZiAocmVzdWx0ID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVzdWx0LnB1c2godmFsdWUpO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAocmVzdWx0ID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSB2YWx1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gVE9ETyBSZXBvcnQgdmFsaWRhdGlvbiBlcnJvclxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVmFsdWUgYWxyZWFkeSBzZXQuXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZXQgPSBpbnB1dC5ldmVudFR5cGU7XHJcblx0XHRpZiAoZXQgPT09IEpzb25peC5YTUwuSW5wdXQuU1RBUlRfRUxFTUVOVCkge1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModGhpcy53cmFwcGVyRWxlbWVudE5hbWUpKSB7XHJcblx0XHRcdFx0dGhpcy51bm1hcnNoYWxXcmFwcGVyRWxlbWVudChjb250ZXh0LCBpbnB1dCwgc2NvcGUsIGNhbGxiYWNrKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnVubWFyc2hhbEVsZW1lbnQoY29udGV4dCwgaW5wdXQsIHNjb3BlLCBjYWxsYmFjayk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5taXhlZCAmJiAoZXQgPT09IEpzb25peC5YTUwuSW5wdXQuQ0hBUkFDVEVSUyB8fCBldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5DREFUQSB8fCBldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5FTlRJVFlfUkVGRVJFTkNFKSkge1xyXG5cdFx0XHRjYWxsYmFjayhpbnB1dC5nZXRUZXh0KCkpO1xyXG5cdFx0fSBlbHNlIGlmIChldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5TUEFDRSB8fCBldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5DT01NRU5UIHx8IGV0ID09PSBKc29uaXguWE1MLklucHV0LlBST0NFU1NJTkdfSU5TVFJVQ1RJT04pIHtcclxuXHRcdFx0Ly8gU2tpcCB3aGl0ZXNwYWNlXHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBUT0RPIGJldHRlciBleGNlcHRpb25cclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSWxsZWdhbCBzdGF0ZTogdW5leHBlY3RlZCBldmVudCB0eXBlIFtcIiArIGV0ICsgXCJdLlwiKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRtYXJzaGFsIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUpKSB7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSkpIHtcclxuXHRcdFx0XHRvdXRwdXQud3JpdGVTdGFydEVsZW1lbnQodGhpcy53cmFwcGVyRWxlbWVudE5hbWUpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoIXRoaXMuY29sbGVjdGlvbikge1xyXG5cdFx0XHRcdHRoaXMubWFyc2hhbEl0ZW0odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVBcnJheSh2YWx1ZSwgJ0NvbGxlY3Rpb24gcHJvcGVydHkgcmVxdWlyZXMgYW4gYXJyYXkgdmFsdWUuJyk7XHJcblx0XHRcdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0dmFyIGl0ZW0gPSB2YWx1ZVtpbmRleF07XHJcblx0XHRcdFx0XHR0aGlzLm1hcnNoYWxJdGVtKGl0ZW0sIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMud3JhcHBlckVsZW1lbnROYW1lKSkge1xyXG5cdFx0XHRcdG91dHB1dC53cml0ZUVuZEVsZW1lbnQoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHR9LFxyXG5cdG1hcnNoYWxJdGVtIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHZhbHVlKSkge1xyXG5cdFx0XHRpZiAoIXRoaXMubWl4ZWQpIHtcclxuXHRcdFx0XHQvLyBUT0RPXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUHJvcGVydHkgaXMgbm90IG1peGVkLCBjYW4ndCBoYW5kbGUgc3RyaW5nIHZhbHVlcy5cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0b3V0cHV0LndyaXRlQ2hhcmFjdGVycyh2YWx1ZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5hbGxvd0RvbSAmJiBKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5ub2RlVHlwZSkpIHtcclxuXHRcdFx0Ly8gRE9NIG5vZGVcclxuXHRcdFx0b3V0cHV0LndyaXRlTm9kZSh2YWx1ZSk7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QodmFsdWUpKSB7XHJcblx0XHRcdHRoaXMubWFyc2hhbEVsZW1lbnQodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICh0aGlzLm1peGVkKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgY29udGVudCB0eXBlLCBlaXRoZXIgb2JqZWN0cyBvciBzdHJpbmdzIGFyZSBzdXBwb3J0ZWQuXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVuc3VwcG9ydGVkIGNvbnRlbnQgdHlwZSwgb25seSBvYmplY3RzIGFyZSBzdXBwb3J0ZWQuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblx0Z2V0VHlwZUluZm9CeUVsZW1lbnROYW1lIDogZnVuY3Rpb24oZWxlbWVudE5hbWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHR2YXIgcHJvcGVydHlFbGVtZW50VHlwZUluZm8gPSB0aGlzLmdldFByb3BlcnR5RWxlbWVudFR5cGVJbmZvKGVsZW1lbnROYW1lLCBjb250ZXh0KTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhwcm9wZXJ0eUVsZW1lbnRUeXBlSW5mbykpIHtcclxuXHRcdFx0cmV0dXJuIHByb3BlcnR5RWxlbWVudFR5cGVJbmZvLnR5cGVJbmZvO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGNvbnRleHRFbGVtZW50VHlwZUluZm8gPSBjb250ZXh0LmdldEVsZW1lbnRJbmZvKGVsZW1lbnROYW1lLCBzY29wZSk7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhjb250ZXh0RWxlbWVudFR5cGVJbmZvKSkge1xyXG5cdFx0XHRcdHJldHVybiBjb250ZXh0RWxlbWVudFR5cGVJbmZvLnR5cGVJbmZvO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldFByb3BlcnR5RWxlbWVudFR5cGVJbmZvIDogZnVuY3Rpb24oZWxlbWVudE5hbWUsIGNvbnRleHQpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkFic3RyYWN0IG1ldGhvZCBbZ2V0UHJvcGVydHlFbGVtZW50VHlwZUluZm9dLlwiKTtcclxuXHR9LFxyXG5cdGJ1aWxkU3RydWN0dXJlIDogZnVuY3Rpb24oY29udGV4dCwgc3RydWN0dXJlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHN0cnVjdHVyZSk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc3RydWN0dXJlLnZhbHVlKSkge1xyXG5cdFx0XHQvLyBUT0RPIGJldHRlciBleGNlcHRpb25cclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0cnVjdHVyZSBhbHJlYWR5IGRlZmluZXMgYSB2YWx1ZSBwcm9wZXJ0eS5cIik7XHJcblx0XHR9IGVsc2UgaWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhzdHJ1Y3R1cmUuZWxlbWVudHMpKSB7XHJcblx0XHRcdHN0cnVjdHVyZS5lbGVtZW50cyA9IHt9O1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSkpIHtcclxuXHRcdFx0c3RydWN0dXJlLmVsZW1lbnRzW3RoaXMud3JhcHBlckVsZW1lbnROYW1lLmtleV0gPSB0aGlzO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5idWlsZFN0cnVjdHVyZUVsZW1lbnRzKGNvbnRleHQsIHN0cnVjdHVyZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0Ly8gaWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHN0cnVjdHVyZS5lbGVtZW50c1trZXldKSlcclxuXHRcdC8vIHtcclxuXHRcdC8vIC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0Ly8gdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0cnVjdHVyZSBhbHJlYWR5IGRlZmluZXMgYW4gZWxlbWVudCBmb3JcclxuXHRcdC8vIHRoZSBrZXkgW1wiXHJcblx0XHQvLyArIGtleSArIFwiXS5cIik7XHJcblx0XHQvLyB9IGVsc2VcclxuXHRcdC8vIHtcclxuXHRcdC8vIHN0cnVjdHVyZS5lbGVtZW50c1trZXldID0gdGhpcztcclxuXHRcdC8vIH1cclxuXHJcblx0XHRpZiAoKHRoaXMuYWxsb3dEb20gfHwgdGhpcy5hbGxvd1R5cGVkT2JqZWN0KSkge1xyXG5cdFx0XHRzdHJ1Y3R1cmUuYW55ID0gdGhpcztcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLm1peGVkICYmICFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSkpIHtcclxuXHRcdFx0Ly8gaWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHN0cnVjdHVyZS5taXhlZCkpIHtcclxuXHRcdFx0Ly8gLy8gVE9ETyBiZXR0ZXIgZXhjZXB0aW9uXHJcblx0XHRcdC8vIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHJ1Y3R1cmUgYWxyZWFkeSBkZWZpbmVzIHRoZSBtaXhlZFxyXG5cdFx0XHQvLyBwcm9wZXJ0eS5cIik7XHJcblx0XHRcdC8vIH0gZWxzZVxyXG5cdFx0XHQvLyB7XHJcblx0XHRcdHN0cnVjdHVyZS5taXhlZCA9IHRoaXM7XHJcblx0XHRcdC8vIH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGJ1aWxkU3RydWN0dXJlRWxlbWVudHMgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkFic3RyYWN0IG1ldGhvZCBbYnVpbGRTdHJ1Y3R1cmVFbGVtZW50c10uXCIpO1xyXG5cdH0sXHJcblx0YnVpbGRTdHJ1Y3R1cmVFbGVtZW50VHlwZUluZm9zIDogZnVuY3Rpb24oY29udGV4dCwgc3RydWN0dXJlLCBlbGVtZW50VHlwZUluZm8pIHtcclxuXHRcdHN0cnVjdHVyZS5lbGVtZW50c1tlbGVtZW50VHlwZUluZm8uZWxlbWVudE5hbWUua2V5XSA9IHRoaXM7XHJcblx0XHR2YXIgc3Vic3RpdHV0aW9uTWVtYmVycyA9IGNvbnRleHQuZ2V0U3Vic3RpdHV0aW9uTWVtYmVycyhlbGVtZW50VHlwZUluZm8uZWxlbWVudE5hbWUpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNBcnJheShzdWJzdGl0dXRpb25NZW1iZXJzKSkge1xyXG5cdFx0XHRmb3IgKHZhciBqbmRleCA9IDA7IGpuZGV4IDwgc3Vic3RpdHV0aW9uTWVtYmVycy5sZW5ndGg7IGpuZGV4KyspIHtcclxuXHRcdFx0XHR2YXIgc3Vic3RpdHV0aW9uRWxlbWVudEluZm8gPSBzdWJzdGl0dXRpb25NZW1iZXJzW2puZGV4XTtcclxuXHRcdFx0XHR0aGlzLmJ1aWxkU3RydWN0dXJlRWxlbWVudFR5cGVJbmZvcyhjb250ZXh0LCBzdHJ1Y3R1cmUsIHN1YnN0aXR1dGlvbkVsZW1lbnRJbmZvKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1cclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkFic3RyYWN0RWxlbWVudFJlZnNQcm9wZXJ0eUluZm8nXHJcbn0pO1xyXG5Kc29uaXguTW9kZWwuRWxlbWVudFJlZlByb3BlcnR5SW5mbyA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuQWJzdHJhY3RFbGVtZW50UmVmc1Byb3BlcnR5SW5mbywge1xyXG5cdHR5cGVJbmZvIDogJ1N0cmluZycsXHJcblx0ZWxlbWVudE5hbWUgOiBudWxsLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0SnNvbml4Lk1vZGVsLkFic3RyYWN0RWxlbWVudFJlZnNQcm9wZXJ0eUluZm8ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgWyBtYXBwaW5nIF0pO1xyXG5cdFx0Ly8gVE9ETyBFbnN1cmUgY29ycmVjdCBhcmd1bWVudFxyXG5cdFx0dmFyIHRpID0gbWFwcGluZy50eXBlSW5mbyB8fCBtYXBwaW5nLnRpIHx8ICdTdHJpbmcnO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QodGkpKSB7XHJcblx0XHRcdHRoaXMudHlwZUluZm8gPSB0aTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGkpO1xyXG5cdFx0XHR0aGlzLnR5cGVJbmZvID0gdGk7XHJcblx0XHR9XHJcblx0XHR2YXIgZW4gPSBtYXBwaW5nLmVsZW1lbnROYW1lIHx8IG1hcHBpbmcuZW4gfHwgdW5kZWZpbmVkO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QoZW4pKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudE5hbWUgPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3QoZW4pO1xyXG5cdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKGVuKSkge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnROYW1lID0gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSwgZW4pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50TmFtZSA9IG5ldyBKc29uaXguWE1MLlFOYW1lKHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkksIHRoaXMubmFtZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRQcm9wZXJ0eUVsZW1lbnRUeXBlSW5mbyA6IGZ1bmN0aW9uKGVsZW1lbnROYW1lLCBjb250ZXh0KSB7XHJcblx0XHR2YXIgbmFtZSA9IEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdE9yU3RyaW5nKGVsZW1lbnROYW1lLCBjb250ZXh0KTtcclxuXHJcblx0XHRpZiAobmFtZS5rZXkgPT09IHRoaXMuZWxlbWVudE5hbWUua2V5KSB7XHJcblx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0fSxcclxuXHRkb0J1aWxkIDogZnVuY3Rpb24oY29udGV4dCwgbW9kdWxlKSB7XHJcblx0XHR0aGlzLnR5cGVJbmZvID0gY29udGV4dC5yZXNvbHZlVHlwZUluZm8odGhpcy50eXBlSW5mbywgbW9kdWxlKTtcclxuXHR9LFxyXG5cdGJ1aWxkU3RydWN0dXJlRWxlbWVudHMgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdHRoaXMuYnVpbGRTdHJ1Y3R1cmVFbGVtZW50VHlwZUluZm9zKGNvbnRleHQsIHN0cnVjdHVyZSwgdGhpcyk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5FbGVtZW50UmVmUHJvcGVydHlJbmZvJ1xyXG59KTtcclxuSnNvbml4Lk1vZGVsLkVsZW1lbnRSZWZQcm9wZXJ0eUluZm8uU2ltcGxpZmllZCA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuRWxlbWVudFJlZlByb3BlcnR5SW5mbywgSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbHMuRWxlbWVudC5Bc1NpbXBsaWZpZWRFbGVtZW50UmVmLCB7XHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuRWxlbWVudFJlZlByb3BlcnR5SW5mby5TaW1wbGlmaWVkJ1xyXG59KTtcclxuSnNvbml4Lk1vZGVsLkVsZW1lbnRSZWZzUHJvcGVydHlJbmZvID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5BYnN0cmFjdEVsZW1lbnRSZWZzUHJvcGVydHlJbmZvLCB7XHJcblx0ZWxlbWVudFR5cGVJbmZvcyA6IG51bGwsXHJcblx0ZWxlbWVudFR5cGVJbmZvc01hcCA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRKc29uaXguTW9kZWwuQWJzdHJhY3RFbGVtZW50UmVmc1Byb3BlcnR5SW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIG1hcHBpbmcgXSk7XHJcblx0XHQvLyBUT0RPIEVuc3VyZSBjb3JyZWN0IGFyZ3VtZW50c1xyXG5cdFx0dmFyIGV0aXMgPSBtYXBwaW5nLmVsZW1lbnRUeXBlSW5mb3MgfHwgbWFwcGluZy5ldGlzIHx8IFtdO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUFycmF5KGV0aXMpO1xyXG5cdFx0dGhpcy5lbGVtZW50VHlwZUluZm9zID0gW107XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgZXRpcy5sZW5ndGg7IGluZGV4KyspXHJcblx0XHR7XHJcblx0XHRcdHRoaXMuZWxlbWVudFR5cGVJbmZvc1tpbmRleF0gPSBKc29uaXguVXRpbC5UeXBlLmNsb25lT2JqZWN0KGV0aXNbaW5kZXhdKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldFByb3BlcnR5RWxlbWVudFR5cGVJbmZvIDogZnVuY3Rpb24oZWxlbWVudE5hbWUsIGNvbnRleHQpIHtcclxuXHRcdHZhciBuYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0T3JTdHJpbmcoZWxlbWVudE5hbWUsIGNvbnRleHQpO1xyXG5cclxuXHRcdHZhciB0eXBlSW5mbyA9IHRoaXMuZWxlbWVudFR5cGVJbmZvc01hcFtuYW1lLmtleV07XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModHlwZUluZm8pKSB7XHJcblx0XHRcdHJldHVybiB7XHJcblx0XHRcdFx0ZWxlbWVudE5hbWUgOiBuYW1lLFxyXG5cdFx0XHRcdHR5cGVJbmZvIDogdHlwZUluZm9cclxuXHRcdFx0fTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZG9CdWlsZCA6IGZ1bmN0aW9uKGNvbnRleHQsIG1vZHVsZSkge1xyXG5cdFx0dGhpcy5lbGVtZW50VHlwZUluZm9zTWFwID0ge307XHJcblx0XHR2YXIgZXRpdGksIGV0aWVuO1xyXG5cdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudFR5cGVJbmZvcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0dmFyIGVsZW1lbnRUeXBlSW5mbyA9IHRoaXMuZWxlbWVudFR5cGVJbmZvc1tpbmRleF07XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QoZWxlbWVudFR5cGVJbmZvKTtcclxuXHRcdFx0ZXRpdGkgPSBlbGVtZW50VHlwZUluZm8udHlwZUluZm8gfHwgZWxlbWVudFR5cGVJbmZvLnRpIHx8ICdTdHJpbmcnO1xyXG5cdFx0XHRlbGVtZW50VHlwZUluZm8udHlwZUluZm8gPSBjb250ZXh0LnJlc29sdmVUeXBlSW5mbyhldGl0aSwgbW9kdWxlKTtcclxuXHRcdFx0ZXRpZW4gPSBlbGVtZW50VHlwZUluZm8uZWxlbWVudE5hbWUgfHwgZWxlbWVudFR5cGVJbmZvLmVuIHx8IHVuZGVmaW5lZDtcclxuXHRcdFx0ZWxlbWVudFR5cGVJbmZvLmVsZW1lbnROYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0T3JTdHJpbmcoZXRpZW4sIGNvbnRleHQsIHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkpO1xyXG5cdFx0XHR0aGlzLmVsZW1lbnRUeXBlSW5mb3NNYXBbZWxlbWVudFR5cGVJbmZvLmVsZW1lbnROYW1lLmtleV0gPSBlbGVtZW50VHlwZUluZm8udHlwZUluZm87XHJcblx0XHR9XHJcblx0fSxcclxuXHRidWlsZFN0cnVjdHVyZUVsZW1lbnRzIDogZnVuY3Rpb24oY29udGV4dCwgc3RydWN0dXJlKSB7XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50VHlwZUluZm9zLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHR2YXIgZWxlbWVudFR5cGVJbmZvID0gdGhpcy5lbGVtZW50VHlwZUluZm9zW2luZGV4XTtcclxuXHRcdFx0dGhpcy5idWlsZFN0cnVjdHVyZUVsZW1lbnRUeXBlSW5mb3MoY29udGV4dCwgc3RydWN0dXJlLCBlbGVtZW50VHlwZUluZm8pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuRWxlbWVudFJlZnNQcm9wZXJ0eUluZm8nXHJcbn0pO1xyXG5Kc29uaXguTW9kZWwuRWxlbWVudFJlZnNQcm9wZXJ0eUluZm8uU2ltcGxpZmllZCA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuRWxlbWVudFJlZnNQcm9wZXJ0eUluZm8sIEpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxzLkVsZW1lbnQuQXNTaW1wbGlmaWVkRWxlbWVudFJlZiwge1xyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkVsZW1lbnRSZWZzUHJvcGVydHlJbmZvLlNpbXBsaWZpZWQnXHJcbn0pO1xyXG5cclxuSnNvbml4Lk1vZGVsLkFueUVsZW1lbnRQcm9wZXJ0eUluZm8gPSBKc29uaXguQ2xhc3MoSnNvbml4LkJpbmRpbmcuTWFyc2hhbGxzLkVsZW1lbnQsIEpzb25peC5CaW5kaW5nLk1hcnNoYWxscy5FbGVtZW50LkFzRWxlbWVudFJlZiwgSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbHMuRWxlbWVudCwgSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbHMuRWxlbWVudC5Bc0VsZW1lbnRSZWYsIEpzb25peC5Nb2RlbC5Qcm9wZXJ0eUluZm8sIHtcclxuXHRhbGxvd0RvbSA6IHRydWUsXHJcblx0YWxsb3dUeXBlZE9iamVjdCA6IHRydWUsXHJcblx0bWl4ZWQgOiB0cnVlLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0SnNvbml4Lk1vZGVsLlByb3BlcnR5SW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIG1hcHBpbmcgXSk7XHJcblx0XHR2YXIgZG9tID0gSnNvbml4LlV0aWwuVHlwZS5kZWZhdWx0VmFsdWUobWFwcGluZy5hbGxvd0RvbSwgbWFwcGluZy5kb20sIHRydWUpO1xyXG5cdFx0dmFyIHR5cGVkID0gSnNvbml4LlV0aWwuVHlwZS5kZWZhdWx0VmFsdWUobWFwcGluZy5hbGxvd1R5cGVkT2JqZWN0LCBtYXBwaW5nLnR5cGVkLCB0cnVlKTtcclxuXHRcdHZhciBteCA9IEpzb25peC5VdGlsLlR5cGUuZGVmYXVsdFZhbHVlKG1hcHBpbmcubWl4ZWQsIG1hcHBpbmcubXgsIHRydWUpO1xyXG5cdFx0dGhpcy5hbGxvd0RvbSA9IGRvbTtcclxuXHRcdHRoaXMuYWxsb3dUeXBlZE9iamVjdCA9IHR5cGVkO1xyXG5cdFx0dGhpcy5taXhlZCA9IG14O1xyXG5cdH0sXHJcblx0dW5tYXJzaGFsIDogZnVuY3Rpb24oY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgcmVzdWx0ID0gbnVsbDtcclxuXHRcdHZhciB0aGF0ID0gdGhpcztcclxuXHRcdHZhciBjYWxsYmFjayA9IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRcdGlmICh0aGF0LmNvbGxlY3Rpb24pIHtcclxuXHRcdFx0XHRpZiAocmVzdWx0ID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSBbXTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVzdWx0LnB1c2godmFsdWUpO1xyXG5cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAocmVzdWx0ID09PSBudWxsKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSB2YWx1ZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Ly8gVE9ETyBSZXBvcnQgdmFsaWRhdGlvbiBlcnJvclxyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVmFsdWUgYWxyZWFkeSBzZXQuXCIpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgZXQgPSBpbnB1dC5ldmVudFR5cGU7XHJcblx0XHRpZiAoZXQgPT09IEpzb25peC5YTUwuSW5wdXQuU1RBUlRfRUxFTUVOVCkge1xyXG5cdFx0XHR0aGlzLnVubWFyc2hhbEVsZW1lbnQoY29udGV4dCwgaW5wdXQsIHNjb3BlLCBjYWxsYmFjayk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMubWl4ZWQgJiYgKGV0ID09PSBKc29uaXguWE1MLklucHV0LkNIQVJBQ1RFUlMgfHwgZXQgPT09IEpzb25peC5YTUwuSW5wdXQuQ0RBVEEgfHwgZXQgPT09IEpzb25peC5YTUwuSW5wdXQuRU5USVRZX1JFRkVSRU5DRSkpIHtcclxuXHRcdFx0Y2FsbGJhY2soaW5wdXQuZ2V0VGV4dCgpKTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5taXhlZCAmJiAoZXQgPT09IEpzb25peC5YTUwuSW5wdXQuU1BBQ0UpKSB7XHJcblx0XHRcdC8vIFdoaXRlc3BhY2VcclxuXHRcdFx0Ly8gcmV0dXJuIG51bGw7XHJcblx0XHR9IGVsc2UgaWYgKGV0ID09PSBKc29uaXguWE1MLklucHV0LkNPTU1FTlQgfHwgZXQgPT09IEpzb25peC5YTUwuSW5wdXQuUFJPQ0VTU0lOR19JTlNUUlVDVElPTikge1xyXG5cdFx0XHQvLyByZXR1cm4gbnVsbDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHN0YXRlOiB1bmV4cGVjdGVkIGV2ZW50IHR5cGUgW1wiICsgZXQgKyBcIl0uXCIpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRtYXJzaGFsIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUpKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGlmICghdGhpcy5jb2xsZWN0aW9uKSB7XHJcblx0XHRcdHRoaXMubWFyc2hhbEl0ZW0odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUFycmF5KHZhbHVlKTtcclxuXHRcdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdHRoaXMubWFyc2hhbEl0ZW0odmFsdWVbaW5kZXhdLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0bWFyc2hhbEl0ZW0gOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0aWYgKHRoaXMubWl4ZWQgJiYgSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh2YWx1ZSkpIHtcclxuXHRcdFx0Ly8gTWl4ZWRcclxuXHRcdFx0b3V0cHV0LndyaXRlQ2hhcmFjdGVycyh2YWx1ZSk7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuYWxsb3dEb20gJiYgSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUubm9kZVR5cGUpKSB7XHJcblx0XHRcdC8vIERPTSBub2RlXHJcblx0XHRcdG91dHB1dC53cml0ZU5vZGUodmFsdWUpO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICh0aGlzLmFsbG93VHlwZWRPYmplY3QpIHtcclxuXHRcdFx0XHR0aGlzLm1hcnNoYWxFbGVtZW50KHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZG9CdWlsZCA6IGZ1bmN0aW9uKGNvbnRleHQsIG1vZHVsZSkge1xyXG5cdFx0Ly8gTm90aGluZyB0byBkb1xyXG5cdH0sXHJcblx0YnVpbGRTdHJ1Y3R1cmUgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3Qoc3RydWN0dXJlKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhzdHJ1Y3R1cmUudmFsdWUpKSB7XHJcblx0XHRcdC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3RydWN0dXJlIGFscmVhZHkgZGVmaW5lcyBhIHZhbHVlIHByb3BlcnR5LlwiKTtcclxuXHRcdH0gZWxzZSBpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHN0cnVjdHVyZS5lbGVtZW50cykpIHtcclxuXHRcdFx0c3RydWN0dXJlLmVsZW1lbnRzID0ge307XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKCh0aGlzLmFsbG93RG9tIHx8IHRoaXMuYWxsb3dUeXBlZE9iamVjdCkpIHtcclxuXHRcdFx0Ly8gaWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHN0cnVjdHVyZS5hbnkpKSB7XHJcblx0XHRcdC8vIC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0XHQvLyB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3RydWN0dXJlIGFscmVhZHkgZGVmaW5lcyB0aGUgYW55XHJcblx0XHRcdC8vIHByb3BlcnR5LlwiKTtcclxuXHRcdFx0Ly8gfSBlbHNlXHJcblx0XHRcdC8vIHtcclxuXHRcdFx0c3RydWN0dXJlLmFueSA9IHRoaXM7XHJcblx0XHRcdC8vIH1cclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLm1peGVkKSB7XHJcblx0XHRcdC8vIGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhzdHJ1Y3R1cmUubWl4ZWQpKSB7XHJcblx0XHRcdC8vIC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0XHQvLyB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3RydWN0dXJlIGFscmVhZHkgZGVmaW5lcyB0aGUgbWl4ZWRcclxuXHRcdFx0Ly8gcHJvcGVydHkuXCIpO1xyXG5cdFx0XHQvLyB9IGVsc2VcclxuXHRcdFx0Ly8ge1xyXG5cdFx0XHRzdHJ1Y3R1cmUubWl4ZWQgPSB0aGlzO1xyXG5cdFx0XHQvLyB9XHJcblx0XHR9XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5BbnlFbGVtZW50UHJvcGVydHlJbmZvJ1xyXG59KTtcclxuSnNvbml4Lk1vZGVsLkFueUVsZW1lbnRQcm9wZXJ0eUluZm8uU2ltcGxpZmllZCA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuQW55RWxlbWVudFByb3BlcnR5SW5mbywgSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbHMuRWxlbWVudC5Bc1NpbXBsaWZpZWRFbGVtZW50UmVmLCB7XHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuQW55RWxlbWVudFByb3BlcnR5SW5mby5TaW1wbGlmaWVkJ1xyXG59KTtcclxuSnNvbml4Lk1vZGVsLk1vZHVsZSA9IEpzb25peC5DbGFzcyhKc29uaXguTWFwcGluZy5TdHlsZWQsIHtcclxuXHRuYW1lIDogbnVsbCxcclxuXHR0eXBlSW5mb3MgOiBudWxsLFxyXG5cdGVsZW1lbnRJbmZvcyA6IG51bGwsXHJcblx0dGFyZ2V0TmFtZXNwYWNlIDogJycsXHJcblx0ZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgOiAnJyxcclxuXHRkZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJIDogJycsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcsIG9wdGlvbnMpIHtcclxuXHRcdEpzb25peC5NYXBwaW5nLlN0eWxlZC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIG9wdGlvbnMgXSk7XHJcblx0XHR0aGlzLnR5cGVJbmZvcyA9IFtdO1xyXG5cdFx0dGhpcy5lbGVtZW50SW5mb3MgPSBbXTtcclxuXHRcdGlmICh0eXBlb2YgbWFwcGluZyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdFx0dmFyIG4gPSBtYXBwaW5nLm5hbWUgfHwgbWFwcGluZy5uIHx8IG51bGw7XHJcblx0XHRcdHRoaXMubmFtZSA9IG47XHJcblx0XHRcdHZhciBkZW5zID0gbWFwcGluZy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSB8fCBtYXBwaW5nLmRlbnMgfHwgbWFwcGluZy50YXJnZXROYW1lc3BhY2UgfHwgbWFwcGluZy50bnMgfHwgJyc7XHJcblx0XHRcdHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgPSBkZW5zO1xyXG5cdFx0XHR2YXIgdG5zID0gbWFwcGluZy50YXJnZXROYW1lc3BhY2UgfHwgbWFwcGluZy50bnMgfHwgbWFwcGluZy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSB8fCBtYXBwaW5nLmRlbnMgfHwgdGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSTtcclxuXHRcdFx0dGhpcy50YXJnZXROYW1lc3BhY2UgPSB0bnM7XHJcblx0XHRcdHZhciBkYW5zID0gbWFwcGluZy5kZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJIHx8IG1hcHBpbmcuZGFucyB8fCAnJztcclxuXHRcdFx0dGhpcy5kZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJID0gZGFucztcclxuXHRcdFx0Ly8gSW5pdGlhbGl6ZSB0eXBlIGluZm9zXHJcblx0XHRcdHZhciB0aXMgPSBtYXBwaW5nLnR5cGVJbmZvcyB8fCBtYXBwaW5nLnRpcyB8fCBbXTtcclxuXHRcdFx0dGhpcy5pbml0aWFsaXplVHlwZUluZm9zKHRpcyk7XHJcblxyXG5cdFx0XHQvLyBCYWNrd2FyZHMgY29tcGF0aWJpbGl0eTogY2xhc3MgaW5mb3MgY2FuIGFsc28gYmUgZGVmaW5lZFxyXG5cdFx0XHQvLyBhcyBwcm9wZXJ0aWVzIG9mIHRoZSBzY2hlbWEsIGZvciBpbnN0YW5jZSBTY2hlbWEuTXlUeXBlXHJcblx0XHRcdGZvciAoIHZhciB0eXBlSW5mb05hbWUgaW4gbWFwcGluZykge1xyXG5cdFx0XHRcdGlmIChtYXBwaW5nLmhhc093blByb3BlcnR5KHR5cGVJbmZvTmFtZSkpIHtcclxuXHRcdFx0XHRcdGlmIChtYXBwaW5nW3R5cGVJbmZvTmFtZV0gaW5zdGFuY2VvZiB0aGlzLm1hcHBpbmdTdHlsZS5jbGFzc0luZm8pIHtcclxuXHRcdFx0XHRcdFx0dGhpcy50eXBlSW5mb3MucHVzaChtYXBwaW5nW3R5cGVJbmZvTmFtZV0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgZWlzID0gbWFwcGluZy5lbGVtZW50SW5mb3MgfHwgbWFwcGluZy5laXMgfHwgW107XHJcblx0XHRcdC8vIEluaXRpYWxpemUgZWxlbWVudCBpbmZvc1xyXG5cdFx0XHR0aGlzLmluaXRpYWxpemVFbGVtZW50SW5mb3MoZWlzKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGluaXRpYWxpemVUeXBlSW5mb3MgOiBmdW5jdGlvbih0eXBlSW5mb01hcHBpbmdzKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlQXJyYXkodHlwZUluZm9NYXBwaW5ncyk7XHJcblx0XHR2YXIgaW5kZXgsIHR5cGVJbmZvTWFwcGluZywgdHlwZUluZm87XHJcblx0XHRmb3IgKGluZGV4ID0gMDsgaW5kZXggPCB0eXBlSW5mb01hcHBpbmdzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHR0eXBlSW5mb01hcHBpbmcgPSB0eXBlSW5mb01hcHBpbmdzW2luZGV4XTtcclxuXHRcdFx0dHlwZUluZm8gPSB0aGlzLmNyZWF0ZVR5cGVJbmZvKHR5cGVJbmZvTWFwcGluZyk7XHJcblx0XHRcdHRoaXMudHlwZUluZm9zLnB1c2godHlwZUluZm8pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0aW5pdGlhbGl6ZUVsZW1lbnRJbmZvcyA6IGZ1bmN0aW9uKGVsZW1lbnRJbmZvTWFwcGluZ3MpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVBcnJheShlbGVtZW50SW5mb01hcHBpbmdzKTtcclxuXHRcdHZhciBpbmRleCwgZWxlbWVudEluZm9NYXBwaW5nLCBlbGVtZW50SW5mbztcclxuXHRcdGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGVsZW1lbnRJbmZvTWFwcGluZ3MubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdGVsZW1lbnRJbmZvTWFwcGluZyA9IGVsZW1lbnRJbmZvTWFwcGluZ3NbaW5kZXhdO1xyXG5cdFx0XHRlbGVtZW50SW5mbyA9IHRoaXMuY3JlYXRlRWxlbWVudEluZm8oZWxlbWVudEluZm9NYXBwaW5nKTtcclxuXHRcdFx0dGhpcy5lbGVtZW50SW5mb3MucHVzaChlbGVtZW50SW5mbyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRjcmVhdGVUeXBlSW5mbyA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHR2YXIgdHlwZUluZm87XHJcblx0XHQvLyBJZiBtYXBwaW5nIGlzIGFscmVhZHkgYSB0eXBlIGluZm8sIGRvIG5vdGhpbmdcclxuXHRcdGlmIChtYXBwaW5nIGluc3RhbmNlb2YgSnNvbml4Lk1vZGVsLlR5cGVJbmZvKSB7XHJcblx0XHRcdHR5cGVJbmZvID0gbWFwcGluZztcclxuXHRcdH1cclxuXHRcdC8vIEVsc2UgY3JlYXRlIGl0IHZpYSBnZW5lcmljIG1hcHBpbmcgY29uZmlndXJhdGlvblxyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdG1hcHBpbmcgPSBKc29uaXguVXRpbC5UeXBlLmNsb25lT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0XHR2YXIgdHlwZSA9IG1hcHBpbmcudHlwZSB8fCBtYXBwaW5nLnQgfHwgJ2NsYXNzSW5mbyc7XHJcblx0XHRcdC8vIExvY2F0ZSB0aGUgY3JlYXRvciBmdW5jdGlvblxyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc0Z1bmN0aW9uKHRoaXMudHlwZUluZm9DcmVhdG9yc1t0eXBlXSkpIHtcclxuXHRcdFx0XHR2YXIgdHlwZUluZm9DcmVhdG9yID0gdGhpcy50eXBlSW5mb0NyZWF0b3JzW3R5cGVdO1xyXG5cdFx0XHRcdC8vIENhbGwgdGhlIGNyZWF0b3IgZnVuY3Rpb25cclxuXHRcdFx0XHR0eXBlSW5mbyA9IHR5cGVJbmZvQ3JlYXRvci5jYWxsKHRoaXMsIG1hcHBpbmcpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlVua25vd24gdHlwZSBpbmZvIHR5cGUgW1wiICsgdHlwZSArIFwiXS5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB0eXBlSW5mbztcclxuXHR9LFxyXG5cdGluaXRpYWxpemVOYW1lcyA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdHZhciBsbiA9IG1hcHBpbmcubG9jYWxOYW1lIHx8IG1hcHBpbmcubG4gfHwgbnVsbDtcclxuXHRcdG1hcHBpbmcubG9jYWxOYW1lID0gbG47XHJcblx0XHR2YXIgbiA9IG1hcHBpbmcubmFtZSB8fCBtYXBwaW5nLm4gfHwgbnVsbDtcclxuXHRcdG1hcHBpbmcubmFtZSA9IG47XHJcblx0XHQvLyBDYWxjdWxhdGUgYm90aCBuYW1lIGFzIHdlbGwgYXMgbG9jYWxOYW1lXHJcblx0XHQvLyBuYW1lIGlzIHByb3ZpZGVkXHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhtYXBwaW5nLm5hbWUpKSB7XHJcblx0XHRcdC8vIE9ic29sZXRlIGNvZGUgYmVsb3dcclxuXHRcdFx0Ly8gLy8gbG9jYWxOYW1lIGlzIG5vdCBwcm92aWRlZFxyXG5cdFx0XHQvLyBpZiAoIUpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcobWFwcGluZy5sb2NhbE5hbWUpKSB7XHJcblx0XHRcdC8vIC8vIEJ1dCBtb2R1bGUgbmFtZSBpcyBwcm92aWRlZFxyXG5cdFx0XHQvLyBpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh0aGlzLm5hbWUpKSB7XHJcblx0XHRcdC8vIC8vIElmIG5hbWUgc3RhcnRzIHdpdGggbW9kdWxlIG5hbWUsIHVzZSBzZWNvbmQgcGFydFxyXG5cdFx0XHQvLyAvLyBhcyBsb2NhbCBuYW1lXHJcblx0XHRcdC8vIGlmIChtYXBwaW5nLm5hbWUuaW5kZXhPZih0aGlzLm5hbWUgKyAnLicpID09PSAwKSB7XHJcblx0XHRcdC8vIG1hcHBpbmcubG9jYWxOYW1lID0gbWFwcGluZy5uYW1lXHJcblx0XHRcdC8vIC5zdWJzdHJpbmcodGhpcy5uYW1lLmxlbmd0aCArIDEpO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdC8vIC8vIEVsc2UgdXNlIG5hbWUgYXMgbG9jYWwgbmFtZVxyXG5cdFx0XHQvLyBlbHNlIHtcclxuXHRcdFx0Ly8gbWFwcGluZy5sb2NhbE5hbWUgPSBtYXBwaW5nLm5hbWU7XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHQvLyAvLyBNb2R1bGUgbmFtZSBpcyBub3QgcHJvdmlkZWQsIHVzZSBuYW1lIGFzIGxvY2FsIG5hbWVcclxuXHRcdFx0Ly8gZWxzZSB7XHJcblx0XHRcdC8vIG1hcHBpbmcubG9jYWxOYW1lID0gbWFwcGluZy5uYW1lO1xyXG5cdFx0XHQvLyB9XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0aWYgKG1hcHBpbmcubmFtZS5sZW5ndGggPiAwICYmIG1hcHBpbmcubmFtZS5jaGFyQXQoMCkgPT09ICcuJyAmJiBKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHRoaXMubmFtZSkpIHtcclxuXHRcdFx0XHRtYXBwaW5nLm5hbWUgPSB0aGlzLm5hbWUgKyBtYXBwaW5nLm5hbWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIG5hbWUgaXMgbm90IHByb3ZpZGVkIGJ1dCBsb2NhbCBuYW1lIGlzIHByb3ZpZGVkXHJcblx0XHRlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKGxuKSkge1xyXG5cdFx0XHQvLyBNb2R1bGUgbmFtZSBpcyBwcm92aWRlZFxyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh0aGlzLm5hbWUpKSB7XHJcblx0XHRcdFx0bWFwcGluZy5uYW1lID0gdGhpcy5uYW1lICsgJy4nICsgbG47XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gTW9kdWxlIG5hbWUgaXMgbm90IHByb3ZpZGVkXHJcblx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdG1hcHBpbmcubmFtZSA9IGxuO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJOZWl0aGVyIFtuYW1lL25dIG5vciBbbG9jYWxOYW1lL2xuXSB3YXMgcHJvdmlkZWQgZm9yIHRoZSBjbGFzcyBpbmZvLlwiKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGNyZWF0ZUNsYXNzSW5mbyA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHR2YXIgZGVucyA9IG1hcHBpbmcuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgfHwgbWFwcGluZy5kZW5zIHx8IHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkk7XHJcblx0XHRtYXBwaW5nLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJID0gZGVucztcclxuXHRcdHZhciB0bnMgPSBtYXBwaW5nLnRhcmdldE5hbWVzcGFjZSB8fCBtYXBwaW5nLnRucyB8fCB0aGlzLnRhcmdldE5hbWVzcGFjZTtcclxuXHRcdG1hcHBpbmcudGFyZ2V0TmFtZXNwYWNlID0gdG5zO1xyXG5cdFx0dmFyIGRhbnMgPSBtYXBwaW5nLmRlZmF1bHRBdHRyaWJ1dGVOYW1lc3BhY2VVUkkgfHwgbWFwcGluZy5kYW5zIHx8IHRoaXMuZGVmYXVsdEF0dHJpYnV0ZU5hbWVzcGFjZVVSSTtcclxuXHRcdG1hcHBpbmcuZGVmYXVsdEF0dHJpYnV0ZU5hbWVzcGFjZVVSSSA9IGRhbnM7XHJcblx0XHR0aGlzLmluaXRpYWxpemVOYW1lcyhtYXBwaW5nKTtcclxuXHRcdC8vIE5vdyBib3RoIG5hbWUgYW4gbG9jYWwgbmFtZSBhcmUgaW5pdGlhbGl6ZWRcclxuXHRcdHZhciBjbGFzc0luZm8gPSBuZXcgdGhpcy5tYXBwaW5nU3R5bGUuY2xhc3NJbmZvKG1hcHBpbmcsIHtcclxuXHRcdFx0bWFwcGluZ1N0eWxlIDogdGhpcy5tYXBwaW5nU3R5bGVcclxuXHRcdH0pO1xyXG5cdFx0Y2xhc3NJbmZvLm1vZHVsZSA9IHRoaXM7XHJcblx0XHRyZXR1cm4gY2xhc3NJbmZvO1xyXG5cdH0sXHJcblx0Y3JlYXRlRW51bUxlYWZJbmZvIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZU5hbWVzKG1hcHBpbmcpO1xyXG5cdFx0Ly8gTm93IGJvdGggbmFtZSBhbiBsb2NhbCBuYW1lIGFyZSBpbml0aWFsaXplZFxyXG5cdFx0dmFyIGVudW1MZWFmSW5mbyA9IG5ldyB0aGlzLm1hcHBpbmdTdHlsZS5lbnVtTGVhZkluZm8obWFwcGluZywge1xyXG5cdFx0XHRtYXBwaW5nU3R5bGUgOiB0aGlzLm1hcHBpbmdTdHlsZVxyXG5cdFx0fSk7XHJcblx0XHRlbnVtTGVhZkluZm8ubW9kdWxlID0gdGhpcztcclxuXHRcdHJldHVybiBlbnVtTGVhZkluZm87XHJcblx0fSxcclxuXHRjcmVhdGVMaXN0IDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdHZhciB0aSA9IG1hcHBpbmcuYmFzZVR5cGVJbmZvIHx8IG1hcHBpbmcudHlwZUluZm8gfHwgbWFwcGluZy5idGkgfHwgbWFwcGluZy50aSB8fCAnU3RyaW5nJztcclxuXHRcdHZhciB0biA9IG1hcHBpbmcudHlwZU5hbWUgfHwgbWFwcGluZy50biB8fCBudWxsO1xyXG5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0bikpIHtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodG4pKSB7XHJcblx0XHRcdFx0dG4gPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0aGlzLnRhcmdldE5hbWVzcGFjZSwgdG4pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRuID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0KHRuKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dmFyIHMgPSBtYXBwaW5nLnNlcGFyYXRvciB8fCBtYXBwaW5nLnNlcCB8fCAnICc7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRXhpc3RzKHRpKTtcclxuXHRcdHZhciBsaXN0VHlwZUluZm8gPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdCh0aSwgdG4sIHMpO1xyXG5cdFx0bGlzdFR5cGVJbmZvLm1vZHVsZSA9IHRoaXM7XHJcblx0XHRyZXR1cm4gbGlzdFR5cGVJbmZvO1xyXG5cdH0sXHJcblx0Y3JlYXRlRWxlbWVudEluZm8gOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0bWFwcGluZyA9IEpzb25peC5VdGlsLlR5cGUuY2xvbmVPYmplY3QobWFwcGluZyk7XHJcblxyXG5cdFx0dmFyIGRlbnMgPSBtYXBwaW5nLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJIHx8IG1hcHBpbmcuZGVucyB8fCB0aGlzLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJO1xyXG5cdFx0bWFwcGluZy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSA9IGRlbnM7XHJcblx0XHR2YXIgZW4gPSBtYXBwaW5nLmVsZW1lbnROYW1lIHx8IG1hcHBpbmcuZW4gfHwgdW5kZWZpbmVkO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUV4aXN0cyhlbik7XHJcblxyXG5cdFx0dmFyIHRpID0gbWFwcGluZy50eXBlSW5mbyB8fCBtYXBwaW5nLnRpIHx8ICdTdHJpbmcnO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUV4aXN0cyh0aSk7XHJcblxyXG5cdFx0bWFwcGluZy50eXBlSW5mbyA9IHRpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QoZW4pKSB7XHJcblx0XHRcdG1hcHBpbmcuZWxlbWVudE5hbWUgPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3QoZW4pO1xyXG5cdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKGVuKSkge1xyXG5cdFx0XHRtYXBwaW5nLmVsZW1lbnROYW1lID0gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSwgZW4pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbGVtZW50IGluZm8gWycgKyBtYXBwaW5nICsgJ10gbXVzdCBwcm92aWRlIGFuIGVsZW1lbnQgbmFtZS4nKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgc2ggPSBtYXBwaW5nLnN1YnN0aXR1dGlvbkhlYWQgfHwgbWFwcGluZy5zaCB8fCBudWxsO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHNoKSkge1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChzaCkpIHtcclxuXHRcdFx0XHRtYXBwaW5nLnN1YnN0aXR1dGlvbkhlYWQgPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3Qoc2gpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcoc2gpO1xyXG5cdFx0XHRcdG1hcHBpbmcuc3Vic3RpdHV0aW9uSGVhZCA9IG5ldyBKc29uaXguWE1MLlFOYW1lKHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkksIHNoKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBlbGVtZW50SW5mbyA9IG5ldyB0aGlzLm1hcHBpbmdTdHlsZS5lbGVtZW50SW5mbyhtYXBwaW5nLCB7XHJcblx0XHRcdG1hcHBpbmdTdHlsZSA6IHRoaXMubWFwcGluZ1N0eWxlXHJcblx0XHR9KTtcclxuXHRcdGVsZW1lbnRJbmZvLm1vZHVsZSA9IHRoaXM7XHJcblx0XHRyZXR1cm4gZWxlbWVudEluZm87XHJcblx0fSxcclxuXHRyZWdpc3RlclR5cGVJbmZvcyA6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnR5cGVJbmZvcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0dmFyIHR5cGVJbmZvID0gdGhpcy50eXBlSW5mb3NbaW5kZXhdO1xyXG5cdFx0XHRjb250ZXh0LnJlZ2lzdGVyVHlwZUluZm8odHlwZUluZm8sIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YnVpbGRUeXBlSW5mb3MgOiBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy50eXBlSW5mb3MubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdHZhciB0eXBlSW5mbyA9IHRoaXMudHlwZUluZm9zW2luZGV4XTtcclxuXHRcdFx0dHlwZUluZm8uYnVpbGQoY29udGV4dCwgdGhpcyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZWdpc3RlckVsZW1lbnRJbmZvcyA6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRJbmZvcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0dmFyIGVsZW1lbnRJbmZvID0gdGhpcy5lbGVtZW50SW5mb3NbaW5kZXhdO1xyXG5cdFx0XHRjb250ZXh0LnJlZ2lzdGVyRWxlbWVudEluZm8oZWxlbWVudEluZm8sIHRoaXMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YnVpbGRFbGVtZW50SW5mb3MgOiBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50SW5mb3MubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdHZhciBlbGVtZW50SW5mbyA9IHRoaXMuZWxlbWVudEluZm9zW2luZGV4XTtcclxuXHRcdFx0ZWxlbWVudEluZm8uYnVpbGQoY29udGV4dCwgdGhpcyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHQvLyBPYnNvbGV0ZSwgcmV0YWluZWQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XHJcblx0Y3MgOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblx0Ly8gT2Jzb2xldGUsIHJldGFpbmVkIGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxyXG5cdGVzIDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcztcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLk1vZHVsZSdcclxufSk7XHJcbkpzb25peC5Nb2RlbC5Nb2R1bGUucHJvdG90eXBlLnR5cGVJbmZvQ3JlYXRvcnMgPSB7XHJcblx0XCJjbGFzc0luZm9cIiA6IEpzb25peC5Nb2RlbC5Nb2R1bGUucHJvdG90eXBlLmNyZWF0ZUNsYXNzSW5mbyxcclxuXHRcImNcIiA6IEpzb25peC5Nb2RlbC5Nb2R1bGUucHJvdG90eXBlLmNyZWF0ZUNsYXNzSW5mbyxcclxuXHRcImVudW1JbmZvXCIgOiBKc29uaXguTW9kZWwuTW9kdWxlLnByb3RvdHlwZS5jcmVhdGVFbnVtTGVhZkluZm8sXHJcblx0XCJlbnVtXCIgOiBKc29uaXguTW9kZWwuTW9kdWxlLnByb3RvdHlwZS5jcmVhdGVFbnVtTGVhZkluZm8sXHJcblx0XCJsaXN0XCIgOiBKc29uaXguTW9kZWwuTW9kdWxlLnByb3RvdHlwZS5jcmVhdGVMaXN0LFxyXG5cdFwibFwiIDogSnNvbml4Lk1vZGVsLk1vZHVsZS5wcm90b3R5cGUuY3JlYXRlTGlzdFxyXG59O1xyXG5Kc29uaXguTWFwcGluZy5TdHlsZS5TdGFuZGFyZCA9IEpzb25peC5DbGFzcyhKc29uaXguTWFwcGluZy5TdHlsZSwge1xyXG5cdG1hcnNoYWxsZXIgOiBKc29uaXguQmluZGluZy5NYXJzaGFsbGVyLFxyXG5cdHVubWFyc2hhbGxlciA6IEpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxlcixcclxuXHRtb2R1bGUgOiBKc29uaXguTW9kZWwuTW9kdWxlLFxyXG5cdGVsZW1lbnRJbmZvIDogSnNvbml4Lk1vZGVsLkVsZW1lbnRJbmZvLFxyXG5cdGNsYXNzSW5mbyA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8sXHJcblx0ZW51bUxlYWZJbmZvIDogSnNvbml4Lk1vZGVsLkVudW1MZWFmSW5mbyxcclxuXHRhbnlBdHRyaWJ1dGVQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuQW55QXR0cmlidXRlUHJvcGVydHlJbmZvLFxyXG5cdGFueUVsZW1lbnRQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuQW55RWxlbWVudFByb3BlcnR5SW5mbyxcclxuXHRhdHRyaWJ1dGVQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuQXR0cmlidXRlUHJvcGVydHlJbmZvLFxyXG5cdGVsZW1lbnRNYXBQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuRWxlbWVudE1hcFByb3BlcnR5SW5mbyxcclxuXHRlbGVtZW50UHJvcGVydHlJbmZvIDogSnNvbml4Lk1vZGVsLkVsZW1lbnRQcm9wZXJ0eUluZm8sXHJcblx0ZWxlbWVudHNQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuRWxlbWVudHNQcm9wZXJ0eUluZm8sXHJcblx0ZWxlbWVudFJlZlByb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5FbGVtZW50UmVmUHJvcGVydHlJbmZvLFxyXG5cdGVsZW1lbnRSZWZzUHJvcGVydHlJbmZvIDogSnNvbml4Lk1vZGVsLkVsZW1lbnRSZWZzUHJvcGVydHlJbmZvLFxyXG5cdHZhbHVlUHJvcGVydHlJbmZvIDogSnNvbml4Lk1vZGVsLlZhbHVlUHJvcGVydHlJbmZvLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHRcdEpzb25peC5NYXBwaW5nLlN0eWxlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTWFwcGluZy5TdHlsZS5TdGFuZGFyZCdcclxufSk7XHJcbkpzb25peC5NYXBwaW5nLlN0eWxlLlNUWUxFUy5zdGFuZGFyZCA9IG5ldyBKc29uaXguTWFwcGluZy5TdHlsZS5TdGFuZGFyZCgpO1xyXG5cclxuSnNvbml4Lk1hcHBpbmcuU3R5bGUuU2ltcGxpZmllZCA9IEpzb25peC5DbGFzcyhKc29uaXguTWFwcGluZy5TdHlsZSwge1xyXG5cdG1hcnNoYWxsZXIgOiBKc29uaXguQmluZGluZy5NYXJzaGFsbGVyLlNpbXBsaWZpZWQsXHJcblx0dW5tYXJzaGFsbGVyIDogSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbGVyLlNpbXBsaWZpZWQsXHJcblx0bW9kdWxlIDogSnNvbml4Lk1vZGVsLk1vZHVsZSxcclxuXHRlbGVtZW50SW5mbyA6IEpzb25peC5Nb2RlbC5FbGVtZW50SW5mbyxcclxuXHRjbGFzc0luZm8gOiBKc29uaXguTW9kZWwuQ2xhc3NJbmZvLFxyXG5cdGVudW1MZWFmSW5mbyA6IEpzb25peC5Nb2RlbC5FbnVtTGVhZkluZm8sXHJcblx0YW55QXR0cmlidXRlUHJvcGVydHlJbmZvIDogSnNvbml4Lk1vZGVsLkFueUF0dHJpYnV0ZVByb3BlcnR5SW5mby5TaW1wbGlmaWVkLFxyXG5cdGFueUVsZW1lbnRQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuQW55RWxlbWVudFByb3BlcnR5SW5mby5TaW1wbGlmaWVkLFxyXG5cdGF0dHJpYnV0ZVByb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5BdHRyaWJ1dGVQcm9wZXJ0eUluZm8sXHJcblx0ZWxlbWVudE1hcFByb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5FbGVtZW50TWFwUHJvcGVydHlJbmZvLFxyXG5cdGVsZW1lbnRQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuRWxlbWVudFByb3BlcnR5SW5mbyxcclxuXHRlbGVtZW50c1Byb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5FbGVtZW50c1Byb3BlcnR5SW5mbyxcclxuXHRlbGVtZW50UmVmUHJvcGVydHlJbmZvIDogSnNvbml4Lk1vZGVsLkVsZW1lbnRSZWZQcm9wZXJ0eUluZm8uU2ltcGxpZmllZCxcclxuXHRlbGVtZW50UmVmc1Byb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5FbGVtZW50UmVmc1Byb3BlcnR5SW5mby5TaW1wbGlmaWVkLFxyXG5cdHZhbHVlUHJvcGVydHlJbmZvIDogSnNvbml4Lk1vZGVsLlZhbHVlUHJvcGVydHlJbmZvLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHRcdEpzb25peC5NYXBwaW5nLlN0eWxlLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTWFwcGluZy5TdHlsZS5TaW1wbGlmaWVkJ1xyXG59KTtcclxuSnNvbml4Lk1hcHBpbmcuU3R5bGUuU1RZTEVTLnNpbXBsaWZpZWQgPSBuZXcgSnNvbml4Lk1hcHBpbmcuU3R5bGUuU2ltcGxpZmllZCgpO1xyXG5cclxuSnNvbml4LlNjaGVtYS5YU0QgPSB7fTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTkFNRVNQQUNFX1VSSSA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYSc7XHJcbkpzb25peC5TY2hlbWEuWFNELlBSRUZJWCA9ICd4c2QnO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5xbmFtZSA9IGZ1bmN0aW9uKGxvY2FsUGFydCkge1xyXG5cdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcobG9jYWxQYXJ0KTtcclxuXHRyZXR1cm4gbmV3IEpzb25peC5YTUwuUU5hbWUoSnNvbml4LlNjaGVtYS5YU0QuTkFNRVNQQUNFX1VSSSwgbG9jYWxQYXJ0LFxyXG5cdFx0XHRKc29uaXguU2NoZW1hLlhTRC5QUkVGSVgpO1xyXG59O1xyXG5cclxuSnNvbml4LlNjaGVtYS5YU0QuQW55VHlwZSA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuQ2xhc3NJbmZvLCB7XHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnYW55VHlwZScpLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHRcdEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmluaXRpYWxpemUuY2FsbCh0aGlzLCB7XHJcblx0XHRcdG5hbWUgOiAnQW55VHlwZScsXHJcblx0XHRcdHByb3BlcnR5SW5mb3MgOiBbIHtcclxuXHRcdFx0XHR0eXBlIDogJ2FueUF0dHJpYnV0ZScsXHJcblx0XHRcdFx0bmFtZSA6ICdhdHRyaWJ1dGVzJ1xyXG5cdFx0XHR9LCB7XHJcblx0XHRcdFx0dHlwZSA6ICdhbnlFbGVtZW50JyxcclxuXHRcdFx0XHRuYW1lIDogJ2NvbnRlbnQnLFxyXG5cdFx0XHRcdGNvbGxlY3Rpb24gOiB0cnVlXHJcblx0XHRcdH0gXVxyXG5cdFx0fSk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkFueVR5cGUnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5BbnlUeXBlLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkFueVR5cGUoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZSA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuVHlwZUluZm8sIHtcclxuXHRuYW1lIDogJ0FueVNpbXBsZVR5cGUnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2FueVNpbXBsZVR5cGUnKSxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24oKSB7XHJcblx0XHRKc29uaXguTW9kZWwuVHlwZUluZm8ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgW10pO1xyXG5cdH0sXHRcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRleHQ7XHJcblx0fSxcclxuXHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9LFxyXG5cdHJlcHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0Ly8gT25seSByZXByaW50IHdoZW4gdGhlIHZhbHVlIGlzIGEgc3RyaW5nIGJ1dCBub3QgYW4gaW5zdGFuY2VcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHZhbHVlKSAmJiAhdGhpcy5pc0luc3RhbmNlKHZhbHVlLCBjb250ZXh0LCBzY29wZSkpIHtcclxuXHRcdFx0Ly8gVXNpbmcgbnVsbCBhcyBpbnB1dCBhcyBpbnB1dCBpcyBub3QgYXZhaWxhYmxlXHJcblx0XHRcdHJldHVybiB0aGlzLnByaW50KHRoaXMucGFyc2UodmFsdWUsIGNvbnRleHQsIG51bGwsIHNjb3BlKSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiB0aGlzLnByaW50KHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHVubWFyc2hhbCA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIHRleHQgPSBpbnB1dC5nZXRFbGVtZW50VGV4dCgpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlN0cmluZ1V0aWxzLmlzTm90QmxhbmsodGV4dCkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2UodGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0fSxcclxuXHRtYXJzaGFsIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZSkpIHtcclxuXHRcdFx0b3V0cHV0LndyaXRlQ2hhcmFjdGVycyh0aGlzLnJlcHJpbnQodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGJ1aWxkOiBmdW5jdGlvbihjb250ZXh0LCBtb2R1bGUpXHJcblx0e1xyXG5cdFx0Ly8gTm90aGluZyB0byBkb1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZS5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkxpc3QgPSBKc29uaXhcclxuXHRcdC5DbGFzcyhcclxuXHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlLFxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG5hbWUgOiBudWxsLFxyXG5cdFx0XHRcdFx0dHlwZU5hbWUgOiBudWxsLFxyXG5cdFx0XHRcdFx0dHlwZUluZm8gOiBudWxsLFxyXG5cdFx0XHRcdFx0c2VwYXJhdG9yIDogJyAnLFxyXG5cdFx0XHRcdFx0dHJpbW1lZFNlcGFyYXRvciA6IEpzb25peC5VdGlsLlN0cmluZ1V0aWxzLndoaXRlc3BhY2VDaGFyYWN0ZXJzLFxyXG5cdFx0XHRcdFx0c2ltcGxlVHlwZSA6IHRydWUsXHJcblx0XHRcdFx0XHRidWlsdCA6IGZhbHNlLFxyXG5cdFx0XHRcdFx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKHR5cGVJbmZvLCB0eXBlTmFtZSwgc2VwYXJhdG9yKSB7XHJcblx0XHRcdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVFeGlzdHModHlwZUluZm8pO1xyXG5cdFx0XHRcdFx0XHQvLyBUT0RPIEVuc3VyZSBjb3JyZWN0IGFyZ3VtZW50XHJcblx0XHRcdFx0XHRcdHRoaXMudHlwZUluZm8gPSB0eXBlSW5mbztcclxuXHRcdFx0XHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLm5hbWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5uYW1lID0gdHlwZUluZm8ubmFtZSArIFwiKlwiO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0eXBlTmFtZSkpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBUT0RPIEVuc3VyZSBjb3JyZWN0IGFyZ3VtZW50XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50eXBlTmFtZSA9IHR5cGVOYW1lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhzZXBhcmF0b3IpKSB7XHJcblx0XHRcdFx0XHRcdFx0Ly8gVE9ETyBFbnN1cmUgY29ycmVjdCBhcmd1bWVudFxyXG5cdFx0XHRcdFx0XHRcdHRoaXMuc2VwYXJhdG9yID0gc2VwYXJhdG9yO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuc2VwYXJhdG9yID0gJyAnO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHR2YXIgdHJpbW1lZFNlcGFyYXRvciA9IEpzb25peC5VdGlsLlN0cmluZ1V0aWxzXHJcblx0XHRcdFx0XHRcdFx0XHQudHJpbSh0aGlzLnNlcGFyYXRvcik7XHJcblx0XHRcdFx0XHRcdGlmICh0cmltbWVkU2VwYXJhdG9yLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMudHJpbW1lZFNlcGFyYXRvciA9IEpzb25peC5VdGlsLlN0cmluZ1V0aWxzLndoaXRlc3BhY2VDaGFyYWN0ZXJzO1xyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMudHJpbW1lZFNlcGFyYXRvciA9IHRyaW1tZWRTZXBhcmF0b3I7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHRidWlsZCA6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCF0aGlzLmJ1aWx0KSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50eXBlSW5mbyA9IGNvbnRleHQucmVzb2x2ZVR5cGVJbmZvKHRoaXMudHlwZUluZm8sIHRoaXMubW9kdWxlKTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLmJ1aWx0ID0gdHJ1ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdFx0XHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBUT0RPIEV4Y2VwdGlvbiBpZiBub3QgYW4gYXJyYXlcclxuXHRcdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUFycmF5KHZhbHVlKTtcclxuXHRcdFx0XHRcdFx0dmFyIHJlc3VsdCA9ICcnO1xyXG5cdFx0XHRcdFx0XHRmb3IgKCB2YXIgaW5kZXggPSAwOyBpbmRleCA8IHZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChpbmRleCA+IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdCA9IHJlc3VsdCArIHRoaXMuc2VwYXJhdG9yO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXN1bHQgPSByZXN1bHQgKyB0aGlzLnR5cGVJbmZvLnJlcHJpbnQodmFsdWVbaW5kZXhdLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdHBhcnNlIDogZnVuY3Rpb24odGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRcdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHRcdFx0XHRcdHZhciBpdGVtcyA9IEpzb25peC5VdGlsLlN0cmluZ1V0aWxzXHJcblx0XHRcdFx0XHRcdFx0XHQuc3BsaXRCeVNlcGFyYXRvckNoYXJzKHRleHQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0dGhpcy50cmltbWVkU2VwYXJhdG9yKTtcclxuXHRcdFx0XHRcdFx0dmFyIHJlc3VsdCA9IFtdO1xyXG5cdFx0XHRcdFx0XHRmb3IgKCB2YXIgaW5kZXggPSAwOyBpbmRleCA8IGl0ZW1zLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0XHRcdHJlc3VsdC5wdXNoKHRoaXMudHlwZUluZm9cclxuXHRcdFx0XHRcdFx0XHRcdFx0LnBhcnNlKEpzb25peC5VdGlsLlN0cmluZ1V0aWxzLnRyaW0oaXRlbXNbaW5kZXhdKSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0XHRcdH0sXHJcblx0XHRcdFx0XHQvLyBUT0RPIGlzSW5zdGFuY2U/XHJcblx0XHRcdFx0XHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkxpc3QnXHJcblx0XHRcdFx0fSk7XHJcblxyXG5Kc29uaXguU2NoZW1hLlhTRC5TdHJpbmcgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZSwge1xyXG5cdG5hbWUgOiAnU3RyaW5nJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdzdHJpbmcnKSxcclxuXHR1bm1hcnNoYWwgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciB0ZXh0ID0gaW5wdXQuZ2V0RWxlbWVudFRleHQoKTtcclxuXHRcdHJldHVybiB0aGlzLnBhcnNlKHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSk7XHJcblx0fSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHZhbHVlKTtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9LFxyXG5cdHBhcnNlIDogZnVuY3Rpb24odGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHRleHQpO1xyXG5cdFx0cmV0dXJuIHRleHQ7XHJcblx0fSxcclxuXHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh2YWx1ZSk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELlN0cmluZydcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlN0cmluZy5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5TdHJpbmcoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuU3RyaW5nLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChcclxuXHRcdEpzb25peC5TY2hlbWEuWFNELlN0cmluZy5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlN0cmluZ3MgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuTGlzdCwge1xyXG5cdG5hbWUgOiAnU3RyaW5ncycsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0SnNvbml4LlNjaGVtYS5YU0QuTGlzdC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIEpzb25peC5TY2hlbWEuWFNELlN0cmluZy5JTlNUQU5DRSwgSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ3N0cmluZ3MnKSwgJyAnIF0pO1xyXG5cdH0sXHJcblx0Ly8gVE9ETyBDb25zdHJhaW50c1xyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuU3RyaW5ncydcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlN0cmluZ3MuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuU3RyaW5ncygpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Ob3JtYWxpemVkU3RyaW5nID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELlN0cmluZywge1xyXG5cdG5hbWUgOiAnTm9ybWFsaXplZFN0cmluZycsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnbm9ybWFsaXplZFN0cmluZycpLFxyXG5cdC8vIFRPRE8gQ29uc3RyYWludHNcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELk5vcm1hbGl6ZWRTdHJpbmcnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Ob3JtYWxpemVkU3RyaW5nLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELk5vcm1hbGl6ZWRTdHJpbmcoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTm9ybWFsaXplZFN0cmluZy5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuTm9ybWFsaXplZFN0cmluZy5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlRva2VuID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELk5vcm1hbGl6ZWRTdHJpbmcsIHtcclxuXHRuYW1lIDogJ1Rva2VuJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCd0b2tlbicpLFxyXG5cdC8vIFRPRE8gQ29uc3RyYWludHNcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELlRva2VuJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVG9rZW4uSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuVG9rZW4oKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVG9rZW4uSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELlRva2VuLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTGFuZ3VhZ2UgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuVG9rZW4sIHtcclxuXHRuYW1lIDogJ0xhbmd1YWdlJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdsYW5ndWFnZScpLFxyXG5cdC8vIFRPRE8gQ29uc3RyYWludHNcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkxhbmd1YWdlJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTGFuZ3VhZ2UuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGFuZ3VhZ2UoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTGFuZ3VhZ2UuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkxhbmd1YWdlLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTmFtZSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5Ub2tlbiwge1xyXG5cdG5hbWUgOiAnTmFtZScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnTmFtZScpLFxyXG5cdC8vIFRPRE8gQ29uc3RyYWludHNcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELk5hbWUnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5OYW1lLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELk5hbWUoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTmFtZS5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuTmFtZS5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5DTmFtZSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5OYW1lLCB7XHJcblx0bmFtZSA6ICdOQ05hbWUnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ05DTmFtZScpLFxyXG5cdC8vIFRPRE8gQ29uc3RyYWludHNcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELk5DTmFtZSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5DTmFtZS5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5OQ05hbWUoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTkNOYW1lLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5OQ05hbWUuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5OTVRva2VuID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELlRva2VuLCB7XHJcblx0bmFtZSA6ICdOTVRva2VuJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdOTVRPS0VOJyksXHJcblx0Ly8gVE9ETyBDb25zdHJhaW50c1xyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuTk1Ub2tlbidcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5NVG9rZW4uSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTk1Ub2tlbigpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5OTVRva2VucyA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5MaXN0LCB7XHJcblx0bmFtZSA6ICdOTVRva2VucycsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0SnNvbml4LlNjaGVtYS5YU0QuTGlzdC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIEpzb25peC5TY2hlbWEuWFNELk5NVG9rZW4uSU5TVEFOQ0UsIEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdOTVRPS0VOJyksICcgJyBdKTtcclxuXHR9LFxyXG5cdC8vIFRPRE8gQ29uc3RyYWludHNcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELk5NVG9rZW5zJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTk1Ub2tlbnMuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTk1Ub2tlbnMoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQm9vbGVhbiA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlLCB7XHJcblx0bmFtZSA6ICdCb29sZWFuJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdib29sZWFuJyksXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUJvb2xlYW4odmFsdWUpO1xyXG5cdFx0cmV0dXJuIHZhbHVlID8gJ3RydWUnIDogJ2ZhbHNlJztcclxuXHR9LFxyXG5cdHBhcnNlIDogZnVuY3Rpb24odGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHRleHQpO1xyXG5cdFx0aWYgKHRleHQgPT09ICd0cnVlJyB8fCB0ZXh0ID09PSAnMScpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9IGVsc2UgaWYgKHRleHQgPT09ICdmYWxzZScgfHwgdGV4dCA9PT0gJzAnKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkVpdGhlciBbdHJ1ZV0sIFsxXSwgWzBdIG9yIFtmYWxzZV0gZXhwZWN0ZWQgYXMgYm9vbGVhbiB2YWx1ZS5cIik7XHJcblx0XHR9XHJcblx0fSxcclxuXHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gSnNvbml4LlV0aWwuVHlwZS5pc0Jvb2xlYW4odmFsdWUpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5Cb29sZWFuJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQm9vbGVhbi5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5Cb29sZWFuKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkJvb2xlYW4uSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkJvb2xlYW4uSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5CYXNlNjRCaW5hcnkgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZSwge1xyXG5cdG5hbWUgOiAnQmFzZTY0QmluYXJ5JyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdiYXNlNjRCaW5hcnknKSxcclxuXHRjaGFyVG9CeXRlIDoge30sXHJcblx0Ynl0ZVRvQ2hhciA6IFtdLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHRcdEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcyk7XHJcblx0XHQvLyBJbml0aWFsaXplIGNoYXJUb0J5dGUgYW5kIGJ5dGVUb0NoYXIgdGFibGUgZm9yIGZhc3RcclxuXHRcdC8vIGxvb2t1cHNcclxuXHRcdHZhciBjaGFyVGFibGUgPSBcIkFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky89XCI7XHJcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGNoYXJUYWJsZS5sZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgX2NoYXIgPSBjaGFyVGFibGUuY2hhckF0KGkpO1xyXG5cdFx0XHR2YXIgX2J5dGUgPSBjaGFyVGFibGUuY2hhckNvZGVBdChpKTtcclxuXHRcdFx0dGhpcy5ieXRlVG9DaGFyW2ldID0gX2NoYXI7XHJcblx0XHRcdHRoaXMuY2hhclRvQnl0ZVtfY2hhcl0gPSBpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUFycmF5KHZhbHVlKTtcclxuXHRcdHJldHVybiB0aGlzLmVuY29kZSh2YWx1ZSk7XHJcblx0fSxcclxuXHJcblx0cGFyc2UgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHRyZXR1cm4gdGhpcy5kZWNvZGUodGV4dCk7XHJcblx0fSxcclxuXHRlbmNvZGUgOiBmdW5jdGlvbih1YXJyYXkpIHtcclxuXHRcdHZhciBvdXRwdXQgPSBcIlwiO1xyXG5cdFx0dmFyIGJ5dGUwO1xyXG5cdFx0dmFyIGJ5dGUxO1xyXG5cdFx0dmFyIGJ5dGUyO1xyXG5cdFx0dmFyIGNoYXIwO1xyXG5cdFx0dmFyIGNoYXIxO1xyXG5cdFx0dmFyIGNoYXIyO1xyXG5cdFx0dmFyIGNoYXIzO1xyXG5cdFx0dmFyIGkgPSAwO1xyXG5cdFx0dmFyIGogPSAwO1xyXG5cdFx0dmFyIGxlbmd0aCA9IHVhcnJheS5sZW5ndGg7XHJcblxyXG5cdFx0Zm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XHJcblx0XHRcdGJ5dGUwID0gdWFycmF5W2ldICYgMHhGRjtcclxuXHRcdFx0Y2hhcjAgPSB0aGlzLmJ5dGVUb0NoYXJbYnl0ZTAgPj4gMl07XHJcblxyXG5cdFx0XHRpZiAoaSArIDEgPCBsZW5ndGgpIHtcclxuXHRcdFx0XHRieXRlMSA9IHVhcnJheVtpICsgMV0gJiAweEZGO1xyXG5cdFx0XHRcdGNoYXIxID0gdGhpcy5ieXRlVG9DaGFyWygoYnl0ZTAgJiAweDAzKSA8PCA0KSB8IChieXRlMSA+PiA0KV07XHJcblx0XHRcdFx0aWYgKGkgKyAyIDwgbGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRieXRlMiA9IHVhcnJheVtpICsgMl0gJiAweEZGO1xyXG5cdFx0XHRcdFx0Y2hhcjIgPSB0aGlzLmJ5dGVUb0NoYXJbKChieXRlMSAmIDB4MEYpIDw8IDIpIHwgKGJ5dGUyID4+IDYpXTtcclxuXHRcdFx0XHRcdGNoYXIzID0gdGhpcy5ieXRlVG9DaGFyW2J5dGUyICYgMHgzRl07XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGNoYXIyID0gdGhpcy5ieXRlVG9DaGFyWyhieXRlMSAmIDB4MEYpIDw8IDJdO1xyXG5cdFx0XHRcdFx0Y2hhcjMgPSBcIj1cIjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0Y2hhcjEgPSB0aGlzLmJ5dGVUb0NoYXJbKGJ5dGUwICYgMHgwMykgPDwgNF07XHJcblx0XHRcdFx0Y2hhcjIgPSBcIj1cIjtcclxuXHRcdFx0XHRjaGFyMyA9IFwiPVwiO1xyXG5cdFx0XHR9XHJcblx0XHRcdG91dHB1dCA9IG91dHB1dCArIGNoYXIwICsgY2hhcjEgKyBjaGFyMiArIGNoYXIzO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdGRlY29kZSA6IGZ1bmN0aW9uKHRleHQpIHtcclxuXHJcblx0XHRpbnB1dCA9IHRleHQucmVwbGFjZSgvW15BLVphLXowLTlcXCtcXC9cXD1dL2csIFwiXCIpO1xyXG5cclxuXHRcdHZhciBsZW5ndGggPSBNYXRoLmZsb29yKGlucHV0Lmxlbmd0aCAvIDQgKiAzKTtcclxuXHRcdGlmIChpbnB1dC5jaGFyQXQoaW5wdXQubGVuZ3RoIC0gMSkgPT09IFwiPVwiKSB7XHJcblx0XHRcdGxlbmd0aC0tO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGlucHV0LmNoYXJBdChpbnB1dC5sZW5ndGggLSAyKSA9PT0gXCI9XCIpIHtcclxuXHRcdFx0bGVuZ3RoLS07XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHVhcnJheSA9IG5ldyBBcnJheShsZW5ndGgpO1xyXG5cclxuXHRcdHZhciBieXRlMDtcclxuXHRcdHZhciBieXRlMTtcclxuXHRcdHZhciBieXRlMjtcclxuXHRcdHZhciBjaGFyMDtcclxuXHRcdHZhciBjaGFyMTtcclxuXHRcdHZhciBjaGFyMjtcclxuXHRcdHZhciBjaGFyMztcclxuXHRcdHZhciBpID0gMDtcclxuXHRcdHZhciBqID0gMDtcclxuXHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcclxuXHRcdFx0Ly8gZ2V0IHRoZSAzIG9jdGVjdHMgaW4gNCBhc2NpaSBjaGFyc1xyXG5cdFx0XHRjaGFyMCA9IHRoaXMuY2hhclRvQnl0ZVtpbnB1dC5jaGFyQXQoaisrKV07XHJcblx0XHRcdGNoYXIxID0gdGhpcy5jaGFyVG9CeXRlW2lucHV0LmNoYXJBdChqKyspXTtcclxuXHRcdFx0Y2hhcjIgPSB0aGlzLmNoYXJUb0J5dGVbaW5wdXQuY2hhckF0KGorKyldO1xyXG5cdFx0XHRjaGFyMyA9IHRoaXMuY2hhclRvQnl0ZVtpbnB1dC5jaGFyQXQoaisrKV07XHJcblxyXG5cdFx0XHRieXRlMCA9IChjaGFyMCA8PCAyKSB8IChjaGFyMSA+PiA0KTtcclxuXHRcdFx0Ynl0ZTEgPSAoKGNoYXIxICYgMHgwRikgPDwgNCkgfCAoY2hhcjIgPj4gMik7XHJcblx0XHRcdGJ5dGUyID0gKChjaGFyMiAmIDB4MDMpIDw8IDYpIHwgY2hhcjM7XHJcblxyXG5cdFx0XHR1YXJyYXlbaV0gPSBieXRlMDtcclxuXHRcdFx0aWYgKGNoYXIyICE9IDY0KSB7XHJcblx0XHRcdFx0dWFycmF5W2kgKyAxXSA9IGJ5dGUxO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChjaGFyMyAhPSA2NCkge1xyXG5cdFx0XHRcdHVhcnJheVtpICsgMl0gPSBieXRlMjtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHVhcnJheTtcclxuXHR9LFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzQXJyYXkodmFsdWUpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5CYXNlNjRCaW5hcnknXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5CYXNlNjRCaW5hcnkuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuQmFzZTY0QmluYXJ5KCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkJhc2U2NEJpbmFyeS5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuQmFzZTY0QmluYXJ5LklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuSGV4QmluYXJ5ID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUsIHtcclxuXHRuYW1lIDogJ0hleEJpbmFyeScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnaGV4QmluYXJ5JyksXHJcblx0Y2hhclRvUXVhcnRldCA6IHt9LFxyXG5cdGJ5dGVUb0R1cGxldCA6IFtdLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHRcdEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcyk7XHJcblx0XHR2YXIgY2hhclRhYmxlVXBwZXJDYXNlID0gXCIwMTIzNDU2Nzg5QUJDREVGXCI7XHJcblx0XHR2YXIgY2hhclRhYmxlTG93ZXJDYXNlID0gY2hhclRhYmxlVXBwZXJDYXNlLnRvTG93ZXJDYXNlKCk7XHJcblx0XHR2YXIgaTtcclxuXHRcdGZvciAoaSA9IDA7IGkgPCAxNjsgaSsrKSB7XHJcblx0XHRcdHRoaXMuY2hhclRvUXVhcnRldFtjaGFyVGFibGVVcHBlckNhc2UuY2hhckF0KGkpXSA9IGk7XHJcblx0XHRcdGlmIChpID49IDB4QSkge1xyXG5cdFx0XHRcdHRoaXMuY2hhclRvUXVhcnRldFtjaGFyVGFibGVMb3dlckNhc2UuY2hhckF0KGkpXSA9IGk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGZvciAoaSA9IDA7IGkgPCAyNTY7IGkrKykge1xyXG5cdFx0XHR0aGlzLmJ5dGVUb0R1cGxldFtpXSA9XHJcblx0XHRcdC8vXHJcblx0XHRcdGNoYXJUYWJsZVVwcGVyQ2FzZVtpID4+IDRdICsgY2hhclRhYmxlVXBwZXJDYXNlW2kgJiAweEZdO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUFycmF5KHZhbHVlKTtcclxuXHRcdHJldHVybiB0aGlzLmVuY29kZSh2YWx1ZSk7XHJcblx0fSxcclxuXHJcblx0cGFyc2UgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHRyZXR1cm4gdGhpcy5kZWNvZGUodGV4dCk7XHJcblx0fSxcclxuXHRlbmNvZGUgOiBmdW5jdGlvbih1YXJyYXkpIHtcclxuXHRcdHZhciBvdXRwdXQgPSBcIlwiO1xyXG5cdFx0Zm9yICggdmFyIGkgPSAwOyBpIDwgdWFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdG91dHB1dCA9IG91dHB1dCArIHRoaXMuYnl0ZVRvRHVwbGV0W3VhcnJheVtpXSAmIDB4RkZdO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG91dHB1dDtcclxuXHR9LFxyXG5cdGRlY29kZSA6IGZ1bmN0aW9uKHRleHQpIHtcclxuXHRcdHZhciBpbnB1dCA9IHRleHQucmVwbGFjZSgvW15BLUZhLWYwLTldL2csIFwiXCIpO1xyXG5cdFx0Ly8gUm91bmQgYnkgdHdvXHJcblx0XHR2YXIgbGVuZ3RoID0gaW5wdXQubGVuZ3RoID4+IDE7XHJcblx0XHR2YXIgdWFycmF5ID0gbmV3IEFycmF5KGxlbmd0aCk7XHJcblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG5cdFx0XHR2YXIgY2hhcjAgPSBpbnB1dC5jaGFyQXQoMiAqIGkpO1xyXG5cdFx0XHR2YXIgY2hhcjEgPSBpbnB1dC5jaGFyQXQoMiAqIGkgKyAxKTtcclxuXHRcdFx0dWFycmF5W2ldID0gdGhpcy5jaGFyVG9RdWFydGV0W2NoYXIwXSA8PCA0XHJcblx0XHRcdFx0XHR8IHRoaXMuY2hhclRvUXVhcnRldFtjaGFyMV07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdWFycmF5O1xyXG5cdH0sXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNBcnJheSh2YWx1ZSk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkhleEJpbmFyeSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkhleEJpbmFyeS5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5IZXhCaW5hcnkoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuSGV4QmluYXJ5LklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChcclxuXHRcdEpzb25peC5TY2hlbWEuWFNELkhleEJpbmFyeS5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk51bWJlciA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlLCB7XHJcblx0bmFtZSA6ICdOdW1iZXInLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ251bWJlcicpLFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVOdW1iZXJPck5hTih2YWx1ZSk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc05hTih2YWx1ZSkpIHtcclxuXHRcdFx0cmV0dXJuICdOYU4nO1xyXG5cdFx0fSBlbHNlIGlmICh2YWx1ZSA9PT0gSW5maW5pdHkpIHtcclxuXHRcdFx0cmV0dXJuICdJTkYnO1xyXG5cdFx0fSBlbHNlIGlmICh2YWx1ZSA9PT0gLUluZmluaXR5KSB7XHJcblx0XHRcdHJldHVybiAnLUlORic7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgdGV4dCA9IFN0cmluZyh2YWx1ZSk7XHJcblx0XHRcdHJldHVybiB0ZXh0O1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cGFyc2UgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHRpZiAodGV4dCA9PT0gJy1JTkYnKSB7XHJcblx0XHRcdHJldHVybiAtSW5maW5pdHk7XHJcblx0XHR9IGVsc2UgaWYgKHRleHQgPT09ICdJTkYnKSB7XHJcblx0XHRcdHJldHVybiBJbmZpbml0eTtcclxuXHRcdH0gZWxzZSBpZiAodGV4dCA9PT0gJ05hTicpIHtcclxuXHRcdFx0cmV0dXJuIE5hTjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciB2YWx1ZSA9IE51bWJlcih0ZXh0KTtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcih2YWx1ZSk7XHJcblx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyT3JOYU4odmFsdWUpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5OdW1iZXInXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5OdW1iZXIuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTnVtYmVyKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELk51bWJlci5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuTnVtYmVyLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRmxvYXQgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuTnVtYmVyLCB7XHJcblx0bmFtZSA6ICdGbG9hdCcsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnZmxvYXQnKSxcclxuXHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gSnNvbml4LlV0aWwuVHlwZS5pc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IC1JbmZpbml0eSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkgfHwgKEpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIodmFsdWUpICYmIHZhbHVlID49IHRoaXMuTUlOX1ZBTFVFICYmIHZhbHVlIDw9IHRoaXMuTUFYX1ZBTFVFKTtcclxuXHR9LFxyXG5cdE1JTl9WQUxVRSA6IC0zLjQwMjgyMzVlKzM4LFxyXG5cdE1BWF9WQUxVRSA6IDMuNDAyODIzNWUrMzgsXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5GbG9hdCdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkZsb2F0LklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkZsb2F0KCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkZsb2F0LklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5GbG9hdC5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRlY2ltYWwgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZSwge1xyXG5cdG5hbWUgOiAnRGVjaW1hbCcsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnZGVjaW1hbCcpLFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVOdW1iZXIodmFsdWUpO1xyXG5cdFx0dmFyIHRleHQgPSBTdHJpbmcodmFsdWUpO1xyXG5cdFx0cmV0dXJuIHRleHQ7XHJcblx0fSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0ZXh0KTtcclxuXHRcdHZhciB2YWx1ZSA9IE51bWJlcih0ZXh0KTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVOdW1iZXIodmFsdWUpO1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH0sXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIodmFsdWUpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5EZWNpbWFsJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRGVjaW1hbC5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5EZWNpbWFsKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRlY2ltYWwuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkRlY2ltYWwuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5JbnRlZ2VyID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUsIHtcclxuXHRuYW1lIDogJ0ludGVnZXInLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2ludGVnZXInKSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZSk7XHJcblx0XHR2YXIgdGV4dCA9IFN0cmluZyh2YWx1ZSk7XHJcblx0XHRyZXR1cm4gdGV4dDtcclxuXHR9LFxyXG5cdHBhcnNlIDogZnVuY3Rpb24odGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHRleHQpO1xyXG5cdFx0dmFyIHZhbHVlID0gTnVtYmVyKHRleHQpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUpO1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH0sXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZSkgJiYgdmFsdWUgPj0gdGhpcy5NSU5fVkFMVUUgJiYgdmFsdWUgPD0gdGhpcy5NQVhfVkFMVUU7XHJcblx0fSxcclxuXHRNSU5fVkFMVUUgOiAtOTIyMzM3MjAzNjg1NDc3NTgwOCxcclxuXHRNQVhfVkFMVUUgOiA5MjIzMzcyMDM2ODU0Nzc1ODA3LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuSW50ZWdlcidcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkludGVnZXIuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuSW50ZWdlcigpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5JbnRlZ2VyLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5JbnRlZ2VyLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTm9uUG9zaXRpdmVJbnRlZ2VyID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkludGVnZXIsIHtcclxuXHRuYW1lIDogJ05vblBvc2l0aXZlSW50ZWdlcicsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnbm9uUG9zaXRpdmVJbnRlZ2VyJyksXHJcblx0TUlOX1ZBTFVFOiAtOTIyMzM3MjAzNjg1NDc3NTgwOCxcclxuXHRNQVhfVkFMVUU6IDAsXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5Ob25Qb3NpdGl2ZUludGVnZXInXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Ob25Qb3NpdGl2ZUludGVnZXIuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTm9uUG9zaXRpdmVJbnRlZ2VyKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5vblBvc2l0aXZlSW50ZWdlci5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoXHJcblx0XHRKc29uaXguU2NoZW1hLlhTRC5Ob25Qb3NpdGl2ZUludGVnZXIuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5OZWdhdGl2ZUludGVnZXIgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuTm9uUG9zaXRpdmVJbnRlZ2VyLCB7XHJcblx0bmFtZSA6ICdOZWdhdGl2ZUludGVnZXInLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ25lZ2F0aXZlSW50ZWdlcicpLFxyXG5cdE1JTl9WQUxVRTogLTkyMjMzNzIwMzY4NTQ3NzU4MDgsXHJcblx0TUFYX1ZBTFVFOiAtMSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELk5lZ2F0aXZlSW50ZWdlcidcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5lZ2F0aXZlSW50ZWdlci5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5OZWdhdGl2ZUludGVnZXIoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTmVnYXRpdmVJbnRlZ2VyLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChcclxuXHRcdEpzb25peC5TY2hlbWEuWFNELk5lZ2F0aXZlSW50ZWdlci5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkxvbmcgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuSW50ZWdlciwge1xyXG5cdG5hbWUgOiAnTG9uZycsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnbG9uZycpLFxyXG5cdE1JTl9WQUxVRSA6IC05MjIzMzcyMDM2ODU0Nzc1ODA4LFxyXG5cdE1BWF9WQUxVRSA6IDkyMjMzNzIwMzY4NTQ3NzU4MDcsXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5Mb25nJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTG9uZy5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5Mb25nKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkxvbmcuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KFxyXG5cdFx0SnNvbml4LlNjaGVtYS5YU0QuTG9uZy5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkludCA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5Mb25nLCB7XHJcblx0bmFtZSA6ICdJbnQnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2ludCcpLFxyXG5cdE1JTl9WQUxVRSA6IC0yMTQ3NDgzNjQ4LFxyXG5cdE1BWF9WQUxVRSA6IDIxNDc0ODM2NDcsXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5JbnQnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5JbnQuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuSW50KCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkludC5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoXHJcblx0XHRKc29uaXguU2NoZW1hLlhTRC5JbnQuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5TaG9ydCA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5JbnQsIHtcclxuXHRuYW1lIDogJ1Nob3J0JyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdzaG9ydCcpLFxyXG5cdE1JTl9WQUxVRSA6IC0zMjc2OCxcclxuXHRNQVhfVkFMVUUgOiAzMjc2NyxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELlNob3J0J1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuU2hvcnQuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuU2hvcnQoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuU2hvcnQuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELlNob3J0LklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQnl0ZSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5TaG9ydCwge1xyXG5cdG5hbWUgOiAnQnl0ZScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnYnl0ZScpLFxyXG5cdE1JTl9WQUxVRSA6IC0xMjgsXHJcblx0TUFYX1ZBTFVFIDogMTI3LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuQnl0ZSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkJ5dGUuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuQnl0ZSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5CeXRlLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5CeXRlLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTm9uTmVnYXRpdmVJbnRlZ2VyID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkludGVnZXIsIHtcclxuXHRuYW1lIDogJ05vbk5lZ2F0aXZlSW50ZWdlcicsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnbm9uTmVnYXRpdmVJbnRlZ2VyJyksXHJcblx0TUlOX1ZBTFVFOiAwLFxyXG5cdE1BWF9WQUxVRTogOTIyMzM3MjAzNjg1NDc3NTgwNyxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELk5vbk5lZ2F0aXZlSW50ZWdlcidcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5vbk5lZ2F0aXZlSW50ZWdlci5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5Ob25OZWdhdGl2ZUludGVnZXIoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTm9uTmVnYXRpdmVJbnRlZ2VyLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChcclxuXHRcdEpzb25peC5TY2hlbWEuWFNELk5vbk5lZ2F0aXZlSW50ZWdlci5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkTG9uZyA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5Ob25OZWdhdGl2ZUludGVnZXIsIHtcclxuXHRuYW1lIDogJ1Vuc2lnbmVkTG9uZycsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgndW5zaWduZWRMb25nJyksXHJcblx0TUlOX1ZBTFVFIDogMCxcclxuXHRNQVhfVkFMVUUgOiAxODQ0Njc0NDA3MzcwOTU1MTYxNSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkTG9uZydcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkTG9uZy5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZExvbmcoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRMb25nLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZExvbmcuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZEludCA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZExvbmcsIHtcclxuXHRuYW1lIDogJ1Vuc2lnbmVkSW50JyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCd1bnNpZ25lZEludCcpLFxyXG5cdE1JTl9WQUxVRSA6IDAsXHJcblx0TUFYX1ZBTFVFIDogNDI5NDk2NzI5NSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkSW50J1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRJbnQuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRJbnQoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRJbnQuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkSW50LklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRTaG9ydCA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZEludCwge1xyXG5cdG5hbWUgOiAnVW5zaWduZWRTaG9ydCcsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgndW5zaWduZWRTaG9ydCcpLFxyXG5cdE1JTl9WQUxVRSA6IDAsXHJcblx0TUFYX1ZBTFVFIDogNjU1MzUsXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZFNob3J0J1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRTaG9ydC5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZFNob3J0KCk7XHJcbkpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkU2hvcnQuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkU2hvcnQuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZEJ5dGUgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRTaG9ydCwge1xyXG5cdG5hbWUgOiAnVW5zaWduZWRCeXRlJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCd1bnNpZ25lZEJ5dGUnKSxcclxuXHRNSU5fVkFMVUUgOiAwLFxyXG5cdE1BWF9WQUxVRSA6IDI1NSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkQnl0ZSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkQnl0ZS5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZEJ5dGUoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRCeXRlLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZEJ5dGUuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Qb3NpdGl2ZUludGVnZXIgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuTm9uTmVnYXRpdmVJbnRlZ2VyLCB7XHJcblx0bmFtZSA6ICdQb3NpdGl2ZUludGVnZXInLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ3Bvc2l0aXZlSW50ZWdlcicpLFxyXG5cdE1JTl9WQUxVRSA6IDEsXHJcblx0TUFYX1ZBTFVFIDogOTIyMzM3MjAzNjg1NDc3NTgwNyxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELlBvc2l0aXZlSW50ZWdlcidcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlBvc2l0aXZlSW50ZWdlci5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5Qb3NpdGl2ZUludGVnZXIoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuUG9zaXRpdmVJbnRlZ2VyLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5Qb3NpdGl2ZUludGVnZXIuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Eb3VibGUgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuTnVtYmVyLCB7XHJcblx0bmFtZSA6ICdEb3VibGUnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2RvdWJsZScpLFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gLUluZmluaXR5IHx8IHZhbHVlID09PSBJbmZpbml0eSB8fCAoSnNvbml4LlV0aWwuVHlwZS5pc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgPj0gdGhpcy5NSU5fVkFMVUUgJiYgdmFsdWUgPD0gdGhpcy5NQVhfVkFMVUUpO1xyXG5cdH0sXHJcblx0TUlOX1ZBTFVFIDogLTEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4LFxyXG5cdE1BWF9WQUxVRSA6IDEuNzk3NjkzMTM0ODYyMzE1N2UrMzA4LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuRG91YmxlJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRG91YmxlLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkRvdWJsZSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Eb3VibGUuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkRvdWJsZS5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkFueVVSSSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlLCB7XHJcblx0bmFtZSA6ICdBbnlVUkknLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2FueVVSSScpLFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodmFsdWUpO1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH0sXHJcblx0cGFyc2UgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHRyZXR1cm4gdGV4dDtcclxuXHR9LFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHZhbHVlKTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuQW55VVJJJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQW55VVJJLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkFueVVSSSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5BbnlVUkkuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkFueVVSSS5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlFOYW1lID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUsIHtcclxuXHRuYW1lIDogJ1FOYW1lJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdRTmFtZScpLFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciBxTmFtZSA9IEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdCh2YWx1ZSk7XHJcblx0XHR2YXIgcHJlZml4O1xyXG5cdFx0dmFyIGxvY2FsUGFydCA9IHFOYW1lLmxvY2FsUGFydDtcclxuXHRcdGlmIChvdXRwdXQpIHtcclxuXHRcdFx0Ly8gSWYgUU5hbWUgZG9lcyBub3QgcHJvdmlkZSB0aGUgcHJlZml4LCBsZXQgaXQgYmUgZ2VuZXJhdGVkXHJcblx0XHRcdHByZWZpeCA9IG91dHB1dC5nZXRQcmVmaXgocU5hbWUubmFtZXNwYWNlVVJJLCBxTmFtZS5wcmVmaXh8fG51bGwpO1xyXG5cdFx0XHRvdXRwdXQuZGVjbGFyZU5hbWVzcGFjZShxTmFtZS5uYW1lc3BhY2VVUkksIHByZWZpeCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRwcmVmaXggPSBxTmFtZS5wcmVmaXg7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gIXByZWZpeCA/IGxvY2FsUGFydCA6IChwcmVmaXggKyAnOicgKyBsb2NhbFBhcnQpO1xyXG5cdH0sXHJcblx0cGFyc2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHZhbHVlKTtcclxuXHRcdHZhbHVlID0gSnNvbml4LlV0aWwuU3RyaW5nVXRpbHMudHJpbSh2YWx1ZSk7XHJcblx0XHR2YXIgcHJlZml4O1xyXG5cdFx0dmFyIGxvY2FsUGFydDtcclxuXHRcdHZhciBjb2xvblBvc2l0aW9uID0gdmFsdWUuaW5kZXhPZignOicpO1xyXG5cdFx0aWYgKGNvbG9uUG9zaXRpb24gPT09IC0xKSB7XHJcblx0XHRcdHByZWZpeCA9ICcnO1xyXG5cdFx0XHRsb2NhbFBhcnQgPSB2YWx1ZTtcclxuXHRcdH0gZWxzZSBpZiAoY29sb25Qb3NpdGlvbiA+IDAgJiYgY29sb25Qb3NpdGlvbiA8ICh2YWx1ZS5sZW5ndGggLSAxKSkge1xyXG5cdFx0XHRwcmVmaXggPSB2YWx1ZS5zdWJzdHJpbmcoMCwgY29sb25Qb3NpdGlvbik7XHJcblx0XHRcdGxvY2FsUGFydCA9IHZhbHVlLnN1YnN0cmluZyhjb2xvblBvc2l0aW9uICsgMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgUU5hbWUgWycgKyB2YWx1ZSArICddLicpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIG5hbWVzcGFjZUNvbnRleHQgPSBpbnB1dCB8fCBjb250ZXh0IHx8IG51bGw7XHJcblx0XHRpZiAoIW5hbWVzcGFjZUNvbnRleHQpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiB2YWx1ZTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0dmFyIG5hbWVzcGFjZVVSSSA9IG5hbWVzcGFjZUNvbnRleHQuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCk7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKG5hbWVzcGFjZVVSSSkpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IEpzb25peC5YTUwuUU5hbWUobmFtZXNwYWNlVVJJLCBsb2NhbFBhcnQsIHByZWZpeCk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdQcmVmaXggWycgKyBwcmVmaXggKyAnXSBvZiB0aGUgUU5hbWUgWycgKyB2YWx1ZSArICddIGlzIG5vdCBib3VuZCBpbiB0aGlzIGNvbnRleHQuJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiAodmFsdWUgaW5zdGFuY2VvZiBKc29uaXguWE1MLlFOYW1lKSB8fCAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh2YWx1ZSkgJiYgSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh2YWx1ZS5sb2NhbFBhcnQgfHwgdmFsdWUubHApKTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuUU5hbWUnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5RTmFtZS5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5RTmFtZSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5RTmFtZS5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoXHJcblx0XHRKc29uaXguU2NoZW1hLlhTRC5RTmFtZS5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUsIHtcclxuXHRuYW1lIDogJ0NhbGVuZGFyJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdjYWxlbmRhcicpLFxyXG5cdHBhcnNlIDogZnVuY3Rpb24odGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHRleHQpO1xyXG5cdFx0aWYgKHRleHQubWF0Y2gobmV3IFJlZ0V4cChcIl5cIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkRBVEVUSU1FX1BBVFRFUk4gKyBcIiRcIikpKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlRGF0ZVRpbWUodGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHRcdH0gZWxzZSBpZiAodGV4dC5tYXRjaChuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFURV9QQVRURVJOICsgXCIkXCIpKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZURhdGUodGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHRcdH0gZWxzZSBpZiAodGV4dC5tYXRjaChuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuVElNRV9QQVRURVJOICsgXCIkXCIpKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZVRpbWUodGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHRcdH0gZWxzZSBpZiAodGV4dC5tYXRjaChuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR1lFQVJfTU9OVEhfUEFUVEVSTiArIFwiJFwiKSkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VHWWVhck1vbnRoKHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSk7XHJcblx0XHR9IGVsc2UgaWYgKHRleHQubWF0Y2gobmV3IFJlZ0V4cChcIl5cIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkdZRUFSX1BBVFRFUk4gKyBcIiRcIikpKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlR1llYXIodGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHRcdH0gZWxzZSBpZiAodGV4dC5tYXRjaChuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR01PTlRIX0RBWV9QQVRURVJOICsgXCIkXCIpKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUdNb250aERheSh0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0fSBlbHNlIGlmICh0ZXh0Lm1hdGNoKG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5HTU9OVEhfUEFUVEVSTiArIFwiJFwiKSkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VHTW9udGgodGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHRcdH0gZWxzZSBpZiAodGV4dC5tYXRjaChuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR0RBWV9QQVRURVJOICsgXCIkXCIpKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUdEYXkodGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignVmFsdWUgWycgKyB0ZXh0ICsgJ10gZG9lcyBub3QgbWF0Y2ggeHM6ZGF0ZVRpbWUsIHhzOmRhdGUsIHhzOnRpbWUsIHhzOmdZZWFyTW9udGgsIHhzOmdZZWFyLCB4czpnTW9udGhEYXksIHhzOmdNb250aCBvciB4czpnRGF5IHBhdHRlcm5zLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cGFyc2VHWWVhck1vbnRoIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIGdZZWFyTW9udGhFeHByZXNzaW9uID0gbmV3IFJlZ0V4cChcIl5cIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkdZRUFSX01PTlRIX1BBVFRFUk4gKyBcIiRcIik7XHJcblx0XHR2YXIgcmVzdWx0cyA9IHZhbHVlLm1hdGNoKGdZZWFyTW9udGhFeHByZXNzaW9uKTtcclxuXHRcdGlmIChyZXN1bHRzICE9PSBudWxsKSB7XHJcblx0XHRcdHZhciBkYXRhID0ge1xyXG5cdFx0XHRcdHllYXIgOiBwYXJzZUludChyZXN1bHRzWzFdLCAxMCksXHJcblx0XHRcdFx0bW9udGggOiBwYXJzZUludChyZXN1bHRzWzVdLCAxMCksXHJcblx0XHRcdFx0dGltZXpvbmUgOiB0aGlzLnBhcnNlVGltZXpvbmVTdHJpbmcocmVzdWx0c1s3XSlcclxuXHRcdFx0fTtcclxuXHRcdFx0cmV0dXJuIG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHZhbHVlICsgJ10gZG9lcyBub3QgbWF0Y2ggdGhlIHhzOmdZZWFyTW9udGggcGF0dGVybi4nKTtcclxuXHR9LFxyXG5cdHBhcnNlR1llYXIgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgZ1llYXJFeHByZXNzaW9uID0gbmV3IFJlZ0V4cChcIl5cIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkdZRUFSX1BBVFRFUk4gKyBcIiRcIik7XHJcblx0XHR2YXIgcmVzdWx0cyA9IHZhbHVlLm1hdGNoKGdZZWFyRXhwcmVzc2lvbik7XHJcblx0XHRpZiAocmVzdWx0cyAhPT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgZGF0YSA9IHtcclxuXHRcdFx0XHR5ZWFyIDogcGFyc2VJbnQocmVzdWx0c1sxXSwgMTApLFxyXG5cdFx0XHRcdHRpbWV6b25lIDogdGhpcy5wYXJzZVRpbWV6b25lU3RyaW5nKHJlc3VsdHNbNV0pXHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiBuZXcgSnNvbml4LlhNTC5DYWxlbmRhcihkYXRhKTtcclxuXHRcdH1cclxuXHRcdHRocm93IG5ldyBFcnJvcignVmFsdWUgWycgKyB2YWx1ZSArICddIGRvZXMgbm90IG1hdGNoIHRoZSB4czpnWWVhciBwYXR0ZXJuLicpO1xyXG5cdH0sXHJcblx0cGFyc2VHTW9udGhEYXkgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgZ01vbnRoRGF5RXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5HTU9OVEhfREFZX1BBVFRFUk4gKyBcIiRcIik7XHJcblx0XHR2YXIgcmVzdWx0cyA9IHZhbHVlLm1hdGNoKGdNb250aERheUV4cHJlc3Npb24pO1xyXG5cdFx0aWYgKHJlc3VsdHMgIT09IG51bGwpIHtcclxuXHRcdFx0dmFyIGRhdGEgPSB7XHJcblx0XHRcdFx0bW9udGggOiBwYXJzZUludChyZXN1bHRzWzJdLCAxMCksXHJcblx0XHRcdFx0ZGF5IDogcGFyc2VJbnQocmVzdWx0c1szXSwgMTApLFxyXG5cdFx0XHRcdHRpbWV6b25lIDogdGhpcy5wYXJzZVRpbWV6b25lU3RyaW5nKHJlc3VsdHNbNV0pXHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiBuZXcgSnNvbml4LlhNTC5DYWxlbmRhcihkYXRhKTtcclxuXHRcdH1cclxuXHRcdHRocm93IG5ldyBFcnJvcignVmFsdWUgWycgKyB2YWx1ZSArICddIGRvZXMgbm90IG1hdGNoIHRoZSB4czpnTW9udGhEYXkgcGF0dGVybi4nKTtcclxuXHR9LFxyXG5cdHBhcnNlR01vbnRoIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIGdNb250aEV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR01PTlRIX1BBVFRFUk4gKyBcIiRcIik7XHJcblx0XHR2YXIgcmVzdWx0cyA9IHZhbHVlLm1hdGNoKGdNb250aEV4cHJlc3Npb24pO1xyXG5cdFx0aWYgKHJlc3VsdHMgIT09IG51bGwpIHtcclxuXHRcdFx0dmFyIGRhdGEgPSB7XHJcblx0XHRcdFx0bW9udGggOiBwYXJzZUludChyZXN1bHRzWzJdLCAxMCksXHJcblx0XHRcdFx0dGltZXpvbmUgOiB0aGlzLnBhcnNlVGltZXpvbmVTdHJpbmcocmVzdWx0c1szXSlcclxuXHRcdFx0fTtcclxuXHRcdFx0cmV0dXJuIG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHZhbHVlICsgJ10gZG9lcyBub3QgbWF0Y2ggdGhlIHhzOmdNb250aCBwYXR0ZXJuLicpO1xyXG5cdH0sXHJcblx0cGFyc2VHRGF5IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIGdEYXlFeHByZXNzaW9uID0gbmV3IFJlZ0V4cChcIl5cIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkdEQVlfUEFUVEVSTiArIFwiJFwiKTtcclxuXHRcdHZhciByZXN1bHRzID0gdmFsdWUubWF0Y2goZ0RheUV4cHJlc3Npb24pO1xyXG5cdFx0aWYgKHJlc3VsdHMgIT09IG51bGwpIHtcclxuXHRcdFx0dmFyIGRhdGEgPSB7XHJcblx0XHRcdFx0ZGF5IDogcGFyc2VJbnQocmVzdWx0c1syXSwgMTApLFxyXG5cdFx0XHRcdHRpbWV6b25lIDogdGhpcy5wYXJzZVRpbWV6b25lU3RyaW5nKHJlc3VsdHNbM10pXHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiBuZXcgSnNvbml4LlhNTC5DYWxlbmRhcihkYXRhKTtcclxuXHRcdH1cclxuXHRcdHRocm93IG5ldyBFcnJvcignVmFsdWUgWycgKyB2YWx1ZSArICddIGRvZXMgbm90IG1hdGNoIHRoZSB4czpnRGF5IHBhdHRlcm4uJyk7XHJcblx0fSxcclxuXHRwYXJzZURhdGVUaW1lIDogZnVuY3Rpb24odGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHRleHQpO1xyXG5cdFx0dmFyIGV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFURVRJTUVfUEFUVEVSTiArIFwiJFwiKTtcclxuXHRcdHZhciByZXN1bHRzID0gdGV4dC5tYXRjaChleHByZXNzaW9uKTtcclxuXHRcdGlmIChyZXN1bHRzICE9PSBudWxsKSB7XHJcblx0XHRcdHZhciBkYXRhID0ge1xyXG5cdFx0XHRcdHllYXIgOiBwYXJzZUludChyZXN1bHRzWzFdLCAxMCksXHJcblx0XHRcdFx0bW9udGggOiBwYXJzZUludChyZXN1bHRzWzVdLCAxMCksXHJcblx0XHRcdFx0ZGF5IDogcGFyc2VJbnQocmVzdWx0c1s3XSwgMTApLFxyXG5cdFx0XHRcdGhvdXIgOiBwYXJzZUludChyZXN1bHRzWzldLCAxMCksXHJcblx0XHRcdFx0bWludXRlIDogcGFyc2VJbnQocmVzdWx0c1sxMF0sIDEwKSxcclxuXHRcdFx0XHRzZWNvbmQgOiBwYXJzZUludChyZXN1bHRzWzExXSwgMTApLFxyXG5cdFx0XHRcdGZyYWN0aW9uYWxTZWNvbmQgOiAocmVzdWx0c1sxMl0gPyBwYXJzZUZsb2F0KHJlc3VsdHNbMTJdKSA6IDApLFxyXG5cdFx0XHRcdHRpbWV6b25lIDogdGhpcy5wYXJzZVRpbWV6b25lU3RyaW5nKHJlc3VsdHNbMTRdKVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXR1cm4gbmV3IEpzb25peC5YTUwuQ2FsZW5kYXIoZGF0YSk7XHJcblx0XHR9XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIFsnICsgdGV4dCArICddIGRvZXMgbm90IG1hdGNoIHRoZSB4czpkYXRlIHBhdHRlcm4uJyk7XHJcblx0fSxcclxuXHRwYXJzZURhdGUgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHR2YXIgZXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5EQVRFX1BBVFRFUk4gKyBcIiRcIik7XHJcblx0XHR2YXIgcmVzdWx0cyA9IHRleHQubWF0Y2goZXhwcmVzc2lvbik7XHJcblx0XHRpZiAocmVzdWx0cyAhPT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgZGF0YSA9IHtcclxuXHRcdFx0XHR5ZWFyIDogcGFyc2VJbnQocmVzdWx0c1sxXSwgMTApLFxyXG5cdFx0XHRcdG1vbnRoIDogcGFyc2VJbnQocmVzdWx0c1s1XSwgMTApLFxyXG5cdFx0XHRcdGRheSA6IHBhcnNlSW50KHJlc3VsdHNbN10sIDEwKSxcclxuXHRcdFx0XHR0aW1lem9uZSA6IHRoaXMucGFyc2VUaW1lem9uZVN0cmluZyhyZXN1bHRzWzldKVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXR1cm4gbmV3IEpzb25peC5YTUwuQ2FsZW5kYXIoZGF0YSk7XHJcblx0XHR9XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIFsnICsgdGV4dCArICddIGRvZXMgbm90IG1hdGNoIHRoZSB4czpkYXRlIHBhdHRlcm4uJyk7XHJcblx0fSxcclxuXHRwYXJzZVRpbWUgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHR2YXIgZXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FX1BBVFRFUk4gKyBcIiRcIik7XHJcblx0XHR2YXIgcmVzdWx0cyA9IHRleHQubWF0Y2goZXhwcmVzc2lvbik7XHJcblx0XHRpZiAocmVzdWx0cyAhPT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgZGF0YSA9IHtcclxuXHRcdFx0XHRob3VyIDogcGFyc2VJbnQocmVzdWx0c1sxXSwgMTApLFxyXG5cdFx0XHRcdG1pbnV0ZSA6IHBhcnNlSW50KHJlc3VsdHNbMl0sIDEwKSxcclxuXHRcdFx0XHRzZWNvbmQgOiBwYXJzZUludChyZXN1bHRzWzNdLCAxMCksXHJcblx0XHRcdFx0ZnJhY3Rpb25hbFNlY29uZCA6IChyZXN1bHRzWzRdID8gcGFyc2VGbG9hdChyZXN1bHRzWzRdKSA6IDApLFxyXG5cdFx0XHRcdHRpbWV6b25lIDogdGhpcy5wYXJzZVRpbWV6b25lU3RyaW5nKHJlc3VsdHNbNl0pXHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiBuZXcgSnNvbml4LlhNTC5DYWxlbmRhcihkYXRhKTtcclxuXHRcdH1cclxuXHRcdHRocm93IG5ldyBFcnJvcignVmFsdWUgWycgKyB0ZXh0ICsgJ10gZG9lcyBub3QgbWF0Y2ggdGhlIHhzOnRpbWUgcGF0dGVybi4nKTtcclxuXHR9LFxyXG5cdHBhcnNlVGltZXpvbmVTdHJpbmcgOiBmdW5jdGlvbih0ZXh0KSB7XHJcblx0XHQvLyAoKCcrJyB8ICctJykgaGggJzonIG1tKSB8ICdaJ1xyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHRleHQpKSB7XHJcblx0XHRcdHJldHVybiBOYU47XHJcblx0XHR9IGVsc2UgaWYgKHRleHQgPT09ICcnKSB7XHJcblx0XHRcdHJldHVybiBOYU47XHJcblx0XHR9IGVsc2UgaWYgKHRleHQgPT09ICdaJykge1xyXG5cdFx0XHRyZXR1cm4gMDtcclxuXHRcdH0gZWxzZSBpZiAodGV4dCA9PT0gJysxNDowMCcpIHtcclxuXHRcdFx0cmV0dXJuIDE0ICogNjA7XHJcblx0XHR9IGVsc2UgaWYgKHRleHQgPT09ICctMTQ6MDAnKSB7XHJcblx0XHRcdHJldHVybiAtMTQgKiA2MDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBleHByZXNzaW9uID0gbmV3IFJlZ0V4cChcIl5cIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlRJTUVaT05FX1BBVFRFUk4gKyBcIiRcIik7XHJcblx0XHRcdHZhciByZXN1bHRzID0gdGV4dC5tYXRjaChleHByZXNzaW9uKTtcclxuXHRcdFx0aWYgKHJlc3VsdHMgIT09IG51bGwpIHtcclxuXHRcdFx0XHR2YXIgc2lnbiA9IHJlc3VsdHNbMV0gPT09ICcrJyA/IDEgOiAtMTtcclxuXHRcdFx0XHR2YXIgaG91ciA9IHBhcnNlSW50KHJlc3VsdHNbNF0sIDEwKTtcclxuXHRcdFx0XHR2YXIgbWludXRlID0gcGFyc2VJbnQocmVzdWx0c1s1XSwgMTApO1xyXG5cdFx0XHRcdHJldHVybiBzaWduICogKGhvdXIgKiA2MCArIG1pbnV0ZSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHRleHQgKyAnXSBkb2VzIG5vdCBtYXRjaCB0aGUgdGltZXpvbmUgcGF0dGVybi4nKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS55ZWFyKSAmJiBKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUubW9udGgpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5kYXkpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5ob3VyKSAmJiBKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUubWludXRlKSAmJiBKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUuc2Vjb25kKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wcmludERhdGVUaW1lKHZhbHVlKTtcclxuXHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLnllYXIpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5tb250aCkgJiYgSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLmRheSkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnREYXRlKHZhbHVlKTtcclxuXHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLmhvdXIpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5taW51dGUpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5zZWNvbmQpKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnByaW50VGltZSh2YWx1ZSk7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS55ZWFyKSAmJiBKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUubW9udGgpKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnByaW50R1llYXJNb250aCh2YWx1ZSk7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5tb250aCkgJiYgSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLmRheSkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnRHTW9udGhEYXkodmFsdWUpO1xyXG5cdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUueWVhcikpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnRHWWVhcih2YWx1ZSk7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5tb250aCkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnRHTW9udGgodmFsdWUpO1xyXG5cdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUuZGF5KSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wcmludEdEYXkodmFsdWUpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHZhbHVlICsgJ10gaXMgbm90IHJlY29nbml6ZWQgYXMgZGF0ZVRpbWUsIGRhdGUgb3IgdGltZS4nKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHByaW50RGF0ZVRpbWUgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdCh2YWx1ZSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZS55ZWFyKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLm1vbnRoKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLmRheSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZS5ob3VyKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLm1pbnV0ZSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlTnVtYmVyKHZhbHVlLnNlY29uZCk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUuZnJhY3Rpb25hbFN0cmluZykpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcih2YWx1ZS5mcmFjdGlvbmFsU3RyaW5nKTtcclxuXHRcdH1cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS50aW1lem9uZSkgJiYgIUpzb25peC5VdGlsLlR5cGUuaXNOYU4odmFsdWUudGltZXpvbmUpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLnRpbWV6b25lKTtcclxuXHRcdH1cclxuXHRcdHZhciByZXN1bHQgPSB0aGlzLnByaW50RGF0ZVN0cmluZyh2YWx1ZSk7XHJcblx0XHRyZXN1bHQgPSByZXN1bHQgKyAnVCc7XHJcblx0XHRyZXN1bHQgPSByZXN1bHQgKyB0aGlzLnByaW50VGltZVN0cmluZyh2YWx1ZSk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUudGltZXpvbmUpKSB7XHJcblx0XHRcdHJlc3VsdCA9IHJlc3VsdCArIHRoaXMucHJpbnRUaW1lem9uZVN0cmluZyh2YWx1ZS50aW1lem9uZSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblx0cHJpbnREYXRlIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcih2YWx1ZS55ZWFyKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVOdW1iZXIodmFsdWUubW9udGgpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcih2YWx1ZS5kYXkpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLnRpbWV6b25lKSAmJiAhSnNvbml4LlV0aWwuVHlwZS5pc05hTih2YWx1ZS50aW1lem9uZSkpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUudGltZXpvbmUpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHJlc3VsdCA9IHRoaXMucHJpbnREYXRlU3RyaW5nKHZhbHVlKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS50aW1lem9uZSkpIHtcclxuXHRcdFx0cmVzdWx0ID0gcmVzdWx0ICsgdGhpcy5wcmludFRpbWV6b25lU3RyaW5nKHZhbHVlLnRpbWV6b25lKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRwcmludFRpbWUgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdCh2YWx1ZSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlTnVtYmVyKHZhbHVlLmhvdXIpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcih2YWx1ZS5taW51dGUpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcih2YWx1ZS5zZWNvbmQpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLmZyYWN0aW9uYWxTdHJpbmcpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVOdW1iZXIodmFsdWUuZnJhY3Rpb25hbFN0cmluZyk7XHJcblx0XHR9XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUudGltZXpvbmUpICYmICFKc29uaXguVXRpbC5UeXBlLmlzTmFOKHZhbHVlLnRpbWV6b25lKSkge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZS50aW1lem9uZSk7XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIHJlc3VsdCA9IHRoaXMucHJpbnRUaW1lU3RyaW5nKHZhbHVlKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS50aW1lem9uZSkpIHtcclxuXHRcdFx0cmVzdWx0ID0gcmVzdWx0ICsgdGhpcy5wcmludFRpbWV6b25lU3RyaW5nKHZhbHVlLnRpbWV6b25lKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRwcmludERhdGVTdHJpbmcgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdCh2YWx1ZSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZS55ZWFyKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLm1vbnRoKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLmRheSk7XHJcblx0XHRyZXR1cm4gKHZhbHVlLnllYXIgPCAwID8gKCctJyArIHRoaXMucHJpbnRZZWFyKC12YWx1ZS55ZWFyKSkgOiB0aGlzLnByaW50WWVhcih2YWx1ZS55ZWFyKSkgKyAnLScgKyB0aGlzLnByaW50TW9udGgodmFsdWUubW9udGgpICsgJy0nICsgdGhpcy5wcmludERheSh2YWx1ZS5kYXkpO1xyXG5cdH0sXHJcblx0cHJpbnRUaW1lU3RyaW5nIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUuaG91cik7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZS5taW51dGUpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUuc2Vjb25kKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5mcmFjdGlvbmFsU2Vjb25kKSkge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlTnVtYmVyKHZhbHVlLmZyYWN0aW9uYWxTZWNvbmQpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHJlc3VsdCA9IHRoaXMucHJpbnRIb3VyKHZhbHVlLmhvdXIpO1xyXG5cdFx0cmVzdWx0ID0gcmVzdWx0ICsgJzonO1xyXG5cdFx0cmVzdWx0ID0gcmVzdWx0ICsgdGhpcy5wcmludE1pbnV0ZSh2YWx1ZS5taW51dGUpO1xyXG5cdFx0cmVzdWx0ID0gcmVzdWx0ICsgJzonO1xyXG5cdFx0cmVzdWx0ID0gcmVzdWx0ICsgdGhpcy5wcmludFNlY29uZCh2YWx1ZS5zZWNvbmQpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLmZyYWN0aW9uYWxTZWNvbmQpKSB7XHJcblx0XHRcdHJlc3VsdCA9IHJlc3VsdCArIHRoaXMucHJpbnRGcmFjdGlvbmFsU2Vjb25kKHZhbHVlLmZyYWN0aW9uYWxTZWNvbmQpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdHByaW50VGltZXpvbmVTdHJpbmcgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZSkgfHwgSnNvbml4LlV0aWwuVHlwZS5pc05hTih2YWx1ZSkpIHtcclxuXHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUpO1xyXG5cclxuXHRcdFx0dmFyIHNpZ24gPSB2YWx1ZSA8IDAgPyAtMSA6ICh2YWx1ZSA+IDAgPyAxIDogMCk7XHJcblx0XHRcdHZhciBkYXRhID0gdmFsdWUgKiBzaWduO1xyXG5cdFx0XHR2YXIgbWludXRlID0gZGF0YSAlIDYwO1xyXG5cdFx0XHR2YXIgaG91ciA9IE1hdGguZmxvb3IoZGF0YSAvIDYwKTtcclxuXHJcblx0XHRcdHZhciByZXN1bHQ7XHJcblx0XHRcdGlmIChzaWduID09PSAwKSB7XHJcblx0XHRcdFx0cmV0dXJuICdaJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoc2lnbiA+IDApIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9ICcrJztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKHNpZ24gPCAwKSB7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSAnLSc7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJlc3VsdCA9IHJlc3VsdCArIHRoaXMucHJpbnRIb3VyKGhvdXIpO1xyXG5cdFx0XHRcdHJlc3VsdCA9IHJlc3VsdCArICc6JztcclxuXHRcdFx0XHRyZXN1bHQgPSByZXN1bHQgKyB0aGlzLnByaW50TWludXRlKG1pbnV0ZSk7XHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cHJpbnRHRGF5IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUpO1xyXG5cdFx0dmFyIGRheSA9IHVuZGVmaW5lZDtcclxuXHRcdHZhciB0aW1lem9uZSA9IHVuZGVmaW5lZDtcclxuXHJcblx0XHRpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XHJcblx0XHRcdGRheSA9IHZhbHVlLmdldERhdGUoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLmRheSk7XHJcblx0XHRcdGRheSA9IHZhbHVlLmRheTtcclxuXHRcdFx0dGltZXpvbmUgPSB2YWx1ZS50aW1lem9uZTtcclxuXHRcdH1cclxuXHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVEYXkoZGF5KTtcclxuXHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVUaW1lem9uZSh0aW1lem9uZSk7XHJcblx0XHRyZXR1cm4gXCItLS1cIiArIHRoaXMucHJpbnREYXkoZGF5KSArIHRoaXMucHJpbnRUaW1lem9uZVN0cmluZyh0aW1lem9uZSk7XHJcblx0fSxcclxuXHRwcmludEdNb250aCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHZhbHVlKTtcclxuXHRcdHZhciBtb250aCA9IHVuZGVmaW5lZDtcclxuXHRcdHZhciB0aW1lem9uZSA9IHVuZGVmaW5lZDtcclxuXHJcblx0XHRpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XHJcblx0XHRcdG1vbnRoID0gdmFsdWUuZ2V0TW9udGgoKSArIDE7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZS5tb250aCk7XHJcblx0XHRcdG1vbnRoID0gdmFsdWUubW9udGg7XHJcblx0XHRcdHRpbWV6b25lID0gdmFsdWUudGltZXpvbmU7XHJcblx0XHR9XHJcblx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlTW9udGgobW9udGgpO1xyXG5cdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVRpbWV6b25lKHRpbWV6b25lKTtcclxuXHRcdHJldHVybiBcIi0tXCIgKyB0aGlzLnByaW50TW9udGgobW9udGgpICsgdGhpcy5wcmludFRpbWV6b25lU3RyaW5nKHRpbWV6b25lKTtcclxuXHR9LFxyXG5cdHByaW50R01vbnRoRGF5IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUpO1xyXG5cdFx0dmFyIG1vbnRoID0gdW5kZWZpbmVkO1xyXG5cdFx0dmFyIGRheSA9IHVuZGVmaW5lZDtcclxuXHRcdHZhciB0aW1lem9uZSA9IHVuZGVmaW5lZDtcclxuXHJcblx0XHRpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XHJcblx0XHRcdG1vbnRoID0gdmFsdWUuZ2V0TW9udGgoKSArIDE7XHJcblx0XHRcdGRheSA9IHZhbHVlLmdldERhdGUoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLm1vbnRoKTtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUuZGF5KTtcclxuXHRcdFx0bW9udGggPSB2YWx1ZS5tb250aDtcclxuXHRcdFx0ZGF5ID0gdmFsdWUuZGF5O1xyXG5cdFx0XHR0aW1lem9uZSA9IHZhbHVlLnRpbWV6b25lO1xyXG5cdFx0fVxyXG5cdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZU1vbnRoRGF5KG1vbnRoLCBkYXkpO1xyXG5cdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVRpbWV6b25lKHRpbWV6b25lKTtcclxuXHRcdHJldHVybiBcIi0tXCIgKyB0aGlzLnByaW50TW9udGgobW9udGgpICsgXCItXCIgKyB0aGlzLnByaW50RGF5KGRheSkgKyB0aGlzLnByaW50VGltZXpvbmVTdHJpbmcodGltZXpvbmUpO1xyXG5cdH0sXHJcblx0cHJpbnRHWWVhciA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHZhbHVlKTtcclxuXHRcdHZhciB5ZWFyID0gdW5kZWZpbmVkO1xyXG5cdFx0dmFyIHRpbWV6b25lID0gdW5kZWZpbmVkO1xyXG5cclxuXHRcdGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcclxuXHRcdFx0eWVhciA9IHZhbHVlLmdldEZ1bGxZZWFyKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZS55ZWFyKTtcclxuXHRcdFx0eWVhciA9IHZhbHVlLnllYXI7XHJcblx0XHRcdHRpbWV6b25lID0gdmFsdWUudGltZXpvbmU7XHJcblx0XHR9XHJcblx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlWWVhcih5ZWFyKTtcclxuXHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVUaW1lem9uZSh0aW1lem9uZSk7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludFNpZ25lZFllYXIoeWVhcikgKyB0aGlzLnByaW50VGltZXpvbmVTdHJpbmcodGltZXpvbmUpO1xyXG5cdH0sXHJcblx0cHJpbnRHWWVhck1vbnRoIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUpO1xyXG5cdFx0dmFyIHllYXIgPSB1bmRlZmluZWQ7XHJcblx0XHR2YXIgbW9udGggPSB1bmRlZmluZWQ7XHJcblx0XHR2YXIgdGltZXpvbmUgPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0aWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xyXG5cdFx0XHR5ZWFyID0gdmFsdWUuZ2V0RnVsbFllYXIoKTtcclxuXHRcdFx0bW9udGggPSB2YWx1ZS5nZXRNb250aCgpICsgMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLnllYXIpO1xyXG5cdFx0XHR5ZWFyID0gdmFsdWUueWVhcjtcclxuXHRcdFx0bW9udGggPSB2YWx1ZS5tb250aDtcclxuXHRcdFx0dGltZXpvbmUgPSB2YWx1ZS50aW1lem9uZTtcclxuXHRcdH1cclxuXHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVZZWFyKHllYXIpO1xyXG5cdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZU1vbnRoKG1vbnRoKTtcclxuXHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVUaW1lem9uZSh0aW1lem9uZSk7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludFNpZ25lZFllYXIoeWVhcikgKyBcIi1cIiArIHRoaXMucHJpbnRNb250aChtb250aCkgKyB0aGlzLnByaW50VGltZXpvbmVTdHJpbmcodGltZXpvbmUpO1xyXG5cdH0sXHJcblx0cHJpbnRTaWduZWRZZWFyIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiB2YWx1ZSA8IDAgPyAoXCItXCIgKyB0aGlzLnByaW50WWVhcih2YWx1ZSAqIC0xKSkgOiAodGhpcy5wcmludFllYXIodmFsdWUpKTtcclxuXHR9LFxyXG5cdHByaW50WWVhciA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludEludGVnZXIodmFsdWUsIDQpO1xyXG5cdH0sXHJcblx0cHJpbnRNb250aCA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludEludGVnZXIodmFsdWUsIDIpO1xyXG5cdH0sXHJcblx0cHJpbnREYXkgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucHJpbnRJbnRlZ2VyKHZhbHVlLCAyKTtcclxuXHR9LFxyXG5cdHByaW50SG91ciA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludEludGVnZXIodmFsdWUsIDIpO1xyXG5cdH0sXHJcblx0cHJpbnRNaW51dGUgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucHJpbnRJbnRlZ2VyKHZhbHVlLCAyKTtcclxuXHR9LFxyXG5cdHByaW50U2Vjb25kIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByaW50SW50ZWdlcih2YWx1ZSwgMik7XHJcblx0fSxcclxuXHRwcmludEZyYWN0aW9uYWxTZWNvbmQgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcih2YWx1ZSk7XHJcblx0XHRpZiAodmFsdWUgPCAwIHx8IHZhbHVlID49IDEpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdGcmFjdGlvbmFsIHNlY29uZCBbJyArIHZhbHVlICsgJ10gbXVzdCBiZSBiZXR3ZWVuIDAgYW5kIDEuJyk7XHJcblx0XHR9IGVsc2UgaWYgKHZhbHVlID09PSAwKSB7XHJcblx0XHRcdHJldHVybiAnJztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBzdHJpbmcgPSBTdHJpbmcodmFsdWUpO1xyXG5cdFx0XHR2YXIgZG90SW5kZXggPSBzdHJpbmcuaW5kZXhPZignLicpO1xyXG5cdFx0XHRpZiAoZG90SW5kZXggPCAwKSB7XHJcblx0XHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBzdHJpbmcuc3Vic3RyaW5nKGRvdEluZGV4KTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0cHJpbnRJbnRlZ2VyIDogZnVuY3Rpb24odmFsdWUsIGxlbmd0aCkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIobGVuZ3RoKTtcclxuXHRcdGlmIChsZW5ndGggPD0gMCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0xlbmd0aCBbJyArIHZhbHVlICsgJ10gbXVzdCBiZSBwb3NpdGl2ZS4nKTtcclxuXHRcdH1cclxuXHRcdGlmICh2YWx1ZSA8IDApIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHZhbHVlICsgJ10gbXVzdCBub3QgYmUgbmVnYXRpdmUuJyk7XHJcblx0XHR9XHJcblx0XHR2YXIgcmVzdWx0ID0gU3RyaW5nKHZhbHVlKTtcclxuXHRcdGZvciAodmFyIGkgPSByZXN1bHQubGVuZ3RoOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0cmVzdWx0ID0gJzAnICsgcmVzdWx0O1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHZhbHVlKSAmJiAoKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS55ZWFyKSAmJiBKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUubW9udGgpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5kYXkpKSB8fCAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLmhvdXIpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5taW51dGUpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5zZWNvbmQpKSk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyJ1xyXG59KTtcclxuXHJcbkpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLllFQVJfUEFUVEVSTiA9IFwiLT8oWzEtOV1bMC05XSopPygoPyEoMDAwMCkpWzAtOV17NH0pXCI7XHJcbkpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlRJTUVaT05FX1BBVFRFUk4gPSBcIlp8KFtcXFxcLVxcXFwrXSkoKCgwWzAtOV18MVswLTNdKTooWzAtNV1bMC05XSkpfCgxNDowMCkpXCI7XHJcbkpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLk1PTlRIX1BBVFRFUk4gPSBcIigwWzEtOV18MVswLTJdKVwiO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5TSU5HTEVfTU9OVEhfUEFUVEVSTiA9IFwiXFxcXC1cXFxcLVwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuTU9OVEhfUEFUVEVSTjtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFZX1BBVFRFUk4gPSBcIigwWzEtOV18WzEyXVswLTldfDNbMDFdKVwiO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5TSU5HTEVfREFZX1BBVFRFUk4gPSBcIlxcXFwtXFxcXC1cXFxcLVwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFZX1BBVFRFUk47XHJcbkpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkdZRUFSX1BBVFRFUk4gPSBcIihcIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLllFQVJfUEFUVEVSTiArIFwiKVwiICsgXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FWk9ORV9QQVRURVJOICsgXCIpP1wiO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5HTU9OVEhfUEFUVEVSTiA9IFwiKFwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuU0lOR0xFX01PTlRIX1BBVFRFUk4gKyBcIilcIiArIFwiKFwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuVElNRVpPTkVfUEFUVEVSTiArIFwiKT9cIjtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR0RBWV9QQVRURVJOID0gXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5TSU5HTEVfREFZX1BBVFRFUk4gKyBcIilcIiArIFwiKFwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuVElNRVpPTkVfUEFUVEVSTiArIFwiKT9cIjtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR1lFQVJfTU9OVEhfUEFUVEVSTiA9IFwiKFwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuWUVBUl9QQVRURVJOICsgXCIpXCIgKyBcIi1cIiArIFwiKFwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFZX1BBVFRFUk4gKyBcIilcIiArIFwiKFwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuVElNRVpPTkVfUEFUVEVSTiArIFwiKT9cIjtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR01PTlRIX0RBWV9QQVRURVJOID0gXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5TSU5HTEVfTU9OVEhfUEFUVEVSTiArIFwiKVwiICsgXCItXCIgKyBcIihcIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkRBWV9QQVRURVJOICsgXCIpXCIgKyBcIihcIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlRJTUVaT05FX1BBVFRFUk4gKyBcIik/XCI7XHJcbkpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkRBVEVfUEFSVF9QQVRURVJOID0gXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5ZRUFSX1BBVFRFUk4gKyBcIilcIiArIFwiLVwiICsgXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5NT05USF9QQVRURVJOICsgXCIpXCIgKyBcIi1cIiArIFwiKFwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFZX1BBVFRFUk4gKyBcIilcIjtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuVElNRV9QQVJUX1BBVFRFUk4gPSBcIihbMC0xXVswLTldfDJbMC0zXSk6KFswLTVdWzAtOV0pOihbMC01XVswLTldKShcXFxcLihbMC05XSspKT9cIjtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuVElNRV9QQVRURVJOID0gSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuVElNRV9QQVJUX1BBVFRFUk4gKyAnKCcgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FWk9ORV9QQVRURVJOICsgJyk/JztcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFURV9QQVRURVJOID0gSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFURV9QQVJUX1BBVFRFUk4gKyAnKCcgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FWk9ORV9QQVRURVJOICsgJyk/JztcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFURVRJTUVfUEFUVEVSTiA9IEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkRBVEVfUEFSVF9QQVRURVJOICsgJ1QnICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuVElNRV9QQVJUX1BBVFRFUk4gKyAnKCcgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FWk9ORV9QQVRURVJOICsgJyk/JztcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRHVyYXRpb24gPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZSwge1xyXG5cdG5hbWUgOiAnRHVyYXRpb24nLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2R1cmF0aW9uJyksXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QodmFsdWUpICYmIChcclxuXHRcdFx0XHQoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUuc2lnbikgPyAodmFsdWUuc2lnbiA9PT0gLTEgfHwgdmFsdWUuc2lnbiA9PT0gMSkgOiB0cnVlKVxyXG5cdFx0XHRcdChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUueWVhcnMpICYmIHZhbHVlLnllYXJzID49MCkgfHxcclxuXHRcdFx0XHQoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLm1vbnRocykgJiYgdmFsdWUubW9udGhzID49MCkgfHxcclxuXHRcdFx0XHQoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLmRheXMpICYmIHZhbHVlLmRheXMgPj0gMCkgfHxcclxuXHRcdFx0XHQoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLmhvdXJzKSAmJiB2YWx1ZS5ob3VycyA+PSAwKSB8fFxyXG5cdFx0XHRcdChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUubWludXRlcykgJiYgdmFsdWUubWludXRlcyA+PSAwKSB8fFxyXG5cdFx0XHRcdChKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKHZhbHVlLnNlY29uZHMpICYmIHZhbHVlLnNlY29uZHMgPj0gMCkgKTtcclxuXHR9LFxyXG5cdHZhbGlkYXRlIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLnNpZ24pKSB7XHJcblx0XHRcdGlmICghKHZhbHVlLnNpZ24gPT09IDEgfHwgdmFsdWUuc2lnbiA9PT0gLTEpKSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiU2lnbiBvZiB0aGUgZHVyYXRpb24gW1wiICsgdmFsdWUuc2lnbiArIFwiXSBtdXN0IGJlIGVpdGhlciBbMV0gb3IgWy0xXS5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHZhciBlbXB0eSA9IHRydWU7XHJcblx0XHR2YXIgaWZFeGlzdHNFbnN1cmVVbnNpZ25lZEludGVnZXIgPSBmdW5jdGlvbih2LCBtZXNzYWdlKSB7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2KSkge1xyXG5cdFx0XHRcdGlmICghKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2KSAmJiB2ID49IDApKSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IobWVzc2FnZS5yZXBsYWNlKFwiezB9XCIsIHYpKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fTtcclxuXHRcdHZhciBpZkV4aXN0c0Vuc3VyZVVuc2lnbmVkTnVtYmVyID0gZnVuY3Rpb24odiwgbWVzc2FnZSkge1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModikpIHtcclxuXHRcdFx0XHRpZiAoIShKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKHYpICYmIHYgPj0gMCkpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihtZXNzYWdlLnJlcGxhY2UoXCJ7MH1cIiwgdikpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0ZW1wdHkgPSBlbXB0eSAmJiAhaWZFeGlzdHNFbnN1cmVVbnNpZ25lZEludGVnZXIodmFsdWUueWVhcnMsIFwiTnVtYmVyIG9mIHllYXJzIFt7MH1dIG11c3QgYmUgYW4gdW5zaWduZWQgaW50ZWdlci5cIik7XHJcblx0XHRlbXB0eSA9IGVtcHR5ICYmICFpZkV4aXN0c0Vuc3VyZVVuc2lnbmVkSW50ZWdlcih2YWx1ZS5tb250aHMsIFwiTnVtYmVyIG9mIG1vbnRocyBbezB9XSBtdXN0IGJlIGFuIHVuc2lnbmVkIGludGVnZXIuXCIpO1xyXG5cdFx0ZW1wdHkgPSBlbXB0eSAmJiAhaWZFeGlzdHNFbnN1cmVVbnNpZ25lZEludGVnZXIodmFsdWUuZGF5cywgXCJOdW1iZXIgb2YgZGF5cyBbezB9XSBtdXN0IGJlIGFuIHVuc2lnbmVkIGludGVnZXIuXCIpO1xyXG5cdFx0ZW1wdHkgPSBlbXB0eSAmJiAhaWZFeGlzdHNFbnN1cmVVbnNpZ25lZEludGVnZXIodmFsdWUuaG91cnMsIFwiTnVtYmVyIG9mIGhvdXJzIFt7MH1dIG11c3QgYmUgYW4gdW5zaWduZWQgaW50ZWdlci5cIik7XHJcblx0XHRlbXB0eSA9IGVtcHR5ICYmICFpZkV4aXN0c0Vuc3VyZVVuc2lnbmVkSW50ZWdlcih2YWx1ZS5taW51dGVzLCBcIk51bWJlciBvZiBtaW51dGVzIFt7MH1dIG11c3QgYmUgYW4gdW5zaWduZWQgaW50ZWdlci5cIik7XHJcblx0XHRlbXB0eSA9IGVtcHR5ICYmICFpZkV4aXN0c0Vuc3VyZVVuc2lnbmVkTnVtYmVyKHZhbHVlLnNlY29uZHMsIFwiTnVtYmVyIG9mIHNlY29uZHMgW3swfV0gbXVzdCBiZSBhbiB1bnNpZ25lZCBudW1iZXIuXCIpO1xyXG5cdFx0aWYgKGVtcHR5KSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkF0IGxlYXN0IG9uZSBvZiB0aGUgY29tcG9uZW50cyAoeWVhcnMsIG1vbnRocywgZGF5cywgaG91cnMsIG1pbnV0ZXMsIHNlY29uZHMpIG11c3QgYmUgc2V0LlwiKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHRoaXMudmFsaWRhdGUodmFsdWUpO1xyXG5cdFx0dmFyIHJlc3VsdCA9ICcnO1xyXG5cdFx0aWYgKHZhbHVlLnNpZ24gPT09IC0xKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXN1bHQgKz0gJy0nO1xyXG5cdFx0fVxyXG5cdFx0cmVzdWx0ICs9ICdQJztcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS55ZWFycykpIHtcclxuXHRcdFx0cmVzdWx0ICs9ICh2YWx1ZS55ZWFycyArICdZJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUubW9udGhzKSkge1xyXG5cdFx0XHRyZXN1bHQgKz0gKHZhbHVlLm1vbnRocyArICdNJyk7XHJcblx0XHR9XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUuZGF5cykpIHtcclxuXHRcdFx0cmVzdWx0ICs9ICh2YWx1ZS5kYXlzICsgJ0QnKTtcclxuXHRcdH1cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5ob3VycykgfHwgSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUubWludXRlcykgfHwgSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUuc2Vjb25kcykpXHJcblx0XHR7XHJcblx0XHRcdHJlc3VsdCArPSAnVCc7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5ob3VycykpIHtcclxuXHRcdFx0XHRyZXN1bHQgKz0gKHZhbHVlLmhvdXJzICsgJ0gnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUubWludXRlcykpIHtcclxuXHRcdFx0XHRyZXN1bHQgKz0gKHZhbHVlLm1pbnV0ZXMgKyAnTScpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5zZWNvbmRzKSkge1xyXG5cdFx0XHRcdHJlc3VsdCArPSAodmFsdWUuc2Vjb25kcyArICdTJyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciBkdXJhdGlvbkV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuRHVyYXRpb24uUEFUVEVSTiArIFwiJFwiKTtcclxuXHRcdHZhciByZXN1bHRzID0gdmFsdWUubWF0Y2goZHVyYXRpb25FeHByZXNzaW9uKTtcclxuXHRcdGlmIChyZXN1bHRzICE9PSBudWxsKSB7XHJcblx0XHRcdHZhciBlbXB0eSA9IHRydWU7XHJcblx0XHRcdHZhciBkdXJhdGlvbiA9IHt9O1xyXG5cdFx0XHRpZiAocmVzdWx0c1sxXSkgeyBkdXJhdGlvbi5zaWduID0gLTE7IH1cclxuXHRcdFx0aWYgKHJlc3VsdHNbM10pIHsgZHVyYXRpb24ueWVhcnMgPSBwYXJzZUludChyZXN1bHRzWzNdLCAxMCk7IGVtcHR5ID0gZmFsc2U7IH1cclxuXHRcdFx0aWYgKHJlc3VsdHNbNV0pIHsgZHVyYXRpb24ubW9udGhzID0gcGFyc2VJbnQocmVzdWx0c1s1XSwgMTApOyBlbXB0eSA9IGZhbHNlOyB9XHJcblx0XHRcdGlmIChyZXN1bHRzWzddKSB7IGR1cmF0aW9uLmRheXMgPSBwYXJzZUludChyZXN1bHRzWzddLCAxMCk7IGVtcHR5ID0gZmFsc2U7IH1cclxuXHRcdFx0aWYgKHJlc3VsdHNbMTBdKSB7IGR1cmF0aW9uLmhvdXJzID0gcGFyc2VJbnQocmVzdWx0c1sxMF0sIDEwKTsgZW1wdHkgPSBmYWxzZTsgfVxyXG5cdFx0XHRpZiAocmVzdWx0c1sxMl0pIHsgZHVyYXRpb24ubWludXRlcyA9IHBhcnNlSW50KHJlc3VsdHNbMTJdLCAxMCk7IGVtcHR5ID0gZmFsc2U7IH1cclxuXHRcdFx0aWYgKHJlc3VsdHNbMTRdKSB7IGR1cmF0aW9uLnNlY29uZHMgPSBOdW1iZXIocmVzdWx0c1sxNF0pOyBlbXB0eSA9IGZhbHNlOyB9XHJcblx0XHRcdHJldHVybiBkdXJhdGlvbjtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignVmFsdWUgWycgKyB2YWx1ZSArICddIGRvZXMgbm90IG1hdGNoIHRoZSBkdXJhdGlvbiBwYXR0ZXJuLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5EdXJhdGlvbidcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkR1cmF0aW9uLlBBVFRFUk4gPSAnKC0pP1AoKFswLTldKylZKT8oKFswLTldKylNKT8oKFswLTldKylEKT8oVCgoWzAtOV0rKUgpPygoWzAtOV0rKU0pPygoWzAtOV0rKFxcXFwuWzAtOV0rKT8pUyk/KT8nO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5EdXJhdGlvbi5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5EdXJhdGlvbigpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5EdXJhdGlvbi5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuRHVyYXRpb24uSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5EYXRlVGltZSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhciwge1xyXG5cdG5hbWUgOiAnRGF0ZVRpbWUnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2RhdGVUaW1lJyksXHJcblx0cGFyc2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wYXJzZURhdGVUaW1lKHZhbHVlKTtcclxuXHR9LFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByaW50RGF0ZVRpbWUodmFsdWUpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5EYXRlVGltZSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5EYXRlVGltZS5JTlNUQU5DRSk7XHJcblxyXG5Kc29uaXguU2NoZW1hLlhTRC5EYXRlVGltZUFzRGF0ZSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhciwge1xyXG5cdG5hbWUgOiAnRGF0ZVRpbWVBc0RhdGUnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2RhdGVUaW1lJyksXHJcblx0cGFyc2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgY2FsZW5kYXIgPSB0aGlzLnBhcnNlRGF0ZVRpbWUodmFsdWUpO1xyXG5cdFx0dmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0ZGF0ZS5zZXRGdWxsWWVhcihjYWxlbmRhci55ZWFyKTtcclxuXHRcdGRhdGUuc2V0TW9udGgoY2FsZW5kYXIubW9udGggLSAxKTtcclxuXHRcdGRhdGUuc2V0RGF0ZShjYWxlbmRhci5kYXkpO1xyXG5cdFx0ZGF0ZS5zZXRIb3VycyhjYWxlbmRhci5ob3VyKTtcclxuXHRcdGRhdGUuc2V0TWludXRlcyhjYWxlbmRhci5taW51dGUpO1xyXG5cdFx0ZGF0ZS5zZXRTZWNvbmRzKGNhbGVuZGFyLnNlY29uZCk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc051bWJlcihjYWxlbmRhci5mcmFjdGlvbmFsU2Vjb25kKSkge1xyXG5cdFx0XHRkYXRlLnNldE1pbGxpc2Vjb25kcyhNYXRoLmZsb29yKDEwMDAgKiBjYWxlbmRhci5mcmFjdGlvbmFsU2Vjb25kKSk7XHJcblx0XHR9XHJcblx0XHR2YXIgdGltZXpvbmU7XHJcblx0XHR2YXIgdW5rbm93blRpbWV6b25lO1xyXG5cdFx0dmFyIGxvY2FsVGltZXpvbmUgPSAtIGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIoY2FsZW5kYXIudGltZXpvbmUpKVxyXG5cdFx0e1xyXG5cdFx0XHR0aW1lem9uZSA9IGNhbGVuZGFyLnRpbWV6b25lO1xyXG5cdFx0XHR1bmtub3duVGltZXpvbmUgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0Ly8gVW5rbm93biB0aW1lem9uZVxyXG5cdFx0XHR0aW1lem9uZSA9IGxvY2FsVGltZXpvbmU7XHJcblx0XHRcdHVua25vd25UaW1lem9uZSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHQvL1xyXG5cdFx0dmFyIHJlc3VsdCA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpICsgKDYwMDAwICogKC0gdGltZXpvbmUgKyBsb2NhbFRpbWV6b25lKSkpO1xyXG5cdFx0aWYgKHVua25vd25UaW1lem9uZSlcclxuXHRcdHtcclxuXHRcdFx0Ly8gbnVsbCBkZW5vdGVzIFwidW5rbm93biB0aW1lem9uZVwiXHJcblx0XHRcdHJlc3VsdC5vcmlnaW5hbFRpbWV6b25lID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0cmVzdWx0Lm9yaWdpbmFsVGltZXpvbmUgPSBjYWxlbmRhci50aW1lem9uZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRGF0ZSh2YWx1ZSk7XHJcblx0XHR2YXIgdGltZXpvbmU7XHJcblx0XHR2YXIgbG9jYWxUaW1lem9uZSA9IC0gdmFsdWUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuXHRcdHZhciBjb3JyZWN0ZWRWYWx1ZTtcclxuXHRcdC8vIElmIG9yaWdpbmFsIHRpbWUgem9uZSB3YXMgdW5rbm93biwgcHJpbnQgdGhlIGdpdmVuIHZhbHVlIHdpdGhvdXRcclxuXHRcdC8vIHRoZSB0aW1lem9uZVxyXG5cdFx0aWYgKHZhbHVlLm9yaWdpbmFsVGltZXpvbmUgPT09IG51bGwpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiB0aGlzLnByaW50RGF0ZVRpbWUobmV3IEpzb25peC5YTUwuQ2FsZW5kYXIoe1xyXG5cdFx0XHRcdHllYXIgOiB2YWx1ZS5nZXRGdWxsWWVhcigpLFxyXG5cdFx0XHRcdG1vbnRoIDogdmFsdWUuZ2V0TW9udGgoKSArIDEsXHJcblx0XHRcdFx0ZGF5IDogdmFsdWUuZ2V0RGF0ZSgpLFxyXG5cdFx0XHRcdGhvdXIgOiB2YWx1ZS5nZXRIb3VycygpLFxyXG5cdFx0XHRcdG1pbnV0ZSA6IHZhbHVlLmdldE1pbnV0ZXMoKSxcclxuXHRcdFx0XHRzZWNvbmQgOiB2YWx1ZS5nZXRTZWNvbmRzKCksXHJcblx0XHRcdFx0ZnJhY3Rpb25hbFNlY29uZCA6ICh2YWx1ZS5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDApXHJcblx0XHRcdH0pKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0Ly8gSWYgb3JpZ2luYWwgdGltZXpvbmUgd2FzIGtub3duLCBjb3JyZWN0IGFuZCBwcmludCB0aGUgdmFsdWUgd2l0aCB0aGUgdGltZXpvbmVcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5vcmlnaW5hbFRpbWV6b25lKSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRpbWV6b25lID0gdmFsdWUub3JpZ2luYWxUaW1lem9uZTtcclxuXHRcdFx0XHRjb3JyZWN0ZWRWYWx1ZSA9IG5ldyBEYXRlKHZhbHVlLmdldFRpbWUoKSAtICg2MDAwMCAqICggLSB0aW1lem9uZSArIGxvY2FsVGltZXpvbmUpKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gSWYgb3JpZ2luYWwgdGltZXpvbmUgd2FzIG5vdCBzcGVjaWZpZWQsIGRvIG5vdCBjb3JyZWN0IGFuZCB1c2UgdGhlIGxvY2FsIHRpbWUgem9uZVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aW1lem9uZSA9IGxvY2FsVGltZXpvbmU7XHJcblx0XHRcdFx0Y29ycmVjdGVkVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgeCA9IHRoaXMucHJpbnREYXRlVGltZShuZXcgSnNvbml4LlhNTC5DYWxlbmRhcih7XHJcblx0XHRcdFx0eWVhciA6IGNvcnJlY3RlZFZhbHVlLmdldEZ1bGxZZWFyKCksXHJcblx0XHRcdFx0bW9udGggOiBjb3JyZWN0ZWRWYWx1ZS5nZXRNb250aCgpICsgMSxcclxuXHRcdFx0XHRkYXkgOiBjb3JyZWN0ZWRWYWx1ZS5nZXREYXRlKCksXHJcblx0XHRcdFx0aG91ciA6IGNvcnJlY3RlZFZhbHVlLmdldEhvdXJzKCksXHJcblx0XHRcdFx0bWludXRlIDogY29ycmVjdGVkVmFsdWUuZ2V0TWludXRlcygpLFxyXG5cdFx0XHRcdHNlY29uZCA6IGNvcnJlY3RlZFZhbHVlLmdldFNlY29uZHMoKSxcclxuXHRcdFx0XHRmcmFjdGlvbmFsU2Vjb25kIDogKGNvcnJlY3RlZFZhbHVlLmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMCksXHJcblx0XHRcdFx0dGltZXpvbmU6IHRpbWV6b25lXHJcblx0XHRcdH0pKTtcclxuXHRcdFx0cmV0dXJuIHg7XHJcblx0XHR9XHJcblx0fSxcclxuXHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gSnNvbml4LlV0aWwuVHlwZS5pc0RhdGUodmFsdWUpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5EYXRlVGltZUFzRGF0ZSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lQXNEYXRlLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lQXNEYXRlKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lQXNEYXRlLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5EYXRlVGltZUFzRGF0ZS5JTlNUQU5DRSk7XHJcblxyXG5Kc29uaXguU2NoZW1hLlhTRC5UaW1lID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLCB7XHJcblx0bmFtZSA6ICdUaW1lJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCd0aW1lJyksXHJcblx0cGFyc2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wYXJzZVRpbWUodmFsdWUpO1xyXG5cdH0sXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucHJpbnRUaW1lKHZhbHVlKTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuVGltZSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlRpbWUuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuVGltZSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5UaW1lLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5UaW1lLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVGltZUFzRGF0ZSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhciwge1xyXG5cdG5hbWUgOiAnVGltZUFzRGF0ZScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgndGltZScpLFxyXG5cdHBhcnNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIGNhbGVuZGFyID0gdGhpcy5wYXJzZVRpbWUodmFsdWUpO1xyXG5cdFx0dmFyIGRhdGUgPSBuZXcgRGF0ZSgpO1xyXG5cdFx0ZGF0ZS5zZXRGdWxsWWVhcigxOTcwKTtcclxuXHRcdGRhdGUuc2V0TW9udGgoMCk7XHJcblx0XHRkYXRlLnNldERhdGUoMSk7XHJcblx0XHRkYXRlLnNldEhvdXJzKGNhbGVuZGFyLmhvdXIpO1xyXG5cdFx0ZGF0ZS5zZXRNaW51dGVzKGNhbGVuZGFyLm1pbnV0ZSk7XHJcblx0XHRkYXRlLnNldFNlY29uZHMoY2FsZW5kYXIuc2Vjb25kKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKGNhbGVuZGFyLmZyYWN0aW9uYWxTZWNvbmQpKSB7XHJcblx0XHRcdGRhdGUuc2V0TWlsbGlzZWNvbmRzKE1hdGguZmxvb3IoMTAwMCAqIGNhbGVuZGFyLmZyYWN0aW9uYWxTZWNvbmQpKTtcclxuXHRcdH1cclxuXHRcdHZhciB0aW1lem9uZTtcclxuXHRcdHZhciB1bmtub3duVGltZXpvbmU7XHJcblx0XHR2YXIgbG9jYWxUaW1lem9uZSA9IC0gZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcihjYWxlbmRhci50aW1lem9uZSkpXHJcblx0XHR7XHJcblx0XHRcdHRpbWV6b25lID0gY2FsZW5kYXIudGltZXpvbmU7XHJcblx0XHRcdHVua25vd25UaW1lem9uZSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBVbmtub3duIHRpbWV6b25lXHJcblx0XHRcdHRpbWV6b25lID0gbG9jYWxUaW1lem9uZTtcclxuXHRcdFx0dW5rbm93blRpbWV6b25lID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdC8vXHJcblx0XHR2YXIgcmVzdWx0ID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkgKyAoNjAwMDAgKiAoIC0gdGltZXpvbmUgKyBsb2NhbFRpbWV6b25lKSkpO1xyXG5cdFx0aWYgKHVua25vd25UaW1lem9uZSlcclxuXHRcdHtcclxuXHRcdFx0Ly8gbnVsbCBkZW5vdGVzIFwidW5rbm93biB0aW1lem9uZVwiXHJcblx0XHRcdHJlc3VsdC5vcmlnaW5hbFRpbWV6b25lID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0cmVzdWx0Lm9yaWdpbmFsVGltZXpvbmUgPSB0aW1lem9uZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRGF0ZSh2YWx1ZSk7XHJcblx0XHR2YXIgdGltZSA9IHZhbHVlLmdldFRpbWUoKTtcclxuXHRcdGlmICh0aW1lIDw9IC04NjQwMDAwMCAmJiB0aW1lID49IDg2NDAwMDAwKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCB0aW1lIFsnICsgdmFsdWUgKyAnXS4nKTtcclxuXHRcdH1cclxuXHRcdC8vIE9yaWdpbmFsIHRpbWV6b25lIHdhcyB1bmtub3duLCBqdXN0IHVzZSBjdXJyZW50IHRpbWUsIG5vIHRpbWV6b25lXHJcblx0XHRpZiAodmFsdWUub3JpZ2luYWxUaW1lem9uZSA9PT0gbnVsbClcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnRUaW1lKG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKHtcclxuXHRcdFx0XHRob3VyIDogdmFsdWUuZ2V0SG91cnMoKSxcclxuXHRcdFx0XHRtaW51dGUgOiB2YWx1ZS5nZXRNaW51dGVzKCksXHJcblx0XHRcdFx0c2Vjb25kIDogdmFsdWUuZ2V0U2Vjb25kcygpLFxyXG5cdFx0XHRcdGZyYWN0aW9uYWxTZWNvbmQgOiAodmFsdWUuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwKVxyXG5cdFx0XHR9KSk7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHZhciBjb3JyZWN0ZWRWYWx1ZTtcclxuXHRcdFx0dmFyIHRpbWV6b25lO1xyXG5cdFx0XHR2YXIgbG9jYWxUaW1lem9uZSA9IC0gdmFsdWUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5vcmlnaW5hbFRpbWV6b25lKSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRpbWV6b25lID0gdmFsdWUub3JpZ2luYWxUaW1lem9uZTtcclxuXHRcdFx0XHRjb3JyZWN0ZWRWYWx1ZSA9IG5ldyBEYXRlKHZhbHVlLmdldFRpbWUoKSAtICg2MDAwMCAqICggLSB0aW1lem9uZSArIGxvY2FsVGltZXpvbmUpKSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGltZXpvbmUgPSBsb2NhbFRpbWV6b25lO1xyXG5cdFx0XHRcdGNvcnJlY3RlZFZhbHVlID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIGNvcnJlY3RlZFRpbWUgPSBjb3JyZWN0ZWRWYWx1ZS5nZXRUaW1lKCk7XHJcblx0XHRcdGlmIChjb3JyZWN0ZWRUaW1lID49ICgtIGxvY2FsVGltZXpvbmUgKiA2MDAwMCkpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wcmludFRpbWUobmV3IEpzb25peC5YTUwuQ2FsZW5kYXIoe1xyXG5cdFx0XHRcdFx0aG91ciA6IGNvcnJlY3RlZFZhbHVlLmdldEhvdXJzKCksXHJcblx0XHRcdFx0XHRtaW51dGUgOiBjb3JyZWN0ZWRWYWx1ZS5nZXRNaW51dGVzKCksXHJcblx0XHRcdFx0XHRzZWNvbmQgOiBjb3JyZWN0ZWRWYWx1ZS5nZXRTZWNvbmRzKCksXHJcblx0XHRcdFx0XHRmcmFjdGlvbmFsU2Vjb25kIDogKGNvcnJlY3RlZFZhbHVlLmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMCksXHJcblx0XHRcdFx0XHR0aW1lem9uZTogdGltZXpvbmVcclxuXHRcdFx0XHR9KSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIHRpbWV6b25lSG91cnMgPSBNYXRoLmNlaWwoLWNvcnJlY3RlZFRpbWUgLyAzNjAwMDAwKTtcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgY29ycmVjdGVkVGltZUluU2Vjb25kcyA9IGNvcnJlY3RlZFZhbHVlLmdldFNlY29uZHMoKSArXHJcblx0XHRcdFx0XHRjb3JyZWN0ZWRWYWx1ZS5nZXRNaW51dGVzKCkgKiA2MCArXHJcblx0XHRcdFx0XHRjb3JyZWN0ZWRWYWx1ZS5nZXRIb3VycygpICogMzYwMCArXHJcblx0XHRcdFx0XHR0aW1lem9uZUhvdXJzICogMzYwMCAtXHJcblx0XHRcdFx0XHR0aW1lem9uZSAqIDYwO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHJldHVybiB0aGlzLnByaW50VGltZShuZXcgSnNvbml4LlhNTC5DYWxlbmRhcih7XHJcblx0XHRcdFx0XHRob3VyIDogY29ycmVjdGVkVGltZUluU2Vjb25kcyAlIDg2NDAwLFxyXG5cdFx0XHRcdFx0bWludXRlIDogY29ycmVjdGVkVGltZUluU2Vjb25kcyAlIDM2MDAsXHJcblx0XHRcdFx0XHRzZWNvbmQgOiBjb3JyZWN0ZWRUaW1lSW5TZWNvbmRzICUgNjAsXHJcblx0XHRcdFx0XHRmcmFjdGlvbmFsU2Vjb25kIDogKGNvcnJlY3RlZFZhbHVlLmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMCksXHJcblx0XHRcdFx0XHR0aW1lem9uZSA6IHRpbWV6b25lSG91cnMgKiA2MFxyXG5cdFx0XHRcdH0pKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNEYXRlKHZhbHVlKSAmJiB2YWx1ZS5nZXRUaW1lKCkgPiAtODY0MDAwMDAgJiYgdmFsdWUuZ2V0VGltZSgpIDwgODY0MDAwMDA7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELlRpbWVBc0RhdGUnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5UaW1lQXNEYXRlLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELlRpbWVBc0RhdGUoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVGltZUFzRGF0ZS5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuVGltZUFzRGF0ZS5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRhdGUgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIsIHtcclxuXHRuYW1lIDogJ0RhdGUnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2RhdGUnKSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnBhcnNlRGF0ZSh2YWx1ZSk7XHJcblx0fSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludERhdGUodmFsdWUpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5EYXRlJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRGF0ZS5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5EYXRlKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRhdGUuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkRhdGUuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5EYXRlQXNEYXRlID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLCB7XHJcblx0bmFtZSA6ICdEYXRlQXNEYXRlJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdkYXRlJyksXHJcblx0cGFyc2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgY2FsZW5kYXIgPSB0aGlzLnBhcnNlRGF0ZSh2YWx1ZSk7XHJcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRkYXRlLnNldEZ1bGxZZWFyKGNhbGVuZGFyLnllYXIpO1xyXG5cdFx0ZGF0ZS5zZXRNb250aChjYWxlbmRhci5tb250aCAtIDEpO1xyXG5cdFx0ZGF0ZS5zZXREYXRlKGNhbGVuZGFyLmRheSk7XHJcblx0XHRkYXRlLnNldEhvdXJzKDApO1xyXG5cdFx0ZGF0ZS5zZXRNaW51dGVzKDApO1xyXG5cdFx0ZGF0ZS5zZXRTZWNvbmRzKDApO1xyXG5cdFx0ZGF0ZS5zZXRNaWxsaXNlY29uZHMoMCk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc051bWJlcihjYWxlbmRhci5mcmFjdGlvbmFsU2Vjb25kKSkge1xyXG5cdFx0XHRkYXRlLnNldE1pbGxpc2Vjb25kcyhNYXRoLmZsb29yKDEwMDAgKiBjYWxlbmRhci5mcmFjdGlvbmFsU2Vjb25kKSk7XHJcblx0XHR9XHJcblx0XHR2YXIgdGltZXpvbmU7XHJcblx0XHR2YXIgdW5rbm93blRpbWV6b25lO1xyXG5cdFx0dmFyIGxvY2FsVGltZXpvbmUgPSAtIGRhdGUuZ2V0VGltZXpvbmVPZmZzZXQoKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIoY2FsZW5kYXIudGltZXpvbmUpKVxyXG5cdFx0e1xyXG5cdFx0XHR0aW1lem9uZSA9IGNhbGVuZGFyLnRpbWV6b25lO1xyXG5cdFx0XHR1bmtub3duVGltZXpvbmUgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0Ly8gVW5rbm93biB0aW1lem9uZVxyXG5cdFx0XHR0aW1lem9uZSA9IGxvY2FsVGltZXpvbmU7XHJcblx0XHRcdHVua25vd25UaW1lem9uZSA9IHRydWU7XHJcblx0XHR9XHJcblx0XHQvL1xyXG5cdFx0dmFyIHJlc3VsdCA9IG5ldyBEYXRlKGRhdGUuZ2V0VGltZSgpICsgKDYwMDAwICogKCAtIHRpbWV6b25lICsgbG9jYWxUaW1lem9uZSkpKTtcclxuXHRcdGlmICh1bmtub3duVGltZXpvbmUpXHJcblx0XHR7XHJcblx0XHRcdC8vIG51bGwgZGVub3RlcyBcInVua25vd24gdGltZXpvbmVcIlxyXG5cdFx0XHRyZXN1bHQub3JpZ2luYWxUaW1lem9uZSA9IG51bGw7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHJlc3VsdC5vcmlnaW5hbFRpbWV6b25lID0gdGltZXpvbmU7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZURhdGUodmFsdWUpO1xyXG5cdFx0dmFyIGxvY2FsRGF0ZSA9IG5ldyBEYXRlKHZhbHVlLmdldFRpbWUoKSk7XHJcblx0XHRsb2NhbERhdGUuc2V0SG91cnMoMCk7XHJcblx0XHRsb2NhbERhdGUuc2V0TWludXRlcygwKTtcclxuXHRcdGxvY2FsRGF0ZS5zZXRTZWNvbmRzKDApO1xyXG5cdFx0bG9jYWxEYXRlLnNldE1pbGxpc2Vjb25kcygwKTtcclxuXHRcdFxyXG5cdFx0Ly8gT3JpZ2luYWwgdGltZXpvbmUgaXMgdW5rbm93blxyXG5cdFx0aWYgKHZhbHVlLm9yaWdpbmFsVGltZXpvbmUgPT09IG51bGwpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiB0aGlzLnByaW50RGF0ZShuZXcgSnNvbml4LlhNTC5DYWxlbmRhcih7XHJcblx0XHRcdFx0eWVhciA6IHZhbHVlLmdldEZ1bGxZZWFyKCksXHJcblx0XHRcdFx0bW9udGggOiB2YWx1ZS5nZXRNb250aCgpICsgMSxcclxuXHRcdFx0XHRkYXkgOiB2YWx1ZS5nZXREYXRlKClcclxuXHRcdFx0fSkpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBJZiBvcmlnaW5hbCB0aW1lem9uZSB3YXMga25vd24sIGNvcnJlY3QgYW5kIHByaW50IHRoZSB2YWx1ZSB3aXRoIHRoZSB0aW1lem9uZVxyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLm9yaWdpbmFsVGltZXpvbmUpKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIGNvcnJlY3RlZFZhbHVlID0gbmV3IERhdGUodmFsdWUuZ2V0VGltZSgpIC0gKDYwMDAwICogKC0gdmFsdWUub3JpZ2luYWxUaW1lem9uZSAtIHZhbHVlLmdldFRpbWV6b25lT2Zmc2V0KCkpKSk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucHJpbnREYXRlKG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKHtcclxuXHRcdFx0XHRcdHllYXIgOiBjb3JyZWN0ZWRWYWx1ZS5nZXRGdWxsWWVhcigpLFxyXG5cdFx0XHRcdFx0bW9udGggOiBjb3JyZWN0ZWRWYWx1ZS5nZXRNb250aCgpICsgMSxcclxuXHRcdFx0XHRcdGRheSA6IGNvcnJlY3RlZFZhbHVlLmdldERhdGUoKSxcclxuXHRcdFx0XHRcdHRpbWV6b25lIDogdmFsdWUub3JpZ2luYWxUaW1lem9uZVxyXG5cdFx0XHRcdH0pKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBJZiBvcmlnaW5hbCB0aW1lem9uZSB3YXMgbm90IHNwZWNpZmllZCwgZG8gbm90IGNvcnJlY3QgYW5kIHVzZSB0aGUgbG9jYWwgdGltZSB6b25lXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vIFdlIGFzc3VtZSB0aGF0IHRoZSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIGRhdGUgdmFsdWUgYW5kIGxvY2FsIG1pZG5pZ2h0XHJcblx0XHRcdFx0Ly8gc2hvdWxkIGJlIGludGVycHJldGVkIGFzIGEgdGltZXpvbmUgb2Zmc2V0LlxyXG5cdFx0XHRcdC8vIEluIGNhc2UgdGhlcmUncyBubyBkaWZmZXJlbmNlLCB3ZSBhc3N1bWUgZGVmYXVsdC91bmtub3duIHRpbWV6b25lXHJcblx0XHRcdFx0dmFyIGxvY2FsVGltZXpvbmUgPSAtIHZhbHVlLmdldFRpbWUoKSArIGxvY2FsRGF0ZS5nZXRUaW1lKCk7XHJcblx0XHRcdFx0aWYgKGxvY2FsVGltZXpvbmUgPT09IDApIHtcclxuXHRcdFx0XHRcdHJldHVybiB0aGlzLnByaW50RGF0ZShuZXcgSnNvbml4LlhNTC5DYWxlbmRhcih7XHJcblx0XHRcdFx0XHRcdHllYXIgOiB2YWx1ZS5nZXRGdWxsWWVhcigpLFxyXG5cdFx0XHRcdFx0XHRtb250aCA6IHZhbHVlLmdldE1vbnRoKCkgKyAxLFxyXG5cdFx0XHRcdFx0XHRkYXkgOiB2YWx1ZS5nZXREYXRlKClcclxuXHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHRpbWV6b25lID0gbG9jYWxUaW1lem9uZSAtICg2MDAwMCAqIHZhbHVlLmdldFRpbWV6b25lT2Zmc2V0KCkpO1xyXG5cdFx0XHRcdFx0aWYgKHRpbWV6b25lID49IC00MzIwMDAwMCkge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5wcmludERhdGUobmV3IEpzb25peC5YTUwuQ2FsZW5kYXIoe1xyXG5cdFx0XHRcdFx0XHRcdHllYXIgOiB2YWx1ZS5nZXRGdWxsWWVhcigpLFxyXG5cdFx0XHRcdFx0XHRcdG1vbnRoIDogdmFsdWUuZ2V0TW9udGgoKSArIDEsXHJcblx0XHRcdFx0XHRcdFx0ZGF5IDogdmFsdWUuZ2V0RGF0ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdHRpbWV6b25lIDogTWF0aC5mbG9vcih0aW1lem9uZSAvIDYwMDAwKVxyXG5cdFx0XHRcdFx0XHR9KSk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR2YXIgbmV4dERheSA9IG5ldyBEYXRlKHZhbHVlLmdldFRpbWUoKSArIDg2NDAwMDAwKTtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHRoaXMucHJpbnREYXRlKG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKHtcclxuXHRcdFx0XHRcdFx0XHR5ZWFyIDogbmV4dERheS5nZXRGdWxsWWVhcigpLFxyXG5cdFx0XHRcdFx0XHRcdG1vbnRoIDogbmV4dERheS5nZXRNb250aCgpICsgMSxcclxuXHRcdFx0XHRcdFx0XHRkYXkgOiBuZXh0RGF5LmdldERhdGUoKSxcclxuXHRcdFx0XHRcdFx0XHR0aW1lem9uZSA6IChNYXRoLmZsb29yKHRpbWV6b25lIC8gNjAwMDApICsgMTQ0MClcclxuXHRcdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNEYXRlKHZhbHVlKTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuRGF0ZUFzRGF0ZSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRhdGVBc0RhdGUuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuRGF0ZUFzRGF0ZSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5EYXRlQXNEYXRlLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5EYXRlQXNEYXRlLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuR1llYXJNb250aCA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhciwge1xyXG5cdG5hbWUgOiAnR1llYXJNb250aCcsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnZ1llYXJNb250aCcpLFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuR1llYXJNb250aCcsXHJcblxyXG5cdHBhcnNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucGFyc2VHWWVhck1vbnRoKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdH0sXHJcblxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByaW50R1llYXJNb250aCh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0fVxyXG5cclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkdZZWFyTW9udGguSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuR1llYXJNb250aCgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5HWWVhck1vbnRoLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5HWWVhck1vbnRoLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuR1llYXIgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIsIHtcclxuXHRuYW1lIDogJ0dZZWFyJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdnWWVhcicpLFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuR1llYXInLFxyXG5cclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnBhcnNlR1llYXIodmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSk7XHJcblx0fSxcclxuXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucHJpbnRHWWVhcih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0fVxyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuR1llYXIuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuR1llYXIoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuR1llYXIuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkdZZWFyLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuR01vbnRoRGF5ID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLCB7XHJcblx0bmFtZSA6ICdHTW9udGhEYXknLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2dNb250aERheScpLFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuR01vbnRoRGF5JyxcclxuXHJcblx0cGFyc2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wYXJzZUdNb250aERheSh2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHR9LFxyXG5cclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludEdNb250aERheSh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0fVxyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuR01vbnRoRGF5LklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkdNb250aERheSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5HTW9udGhEYXkuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkdNb250aERheS5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkdEYXkgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIsIHtcclxuXHRuYW1lIDogJ0dEYXknLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2dEYXknKSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkdEYXknLFxyXG5cclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnBhcnNlR0RheSh2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHR9LFxyXG5cclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludEdEYXkodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdH1cclxuXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5HRGF5LklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkdEYXkoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuR0RheS5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuR0RheS5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkdNb250aCA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhciwge1xyXG5cdG5hbWUgOiAnR01vbnRoJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdnTW9udGgnKSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkdNb250aCcsXHJcblx0cGFyc2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wYXJzZUdNb250aCh2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHR9LFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByaW50R01vbnRoKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHR9XHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5HTW9udGguSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuR01vbnRoKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkdNb250aC5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuR01vbnRoLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuSUQgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuU3RyaW5nLCB7XHJcblx0bmFtZSA6ICdJRCcsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnSUQnKSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELklEJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuSUQuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuSUQoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuSUQuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KFxyXG5cdFx0SnNvbml4LlNjaGVtYS5YU0QuSUQuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5JRFJFRiA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5TdHJpbmcsIHtcclxuXHRuYW1lIDogJ0lEUkVGJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdJRFJFRicpLFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuSURSRUYnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5JRFJFRi5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5JRFJFRigpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5JRFJFRi5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoXHJcblx0XHRKc29uaXguU2NoZW1hLlhTRC5JRFJFRi5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELklEUkVGUyA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5MaXN0LCB7XHJcblx0bmFtZSA6ICdJRFJFRlMnLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHRcdEpzb25peC5TY2hlbWEuWFNELkxpc3QucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgWyBKc29uaXguU2NoZW1hLlhTRC5JRFJFRi5JTlNUQU5DRSwgSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ0lEUkVGUycpLCAnICcgXSk7XHJcblx0fSxcclxuXHQvLyBUT0RPIENvbnN0cmFpbnRzXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5JRFJFRlMnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5JRFJFRlMuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuSURSRUZTKCk7XHJcbkpzb25peC5TY2hlbWEuWFNJID0ge307XHJcbkpzb25peC5TY2hlbWEuWFNJLk5BTUVTUEFDRV9VUkkgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMS9YTUxTY2hlbWEtaW5zdGFuY2UnO1xyXG5Kc29uaXguU2NoZW1hLlhTSS5QUkVGSVggPSAneHNpJztcclxuSnNvbml4LlNjaGVtYS5YU0kuVFlQRSA9ICd0eXBlJztcclxuSnNvbml4LlNjaGVtYS5YU0kuTklMID0gJ25pbCc7XHJcbkpzb25peC5TY2hlbWEuWFNJLnFuYW1lID0gZnVuY3Rpb24obG9jYWxQYXJ0KSB7XHJcblx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhsb2NhbFBhcnQpO1xyXG5cdHJldHVybiBuZXcgSnNvbml4LlhNTC5RTmFtZShKc29uaXguU2NoZW1hLlhTSS5OQU1FU1BBQ0VfVVJJLCBsb2NhbFBhcnQsXHJcblx0XHRcdEpzb25peC5TY2hlbWEuWFNJLlBSRUZJWCk7XHJcbn07XHJcbkpzb25peC5TY2hlbWEuWFNJLlRZUEVfUU5BTUUgPSBKc29uaXguU2NoZW1hLlhTSS5xbmFtZShKc29uaXguU2NoZW1hLlhTSS5UWVBFKTtcclxuXHJcbkpzb25peC5Db250ZXh0ID0gSnNvbml4XHJcblx0XHQuQ2xhc3MoSnNvbml4Lk1hcHBpbmcuU3R5bGVkLCB7XHJcblx0XHRcdG1vZHVsZXMgOiBbXSxcclxuXHRcdFx0dHlwZUluZm9zIDogbnVsbCxcclxuXHRcdFx0dHlwZU5hbWVLZXlUb1R5cGVJbmZvIDogbnVsbCxcclxuXHRcdFx0ZWxlbWVudEluZm9zIDogbnVsbCxcclxuXHRcdFx0b3B0aW9ucyA6IG51bGwsXHJcblx0XHRcdHN1YnN0aXR1dGlvbk1lbWJlcnNNYXAgOiBudWxsLFxyXG5cdFx0XHRzY29wZWRFbGVtZW50SW5mb3NNYXAgOiBudWxsLFxyXG5cdFx0XHRzdXBwb3J0WHNpVHlwZSA6IHRydWUsXHJcblx0XHRcdGluaXRpYWxpemUgOiBmdW5jdGlvbihtYXBwaW5ncywgb3B0aW9ucykge1xyXG5cdFx0XHRcdEpzb25peC5NYXBwaW5nLlN0eWxlZC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbb3B0aW9uc10pO1xyXG5cdFx0XHRcdHRoaXMubW9kdWxlcyA9IFtdO1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudEluZm9zID0gW107XHJcblx0XHRcdFx0dGhpcy50eXBlSW5mb3MgPSB7fTtcclxuXHRcdFx0XHR0aGlzLnR5cGVOYW1lS2V5VG9UeXBlSW5mbyA9IHt9O1xyXG5cdFx0XHRcdHRoaXMucmVnaXN0ZXJCdWlsdGluVHlwZUluZm9zKCk7XHJcblx0XHRcdFx0dGhpcy5uYW1lc3BhY2VQcmVmaXhlcyA9IHt9O1xyXG5cdFx0XHRcdHRoaXMucHJlZml4TmFtZXNwYWNlcyA9IHt9O1xyXG5cdFx0XHRcdHRoaXMuc3Vic3RpdHV0aW9uTWVtYmVyc01hcCA9IHt9O1xyXG5cdFx0XHRcdHRoaXMuc2NvcGVkRWxlbWVudEluZm9zTWFwID0ge307XHJcblxyXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgb3B0aW9uc1xyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhvcHRpb25zKSkge1xyXG5cdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChvcHRpb25zKTtcclxuXHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlXHJcblx0XHRcdFx0XHRcdFx0LmlzT2JqZWN0KG9wdGlvbnMubmFtZXNwYWNlUHJlZml4ZXMpKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMubmFtZXNwYWNlUHJlZml4ZXMgPSBcclxuXHRcdFx0XHRcdFx0XHRKc29uaXguVXRpbC5UeXBlLmNsb25lT2JqZWN0KG9wdGlvbnMubmFtZXNwYWNlUHJlZml4ZXMsIHt9KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlXHJcblx0XHRcdFx0XHRcdFx0LmlzQm9vbGVhbihvcHRpb25zLnN1cHBvcnRYc2lUeXBlKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnN1cHBvcnRYc2lUeXBlID0gb3B0aW9ucy5zdXBwb3J0WHNpVHlwZTsgXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgcHJlZml4L25hbWVzcGFjZSBtYXBwaW5nXHJcblx0XHRcdFx0Zm9yICh2YXIgbnMgaW4gdGhpcy5uYW1lc3BhY2VQcmVmaXhlcylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZiAodGhpcy5uYW1lc3BhY2VQcmVmaXhlcy5oYXNPd25Qcm9wZXJ0eShucykpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHAgPSB0aGlzLm5hbWVzcGFjZVByZWZpeGVzW25zXTtcclxuXHRcdFx0XHRcdFx0dGhpcy5wcmVmaXhOYW1lc3BhY2VzW3BdID0gbnM7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIEluaXRpYWxpemUgbW9kdWxlc1xyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhtYXBwaW5ncykpIHtcclxuXHRcdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVBcnJheShtYXBwaW5ncyk7XHJcblx0XHRcdFx0XHQvLyBJbml0aWFsaXplIG1vZHVsZXNcclxuXHRcdFx0XHRcdHZhciBpbmRleCwgbWFwcGluZywgbW9kdWxlO1xyXG5cdFx0XHRcdFx0Zm9yIChpbmRleCA9IDA7IGluZGV4IDwgbWFwcGluZ3MubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0XHRcdG1hcHBpbmcgPSBtYXBwaW5nc1tpbmRleF07XHJcblx0XHRcdFx0XHRcdG1vZHVsZSA9IHRoaXMuY3JlYXRlTW9kdWxlKG1hcHBpbmcpO1xyXG5cdFx0XHRcdFx0XHR0aGlzLm1vZHVsZXNbaW5kZXhdID0gbW9kdWxlO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aGlzLnByb2Nlc3NNb2R1bGVzKCk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGNyZWF0ZU1vZHVsZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdFx0XHR2YXIgbW9kdWxlO1xyXG5cdFx0XHRcdGlmIChtYXBwaW5nIGluc3RhbmNlb2YgdGhpcy5tYXBwaW5nU3R5bGUubW9kdWxlKSB7XHJcblx0XHRcdFx0XHRtb2R1bGUgPSBtYXBwaW5nO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRtYXBwaW5nID0gSnNvbml4LlV0aWwuVHlwZS5jbG9uZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdFx0XHRcdG1vZHVsZSA9IG5ldyB0aGlzLm1hcHBpbmdTdHlsZS5tb2R1bGUobWFwcGluZywgXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdG1hcHBpbmdTdHlsZSA6IHRoaXMubWFwcGluZ1N0eWxlXHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIG1vZHVsZTtcclxuXHRcdFx0fSxcclxuXHRcdFx0cmVnaXN0ZXJCdWlsdGluVHlwZUluZm9zIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Zm9yICggdmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmJ1aWx0aW5UeXBlSW5mb3MubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0XHR0aGlzLnJlZ2lzdGVyVHlwZUluZm8odGhpcy5idWlsdGluVHlwZUluZm9zW2luZGV4XSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRwcm9jZXNzTW9kdWxlcyA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHZhciBpbmRleCwgbW9kdWxlO1xyXG5cdFx0XHRcdGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubW9kdWxlcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdG1vZHVsZSA9IHRoaXMubW9kdWxlc1tpbmRleF07XHJcblx0XHRcdFx0XHRtb2R1bGUucmVnaXN0ZXJUeXBlSW5mb3ModGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubW9kdWxlcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdG1vZHVsZSA9IHRoaXMubW9kdWxlc1tpbmRleF07XHJcblx0XHRcdFx0XHRtb2R1bGUucmVnaXN0ZXJFbGVtZW50SW5mb3ModGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubW9kdWxlcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdG1vZHVsZSA9IHRoaXMubW9kdWxlc1tpbmRleF07XHJcblx0XHRcdFx0XHRtb2R1bGUuYnVpbGRUeXBlSW5mb3ModGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHRoaXMubW9kdWxlcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdG1vZHVsZSA9IHRoaXMubW9kdWxlc1tpbmRleF07XHJcblx0XHRcdFx0XHRtb2R1bGUuYnVpbGRFbGVtZW50SW5mb3ModGhpcyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZWdpc3RlclR5cGVJbmZvIDogZnVuY3Rpb24odHlwZUluZm8pIHtcclxuXHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHR5cGVJbmZvKTtcclxuXHRcdFx0XHR2YXIgbiA9IHR5cGVJbmZvLm5hbWV8fHR5cGVJbmZvLm58fG51bGw7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhuKTtcclxuXHRcdFx0XHR0aGlzLnR5cGVJbmZvc1tuXSA9IHR5cGVJbmZvO1xyXG5cdFx0XHRcdGlmICh0eXBlSW5mby50eXBlTmFtZSAmJiB0eXBlSW5mby50eXBlTmFtZS5rZXkpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGhpcy50eXBlTmFtZUtleVRvVHlwZUluZm9bdHlwZUluZm8udHlwZU5hbWUua2V5XSA9IHR5cGVJbmZvO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0cmVzb2x2ZVR5cGVJbmZvIDogZnVuY3Rpb24obWFwcGluZywgbW9kdWxlKSB7XHJcblx0XHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhtYXBwaW5nKSkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0fSBlbHNlIGlmIChtYXBwaW5nIGluc3RhbmNlb2YgSnNvbml4Lk1vZGVsLlR5cGVJbmZvKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gbWFwcGluZztcclxuXHRcdFx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcobWFwcGluZykpIHtcclxuXHRcdFx0XHRcdHZhciB0eXBlSW5mb05hbWU7XHJcblx0XHRcdFx0XHQvLyBJZiBtYXBwaW5nIHN0YXJ0cyB3aXRoICcuJyBjb25zaWRlciBpdCB0byBiZSBhIGxvY2FsIHR5cGUgbmFtZSBpbiB0aGlzIG1vZHVsZVxyXG5cdFx0XHRcdFx0aWYgKG1hcHBpbmcubGVuZ3RoID4gMCAmJiBtYXBwaW5nLmNoYXJBdCgwKSA9PT0gJy4nKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR2YXIgbiA9IG1vZHVsZS5uYW1lIHx8IG1vZHVsZS5uIHx8IHVuZGVmaW5lZDtcclxuXHRcdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtb2R1bGUsICdUeXBlIGluZm8gbWFwcGluZyBjYW4gb25seSBiZSByZXNvbHZlZCBpZiBtb2R1bGUgaXMgcHJvdmlkZWQuJyk7XHJcblx0XHRcdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcobiwgJ1R5cGUgaW5mbyBtYXBwaW5nIGNhbiBvbmx5IGJlIHJlc29sdmVkIGlmIG1vZHVsZSBuYW1lIGlzIHByb3ZpZGVkLicpO1xyXG5cdFx0XHRcdFx0XHR0eXBlSW5mb05hbWUgPSBuICsgbWFwcGluZztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0dHlwZUluZm9OYW1lID0gbWFwcGluZztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGlmICghdGhpcy50eXBlSW5mb3NbdHlwZUluZm9OYW1lXSkge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1R5cGUgaW5mbyBbJyArIHR5cGVJbmZvTmFtZSArICddIGlzIG5vdCBrbm93biBpbiB0aGlzIGNvbnRleHQuJyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy50eXBlSW5mb3NbdHlwZUluZm9OYW1lXTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtb2R1bGUsICdUeXBlIGluZm8gbWFwcGluZyBjYW4gb25seSBiZSByZXNvbHZlZCBpZiBtb2R1bGUgaXMgcHJvdmlkZWQuJyk7XHJcblx0XHRcdFx0XHR2YXIgdHlwZUluZm8gPSBtb2R1bGUuY3JlYXRlVHlwZUluZm8obWFwcGluZyk7XHJcblx0XHRcdFx0XHR0eXBlSW5mby5idWlsZCh0aGlzLCBtb2R1bGUpO1xyXG5cdFx0XHRcdFx0cmV0dXJuIHR5cGVJbmZvO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0cmVnaXN0ZXJFbGVtZW50SW5mbyA6IGZ1bmN0aW9uKGVsZW1lbnRJbmZvLCBtb2R1bGUpIHtcclxuXHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KGVsZW1lbnRJbmZvKTtcclxuXHRcdFx0XHR0aGlzLmVsZW1lbnRJbmZvcy5wdXNoKGVsZW1lbnRJbmZvKTtcclxuXHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGVsZW1lbnRJbmZvLnN1YnN0aXR1dGlvbkhlYWQpKSB7XHJcblx0XHRcdFx0XHR2YXIgc3Vic3RpdHV0aW9uSGVhZCA9IGVsZW1lbnRJbmZvLnN1YnN0aXR1dGlvbkhlYWQ7XHJcblx0XHRcdFx0XHR2YXIgc3Vic3RpdHV0aW9uSGVhZEtleSA9IHN1YnN0aXR1dGlvbkhlYWQua2V5O1xyXG5cdFx0XHRcdFx0dmFyIHN1YnN0aXR1dGlvbk1lbWJlcnMgPSB0aGlzLnN1YnN0aXR1dGlvbk1lbWJlcnNNYXBbc3Vic3RpdHV0aW9uSGVhZEtleV07XHJcblxyXG5cdFx0XHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmlzQXJyYXkoc3Vic3RpdHV0aW9uTWVtYmVycykpIHtcclxuXHRcdFx0XHRcdFx0c3Vic3RpdHV0aW9uTWVtYmVycyA9IFtdO1xyXG5cdFx0XHRcdFx0XHR0aGlzLnN1YnN0aXR1dGlvbk1lbWJlcnNNYXBbc3Vic3RpdHV0aW9uSGVhZEtleV0gPSBzdWJzdGl0dXRpb25NZW1iZXJzO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0c3Vic3RpdHV0aW9uTWVtYmVycy5wdXNoKGVsZW1lbnRJbmZvKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBzY29wZUtleTtcclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZWxlbWVudEluZm8uc2NvcGUpKSB7XHJcblx0XHRcdFx0XHRzY29wZUtleSA9IHRoaXMucmVzb2x2ZVR5cGVJbmZvKGVsZW1lbnRJbmZvLnNjb3BlLCBtb2R1bGUpLm5hbWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHNjb3BlS2V5ID0gJyMjZ2xvYmFsJztcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBzY29wZWRFbGVtZW50SW5mb3MgPSB0aGlzLnNjb3BlZEVsZW1lbnRJbmZvc01hcFtzY29wZUtleV07XHJcblxyXG5cdFx0XHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChzY29wZWRFbGVtZW50SW5mb3MpKSB7XHJcblx0XHRcdFx0XHRzY29wZWRFbGVtZW50SW5mb3MgPSB7fTtcclxuXHRcdFx0XHRcdHRoaXMuc2NvcGVkRWxlbWVudEluZm9zTWFwW3Njb3BlS2V5XSA9IHNjb3BlZEVsZW1lbnRJbmZvcztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0c2NvcGVkRWxlbWVudEluZm9zW2VsZW1lbnRJbmZvLmVsZW1lbnROYW1lLmtleV0gPSBlbGVtZW50SW5mbztcclxuXHJcblx0XHRcdH0sXHJcblx0XHRcdGdldFR5cGVJbmZvQnlWYWx1ZSA6IGZ1bmN0aW9uKHZhbHVlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZSkpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QodmFsdWUpKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHZhciB0eXBlTmFtZSA9IHZhbHVlLlRZUEVfTkFNRTtcclxuXHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHR5cGVOYW1lKSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0dmFyIHR5cGVJbmZvQnlOYW1lID0gdGhpcy5nZXRUeXBlSW5mb0J5TmFtZSh0eXBlTmFtZSk7XHJcblx0XHRcdFx0XHRcdGlmICh0eXBlSW5mb0J5TmFtZSlcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiB0eXBlSW5mb0J5TmFtZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQvLyBUT0RPIHB1YmxpYyBBUElcclxuXHRcdFx0Z2V0VHlwZUluZm9CeU5hbWUgOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMudHlwZUluZm9zW25hbWVdO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRUeXBlSW5mb0J5VHlwZU5hbWUgOiBmdW5jdGlvbih0eXBlTmFtZSkge1xyXG5cdFx0XHRcdHZhciB0biA9IEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdE9yU3RyaW5nKHR5cGVOYW1lLCB0aGlzKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy50eXBlTmFtZUtleVRvVHlwZUluZm9bdG4ua2V5XTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0VHlwZUluZm9CeVR5cGVOYW1lS2V5IDogZnVuY3Rpb24odHlwZU5hbWVLZXkpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy50eXBlTmFtZUtleVRvVHlwZUluZm9bdHlwZU5hbWVLZXldO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRFbGVtZW50SW5mbyA6IGZ1bmN0aW9uKG5hbWUsIHNjb3BlKSB7XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHNjb3BlKSkge1xyXG5cdFx0XHRcdFx0dmFyIHNjb3BlS2V5ID0gc2NvcGUubmFtZTtcclxuXHRcdFx0XHRcdHZhciBzY29wZWRFbGVtZW50SW5mb3MgPSB0aGlzLnNjb3BlZEVsZW1lbnRJbmZvc01hcFtzY29wZUtleV07XHJcblx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc2NvcGVkRWxlbWVudEluZm9zKSkge1xyXG5cdFx0XHRcdFx0XHR2YXIgc2NvcGVkRWxlbWVudEluZm8gPSBzY29wZWRFbGVtZW50SW5mb3NbbmFtZS5rZXldO1xyXG5cdFx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc2NvcGVkRWxlbWVudEluZm8pKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHNjb3BlZEVsZW1lbnRJbmZvO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgZ2xvYmFsU2NvcGVLZXkgPSAnIyNnbG9iYWwnO1xyXG5cdFx0XHRcdHZhciBnbG9iYWxTY29wZWRFbGVtZW50SW5mb3MgPSB0aGlzLnNjb3BlZEVsZW1lbnRJbmZvc01hcFtnbG9iYWxTY29wZUtleV07XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGdsb2JhbFNjb3BlZEVsZW1lbnRJbmZvcykpIHtcclxuXHRcdFx0XHRcdHZhciBnbG9iYWxTY29wZWRFbGVtZW50SW5mbyA9IGdsb2JhbFNjb3BlZEVsZW1lbnRJbmZvc1tuYW1lLmtleV07XHJcblx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZ2xvYmFsU2NvcGVkRWxlbWVudEluZm8pKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiBnbG9iYWxTY29wZWRFbGVtZW50SW5mbztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHRcdFx0Ly9cclxuXHRcdFx0XHQvLyB0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IFtcIiArIG5hbWUua2V5XHJcblx0XHRcdFx0Ly8gKyBcIl0gY291bGQgbm90IGJlIGZvdW5kIGluIHRoZSBnaXZlbiBjb250ZXh0LlwiKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0U3Vic3RpdHV0aW9uTWVtYmVycyA6IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5zdWJzdGl0dXRpb25NZW1iZXJzTWFwW0pzb25peC5YTUwuUU5hbWVcclxuXHRcdFx0XHRcdFx0LmZyb21PYmplY3QobmFtZSkua2V5XTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y3JlYXRlTWFyc2hhbGxlciA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgdGhpcy5tYXBwaW5nU3R5bGUubWFyc2hhbGxlcih0aGlzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y3JlYXRlVW5tYXJzaGFsbGVyIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyB0aGlzLm1hcHBpbmdTdHlsZS51bm1hcnNoYWxsZXIodGhpcyk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldE5hbWVzcGFjZVVSSSA6IGZ1bmN0aW9uKHByZWZpeCkge1xyXG5cdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcocHJlZml4KTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wcmVmaXhOYW1lc3BhY2VzW3ByZWZpeF07XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldFByZWZpeCA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgZGVmYXVsdFByZWZpeCkge1xyXG5cdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcobmFtZXNwYWNlVVJJKTtcclxuXHRcdFx0XHR2YXIgcHJlZml4ID0gdGhpcy5uYW1lc3BhY2VQcmVmaXhlc1tuYW1lc3BhY2VVUkldO1xyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHByZWZpeCkpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJuIHByZWZpeDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHJldHVybiBkZWZhdWx0UHJlZml4O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0LyoqXHJcblx0XHRcdCAqIEJ1aWx0aW4gdHlwZSBpbmZvcy5cclxuXHRcdFx0ICovXHJcblx0XHRcdGJ1aWx0aW5UeXBlSW5mb3MgOiBbXHJcblx0XHRcdCAgICAgICAgSnNvbml4LlNjaGVtYS5YU0QuQW55VHlwZS5JTlNUQU5DRSxcclxuXHRcdFx0ICAgICAgICBKc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuQW55VVJJLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuQmFzZTY0QmluYXJ5LklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuQm9vbGVhbi5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkJ5dGUuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkRhdGVBc0RhdGUuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5EYXRlLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuRGF0ZVRpbWVBc0RhdGUuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5EYXRlVGltZS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkRlY2ltYWwuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5Eb3VibGUuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5EdXJhdGlvbi5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkZsb2F0LklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuR0RheS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkdNb250aC5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkdNb250aERheS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkdZZWFyLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuR1llYXJNb250aC5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkhleEJpbmFyeS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELklELklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuSURSRUYuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5JRFJFRlMuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5JbnQuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5JbnRlZ2VyLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuTGFuZ3VhZ2UuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5Mb25nLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuTmFtZS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELk5DTmFtZS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELk5lZ2F0aXZlSW50ZWdlci5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELk5NVG9rZW4uSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5OTVRva2Vucy5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELk5vbk5lZ2F0aXZlSW50ZWdlci5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELk5vblBvc2l0aXZlSW50ZWdlci5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELk5vcm1hbGl6ZWRTdHJpbmcuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5OdW1iZXIuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5Qb3NpdGl2ZUludGVnZXIuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5RTmFtZS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELlNob3J0LklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuU3RyaW5nLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuU3RyaW5ncy5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELlRpbWVBc0RhdGUuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5UaW1lLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuVG9rZW4uSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZEJ5dGUuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZEludC5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkTG9uZy5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkU2hvcnQuSU5TVEFOQ0UgXSxcclxuXHRcdFx0Q0xBU1NfTkFNRSA6ICdKc29uaXguQ29udGV4dCdcclxuXHRcdH0pO1xyXG5cdC8vIENvbXBsZXRlIEpzb25peCBzY3JpcHQgaXMgaW5jbHVkZWQgYWJvdmVcclxuXHRyZXR1cm4geyBKc29uaXg6IEpzb25peCB9O1xyXG59O1xyXG5cclxuLy8gSWYgdGhlIHJlcXVpcmUgZnVuY3Rpb24gZXhpc3RzIC4uLlxyXG5pZiAodHlwZW9mIHJlcXVpcmUgPT09ICdmdW5jdGlvbicpIHtcclxuXHQvLyAuLi4gYnV0IHRoZSBkZWZpbmUgZnVuY3Rpb24gZG9lcyBub3QgZXhpc3RzXHJcblx0aWYgKHR5cGVvZiBkZWZpbmUgIT09ICdmdW5jdGlvbicpIHtcclxuXHRcdGlmICghcHJvY2Vzcy5icm93c2VyKSB7XHJcblx0XHRcdC8vIExvYWQgdGhlIGRlZmluZSBmdW5jdGlvbiB2aWEgYW1kZWZpbmVcclxuXHRcdFx0ZGVmaW5lID0gcmVxdWlyZSgnYW1kZWZpbmUnKShtb2R1bGUpO1xyXG5cdFx0XHQvLyBSZXF1aXJlIHhtbGRvbSwgeG1saHR0cHJlcXVlc3QgYW5kIGZzXHJcblx0XHRcdGRlZmluZShbXCJ4bWxkb21cIiwgXCJ4bWxodHRwcmVxdWVzdFwiLCBcImZzXCJdLCBfanNvbml4X2ZhY3RvcnkpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBXZSdyZSBwcm9iYWJseSBpbiBicm93c2VyLCBtYXliZSBicm93c2VyaWZ5XHJcblx0XHRcdC8vIERvIG5vdCByZXF1aXJlIHhtbGRvbSwgeG1saHR0cHJlcXVlc3QgYXMgdGhleSdyIHByb3ZpZGVkIGJ5IHRoZSBicm93c2VyXHJcblx0XHRcdC8vIERvIG5vdCByZXF1aXJlIGZzIHNpbmNlIGZpbGUgc3lzdGVtIGlzIG5vdCBhdmFpbGFibGUgYW55d2F5XHJcblx0XHRcdGRlZmluZShbXSwgX2pzb25peF9mYWN0b3J5KTtcclxuXHRcdH1cclxuXHR9XHJcblx0ZWxzZSB7XHJcblx0XHQvLyBPdGhlcndpc2UgYXNzdW1lIHdlJ3JlIGluIHRoZSBicm93c2VyL1JlcXVpcmVKUyBlbnZpcm9ubWVudFxyXG5cdFx0Ly8gTG9hZCB0aGUgbW9kdWxlIHdpdGhvdXQgeG1sZG9tIGFuZCB4bWxodHRwcmVxdWVzdHMgZGVwZW5kZW5jaWVzXHJcblx0XHRkZWZpbmUoW10sIF9qc29uaXhfZmFjdG9yeSk7XHJcblx0fVxyXG59XHJcbi8vIElmIHRoZSByZXF1aXJlIGZ1bmN0aW9uIGRvZXMgbm90IGV4aXN0cywgd2UncmUgbm90IGluIE5vZGUuanMgYW5kIHRoZXJlZm9yZSBpbiBicm93c2VyIGVudmlyb25tZW50XHJcbmVsc2Vcclxue1xyXG5cdC8vIEp1c3QgY2FsbCB0aGUgZmFjdG9yeSBhbmQgc2V0IEpzb25peCBhcyBnbG9iYWwuXHJcblx0dmFyIEpzb25peCA9IF9qc29uaXhfZmFjdG9yeSgpLkpzb25peDtcclxufVxyXG4iXX0=