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
      // sourceIsEvt = typeof window !== 'undefined' && window !== null && typeof window.Event === "function" && source instanceof window.Event;
      // if (!sourceIsEvt && source.hasOwnProperty && source.hasOwnProperty('toString')) {
      // 	destination.toString = source.toString;
      // }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9jb21wb25lbnRzL3V0aWxzL2pzb25peC5qcyJdLCJuYW1lcyI6WyJfanNvbml4X2ZhY3RvcnkiLCJfanNvbml4X3htbGRvbSIsIl9qc29uaXhfeG1saHR0cHJlcXVlc3QiLCJfanNvbml4X2ZzIiwiSnNvbml4Iiwic2luZ2xlRmlsZSIsIlV0aWwiLCJleHRlbmQiLCJkZXN0aW5hdGlvbiIsInNvdXJjZSIsInByb3BlcnR5IiwidmFsdWUiLCJ1bmRlZmluZWQiLCJDbGFzcyIsImluaXRpYWxpemUiLCJhcHBseSIsImFyZ3VtZW50cyIsImV4dGVuZGVkIiwiZW1wdHkiLCJwYXJlbnQiLCJUeXBlIiwiaSIsImxlbiIsImxlbmd0aCIsInByb3RvdHlwZSIsIlhNTCIsIlhNTE5TX05TIiwiWE1MTlNfUCIsIkRPTSIsImlzRG9tSW1wbGVtZW50YXRpb25BdmFpbGFibGUiLCJkb2N1bWVudCIsImV4aXN0cyIsImltcGxlbWVudGF0aW9uIiwiaXNGdW5jdGlvbiIsImNyZWF0ZURvY3VtZW50IiwiRE9NSW1wbGVtZW50YXRpb24iLCJBY3RpdmVYT2JqZWN0IiwiRXJyb3IiLCJzZXJpYWxpemUiLCJub2RlIiwiRW5zdXJlIiwiZW5zdXJlRXhpc3RzIiwiWE1MU2VyaWFsaXplciIsInNlcmlhbGl6ZVRvU3RyaW5nIiwieG1sIiwicGFyc2UiLCJ0ZXh0IiwiRE9NUGFyc2VyIiwicGFyc2VGcm9tU3RyaW5nIiwiZG9jIiwibG9hZFhNTCIsInVybCIsImVuY29kZVVSSUNvbXBvbmVudCIsInJlcXVlc3QiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJvdmVycmlkZU1pbWVUeXBlIiwic2VuZCIsInJlc3BvbnNlWE1MIiwibG9hZCIsImNhbGxiYWNrIiwib3B0aW9ucyIsIlJlcXVlc3QiLCJJTlNUQU5DRSIsImlzc3VlIiwidHJhbnNwb3J0IiwicmVzdWx0IiwiZG9jdW1lbnRFbGVtZW50IiwiaXNTdHJpbmciLCJyZXNwb25zZVRleHQiLCJ4bGlua0ZpeFJlcXVpcmVkIiwiaXNYbGlua0ZpeFJlcXVpcmVkIiwibmF2aWdhdG9yIiwidXNlckFnZW50IiwidGVzdCIsInZlbmRvciIsImVsIiwiY3JlYXRlRWxlbWVudCIsInNldEF0dHJpYnV0ZU5TIiwiYXBwZW5kQ2hpbGQiLCJ0ZXN0U3RyaW5nIiwiaW5kZXhPZiIsImZhY3RvcmllcyIsIm9uU3VjY2VzcyIsIm9uRmFpbHVyZSIsImVuc3VyZVN0cmluZyIsImVuc3VyZUZ1bmN0aW9uIiwiZW5zdXJlT2JqZWN0IiwiY3JlYXRlVHJhbnNwb3J0IiwibWV0aG9kIiwiYXN5bmMiLCJpc0Jvb2xlYW4iLCJwcm94eSIsIlBST1hZIiwidXNlciIsInBhc3N3b3JkIiwiaXNPYmplY3QiLCJoZWFkZXJzIiwiaGVhZGVyIiwiaGFzT3duUHJvcGVydHkiLCJzZXRSZXF1ZXN0SGVhZGVyIiwiZGF0YSIsImhhbmRsZVRyYW5zcG9ydCIsInRoYXQiLCJ3aW5kb3ciLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJzZXRUaW1lb3V0IiwicmVhZHlTdGF0ZSIsInN0YXR1cyIsImluZGV4IiwiZSIsIkNMQVNTX05BTUUiLCJTY2hlbWEiLCJNb2RlbCIsImlzVW5kZWZpbmVkIiwiaXNOdW1iZXIiLCJpc05hTiIsImlzTnVtYmVyT3JOYU4iLCJPYmplY3QiLCJ0b1N0cmluZyIsImNhbGwiLCJpc0FycmF5IiwiY29uY2F0IiwidW5zaGlmdCIsImNhbGxlZSIsImlzRGF0ZSIsImdldFRpbWV6b25lT2Zmc2V0Iiwic2V0VVRDRnVsbFllYXIiLCJpc1JlZ0V4cCIsImV4ZWMiLCJpZ25vcmVDYXNlIiwiaXNOb2RlIiwiTm9kZSIsIm5vZGVUeXBlIiwibm9kZU5hbWUiLCJpc0VxdWFsIiwiYSIsImIiLCJyZXBvcnQiLCJkb1JlcG9ydCIsIl9yYW5nZSIsInN0YXJ0Iiwic3RvcCIsInN0ZXAiLCJhcmdzIiwic2xpY2UiLCJzb2xvIiwic3RhcnRfIiwic3RvcF8iLCJzdGVwXyIsIk1hdGgiLCJtYXgiLCJjZWlsIiwiaWR4IiwicmFuZ2UiLCJBcnJheSIsIl9rZXlzIiwia2V5cyIsIm9iaiIsImtleSIsImF0eXBlIiwiYnR5cGUiLCJnZXRUaW1lIiwiZ2xvYmFsIiwibXVsdGlsaW5lIiwiYVNlcmlhbGl6ZWQiLCJiU2VyaWFsaXplZCIsImFLZXlzIiwiYktleXMiLCJhbmRleCIsImJuZGV4Iiwia25kZXgiLCJjbG9uZU9iamVjdCIsInRhcmdldCIsInAiLCJkZWZhdWx0VmFsdWUiLCJ0eXBlT2ZEZWZhdWx0VmFsdWUiLCJjYW5kaWRhdGVWYWx1ZSIsIk51bWJlclV0aWxzIiwiaXNJbnRlZ2VyIiwiU3RyaW5nVXRpbHMiLCJ0cmltIiwiU3RyaW5nIiwic3RyIiwicmVwbGFjZSIsImlzRW1wdHkiLCJjIiwiaXNOb3RCbGFuayIsIndoaXRlc3BhY2VDaGFyYWN0ZXJzIiwid2hpdGVzcGFjZUNoYXJhY3RlcnNNYXAiLCJzcGxpdEJ5U2VwYXJhdG9yQ2hhcnMiLCJzZXBhcmF0b3JDaGFycyIsInNwbGl0IiwibGlzdCIsInNpemVQbHVzMSIsIm1hdGNoIiwibGFzdE1hdGNoIiwicHJlc2VydmVBbGxUb2tlbnMiLCJjaGFyQXQiLCJwdXNoIiwic3Vic3RyaW5nIiwiZW5zdXJlQm9vbGVhbiIsImVuc3VyZU51bWJlciIsImVuc3VyZU51bWJlck9yTmFOIiwiZW5zdXJlSW50ZWdlciIsImVuc3VyZURhdGUiLCJEYXRlIiwiZW5zdXJlQXJyYXkiLCJRTmFtZSIsIm5hbWVzcGFjZVVSSSIsImxvY2FsUGFydCIsInByZWZpeCIsInN0cmluZyIsIm9uZSIsInR3byIsInRocmVlIiwiY29sb25Qb3NpdGlvbiIsInRvQ2Fub25pY2FsU3RyaW5nIiwibmFtZXNwYWNlQ29udGV4dCIsImNhbm9uaWNhbFByZWZpeCIsImdldFByZWZpeCIsImNsb25lIiwiZXF1YWxzIiwiZnJvbVN0cmluZyIsInFOYW1lQXNTdHJpbmciLCJkZWZhdWx0TmFtZXNwYWNlVVJJIiwibGVmdEJyYWNrZXQiLCJyaWdodEJyYWNrZXQiLCJsYXN0SW5kZXhPZiIsInByZWZpeGVkTmFtZSIsImdldE5hbWVzcGFjZVVSSSIsImZyb21PYmplY3QiLCJvYmplY3QiLCJscCIsIm5zIiwiZnJvbU9iamVjdE9yU3RyaW5nIiwibG9jYWxOYW1lIiwiQ2FsZW5kYXIiLCJ5ZWFyIiwiTmFOIiwibW9udGgiLCJkYXkiLCJob3VyIiwibWludXRlIiwic2Vjb25kIiwiZnJhY3Rpb25hbFNlY29uZCIsInRpbWV6b25lIiwiZGF0ZSIsInZhbGlkYXRlWWVhciIsInZhbGlkYXRlTW9udGgiLCJ2YWxpZGF0ZVllYXJNb250aERheSIsInZhbGlkYXRlTW9udGhEYXkiLCJ2YWxpZGF0ZURheSIsInZhbGlkYXRlSG91ciIsInZhbGlkYXRlTWludXRlIiwidmFsaWRhdGVTZWNvbmQiLCJ2YWxpZGF0ZUZyYWN0aW9uYWxTZWNvbmQiLCJ2YWxpZGF0ZVRpbWV6b25lIiwiaW5pdGlhbERhdGUiLCJzZXRVVENNb250aCIsInNldFVUQ0RhdGUiLCJzZXRVVENIb3VycyIsInNldFVUQ01pbnV0ZXMiLCJzZXRVVENTZWNvbmRzIiwic2V0VVRDTWlsbGlzZWNvbmRzIiwidGltZXpvbmVPZmZzZXQiLCJNSU5fVElNRVpPTkUiLCJNQVhfVElNRVpPTkUiLCJEQVlTX0lOX01PTlRIIiwibWF4RGF5c0luTW9udGgiLCJJbnB1dCIsInJvb3QiLCJhdHRyaWJ1dGVzIiwiZXZlbnRUeXBlIiwicG5zIiwicm9vdFBuc0l0ZW0iLCJoYXNOZXh0IiwibmV4dCIsImVudGVyIiwibGVhdmUiLCJmaXJzdENoaWxkIiwibmV4dFNpYmxpbmciLCJwdXNoTlMiLCJub2RlVmFsdWUiLCJwb3BOUyIsIm5leHRTaWJsaW5nMSIsInBhcmVudE5vZGUiLCJnZXROYW1lIiwiZ2V0TmFtZUtleSIsImdldFRleHQiLCJuZXh0VGFnIiwiZXQiLCJza2lwRWxlbWVudCIsIlNUQVJUX0VMRU1FTlQiLCJudW1iZXJPZk9wZW5UYWdzIiwiZ2V0RWxlbWVudFRleHQiLCJjb250ZW50IiwicmV0cmlldmVFbGVtZW50IiwiZWxlbWVudCIsInJldHJpZXZlQXR0cmlidXRlcyIsImdldEF0dHJpYnV0ZUNvdW50IiwiZ2V0QXR0cmlidXRlTmFtZSIsImF0dHJpYnV0ZSIsImdldEF0dHJpYnV0ZU5hbWVLZXkiLCJnZXRBdHRyaWJ1dGVWYWx1ZSIsImdldEF0dHJpYnV0ZVZhbHVlTlMiLCJnZXRBdHRyaWJ1dGVWYWx1ZU5TVmlhRWxlbWVudCIsImdldEF0dHJpYnV0ZU5TIiwiZ2V0QXR0cmlidXRlVmFsdWVOU1ZpYUF0dHJpYnV0ZSIsImF0dHJpYnV0ZU5vZGUiLCJnZXRBdHRyaWJ1dGVOb2RlTlMiLCJnZXRBdHRyaWJ1dGVOb2RlTlNWaWFFbGVtZW50IiwiZ2V0QXR0cmlidXRlTm9kZU5TVmlhQXR0cmlidXRlcyIsInBvdGVudGlhbE5vZGUiLCJmdWxsTmFtZSIsImdldEVsZW1lbnQiLCJwaW5kZXgiLCJwYXJlbnRQbnNJdGVtIiwicG5zSXRlbSIsInJlZmVyZW5jZSIsImFsZW5ndGgiLCJhaW5kZXgiLCJhdHRyaWJ1dGVOYW1lIiwiaXNOUyIsInBvcCIsIkVORF9FTEVNRU5UIiwiUFJPQ0VTU0lOR19JTlNUUlVDVElPTiIsIkNIQVJBQ1RFUlMiLCJDT01NRU5UIiwiU1BBQ0UiLCJTVEFSVF9ET0NVTUVOVCIsIkVORF9ET0NVTUVOVCIsIkVOVElUWV9SRUZFUkVOQ0UiLCJBVFRSSUJVVEUiLCJEVEQiLCJDREFUQSIsIk5BTUVTUEFDRSIsIk5PVEFUSU9OX0RFQ0xBUkFUSU9OIiwiRU5USVRZX0RFQ0xBUkFUSU9OIiwiT3V0cHV0Iiwibm9kZXMiLCJuc3AiLCJuYW1lc3BhY2VQcmVmaXhJbmRleCIsInhtbGRvbSIsInJvb3ROc3BJdGVtIiwibmFtZXNwYWNlUHJlZml4ZXMiLCJkZXN0cm95Iiwid3JpdGVTdGFydERvY3VtZW50Iiwid3JpdGVFbmREb2N1bWVudCIsIndyaXRlU3RhcnRFbGVtZW50IiwibmFtZSIsInF1YWxpZmllZE5hbWUiLCJjcmVhdGVFbGVtZW50TlMiLCJjcmVhdGVOb2RlIiwicGVlayIsImRlY2xhcmVOYW1lc3BhY2UiLCJkZWNsYXJlTmFtZXNwYWNlcyIsIndyaXRlRW5kRWxlbWVudCIsIndyaXRlQ2hhcmFjdGVycyIsImNyZWF0ZVRleHROb2RlIiwid3JpdGVDZGF0YSIsInBhcnRzIiwiam5kZXgiLCJ3cml0ZUNkYXRhV2l0aG91dENkZW5kIiwiY3JlYXRlQ0RBVEFTZWN0aW9uIiwid3JpdGVBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGVOb2RlIiwid3JpdGVOb2RlIiwiaW1wb3J0ZWROb2RlIiwiaW1wb3J0Tm9kZSIsIm5pbmRleCIsInBhcmVudE5zcEl0ZW0iLCJuc3BJdGVtIiwib2xkcCIsIk1hcHBpbmciLCJTdHlsZSIsIm1hcnNoYWxsZXIiLCJ1bm1hcnNoYWxsZXIiLCJtb2R1bGUiLCJlbGVtZW50SW5mbyIsImNsYXNzSW5mbyIsImVudW1MZWFmSW5mbyIsImFueUF0dHJpYnV0ZVByb3BlcnR5SW5mbyIsImFueUVsZW1lbnRQcm9wZXJ0eUluZm8iLCJhdHRyaWJ1dGVQcm9wZXJ0eUluZm8iLCJlbGVtZW50TWFwUHJvcGVydHlJbmZvIiwiZWxlbWVudFByb3BlcnR5SW5mbyIsImVsZW1lbnRzUHJvcGVydHlJbmZvIiwiZWxlbWVudFJlZlByb3BlcnR5SW5mbyIsImVsZW1lbnRSZWZzUHJvcGVydHlJbmZvIiwidmFsdWVQcm9wZXJ0eUluZm8iLCJTVFlMRVMiLCJTdHlsZWQiLCJtYXBwaW5nU3R5bGUiLCJzdGFuZGFyZCIsIkJpbmRpbmciLCJNYXJzaGFsbHMiLCJFbGVtZW50IiwibWFyc2hhbEVsZW1lbnQiLCJjb250ZXh0Iiwib3V0cHV0Iiwic2NvcGUiLCJlbGVtZW50VmFsdWUiLCJjb252ZXJ0VG9UeXBlZE5hbWVkVmFsdWUiLCJkZWNsYXJlZFR5cGVJbmZvIiwidHlwZUluZm8iLCJhY3R1YWxUeXBlSW5mbyIsInN1cHBvcnRYc2lUeXBlIiwidHlwZUluZm9CeVZhbHVlIiwiZ2V0VHlwZUluZm9CeVZhbHVlIiwidHlwZU5hbWUiLCJ4c2lUeXBlTmFtZSIsInhzaVR5cGUiLCJYU0QiLCJwcmludCIsIlhTSSIsIlRZUEVfUU5BTUUiLCJtYXJzaGFsIiwiZ2V0VHlwZUluZm9CeUVsZW1lbnROYW1lIiwiZ2V0RWxlbWVudEluZm8iLCJBc0VsZW1lbnRSZWYiLCJjb252ZXJ0VG9OYW1lZFZhbHVlIiwicHJvcGVydHlOYW1lIiwiVW5tYXJzaGFsbHMiLCJXcmFwcGVyRWxlbWVudCIsIm1peGVkIiwidW5tYXJzaGFsV3JhcHBlckVsZW1lbnQiLCJpbnB1dCIsInVubWFyc2hhbEVsZW1lbnQiLCJhbGxvd1R5cGVkT2JqZWN0IiwiYWxsb3dEb20iLCJnZXRUeXBlSW5mb0J5SW5wdXRFbGVtZW50IiwidW5tYXJzaGFsIiwidHlwZWROYW1lZFZhbHVlIiwiY29udmVydEZyb21UeXBlZE5hbWVkVmFsdWUiLCJ4c2lUeXBlSW5mbyIsIk5BTUVTUEFDRV9VUkkiLCJUWVBFIiwiZ2V0VHlwZUluZm9CeVR5cGVOYW1lS2V5IiwiQXNTaW1wbGlmaWVkRWxlbWVudFJlZiIsIk1hcnNoYWxsZXIiLCJtYXJzaGFsU3RyaW5nIiwibWFyc2hhbERvY3VtZW50IiwiU2ltcGxpZmllZCIsIlVubWFyc2hhbGxlciIsInVubWFyc2hhbFN0cmluZyIsInVubWFyc2hhbERvY3VtZW50IiwidW5tYXJzaGFsVVJMIiwidW5tYXJzaGFsRmlsZSIsImZpbGVOYW1lIiwiZnMiLCJyZWFkRmlsZSIsImVyciIsIl9yZXN1bHQiLCJUeXBlSW5mbyIsImJhc2VUeXBlSW5mbyIsImlzQmFzZWRPbiIsImN1cnJlbnRUeXBlSW5mbyIsIkNsYXNzSW5mbyIsImluc3RhbmNlRmFjdG9yeSIsInByb3BlcnRpZXMiLCJwcm9wZXJ0aWVzTWFwIiwic3RydWN0dXJlIiwidGFyZ2V0TmFtZXNwYWNlIiwiZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkiLCJkZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJIiwiYnVpbHQiLCJtYXBwaW5nIiwibiIsImxuIiwiZGVucyIsInRucyIsImRhbnMiLCJidGkiLCJpbkYiLCJ0biIsInBzIiwicHJvcGVydHlJbmZvcyIsImdldFByb3BlcnR5SW5mb0J5TmFtZSIsImJ1aWxkIiwicmVzb2x2ZVR5cGVJbmZvIiwicHJvcGVydHlJbmZvIiwiZWxlbWVudHMiLCJhbnlBdHRyaWJ1dGUiLCJhbnkiLCJidWlsZFN0cnVjdHVyZSIsIlRZUEVfTkFNRSIsImF0dHJpYnV0ZUNvdW50IiwiYXR0cmlidXRlTmFtZUtleSIsImF0dHJpYnV0ZVZhbHVlIiwidW5tYXJzaGFsUHJvcGVydHlWYWx1ZSIsInVubWFyc2hhbFByb3BlcnR5IiwiZWxlbWVudE5hbWVLZXkiLCJhbnlQcm9wZXJ0eUluZm8iLCJtaXhlZFByb3BlcnR5SW5mbyIsInByb3BlcnR5VmFsdWUiLCJzZXRQcm9wZXJ0eSIsInVubWFyc2hhbFZhbHVlIiwiaXNNYXJzaGFsbGFibGUiLCJzaW5nbGVQcm9wZXJ0eUluZm8iLCJpc0luc3RhbmNlIiwiUHJvcGVydHlJbmZvIiwiYWRkUHJvcGVydHkiLCJ0eXBlIiwidCIsInByb3BlcnR5SW5mb0NyZWF0b3JzIiwicHJvcGVydHlJbmZvQ3JlYXRvciIsImFhIiwiYWRkRGVmYXVsdE5hbWVzcGFjZXMiLCJhZSIsImVtIiwiZXMiLCJlciIsImVycyIsInYiLCJFbnVtTGVhZkluZm8iLCJlbnRyaWVzIiwidmFsdWVzIiwidnMiLCJpdGVtcyIsInJlcHJpbnQiLCJFbGVtZW50SW5mbyIsImVsZW1lbnROYW1lIiwic3Vic3RpdHV0aW9uSGVhZCIsImVuIiwidGkiLCJzaCIsInNjIiwiY29sbGVjdGlvbiIsImNvbCIsInJxIiwicmVxdWlyZWQiLCJtbm8iLCJtaW5PY2N1cnMiLCJteG8iLCJtYXhPY2N1cnMiLCJkb0J1aWxkIiwiQW55QXR0cmlidXRlUHJvcGVydHlJbmZvIiwiY29udmVydEZyb21BdHRyaWJ1dGVOYW1lIiwiY29udmVydFRvQXR0cmlidXRlTmFtZSIsIlNpbmdsZVR5cGVQcm9wZXJ0eUluZm8iLCJBdHRyaWJ1dGVQcm9wZXJ0eUluZm8iLCJhbiIsIlZhbHVlUHJvcGVydHlJbmZvIiwiY2RhdGEiLCJhc0NEQVRBIiwiQWJzdHJhY3RFbGVtZW50c1Byb3BlcnR5SW5mbyIsIndyYXBwZXJFbGVtZW50TmFtZSIsIndlbiIsIml0ZW0iLCJidWlsZFN0cnVjdHVyZUVsZW1lbnRzIiwiRWxlbWVudFByb3BlcnR5SW5mbyIsIkVsZW1lbnRzUHJvcGVydHlJbmZvIiwiZWxlbWVudFR5cGVJbmZvcyIsImVsZW1lbnRUeXBlSW5mb3NNYXAiLCJldGlzIiwiZWxlbWVudFR5cGVJbmZvIiwiZXRpIiwiZXRpdGkiLCJldGllbiIsIkVsZW1lbnRNYXBQcm9wZXJ0eUluZm8iLCJlbnRyeVR5cGVJbmZvIiwiayIsImVudHJ5Iiwic2luZ2xlRW50cnkiLCJjb2xsZWN0aW9uRW50cnkiLCJtYXAiLCJBYnN0cmFjdEVsZW1lbnRSZWZzUHJvcGVydHlJbmZvIiwiZG9tIiwidHlwZWQiLCJteCIsIm1hcnNoYWxJdGVtIiwicHJvcGVydHlFbGVtZW50VHlwZUluZm8iLCJnZXRQcm9wZXJ0eUVsZW1lbnRUeXBlSW5mbyIsImNvbnRleHRFbGVtZW50VHlwZUluZm8iLCJidWlsZFN0cnVjdHVyZUVsZW1lbnRUeXBlSW5mb3MiLCJzdWJzdGl0dXRpb25NZW1iZXJzIiwiZ2V0U3Vic3RpdHV0aW9uTWVtYmVycyIsInN1YnN0aXR1dGlvbkVsZW1lbnRJbmZvIiwiRWxlbWVudFJlZlByb3BlcnR5SW5mbyIsIkVsZW1lbnRSZWZzUHJvcGVydHlJbmZvIiwiQW55RWxlbWVudFByb3BlcnR5SW5mbyIsIk1vZHVsZSIsInR5cGVJbmZvcyIsImVsZW1lbnRJbmZvcyIsInRpcyIsImluaXRpYWxpemVUeXBlSW5mb3MiLCJ0eXBlSW5mb05hbWUiLCJlaXMiLCJpbml0aWFsaXplRWxlbWVudEluZm9zIiwidHlwZUluZm9NYXBwaW5ncyIsInR5cGVJbmZvTWFwcGluZyIsImNyZWF0ZVR5cGVJbmZvIiwiZWxlbWVudEluZm9NYXBwaW5ncyIsImVsZW1lbnRJbmZvTWFwcGluZyIsImNyZWF0ZUVsZW1lbnRJbmZvIiwidHlwZUluZm9DcmVhdG9ycyIsInR5cGVJbmZvQ3JlYXRvciIsImluaXRpYWxpemVOYW1lcyIsImNyZWF0ZUNsYXNzSW5mbyIsImNyZWF0ZUVudW1MZWFmSW5mbyIsImNyZWF0ZUxpc3QiLCJzIiwic2VwYXJhdG9yIiwic2VwIiwibGlzdFR5cGVJbmZvIiwiTGlzdCIsInJlZ2lzdGVyVHlwZUluZm9zIiwicmVnaXN0ZXJUeXBlSW5mbyIsImJ1aWxkVHlwZUluZm9zIiwicmVnaXN0ZXJFbGVtZW50SW5mb3MiLCJyZWdpc3RlckVsZW1lbnRJbmZvIiwiYnVpbGRFbGVtZW50SW5mb3MiLCJjcyIsIlN0YW5kYXJkIiwic2ltcGxpZmllZCIsIlBSRUZJWCIsInFuYW1lIiwiQW55VHlwZSIsIkFueVNpbXBsZVR5cGUiLCJ0cmltbWVkU2VwYXJhdG9yIiwic2ltcGxlVHlwZSIsIkxJU1QiLCJTdHJpbmdzIiwiTm9ybWFsaXplZFN0cmluZyIsIlRva2VuIiwiTGFuZ3VhZ2UiLCJOYW1lIiwiTkNOYW1lIiwiTk1Ub2tlbiIsIk5NVG9rZW5zIiwiQm9vbGVhbiIsIkJhc2U2NEJpbmFyeSIsImNoYXJUb0J5dGUiLCJieXRlVG9DaGFyIiwiY2hhclRhYmxlIiwiX2NoYXIiLCJfYnl0ZSIsImNoYXJDb2RlQXQiLCJlbmNvZGUiLCJkZWNvZGUiLCJ1YXJyYXkiLCJieXRlMCIsImJ5dGUxIiwiYnl0ZTIiLCJjaGFyMCIsImNoYXIxIiwiY2hhcjIiLCJjaGFyMyIsImoiLCJmbG9vciIsIkhleEJpbmFyeSIsImNoYXJUb1F1YXJ0ZXQiLCJieXRlVG9EdXBsZXQiLCJjaGFyVGFibGVVcHBlckNhc2UiLCJjaGFyVGFibGVMb3dlckNhc2UiLCJ0b0xvd2VyQ2FzZSIsIk51bWJlciIsIkluZmluaXR5IiwiRmxvYXQiLCJNSU5fVkFMVUUiLCJNQVhfVkFMVUUiLCJEZWNpbWFsIiwiSW50ZWdlciIsIk5vblBvc2l0aXZlSW50ZWdlciIsIk5lZ2F0aXZlSW50ZWdlciIsIkxvbmciLCJJbnQiLCJTaG9ydCIsIkJ5dGUiLCJOb25OZWdhdGl2ZUludGVnZXIiLCJVbnNpZ25lZExvbmciLCJVbnNpZ25lZEludCIsIlVuc2lnbmVkU2hvcnQiLCJVbnNpZ25lZEJ5dGUiLCJQb3NpdGl2ZUludGVnZXIiLCJEb3VibGUiLCJBbnlVUkkiLCJxTmFtZSIsIlJlZ0V4cCIsIkRBVEVUSU1FX1BBVFRFUk4iLCJwYXJzZURhdGVUaW1lIiwiREFURV9QQVRURVJOIiwicGFyc2VEYXRlIiwiVElNRV9QQVRURVJOIiwicGFyc2VUaW1lIiwiR1lFQVJfTU9OVEhfUEFUVEVSTiIsInBhcnNlR1llYXJNb250aCIsIkdZRUFSX1BBVFRFUk4iLCJwYXJzZUdZZWFyIiwiR01PTlRIX0RBWV9QQVRURVJOIiwicGFyc2VHTW9udGhEYXkiLCJHTU9OVEhfUEFUVEVSTiIsInBhcnNlR01vbnRoIiwiR0RBWV9QQVRURVJOIiwicGFyc2VHRGF5IiwiZ1llYXJNb250aEV4cHJlc3Npb24iLCJyZXN1bHRzIiwicGFyc2VJbnQiLCJwYXJzZVRpbWV6b25lU3RyaW5nIiwiZ1llYXJFeHByZXNzaW9uIiwiZ01vbnRoRGF5RXhwcmVzc2lvbiIsImdNb250aEV4cHJlc3Npb24iLCJnRGF5RXhwcmVzc2lvbiIsImV4cHJlc3Npb24iLCJwYXJzZUZsb2F0IiwiVElNRVpPTkVfUEFUVEVSTiIsInNpZ24iLCJwcmludERhdGVUaW1lIiwicHJpbnREYXRlIiwicHJpbnRUaW1lIiwicHJpbnRHWWVhck1vbnRoIiwicHJpbnRHTW9udGhEYXkiLCJwcmludEdZZWFyIiwicHJpbnRHTW9udGgiLCJwcmludEdEYXkiLCJmcmFjdGlvbmFsU3RyaW5nIiwicHJpbnREYXRlU3RyaW5nIiwicHJpbnRUaW1lU3RyaW5nIiwicHJpbnRUaW1lem9uZVN0cmluZyIsInByaW50WWVhciIsInByaW50TW9udGgiLCJwcmludERheSIsInByaW50SG91ciIsInByaW50TWludXRlIiwicHJpbnRTZWNvbmQiLCJwcmludEZyYWN0aW9uYWxTZWNvbmQiLCJnZXREYXRlIiwiZ2V0TW9udGgiLCJnZXRGdWxsWWVhciIsInByaW50U2lnbmVkWWVhciIsInByaW50SW50ZWdlciIsImRvdEluZGV4IiwiWUVBUl9QQVRURVJOIiwiTU9OVEhfUEFUVEVSTiIsIlNJTkdMRV9NT05USF9QQVRURVJOIiwiREFZX1BBVFRFUk4iLCJTSU5HTEVfREFZX1BBVFRFUk4iLCJEQVRFX1BBUlRfUEFUVEVSTiIsIlRJTUVfUEFSVF9QQVRURVJOIiwiRHVyYXRpb24iLCJ5ZWFycyIsIm1vbnRocyIsImRheXMiLCJob3VycyIsIm1pbnV0ZXMiLCJzZWNvbmRzIiwidmFsaWRhdGUiLCJpZkV4aXN0c0Vuc3VyZVVuc2lnbmVkSW50ZWdlciIsIm1lc3NhZ2UiLCJpZkV4aXN0c0Vuc3VyZVVuc2lnbmVkTnVtYmVyIiwiZHVyYXRpb25FeHByZXNzaW9uIiwiUEFUVEVSTiIsImR1cmF0aW9uIiwiRGF0ZVRpbWUiLCJEYXRlVGltZUFzRGF0ZSIsImNhbGVuZGFyIiwic2V0RnVsbFllYXIiLCJzZXRNb250aCIsInNldERhdGUiLCJzZXRIb3VycyIsInNldE1pbnV0ZXMiLCJzZXRTZWNvbmRzIiwic2V0TWlsbGlzZWNvbmRzIiwidW5rbm93blRpbWV6b25lIiwibG9jYWxUaW1lem9uZSIsIm9yaWdpbmFsVGltZXpvbmUiLCJjb3JyZWN0ZWRWYWx1ZSIsImdldEhvdXJzIiwiZ2V0TWludXRlcyIsImdldFNlY29uZHMiLCJnZXRNaWxsaXNlY29uZHMiLCJ4IiwiVGltZSIsIlRpbWVBc0RhdGUiLCJ0aW1lIiwiY29ycmVjdGVkVGltZSIsInRpbWV6b25lSG91cnMiLCJjb3JyZWN0ZWRUaW1lSW5TZWNvbmRzIiwiRGF0ZUFzRGF0ZSIsImxvY2FsRGF0ZSIsIm5leHREYXkiLCJHWWVhck1vbnRoIiwiR1llYXIiLCJHTW9udGhEYXkiLCJHRGF5IiwiR01vbnRoIiwiSUQiLCJJRFJFRiIsIklEUkVGUyIsIk5JTCIsIkNvbnRleHQiLCJtb2R1bGVzIiwidHlwZU5hbWVLZXlUb1R5cGVJbmZvIiwic3Vic3RpdHV0aW9uTWVtYmVyc01hcCIsInNjb3BlZEVsZW1lbnRJbmZvc01hcCIsIm1hcHBpbmdzIiwicmVnaXN0ZXJCdWlsdGluVHlwZUluZm9zIiwicHJlZml4TmFtZXNwYWNlcyIsImNyZWF0ZU1vZHVsZSIsInByb2Nlc3NNb2R1bGVzIiwiYnVpbHRpblR5cGVJbmZvcyIsInN1YnN0aXR1dGlvbkhlYWRLZXkiLCJzY29wZUtleSIsInNjb3BlZEVsZW1lbnRJbmZvcyIsInR5cGVJbmZvQnlOYW1lIiwiZ2V0VHlwZUluZm9CeU5hbWUiLCJnZXRUeXBlSW5mb0J5VHlwZU5hbWUiLCJ0eXBlTmFtZUtleSIsInNjb3BlZEVsZW1lbnRJbmZvIiwiZ2xvYmFsU2NvcGVLZXkiLCJnbG9iYWxTY29wZWRFbGVtZW50SW5mb3MiLCJnbG9iYWxTY29wZWRFbGVtZW50SW5mbyIsImNyZWF0ZU1hcnNoYWxsZXIiLCJjcmVhdGVVbm1hcnNoYWxsZXIiLCJkZWZhdWx0UHJlZml4IiwicmVxdWlyZSIsImRlZmluZSIsInByb2Nlc3MiLCJicm93c2VyIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7O0FBRUE7Ozs7OztBQU9BLElBQUlBLGVBQWUsR0FBRyxTQUFsQkEsZUFBa0IsQ0FBU0MsY0FBVCxFQUF5QkMsc0JBQXpCLEVBQWlEQyxVQUFqRCxFQUN0QjtBQUNDO0FBQ0QsTUFBSUMsTUFBTSxHQUFHO0FBQ1pDLElBQUFBLFVBQVUsRUFBRztBQURELEdBQWI7QUFHQUQsRUFBQUEsTUFBTSxDQUFDRSxJQUFQLEdBQWMsRUFBZDs7QUFFQUYsRUFBQUEsTUFBTSxDQUFDRSxJQUFQLENBQVlDLE1BQVosR0FBcUIsVUFBU0MsV0FBVCxFQUFzQkMsTUFBdEIsRUFBOEI7QUFDbERELElBQUFBLFdBQVcsR0FBR0EsV0FBVyxJQUFJLEVBQTdCOztBQUNBLFFBQUlDLE1BQUosRUFBWTtBQUNYO0FBQ0EsV0FBTSxJQUFJQyxRQUFWLElBQXNCRCxNQUF0QixFQUE4QjtBQUM3QixZQUFJRSxLQUFLLEdBQUdGLE1BQU0sQ0FBQ0MsUUFBRCxDQUFsQjs7QUFDQSxZQUFJQyxLQUFLLEtBQUtDLFNBQWQsRUFBeUI7QUFDeEJKLFVBQUFBLFdBQVcsQ0FBQ0UsUUFBRCxDQUFYLEdBQXdCQyxLQUF4QjtBQUNB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XHJcbiAqIENvcGllZCBqc29uaXggbG9jYWxseSB0byBtYWtlIHRoaXMgZml4OiBodHRwczovL2dpdGh1Yi5jb20vYm91bmRsZXNzZ2VvL2pzb25peC9jb21taXQvMzM0MmMwMTE3NzkyNjFhODYwNDg4YjFhNjkyZmEwOTkxMGNkMjczZVxyXG4gKiBXZWJwYWNrIGRvZXMgbm90IGxpa2UgdGhlIGRlZmluZS4gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9oaWdoc291cmNlL2pzb25peC9pc3N1ZXMvMTcxXHJcbiAqIFxyXG4gKiBUT0RPOiBHZXQgcmlkIG9mIHRoaXMgZmlsZSBhbmQgaW5zdGVhZCBtYXliZSBtb25rZXkgcGF0Y2ggdGhlIGRlcGVuZGVuY3kgaW4gbm9kZV9tb2R1bGVzXHJcbiAqL1xyXG5cclxudmFyIF9qc29uaXhfZmFjdG9yeSA9IGZ1bmN0aW9uKF9qc29uaXhfeG1sZG9tLCBfanNvbml4X3htbGh0dHByZXF1ZXN0LCBfanNvbml4X2ZzKVxyXG57XHJcblx0Ly8gQ29tcGxldGUgSnNvbml4IHNjcmlwdCBpcyBpbmNsdWRlZCBiZWxvdyBcclxudmFyIEpzb25peCA9IHtcclxuXHRzaW5nbGVGaWxlIDogdHJ1ZVxyXG59O1xyXG5Kc29uaXguVXRpbCA9IHt9O1xyXG5cclxuSnNvbml4LlV0aWwuZXh0ZW5kID0gZnVuY3Rpb24oZGVzdGluYXRpb24sIHNvdXJjZSkge1xyXG5cdGRlc3RpbmF0aW9uID0gZGVzdGluYXRpb24gfHwge307XHJcblx0aWYgKHNvdXJjZSkge1xyXG5cdFx0Lypqc2xpbnQgZm9yaW46IHRydWUgKi9cclxuXHRcdGZvciAoIHZhciBwcm9wZXJ0eSBpbiBzb3VyY2UpIHtcclxuXHRcdFx0dmFyIHZhbHVlID0gc291cmNlW3Byb3BlcnR5XTtcclxuXHRcdFx0aWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRkZXN0aW5hdGlvbltwcm9wZXJ0eV0gPSB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cclxuXHRcdC8qKlxyXG5cdFx0ICogSUUgZG9lc24ndCBpbmNsdWRlIHRoZSB0b1N0cmluZyBwcm9wZXJ0eSB3aGVuIGl0ZXJhdGluZyBvdmVyIGFuXHJcblx0XHQgKiBvYmplY3QncyBwcm9wZXJ0aWVzIHdpdGggdGhlIGZvcihwcm9wZXJ0eSBpbiBvYmplY3QpIHN5bnRheC5cclxuXHRcdCAqIEV4cGxpY2l0bHkgY2hlY2sgaWYgdGhlIHNvdXJjZSBoYXMgaXRzIG93biB0b1N0cmluZyBwcm9wZXJ0eS5cclxuXHRcdCAqL1xyXG5cclxuXHRcdC8qXHJcblx0XHQgKiBGRi9XaW5kb3dzIDwgMi4wLjAuMTMgcmVwb3J0cyBcIklsbGVnYWwgb3BlcmF0aW9uIG9uIFdyYXBwZWROYXRpdmVcclxuXHRcdCAqIHByb3RvdHlwZSBvYmplY3RcIiB3aGVuIGNhbGxpbmcgaGF3T3duUHJvcGVydHkgaWYgdGhlIHNvdXJjZSBvYmplY3QgaXNcclxuXHRcdCAqIGFuIGluc3RhbmNlIG9mIHdpbmRvdy5FdmVudC5cclxuXHRcdCAqL1xyXG5cclxuXHRcdC8vIFJFV09SS1xyXG5cdFx0Ly8gTm9kZS5qc1xyXG5cdFx0Ly8gc291cmNlSXNFdnQgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgIT09IG51bGwgJiYgdHlwZW9mIHdpbmRvdy5FdmVudCA9PT0gXCJmdW5jdGlvblwiICYmIHNvdXJjZSBpbnN0YW5jZW9mIHdpbmRvdy5FdmVudDtcclxuXHJcblx0XHQvLyBpZiAoIXNvdXJjZUlzRXZ0ICYmIHNvdXJjZS5oYXNPd25Qcm9wZXJ0eSAmJiBzb3VyY2UuaGFzT3duUHJvcGVydHkoJ3RvU3RyaW5nJykpIHtcclxuXHRcdC8vIFx0ZGVzdGluYXRpb24udG9TdHJpbmcgPSBzb3VyY2UudG9TdHJpbmc7XHJcblx0XHQvLyB9XHJcblx0fVxyXG5cdHJldHVybiBkZXN0aW5hdGlvbjtcclxufTtcclxuSnNvbml4LkNsYXNzID0gZnVuY3Rpb24oKSB7XHJcblx0dmFyIENsYXNzID0gZnVuY3Rpb24oKSB7XHJcblx0XHR0aGlzLmluaXRpYWxpemUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcclxuXHR9O1xyXG5cdHZhciBleHRlbmRlZCA9IHt9O1xyXG5cdHZhciBlbXB0eSA9IGZ1bmN0aW9uKCkge1xyXG5cdH07XHJcblx0dmFyIHBhcmVudCwgaW5pdGlhbGl6ZSwgVHlwZTtcclxuXHRmb3IgKHZhciBpID0gMCwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IGxlbjsgKytpKSB7XHJcblx0XHRUeXBlID0gYXJndW1lbnRzW2ldO1xyXG5cdFx0aWYgKHR5cGVvZiBUeXBlID09IFwiZnVuY3Rpb25cIikge1xyXG5cdFx0XHQvLyBtYWtlIHRoZSBjbGFzcyBwYXNzZWQgYXMgdGhlIGZpcnN0IGFyZ3VtZW50IHRoZSBzdXBlcmNsYXNzXHJcblx0XHRcdGlmIChpID09PSAwICYmIGxlbiA+IDEpIHtcclxuXHRcdFx0XHRpbml0aWFsaXplID0gVHlwZS5wcm90b3R5cGUuaW5pdGlhbGl6ZTtcclxuXHRcdFx0XHQvLyByZXBsYWNlIHRoZSBpbml0aWFsaXplIG1ldGhvZCB3aXRoIGFuIGVtcHR5IGZ1bmN0aW9uLFxyXG5cdFx0XHRcdC8vIGJlY2F1c2Ugd2UgZG8gbm90IHdhbnQgdG8gY3JlYXRlIGEgcmVhbCBpbnN0YW5jZSBoZXJlXHJcblx0XHRcdFx0VHlwZS5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGVtcHR5O1xyXG5cdFx0XHRcdC8vIHRoZSBsaW5lIGJlbG93IG1ha2VzIHN1cmUgdGhhdCB0aGUgbmV3IGNsYXNzIGhhcyBhXHJcblx0XHRcdFx0Ly8gc3VwZXJjbGFzc1xyXG5cdFx0XHRcdGV4dGVuZGVkID0gbmV3IFR5cGUoKTtcclxuXHRcdFx0XHQvLyByZXN0b3JlIHRoZSBvcmlnaW5hbCBpbml0aWFsaXplIG1ldGhvZFxyXG5cdFx0XHRcdGlmIChpbml0aWFsaXplID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdGRlbGV0ZSBUeXBlLnByb3RvdHlwZS5pbml0aWFsaXplO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRUeXBlLnByb3RvdHlwZS5pbml0aWFsaXplID0gaW5pdGlhbGl6ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0Ly8gZ2V0IHRoZSBwcm90b3R5cGUgb2YgdGhlIHN1cGVyY2xhc3NcclxuXHRcdFx0cGFyZW50ID0gVHlwZS5wcm90b3R5cGU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQvLyBpbiB0aGlzIGNhc2Ugd2UncmUgZXh0ZW5kaW5nIHdpdGggdGhlIHByb3RvdHlwZVxyXG5cdFx0XHRwYXJlbnQgPSBUeXBlO1xyXG5cdFx0fVxyXG5cdFx0SnNvbml4LlV0aWwuZXh0ZW5kKGV4dGVuZGVkLCBwYXJlbnQpO1xyXG5cdH1cclxuXHRDbGFzcy5wcm90b3R5cGUgPSBleHRlbmRlZDtcclxuXHRyZXR1cm4gQ2xhc3M7XHJcbn07XHJcblxyXG5Kc29uaXguWE1MID0ge1xyXG5cdFx0WE1MTlNfTlMgOiAnaHR0cDovL3d3dy53My5vcmcvMjAwMC94bWxucy8nLFxyXG5cdFx0WE1MTlNfUCA6ICd4bWxucydcclxufTtcclxuXHJcblxyXG5Kc29uaXguRE9NID0ge1xyXG5cdGlzRG9tSW1wbGVtZW50YXRpb25BdmFpbGFibGUgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRpZiAodHlwZW9mIF9qc29uaXhfeG1sZG9tICE9PSAndW5kZWZpbmVkJylcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBkb2N1bWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZG9jdW1lbnQuaW1wbGVtZW50YXRpb24pICYmIEpzb25peC5VdGlsLlR5cGUuaXNGdW5jdGlvbihkb2N1bWVudC5pbXBsZW1lbnRhdGlvbi5jcmVhdGVEb2N1bWVudCkpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0fSxcclxuXHRjcmVhdGVEb2N1bWVudCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gUkVXT1JLXHJcblx0XHQvLyBOb2RlLmpzXHJcblx0XHRpZiAodHlwZW9mIF9qc29uaXhfeG1sZG9tICE9PSAndW5kZWZpbmVkJylcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIG5ldyAoX2pzb25peF94bWxkb20uRE9NSW1wbGVtZW50YXRpb24pKCkuY3JlYXRlRG9jdW1lbnQoKTtcclxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhkb2N1bWVudC5pbXBsZW1lbnRhdGlvbikgJiYgSnNvbml4LlV0aWwuVHlwZS5pc0Z1bmN0aW9uKGRvY3VtZW50LmltcGxlbWVudGF0aW9uLmNyZWF0ZURvY3VtZW50KSkge1xyXG5cdFx0XHRyZXR1cm4gZG9jdW1lbnQuaW1wbGVtZW50YXRpb24uY3JlYXRlRG9jdW1lbnQoJycsICcnLCBudWxsKTtcclxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIEFjdGl2ZVhPYmplY3QgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTVNYTUwyLkRPTURvY3VtZW50Jyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0Vycm9yIGNyZWF0ZWQgdGhlIERPTSBkb2N1bWVudC4nKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHNlcmlhbGl6ZSA6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVFeGlzdHMobm9kZSk7XHJcblx0XHQvLyBSRVdPUktcclxuXHRcdC8vIE5vZGUuanNcclxuXHRcdGlmICh0eXBlb2YgX2pzb25peF94bWxkb20gIT09ICd1bmRlZmluZWQnKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gKG5ldyAoX2pzb25peF94bWxkb20pLlhNTFNlcmlhbGl6ZXIoKSkuc2VyaWFsaXplVG9TdHJpbmcobm9kZSk7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKFhNTFNlcmlhbGl6ZXIpKSB7XHJcblx0XHRcdHJldHVybiAobmV3IFhNTFNlcmlhbGl6ZXIoKSkuc2VyaWFsaXplVG9TdHJpbmcobm9kZSk7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG5vZGUueG1sKSkge1xyXG5cdFx0XHRyZXR1cm4gbm9kZS54bWw7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBzZXJpYWxpemUgdGhlIG5vZGUsIG5laXRoZXIgWE1MU2VyaWFsaXplciBub3IgdGhlIFt4bWxdIHByb3BlcnR5IHdlcmUgZm91bmQuJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHRleHQpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVFeGlzdHModGV4dCk7XHJcblx0XHRpZiAodHlwZW9mIF9qc29uaXhfeG1sZG9tICE9PSAndW5kZWZpbmVkJylcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIChuZXcgKF9qc29uaXhfeG1sZG9tKS5ET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKHRleHQsICdhcHBsaWNhdGlvbi94bWwnKTtcclxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIERPTVBhcnNlciAhPSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRyZXR1cm4gKG5ldyBET01QYXJzZXIoKSkucGFyc2VGcm9tU3RyaW5nKHRleHQsICdhcHBsaWNhdGlvbi94bWwnKTtcclxuXHRcdH0gZWxzZSBpZiAodHlwZW9mIEFjdGl2ZVhPYmplY3QgIT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dmFyIGRvYyA9IEpzb25peC5ET00uY3JlYXRlRG9jdW1lbnQoJycsICcnKTtcclxuXHRcdFx0ZG9jLmxvYWRYTUwodGV4dCk7XHJcblx0XHRcdHJldHVybiBkb2M7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgdXJsID0gJ2RhdGE6dGV4dC94bWw7Y2hhcnNldD11dGYtOCwnICsgZW5jb2RlVVJJQ29tcG9uZW50KHRleHQpO1xyXG5cdFx0XHR2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0XHRyZXF1ZXN0Lm9wZW4oJ0dFVCcsIHVybCwgZmFsc2UpO1xyXG5cdFx0XHRpZiAocmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlKSB7XHJcblx0XHRcdFx0cmVxdWVzdC5vdmVycmlkZU1pbWVUeXBlKFwidGV4dC94bWxcIik7XHJcblx0XHRcdH1cclxuXHRcdFx0cmVxdWVzdC5zZW5kKG51bGwpO1xyXG5cdFx0XHRyZXR1cm4gcmVxdWVzdC5yZXNwb25zZVhNTDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGxvYWQgOiBmdW5jdGlvbih1cmwsIGNhbGxiYWNrLCBvcHRpb25zKSB7XHJcblxyXG5cdFx0dmFyIHJlcXVlc3QgPSBKc29uaXguUmVxdWVzdC5JTlNUQU5DRTtcclxuXHJcblx0XHRyZXF1ZXN0Lmlzc3VlKFxyXG5cdFx0XHRcdFx0XHR1cmwsXHJcblx0XHRcdFx0XHRcdGZ1bmN0aW9uKHRyYW5zcG9ydCkge1xyXG5cdFx0XHRcdFx0XHRcdHZhciByZXN1bHQ7XHJcblx0XHRcdFx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRyYW5zcG9ydC5yZXNwb25zZVhNTCkgJiYgSnNvbml4LlV0aWwuVHlwZS5leGlzdHModHJhbnNwb3J0LnJlc3BvbnNlWE1MLmRvY3VtZW50RWxlbWVudCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdCA9IHRyYW5zcG9ydC5yZXNwb25zZVhNTDtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodHJhbnNwb3J0LnJlc3BvbnNlVGV4dCkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdCA9IEpzb25peC5ET00ucGFyc2UodHJhbnNwb3J0LnJlc3BvbnNlVGV4dCk7XHJcblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignUmVzcG9uc2UgZG9lcyBub3QgaGF2ZSB2YWxpZCBbcmVzcG9uc2VYTUxdIG9yIFtyZXNwb25zZVRleHRdLicpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRjYWxsYmFjayhyZXN1bHQpO1xyXG5cclxuXHRcdFx0XHRcdFx0fSwgZnVuY3Rpb24odHJhbnNwb3J0KSB7XHJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdDb3VsZCBub3QgcmV0cmlldmUgWE1MIGZyb20gVVJMIFsnICsgdXJsXHQrICddLicpO1xyXG5cclxuXHRcdFx0XHRcdFx0fSwgb3B0aW9ucyk7XHJcblx0fSxcclxuXHR4bGlua0ZpeFJlcXVpcmVkIDogbnVsbCxcclxuXHRpc1hsaW5rRml4UmVxdWlyZWQgOiBmdW5jdGlvbiAoKVxyXG5cdHtcclxuXHRcdGlmIChKc29uaXguRE9NLnhsaW5rRml4UmVxdWlyZWQgPT09IG51bGwpXHJcblx0XHR7XHJcblx0XHRcdGlmICh0eXBlb2YgbmF2aWdhdG9yID09PSAndW5kZWZpbmVkJylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdEpzb25peC5ET00ueGxpbmtGaXhSZXF1aXJlZCA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKCEhbmF2aWdhdG9yLnVzZXJBZ2VudCAmJiAoL0Nocm9tZS8udGVzdChuYXZpZ2F0b3IudXNlckFnZW50KSAmJiAvR29vZ2xlIEluYy8udGVzdChuYXZpZ2F0b3IudmVuZG9yKSkpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgZG9jID0gSnNvbml4LkRPTS5jcmVhdGVEb2N1bWVudCgpO1xyXG5cdFx0XHRcdHZhciBlbCA9IGRvYy5jcmVhdGVFbGVtZW50KCd0ZXN0Jyk7XHJcblx0XHRcdFx0ZWwuc2V0QXR0cmlidXRlTlMoJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnLCAneGxpbms6aHJlZicsICd1cm46dGVzdCcpO1xyXG5cdFx0XHRcdGRvYy5hcHBlbmRDaGlsZChlbCk7XHJcblx0XHRcdFx0dmFyIHRlc3RTdHJpbmcgPSBKc29uaXguRE9NLnNlcmlhbGl6ZShkb2MpO1xyXG5cdFx0XHRcdEpzb25peC5ET00ueGxpbmtGaXhSZXF1aXJlZCA9ICh0ZXN0U3RyaW5nLmluZGV4T2YoJ3htbG5zOnhsaW5rJykgPT09IC0xKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHRKc29uaXguRE9NLnhsaW5rRml4UmVxdWlyZWQgPSBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIEpzb25peC5ET00ueGxpbmtGaXhSZXF1aXJlZDtcclxuXHR9XHJcbn07XHJcbkpzb25peC5SZXF1ZXN0ID0gSnNvbml4XHJcblx0XHQuQ2xhc3Moe1xyXG5cdFx0XHQvLyBSRVdPUktcclxuXHRcdFx0ZmFjdG9yaWVzIDogWyBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTXN4bWwyLlhNTEhUVFAnKTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBBY3RpdmVYT2JqZWN0KFwiTXN4bWwyLlhNTEhUVFAuNi4wXCIpO1xyXG5cdFx0XHR9LCBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IEFjdGl2ZVhPYmplY3QoXCJNc3htbDIuWE1MSFRUUC4zLjBcIik7XHJcblx0XHRcdH0sIGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdHJldHVybiBuZXcgQWN0aXZlWE9iamVjdCgnTWljcm9zb2Z0LlhNTEhUVFAnKTtcclxuXHRcdFx0fSwgZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Ly8gTm9kZS5qc1xyXG5cdFx0XHRcdGlmICh0eXBlb2YgX2pzb25peF94bWxodHRwcmVxdWVzdCAhPT0gJ3VuZGVmaW5lZCcpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dmFyIFhNTEh0dHBSZXF1ZXN0ID0gX2pzb25peF94bWxodHRwcmVxdWVzdC5YTUxIdHRwUmVxdWVzdDtcclxuXHRcdFx0XHRcdHJldHVybiBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fV0sXHJcblx0XHRcdGluaXRpYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0fSxcclxuXHRcdFx0aXNzdWUgOiBmdW5jdGlvbih1cmwsIG9uU3VjY2Vzcywgb25GYWlsdXJlLCBvcHRpb25zKSB7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh1cmwpO1xyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhvblN1Y2Nlc3MpKSB7XHJcblx0XHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRnVuY3Rpb24ob25TdWNjZXNzKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0b25TdWNjZXNzID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMob25GYWlsdXJlKSkge1xyXG5cdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUZ1bmN0aW9uKG9uRmFpbHVyZSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG9uRmFpbHVyZSA9IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG9wdGlvbnMpKSB7XHJcblx0XHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG9wdGlvbnMpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRvcHRpb25zID0ge307XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHR2YXIgdHJhbnNwb3J0ID0gdGhpcy5jcmVhdGVUcmFuc3BvcnQoKTtcclxuXHJcblx0XHRcdFx0dmFyIG1ldGhvZCA9IEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcob3B0aW9ucy5tZXRob2QpID8gb3B0aW9ucy5tZXRob2RcclxuXHRcdFx0XHRcdFx0OiAnR0VUJztcclxuXHRcdFx0XHR2YXIgYXN5bmMgPSBKc29uaXguVXRpbC5UeXBlLmlzQm9vbGVhbihvcHRpb25zLmFzeW5jKSA/IG9wdGlvbnMuYXN5bmNcclxuXHRcdFx0XHRcdFx0OiB0cnVlO1xyXG5cdFx0XHRcdHZhciBwcm94eSA9IEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcob3B0aW9ucy5wcm94eSkgPyBvcHRpb25zLnByb3h5XHJcblx0XHRcdFx0XHRcdDogSnNvbml4LlJlcXVlc3QuUFJPWFk7XHJcblxyXG5cdFx0XHRcdHZhciB1c2VyID0gSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhvcHRpb25zLnVzZXIpID8gb3B0aW9ucy51c2VyXHJcblx0XHRcdFx0XHRcdDogbnVsbDtcclxuXHRcdFx0XHR2YXIgcGFzc3dvcmQgPSBKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKG9wdGlvbnMucGFzc3dvcmQpID8gb3B0aW9ucy5wYXNzd29yZFxyXG5cdFx0XHRcdFx0XHQ6IG51bGw7XHJcblxyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHByb3h5KSAmJiAodXJsLmluZGV4T2YoXCJodHRwXCIpID09PSAwKSkge1xyXG5cdFx0XHRcdFx0dXJsID0gcHJveHkgKyBlbmNvZGVVUklDb21wb25lbnQodXJsKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHVzZXIpKSB7XHJcblx0XHRcdFx0XHR0cmFuc3BvcnQub3BlbihtZXRob2QsIHVybCwgYXN5bmMsIHVzZXIsIHBhc3N3b3JkKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dHJhbnNwb3J0Lm9wZW4obWV0aG9kLCB1cmwsIGFzeW5jKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KG9wdGlvbnMuaGVhZGVycykpIHtcclxuXHJcblx0XHRcdFx0XHRmb3IgKCB2YXIgaGVhZGVyIGluIG9wdGlvbnMuaGVhZGVycykge1xyXG5cdFx0XHRcdFx0XHRpZiAob3B0aW9ucy5oZWFkZXJzLmhhc093blByb3BlcnR5KGhlYWRlcikpIHtcclxuXHRcdFx0XHRcdFx0XHR0cmFuc3BvcnQuc2V0UmVxdWVzdEhlYWRlcihoZWFkZXIsXHJcblx0XHRcdFx0XHRcdFx0XHRcdG9wdGlvbnMuaGVhZGVyc1toZWFkZXJdKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIGRhdGEgPSBKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhvcHRpb25zLmRhdGEpID8gb3B0aW9ucy5kYXRhXHJcblx0XHRcdFx0XHRcdDogbnVsbDtcclxuXHRcdFx0XHRpZiAoIWFzeW5jKSB7XHJcblx0XHRcdFx0XHR0cmFuc3BvcnQuc2VuZChkYXRhKTtcclxuXHRcdFx0XHRcdHRoaXMuaGFuZGxlVHJhbnNwb3J0KHRyYW5zcG9ydCwgb25TdWNjZXNzLCBvbkZhaWx1cmUpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHRcdFx0XHRpZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuXHJcblx0XHRcdFx0XHRcdHRyYW5zcG9ydC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGF0LmhhbmRsZVRyYW5zcG9ydCh0cmFuc3BvcnQsIG9uU3VjY2VzcyxcclxuXHRcdFx0XHRcdFx0XHRcdFx0b25GYWlsdXJlKTtcclxuXHRcdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRcdHdpbmRvdy5zZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRcdFx0XHRcdHRyYW5zcG9ydC5zZW5kKGRhdGEpO1xyXG5cdFx0XHRcdFx0XHR9LCAwKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblxyXG5cdFx0XHRcdFx0XHR0cmFuc3BvcnQub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhhdC5oYW5kbGVUcmFuc3BvcnQodHJhbnNwb3J0LCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSk7XHJcblx0XHRcdFx0XHRcdH07XHJcblx0XHRcdFx0XHRcdHRyYW5zcG9ydC5zZW5kKGRhdGEpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gdHJhbnNwb3J0O1xyXG5cclxuXHRcdFx0fSxcclxuXHRcdFx0aGFuZGxlVHJhbnNwb3J0IDogZnVuY3Rpb24odHJhbnNwb3J0LCBvblN1Y2Nlc3MsIG9uRmFpbHVyZSkge1xyXG5cdFx0XHRcdGlmICh0cmFuc3BvcnQucmVhZHlTdGF0ZSA9PSA0KSB7XHJcblx0XHRcdFx0XHRpZiAoIXRyYW5zcG9ydC5zdGF0dXMgfHwgKHRyYW5zcG9ydC5zdGF0dXMgPj0gMjAwICYmIHRyYW5zcG9ydC5zdGF0dXMgPCAzMDApKSB7XHJcblx0XHRcdFx0XHRcdG9uU3VjY2Vzcyh0cmFuc3BvcnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKHRyYW5zcG9ydC5zdGF0dXMgJiYgKHRyYW5zcG9ydC5zdGF0dXMgPCAyMDAgfHwgdHJhbnNwb3J0LnN0YXR1cyA+PSAzMDApKSB7XHJcblx0XHRcdFx0XHRcdG9uRmFpbHVyZSh0cmFuc3BvcnQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0Y3JlYXRlVHJhbnNwb3J0IDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0Zm9yICggdmFyIGluZGV4ID0gMCwgbGVuZ3RoID0gdGhpcy5mYWN0b3JpZXMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0dHJ5IHtcclxuXHRcdFx0XHRcdFx0dmFyIHRyYW5zcG9ydCA9IHRoaXMuZmFjdG9yaWVzW2luZGV4XSgpO1xyXG5cdFx0XHRcdFx0XHRpZiAodHJhbnNwb3J0ICE9PSBudWxsKSB7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHRyYW5zcG9ydDtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBjYXRjaCAoZSkge1xyXG5cdFx0XHRcdFx0XHQvLyBUT0RPIGxvZ1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBjcmVhdGUgWE1MIEhUVFAgdHJhbnNwb3J0LicpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRDTEFTU19OQU1FIDogJ0pzb25peC5SZXF1ZXN0J1xyXG5cdFx0fSk7XHJcbkpzb25peC5SZXF1ZXN0LklOU1RBTkNFID0gbmV3IEpzb25peC5SZXF1ZXN0KCk7XHJcbkpzb25peC5SZXF1ZXN0LlBST1hZID0gbnVsbDtcclxuSnNvbml4LlNjaGVtYSA9IHt9O1xyXG5Kc29uaXguTW9kZWwgPSB7fTtcclxuSnNvbml4LlV0aWwuVHlwZSA9IHtcclxuXHRleGlzdHMgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnICYmIHZhbHVlICE9PSBudWxsKTtcclxuXHR9LFxyXG5cdGlzVW5kZWZpbmVkIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnO1xyXG5cdH0sXHJcblx0aXNTdHJpbmcgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZyc7XHJcblx0fSxcclxuXHRpc0Jvb2xlYW4gOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Jvb2xlYW4nO1xyXG5cdH0sXHJcblx0aXNPYmplY3QgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCc7XHJcblx0fSxcclxuXHRpc0Z1bmN0aW9uIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbic7XHJcblx0fSxcclxuXHRpc051bWJlciA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpICYmICFpc05hTih2YWx1ZSk7XHJcblx0fSxcclxuXHRpc051bWJlck9yTmFOIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiAodmFsdWUgPT09ICt2YWx1ZSkgfHwgKE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IE51bWJlcl0nKTtcclxuXHR9LFxyXG5cdGlzTmFOIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyT3JOYU4odmFsdWUpICYmIGlzTmFOKHZhbHVlKTtcclxuXHR9LFxyXG5cdGlzQXJyYXkgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0Ly8gcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgQXJyYXk7XHJcblx0XHRyZXR1cm4gISEodmFsdWUgJiYgdmFsdWUuY29uY2F0ICYmIHZhbHVlLnVuc2hpZnQgJiYgIXZhbHVlLmNhbGxlZSk7XHJcblx0fSxcclxuXHRpc0RhdGUgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuICEhKHZhbHVlICYmIHZhbHVlLmdldFRpbWV6b25lT2Zmc2V0ICYmIHZhbHVlLnNldFVUQ0Z1bGxZZWFyKTtcclxuXHR9LFxyXG5cdGlzUmVnRXhwIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS50ZXN0ICYmIHZhbHVlLmV4ZWMgJiYgKHZhbHVlLmlnbm9yZUNhc2UgfHwgdmFsdWUuaWdub3JlQ2FzZSA9PT0gZmFsc2UpKTtcclxuXHR9LFxyXG5cdGlzTm9kZSA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gKHR5cGVvZiBOb2RlID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBOb2RlID09PSBcImZ1bmN0aW9uXCIpID8gKHZhbHVlIGluc3RhbmNlb2YgTm9kZSkgOiAodmFsdWUgJiYgKHR5cGVvZiB2YWx1ZSA9PT0gXCJvYmplY3RcIikgJiYgKHR5cGVvZiB2YWx1ZS5ub2RlVHlwZSA9PT0gXCJudW1iZXJcIikgJiYgKHR5cGVvZiB2YWx1ZS5ub2RlTmFtZT09PVwic3RyaW5nXCIpKTtcclxuXHR9LFxyXG5cdGlzRXF1YWwgOiBmdW5jdGlvbihhLCBiLCByZXBvcnQpIHtcclxuXHRcdHZhciBkb1JlcG9ydCA9IEpzb25peC5VdGlsLlR5cGUuaXNGdW5jdGlvbihyZXBvcnQpO1xyXG5cdFx0Ly8gVE9ETyByZXdvcmtcclxuXHRcdHZhciBfcmFuZ2UgPSBmdW5jdGlvbihzdGFydCwgc3RvcCwgc3RlcCkge1xyXG5cdFx0XHR2YXIgYXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzKTtcclxuXHRcdFx0dmFyIHNvbG8gPSBhcmdzLmxlbmd0aCA8PSAxO1xyXG5cdFx0XHR2YXIgc3RhcnRfID0gc29sbyA/IDAgOiBhcmdzWzBdO1xyXG5cdFx0XHR2YXIgc3RvcF8gPSBzb2xvID8gYXJnc1swXSA6IGFyZ3NbMV07XHJcblx0XHRcdHZhciBzdGVwXyA9IGFyZ3NbMl0gfHwgMTtcclxuXHRcdFx0dmFyIGxlbiA9IE1hdGgubWF4KE1hdGguY2VpbCgoc3RvcF8gLSBzdGFydF8pIC8gc3RlcF8pLCAwKTtcclxuXHRcdFx0dmFyIGlkeCA9IDA7XHJcblx0XHRcdHZhciByYW5nZSA9IG5ldyBBcnJheShsZW4pO1xyXG5cdFx0XHR3aGlsZSAoaWR4IDwgbGVuKSB7XHJcblx0XHRcdFx0cmFuZ2VbaWR4KytdID0gc3RhcnRfO1xyXG5cdFx0XHRcdHN0YXJ0XyArPSBzdGVwXztcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcmFuZ2U7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBfa2V5cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uKG9iaikge1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc0FycmF5KG9iaikpIHtcclxuXHRcdFx0XHRyZXR1cm4gX3JhbmdlKDAsIG9iai5sZW5ndGgpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBrZXlzID0gW107XHJcblx0XHRcdGZvciAoIHZhciBrZXkgaW4gb2JqKSB7XHJcblx0XHRcdFx0aWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcblx0XHRcdFx0XHRrZXlzW2tleXMubGVuZ3RoXSA9IGtleTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGtleXM7XHJcblx0XHR9O1xyXG5cclxuXHRcdC8vIENoZWNrIG9iamVjdCBpZGVudGl0eS5cclxuXHRcdGlmIChhID09PSBiKSB7XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fVxyXG5cclxuXHRcdC8vIENoZWNrIGlmIGJvdGggYXJlIE5hTnNcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTmFOKGEpICYmIEpzb25peC5VdGlsLlR5cGUuaXNOYU4oYikpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHQvLyBEaWZmZXJlbnQgdHlwZXM/XHJcblx0XHR2YXIgYXR5cGUgPSB0eXBlb2YgYTtcclxuXHRcdHZhciBidHlwZSA9IHR5cGVvZiBiO1xyXG5cdFx0aWYgKGF0eXBlICE9IGJ0eXBlKSB7XHJcblx0XHRcdGlmIChkb1JlcG9ydCkge1xyXG5cdFx0XHRcdHJlcG9ydCgnVHlwZXMgZGlmZmVyIFsnICsgYXR5cGUgKyAnXSwgWycgKyBidHlwZSArICddLicpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdC8vIEJhc2ljIGVxdWFsaXR5IHRlc3QgKHdhdGNoIG91dCBmb3IgY29lcmNpb25zKS5cclxuXHRcdGlmIChhID09IGIpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHQvLyBPbmUgaXMgZmFsc3kgYW5kIHRoZSBvdGhlciB0cnV0aHkuXHJcblx0XHRpZiAoKCFhICYmIGIpIHx8IChhICYmICFiKSkge1xyXG5cdFx0XHRpZiAoZG9SZXBvcnQpIHtcclxuXHRcdFx0XHRyZXBvcnQoJ09uZSBpcyBmYWxzeSwgdGhlIG90aGVyIGlzIHRydXRoeS4nKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHQvLyBDaGVjayBkYXRlcycgaW50ZWdlciB2YWx1ZXMuXHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc0RhdGUoYSkgJiYgSnNvbml4LlV0aWwuVHlwZS5pc0RhdGUoYikpIHtcclxuXHRcdFx0cmV0dXJuIGEuZ2V0VGltZSgpID09PSBiLmdldFRpbWUoKTtcclxuXHRcdH1cclxuXHRcdC8vIEJvdGggYXJlIE5hTj9cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTmFOKGEpICYmIEpzb25peC5VdGlsLlR5cGUuaXNOYU4oYikpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Ly8gQ29tcGFyZSByZWd1bGFyIGV4cHJlc3Npb25zLlxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNSZWdFeHAoYSkgJiYgSnNvbml4LlV0aWwuVHlwZS5pc1JlZ0V4cChiKSkge1xyXG5cdFx0XHRyZXR1cm4gYS5zb3VyY2UgPT09IGIuc291cmNlICYmIGEuZ2xvYmFsID09PSBiLmdsb2JhbCAmJiBhLmlnbm9yZUNhc2UgPT09IGIuaWdub3JlQ2FzZSAmJiBhLm11bHRpbGluZSA9PT0gYi5tdWx0aWxpbmU7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTm9kZShhKSAmJiBKc29uaXguVXRpbC5UeXBlLmlzTm9kZShiKSlcclxuXHRcdHtcclxuXHRcdFx0dmFyIGFTZXJpYWxpemVkID0gSnNvbml4LkRPTS5zZXJpYWxpemUoYSk7XHJcblx0XHRcdHZhciBiU2VyaWFsaXplZCA9IEpzb25peC5ET00uc2VyaWFsaXplKGIpO1xyXG5cdFx0XHRpZiAoYVNlcmlhbGl6ZWQgIT09IGJTZXJpYWxpemVkKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0aWYgKGRvUmVwb3J0KVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHJlcG9ydCgnTm9kZXMgZGlmZmVyLicpO1xyXG5cdFx0XHRcdFx0cmVwb3J0KCdBPScgKyBhU2VyaWFsaXplZCk7XHJcblx0XHRcdFx0XHRyZXBvcnQoJ0I9JyArIGJTZXJpYWxpemVkKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIElmIGEgaXMgbm90IGFuIG9iamVjdCBieSB0aGlzIHBvaW50LCB3ZSBjYW4ndCBoYW5kbGUgaXQuXHJcblx0XHRpZiAoYXR5cGUgIT09ICdvYmplY3QnKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdC8vIENoZWNrIGZvciBkaWZmZXJlbnQgYXJyYXkgbGVuZ3RocyBiZWZvcmUgY29tcGFyaW5nIGNvbnRlbnRzLlxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNBcnJheShhKSAmJiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSkge1xyXG5cdFx0XHRpZiAoZG9SZXBvcnQpIHtcclxuXHRcdFx0XHRcdHJlcG9ydCgnTGVuZ3RocyBkaWZmZXIuJyk7XHJcblx0XHRcdFx0XHRyZXBvcnQoJ0EubGVuZ3RoPScgKyBhLmxlbmd0aCk7XHJcblx0XHRcdFx0XHRyZXBvcnQoJ0IubGVuZ3RoPScgKyBiLmxlbmd0aCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Ly8gTm90aGluZyBlbHNlIHdvcmtlZCwgZGVlcCBjb21wYXJlIHRoZSBjb250ZW50cy5cclxuXHRcdHZhciBhS2V5cyA9IF9rZXlzKGEpO1xyXG5cdFx0dmFyIGJLZXlzID0gX2tleXMoYik7XHJcblx0XHQvLyBEaWZmZXJlbnQgb2JqZWN0IHNpemVzP1xyXG5cdFx0aWYgKGFLZXlzLmxlbmd0aCAhPT0gYktleXMubGVuZ3RoKSB7XHJcblx0XHRcdGlmIChkb1JlcG9ydCkge1xyXG5cdFx0XHRcdHJlcG9ydCgnRGlmZmVyZW50IG51bWJlciBvZiBwcm9wZXJ0aWVzIFsnICsgYUtleXMubGVuZ3RoICsgJ10sIFsnICsgYktleXMubGVuZ3RoICsgJ10uJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0Zm9yICggdmFyIGFuZGV4ID0gMDsgYW5kZXggPCBhS2V5cy5sZW5ndGg7IGFuZGV4KyspIHtcclxuXHRcdFx0XHRpZiAoZG9SZXBvcnQpIHtcclxuXHRcdFx0XHRcdHJlcG9ydCgnQSBbJyArIGFLZXlzW2FuZGV4XSArICddPScgKyBhW2FLZXlzW2FuZGV4XV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRmb3IgKCB2YXIgYm5kZXggPSAwOyBibmRleCA8IGJLZXlzLmxlbmd0aDsgYm5kZXgrKykge1xyXG5cdFx0XHRcdGlmIChkb1JlcG9ydCkge1xyXG5cdFx0XHRcdFx0cmVwb3J0KCdCIFsnICsgYktleXNbYm5kZXhdICsgJ109JyArIGJbYktleXNbYm5kZXhdXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdC8vIFJlY3Vyc2l2ZSBjb21wYXJpc29uIG9mIGNvbnRlbnRzLlxyXG5cdFx0Zm9yICh2YXIga25kZXggPSAwOyBrbmRleCA8IGFLZXlzLmxlbmd0aDsga25kZXgrKykge1xyXG5cdFx0XHR2YXIga2V5ID0gYUtleXNba25kZXhdO1xyXG5cdFx0XHRpZiAoIShrZXkgaW4gYikgfHwgIUpzb25peC5VdGlsLlR5cGUuaXNFcXVhbChhW2tleV0sIGJba2V5XSwgcmVwb3J0KSkge1xyXG5cdFx0XHRcdGlmIChkb1JlcG9ydCkge1xyXG5cdFx0XHRcdFx0cmVwb3J0KCdPbmUgb2YgdGhlIHByb3BlcnRpZXMgZGlmZmVyLicpO1xyXG5cdFx0XHRcdFx0cmVwb3J0KCdLZXk6IFsnICsga2V5ICsgJ10uJyk7XHJcblx0XHRcdFx0XHRyZXBvcnQoJ0xlZnQ6IFsnICsgYVtrZXldICsgJ10uJyk7XHJcblx0XHRcdFx0XHRyZXBvcnQoJ1JpZ2h0OiBbJyArIGJba2V5XSArICddLicpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH0sXHJcblx0Y2xvbmVPYmplY3QgOiBmdW5jdGlvbiAoc291cmNlLCB0YXJnZXQpXHJcblx0e1xyXG5cdFx0dGFyZ2V0ID0gdGFyZ2V0IHx8IHt9O1xyXG5cdFx0Zm9yICh2YXIgcCBpbiBzb3VyY2UpXHJcblx0XHR7XHJcblx0XHRcdGlmIChzb3VyY2UuaGFzT3duUHJvcGVydHkocCkpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0YXJnZXRbcF0gPSBzb3VyY2VbcF07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB0YXJnZXQ7XHJcblx0fSxcclxuXHRkZWZhdWx0VmFsdWUgOiBmdW5jdGlvbigpXHJcblx0e1xyXG5cdFx0dmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcblx0XHRpZiAoYXJncy5sZW5ndGggPT09IDApXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHZhciBkZWZhdWx0VmFsdWUgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV07XHJcblx0XHRcdHZhciB0eXBlT2ZEZWZhdWx0VmFsdWUgPSB0eXBlb2YgZGVmYXVsdFZhbHVlO1xyXG5cdFx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXJncy5sZW5ndGggLSAxOyBpbmRleCsrKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dmFyIGNhbmRpZGF0ZVZhbHVlID0gYXJnc1tpbmRleF07XHJcblx0XHRcdFx0aWYgKHR5cGVvZiBjYW5kaWRhdGVWYWx1ZSA9PT0gdHlwZU9mRGVmYXVsdFZhbHVlKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHJldHVybiBjYW5kaWRhdGVWYWx1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIGRlZmF1bHRWYWx1ZTtcclxuXHRcdFx0XHJcblx0XHR9XHJcblx0fVxyXG59O1xyXG5Kc29uaXguVXRpbC5OdW1iZXJVdGlscyA9IHtcclxuXHRpc0ludGVnZXIgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIodmFsdWUpICYmICgodmFsdWUgJSAxKSA9PT0gMCk7XHJcblx0fVxyXG59O1xyXG5Kc29uaXguVXRpbC5TdHJpbmdVdGlscyA9IHtcclxuXHR0cmltIDogKCEhU3RyaW5nLnByb3RvdHlwZS50cmltKSA/XHJcblx0ZnVuY3Rpb24oc3RyKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHN0cik7XHJcblx0XHRyZXR1cm4gc3RyLnRyaW0oKTtcclxuXHR9IDpcclxuXHRmdW5jdGlvbihzdHIpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcoc3RyKTtcclxuXHRcdHJldHVybiBzdHIucmVwbGFjZSgvXlxcc1xccyovLCAnJykucmVwbGFjZSgvXFxzXFxzKiQvLCAnJyk7XHJcblx0fSxcclxuXHQvKiBpc0VtcHR5IDogZnVuY3Rpb24oc3RyKSB7XHJcblx0XHR2YXIgd2NtID0gSnNvbml4LlV0aWwuU3RyaW5nVXRpbHMud2hpdGVzcGFjZUNoYXJhY3RlcnNNYXA7XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgc3RyLmxlbmd0aDsgaW5kZXgrKylcclxuXHRcdHtcclxuXHRcdFx0aWYgKCF3Y21bc3RyW2luZGV4XV0pXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH0sICovXHJcblx0aXNFbXB0eSA6IGZ1bmN0aW9uKHN0cikge1xyXG5cdFx0dmFyIGxlbmd0aCA9IHN0ci5sZW5ndGg7XHJcblx0XHRpZiAoIWxlbmd0aCkge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspXHJcblx0XHR7XHJcblx0XHRcdHZhciBjID0gc3RyW2luZGV4XTtcclxuXHRcdFx0aWYgKGMgPT09ICcgJylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vIHNraXBcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChjID4gJ1xcdTAwMEQnICYmIGMgPCAnXFx1MDA4NScpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoYyA8ICdcXHUwMEEwJylcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGlmIChjIDwgJ1xcdTAwMDknKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSBpZiAoYyA+ICdcXHUwMDg1JylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKGMgPiAnXFx1MDBBMCcpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoYyA8ICdcXHUyMDI4JylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZiAoYyA8ICdcXHUxODBFJylcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0aWYgKGMgPCAnXFx1MTY4MCcpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZSBpZihjID4gJ1xcdTE2ODAnKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlIGlmIChjID4gJ1xcdTE4MEUnKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRpZiAoYyA8ICdcXHUyMDAwJylcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbHNlIGlmIChjID4gJ1xcdTIwMEEnKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKGMgPiAnXFx1MjAyOScpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0aWYgKGMgPCAnXFx1MjA1RicpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGlmIChjIDwgJ1xcdTIwMkYnKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGMgPiAnXFx1MjAyRicpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKGMgPiAnXFx1MjA1RicpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGlmIChjIDwgJ1xcdTMwMDAnKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2UgaWYgKGMgPiAnXFx1MzAwMCcpXHJcblx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH0sXHJcblx0aXNOb3RCbGFuayA6IGZ1bmN0aW9uKHN0cikge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcoc3RyKSAmJiAhSnNvbml4LlV0aWwuU3RyaW5nVXRpbHMuaXNFbXB0eShzdHIpO1xyXG5cdH0sXHJcblx0d2hpdGVzcGFjZUNoYXJhY3RlcnM6ICdcXHUwMDA5XFx1MDAwQVxcdTAwMEJcXHUwMDBDXFx1MDAwRCBcXHUwMDg1XFx1MDBBMFxcdTE2ODBcXHUxODBFXFx1MjAwMFxcdTIwMDFcXHUyMDAyXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDI4XFx1MjAyOVxcdTIwMkZcXHUyMDVGXFx1MzAwMCcsXHJcblx0d2hpdGVzcGFjZUNoYXJhY3RlcnNNYXA6IHtcclxuXHRcdCdcXHUwMDA5JyA6IHRydWUsXHJcblx0XHQnXFx1MDAwQScgOiB0cnVlLFxyXG5cdFx0J1xcdTAwMEInIDogdHJ1ZSxcclxuXHRcdCdcXHUwMDBDJyA6IHRydWUsXHJcblx0XHQnXFx1MDAwRCcgOiB0cnVlLFxyXG5cdFx0JyAnIDogdHJ1ZSxcclxuXHRcdCdcXHUwMDg1JyA6IHRydWUsXHJcblx0XHQnXFx1MDBBMCcgOiB0cnVlLFxyXG5cdFx0J1xcdTE2ODAnIDogdHJ1ZSxcclxuXHRcdCdcXHUxODBFJyA6IHRydWUsXHJcblx0XHQnXFx1MjAwMCcgOiB0cnVlLFxyXG5cdFx0J1xcdTIwMDEnIDogdHJ1ZSxcclxuXHRcdCdcXHUyMDAyJyA6IHRydWUsXHJcblx0XHQnXFx1MjAwMycgOiB0cnVlLFxyXG5cdFx0J1xcdTIwMDQnIDogdHJ1ZSxcclxuXHRcdCdcXHUyMDA1JyA6IHRydWUsXHJcblx0XHQnXFx1MjAwNicgOiB0cnVlLFxyXG5cdFx0J1xcdTIwMDcnIDogdHJ1ZSxcclxuXHRcdCdcXHUyMDA4JyA6IHRydWUsXHJcblx0XHQnXFx1MjAwOScgOiB0cnVlLFxyXG5cdFx0J1xcdTIwMEEnIDogdHJ1ZSxcclxuXHRcdCdcXHUyMDI4JyA6IHRydWUsXHJcblx0XHQnXFx1MjAyOScgOiB0cnVlLFxyXG5cdFx0J1xcdTIwMkYnIDogdHJ1ZSxcclxuXHRcdCdcXHUyMDVGJyA6IHRydWUsXHJcblx0XHQnXFx1MzAwMCcgOiB0cnVlXHJcblx0fSxcclxuXHRzcGxpdEJ5U2VwYXJhdG9yQ2hhcnMgOiBmdW5jdGlvbihzdHIsIHNlcGFyYXRvckNoYXJzKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHN0cik7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHNlcGFyYXRvckNoYXJzKTtcclxuXHRcdHZhciBsZW4gPSBzdHIubGVuZ3RoO1xyXG5cdFx0aWYgKGxlbiA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gW107XHJcblx0XHR9XHJcblx0XHRpZiAoc2VwYXJhdG9yQ2hhcnMubGVuZ3RoID09PSAxKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gc3RyLnNwbGl0KHNlcGFyYXRvckNoYXJzKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0dmFyIGxpc3QgPSBbXTtcclxuXHRcdFx0dmFyIHNpemVQbHVzMSA9IDE7XHJcblx0XHRcdHZhciBpID0gMDtcclxuXHRcdFx0dmFyIHN0YXJ0ID0gMDtcclxuXHRcdFx0dmFyIG1hdGNoID0gZmFsc2U7XHJcblx0XHRcdHZhciBsYXN0TWF0Y2ggPSBmYWxzZTtcclxuXHRcdFx0dmFyIG1heCA9IC0xO1xyXG5cdFx0XHR2YXIgcHJlc2VydmVBbGxUb2tlbnMgPSBmYWxzZTtcclxuXHRcdFx0Ly8gc3RhbmRhcmQgY2FzZVxyXG5cdFx0XHRcdHdoaWxlIChpIDwgbGVuKSB7XHJcblx0XHRcdFx0XHRcdGlmIChzZXBhcmF0b3JDaGFycy5pbmRleE9mKHN0ci5jaGFyQXQoaSkpID49IDApIHtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChtYXRjaCB8fCBwcmVzZXJ2ZUFsbFRva2Vucykge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxhc3RNYXRjaCA9IHRydWU7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHNpemVQbHVzMSsrID09IG1heCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRpID0gbGVuO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRsYXN0TWF0Y2ggPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bGlzdC5wdXNoKHN0ci5zdWJzdHJpbmcoc3RhcnQsIGkpKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRtYXRjaCA9IGZhbHNlO1xyXG5cdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0c3RhcnQgPSArK2k7XHJcblx0XHRcdFx0XHRcdFx0XHRjb250aW51ZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRsYXN0TWF0Y2ggPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0bWF0Y2ggPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHRpKys7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGlmIChtYXRjaCB8fCAocHJlc2VydmVBbGxUb2tlbnMgJiYgbGFzdE1hdGNoKSkge1xyXG5cdFx0XHRcdFx0bGlzdC5wdXNoKHN0ci5zdWJzdHJpbmcoc3RhcnQsIGkpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gbGlzdDtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbkpzb25peC5VdGlsLkVuc3VyZSA9IHtcclxuXHRlbnN1cmVCb29sZWFuIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5pc0Jvb2xlYW4odmFsdWUpKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgWycgKyB2YWx1ZSArICddIG11c3QgYmUgYSBib29sZWFuLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZW5zdXJlU3RyaW5nIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh2YWx1ZSkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBbJyArIHZhbHVlICsgJ10gbXVzdCBiZSBhIHN0cmluZy4nKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGVuc3VyZU51bWJlciA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIodmFsdWUpKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgWycgKyB2YWx1ZSArICddIG11c3QgYmUgYSBudW1iZXIuJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRlbnN1cmVOdW1iZXJPck5hTiA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXJPck5hTih2YWx1ZSkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBbJyArIHZhbHVlICsgJ10gbXVzdCBiZSBhIG51bWJlciBvciBOYU4uJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRlbnN1cmVJbnRlZ2VyIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5pc051bWJlcih2YWx1ZSkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBbJyArIHZhbHVlICsgJ10gbXVzdCBiZSBhbiBpbnRlZ2VyLCBidXQgaXQgaXMgbm90IGEgbnVtYmVyLicpO1xyXG5cdFx0fSBlbHNlIGlmICghSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IFsnICsgdmFsdWUgKyAnXSBtdXN0IGJlIGFuIGludGVnZXIuJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRlbnN1cmVEYXRlIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdGlmICghKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdBcmd1bWVudCBbJyArIHZhbHVlICsgJ10gbXVzdCBiZSBhIGRhdGUuJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRlbnN1cmVPYmplY3QgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHZhbHVlKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IFsnICsgdmFsdWUgKyAnXSBtdXN0IGJlIGFuIG9iamVjdC4nKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGVuc3VyZUFycmF5IDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5pc0FycmF5KHZhbHVlKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IFsnICsgdmFsdWUgKyAnXSBtdXN0IGJlIGFuIGFycmF5LicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0ZW5zdXJlRnVuY3Rpb24gOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmlzRnVuY3Rpb24odmFsdWUpKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignQXJndW1lbnQgWycgKyB2YWx1ZSArICddIG11c3QgYmUgYSBmdW5jdGlvbi4nKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGVuc3VyZUV4aXN0cyA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0FyZ3VtZW50IFsnICsgdmFsdWUgKyAnXSBkb2VzIG5vdCBleGlzdC4nKTtcclxuXHRcdH1cclxuXHR9XHJcbn07XHJcbkpzb25peC5YTUwuUU5hbWUgPSBKc29uaXguQ2xhc3Moe1xyXG5cdGtleSA6IG51bGwsXHJcblx0bmFtZXNwYWNlVVJJIDogbnVsbCxcclxuXHRsb2NhbFBhcnQgOiBudWxsLFxyXG5cdHByZWZpeCA6IG51bGwsXHJcblx0c3RyaW5nIDogbnVsbCxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24ob25lLCB0d28sIHRocmVlKSB7XHJcblx0XHR2YXIgbmFtZXNwYWNlVVJJO1xyXG5cdFx0dmFyIGxvY2FsUGFydDtcclxuXHRcdHZhciBwcmVmaXg7XHJcblx0XHR2YXIga2V5O1xyXG5cdFx0dmFyIHN0cmluZztcclxuXHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHR3bykpIHtcclxuXHRcdFx0bmFtZXNwYWNlVVJJID0gJyc7XHJcblx0XHRcdGxvY2FsUGFydCA9IG9uZTtcclxuXHRcdFx0cHJlZml4ID0gJyc7XHJcblx0XHR9IGVsc2UgaWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aHJlZSkpIHtcclxuXHRcdFx0bmFtZXNwYWNlVVJJID0gSnNvbml4LlV0aWwuVHlwZS5leGlzdHMob25lKSA/IG9uZSA6ICcnO1xyXG5cdFx0XHRsb2NhbFBhcnQgPSB0d287XHJcblx0XHRcdHZhciBjb2xvblBvc2l0aW9uID0gdHdvLmluZGV4T2YoJzonKTtcclxuXHRcdFx0aWYgKGNvbG9uUG9zaXRpb24gPiAwICYmIGNvbG9uUG9zaXRpb24gPCB0d28ubGVuZ3RoKSB7XHJcblx0XHRcdFx0cHJlZml4ID0gdHdvLnN1YnN0cmluZygwLCBjb2xvblBvc2l0aW9uKTtcclxuXHRcdFx0XHRsb2NhbFBhcnQgPSB0d28uc3Vic3RyaW5nKGNvbG9uUG9zaXRpb24gKyAxKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRwcmVmaXggPSAnJztcclxuXHRcdFx0XHRsb2NhbFBhcnQgPSB0d287XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdG5hbWVzcGFjZVVSSSA9IEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG9uZSkgPyBvbmUgOiAnJztcclxuXHRcdFx0bG9jYWxQYXJ0ID0gdHdvO1xyXG5cdFx0XHRwcmVmaXggPSBKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aHJlZSkgPyB0aHJlZSA6ICcnO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5uYW1lc3BhY2VVUkkgPSBuYW1lc3BhY2VVUkk7XHJcblx0XHR0aGlzLmxvY2FsUGFydCA9IGxvY2FsUGFydDtcclxuXHRcdHRoaXMucHJlZml4ID0gcHJlZml4O1xyXG5cclxuXHRcdHRoaXMua2V5ID0gKG5hbWVzcGFjZVVSSSAhPT0gJycgPyAoJ3snICsgbmFtZXNwYWNlVVJJICsgJ30nKSA6ICcnKSArIGxvY2FsUGFydDtcclxuXHRcdHRoaXMuc3RyaW5nID0gKG5hbWVzcGFjZVVSSSAhPT0gJycgPyAoJ3snICsgbmFtZXNwYWNlVVJJICsgJ30nKSA6ICcnKSArIChwcmVmaXggIT09ICcnID8gKHByZWZpeCArICc6JykgOiAnJykgKyBsb2NhbFBhcnQ7XHJcblx0fSxcclxuXHR0b1N0cmluZyA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMuc3RyaW5nO1xyXG5cdH0sXHJcblx0Ly8gZm9vOmJhclxyXG5cdHRvQ2Fub25pY2FsU3RyaW5nOiBmdW5jdGlvbihuYW1lc3BhY2VDb250ZXh0KSB7XHJcblx0XHR2YXIgY2Fub25pY2FsUHJlZml4ID0gbmFtZXNwYWNlQ29udGV4dCA/IG5hbWVzcGFjZUNvbnRleHQuZ2V0UHJlZml4KHRoaXMubmFtZXNwYWNlVVJJLCB0aGlzLnByZWZpeCkgOiB0aGlzLnByZWZpeDtcclxuXHRcdHJldHVybiB0aGlzLnByZWZpeCArICh0aGlzLnByZWZpeCA9PT0gJycgPyAnJyA6ICc6JykgKyB0aGlzLmxvY2FsUGFydDtcclxuXHR9LFxyXG5cdGNsb25lIDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy5uYW1lc3BhY2VVUkksIHRoaXMubG9jYWxQYXJ0LCB0aGlzLnByZWZpeCk7XHJcblx0fSxcclxuXHRlcXVhbHMgOiBmdW5jdGlvbih0aGF0KSB7XHJcblx0XHRpZiAoIXRoYXQpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuICh0aGlzLm5hbWVzcGFjZVVSSSA9PSB0aGF0Lm5hbWVzcGFjZVVSSSkgJiYgKHRoaXMubG9jYWxQYXJ0ID09IHRoYXQubG9jYWxQYXJ0KTtcclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogXCJKc29uaXguWE1MLlFOYW1lXCJcclxufSk7XHJcbkpzb25peC5YTUwuUU5hbWUuZnJvbVN0cmluZyA9IGZ1bmN0aW9uKHFOYW1lQXNTdHJpbmcsIG5hbWVzcGFjZUNvbnRleHQsIGRlZmF1bHROYW1lc3BhY2VVUkkpIHtcclxuXHR2YXIgbGVmdEJyYWNrZXQgPSBxTmFtZUFzU3RyaW5nLmluZGV4T2YoJ3snKTtcclxuXHR2YXIgcmlnaHRCcmFja2V0ID0gcU5hbWVBc1N0cmluZy5sYXN0SW5kZXhPZignfScpO1xyXG5cdHZhciBuYW1lc3BhY2VVUkk7XHJcblx0dmFyIHByZWZpeGVkTmFtZTtcclxuXHRpZiAoKGxlZnRCcmFja2V0ID09PSAwKSAmJiAocmlnaHRCcmFja2V0ID4gMCkgJiYgKHJpZ2h0QnJhY2tldCA8IHFOYW1lQXNTdHJpbmcubGVuZ3RoKSkge1xyXG5cdFx0bmFtZXNwYWNlVVJJID0gcU5hbWVBc1N0cmluZy5zdWJzdHJpbmcoMSwgcmlnaHRCcmFja2V0KTtcclxuXHRcdHByZWZpeGVkTmFtZSA9IHFOYW1lQXNTdHJpbmcuc3Vic3RyaW5nKHJpZ2h0QnJhY2tldCArIDEpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRuYW1lc3BhY2VVUkkgPSBudWxsO1xyXG5cdFx0cHJlZml4ZWROYW1lID0gcU5hbWVBc1N0cmluZztcclxuXHR9XHJcblx0dmFyIGNvbG9uUG9zaXRpb24gPSBwcmVmaXhlZE5hbWUuaW5kZXhPZignOicpO1xyXG5cdHZhciBwcmVmaXg7XHJcblx0dmFyIGxvY2FsUGFydDtcclxuXHRpZiAoY29sb25Qb3NpdGlvbiA+IDAgJiYgY29sb25Qb3NpdGlvbiA8IHByZWZpeGVkTmFtZS5sZW5ndGgpIHtcclxuXHRcdHByZWZpeCA9IHByZWZpeGVkTmFtZS5zdWJzdHJpbmcoMCwgY29sb25Qb3NpdGlvbik7XHJcblx0XHRsb2NhbFBhcnQgPSBwcmVmaXhlZE5hbWUuc3Vic3RyaW5nKGNvbG9uUG9zaXRpb24gKyAxKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cHJlZml4ID0gJyc7XHJcblx0XHRsb2NhbFBhcnQgPSBwcmVmaXhlZE5hbWU7XHJcblx0fVxyXG5cdC8vIElmIG5hbWVzcGFjZSBVUkkgd2FzIG5vdCBzZXQgYW5kIHdlIGhhdmUgYSBuYW1lc3BhY2UgY29udGV4dCwgdHJ5IHRvIGZpbmQgdGhlIG5hbWVzcGFjZSBVUkkgdmlhIHRoaXMgY29udGV4dFxyXG5cdGlmIChuYW1lc3BhY2VVUkkgPT09IG51bGwpXHJcblx0e1xyXG5cdFx0aWYgKHByZWZpeCA9PT0gJycgJiYgSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhkZWZhdWx0TmFtZXNwYWNlVVJJKSlcclxuXHRcdHtcclxuXHRcdFx0bmFtZXNwYWNlVVJJID0gZGVmYXVsdE5hbWVzcGFjZVVSSTtcclxuXHRcdH1cclxuXHRcdGVsc2UgaWYgKG5hbWVzcGFjZUNvbnRleHQpXHJcblx0XHR7XHJcblx0XHRcdG5hbWVzcGFjZVVSSSA9IG5hbWVzcGFjZUNvbnRleHQuZ2V0TmFtZXNwYWNlVVJJKHByZWZpeCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdC8vIElmIHdlIGRvbid0IGhhdmUgYSBuYW1lc3BhY2UgVVJJLCBhc3N1bWUgJycgYnkgZGVmYXVsdFxyXG5cdC8vIFRPRE8gZG9jdW1lbnQgdGhlIGFzc3VtcHRpb25cclxuXHRpZiAoIUpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcobmFtZXNwYWNlVVJJKSlcclxuXHR7XHJcblx0XHRuYW1lc3BhY2VVUkkgPSBkZWZhdWx0TmFtZXNwYWNlVVJJIHx8ICcnO1xyXG5cdH1cclxuXHRyZXR1cm4gbmV3IEpzb25peC5YTUwuUU5hbWUobmFtZXNwYWNlVVJJLCBsb2NhbFBhcnQsIHByZWZpeCk7XHJcbn07XHJcbkpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdCA9IGZ1bmN0aW9uKG9iamVjdCkge1xyXG5cdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3Qob2JqZWN0KTtcclxuXHRpZiAob2JqZWN0IGluc3RhbmNlb2YgSnNvbml4LlhNTC5RTmFtZSB8fCAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhvYmplY3QuQ0xBU1NfTkFNRSkgJiYgb2JqZWN0LkNMQVNTX05BTUUgPT09ICdKc29uaXguWE1MLlFOYW1lJykpIHtcclxuXHRcdHJldHVybiBvYmplY3Q7XHJcblx0fVxyXG5cdHZhciBsb2NhbFBhcnQgPSBvYmplY3QubG9jYWxQYXJ0fHxvYmplY3QubHB8fG51bGw7XHJcblx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhsb2NhbFBhcnQpO1xyXG5cdHZhciBuYW1lc3BhY2VVUkkgPSBvYmplY3QubmFtZXNwYWNlVVJJfHxvYmplY3QubnN8fCcnO1xyXG5cdHZhciBwcmVmaXggPSBvYmplY3QucHJlZml4fHxvYmplY3QucHx8Jyc7XHJcblx0cmV0dXJuIG5ldyBKc29uaXguWE1MLlFOYW1lKG5hbWVzcGFjZVVSSSwgbG9jYWxQYXJ0LCBwcmVmaXgpO1xyXG59O1xyXG5Kc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3RPclN0cmluZyA9IGZ1bmN0aW9uKHZhbHVlLCBuYW1lc3BhY2VDb250ZXh0LCBkZWZhdWx0TmFtZXNwYWNlVVJJKSB7XHJcblx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodmFsdWUpKVxyXG5cdHtcclxuXHRcdHJldHVybiBKc29uaXguWE1MLlFOYW1lLmZyb21TdHJpbmcodmFsdWUsIG5hbWVzcGFjZUNvbnRleHQsIGRlZmF1bHROYW1lc3BhY2VVUkkpO1xyXG5cdH1cclxuXHRlbHNlXHJcblx0e1xyXG5cdFx0cmV0dXJuIEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdCh2YWx1ZSk7XHJcblx0fVxyXG59O1xyXG5Kc29uaXguWE1MLlFOYW1lLmtleSA9IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxQYXJ0KSB7XHJcblx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhsb2NhbFBhcnQpO1xyXG5cdGlmIChuYW1lc3BhY2VVUkkpIHtcclxuXHRcdHZhciBjb2xvblBvc2l0aW9uID0gbG9jYWxQYXJ0LmluZGV4T2YoJzonKTtcclxuXHRcdHZhciBsb2NhbE5hbWU7XHJcblx0XHRpZiAoY29sb25Qb3NpdGlvbiA+IDAgJiYgY29sb25Qb3NpdGlvbiA8IGxvY2FsUGFydC5sZW5ndGgpIHtcclxuXHRcdFx0bG9jYWxOYW1lID0gbG9jYWxQYXJ0LnN1YnN0cmluZyhjb2xvblBvc2l0aW9uICsgMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRsb2NhbE5hbWUgPSBsb2NhbFBhcnQ7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gJ3snICsgbmFtZXNwYWNlVVJJICsgJ30nICsgbG9jYWxOYW1lO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRyZXR1cm4gbG9jYWxQYXJ0O1xyXG5cdH1cclxufTtcclxuSnNvbml4LlhNTC5DYWxlbmRhciA9IEpzb25peC5DbGFzcyh7XHJcblx0eWVhciA6IE5hTixcclxuXHRtb250aCA6IE5hTixcclxuXHRkYXkgOiBOYU4sXHJcblx0aG91ciA6IE5hTixcclxuXHRtaW51dGUgOiBOYU4sXHJcblx0c2Vjb25kIDogTmFOLFxyXG5cdGZyYWN0aW9uYWxTZWNvbmQgOiBOYU4sXHJcblx0dGltZXpvbmUgOiBOYU4sXHJcblx0ZGF0ZSA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QoZGF0YSk7XHJcblx0XHQvLyBZZWFyXHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZGF0YS55ZWFyKSkge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcihkYXRhLnllYXIpO1xyXG5cdFx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlWWVhcihkYXRhLnllYXIpO1xyXG5cdFx0XHR0aGlzLnllYXIgPSBkYXRhLnllYXI7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnllYXIgPSBOYU47XHJcblx0XHR9XHJcblx0XHQvLyBNb250aFxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGRhdGEubW9udGgpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKGRhdGEubW9udGgpO1xyXG5cdFx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlTW9udGgoZGF0YS5tb250aCk7XHJcblx0XHRcdHRoaXMubW9udGggPSBkYXRhLm1vbnRoO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5tb250aCA9IE5hTjtcclxuXHRcdH1cclxuXHRcdC8vIERheVxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGRhdGEuZGF5KSkge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcihkYXRhLmRheSk7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIoZGF0YS55ZWFyKSAmJiBKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIoZGF0YS5tb250aCkpIHtcclxuXHRcdFx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlWWVhck1vbnRoRGF5KGRhdGEueWVhciwgZGF0YS5tb250aCwgZGF0YS5kYXkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcihkYXRhLm1vbnRoKSkge1xyXG5cdFx0XHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVNb250aERheShkYXRhLm1vbnRoLCBkYXRhLmRheSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZURheShkYXRhLmRheSk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5kYXkgPSBkYXRhLmRheTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZGF5ID0gTmFOO1xyXG5cdFx0fVxyXG5cdFx0Ly8gSG91clxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGRhdGEuaG91cikpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIoZGF0YS5ob3VyKTtcclxuXHRcdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZUhvdXIoZGF0YS5ob3VyKTtcclxuXHRcdFx0dGhpcy5ob3VyID0gZGF0YS5ob3VyO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5ob3VyID0gTmFOO1xyXG5cdFx0fVxyXG5cdFx0Ly8gTWludXRlXHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZGF0YS5taW51dGUpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKGRhdGEubWludXRlKTtcclxuXHRcdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZU1pbnV0ZShkYXRhLm1pbnV0ZSk7XHJcblx0XHRcdHRoaXMubWludXRlID0gZGF0YS5taW51dGU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLm1pbnV0ZSA9IE5hTjtcclxuXHRcdH1cclxuXHRcdC8vIFNlY29uZFxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGRhdGEuc2Vjb25kKSkge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcihkYXRhLnNlY29uZCk7XHJcblx0XHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVTZWNvbmQoZGF0YS5zZWNvbmQpO1xyXG5cdFx0XHR0aGlzLnNlY29uZCA9IGRhdGEuc2Vjb25kO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy5zZWNvbmQgPSBOYU47XHJcblx0XHR9XHJcblx0XHQvLyBGcmFjdGlvbmFsIHNlY29uZFxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGRhdGEuZnJhY3Rpb25hbFNlY29uZCkpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcihkYXRhLmZyYWN0aW9uYWxTZWNvbmQpO1xyXG5cdFx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlRnJhY3Rpb25hbFNlY29uZChkYXRhLmZyYWN0aW9uYWxTZWNvbmQpO1xyXG5cdFx0XHR0aGlzLmZyYWN0aW9uYWxTZWNvbmQgPSBkYXRhLmZyYWN0aW9uYWxTZWNvbmQ7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmZyYWN0aW9uYWxTZWNvbmQgPSBOYU47XHJcblx0XHR9XHJcblx0XHQvLyBUaW1lem9uZVxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGRhdGEudGltZXpvbmUpKSB7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTmFOKGRhdGEudGltZXpvbmUpKSB7XHJcblx0XHRcdFx0dGhpcy50aW1lem9uZSA9IE5hTjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcihkYXRhLnRpbWV6b25lKTtcclxuXHRcdFx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlVGltZXpvbmUoZGF0YS50aW1lem9uZSk7XHJcblx0XHRcdFx0dGhpcy50aW1lem9uZSA9IGRhdGEudGltZXpvbmU7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMudGltZXpvbmUgPSBOYU47XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGluaXRpYWxEYXRlID0gbmV3IERhdGUoMCk7XHJcblx0XHRpbml0aWFsRGF0ZS5zZXRVVENGdWxsWWVhcih0aGlzLnllYXIgfHwgMTk3MCk7XHJcblx0XHRpbml0aWFsRGF0ZS5zZXRVVENNb250aCh0aGlzLm1vbnRoIC0gMSB8fCAwKTtcclxuXHRcdGluaXRpYWxEYXRlLnNldFVUQ0RhdGUodGhpcy5kYXkgfHwgMSk7XHJcblx0XHRpbml0aWFsRGF0ZS5zZXRVVENIb3Vycyh0aGlzLmhvdXIgfHwgMCk7XHJcblx0XHRpbml0aWFsRGF0ZS5zZXRVVENNaW51dGVzKHRoaXMubWludXRlIHx8IDApO1xyXG5cdFx0aW5pdGlhbERhdGUuc2V0VVRDU2Vjb25kcyh0aGlzLnNlY29uZCB8fCAwKTtcclxuXHRcdGluaXRpYWxEYXRlLnNldFVUQ01pbGxpc2Vjb25kcygodGhpcy5mcmFjdGlvbmFsU2Vjb25kIHx8IDApICogMTAwMCk7XHJcblx0XHR2YXIgdGltZXpvbmVPZmZzZXQgPSAtNjAwMDAgKiAodGhpcy50aW1lem9uZSB8fCAwKTtcclxuXHRcdHRoaXMuZGF0ZSA9IG5ldyBEYXRlKGluaXRpYWxEYXRlLmdldFRpbWUoKSArIHRpbWV6b25lT2Zmc2V0KTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiBcIkpzb25peC5YTUwuQ2FsZW5kYXJcIlxyXG59KTtcclxuSnNvbml4LlhNTC5DYWxlbmRhci5NSU5fVElNRVpPTkUgPSAtMTQgKiA2MDtcclxuSnNvbml4LlhNTC5DYWxlbmRhci5NQVhfVElNRVpPTkUgPSAxNCAqIDYwO1xyXG5Kc29uaXguWE1MLkNhbGVuZGFyLkRBWVNfSU5fTU9OVEggPSBbIDMxLCAyOSwgMzEsIDMwLCAzMSwgMzAsIDMxLCAzMSwgMzAsIDMxLCAzMCwgMzEgXTtcclxuSnNvbml4LlhNTC5DYWxlbmRhci5mcm9tT2JqZWN0ID0gZnVuY3Rpb24ob2JqZWN0KSB7XHJcblx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChvYmplY3QpO1xyXG5cdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKG9iamVjdC5DTEFTU19OQU1FKSAmJiBvYmplY3QuQ0xBU1NfTkFNRSA9PT0gJ0pzb25peC5YTUwuQ2FsZW5kYXInKSB7XHJcblx0XHRyZXR1cm4gb2JqZWN0O1xyXG5cdH1cclxuXHRyZXR1cm4gbmV3IEpzb25peC5YTUwuQ2FsZW5kYXIob2JqZWN0KTtcclxufTtcclxuSnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVllYXIgPSBmdW5jdGlvbih5ZWFyKSB7XHJcblx0aWYgKHllYXIgPT09IDApIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCB5ZWFyIFsnICsgeWVhciArICddLiBZZWFyIG11c3Qgbm90IGJlIFswXS4nKTtcclxuXHR9XHJcbn07XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVNb250aCA9IGZ1bmN0aW9uKG1vbnRoKSB7XHJcblx0aWYgKG1vbnRoIDwgMSB8fCBtb250aCA+IDEyKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgbW9udGggWycgKyBtb250aCArICddLiBNb250aCBtdXN0IGJlIGluIHJhbmdlIFsxLCAxMl0uJyk7XHJcblx0fVxyXG59O1xyXG5Kc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlRGF5ID0gZnVuY3Rpb24oZGF5KSB7XHJcblx0aWYgKGRheSA8IDEgfHwgZGF5ID4gMzEpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBkYXkgWycgKyBkYXkgKyAnXS4gRGF5IG11c3QgYmUgaW4gcmFuZ2UgWzEsIDMxXS4nKTtcclxuXHR9XHJcbn07XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVNb250aERheSA9IGZ1bmN0aW9uKG1vbnRoLCBkYXkpIHtcclxuXHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlTW9udGgobW9udGgpO1xyXG5cdHZhciBtYXhEYXlzSW5Nb250aCA9IEpzb25peC5YTUwuQ2FsZW5kYXIuREFZU19JTl9NT05USFttb250aCAtIDFdO1xyXG5cdGlmIChkYXkgPCAxIHx8IGRheSA+IEpzb25peC5YTUwuQ2FsZW5kYXIuREFZU19JTl9NT05USFttb250aCAtIDFdKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZGF5IFsnICsgZGF5ICsgJ10uIERheSBtdXN0IGJlIGluIHJhbmdlIFsxLCAnICsgbWF4RGF5c0luTW9udGggKyAnXS4nKTtcclxuXHR9XHJcbn07XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVZZWFyTW9udGhEYXkgPSBmdW5jdGlvbih5ZWFyLCBtb250aCwgZGF5KSB7XHJcblx0Ly8gIzkzIFRPRE8gcHJvcGVyIHZhbGlkYXRpb24gb2YgMjgvMjkgMDJcclxuXHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlWWVhcih5ZWFyKTtcclxuXHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlTW9udGhEYXkobW9udGgsIGRheSk7XHJcbn07XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVIb3VyID0gZnVuY3Rpb24oaG91cikge1xyXG5cdGlmIChob3VyIDwgMCB8fCBob3VyID4gMjMpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBob3VyIFsnICsgaG91ciArICddLiBIb3VyIG11c3QgYmUgaW4gcmFuZ2UgWzAsIDIzXS4nKTtcclxuXHR9XHJcbn07XHJcbkpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVNaW51dGUgPSBmdW5jdGlvbihtaW51dGUpIHtcclxuXHRpZiAobWludXRlIDwgMCB8fCBtaW51dGUgPiA1OSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIG1pbnV0ZSBbJyArIG1pbnV0ZSArICddLiBNaW51dGUgbXVzdCBiZSBpbiByYW5nZSBbMCwgNTldLicpO1xyXG5cdH1cclxufTtcclxuSnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVNlY29uZCA9IGZ1bmN0aW9uKHNlY29uZCkge1xyXG5cdGlmIChzZWNvbmQgPCAwIHx8IHNlY29uZCA+IDU5KSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc2Vjb25kIFsnICsgc2Vjb25kICsgJ10uIFNlY29uZCBtdXN0IGJlIGluIHJhbmdlIFswLCA1OV0uJyk7XHJcblx0fVxyXG59O1xyXG5Kc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlRnJhY3Rpb25hbFNlY29uZCA9IGZ1bmN0aW9uKGZyYWN0aW9uYWxTZWNvbmQpIHtcclxuXHRpZiAoZnJhY3Rpb25hbFNlY29uZCA8IDAgfHwgZnJhY3Rpb25hbFNlY29uZCA+IDU5KSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgZnJhY3Rpb25hbCBzZWNvbmQgWycgKyBmcmFjdGlvbmFsU2Vjb25kICsgJ10uIEZyYWN0aW9uYWwgc2Vjb25kIG11c3QgYmUgaW4gcmFuZ2UgWzAsIDEpLicpO1xyXG5cdH1cclxufTtcclxuSnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVRpbWV6b25lID0gZnVuY3Rpb24odGltZXpvbmUpIHtcclxuXHRpZiAodGltZXpvbmUgPCBKc29uaXguWE1MLkNhbGVuZGFyLk1JTl9USU1FWk9ORSB8fCB0aW1lem9uZSA+IEpzb25peC5YTUwuQ2FsZW5kYXIuTUFYX1RJTUVaT05FKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgdGltZXpvbmUgWycgKyB0aW1lem9uZSArICddLiBUaW1lem9uZSBtdXN0IG5vdCBiZSBpbiByYW5nZSBbJyArIEpzb25peC5YTUwuQ2FsZW5kYXIuTUlOX1RJTUVaT05FICsgJywgJyArIEpzb25peC5YTUwuQ2FsZW5kYXIuTUFYX1RJTUVaT05FICsgJ10uJyk7XHJcblx0fVxyXG59O1xyXG5Kc29uaXguWE1MLklucHV0ID0gSnNvbml4LkNsYXNzKHtcclxuXHRyb290IDogbnVsbCxcclxuXHRub2RlIDogbnVsbCxcclxuXHRhdHRyaWJ1dGVzIDogbnVsbCxcclxuXHRldmVudFR5cGUgOiBudWxsLFxyXG5cdHBucyA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVFeGlzdHMobm9kZSk7XHJcblx0XHR0aGlzLnJvb3QgPSBub2RlO1xyXG5cdFx0dmFyIHJvb3RQbnNJdGVtID1cclxuXHRcdHtcclxuXHRcdFx0JycgOiAnJ1xyXG5cdFx0fTtcclxuXHRcdHJvb3RQbnNJdGVtW0pzb25peC5YTUwuWE1MTlNfUF0gPSBKc29uaXguWE1MLlhNTE5TX05TO1xyXG5cdFx0dGhpcy5wbnMgPSBbcm9vdFBuc0l0ZW1dO1xyXG5cdH0sXHJcblx0aGFzTmV4dCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8gTm8gY3VycmVudCBub2RlLCB3ZSd2ZSBub3Qgc3RhcnRlZCB5ZXRcclxuXHRcdGlmICh0aGlzLm5vZGUgPT09IG51bGwpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMubm9kZSA9PT0gdGhpcy5yb290KSB7XHJcblx0XHRcdHZhciBub2RlVHlwZSA9IHRoaXMubm9kZS5ub2RlVHlwZTtcclxuXHRcdFx0Ly8gUm9vdCBub2RlIGlzIGRvY3VtZW50LCBsYXN0IGV2ZW50IHR5cGUgaXMgRU5EX0RPQ1VNRU5UXHJcblx0XHRcdGlmIChub2RlVHlwZSA9PT0gOSAmJiB0aGlzLmV2ZW50VHlwZSA9PT0gOCkge1xyXG5cdFx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBSb290IG5vZGUgaXMgZWxlbWVudCwgbGFzdCBldmVudCB0eXBlIGlzIEVORF9FTEVNRU5UXHJcblx0XHRcdGVsc2UgaWYgKG5vZGVUeXBlID09PSAxICYmIHRoaXMuZXZlbnRUeXBlID09PSAyKSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdG5leHQgOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0aGlzLmV2ZW50VHlwZSA9PT0gbnVsbCkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5lbnRlcih0aGlzLnJvb3QpO1xyXG5cdFx0fVxyXG5cdFx0Ly8gU1RBUlRfRE9DVU1FTlRcclxuXHRcdGlmICh0aGlzLmV2ZW50VHlwZSA9PT0gNykge1xyXG5cdFx0XHR2YXIgZG9jdW1lbnRFbGVtZW50ID0gdGhpcy5ub2RlLmRvY3VtZW50RWxlbWVudDtcclxuXHRcdFx0aWYgKGRvY3VtZW50RWxlbWVudCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmVudGVyKGRvY3VtZW50RWxlbWVudCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMubGVhdmUodGhpcy5ub2RlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmV2ZW50VHlwZSA9PT0gMSkge1xyXG5cdFx0XHR2YXIgZmlyc3RDaGlsZCA9IHRoaXMubm9kZS5maXJzdENoaWxkO1xyXG5cdFx0XHRpZiAoZmlyc3RDaGlsZCkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmVudGVyKGZpcnN0Q2hpbGQpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmxlYXZlKHRoaXMubm9kZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAodGhpcy5ldmVudFR5cGUgPT09IDIpIHtcclxuXHRcdFx0dmFyIG5leHRTaWJsaW5nID0gdGhpcy5ub2RlLm5leHRTaWJsaW5nO1xyXG5cdFx0XHRpZiAobmV4dFNpYmxpbmcpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5lbnRlcihuZXh0U2libGluZyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMubGVhdmUodGhpcy5ub2RlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMubGVhdmUodGhpcy5ub2RlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGVudGVyIDogZnVuY3Rpb24obm9kZSkge1xyXG5cdFx0dmFyIG5vZGVUeXBlID0gbm9kZS5ub2RlVHlwZTtcclxuXHRcdHRoaXMubm9kZSA9IG5vZGU7XHJcblx0XHR0aGlzLmF0dHJpYnV0ZXMgPSBudWxsO1xyXG5cdFx0Ly8gRG9jdW1lbnQgbm9kZVxyXG5cdFx0aWYgKG5vZGVUeXBlID09PSAxKSB7XHJcblx0XHRcdC8vIFNUQVJUX0VMRU1FTlRcclxuXHRcdFx0dGhpcy5ldmVudFR5cGUgPSAxO1xyXG5cdFx0XHR0aGlzLnB1c2hOUyhub2RlKTtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZXZlbnRUeXBlO1xyXG5cdFx0fSBlbHNlIGlmIChub2RlVHlwZSA9PT0gMikge1xyXG5cdFx0XHQvLyBBVFRSSUJVVEVcclxuXHRcdFx0dGhpcy5ldmVudFR5cGUgPSAxMDtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZXZlbnRUeXBlO1xyXG5cdFx0fSBlbHNlIGlmIChub2RlVHlwZSA9PT0gMykge1xyXG5cdFx0XHR2YXIgbm9kZVZhbHVlID0gbm9kZS5ub2RlVmFsdWU7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5TdHJpbmdVdGlscy5pc0VtcHR5KG5vZGVWYWx1ZSkpIHtcclxuXHRcdFx0XHQvLyBTUEFDRVxyXG5cdFx0XHRcdHRoaXMuZXZlbnRUeXBlID0gNjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHQvLyBDSEFSQUNURVJTXHJcblx0XHRcdFx0dGhpcy5ldmVudFR5cGUgPSA0O1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzLmV2ZW50VHlwZTtcclxuXHRcdH0gZWxzZSBpZiAobm9kZVR5cGUgPT09IDQpIHtcclxuXHRcdFx0Ly8gQ0RBVEFcclxuXHRcdFx0dGhpcy5ldmVudFR5cGUgPSAxMjtcclxuXHRcdFx0cmV0dXJuIHRoaXMuZXZlbnRUeXBlO1xyXG5cdFx0fSBlbHNlIGlmIChub2RlVHlwZSA9PT0gNSkge1xyXG5cdFx0XHQvLyBFTlRJVFlfUkVGRVJFTkNFX05PREUgPSA1XHJcblx0XHRcdC8vIEVOVElUWV9SRUZFUkVOQ0VcclxuXHRcdFx0dGhpcy5ldmVudFR5cGUgPSA5O1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5ldmVudFR5cGU7XHJcblx0XHR9IGVsc2UgaWYgKG5vZGVUeXBlID09PSA2KSB7XHJcblx0XHRcdC8vIEVOVElUWV9ERUNMQVJBVElPTlxyXG5cdFx0XHR0aGlzLmV2ZW50VHlwZSA9IDE1O1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5ldmVudFR5cGU7XHJcblx0XHR9IGVsc2UgaWYgKG5vZGVUeXBlID09PSA3KSB7XHJcblx0XHRcdC8vIFBST0NFU1NJTkdfSU5TVFJVQ1RJT05cclxuXHRcdFx0dGhpcy5ldmVudFR5cGUgPSAzO1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5ldmVudFR5cGU7XHJcblx0XHR9IGVsc2UgaWYgKG5vZGVUeXBlID09PSA4KSB7XHJcblx0XHRcdC8vIENPTU1FTlRcclxuXHRcdFx0dGhpcy5ldmVudFR5cGUgPSA1O1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5ldmVudFR5cGU7XHJcblx0XHR9IGVsc2UgaWYgKG5vZGVUeXBlID09PSA5KSB7XHJcblx0XHRcdC8vIFNUQVJUX0RPQ1VNRU5UXHJcblx0XHRcdHRoaXMuZXZlbnRUeXBlID0gNztcclxuXHRcdFx0cmV0dXJuIHRoaXMuZXZlbnRUeXBlO1xyXG5cdFx0fSBlbHNlIGlmIChub2RlVHlwZSA9PT0gMTApIHtcclxuXHRcdFx0Ly8gRFREXHJcblx0XHRcdHRoaXMuZXZlbnRUeXBlID0gMTI7XHJcblx0XHRcdHJldHVybiB0aGlzLmV2ZW50VHlwZTtcclxuXHRcdH0gZWxzZSBpZiAobm9kZVR5cGUgPT09IDEyKSB7XHJcblx0XHRcdC8vIE5PVEFUSU9OX0RFQ0xBUkFUSU9OXHJcblx0XHRcdHRoaXMuZXZlbnRUeXBlID0gMTQ7XHJcblx0XHRcdHJldHVybiB0aGlzLmV2ZW50VHlwZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIERPQ1VNRU5UX0ZSQUdNRU5UX05PREUgPSAxMVxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJOb2RlIHR5cGUgW1wiICsgbm9kZVR5cGUgKyAnXSBpcyBub3Qgc3VwcG9ydGVkLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0bGVhdmUgOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHRpZiAobm9kZS5ub2RlVHlwZSA9PT0gOSkge1xyXG5cdFx0XHRpZiAodGhpcy5ldmVudFR5cGUgPT0gOCkge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc3RhdGUuXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubm9kZSA9IG5vZGU7XHJcblx0XHRcdFx0dGhpcy5hdHRyaWJ1dGVzID0gbnVsbDtcclxuXHRcdFx0XHQvLyBFTkRfRUxFTUVOVFxyXG5cdFx0XHRcdHRoaXMuZXZlbnRUeXBlID0gODtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5ldmVudFR5cGU7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSBpZiAobm9kZS5ub2RlVHlwZSA9PT0gMSkge1xyXG5cdFx0XHRpZiAodGhpcy5ldmVudFR5cGUgPT0gMikge1xyXG5cdFx0XHRcdHZhciBuZXh0U2libGluZyA9IG5vZGUubmV4dFNpYmxpbmc7XHJcblx0XHRcdFx0aWYgKG5leHRTaWJsaW5nKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdGhpcy5lbnRlcihuZXh0U2libGluZyk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMubm9kZSA9IG5vZGU7XHJcblx0XHRcdFx0dGhpcy5hdHRyaWJ1dGVzID0gbnVsbDtcclxuXHRcdFx0XHQvLyBFTkRfRUxFTUVOVFxyXG5cdFx0XHRcdHRoaXMuZXZlbnRUeXBlID0gMjtcclxuXHRcdFx0XHR0aGlzLnBvcE5TKCk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuZXZlbnRUeXBlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIG5leHRTaWJsaW5nMSA9IG5vZGUubmV4dFNpYmxpbmc7XHJcblx0XHRpZiAobmV4dFNpYmxpbmcxKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLmVudGVyKG5leHRTaWJsaW5nMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcGFyZW50Tm9kZSA9IG5vZGUucGFyZW50Tm9kZTtcclxuXHRcdFx0dGhpcy5ub2RlID0gcGFyZW50Tm9kZTtcclxuXHRcdFx0dGhpcy5hdHRyaWJ1dGVzID0gbnVsbDtcclxuXHRcdFx0aWYgKHBhcmVudE5vZGUubm9kZVR5cGUgPT09IDkpIHtcclxuXHRcdFx0XHR0aGlzLmV2ZW50VHlwZSA9IDg7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhpcy5ldmVudFR5cGUgPSAyO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0aGlzLmV2ZW50VHlwZTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldE5hbWUgOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBub2RlID0gdGhpcy5ub2RlO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcobm9kZS5ub2RlTmFtZSkpIHtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcobm9kZS5uYW1lc3BhY2VVUkkpKSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyBKc29uaXguWE1MLlFOYW1lKG5vZGUubmFtZXNwYWNlVVJJLCBub2RlLm5vZGVOYW1lKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IEpzb25peC5YTUwuUU5hbWUobm9kZS5ub2RlTmFtZSk7XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0TmFtZUtleSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIG5vZGUgPSB0aGlzLm5vZGU7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhub2RlLm5vZGVOYW1lKSkge1xyXG5cdFx0XHRyZXR1cm4gSnNvbml4LlhNTC5RTmFtZS5rZXkobm9kZS5uYW1lc3BhY2VVUkksIG5vZGUubm9kZU5hbWUpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRUZXh0IDogZnVuY3Rpb24oKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5ub2RlLm5vZGVWYWx1ZTtcclxuXHR9LFxyXG5cdG5leHRUYWcgOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBldCA9IHRoaXMubmV4dCgpO1xyXG5cdFx0Ly8gVE9ETyBpc1doaXRlU3BhY2VcclxuXHRcdHdoaWxlIChldCA9PT0gNyB8fCBldCA9PT0gNCB8fCBldCA9PT0gMTIgfHwgZXQgPT09IDYgfHwgZXQgPT09IDMgfHwgZXQgPT09IDUpIHtcclxuXHRcdFx0ZXQgPSB0aGlzLm5leHQoKTtcclxuXHRcdH1cclxuXHRcdGlmIChldCAhPT0gMSAmJiBldCAhPT0gMikge1xyXG5cdFx0XHQvLyBUT0RPIGxvY2F0aW9uXHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignRXhwZWN0ZWQgc3RhcnQgb3IgZW5kIHRhZy4nKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBldDtcclxuXHR9LFxyXG5cdHNraXBFbGVtZW50IDogZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAodGhpcy5ldmVudFR5cGUgIT09IEpzb25peC5YTUwuSW5wdXQuU1RBUlRfRUxFTUVOVCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJQYXJzZXIgbXVzdCBiZSBvbiBTVEFSVF9FTEVNRU5UIHRvIHNraXAgZWxlbWVudC5cIik7XHJcblx0XHR9XHJcblx0XHR2YXIgbnVtYmVyT2ZPcGVuVGFncyA9IDE7XHJcblx0XHR2YXIgZXQ7XHJcblx0XHRkbyB7XHJcblx0XHRcdGV0ID0gdGhpcy5uZXh0VGFnKCk7XHJcblx0XHQgICAgbnVtYmVyT2ZPcGVuVGFncyArPSAoZXQgPT09IEpzb25peC5YTUwuSW5wdXQuU1RBUlRfRUxFTUVOVCkgPyAxIDogLTE7XHJcblx0XHQgIH0gd2hpbGUgKG51bWJlck9mT3BlblRhZ3MgPiAwKTtcclxuXHRcdHJldHVybiBldDtcclxuXHR9LFx0XHJcblx0Z2V0RWxlbWVudFRleHQgOiBmdW5jdGlvbigpIHtcclxuXHRcdGlmICh0aGlzLmV2ZW50VHlwZSAhPSAxKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlBhcnNlciBtdXN0IGJlIG9uIFNUQVJUX0VMRU1FTlQgdG8gcmVhZCBuZXh0IHRleHQuXCIpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGV0ID0gdGhpcy5uZXh0KCk7XHJcblx0XHR2YXIgY29udGVudCA9ICcnO1xyXG5cdFx0d2hpbGUgKGV0ICE9PSAyKSB7XHJcblx0XHRcdGlmIChldCA9PT0gNCB8fCBldCA9PT0gMTIgfHwgZXQgPT09IDYgfHwgZXQgPT09IDkpIHtcclxuXHRcdFx0XHRjb250ZW50ID0gY29udGVudCArIHRoaXMuZ2V0VGV4dCgpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGV0ID09PSAzIHx8IGV0ID09PSA1KSB7XHJcblx0XHRcdFx0Ly8gU2tpcCBQSSBvciBjb21tZW50XHJcblx0XHRcdH0gZWxzZSBpZiAoZXQgPT09IDgpIHtcclxuXHRcdFx0XHQvLyBFbmQgZG9jdW1lbnRcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGVuZCBvZiBkb2N1bWVudCB3aGVuIHJlYWRpbmcgZWxlbWVudCB0ZXh0IGNvbnRlbnQuXCIpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGV0ID09PSAxKSB7XHJcblx0XHRcdFx0Ly8gRW5kIGVsZW1lbnRcclxuXHRcdFx0XHQvLyBUT0RPIGxvY2F0aW9uXHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCB0ZXh0IGNvbnRlbnQgbWF5IG5vdCBjb250YWluIFNUQVJUX0VMRU1FTlQuXCIpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vIFRPRE8gbG9jYXRpb25cclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIGV2ZW50IHR5cGUgW1wiICsgZXQgKyBcIl0uXCIpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGV0ID0gdGhpcy5uZXh0KCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gY29udGVudDtcclxuXHR9LFxyXG5cdHJldHJpZXZlRWxlbWVudCA6IGZ1bmN0aW9uICgpIHtcclxuXHRcdHZhciBlbGVtZW50O1xyXG5cdFx0aWYgKHRoaXMuZXZlbnRUeXBlID09PSAxKSB7XHJcblx0XHRcdGVsZW1lbnQgPSB0aGlzLm5vZGU7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuZXZlbnRUeXBlID09PSAxMCkge1xyXG5cdFx0XHRlbGVtZW50ID0gdGhpcy5ub2RlLnBhcmVudE5vZGU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJFbGVtZW50IGNhbiBvbmx5IGJlIHJldHJpZXZlZCBmb3IgU1RBUlRfRUxFTUVOVCBvciBBVFRSSUJVVEUgbm9kZXMuXCIpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGVsZW1lbnQ7XHJcblx0fSxcclxuXHRyZXRyaWV2ZUF0dHJpYnV0ZXMgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR2YXIgYXR0cmlidXRlcztcclxuXHRcdGlmICh0aGlzLmF0dHJpYnV0ZXMpXHJcblx0XHR7XHJcblx0XHRcdGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXM7XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuZXZlbnRUeXBlID09PSAxKSB7XHJcblx0XHRcdGF0dHJpYnV0ZXMgPSB0aGlzLm5vZGUuYXR0cmlidXRlcztcclxuXHRcdFx0dGhpcy5hdHRyaWJ1dGVzID0gYXR0cmlidXRlcztcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5ldmVudFR5cGUgPT09IDEwKSB7XHJcblx0XHRcdGF0dHJpYnV0ZXMgPSB0aGlzLm5vZGUucGFyZW50Tm9kZS5hdHRyaWJ1dGVzO1xyXG5cdFx0XHR0aGlzLmF0dHJpYnV0ZXMgPSBhdHRyaWJ1dGVzO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQXR0cmlidXRlcyBjYW4gb25seSBiZSByZXRyaWV2ZWQgZm9yIFNUQVJUX0VMRU1FTlQgb3IgQVRUUklCVVRFIG5vZGVzLlwiKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBhdHRyaWJ1dGVzO1xyXG5cdH0sXHJcblx0Z2V0QXR0cmlidXRlQ291bnQgOiBmdW5jdGlvbigpIHtcclxuXHRcdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5yZXRyaWV2ZUF0dHJpYnV0ZXMoKTtcclxuXHRcdHJldHVybiBhdHRyaWJ1dGVzLmxlbmd0aDtcclxuXHR9LFxyXG5cdGdldEF0dHJpYnV0ZU5hbWUgOiBmdW5jdGlvbihpbmRleCkge1xyXG5cdFx0dmFyIGF0dHJpYnV0ZXMgPSB0aGlzLnJldHJpZXZlQXR0cmlidXRlcygpO1xyXG5cdFx0aWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSBhdHRyaWJ1dGVzLmxlbmd0aCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIGF0dHJpYnV0ZSBpbmRleCBbXCIgKyBpbmRleCArIFwiXS5cIik7XHJcblx0XHR9XHJcblx0XHR2YXIgYXR0cmlidXRlID0gYXR0cmlidXRlc1tpbmRleF07XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhhdHRyaWJ1dGUubmFtZXNwYWNlVVJJKSkge1xyXG5cdFx0XHRyZXR1cm4gbmV3IEpzb25peC5YTUwuUU5hbWUoYXR0cmlidXRlLm5hbWVzcGFjZVVSSSwgYXR0cmlidXRlLm5vZGVOYW1lKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiBuZXcgSnNvbml4LlhNTC5RTmFtZShhdHRyaWJ1dGUubm9kZU5hbWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0QXR0cmlidXRlTmFtZUtleSA6IGZ1bmN0aW9uKGluZGV4KSB7XHJcblx0XHR2YXIgYXR0cmlidXRlcyA9IHRoaXMucmV0cmlldmVBdHRyaWJ1dGVzKCk7XHJcblx0XHRpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IGF0dHJpYnV0ZXMubGVuZ3RoKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgYXR0cmlidXRlIGluZGV4IFtcIiArIGluZGV4ICsgXCJdLlwiKTtcclxuXHRcdH1cclxuXHRcdHZhciBhdHRyaWJ1dGUgPSBhdHRyaWJ1dGVzW2luZGV4XTtcclxuXHJcblx0XHRyZXR1cm4gSnNvbml4LlhNTC5RTmFtZS5rZXkoYXR0cmlidXRlLm5hbWVzcGFjZVVSSSwgYXR0cmlidXRlLm5vZGVOYW1lKTtcclxuXHR9LFxyXG5cdGdldEF0dHJpYnV0ZVZhbHVlIDogZnVuY3Rpb24oaW5kZXgpIHtcclxuXHRcdHZhciBhdHRyaWJ1dGVzID0gdGhpcy5yZXRyaWV2ZUF0dHJpYnV0ZXMoKTtcclxuXHRcdGlmIChpbmRleCA8IDAgfHwgaW5kZXggPj0gYXR0cmlidXRlcy5sZW5ndGgpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBhdHRyaWJ1dGUgaW5kZXggW1wiICsgaW5kZXggKyBcIl0uXCIpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGF0dHJpYnV0ZSA9IGF0dHJpYnV0ZXNbaW5kZXhdO1xyXG5cdFx0cmV0dXJuIGF0dHJpYnV0ZS52YWx1ZTtcclxuXHR9LFxyXG5cdGdldEF0dHJpYnV0ZVZhbHVlTlMgOiBudWxsLFxyXG5cdGdldEF0dHJpYnV0ZVZhbHVlTlNWaWFFbGVtZW50IDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBsb2NhbFBhcnQpIHtcclxuXHRcdHZhciBlbGVtZW50ID0gdGhpcy5yZXRyaWV2ZUVsZW1lbnQoKTtcclxuXHRcdHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZU5TKG5hbWVzcGFjZVVSSSwgbG9jYWxQYXJ0KTtcclxuXHR9LFxyXG5cdGdldEF0dHJpYnV0ZVZhbHVlTlNWaWFBdHRyaWJ1dGUgOiBmdW5jdGlvbihuYW1lc3BhY2VVUkksIGxvY2FsUGFydCkge1xyXG5cdFx0dmFyIGF0dHJpYnV0ZU5vZGUgPSB0aGlzLmdldEF0dHJpYnV0ZU5vZGVOUyhuYW1lc3BhY2VVUkksIGxvY2FsUGFydCk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoYXR0cmlidXRlTm9kZSkpIHtcclxuXHRcdFx0cmV0dXJuIGF0dHJpYnV0ZU5vZGUubm9kZVZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldEF0dHJpYnV0ZU5vZGVOUyA6IG51bGwsXHJcblx0Z2V0QXR0cmlidXRlTm9kZU5TVmlhRWxlbWVudCA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxQYXJ0KSB7XHJcblx0XHR2YXIgZWxlbWVudCA9IHRoaXMucmV0cmlldmVFbGVtZW50KCk7XHJcblx0XHRyZXR1cm4gZWxlbWVudC5nZXRBdHRyaWJ1dGVOb2RlTlMobmFtZXNwYWNlVVJJLCBsb2NhbFBhcnQpO1xyXG5cdH0sXHJcblx0Z2V0QXR0cmlidXRlTm9kZU5TVmlhQXR0cmlidXRlcyA6IGZ1bmN0aW9uKG5hbWVzcGFjZVVSSSwgbG9jYWxQYXJ0KSB7XHJcblx0XHR2YXIgYXR0cmlidXRlTm9kZSA9IG51bGw7XHJcblx0XHR2YXIgYXR0cmlidXRlcyA9IHRoaXMucmV0cmlldmVBdHRyaWJ1dGVzKCk7XHJcblx0XHR2YXIgcG90ZW50aWFsTm9kZSwgZnVsbE5hbWU7XHJcblx0XHRmb3IgKHZhciBpID0gMCwgbGVuID0gYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBsZW47ICsraSkge1xyXG5cdFx0XHRwb3RlbnRpYWxOb2RlID0gYXR0cmlidXRlc1tpXTtcclxuXHRcdFx0aWYgKHBvdGVudGlhbE5vZGUubmFtZXNwYWNlVVJJID09PSBuYW1lc3BhY2VVUkkpIHtcclxuXHRcdFx0XHRmdWxsTmFtZSA9IChwb3RlbnRpYWxOb2RlLnByZWZpeCkgPyAocG90ZW50aWFsTm9kZS5wcmVmaXggKyAnOicgKyBsb2NhbFBhcnQpIDogbG9jYWxQYXJ0O1xyXG5cdFx0XHRcdGlmIChmdWxsTmFtZSA9PT0gcG90ZW50aWFsTm9kZS5ub2RlTmFtZSkge1xyXG5cdFx0XHRcdFx0YXR0cmlidXRlTm9kZSA9IHBvdGVudGlhbE5vZGU7XHJcblx0XHRcdFx0XHRicmVhaztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBhdHRyaWJ1dGVOb2RlO1xyXG5cdH0sXHJcblx0Z2V0RWxlbWVudCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHRoaXMuZXZlbnRUeXBlID09PSAxIHx8IHRoaXMuZXZlbnRUeXBlID09PSAyKSB7XHJcblx0XHRcdC8vIEdvIHRvIHRoZSBFTkRfRUxFTUVOVFxyXG5cdFx0XHR0aGlzLmV2ZW50VHlwZSA9IDI7XHJcblx0XHRcdHJldHVybiB0aGlzLm5vZGU7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJQYXJzZXIgbXVzdCBiZSBvbiBTVEFSVF9FTEVNRU5UIG9yIEVORF9FTEVNRU5UIHRvIHJldHVybiBjdXJyZW50IGVsZW1lbnQuXCIpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cHVzaE5TIDogZnVuY3Rpb24gKG5vZGUpIHtcclxuXHRcdHZhciBwaW5kZXggPSB0aGlzLnBucy5sZW5ndGggLSAxO1xyXG5cdFx0dmFyIHBhcmVudFBuc0l0ZW0gPSB0aGlzLnBuc1twaW5kZXhdO1xyXG5cdFx0dmFyIHBuc0l0ZW0gPSBKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHBhcmVudFBuc0l0ZW0pID8gcGluZGV4IDogcGFyZW50UG5zSXRlbTtcclxuXHRcdHRoaXMucG5zLnB1c2gocG5zSXRlbSk7XHJcblx0XHRwaW5kZXgrKztcclxuXHRcdHZhciByZWZlcmVuY2UgPSB0cnVlO1xyXG5cdFx0aWYgKG5vZGUuYXR0cmlidXRlcylcclxuXHRcdHtcclxuXHRcdFx0dmFyIGF0dHJpYnV0ZXMgPSBub2RlLmF0dHJpYnV0ZXM7XHJcblx0XHRcdHZhciBhbGVuZ3RoID0gYXR0cmlidXRlcy5sZW5ndGg7XHJcblx0XHRcdGlmIChhbGVuZ3RoID4gMClcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vIElmIGdpdmVuIG5vZGUgaGFzIGF0dHJpYnV0ZXNcclxuXHRcdFx0XHRmb3IgKHZhciBhaW5kZXggPSAwOyBhaW5kZXggPCBhbGVuZ3RoOyBhaW5kZXgrKylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR2YXIgYXR0cmlidXRlID0gYXR0cmlidXRlc1thaW5kZXhdO1xyXG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZU5hbWUgPSBhdHRyaWJ1dGUubm9kZU5hbWU7XHJcblx0XHRcdFx0XHR2YXIgcCA9IG51bGw7XHJcblx0XHRcdFx0XHR2YXIgbnMgPSBudWxsO1xyXG5cdFx0XHRcdFx0dmFyIGlzTlMgPSBmYWxzZTtcclxuXHRcdFx0XHRcdGlmIChhdHRyaWJ1dGVOYW1lID09PSAneG1sbnMnKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRwID0gJyc7XHJcblx0XHRcdFx0XHRcdG5zID0gYXR0cmlidXRlLnZhbHVlO1xyXG5cdFx0XHRcdFx0XHRpc05TID0gdHJ1ZTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdGVsc2UgaWYgKGF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDAsIDYpID09PSAneG1sbnM6JylcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cCA9IGF0dHJpYnV0ZU5hbWUuc3Vic3RyaW5nKDYpO1xyXG5cdFx0XHRcdFx0XHRucyA9IGF0dHJpYnV0ZS52YWx1ZTtcclxuXHRcdFx0XHRcdFx0aXNOUyA9IHRydWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHQvLyBBdHRyaWJ1dGUgaXMgYSBuYW1lc3BhY2UgZGVjbGFyYXRpb25cclxuXHRcdFx0XHRcdGlmIChpc05TKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRpZiAocmVmZXJlbmNlKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0cG5zSXRlbSA9IEpzb25peC5VdGlsLlR5cGUuY2xvbmVPYmplY3QodGhpcy5wbnNbcG5zSXRlbV0sIHt9KTtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnBuc1twaW5kZXhdID0gcG5zSXRlbTtcclxuXHRcdFx0XHRcdFx0XHRyZWZlcmVuY2UgPSBmYWxzZTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRwbnNJdGVtW3BdID0gbnM7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHRcdFxyXG5cdH0sXHJcblx0cG9wTlMgOiBmdW5jdGlvbiAoKSB7XHJcblx0XHR0aGlzLnBucy5wb3AoKTtcclxuXHR9LFxyXG5cdGdldE5hbWVzcGFjZVVSSSA6IGZ1bmN0aW9uIChwKSB7XHJcblx0XHR2YXIgcGluZGV4ID0gdGhpcy5wbnMubGVuZ3RoIC0gMTtcclxuXHRcdHZhciBwbnNJdGVtID0gdGhpcy5wbnNbcGluZGV4XTtcclxuXHRcdHBuc0l0ZW0gPSBKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHBuc0l0ZW0pID8gcG5zSXRlbSA6IHRoaXMucG5zW3Buc0l0ZW1dO1xyXG5cdFx0cmV0dXJuIHBuc0l0ZW1bcF07XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogXCJKc29uaXguWE1MLklucHV0XCJcclxuXHJcbn0pO1xyXG5cclxuSnNvbml4LlhNTC5JbnB1dC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlVmFsdWVOUyA9IChKc29uaXguRE9NLmlzRG9tSW1wbGVtZW50YXRpb25BdmFpbGFibGUoKSkgPyBKc29uaXguWE1MLklucHV0LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVWYWx1ZU5TVmlhRWxlbWVudCA6IEpzb25peC5YTUwuSW5wdXQucHJvdG90eXBlLmdldEF0dHJpYnV0ZVZhbHVlTlNWaWFBdHRyaWJ1dGU7XHJcbkpzb25peC5YTUwuSW5wdXQucHJvdG90eXBlLmdldEF0dHJpYnV0ZU5vZGVOUyA9IChKc29uaXguRE9NLmlzRG9tSW1wbGVtZW50YXRpb25BdmFpbGFibGUoKSkgPyBKc29uaXguWE1MLklucHV0LnByb3RvdHlwZS5nZXRBdHRyaWJ1dGVOb2RlTlNWaWFFbGVtZW50IDogSnNvbml4LlhNTC5JbnB1dC5wcm90b3R5cGUuZ2V0QXR0cmlidXRlTm9kZU5TVmlhQXR0cmlidXRlcztcclxuXHJcbkpzb25peC5YTUwuSW5wdXQuU1RBUlRfRUxFTUVOVCA9IDE7XHJcbkpzb25peC5YTUwuSW5wdXQuRU5EX0VMRU1FTlQgPSAyO1xyXG5Kc29uaXguWE1MLklucHV0LlBST0NFU1NJTkdfSU5TVFJVQ1RJT04gPSAzO1xyXG5Kc29uaXguWE1MLklucHV0LkNIQVJBQ1RFUlMgPSA0O1xyXG5Kc29uaXguWE1MLklucHV0LkNPTU1FTlQgPSA1O1xyXG5Kc29uaXguWE1MLklucHV0LlNQQUNFID0gNjtcclxuSnNvbml4LlhNTC5JbnB1dC5TVEFSVF9ET0NVTUVOVCA9IDc7XHJcbkpzb25peC5YTUwuSW5wdXQuRU5EX0RPQ1VNRU5UID0gODtcclxuSnNvbml4LlhNTC5JbnB1dC5FTlRJVFlfUkVGRVJFTkNFID0gOTtcclxuSnNvbml4LlhNTC5JbnB1dC5BVFRSSUJVVEUgPSAxMDtcclxuSnNvbml4LlhNTC5JbnB1dC5EVEQgPSAxMTtcclxuSnNvbml4LlhNTC5JbnB1dC5DREFUQSA9IDEyO1xyXG5Kc29uaXguWE1MLklucHV0Lk5BTUVTUEFDRSA9IDEzO1xyXG5Kc29uaXguWE1MLklucHV0Lk5PVEFUSU9OX0RFQ0xBUkFUSU9OID0gMTQ7XHJcbkpzb25peC5YTUwuSW5wdXQuRU5USVRZX0RFQ0xBUkFUSU9OID0gMTU7XHJcblxyXG5Kc29uaXguWE1MLk91dHB1dCA9IEpzb25peC5DbGFzcyh7XHJcblx0ZG9jdW1lbnQgOiBudWxsLFxyXG5cdGRvY3VtZW50RWxlbWVudCA6IG51bGwsXHJcblx0bm9kZSA6IG51bGwsXHJcblx0bm9kZXMgOiBudWxsLFxyXG5cdG5zcCA6IG51bGwsXHJcblx0cG5zIDogbnVsbCxcclxuXHRuYW1lc3BhY2VQcmVmaXhJbmRleCA6IDAsXHJcblx0eG1sZG9tIDogbnVsbCxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24ob3B0aW9ucykge1xyXG5cdFx0Ly8gUkVXT1JLXHJcblx0XHRpZiAodHlwZW9mIEFjdGl2ZVhPYmplY3QgIT09ICd1bmRlZmluZWQnKSB7XHJcblx0XHRcdHRoaXMueG1sZG9tID0gbmV3IEFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MRE9NXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy54bWxkb20gPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5ub2RlcyA9IFtdO1xyXG5cdFx0dmFyIHJvb3ROc3BJdGVtID1cclxuXHRcdHtcclxuXHRcdFx0JycgOiAnJ1xyXG5cdFx0fTtcclxuXHRcdHJvb3ROc3BJdGVtW0pzb25peC5YTUwuWE1MTlNfTlNdID0gSnNvbml4LlhNTC5YTUxOU19QO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3Qob3B0aW9ucykpIHtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3Qob3B0aW9ucy5uYW1lc3BhY2VQcmVmaXhlcykpIHtcclxuXHRcdFx0XHRKc29uaXguVXRpbC5UeXBlLmNsb25lT2JqZWN0KG9wdGlvbnMubmFtZXNwYWNlUHJlZml4ZXMsIHJvb3ROc3BJdGVtKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dGhpcy5uc3AgPSBbcm9vdE5zcEl0ZW1dO1xyXG5cdFx0dmFyIHJvb3RQbnNJdGVtID1cclxuXHRcdHtcclxuXHRcdFx0JycgOiAnJ1xyXG5cdFx0fTtcclxuXHRcdHJvb3RQbnNJdGVtW0pzb25peC5YTUwuWE1MTlNfUF0gPSBKc29uaXguWE1MLlhNTE5TX05TO1xyXG5cdFx0dGhpcy5wbnMgPSBbcm9vdFBuc0l0ZW1dO1xyXG5cdH0sXHJcblx0ZGVzdHJveSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy54bWxkb20gPSBudWxsO1xyXG5cdH0sXHJcblx0d3JpdGVTdGFydERvY3VtZW50IDogZnVuY3Rpb24oKSB7XHJcblx0XHQvLyBUT0RPIENoZWNrXHJcblx0XHR2YXIgZG9jID0gSnNvbml4LkRPTS5jcmVhdGVEb2N1bWVudCgpO1xyXG5cdFx0dGhpcy5kb2N1bWVudCA9IGRvYztcclxuXHRcdHJldHVybiB0aGlzLnB1c2goZG9jKTtcclxuXHR9LFxyXG5cdHdyaXRlRW5kRG9jdW1lbnQgOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLnBvcCgpO1xyXG5cclxuXHR9LFxyXG5cdHdyaXRlU3RhcnRFbGVtZW50IDogZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChuYW1lKTtcclxuXHRcdHZhciBsb2NhbFBhcnQgPSBuYW1lLmxvY2FsUGFydCB8fCBuYW1lLmxwIHx8IG51bGw7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKGxvY2FsUGFydCk7XHJcblx0XHR2YXIgbnMgPSBuYW1lLm5hbWVzcGFjZVVSSSB8fCBuYW1lLm5zIHx8IG51bGw7XHJcblx0XHR2YXIgbmFtZXNwYWNlVVJJID0gSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhucykgPyBucyA6ICcnO1xyXG5cclxuXHRcdHZhciBwID0gbmFtZS5wcmVmaXggfHwgbmFtZS5wO1xyXG5cdFx0dmFyIHByZWZpeCA9IHRoaXMuZ2V0UHJlZml4KG5hbWVzcGFjZVVSSSwgcCk7XHJcblxyXG5cdFx0dmFyIHF1YWxpZmllZE5hbWUgPSAoIXByZWZpeCA/IGxvY2FsUGFydCA6IHByZWZpeCArICc6JyArIGxvY2FsUGFydCk7XHJcblxyXG5cdFx0dmFyIGVsZW1lbnQ7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc0Z1bmN0aW9uKHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKSlcdHtcclxuXHRcdFx0ZWxlbWVudCA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKG5hbWVzcGFjZVVSSSwgcXVhbGlmaWVkTmFtZSk7XHJcblx0XHR9XHJcblx0XHRlbHNlIGlmICh0aGlzLnhtbGRvbSkge1xyXG5cdFx0XHRlbGVtZW50ID0gdGhpcy54bWxkb20uY3JlYXRlTm9kZSgxLCBxdWFsaWZpZWROYW1lLCBuYW1lc3BhY2VVUkkpO1xyXG5cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBjcmVhdGUgYW4gZWxlbWVudCBub2RlLlwiKTtcclxuXHRcdH1cclxuXHRcdHRoaXMucGVlaygpLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xyXG5cdFx0dGhpcy5wdXNoKGVsZW1lbnQpO1xyXG5cdFx0dGhpcy5kZWNsYXJlTmFtZXNwYWNlKG5hbWVzcGFjZVVSSSwgcHJlZml4KTtcclxuXHRcdGlmICh0aGlzLmRvY3VtZW50RWxlbWVudCA9PT0gbnVsbClcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5kb2N1bWVudEVsZW1lbnQgPSBlbGVtZW50O1xyXG5cdFx0XHR0aGlzLmRlY2xhcmVOYW1lc3BhY2VzKCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZWxlbWVudDtcclxuXHR9LFxyXG5cdHdyaXRlRW5kRWxlbWVudCA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXMucG9wKCk7XHJcblx0fSxcclxuXHR3cml0ZUNoYXJhY3RlcnMgOiBmdW5jdGlvbih0ZXh0KSB7XHJcblx0XHR2YXIgbm9kZTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzRnVuY3Rpb24odGhpcy5kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSkpXHR7XHJcblx0XHRcdG5vZGUgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRleHQpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy54bWxkb20pIHtcclxuXHRcdFx0bm9kZSA9IHRoaXMueG1sZG9tLmNyZWF0ZVRleHROb2RlKHRleHQpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGNyZWF0ZSBhIHRleHQgbm9kZS5cIik7XHJcblx0XHR9XHJcblx0XHR0aGlzLnBlZWsoKS5hcHBlbmRDaGlsZChub2RlKTtcclxuXHRcdHJldHVybiBub2RlO1xyXG5cclxuXHR9LFxyXG5cdHdyaXRlQ2RhdGEgOiBmdW5jdGlvbih0ZXh0KSB7XHJcblx0XHR2YXIgcGFydHMgPSB0ZXh0LnNwbGl0KCddXT4nKTtcclxuXHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBwYXJ0cy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0aWYgKGluZGV4ICsgMSA8IHBhcnRzLmxlbmd0aCkge1xyXG5cdFx0XHRcdHBhcnRzW2luZGV4XSA9IHBhcnRzW2luZGV4XSArICddXSc7XHJcblx0XHRcdFx0cGFydHNbaW5kZXggKyAxXSA9ICc+JyArIHBhcnRzW2luZGV4ICsgMV07XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHZhciBub2RlO1xyXG5cdFx0Zm9yICh2YXIgam5kZXggPSAwOyBqbmRleCA8IHBhcnRzLmxlbmd0aDsgam5kZXggKyspIHtcclxuXHRcdFx0bm9kZSA9IHRoaXMud3JpdGVDZGF0YVdpdGhvdXRDZGVuZChwYXJ0c1tqbmRleF0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG5vZGU7XHJcblx0fSxcclxuXHR3cml0ZUNkYXRhV2l0aG91dENkZW5kIDogZnVuY3Rpb24odGV4dCkge1xyXG5cdFx0dmFyIG5vZGU7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc0Z1bmN0aW9uKHRoaXMuZG9jdW1lbnQuY3JlYXRlQ0RBVEFTZWN0aW9uKSlcdHtcclxuXHRcdFx0bm9kZSA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlQ0RBVEFTZWN0aW9uKHRleHQpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZSBpZiAodGhpcy54bWxkb20pIHtcclxuXHRcdFx0bm9kZSA9IHRoaXMueG1sZG9tLmNyZWF0ZUNEQVRBU2VjdGlvbih0ZXh0KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCBjcmVhdGUgYSBDREFUQSBzZWN0aW9uIG5vZGUuXCIpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5wZWVrKCkuYXBwZW5kQ2hpbGQobm9kZSk7XHJcblx0XHRyZXR1cm4gbm9kZTtcclxuXHR9LFxyXG5cdHdyaXRlQXR0cmlidXRlIDogZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodmFsdWUpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChuYW1lKTtcclxuXHRcdHZhciBsb2NhbFBhcnQgPSBuYW1lLmxvY2FsUGFydCB8fCBuYW1lLmxwIHx8IG51bGw7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKGxvY2FsUGFydCk7XHJcblx0XHR2YXIgbnMgPSBuYW1lLm5hbWVzcGFjZVVSSSB8fCBuYW1lLm5zIHx8IG51bGw7XHJcblx0XHR2YXIgbmFtZXNwYWNlVVJJID0gSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhucykgPyBucyA6ICcnO1xyXG5cdFx0dmFyIHAgPSBuYW1lLnByZWZpeCB8fCBuYW1lLnAgfHwgbnVsbDtcclxuXHRcdHZhciBwcmVmaXggPSB0aGlzLmdldFByZWZpeChuYW1lc3BhY2VVUkksIHApO1xyXG5cclxuXHRcdHZhciBxdWFsaWZpZWROYW1lID0gKCFwcmVmaXggPyBsb2NhbFBhcnQgOiBwcmVmaXggKyAnOicgKyBsb2NhbFBhcnQpO1xyXG5cclxuXHRcdHZhciBub2RlID0gdGhpcy5wZWVrKCk7XHJcblxyXG5cdFx0aWYgKG5hbWVzcGFjZVVSSSA9PT0gJycpIHtcclxuXHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUocXVhbGlmaWVkTmFtZSwgdmFsdWUpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKG5vZGUuc2V0QXR0cmlidXRlTlMpIHtcclxuXHRcdFx0XHRub2RlLnNldEF0dHJpYnV0ZU5TKG5hbWVzcGFjZVVSSSwgcXVhbGlmaWVkTmFtZSwgdmFsdWUpO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmICh0aGlzLnhtbGRvbSkge1xyXG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZSA9IHRoaXMuZG9jdW1lbnQuY3JlYXRlTm9kZSgyLCBxdWFsaWZpZWROYW1lLCBuYW1lc3BhY2VVUkkpO1xyXG5cdFx0XHRcdFx0YXR0cmlidXRlLm5vZGVWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGVOb2RlKGF0dHJpYnV0ZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2UgaWYgKG5hbWVzcGFjZVVSSSA9PT0gSnNvbml4LlhNTC5YTUxOU19OUylcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQvLyBYTUxOUyBuYW1lc3BhY2UgbWF5IGJlIHByb2Nlc3NlZCB1bnF1YWxpZmllZFxyXG5cdFx0XHRcdFx0bm9kZS5zZXRBdHRyaWJ1dGUocXVhbGlmaWVkTmFtZSwgdmFsdWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIFtzZXRBdHRyaWJ1dGVOU10gbWV0aG9kIGlzIG5vdCBpbXBsZW1lbnRlZFwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5kZWNsYXJlTmFtZXNwYWNlKG5hbWVzcGFjZVVSSSwgcHJlZml4KTtcclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHR3cml0ZU5vZGUgOiBmdW5jdGlvbihub2RlKSB7XHJcblx0XHR2YXIgaW1wb3J0ZWROb2RlO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMuZG9jdW1lbnQuaW1wb3J0Tm9kZSkpIHtcclxuXHRcdFx0aW1wb3J0ZWROb2RlID0gdGhpcy5kb2N1bWVudC5pbXBvcnROb2RlKG5vZGUsIHRydWUpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aW1wb3J0ZWROb2RlID0gbm9kZTtcclxuXHRcdH1cclxuXHRcdHRoaXMucGVlaygpLmFwcGVuZENoaWxkKGltcG9ydGVkTm9kZSk7XHJcblx0XHRyZXR1cm4gaW1wb3J0ZWROb2RlO1xyXG5cdH0sXHJcblx0cHVzaCA6IGZ1bmN0aW9uKG5vZGUpIHtcclxuXHRcdHRoaXMubm9kZXMucHVzaChub2RlKTtcclxuXHRcdHRoaXMucHVzaE5TKCk7XHJcblx0XHRyZXR1cm4gbm9kZTtcclxuXHR9LFxyXG5cdHBlZWsgOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLm5vZGVzW3RoaXMubm9kZXMubGVuZ3RoIC0gMV07XHJcblx0fSxcclxuXHRwb3AgOiBmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMucG9wTlMoKTtcclxuXHRcdHZhciByZXN1bHQgPSB0aGlzLm5vZGVzLnBvcCgpO1xyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdHB1c2hOUyA6IGZ1bmN0aW9uICgpXHJcblx0e1xyXG5cdFx0dmFyIG5pbmRleCA9IHRoaXMubnNwLmxlbmd0aCAtIDE7XHJcblx0XHR2YXIgcGluZGV4ID0gdGhpcy5wbnMubGVuZ3RoIC0gMTtcclxuXHRcdHZhciBwYXJlbnROc3BJdGVtID0gdGhpcy5uc3BbbmluZGV4XTtcclxuXHRcdHZhciBwYXJlbnRQbnNJdGVtID0gdGhpcy5wbnNbcGluZGV4XTtcclxuXHRcdHZhciBuc3BJdGVtID0gSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChwYXJlbnROc3BJdGVtKSA/IG5pbmRleCA6IHBhcmVudE5zcEl0ZW07XHJcblx0XHR2YXIgcG5zSXRlbSA9IEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QocGFyZW50UG5zSXRlbSkgPyBwaW5kZXggOiBwYXJlbnRQbnNJdGVtO1xyXG5cdFx0dGhpcy5uc3AucHVzaChuc3BJdGVtKTtcclxuXHRcdHRoaXMucG5zLnB1c2gocG5zSXRlbSk7XHJcblx0fSxcclxuXHRwb3BOUyA6IGZ1bmN0aW9uICgpXHJcblx0e1xyXG5cdFx0dGhpcy5uc3AucG9wKCk7XHJcblx0XHR0aGlzLnBucy5wb3AoKTtcclxuXHR9LFxyXG5cdGRlY2xhcmVOYW1lc3BhY2VzIDogZnVuY3Rpb24gKClcclxuXHR7XHJcblx0XHR2YXIgaW5kZXggPSB0aGlzLm5zcC5sZW5ndGggLSAxO1xyXG5cdFx0dmFyIG5zcEl0ZW0gPSB0aGlzLm5zcFtpbmRleF07XHJcblx0XHRuc3BJdGVtID0gSnNvbml4LlV0aWwuVHlwZS5pc051bWJlcihuc3BJdGVtKSA/IHRoaXMubnNwW25zcEl0ZW1dIDogbnNwSXRlbTtcclxuXHRcdHZhciBucywgcDtcclxuXHRcdGZvciAobnMgaW4gbnNwSXRlbSlcclxuXHRcdHtcclxuXHRcdFx0aWYgKG5zcEl0ZW0uaGFzT3duUHJvcGVydHkobnMpKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0cCA9IG5zcEl0ZW1bbnNdO1xyXG5cdFx0XHRcdHRoaXMuZGVjbGFyZU5hbWVzcGFjZShucywgcCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGRlY2xhcmVOYW1lc3BhY2UgOiBmdW5jdGlvbiAobnMsIHApXHJcblx0e1xyXG5cdFx0dmFyIGluZGV4ID0gdGhpcy5wbnMubGVuZ3RoIC0gMTtcclxuXHRcdHZhciBwbnNJdGVtID0gdGhpcy5wbnNbaW5kZXhdO1xyXG5cdFx0dmFyIHJlZmVyZW5jZTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKHBuc0l0ZW0pKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBSZXNvbHZlIHRoZSByZWZlcmVuY2VcclxuXHRcdFx0cmVmZXJlbmNlID0gdHJ1ZTtcclxuXHRcdFx0cG5zSXRlbSA9IHRoaXMucG5zW3Buc0l0ZW1dO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHRyZWZlcmVuY2UgPSBmYWxzZTtcclxuXHRcdH1cclxuXHRcdC8vIElmIHRoaXMgcHJlZml4IGlzIG1hcHBlZCB0byBhIGRpZmZlcmVudCBuYW1lc3BhY2UgYW5kIG11c3QgYmUgcmVkZWNsYXJlZFxyXG5cdFx0aWYgKHBuc0l0ZW1bcF0gIT09IG5zKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAocCA9PT0gJycpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aGlzLndyaXRlQXR0cmlidXRlKHtscCA6IEpzb25peC5YTUwuWE1MTlNfUH0sIG5zKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aGlzLndyaXRlQXR0cmlidXRlKHtucyA6IEpzb25peC5YTUwuWE1MTlNfTlMsIGxwIDogcCwgcCA6IEpzb25peC5YTUwuWE1MTlNfUH0sIG5zKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAocmVmZXJlbmNlKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Ly8gSWYgdGhpcyB3YXMgYSByZWZlcmVuY2UsIGNsb25lIGl0IGFuZCByZXBsYWNlIHRoZSByZWZlcmVuY2VcclxuXHRcdFx0XHRwbnNJdGVtID0gSnNvbml4LlV0aWwuVHlwZS5jbG9uZU9iamVjdChwbnNJdGVtLCB7fSk7XHJcblx0XHRcdFx0dGhpcy5wbnNbaW5kZXhdID0gcG5zSXRlbTtcclxuXHRcdFx0fVxyXG5cdFx0XHRwbnNJdGVtW3BdID0gbnM7XHJcblx0XHR9XHJcblx0fSxcclxuXHRnZXRQcmVmaXggOiBmdW5jdGlvbiAobnMsIHApXHJcblx0e1xyXG5cdFx0dmFyIGluZGV4ID0gdGhpcy5uc3AubGVuZ3RoIC0gMTtcclxuXHRcdHZhciBuc3BJdGVtID0gdGhpcy5uc3BbaW5kZXhdO1xyXG5cdFx0dmFyIHJlZmVyZW5jZTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKG5zcEl0ZW0pKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBUaGlzIGlzIGEgcmVmZXJlbmNlLCB0aGUgaXRlbSBpcyB0aGUgaW5kZXggb2YgdGhlIHBhcmVudCBpdGVtXHJcblx0XHRcdHJlZmVyZW5jZSA9IHRydWU7XHJcblx0XHRcdG5zcEl0ZW0gPSB0aGlzLm5zcFtuc3BJdGVtXTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0cmVmZXJlbmNlID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhwKSlcclxuXHRcdHtcclxuXHRcdFx0dmFyIG9sZHAgPSBuc3BJdGVtW25zXTtcclxuXHRcdFx0Ly8gSWYgcHJlZml4IGlzIGFscmVhZHkgZGVjbGFyZWQgYW5kIGVxdWFscyB0aGUgcHJvcG9zZWQgcHJlZml4XHJcblx0XHRcdGlmIChwID09PSBvbGRwKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Ly8gTm90aGluZyB0byBkb1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdC8vIElmIHRoaXMgd2FzIGEgcmVmZXJlbmNlLCB3ZSBoYXZlIHRvIGNsb25lIGl0IG5vd1xyXG5cdFx0XHRcdGlmIChyZWZlcmVuY2UpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bnNwSXRlbSA9IEpzb25peC5VdGlsLlR5cGUuY2xvbmVPYmplY3QobnNwSXRlbSwge30pO1xyXG5cdFx0XHRcdFx0dGhpcy5uc3BbaW5kZXhdID0gbnNwSXRlbTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0bnNwSXRlbVtuc10gPSBwO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHAgPSBuc3BJdGVtW25zXTtcclxuXHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhwKSkge1xyXG5cdFx0XHRcdHAgPSAncCcgKyAodGhpcy5uYW1lc3BhY2VQcmVmaXhJbmRleCsrKTtcclxuXHRcdFx0XHQvLyBJZiB0aGlzIHdhcyBhIHJlZmVyZW5jZSwgd2UgaGF2ZSB0byBjbG9uZSBpdCBub3dcclxuXHRcdFx0XHRpZiAocmVmZXJlbmNlKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdG5zcEl0ZW0gPSBKc29uaXguVXRpbC5UeXBlLmNsb25lT2JqZWN0KG5zcEl0ZW0sIHt9KTtcclxuXHRcdFx0XHRcdHRoaXMubnNwW2luZGV4XSA9IG5zcEl0ZW07XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdG5zcEl0ZW1bbnNdID0gcDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHA7XHJcblx0fSxcclxuXHRnZXROYW1lc3BhY2VVUkkgOiBmdW5jdGlvbiAocCkge1xyXG5cdFx0dmFyIHBpbmRleCA9IHRoaXMucG5zLmxlbmd0aCAtIDE7XHJcblx0XHR2YXIgcG5zSXRlbSA9IHRoaXMucG5zW3BpbmRleF07XHJcblx0XHRwbnNJdGVtID0gSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChwbnNJdGVtKSA/IHBuc0l0ZW0gOiB0aGlzLnBuc1twbnNJdGVtXTtcclxuXHRcdHJldHVybiBwbnNJdGVtW3BdO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6IFwiSnNvbml4LlhNTC5PdXRwdXRcIlxyXG59KTtcclxuXHJcbkpzb25peC5NYXBwaW5nID0ge307XHJcbkpzb25peC5NYXBwaW5nLlN0eWxlID0gSnNvbml4LkNsYXNzKHtcclxuXHRtYXJzaGFsbGVyIDogbnVsbCxcclxuXHR1bm1hcnNoYWxsZXIgOiBudWxsLFxyXG5cdG1vZHVsZSA6IG51bGwsXHJcblx0ZWxlbWVudEluZm8gOiBudWxsLFxyXG5cdGNsYXNzSW5mbyA6IG51bGwsXHJcblx0ZW51bUxlYWZJbmZvIDogbnVsbCxcclxuXHRhbnlBdHRyaWJ1dGVQcm9wZXJ0eUluZm8gOiBudWxsLFxyXG5cdGFueUVsZW1lbnRQcm9wZXJ0eUluZm8gOiBudWxsLFxyXG5cdGF0dHJpYnV0ZVByb3BlcnR5SW5mbyA6IG51bGwsXHJcblx0ZWxlbWVudE1hcFByb3BlcnR5SW5mbyA6IG51bGwsXHJcblx0ZWxlbWVudFByb3BlcnR5SW5mbyA6IG51bGwsXHJcblx0ZWxlbWVudHNQcm9wZXJ0eUluZm8gOiBudWxsLFxyXG5cdGVsZW1lbnRSZWZQcm9wZXJ0eUluZm8gOiBudWxsLFxyXG5cdGVsZW1lbnRSZWZzUHJvcGVydHlJbmZvIDogbnVsbCxcclxuXHR2YWx1ZVByb3BlcnR5SW5mbyA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTWFwcGluZy5TdHlsZSdcclxufSk7XHJcblxyXG5Kc29uaXguTWFwcGluZy5TdHlsZS5TVFlMRVMgPSB7fTtcclxuSnNvbml4Lk1hcHBpbmcuU3R5bGVkID0gSnNvbml4LkNsYXNzKHtcclxuXHRtYXBwaW5nU3R5bGUgOiBudWxsLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihvcHRpb25zKSB7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMob3B0aW9ucykpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChvcHRpb25zKTtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcob3B0aW9ucy5tYXBwaW5nU3R5bGUpKSB7XHJcblx0XHRcdFx0dmFyIG1hcHBpbmdTdHlsZSA9IEpzb25peC5NYXBwaW5nLlN0eWxlLlNUWUxFU1tvcHRpb25zLm1hcHBpbmdTdHlsZV07XHJcblx0XHRcdFx0aWYgKCFtYXBwaW5nU3R5bGUpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIk1hcHBpbmcgc3R5bGUgW1wiICsgb3B0aW9ucy5tYXBwaW5nU3R5bGUgKyBcIl0gaXMgbm90IGtub3duLlwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0dGhpcy5tYXBwaW5nU3R5bGUgPSBtYXBwaW5nU3R5bGU7XHJcblx0XHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChvcHRpb25zLm1hcHBpbmdTdHlsZSkpIHtcclxuXHRcdFx0XHR0aGlzLm1hcHBpbmdTdHlsZSA9IG9wdGlvbnMubWFwcGluZ1N0eWxlO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRpZiAoIXRoaXMubWFwcGluZ1N0eWxlKSB7XHJcblx0XHRcdHRoaXMubWFwcGluZ1N0eWxlID0gSnNvbml4Lk1hcHBpbmcuU3R5bGUuU1RZTEVTLnN0YW5kYXJkO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTWFwcGluZy5TdHlsZWQnXHJcbn0pO1xyXG5Kc29uaXguQmluZGluZyA9IHt9O1xyXG5Kc29uaXguQmluZGluZy5NYXJzaGFsbHMgPSB7XHJcbn07XHJcblxyXG5Kc29uaXguQmluZGluZy5NYXJzaGFsbHMuRWxlbWVudCA9IEpzb25peC5DbGFzcyh7XHJcblx0bWFyc2hhbEVsZW1lbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIGVsZW1lbnRWYWx1ZSA9IHRoaXMuY29udmVydFRvVHlwZWROYW1lZFZhbHVlKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdHZhciBkZWNsYXJlZFR5cGVJbmZvID0gZWxlbWVudFZhbHVlLnR5cGVJbmZvO1xyXG5cdFx0dmFyIGFjdHVhbFR5cGVJbmZvID0gdW5kZWZpbmVkO1xyXG5cdFx0aWYgKGNvbnRleHQuc3VwcG9ydFhzaVR5cGUgJiYgSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZWxlbWVudFZhbHVlLnZhbHVlKSlcclxuXHRcdHtcclxuXHRcdFx0dmFyIHR5cGVJbmZvQnlWYWx1ZSA9IGNvbnRleHQuZ2V0VHlwZUluZm9CeVZhbHVlKGVsZW1lbnRWYWx1ZS52YWx1ZSk7XHJcblx0XHRcdGlmICh0eXBlSW5mb0J5VmFsdWUgJiYgdHlwZUluZm9CeVZhbHVlLnR5cGVOYW1lKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0YWN0dWFsVHlwZUluZm8gPSB0eXBlSW5mb0J5VmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHZhciB0eXBlSW5mbyA9IGFjdHVhbFR5cGVJbmZvIHx8IGRlY2xhcmVkVHlwZUluZm87XHJcblx0XHRpZiAodHlwZUluZm8pIHtcclxuXHRcdFx0b3V0cHV0LndyaXRlU3RhcnRFbGVtZW50KGVsZW1lbnRWYWx1ZS5uYW1lKTtcclxuXHRcdFx0aWYgKGFjdHVhbFR5cGVJbmZvICYmIGRlY2xhcmVkVHlwZUluZm8gIT09IGFjdHVhbFR5cGVJbmZvKSB7XHJcblx0XHRcdFx0dmFyIHhzaVR5cGVOYW1lID0gYWN0dWFsVHlwZUluZm8udHlwZU5hbWU7XHJcblx0XHRcdFx0dmFyIHhzaVR5cGUgPSBKc29uaXguU2NoZW1hLlhTRC5RTmFtZS5JTlNUQU5DRS5wcmludCh4c2lUeXBlTmFtZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHRcdFx0b3V0cHV0LndyaXRlQXR0cmlidXRlKEpzb25peC5TY2hlbWEuWFNJLlRZUEVfUU5BTUUsIHhzaVR5cGUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhlbGVtZW50VmFsdWUudmFsdWUpKSB7XHJcblx0XHRcdFx0dHlwZUluZm8ubWFyc2hhbChlbGVtZW50VmFsdWUudmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0XHR9XHJcblx0XHRcdG91dHB1dC53cml0ZUVuZEVsZW1lbnQoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgW1wiICsgZWxlbWVudFZhbHVlLm5hbWUua2V5ICsgXCJdIGlzIG5vdCBrbm93biBpbiB0aGlzIGNvbnRleHQsIGNvdWxkIG5vdCBkZXRlcm1pbmUgaXRzIHR5cGUuXCIpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0VHlwZUluZm9CeUVsZW1lbnROYW1lIDogZnVuY3Rpb24obmFtZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHZhciBlbGVtZW50SW5mbyA9IGNvbnRleHQuZ2V0RWxlbWVudEluZm8obmFtZSwgc2NvcGUpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGVsZW1lbnRJbmZvKSkge1xyXG5cdFx0XHRyZXR1cm4gZWxlbWVudEluZm8udHlwZUluZm87XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdFx0fVxyXG5cdH1cclxufSk7XHJcbkpzb25peC5CaW5kaW5nLk1hcnNoYWxscy5FbGVtZW50LkFzRWxlbWVudFJlZiA9IEpzb25peC5DbGFzcyh7XHJcblx0Y29udmVydFRvVHlwZWROYW1lZFZhbHVlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUpO1xyXG5cdFx0dmFyIGVsZW1lbnRWYWx1ZSA9IHRoaXMuY29udmVydFRvTmFtZWRWYWx1ZSh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuYW1lIDogZWxlbWVudFZhbHVlLm5hbWUsXHJcblx0XHRcdHZhbHVlIDogZWxlbWVudFZhbHVlLnZhbHVlLFxyXG5cdFx0XHR0eXBlSW5mbyA6IHRoaXMuZ2V0VHlwZUluZm9CeUVsZW1lbnROYW1lKGVsZW1lbnRWYWx1ZS5uYW1lLCBjb250ZXh0LCBzY29wZSlcclxuXHRcdH07XHJcblx0fSxcclxuXHRjb252ZXJ0VG9OYW1lZFZhbHVlIDogZnVuY3Rpb24oZWxlbWVudFZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgbmFtZTtcclxuXHRcdHZhciB2YWx1ZTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhlbGVtZW50VmFsdWUubmFtZSkgJiYgIUpzb25peC5VdGlsLlR5cGUuaXNVbmRlZmluZWQoZWxlbWVudFZhbHVlLnZhbHVlKSkge1xyXG5cdFx0XHRuYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0T3JTdHJpbmcoZWxlbWVudFZhbHVlLm5hbWUsIGNvbnRleHQpO1xyXG5cdFx0XHR2YWx1ZSA9IEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGVsZW1lbnRWYWx1ZS52YWx1ZSkgPyBlbGVtZW50VmFsdWUudmFsdWUgOiBudWxsO1xyXG5cdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdG5hbWUgOiBuYW1lLFxyXG5cdFx0XHRcdHZhbHVlIDogdmFsdWVcclxuXHRcdFx0fTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGZvciAoIHZhciBwcm9wZXJ0eU5hbWUgaW4gZWxlbWVudFZhbHVlKSB7XHJcblx0XHRcdFx0aWYgKGVsZW1lbnRWYWx1ZS5oYXNPd25Qcm9wZXJ0eShwcm9wZXJ0eU5hbWUpKSB7XHJcblx0XHRcdFx0XHRuYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0T3JTdHJpbmcocHJvcGVydHlOYW1lLCBjb250ZXh0KTtcclxuXHRcdFx0XHRcdHZhbHVlID0gZWxlbWVudFZhbHVlW3Byb3BlcnR5TmFtZV07XHJcblx0XHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0XHRuYW1lIDogbmFtZSxcclxuXHRcdFx0XHRcdFx0dmFsdWUgOiB2YWx1ZVxyXG5cdFx0XHRcdFx0fTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgZWxlbWVudCB2YWx1ZSBbXCIgKyBlbGVtZW50VmFsdWUgKyBcIl0uIEVsZW1lbnQgdmFsdWVzIG11c3QgZWl0aGVyIGhhdmUge25hbWU6J215RWxlbWVudE5hbWUnLCB2YWx1ZTogZWxlbWVudFZhbHVlfSBvciB7bXlFbGVtZW50TmFtZTplbGVtZW50VmFsdWV9IHN0cnVjdHVyZS5cIik7XHJcblx0fVxyXG59KTtcclxuXHJcbkpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxzID0ge307XHJcblxyXG5Kc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5XcmFwcGVyRWxlbWVudCA9IEpzb25peC5DbGFzcyh7XHJcblx0bWl4ZWQgOiBmYWxzZSxcclxuXHR1bm1hcnNoYWxXcmFwcGVyRWxlbWVudCA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0LCBzY29wZSwgY2FsbGJhY2spIHtcclxuXHRcdHZhciBldCA9IGlucHV0Lm5leHQoKTtcclxuXHRcdHdoaWxlIChldCAhPT0gSnNvbml4LlhNTC5JbnB1dC5FTkRfRUxFTUVOVCkge1xyXG5cdFx0XHRpZiAoZXQgPT09IEpzb25peC5YTUwuSW5wdXQuU1RBUlRfRUxFTUVOVCkge1xyXG5cdFx0XHRcdHRoaXMudW5tYXJzaGFsRWxlbWVudChjb250ZXh0LCBpbnB1dCwgc2NvcGUsIGNhbGxiYWNrKTtcclxuXHRcdFx0fSBlbHNlXHJcblx0XHRcdC8vIENoYXJhY3RlcnNcclxuXHRcdFx0aWYgKHRoaXMubWl4ZWQgJiYgKGV0ID09PSBKc29uaXguWE1MLklucHV0LkNIQVJBQ1RFUlMgfHwgZXQgPT09IEpzb25peC5YTUwuSW5wdXQuQ0RBVEEgfHwgZXQgPT09IEpzb25peC5YTUwuSW5wdXQuRU5USVRZX1JFRkVSRU5DRSkpIHtcclxuXHRcdFx0XHRjYWxsYmFjayhpbnB1dC5nZXRUZXh0KCkpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKGV0ID09PSBKc29uaXguWE1MLklucHV0LlNQQUNFIHx8IGV0ID09PSBKc29uaXguWE1MLklucHV0LkNPTU1FTlQgfHwgZXQgPT09IEpzb25peC5YTUwuSW5wdXQuUFJPQ0VTU0lOR19JTlNUUlVDVElPTikge1xyXG5cdFx0XHRcdC8vIFNraXAgd2hpdGVzcGFjZVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgc3RhdGU6IHVuZXhwZWN0ZWQgZXZlbnQgdHlwZSBbXCIgKyBldCArIFwiXS5cIik7XHJcblx0XHRcdH1cclxuXHRcdFx0ZXQgPSBpbnB1dC5uZXh0KCk7XHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuXHJcbkpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxzLkVsZW1lbnQgPSBKc29uaXguQ2xhc3Moe1xyXG5cdGFsbG93VHlwZWRPYmplY3QgOiB0cnVlLFxyXG5cdGFsbG93RG9tIDogZmFsc2UsXHJcblx0dW5tYXJzaGFsRWxlbWVudCA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0LCBzY29wZSwgY2FsbGJhY2spIHtcclxuXHRcdGlmIChpbnB1dC5ldmVudFR5cGUgIT0gMSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJQYXJzZXIgbXVzdCBiZSBvbiBTVEFSVF9FTEVNRU5UIHRvIHJlYWQgbmV4dCBlbGVtZW50LlwiKTtcclxuXHRcdH1cclxuXHRcdHZhciB0eXBlSW5mbyA9IHRoaXMuZ2V0VHlwZUluZm9CeUlucHV0RWxlbWVudChjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0dmFyIG5hbWUgPSBpbnB1dC5nZXROYW1lKCk7XHJcblx0XHR2YXIgZWxlbWVudFZhbHVlO1xyXG5cdFx0aWYgKHRoaXMuYWxsb3dUeXBlZE9iamVjdCkge1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModHlwZUluZm8pKSB7XHJcblx0XHRcdFx0dmFyIHZhbHVlID0gdHlwZUluZm8udW5tYXJzaGFsKGNvbnRleHQsIGlucHV0LCBzY29wZSk7XHJcblx0XHRcdFx0dmFyIHR5cGVkTmFtZWRWYWx1ZSA9IHtcclxuXHRcdFx0XHRcdG5hbWUgOiBuYW1lLFxyXG5cdFx0XHRcdFx0dmFsdWUgOiB2YWx1ZSxcclxuXHRcdFx0XHRcdHR5cGVJbmZvIDogdHlwZUluZm9cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGVsZW1lbnRWYWx1ZSA9IHRoaXMuY29udmVydEZyb21UeXBlZE5hbWVkVmFsdWUodHlwZWROYW1lZFZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHRoaXMuYWxsb3dEb20pIHtcclxuXHRcdFx0XHRlbGVtZW50VmFsdWUgPSBpbnB1dC5nZXRFbGVtZW50KCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBbXCIgKyBuYW1lLnRvU3RyaW5nKCkgKyBcIl0gY291bGQgbm90IGJlIHVubWFyc2hhbGxlZCBhcyBpcyBub3Qga25vd24gaW4gdGhpcyBjb250ZXh0IGFuZCB0aGUgcHJvcGVydHkgZG9lcyBub3QgYWxsb3cgRE9NIGNvbnRlbnQuXCIpO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2UgaWYgKHRoaXMuYWxsb3dEb20pIHtcclxuXHRcdFx0ZWxlbWVudFZhbHVlID0gaW5wdXQuZ2V0RWxlbWVudCgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRWxlbWVudCBbXCIgKyBuYW1lLnRvU3RyaW5nKCkgKyBcIl0gY291bGQgbm90IGJlIHVubWFyc2hhbGxlZCBhcyB0aGUgcHJvcGVydHkgbmVpdGhlciBhbGxvd3MgdHlwZWQgb2JqZWN0cyBub3IgRE9NIGFzIGNvbnRlbnQuIFRoaXMgaXMgYSBzaWduIG9mIGludmFsaWQgbWFwcGluZ3MsIGRvIG5vdCB1c2UgW2FsbG93VHlwZWRPYmplY3QgOiBmYWxzZV0gYW5kIFthbGxvd0RvbSA6IGZhbHNlXSBhdCB0aGUgc2FtZSB0aW1lLlwiKTtcclxuXHRcdH1cclxuXHRcdGNhbGxiYWNrKGVsZW1lbnRWYWx1ZSk7XHJcblx0fSxcclxuXHRnZXRUeXBlSW5mb0J5SW5wdXRFbGVtZW50IDogZnVuY3Rpb24oY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgeHNpVHlwZUluZm8gPSBudWxsO1xyXG5cdFx0aWYgKGNvbnRleHQuc3VwcG9ydFhzaVR5cGUpIHtcclxuXHRcdFx0dmFyIHhzaVR5cGUgPSBpbnB1dC5nZXRBdHRyaWJ1dGVWYWx1ZU5TKEpzb25peC5TY2hlbWEuWFNJLk5BTUVTUEFDRV9VUkksIEpzb25peC5TY2hlbWEuWFNJLlRZUEUpO1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuU3RyaW5nVXRpbHMuaXNOb3RCbGFuayh4c2lUeXBlKSkge1xyXG5cdFx0XHRcdHZhciB4c2lUeXBlTmFtZSA9IEpzb25peC5TY2hlbWEuWFNELlFOYW1lLklOU1RBTkNFLnBhcnNlKHhzaVR5cGUsIGNvbnRleHQsIGlucHV0LCBzY29wZSk7XHJcblx0XHRcdFx0eHNpVHlwZUluZm8gPSBjb250ZXh0LmdldFR5cGVJbmZvQnlUeXBlTmFtZUtleSh4c2lUeXBlTmFtZS5rZXkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgbmFtZSA9IGlucHV0LmdldE5hbWUoKTtcclxuXHRcdHZhciB0eXBlSW5mbyA9IHhzaVR5cGVJbmZvID8geHNpVHlwZUluZm8gOiB0aGlzLmdldFR5cGVJbmZvQnlFbGVtZW50TmFtZShuYW1lLCBjb250ZXh0LCBzY29wZSk7XHJcblx0XHRyZXR1cm4gdHlwZUluZm87XHJcblx0fSxcclxuXHRnZXRUeXBlSW5mb0J5RWxlbWVudE5hbWUgOiBmdW5jdGlvbihuYW1lLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0dmFyIGVsZW1lbnRJbmZvID0gY29udGV4dC5nZXRFbGVtZW50SW5mbyhuYW1lLCBzY29wZSk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZWxlbWVudEluZm8pKSB7XHJcblx0XHRcdHJldHVybiBlbGVtZW50SW5mby50eXBlSW5mbztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0XHR9XHJcblx0fVxyXG59KTtcclxuXHJcbkpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxzLkVsZW1lbnQuQXNFbGVtZW50UmVmID0gSnNvbml4LkNsYXNzKHtcclxuXHRjb252ZXJ0RnJvbVR5cGVkTmFtZWRWYWx1ZSA6IGZ1bmN0aW9uKHR5cGVkTmFtZWRWYWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuYW1lIDogdHlwZWROYW1lZFZhbHVlLm5hbWUsXHJcblx0XHRcdHZhbHVlIDogdHlwZWROYW1lZFZhbHVlLnZhbHVlXHJcblx0XHR9O1xyXG5cdH1cclxufSk7XHJcblxyXG5Kc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50LkFzU2ltcGxpZmllZEVsZW1lbnRSZWYgPSBKc29uaXguQ2xhc3Moe1xyXG5cdGNvbnZlcnRGcm9tVHlwZWROYW1lZFZhbHVlIDogZnVuY3Rpb24odHlwZWROYW1lZFZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciBwcm9wZXJ0eU5hbWUgPSB0eXBlZE5hbWVkVmFsdWUubmFtZS50b0Nhbm9uaWNhbFN0cmluZyhjb250ZXh0KTtcclxuXHRcdHZhciB2YWx1ZSA9IHt9O1xyXG5cdFx0dmFsdWVbcHJvcGVydHlOYW1lXSA9IHR5cGVkTmFtZWRWYWx1ZS52YWx1ZTtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9XHJcbn0pO1xyXG5Kc29uaXguQmluZGluZy5NYXJzaGFsbGVyID0gSnNvbml4LkNsYXNzKEpzb25peC5CaW5kaW5nLk1hcnNoYWxscy5FbGVtZW50LCBKc29uaXguQmluZGluZy5NYXJzaGFsbHMuRWxlbWVudC5Bc0VsZW1lbnRSZWYsIHtcclxuXHRjb250ZXh0IDogbnVsbCxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChjb250ZXh0KTtcclxuXHRcdHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XHJcblx0fSxcclxuXHRtYXJzaGFsU3RyaW5nIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHZhciBkb2MgPSB0aGlzLm1hcnNoYWxEb2N1bWVudCh2YWx1ZSk7XHJcblx0XHR2YXIgdGV4dCA9IEpzb25peC5ET00uc2VyaWFsaXplKGRvYyk7XHJcblx0XHRyZXR1cm4gdGV4dDtcclxuXHR9LFxyXG5cdG1hcnNoYWxEb2N1bWVudCA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHR2YXIgb3V0cHV0ID0gbmV3IEpzb25peC5YTUwuT3V0cHV0KHtcclxuXHRcdFx0bmFtZXNwYWNlUHJlZml4ZXMgOiB0aGlzLmNvbnRleHQubmFtZXNwYWNlUHJlZml4ZXNcclxuXHRcdH0pO1xyXG5cclxuXHRcdHZhciBkb2MgPSBvdXRwdXQud3JpdGVTdGFydERvY3VtZW50KCk7XHJcblx0XHR0aGlzLm1hcnNoYWxFbGVtZW50KHZhbHVlLCB0aGlzLmNvbnRleHQsIG91dHB1dCwgdW5kZWZpbmVkKTtcclxuXHRcdG91dHB1dC53cml0ZUVuZERvY3VtZW50KCk7XHJcblx0XHRyZXR1cm4gZG9jO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguQmluZGluZy5NYXJzaGFsbGVyJ1xyXG59KTtcclxuSnNvbml4LkJpbmRpbmcuTWFyc2hhbGxlci5TaW1wbGlmaWVkID0gSnNvbml4LkNsYXNzKEpzb25peC5CaW5kaW5nLk1hcnNoYWxsZXIsIHtcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5CaW5kaW5nLk1hcnNoYWxsZXIuU2ltcGxpZmllZCdcclxufSk7XHJcbkpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxlciA9IEpzb25peC5DbGFzcyhKc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50LCBKc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50LkFzRWxlbWVudFJlZiwge1xyXG5cdGNvbnRleHQgOiBudWxsLFxyXG5cdGFsbG93VHlwZWRPYmplY3QgOiB0cnVlLFxyXG5cdGFsbG93RG9tIDogZmFsc2UsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QoY29udGV4dCk7XHJcblx0XHR0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG5cdH0sXHJcblx0dW5tYXJzaGFsU3RyaW5nIDogZnVuY3Rpb24odGV4dCkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0ZXh0KTtcclxuXHRcdHZhciBkb2MgPSBKc29uaXguRE9NLnBhcnNlKHRleHQpO1xyXG5cdFx0cmV0dXJuIHRoaXMudW5tYXJzaGFsRG9jdW1lbnQoZG9jKTtcclxuXHR9LFxyXG5cdHVubWFyc2hhbFVSTCA6IGZ1bmN0aW9uKHVybCwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodXJsKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVGdW5jdGlvbihjYWxsYmFjayk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMob3B0aW9ucykpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChvcHRpb25zKTtcclxuXHRcdH1cclxuXHRcdHRoYXQgPSB0aGlzO1xyXG5cdFx0SnNvbml4LkRPTS5sb2FkKHVybCwgZnVuY3Rpb24oZG9jKSB7XHJcblx0XHRcdGNhbGxiYWNrKHRoYXQudW5tYXJzaGFsRG9jdW1lbnQoZG9jKSk7XHJcblx0XHR9LCBvcHRpb25zKTtcclxuXHR9LFxyXG5cdHVubWFyc2hhbEZpbGUgOiBmdW5jdGlvbihmaWxlTmFtZSwgY2FsbGJhY2ssIG9wdGlvbnMpIHtcclxuXHRcdGlmICh0eXBlb2YgX2pzb25peF9mcyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRmlsZSB1bm1hcnNoYWxsaW5nIGlzIG9ubHkgYXZhaWxhYmxlIGluIGVudmlyb25tZW50cyB3aGljaCBzdXBwb3J0IGZpbGUgc3lzdGVtcy5cIik7XHJcblx0XHR9XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKGZpbGVOYW1lKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVGdW5jdGlvbihjYWxsYmFjayk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMob3B0aW9ucykpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChvcHRpb25zKTtcclxuXHRcdH1cclxuXHRcdHRoYXQgPSB0aGlzO1xyXG5cdFx0dmFyIGZzID0gX2pzb25peF9mcztcclxuXHRcdGZzLnJlYWRGaWxlKGZpbGVOYW1lLCBvcHRpb25zLCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcclxuXHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdHRocm93IGVycjtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgdGV4dCA9IGRhdGEudG9TdHJpbmcoKTtcclxuXHRcdFx0XHR2YXIgZG9jID0gSnNvbml4LkRPTS5wYXJzZSh0ZXh0KTtcclxuXHRcdFx0XHRjYWxsYmFjayh0aGF0LnVubWFyc2hhbERvY3VtZW50KGRvYykpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdHVubWFyc2hhbERvY3VtZW50IDogZnVuY3Rpb24oZG9jLCBzY29wZSkge1xyXG5cdFx0dmFyIGlucHV0ID0gbmV3IEpzb25peC5YTUwuSW5wdXQoZG9jKTtcclxuXHRcdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdFx0dmFyIGNhbGxiYWNrID0gZnVuY3Rpb24oX3Jlc3VsdCkge1xyXG5cdFx0XHRyZXN1bHQgPSBfcmVzdWx0O1xyXG5cdFx0fTtcclxuXHRcdGlucHV0Lm5leHRUYWcoKTtcclxuXHRcdHRoaXMudW5tYXJzaGFsRWxlbWVudCh0aGlzLmNvbnRleHQsIGlucHV0LCBzY29wZSwgY2FsbGJhY2spO1xyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5CaW5kaW5nLlVubWFyc2hhbGxlcidcclxufSk7XHJcbkpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxlci5TaW1wbGlmaWVkID0gSnNvbml4LkNsYXNzKEpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxlciwgSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbHMuRWxlbWVudC5Bc1NpbXBsaWZpZWRFbGVtZW50UmVmLCB7XHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguQmluZGluZy5Vbm1hcnNoYWxsZXIuU2ltcGxpZmllZCdcclxufSk7XHJcbkpzb25peC5Nb2RlbC5UeXBlSW5mbyA9IEpzb25peC5DbGFzcyh7XHJcblx0bW9kdWxlOiBudWxsLFx0XHRcdFxyXG5cdG5hbWUgOiBudWxsLFxyXG5cdGJhc2VUeXBlSW5mbyA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cdH0sXHJcblx0aXNCYXNlZE9uIDogZnVuY3Rpb24odHlwZUluZm8pIHtcclxuXHRcdHZhciBjdXJyZW50VHlwZUluZm8gPSB0aGlzO1xyXG5cdFx0d2hpbGUgKGN1cnJlbnRUeXBlSW5mbykge1xyXG5cdFx0XHRpZiAodHlwZUluZm8gPT09IGN1cnJlbnRUeXBlSW5mbykge1xyXG5cdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdGN1cnJlbnRUeXBlSW5mbyA9IGN1cnJlbnRUeXBlSW5mby5iYXNlVHlwZUluZm87XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gZmFsc2U7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5UeXBlSW5mbydcclxufSk7XHJcbkpzb25peC5Nb2RlbC5DbGFzc0luZm8gPSBKc29uaXhcclxuXHRcdC5DbGFzcyhKc29uaXguTW9kZWwuVHlwZUluZm8sIEpzb25peC5NYXBwaW5nLlN0eWxlZCwge1xyXG5cdFx0XHRuYW1lIDogbnVsbCxcclxuXHRcdFx0bG9jYWxOYW1lIDogbnVsbCxcclxuXHRcdFx0dHlwZU5hbWUgOiBudWxsLFxyXG5cdFx0XHRpbnN0YW5jZUZhY3RvcnkgOiBudWxsLFxyXG5cdFx0XHRwcm9wZXJ0aWVzIDogbnVsbCxcclxuXHRcdFx0cHJvcGVydGllc01hcCA6IG51bGwsXHJcblx0XHRcdHN0cnVjdHVyZSA6IG51bGwsXHJcblx0XHRcdHRhcmdldE5hbWVzcGFjZSA6ICcnLFxyXG5cdFx0XHRkZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSA6ICcnLFxyXG5cdFx0XHRkZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJIDogJycsXHJcblx0XHRcdGJ1aWx0IDogZmFsc2UsXHJcblx0XHRcdGluaXRpYWxpemUgOiBmdW5jdGlvbihtYXBwaW5nLCBvcHRpb25zKSB7XHJcblx0XHRcdFx0SnNvbml4Lk1vZGVsLlR5cGVJbmZvLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFtdKTtcclxuXHRcdFx0XHRKc29uaXguTWFwcGluZy5TdHlsZWQucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgW29wdGlvbnNdKTtcclxuXHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0XHRcdHZhciBuID0gbWFwcGluZy5uYW1lfHxtYXBwaW5nLm58fHVuZGVmaW5lZDtcclxuXHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKG4pO1xyXG5cdFx0XHRcdHRoaXMubmFtZSA9IG47XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIGxuID0gbWFwcGluZy5sb2NhbE5hbWV8fG1hcHBpbmcubG58fG51bGw7XHJcblx0XHRcdFx0dGhpcy5sb2NhbE5hbWUgPSBsbjtcclxuXHJcblx0XHRcdFx0dmFyIGRlbnMgPSBtYXBwaW5nLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJfHxtYXBwaW5nLmRlbnN8fG1hcHBpbmcudGFyZ2V0TmFtZXNwYWNlfHxtYXBwaW5nLnRuc3x8Jyc7XHJcblx0XHRcdFx0dGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSA9IGRlbnM7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dmFyIHRucyA9ICBtYXBwaW5nLnRhcmdldE5hbWVzcGFjZXx8bWFwcGluZy50bnN8fG1hcHBpbmcuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkl8fG1hcHBpbmcuZGVuc3x8dGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSTtcclxuXHRcdFx0XHR0aGlzLnRhcmdldE5hbWVzcGFjZSA9IHRucztcclxuXHJcblx0XHRcdFx0dmFyIGRhbnMgPSBtYXBwaW5nLmRlZmF1bHRBdHRyaWJ1dGVOYW1lc3BhY2VVUkl8fG1hcHBpbmcuZGFuc3x8Jyc7XHJcblx0XHRcdFx0dGhpcy5kZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJID0gZGFucztcclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgYnRpID0gbWFwcGluZy5iYXNlVHlwZUluZm98fG1hcHBpbmcuYnRpfHxudWxsO1xyXG5cdFx0XHRcdHRoaXMuYmFzZVR5cGVJbmZvID0gYnRpO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBpbkYgPSBtYXBwaW5nLmluc3RhbmNlRmFjdG9yeXx8bWFwcGluZy5pbkZ8fHVuZGVmaW5lZDtcclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoaW5GKSkge1xyXG5cdFx0XHRcdFx0Ly8gVE9ETzogc2hvdWxkIHdlIHN1cHBvcnQgaW5zdGFuY2VGYWN0b3J5IGFzIGZ1bmN0aW9ucz9cclxuXHRcdFx0XHRcdC8vIEZvciB0aGUgcHVyZSBKU09OIGNvbmZpZ3VyYXRpb24/XHJcblx0XHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRnVuY3Rpb24oaW5GKTtcclxuXHRcdFx0XHRcdHRoaXMuaW5zdGFuY2VGYWN0b3J5ID0gaW5GO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR2YXIgdG4gPSBtYXBwaW5nLnR5cGVOYW1lfHxtYXBwaW5nLnRufHx1bmRlZmluZWQ7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRuKSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh0bikpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHRoaXMudHlwZU5hbWUgPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0aGlzLnRhcmdldE5hbWVzcGFjZSwgdG4pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRcdHRoaXMudHlwZU5hbWUgPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3QodG4pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhsbikpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dGhpcy50eXBlTmFtZSA9IG5ldyBKc29uaXguWE1MLlFOYW1lKHRucywgbG4pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHR0aGlzLnByb3BlcnRpZXMgPSBbXTtcclxuXHRcdFx0XHR0aGlzLnByb3BlcnRpZXNNYXAgPSB7fTtcclxuXHRcdFx0XHR2YXIgcHMgPSBtYXBwaW5nLnByb3BlcnR5SW5mb3N8fG1hcHBpbmcucHN8fFtdO1xyXG5cdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVBcnJheShwcyk7XHJcblx0XHRcdFx0Zm9yICggdmFyIGluZGV4ID0gMDsgaW5kZXggPCBwcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdHRoaXMucChwc1tpbmRleF0pO1xyXG5cdFx0XHRcdH1cdFx0XHRcdFxyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRQcm9wZXJ0eUluZm9CeU5hbWUgOiBmdW5jdGlvbihuYW1lKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucHJvcGVydGllc01hcFtuYW1lXTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Ly8gT2Jzb2xldGVcclxuXHRcdFx0ZGVzdHJveSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRidWlsZCA6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRcdFx0XHRpZiAoIXRoaXMuYnVpbHQpIHtcclxuXHRcdFx0XHRcdHRoaXMuYmFzZVR5cGVJbmZvID0gY29udGV4dC5yZXNvbHZlVHlwZUluZm8odGhpcy5iYXNlVHlwZUluZm8sIHRoaXMubW9kdWxlKTtcclxuXHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLmJhc2VUeXBlSW5mbykpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5iYXNlVHlwZUluZm8uYnVpbGQoY29udGV4dCk7XHJcblx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0Ly8gQnVpbGQgcHJvcGVydGllcyBpbiB0aGlzIGNvbnRleHRcclxuXHRcdFx0XHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcGVydHlJbmZvID0gdGhpcy5wcm9wZXJ0aWVzW2luZGV4XTtcclxuXHRcdFx0XHRcdFx0cHJvcGVydHlJbmZvLmJ1aWxkKGNvbnRleHQsIHRoaXMubW9kdWxlKTtcclxuXHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHQvLyBCdWlsZCB0aGUgc3RydWN0dXJlXHJcblx0XHRcdFx0XHR2YXIgc3RydWN0dXJlID0ge1xyXG5cdFx0XHRcdFx0XHRlbGVtZW50cyA6IG51bGwsXHJcblx0XHRcdFx0XHRcdGF0dHJpYnV0ZXMgOiB7fSxcclxuXHRcdFx0XHRcdFx0YW55QXR0cmlidXRlIDogbnVsbCxcclxuXHRcdFx0XHRcdFx0dmFsdWUgOiBudWxsLFxyXG5cdFx0XHRcdFx0XHRhbnkgOiBudWxsXHJcblx0XHRcdFx0XHR9O1xyXG5cdFx0XHRcdFx0dGhpcy5idWlsZFN0cnVjdHVyZShjb250ZXh0LCBzdHJ1Y3R1cmUpO1xyXG5cdFx0XHRcdFx0dGhpcy5zdHJ1Y3R1cmUgPSBzdHJ1Y3R1cmU7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRidWlsZFN0cnVjdHVyZSA6IGZ1bmN0aW9uKGNvbnRleHQsIHN0cnVjdHVyZSkge1xyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLmJhc2VUeXBlSW5mbykpIHtcclxuXHRcdFx0XHRcdHRoaXMuYmFzZVR5cGVJbmZvLmJ1aWxkU3RydWN0dXJlKGNvbnRleHQsIHN0cnVjdHVyZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0dmFyIHByb3BlcnR5SW5mbyA9IHRoaXMucHJvcGVydGllc1tpbmRleF07XHJcblx0XHRcdFx0XHRwcm9wZXJ0eUluZm8uYnVpbGRTdHJ1Y3R1cmUoY29udGV4dCwgc3RydWN0dXJlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHVubWFyc2hhbCA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0KSB7XHJcblx0XHRcdFx0dGhpcy5idWlsZChjb250ZXh0KTtcclxuXHRcdFx0XHR2YXIgcmVzdWx0O1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdGlmICh0aGlzLmluc3RhbmNlRmFjdG9yeSkge1xyXG5cdFx0XHRcdFx0cmVzdWx0ID0gbmV3IHRoaXMuaW5zdGFuY2VGYWN0b3J5KCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGVsc2VcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXN1bHQgPSB7IFRZUEVfTkFNRSA6IHRoaXMubmFtZSB9OyBcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0aWYgKGlucHV0LmV2ZW50VHlwZSAhPT0gMSkge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiUGFyc2VyIG11c3QgYmUgb24gU1RBUlRfRUxFTUVOVCB0byByZWFkIGEgY2xhc3MgaW5mby5cIik7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvLyBSZWFkIGF0dHJpYnV0ZXNcclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModGhpcy5zdHJ1Y3R1cmUuYXR0cmlidXRlcykpIHtcclxuXHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVDb3VudCA9IGlucHV0LmdldEF0dHJpYnV0ZUNvdW50KCk7XHJcblx0XHRcdFx0XHRpZiAoYXR0cmlidXRlQ291bnQgIT09IDApIHtcclxuXHRcdFx0XHRcdFx0Zm9yICggdmFyIGluZGV4ID0gMDsgaW5kZXggPCBhdHRyaWJ1dGVDb3VudDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVOYW1lS2V5ID0gaW5wdXRcclxuXHRcdFx0XHRcdFx0XHRcdFx0LmdldEF0dHJpYnV0ZU5hbWVLZXkoaW5kZXgpO1xyXG5cdFx0XHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlXHJcblx0XHRcdFx0XHRcdFx0XHRcdC5leGlzdHModGhpcy5zdHJ1Y3R1cmUuYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lS2V5XSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IGlucHV0XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0LmdldEF0dHJpYnV0ZVZhbHVlKGluZGV4KTtcclxuXHRcdFx0XHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKGF0dHJpYnV0ZVZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR2YXIgYXR0cmlidXRlUHJvcGVydHlJbmZvID0gdGhpcy5zdHJ1Y3R1cmUuYXR0cmlidXRlc1thdHRyaWJ1dGVOYW1lS2V5XTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGhpcy51bm1hcnNoYWxQcm9wZXJ0eVZhbHVlKGNvbnRleHQsIGlucHV0LFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0YXR0cmlidXRlUHJvcGVydHlJbmZvLCByZXN1bHQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRhdHRyaWJ1dGVWYWx1ZSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdC8vIFJlYWQgYW55IGF0dHJpYnV0ZVxyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLnN0cnVjdHVyZS5hbnlBdHRyaWJ1dGUpKSB7XHJcblx0XHRcdFx0XHR2YXIgcHJvcGVydHlJbmZvID0gdGhpcy5zdHJ1Y3R1cmUuYW55QXR0cmlidXRlO1xyXG5cdFx0XHRcdFx0dGhpc1xyXG5cdFx0XHRcdFx0XHRcdC51bm1hcnNoYWxQcm9wZXJ0eShjb250ZXh0LCBpbnB1dCwgcHJvcGVydHlJbmZvLFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRyZXN1bHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBSZWFkIGVsZW1lbnRzXHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMuc3RydWN0dXJlLmVsZW1lbnRzKSkge1xyXG5cclxuXHRcdFx0XHRcdHZhciBldCA9IGlucHV0Lm5leHQoKTtcclxuXHRcdFx0XHRcdHdoaWxlIChldCAhPT0gSnNvbml4LlhNTC5JbnB1dC5FTkRfRUxFTUVOVCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoZXQgPT09IEpzb25peC5YTUwuSW5wdXQuU1RBUlRfRUxFTUVOVCkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIE5ldyBzdWItZWxlbWVudCBzdGFydHNcclxuXHRcdFx0XHRcdFx0XHR2YXIgZWxlbWVudE5hbWVLZXkgPSBpbnB1dC5nZXROYW1lS2V5KCk7XHJcblx0XHRcdFx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0LmV4aXN0cyh0aGlzLnN0cnVjdHVyZS5lbGVtZW50c1tlbGVtZW50TmFtZUtleV0pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgZWxlbWVudFByb3BlcnR5SW5mbyA9IHRoaXMuc3RydWN0dXJlLmVsZW1lbnRzW2VsZW1lbnROYW1lS2V5XTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMudW5tYXJzaGFsUHJvcGVydHkoY29udGV4dCwgaW5wdXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0ZWxlbWVudFByb3BlcnR5SW5mbywgcmVzdWx0KTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGVcclxuXHRcdFx0XHRcdFx0XHRcdFx0LmV4aXN0cyh0aGlzLnN0cnVjdHVyZS5hbnkpKSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBUT0RPIFJlZmFjdG9yXHJcblxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIGFueVByb3BlcnR5SW5mbyA9IHRoaXMuc3RydWN0dXJlLmFueTtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMudW5tYXJzaGFsUHJvcGVydHkoY29udGV4dCwgaW5wdXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0YW55UHJvcGVydHlJbmZvLCByZXN1bHQpO1xyXG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHQvLyBUT0RPIG9wdGlvbmFsbHkgcmVwb3J0IGEgdmFsaWRhdGlvbiBlcnJvciB0aGF0IHRoZSBlbGVtZW50IGlzIG5vdCBleHBlY3RlZFxyXG5cdFx0XHRcdFx0XHRcdFx0ZXQgPSBpbnB1dC5za2lwRWxlbWVudCgpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fSBlbHNlIGlmICgoZXQgPT09IEpzb25peC5YTUwuSW5wdXQuQ0hBUkFDVEVSUyB8fCBldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5DREFUQSB8fCBldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5FTlRJVFlfUkVGRVJFTkNFKSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLnN0cnVjdHVyZS5taXhlZCkpXHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gQ2hhcmFjdGVycyBhbmQgc3RydWN0dXJlIGhhcyBhIG1peGVkIHByb3BlcnR5XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgbWl4ZWRQcm9wZXJ0eUluZm8gPSB0aGlzLnN0cnVjdHVyZS5taXhlZDtcclxuXHRcdFx0XHRcdFx0XHRcdHRoaXMudW5tYXJzaGFsUHJvcGVydHkoY29udGV4dCwgaW5wdXQsXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0bWl4ZWRQcm9wZXJ0eUluZm8sIHJlc3VsdCk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9IGVsc2UgaWYgKGV0ID09PSBKc29uaXguWE1MLklucHV0LlNQQUNFIHx8IGV0ID09PSBKc29uaXguWE1MLklucHV0LkNPTU1FTlRcdHx8IGV0ID09PSBKc29uaXguWE1MLklucHV0LlBST0NFU1NJTkdfSU5TVFJVQ1RJT04pIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBJZ25vcmVcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHN0YXRlOiB1bmV4cGVjdGVkIGV2ZW50IHR5cGUgW1wiICsgZXRcdCsgXCJdLlwiKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRldCA9IGlucHV0Lm5leHQoKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMuc3RydWN0dXJlLnZhbHVlKSkge1xyXG5cdFx0XHRcdFx0dmFyIHZhbHVlUHJvcGVydHlJbmZvID0gdGhpcy5zdHJ1Y3R1cmUudmFsdWU7XHJcblx0XHRcdFx0XHR0aGlzLnVubWFyc2hhbFByb3BlcnR5KGNvbnRleHQsIGlucHV0LCB2YWx1ZVByb3BlcnR5SW5mbyxcclxuXHRcdFx0XHRcdFx0XHRyZXN1bHQpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBKdXN0IHNraXAgZXZlcnl0aGluZ1xyXG5cdFx0XHRcdFx0aW5wdXQubmV4dFRhZygpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoaW5wdXQuZXZlbnRUeXBlICE9PSAyKSB7XHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHN0YXRlOiBtdXN0IGJlIEVORF9FTEVNRU5ULlwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmV0dXJuIHJlc3VsdDtcclxuXHRcdFx0fSxcclxuXHRcdFx0dW5tYXJzaGFsUHJvcGVydHkgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgcHJvcGVydHlJbmZvLCByZXN1bHQpIHtcclxuXHRcdFx0XHR2YXIgcHJvcGVydHlWYWx1ZSA9IHByb3BlcnR5SW5mb1xyXG5cdFx0XHRcdFx0XHQudW5tYXJzaGFsKGNvbnRleHQsIGlucHV0LCB0aGlzKTtcclxuXHRcdFx0XHRwcm9wZXJ0eUluZm8uc2V0UHJvcGVydHkocmVzdWx0LCBwcm9wZXJ0eVZhbHVlKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0dW5tYXJzaGFsUHJvcGVydHlWYWx1ZSA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0LCBwcm9wZXJ0eUluZm8sXHJcblx0XHRcdFx0XHRyZXN1bHQsIHZhbHVlKSB7XHJcblx0XHRcdFx0dmFyIHByb3BlcnR5VmFsdWUgPSBwcm9wZXJ0eUluZm8udW5tYXJzaGFsVmFsdWUodmFsdWUsIGNvbnRleHQsIGlucHV0LCB0aGlzKTtcclxuXHRcdFx0XHRwcm9wZXJ0eUluZm8uc2V0UHJvcGVydHkocmVzdWx0LCBwcm9wZXJ0eVZhbHVlKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0bWFyc2hhbCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaXNNYXJzaGFsbGFibGUodmFsdWUsIGNvbnRleHQsIHNjb3BlKSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHQvLyBUT0RPIFRoaXMgbXVzdCBiZSByZXdvcmtlZFxyXG5cdFx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMuYmFzZVR5cGVJbmZvKSkge1xyXG5cdFx0XHRcdFx0XHR0aGlzLmJhc2VUeXBlSW5mby5tYXJzaGFsKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Zm9yICggdmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0XHRcdHZhciBwcm9wZXJ0eUluZm8gPSB0aGlzLnByb3BlcnRpZXNbaW5kZXhdO1xyXG5cdFx0XHRcdFx0XHR2YXIgcHJvcGVydHlWYWx1ZSA9IHZhbHVlW3Byb3BlcnR5SW5mby5uYW1lXTtcclxuXHRcdFx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHByb3BlcnR5VmFsdWUpKSB7XHJcblx0XHRcdFx0XHRcdFx0cHJvcGVydHlJbmZvLm1hcnNoYWwocHJvcGVydHlWYWx1ZSwgY29udGV4dCwgb3V0cHV0LCB0aGlzKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0Ly8gT3RoZXJ3aXNlIGlmIHRoZXJlIGlzIGp1c3Qgb25lIHByb3BlcnR5LCB1c2UgdGhpcyBwcm9wZXJ0eSB0byBtYXJzaGFsXHJcblx0XHRcdFx0XHRpZiAodGhpcy5zdHJ1Y3R1cmUudmFsdWUpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHZhciB2YWx1ZVByb3BlcnR5SW5mbyA9IHRoaXMuc3RydWN0dXJlLnZhbHVlO1xyXG5cdFx0XHRcdFx0XHR2YWx1ZVByb3BlcnR5SW5mby5tYXJzaGFsKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHRoaXMpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZSBpZiAodGhpcy5wcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0dmFyIHNpbmdsZVByb3BlcnR5SW5mbyA9IHRoaXMucHJvcGVydGllc1swXTtcclxuXHRcdFx0XHRcdFx0c2luZ2xlUHJvcGVydHlJbmZvLm1hcnNoYWwodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgdGhpcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdC8vIFRPRE8gdGhyb3cgYW4gZXJyb3JcclxuXHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVGhlIHBhc3NlZCB2YWx1ZSBbXCIgKyB2YWx1ZSArIFwiXSBpcyBub3QgYW4gb2JqZWN0IGFuZCB0aGVyZSBpcyBubyBzaW5nbGUgc3VpdGFibGUgcHJvcGVydHkgdG8gbWFyc2hhbCBpdC5cIik7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvLyBDaGVja3MgaWYgdGhlIHZhbHVlIGlzIG1hcnNoYWxsYWJsZVxyXG5cdFx0XHRpc01hcnNoYWxsYWJsZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmlzSW5zdGFuY2UodmFsdWUsIGNvbnRleHQsIHNjb3BlKSB8fCAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh2YWx1ZSkgJiYgIUpzb25peC5VdGlsLlR5cGUuaXNBcnJheSh2YWx1ZSkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuaW5zdGFuY2VGYWN0b3J5KSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiB0aGlzLmluc3RhbmNlRmFjdG9yeTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh2YWx1ZSkgJiYgSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh2YWx1ZS5UWVBFX05BTUUpICYmIHZhbHVlLlRZUEVfTkFNRSA9PT0gdGhpcy5uYW1lO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHJcblx0XHRcdC8vIE9ic29sZXRlLCBsZWZ0IGZvciBiYWNrd2FyZHMgY29tcGF0aWJpbGl0eVxyXG5cdFx0XHRiIDogZnVuY3Rpb24oYmFzZVR5cGVJbmZvKSB7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChiYXNlVHlwZUluZm8pO1xyXG5cdFx0XHRcdHRoaXMuYmFzZVR5cGVJbmZvID0gYmFzZVR5cGVJbmZvO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHQvLyBPYnNvbGV0ZSwgbGVmdCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcclxuXHRcdFx0cHMgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHRcdFx0cCA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0XHRcdC8vIElmIG1hcHBpbmcgaXMgYW4gaW5zdGFuY2Ugb2YgdGhlIHByb3BlcnR5IGNsYXNzXHJcblx0XHRcdFx0aWYgKG1hcHBpbmcgaW5zdGFuY2VvZiBKc29uaXguTW9kZWwuUHJvcGVydHlJbmZvKSB7XHJcblx0XHRcdFx0XHR0aGlzLmFkZFByb3BlcnR5KG1hcHBpbmcpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHQvLyBFbHNlIGNyZWF0ZSBpdCB2aWEgZ2VuZXJpYyBtYXBwaW5nIGNvbmZpZ3VyYXRpb25cclxuXHRcdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRcdG1hcHBpbmcgPSBKc29uaXguVXRpbC5UeXBlLmNsb25lT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0XHRcdFx0dmFyIHR5cGUgPSBtYXBwaW5nLnR5cGV8fG1hcHBpbmcudHx8J2VsZW1lbnQnO1xyXG5cdFx0XHRcdFx0Ly8gTG9jYXRlIHRoZSBjcmVhdG9yIGZ1bmN0aW9uXHJcblx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZVxyXG5cdFx0XHRcdFx0XHRcdC5pc0Z1bmN0aW9uKHRoaXMucHJvcGVydHlJbmZvQ3JlYXRvcnNbdHlwZV0pKSB7XHJcblx0XHRcdFx0XHRcdHZhciBwcm9wZXJ0eUluZm9DcmVhdG9yID0gdGhpcy5wcm9wZXJ0eUluZm9DcmVhdG9yc1t0eXBlXTtcclxuXHRcdFx0XHRcdFx0Ly8gQ2FsbCB0aGUgY3JlYXRvciBmdW5jdGlvblxyXG5cdFx0XHRcdFx0XHRwcm9wZXJ0eUluZm9DcmVhdG9yLmNhbGwodGhpcywgbWFwcGluZyk7XHJcblx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbmtub3duIHByb3BlcnR5IGluZm8gdHlwZSBbXCIgKyB0eXBlICsgXCJdLlwiKTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdGFhIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0XHRcdHRoaXMuYWRkRGVmYXVsdE5hbWVzcGFjZXMobWFwcGluZyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdFx0XHRcdFx0LmFkZFByb3BlcnR5KG5ldyB0aGlzLm1hcHBpbmdTdHlsZS5hbnlBdHRyaWJ1dGVQcm9wZXJ0eUluZm8oXHJcblx0XHRcdFx0XHRcdFx0XHRtYXBwaW5nLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG1hcHBpbmdTdHlsZSA6IHRoaXMubWFwcGluZ1N0eWxlXHJcblx0XHRcdFx0XHRcdFx0XHR9KSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGFlIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0XHRcdHRoaXMuYWRkRGVmYXVsdE5hbWVzcGFjZXMobWFwcGluZyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdFx0XHRcdFx0LmFkZFByb3BlcnR5KG5ldyB0aGlzLm1hcHBpbmdTdHlsZS5hbnlFbGVtZW50UHJvcGVydHlJbmZvKFxyXG5cdFx0XHRcdFx0XHRcdFx0bWFwcGluZywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBwaW5nU3R5bGUgOiB0aGlzLm1hcHBpbmdTdHlsZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0XHRcdHRoaXMuYWRkRGVmYXVsdE5hbWVzcGFjZXMobWFwcGluZyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkUHJvcGVydHkobmV3IHRoaXMubWFwcGluZ1N0eWxlLmF0dHJpYnV0ZVByb3BlcnR5SW5mbyhcclxuXHRcdFx0XHRcdFx0bWFwcGluZywge1xyXG5cdFx0XHRcdFx0XHRcdG1hcHBpbmdTdHlsZSA6IHRoaXMubWFwcGluZ1N0eWxlXHJcblx0XHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZW0gOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRcdFx0dGhpcy5hZGREZWZhdWx0TmFtZXNwYWNlcyhtYXBwaW5nKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0XHRcdFx0XHQuYWRkUHJvcGVydHkobmV3IHRoaXMubWFwcGluZ1N0eWxlLmVsZW1lbnRNYXBQcm9wZXJ0eUluZm8oXHJcblx0XHRcdFx0XHRcdFx0XHRtYXBwaW5nLCB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdG1hcHBpbmdTdHlsZSA6IHRoaXMubWFwcGluZ1N0eWxlXHJcblx0XHRcdFx0XHRcdFx0XHR9KSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGUgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRcdFx0dGhpcy5hZGREZWZhdWx0TmFtZXNwYWNlcyhtYXBwaW5nKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRQcm9wZXJ0eShuZXcgdGhpcy5tYXBwaW5nU3R5bGUuZWxlbWVudFByb3BlcnR5SW5mbyhcclxuXHRcdFx0XHRcdFx0bWFwcGluZywge1xyXG5cdFx0XHRcdFx0XHRcdG1hcHBpbmdTdHlsZSA6IHRoaXMubWFwcGluZ1N0eWxlXHJcblx0XHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0ZXMgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRcdFx0dGhpcy5hZGREZWZhdWx0TmFtZXNwYWNlcyhtYXBwaW5nKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5hZGRQcm9wZXJ0eShuZXcgdGhpcy5tYXBwaW5nU3R5bGUuZWxlbWVudHNQcm9wZXJ0eUluZm8oXHJcblx0XHRcdFx0XHRcdG1hcHBpbmcsIHtcclxuXHRcdFx0XHRcdFx0XHRtYXBwaW5nU3R5bGUgOiB0aGlzLm1hcHBpbmdTdHlsZVxyXG5cdFx0XHRcdFx0XHR9KSk7XHJcblx0XHRcdH0sXHJcblx0XHRcdGVyIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0XHRcdHRoaXMuYWRkRGVmYXVsdE5hbWVzcGFjZXMobWFwcGluZyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXNcclxuXHRcdFx0XHRcdFx0LmFkZFByb3BlcnR5KG5ldyB0aGlzLm1hcHBpbmdTdHlsZS5lbGVtZW50UmVmUHJvcGVydHlJbmZvKFxyXG5cdFx0XHRcdFx0XHRcdFx0bWFwcGluZywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBwaW5nU3R5bGUgOiB0aGlzLm1hcHBpbmdTdHlsZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRlcnMgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRcdFx0dGhpcy5hZGREZWZhdWx0TmFtZXNwYWNlcyhtYXBwaW5nKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpc1xyXG5cdFx0XHRcdFx0XHQuYWRkUHJvcGVydHkobmV3IHRoaXMubWFwcGluZ1N0eWxlLmVsZW1lbnRSZWZzUHJvcGVydHlJbmZvKFxyXG5cdFx0XHRcdFx0XHRcdFx0bWFwcGluZywge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRtYXBwaW5nU3R5bGUgOiB0aGlzLm1hcHBpbmdTdHlsZVxyXG5cdFx0XHRcdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHR2IDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0XHRcdHRoaXMuYWRkRGVmYXVsdE5hbWVzcGFjZXMobWFwcGluZyk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYWRkUHJvcGVydHkobmV3IHRoaXMubWFwcGluZ1N0eWxlLnZhbHVlUHJvcGVydHlJbmZvKFxyXG5cdFx0XHRcdFx0XHRtYXBwaW5nLCB7XHJcblx0XHRcdFx0XHRcdFx0bWFwcGluZ1N0eWxlIDogdGhpcy5tYXBwaW5nU3R5bGVcclxuXHRcdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRhZGREZWZhdWx0TmFtZXNwYWNlcyA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChtYXBwaW5nKSkge1xyXG5cdFx0XHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlXHJcblx0XHRcdFx0XHRcdFx0LmlzU3RyaW5nKG1hcHBpbmcuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkpKSB7XHJcblx0XHRcdFx0XHRcdG1hcHBpbmcuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgPSB0aGlzLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlXHJcblx0XHRcdFx0XHRcdFx0LmlzU3RyaW5nKG1hcHBpbmcuZGVmYXVsdEF0dHJpYnV0ZU5hbWVzcGFjZVVSSSkpIHtcclxuXHRcdFx0XHRcdFx0bWFwcGluZy5kZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJID0gdGhpcy5kZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSxcclxuXHRcdFx0YWRkUHJvcGVydHkgOiBmdW5jdGlvbihwcm9wZXJ0eSkge1xyXG5cdFx0XHRcdHRoaXMucHJvcGVydGllcy5wdXNoKHByb3BlcnR5KTtcclxuXHRcdFx0XHR0aGlzLnByb3BlcnRpZXNNYXBbcHJvcGVydHkubmFtZV0gPSBwcm9wZXJ0eTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcztcclxuXHRcdFx0fSxcclxuXHRcdFx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuQ2xhc3NJbmZvJ1xyXG5cdFx0fSk7XHJcbkpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLnByb3BlcnR5SW5mb0NyZWF0b3JzID0ge1xyXG5cdFwiYWFcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmFhLFxyXG5cdFwiYW55QXR0cmlidXRlXCIgOiBKc29uaXguTW9kZWwuQ2xhc3NJbmZvLnByb3RvdHlwZS5hYSxcclxuXHRcImFlXCIgOiBKc29uaXguTW9kZWwuQ2xhc3NJbmZvLnByb3RvdHlwZS5hZSxcclxuXHRcImFueUVsZW1lbnRcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmFlLFxyXG5cdFwiYVwiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuYSxcclxuXHRcImF0dHJpYnV0ZVwiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuYSxcclxuXHRcImVtXCIgOiBKc29uaXguTW9kZWwuQ2xhc3NJbmZvLnByb3RvdHlwZS5lbSxcclxuXHRcImVsZW1lbnRNYXBcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmVtLFxyXG5cdFwiZVwiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuZSxcclxuXHRcImVsZW1lbnRcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmUsXHJcblx0XCJlc1wiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuZXMsXHJcblx0XCJlbGVtZW50c1wiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuZXMsXHJcblx0XCJlclwiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuZXIsXHJcblx0XCJlbGVtZW50UmVmXCIgOiBKc29uaXguTW9kZWwuQ2xhc3NJbmZvLnByb3RvdHlwZS5lcixcclxuXHRcImVyc1wiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuZXJzLFxyXG5cdFwiZWxlbWVudFJlZnNcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLmVycyxcclxuXHRcInZcIiA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8ucHJvdG90eXBlLnYsXHJcblx0XCJ2YWx1ZVwiIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUudlxyXG59O1xyXG5Kc29uaXguTW9kZWwuRW51bUxlYWZJbmZvID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5UeXBlSW5mbywge1xyXG5cdG5hbWUgOiBudWxsLFxyXG5cdGJhc2VUeXBlSW5mbyA6ICdTdHJpbmcnLFxyXG5cdGVudHJpZXMgOiBudWxsLFxyXG5cdGtleXMgOiBudWxsLFxyXG5cdHZhbHVlcyA6IG51bGwsXHJcblx0YnVpbHQgOiBmYWxzZSxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4Lk1vZGVsLlR5cGVJbmZvLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFtdKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRcclxuXHRcdHZhciBuID0gbWFwcGluZy5uYW1lfHxtYXBwaW5nLm58fHVuZGVmaW5lZDtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcobik7XHJcblx0XHR0aGlzLm5hbWUgPSBuO1xyXG5cdFx0XHJcblx0XHR2YXIgYnRpID0gbWFwcGluZy5iYXNlVHlwZUluZm98fG1hcHBpbmcuYnRpfHwnU3RyaW5nJztcclxuXHRcdHRoaXMuYmFzZVR5cGVJbmZvID0gYnRpO1xyXG5cdFx0XHJcblx0XHR2YXIgdnMgPSBtYXBwaW5nLnZhbHVlc3x8bWFwcGluZy52c3x8dW5kZWZpbmVkO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUV4aXN0cyh2cyk7XHJcblx0XHRpZiAoIShKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHZzKSB8fCBKc29uaXguVXRpbC5UeXBlLmlzQXJyYXkodnMpKSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VudW0gdmFsdWVzIG11c3QgYmUgZWl0aGVyIGFuIGFycmF5IG9yIGFuIG9iamVjdC4nKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5lbnRyaWVzID0gdnM7XHJcblx0XHR9XHRcdFxyXG5cdH0sXHJcblx0YnVpbGQgOiBmdW5jdGlvbihjb250ZXh0KSB7XHJcblx0XHRpZiAoIXRoaXMuYnVpbHQpIHtcclxuXHRcdFx0dGhpcy5iYXNlVHlwZUluZm8gPSBjb250ZXh0LnJlc29sdmVUeXBlSW5mbyh0aGlzLmJhc2VUeXBlSW5mbywgdGhpcy5tb2R1bGUpO1xyXG5cdFx0XHR0aGlzLmJhc2VUeXBlSW5mby5idWlsZChjb250ZXh0KTtcclxuXHRcdFx0dmFyIGl0ZW1zID0gdGhpcy5lbnRyaWVzO1xyXG5cdFx0XHR2YXIgZW50cmllcyA9IHt9O1xyXG5cdFx0XHR2YXIga2V5cyA9IFtdO1xyXG5cdFx0XHR2YXIgdmFsdWVzID0gW107XHJcblx0XHRcdHZhciBpbmRleCA9IDA7XHJcblx0XHRcdHZhciBrZXk7XHJcblx0XHRcdHZhciB2YWx1ZTtcclxuXHRcdFx0Ly8gSWYgdmFsdWVzIGlzIGFuIGFycmF5LCBwcm9jZXNzIGluZGl2aWR1YWwgaXRlbXNcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNBcnJheShpdGVtcykpXHJcblx0XHRcdHtcclxuXHRcdFx0XHQvLyBCdWlsZCBwcm9wZXJ0aWVzIGluIHRoaXMgY29udGV4dFxyXG5cdFx0XHRcdGZvciAoaW5kZXggPSAwOyBpbmRleCA8IGl0ZW1zLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0dmFsdWUgPSBpdGVtc1tpbmRleF07XHJcblx0XHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh2YWx1ZSkpIHtcclxuXHRcdFx0XHRcdFx0a2V5ID0gdmFsdWU7XHJcblx0XHRcdFx0XHRcdGlmICghKEpzb25peC5VdGlsLlR5cGUuaXNGdW5jdGlvbih0aGlzLmJhc2VUeXBlSW5mby5wYXJzZSkpKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbnVtIHZhbHVlIGlzIHByb3ZpZGVkIGFzIHN0cmluZyBidXQgdGhlIGJhc2UgdHlwZSBbJyt0aGlzLmJhc2VUeXBlSW5mby5uYW1lKyddIG9mIHRoZSBlbnVtIGluZm8gWycgKyB0aGlzLm5hbWUgKyAnXSBkb2VzIG5vdCBpbXBsZW1lbnQgdGhlIHBhcnNlIG1ldGhvZC4nKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHQvLyBVc2luZyBudWxsIGFzIGlucHV0IHNpbmNlIGlucHV0IGlzIG5vdCBhdmFpbGFibGVcclxuXHRcdFx0XHRcdFx0dmFsdWUgPSB0aGlzLmJhc2VUeXBlSW5mby5wYXJzZSh2YWx1ZSwgY29udGV4dCwgbnVsbCwgdGhpcyk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdGlmICh0aGlzLmJhc2VUeXBlSW5mby5pc0luc3RhbmNlKHZhbHVlLCBjb250ZXh0LCB0aGlzKSlcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdGlmICghKEpzb25peC5VdGlsLlR5cGUuaXNGdW5jdGlvbih0aGlzLmJhc2VUeXBlSW5mby5wcmludCkpKVxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignVGhlIGJhc2UgdHlwZSBbJyt0aGlzLmJhc2VUeXBlSW5mby5uYW1lKyddIG9mIHRoZSBlbnVtIGluZm8gWycgKyB0aGlzLm5hbWUgKyAnXSBkb2VzIG5vdCBpbXBsZW1lbnQgdGhlIHByaW50IG1ldGhvZCwgdW5hYmxlIHRvIHByb2R1Y2UgdGhlIGVudW0ga2V5IGFzIHN0cmluZy4nKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0Ly8gVXNpbmcgbnVsbCBhcyBvdXRwdXQgc2luY2Ugb3V0cHV0IGlzIG5vdCBhdmFpbGFibGUgYXQgdGhpcyBtb21lbnRcclxuXHRcdFx0XHRcdFx0XHRrZXkgPSB0aGlzLmJhc2VUeXBlSW5mby5wcmludCh2YWx1ZSwgY29udGV4dCwgbnVsbCwgdGhpcyk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbnVtIHZhbHVlIFsnICsgdmFsdWUgKyAnXSBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgdGhlIGVudW0gYmFzZSB0eXBlIFsnICsgdGhpcy5iYXNlVHlwZUluZm8ubmFtZSArICddLicpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRlbnRyaWVzW2tleV0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdGtleXNbaW5kZXhdID0ga2V5O1xyXG5cdFx0XHRcdFx0dmFsdWVzW2luZGV4XSA9IHZhbHVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KGl0ZW1zKSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdGZvciAoa2V5IGluIGl0ZW1zKSB7XHJcblx0XHRcdFx0XHRpZiAoaXRlbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG5cdFx0XHRcdFx0XHR2YWx1ZSA9IGl0ZW1zW2tleV07XHJcblx0XHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICghKEpzb25peC5VdGlsLlR5cGUuaXNGdW5jdGlvbih0aGlzLmJhc2VUeXBlSW5mby5wYXJzZSkpKVxyXG5cdFx0XHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignRW51bSB2YWx1ZSBpcyBwcm92aWRlZCBhcyBzdHJpbmcgYnV0IHRoZSBiYXNlIHR5cGUgWycrdGhpcy5iYXNlVHlwZUluZm8ubmFtZSsnXSBvZiB0aGUgZW51bSBpbmZvIFsnICsgdGhpcy5uYW1lICsgJ10gZG9lcyBub3QgaW1wbGVtZW50IHRoZSBwYXJzZSBtZXRob2QuJyk7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdC8vIFVzaW5nIG51bGwgYXMgaW5wdXQgc2luY2UgaW5wdXQgaXMgbm90IGF2YWlsYWJsZVxyXG5cdFx0XHRcdFx0XHRcdHZhbHVlID0gdGhpcy5iYXNlVHlwZUluZm8ucGFyc2UodmFsdWUsIGNvbnRleHQsIG51bGwsIHRoaXMpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdGVsc2VcclxuXHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdGlmICghdGhpcy5iYXNlVHlwZUluZm8uaXNJbnN0YW5jZSh2YWx1ZSwgY29udGV4dCwgdGhpcykpXHJcblx0XHRcdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbnVtIHZhbHVlIFsnICsgdmFsdWUgKyAnXSBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgdGhlIGVudW0gYmFzZSB0eXBlIFsnICsgdGhpcy5iYXNlVHlwZUluZm8ubmFtZSArICddLicpO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRlbnRyaWVzW2tleV0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0a2V5c1tpbmRleF0gPSBrZXk7XHJcblx0XHRcdFx0XHRcdHZhbHVlc1tpbmRleF0gPSB2YWx1ZTtcclxuXHRcdFx0XHRcdFx0aW5kZXgrKztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKCdFbnVtIHZhbHVlcyBtdXN0IGJlIGVpdGhlciBhbiBhcnJheSBvciBhbiBvYmplY3QuJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0dGhpcy5lbnRyaWVzID0gZW50cmllcztcclxuXHRcdFx0dGhpcy5rZXlzID0ga2V5cztcclxuXHRcdFx0dGhpcy52YWx1ZXMgPSB2YWx1ZXM7XHJcblx0XHRcdHRoaXMuYnVpbHQgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0dW5tYXJzaGFsIDogZnVuY3Rpb24oY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgdGV4dCA9IGlucHV0LmdldEVsZW1lbnRUZXh0KCk7XHJcblx0XHRyZXR1cm4gdGhpcy5wYXJzZSh0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdH0sXHJcblx0bWFyc2hhbCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUpKSB7XHJcblx0XHRcdG91dHB1dC53cml0ZUNoYXJhY3RlcnModGhpcy5yZXByaW50KHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRyZXByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHZhbHVlKSAmJiAhdGhpcy5pc0luc3RhbmNlKHZhbHVlLCBjb250ZXh0LCBzY29wZSkpIHtcclxuXHRcdFx0Ly8gVXNpbmcgbnVsbCBhcyBpbnB1dCBzaW5jZSBpbnB1dCBpcyBub3QgYXZhaWxhYmxlXHJcblx0XHRcdHJldHVybiB0aGlzLnByaW50KHRoaXMucGFyc2UodmFsdWUsIGNvbnRleHQsIG51bGwsIHNjb3BlKSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wcmludCh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy52YWx1ZXMubGVuZ3RoOyBpbmRleCsrKVxyXG5cdFx0e1xyXG5cdFx0XHRpZiAodGhpcy52YWx1ZXNbaW5kZXhdID09PSB2YWx1ZSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLmtleXNbaW5kZXhdO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIFsnICsgdmFsdWUgKyAnXSBpcyBpbnZhbGlkIGZvciB0aGUgZW51bSB0eXBlIFsnICsgdGhpcy5uYW1lICsgJ10uJyk7XHJcblx0fSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0ZXh0KTtcclxuXHRcdGlmICh0aGlzLmVudHJpZXMuaGFzT3duUHJvcGVydHkodGV4dCkpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiB0aGlzLmVudHJpZXNbdGV4dF07XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignVmFsdWUgWycgKyB0ZXh0ICsgJ10gaXMgaW52YWxpZCBmb3IgdGhlIGVudW0gdHlwZSBbJyArIHRoaXMubmFtZSArICddLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMudmFsdWVzLmxlbmd0aDsgaW5kZXgrKylcclxuXHRcdHtcclxuXHRcdFx0aWYgKHRoaXMudmFsdWVzW2luZGV4XSA9PT0gdmFsdWUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGZhbHNlO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuRW51bUxlYWZJbmZvJ1xyXG59KTtcclxuSnNvbml4Lk1vZGVsLkVsZW1lbnRJbmZvID0gSnNvbml4LkNsYXNzKHtcclxuXHRtb2R1bGU6IG51bGwsXHRcdFx0XHJcblx0ZWxlbWVudE5hbWUgOiBudWxsLFxyXG5cdHR5cGVJbmZvIDogbnVsbCxcclxuXHRzdWJzdGl0dXRpb25IZWFkIDogbnVsbCxcclxuXHRzY29wZSA6IG51bGwsXHJcblx0YnVpbHQgOiBmYWxzZSxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdFxyXG5cdFx0dmFyIGRlbnMgPSBtYXBwaW5nLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJfHxtYXBwaW5nLmRlbnN8fCcnO1xyXG5cdFx0dGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSA9IGRlbnM7XHJcblx0XHRcclxuXHRcdHZhciBlbiA9IG1hcHBpbmcuZWxlbWVudE5hbWUgfHwgbWFwcGluZy5lbnx8dW5kZWZpbmVkO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QoZW4pKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudE5hbWUgPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3QoZW4pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhlbik7XHJcblx0XHRcdHRoaXMuZWxlbWVudE5hbWUgPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0aGlzLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJLCBlbik7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdHZhciB0aSA9IG1hcHBpbmcudHlwZUluZm98fG1hcHBpbmcudGl8fCdTdHJpbmcnO1xyXG5cdFx0dGhpcy50eXBlSW5mbyA9IHRpO1xyXG5cdFx0XHJcblx0XHR2YXIgc2ggPSBtYXBwaW5nLnN1YnN0aXR1dGlvbkhlYWR8fG1hcHBpbmcuc2h8fG51bGw7XHJcblx0XHR0aGlzLnN1YnN0aXR1dGlvbkhlYWQgPSBzaDtcclxuXHRcdFxyXG5cdFx0dmFyIHNjID0gbWFwcGluZy5zY29wZXx8bWFwcGluZy5zY3x8bnVsbDtcclxuXHRcdHRoaXMuc2NvcGUgPSBzYztcclxuXHR9LFxyXG5cdGJ1aWxkIDogZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFx0Ly8gSWYgZWxlbWVudCBpbmZvIGlzIG5vdCB5ZXQgYnVpbHRcclxuXHRcdGlmICghdGhpcy5idWlsdCkge1xyXG5cdFx0XHR0aGlzLnR5cGVJbmZvID0gY29udGV4dC5yZXNvbHZlVHlwZUluZm8odGhpcy50eXBlSW5mbywgdGhpcy5tb2R1bGUpO1xyXG5cdFx0XHR0aGlzLnNjb3BlID0gY29udGV4dC5yZXNvbHZlVHlwZUluZm8odGhpcy5zY29wZSwgdGhpcy5tb2R1bGUpO1xyXG5cdFx0XHR0aGlzLmJ1aWx0ID0gdHJ1ZTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkVsZW1lbnRJbmZvJ1xyXG59KTtcclxuSnNvbml4Lk1vZGVsLlByb3BlcnR5SW5mbyA9IEpzb25peC5DbGFzcyh7XHJcblx0bmFtZSA6IG51bGwsXHJcblx0Y29sbGVjdGlvbiA6IGZhbHNlLFxyXG5cdHRhcmdldE5hbWVzcGFjZSA6ICcnLFxyXG5cdGRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJIDogJycsXHJcblx0ZGVmYXVsdEF0dHJpYnV0ZU5hbWVzcGFjZVVSSSA6ICcnLFxyXG5cdGJ1aWx0IDogZmFsc2UsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHR2YXIgbiA9IG1hcHBpbmcubmFtZSB8fCBtYXBwaW5nLm4gfHwgdW5kZWZpbmVkO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhuKTtcclxuXHRcdHRoaXMubmFtZSA9IG47XHJcblx0XHR2YXIgZGVucyA9IG1hcHBpbmcuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgfHwgbWFwcGluZy5kZW5zIHx8IG1hcHBpbmcudGFyZ2V0TmFtZXNwYWNlIHx8IG1hcHBpbmcudG5zIHx8ICcnO1xyXG5cdFx0dGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSA9IGRlbnM7XHJcblx0XHR2YXIgdG5zID0gbWFwcGluZy50YXJnZXROYW1lc3BhY2UgfHwgbWFwcGluZy50bnMgfHwgbWFwcGluZy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSB8fCBtYXBwaW5nLmRlbnMgfHwgdGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSTtcclxuXHRcdHRoaXMudGFyZ2V0TmFtZXNwYWNlID0gdG5zO1xyXG5cdFx0dmFyIGRhbnMgPSBtYXBwaW5nLmRlZmF1bHRBdHRyaWJ1dGVOYW1lc3BhY2VVUkkgfHwgbWFwcGluZy5kYW5zIHx8ICcnO1xyXG5cdFx0dGhpcy5kZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJID0gZGFucztcclxuXHRcdHZhciBjb2wgPSBtYXBwaW5nLmNvbGxlY3Rpb24gfHwgbWFwcGluZy5jb2wgfHwgZmFsc2U7XHJcblx0XHR0aGlzLmNvbGxlY3Rpb24gPSBjb2w7XHJcblx0XHR2YXIgcnEgPSBtYXBwaW5nLnJlcXVpcmVkIHx8IG1hcHBpbmcucnEgfHwgZmFsc2U7XHJcblx0XHR0aGlzLnJlcXVpcmVkID0gcnE7XHJcblx0XHRpZiAodGhpcy5jb2xsZWN0aW9uKSB7XHJcblx0XHRcdHZhciBtbm87XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKG1hcHBpbmcubWluT2NjdXJzKSkge1xyXG5cdFx0XHRcdG1ubyA9IG1hcHBpbmcubWluT2NjdXJzO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIobWFwcGluZy5tbm8pKSB7XHJcblx0XHRcdFx0bW5vID0gbWFwcGluZy5tbm87XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bW5vID0gMTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aGlzLm1pbk9jY3VycyA9IG1ubztcclxuXHRcdFx0dmFyIG14bztcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIobWFwcGluZy5tYXhPY2N1cnMpKSB7XHJcblx0XHRcdFx0bXhvID0gbWFwcGluZy5tYXhPY2N1cnM7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoSnNvbml4LlV0aWwuVHlwZS5pc051bWJlcihtYXBwaW5nLm14bykpIHtcclxuXHRcdFx0XHRteG8gPSBtYXBwaW5nLm14bztcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIHtcclxuXHRcdFx0XHRteG8gPSBudWxsO1xyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMubWF4T2NjdXJzID0gbXhvO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YnVpbGQgOiBmdW5jdGlvbihjb250ZXh0LCBtb2R1bGUpIHtcclxuXHRcdGlmICghdGhpcy5idWlsdCkge1xyXG5cdFx0XHR0aGlzLmRvQnVpbGQoY29udGV4dCwgbW9kdWxlKTtcclxuXHRcdFx0dGhpcy5idWlsdCA9IHRydWU7XHJcblx0XHR9XHJcblx0fSxcclxuXHRkb0J1aWxkIDogZnVuY3Rpb24oY29udGV4dCwgbW9kdWxlKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJBYnN0cmFjdCBtZXRob2QgW2RvQnVpbGRdLlwiKTtcclxuXHR9LFxyXG5cdGJ1aWxkU3RydWN0dXJlIDogZnVuY3Rpb24oY29udGV4dCwgc3RydWN0dXJlKSB7XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJBYnN0cmFjdCBtZXRob2QgW2J1aWxkU3RydWN0dXJlXS5cIik7XHJcblx0fSxcclxuXHRzZXRQcm9wZXJ0eSA6IGZ1bmN0aW9uKG9iamVjdCwgdmFsdWUpIHtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZSkpIHtcclxuXHRcdFx0aWYgKHRoaXMuY29sbGVjdGlvbikge1xyXG5cdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVBcnJheSh2YWx1ZSwgJ0NvbGxlY3Rpb24gcHJvcGVydHkgcmVxdWlyZXMgYW4gYXJyYXkgdmFsdWUuJyk7XHJcblx0XHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhvYmplY3RbdGhpcy5uYW1lXSkpIHtcclxuXHRcdFx0XHRcdG9iamVjdFt0aGlzLm5hbWVdID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB2YWx1ZS5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdG9iamVjdFt0aGlzLm5hbWVdLnB1c2godmFsdWVbaW5kZXhdKTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdG9iamVjdFt0aGlzLm5hbWVdID0gdmFsdWU7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLlByb3BlcnR5SW5mbydcclxufSk7XHJcbkpzb25peC5Nb2RlbC5BbnlBdHRyaWJ1dGVQcm9wZXJ0eUluZm8gPSBKc29uaXguQ2xhc3MoSnNvbml4Lk1vZGVsLlByb3BlcnR5SW5mbywge1xyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0SnNvbml4Lk1vZGVsLlByb3BlcnR5SW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIG1hcHBpbmcgXSk7XHJcblx0fSxcclxuXHR1bm1hcnNoYWwgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciBhdHRyaWJ1dGVDb3VudCA9IGlucHV0LmdldEF0dHJpYnV0ZUNvdW50KCk7XHJcblx0XHRpZiAoYXR0cmlidXRlQ291bnQgPT09IDApIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgcmVzdWx0ID0ge307XHJcblx0XHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXR0cmlidXRlQ291bnQ7IGluZGV4KyspIHtcclxuXHRcdFx0XHR2YXIgdmFsdWUgPSBpbnB1dC5nZXRBdHRyaWJ1dGVWYWx1ZShpbmRleCk7XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodmFsdWUpKSB7XHJcblx0XHRcdFx0XHR2YXIgcHJvcGVydHlOYW1lID0gdGhpcy5jb252ZXJ0RnJvbUF0dHJpYnV0ZU5hbWUoaW5wdXQuZ2V0QXR0cmlidXRlTmFtZShpbmRleCksIGNvbnRleHQsIGlucHV0LCBzY29wZSk7XHJcblx0XHRcdFx0XHRyZXN1bHRbcHJvcGVydHlOYW1lXSA9IHZhbHVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0bWFyc2hhbCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QodmFsdWUpKSB7XHJcblx0XHRcdC8vIE5vdGhpbmcgdG8gZG9cclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0Zm9yICggdmFyIHByb3BlcnR5TmFtZSBpbiB2YWx1ZSkge1xyXG5cdFx0XHRpZiAodmFsdWUuaGFzT3duUHJvcGVydHkocHJvcGVydHlOYW1lKSkge1xyXG5cdFx0XHRcdHZhciBwcm9wZXJ0eVZhbHVlID0gdmFsdWVbcHJvcGVydHlOYW1lXTtcclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhwcm9wZXJ0eVZhbHVlKSkge1xyXG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZU5hbWUgPSB0aGlzLmNvbnZlcnRUb0F0dHJpYnV0ZU5hbWUocHJvcGVydHlOYW1lLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdFx0XHRcdG91dHB1dC53cml0ZUF0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lLCBwcm9wZXJ0eVZhbHVlKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGNvbnZlcnRGcm9tQXR0cmlidXRlTmFtZSA6IGZ1bmN0aW9uKGF0dHJpYnV0ZU5hbWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIGF0dHJpYnV0ZU5hbWUua2V5O1xyXG5cdH0sXHJcblx0Y29udmVydFRvQXR0cmlidXRlTmFtZSA6IGZ1bmN0aW9uKHByb3BlcnR5TmFtZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdE9yU3RyaW5nKHByb3BlcnR5TmFtZSwgY29udGV4dCk7XHJcblx0fSxcclxuXHRkb0J1aWxkIDogZnVuY3Rpb24oY29udGV4dCwgbW9kdWxlKVx0e1xyXG5cdFx0Ly8gTm90aGluZyB0byBkb1xyXG5cdH0sXHJcblx0YnVpbGRTdHJ1Y3R1cmUgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3Qoc3RydWN0dXJlKTtcclxuXHRcdC8vIGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhzdHJ1Y3R1cmUuYW55QXR0cmlidXRlKSlcclxuXHRcdC8vIHtcclxuXHRcdC8vIC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0Ly8gdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0cnVjdHVyZSBhbHJlYWR5IGRlZmluZXMgYW4gYW55IGF0dHJpYnV0ZVxyXG5cdFx0Ly8gcHJvcGVydHkuXCIpO1xyXG5cdFx0Ly8gfSBlbHNlXHJcblx0XHQvLyB7XHJcblx0XHRzdHJ1Y3R1cmUuYW55QXR0cmlidXRlID0gdGhpcztcclxuXHRcdC8vIH1cclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkFueUF0dHJpYnV0ZVByb3BlcnR5SW5mbydcclxufSk7XHJcbkpzb25peC5Nb2RlbC5BbnlBdHRyaWJ1dGVQcm9wZXJ0eUluZm8uU2ltcGxpZmllZCA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuQW55QXR0cmlidXRlUHJvcGVydHlJbmZvLCB7XHJcblx0Y29udmVydEZyb21BdHRyaWJ1dGVOYW1lIDogZnVuY3Rpb24oYXR0cmlidXRlTmFtZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKVxyXG5cdHtcclxuXHRcdHJldHVybiBhdHRyaWJ1dGVOYW1lLnRvQ2Fub25pY2FsU3RyaW5nKGNvbnRleHQpO1xyXG5cdH1cclxufSk7XHJcblxyXG5Kc29uaXguTW9kZWwuU2luZ2xlVHlwZVByb3BlcnR5SW5mbyA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuUHJvcGVydHlJbmZvLCB7XHJcblx0dHlwZUluZm8gOiAnU3RyaW5nJyxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdEpzb25peC5Nb2RlbC5Qcm9wZXJ0eUluZm8ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgWyBtYXBwaW5nIF0pO1xyXG5cdFx0dmFyIHRpID0gbWFwcGluZy50eXBlSW5mbyB8fCBtYXBwaW5nLnRpIHx8ICdTdHJpbmcnO1xyXG5cdFx0dGhpcy50eXBlSW5mbyA9IHRpO1xyXG5cdH0sXHJcblx0ZG9CdWlsZCA6IGZ1bmN0aW9uKGNvbnRleHQsIG1vZHVsZSkge1xyXG5cdFx0dGhpcy50eXBlSW5mbyA9IGNvbnRleHQucmVzb2x2ZVR5cGVJbmZvKHRoaXMudHlwZUluZm8sIG1vZHVsZSk7XHJcblx0fSxcclxuXHR1bm1hcnNoYWxWYWx1ZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnBhcnNlKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdH0sXHJcblx0cGFyc2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy50eXBlSW5mby5wYXJzZSh2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHR9LFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnR5cGVJbmZvLnJlcHJpbnQodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuU2luZ2xlVHlwZVByb3BlcnR5SW5mbydcclxufSk7XHJcblxyXG5Kc29uaXguTW9kZWwuQXR0cmlidXRlUHJvcGVydHlJbmZvID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5TaW5nbGVUeXBlUHJvcGVydHlJbmZvLCB7XHJcblx0YXR0cmlidXRlTmFtZSA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRKc29uaXguTW9kZWwuU2luZ2xlVHlwZVByb3BlcnR5SW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIG1hcHBpbmcgXSk7XHJcblx0XHR2YXIgYW4gPSBtYXBwaW5nLmF0dHJpYnV0ZU5hbWV8fG1hcHBpbmcuYW58fHVuZGVmaW5lZDtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KGFuKSkge1xyXG5cdFx0XHR0aGlzLmF0dHJpYnV0ZU5hbWUgPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3QoYW4pO1xyXG5cdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKGFuKSkge1xyXG5cdFx0XHR0aGlzLmF0dHJpYnV0ZU5hbWUgPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0aGlzLmRlZmF1bHRBdHRyaWJ1dGVOYW1lc3BhY2VVUkksIGFuKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuYXR0cmlidXRlTmFtZSA9IG5ldyBKc29uaXguWE1MLlFOYW1lKHRoaXMuZGVmYXVsdEF0dHJpYnV0ZU5hbWVzcGFjZVVSSSwgdGhpcy5uYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHVubWFyc2hhbCA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIGF0dHJpYnV0ZUNvdW50ID0gaW5wdXQuZ2V0QXR0cmlidXRlQ291bnQoKTtcclxuXHRcdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdFx0Zm9yICggdmFyIGluZGV4ID0gMDsgaW5kZXggPCBhdHRyaWJ1dGVDb3VudDsgaW5kZXgrKykge1xyXG5cdFx0XHR2YXIgYXR0cmlidXRlTmFtZUtleSA9IGlucHV0LmdldEF0dHJpYnV0ZU5hbWVLZXkoaW5kZXgpO1xyXG5cdFx0XHRpZiAodGhpcy5hdHRyaWJ1dGVOYW1lLmtleSA9PT0gYXR0cmlidXRlTmFtZUtleSkge1xyXG5cdFx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IGlucHV0LmdldEF0dHJpYnV0ZVZhbHVlKGluZGV4KTtcclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhhdHRyaWJ1dGVWYWx1ZSkpIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IHRoaXMudW5tYXJzaGFsVmFsdWUoYXR0cmlidXRlVmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblx0bWFyc2hhbCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUpKSB7XHJcblx0XHRcdG91dHB1dC53cml0ZUF0dHJpYnV0ZSh0aGlzLmF0dHJpYnV0ZU5hbWUsIHRoaXMucHJpbnQodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpKTtcclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHRidWlsZFN0cnVjdHVyZSA6IGZ1bmN0aW9uKGNvbnRleHQsIHN0cnVjdHVyZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChzdHJ1Y3R1cmUpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChzdHJ1Y3R1cmUuYXR0cmlidXRlcyk7XHJcblx0XHR2YXIga2V5ID0gdGhpcy5hdHRyaWJ1dGVOYW1lLmtleTtcclxuXHRcdC8vIGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhzdHJ1Y3R1cmUuYXR0cmlidXRlc1trZXldKSkge1xyXG5cdFx0Ly8gLy8gVE9ETyBiZXR0ZXIgZXhjZXB0aW9uXHJcblx0XHQvLyB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3RydWN0dXJlIGFscmVhZHkgZGVmaW5lcyBhbiBhdHRyaWJ1dGUgZm9yIHRoZSBrZXlcclxuXHRcdC8vIFtcIlxyXG5cdFx0Ly8gKyBrZXkgKyBcIl0uXCIpO1xyXG5cdFx0Ly8gfSBlbHNlXHJcblx0XHQvLyB7XHJcblx0XHRzdHJ1Y3R1cmUuYXR0cmlidXRlc1trZXldID0gdGhpcztcclxuXHRcdC8vIH1cclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkF0dHJpYnV0ZVByb3BlcnR5SW5mbydcclxufSk7XHJcblxyXG5Kc29uaXguTW9kZWwuVmFsdWVQcm9wZXJ0eUluZm8gPSBKc29uaXguQ2xhc3MoSnNvbml4Lk1vZGVsLlNpbmdsZVR5cGVQcm9wZXJ0eUluZm8sIHtcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdEpzb25peC5Nb2RlbC5TaW5nbGVUeXBlUHJvcGVydHlJbmZvLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFsgbWFwcGluZyBdKTtcclxuXHJcblx0XHR2YXIgY2RhdGEgPSBtYXBwaW5nLmFzQ0RBVEEgfHwgbWFwcGluZy5jZGF0YSB8fCBmYWxzZTtcclxuXHRcdHRoaXMuYXNDREFUQSA9IGNkYXRhO1xyXG5cdH0sXHJcblx0dW5tYXJzaGFsIDogZnVuY3Rpb24oY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgdGV4dCA9IGlucHV0LmdldEVsZW1lbnRUZXh0KCk7XHJcblx0XHRyZXR1cm4gdGhpcy51bm1hcnNoYWxWYWx1ZSh0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdH0sXHJcblx0bWFyc2hhbCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlKSkge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKHRoaXMuYXNDREFUQSkge1xyXG5cdFx0XHRvdXRwdXQud3JpdGVDZGF0YSh0aGlzLnByaW50KHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRvdXRwdXQud3JpdGVDaGFyYWN0ZXJzKHRoaXMucHJpbnQodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGJ1aWxkU3RydWN0dXJlIDogZnVuY3Rpb24oY29udGV4dCwgc3RydWN0dXJlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHN0cnVjdHVyZSk7XHJcblx0XHQvLyBpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc3RydWN0dXJlLnZhbHVlKSkge1xyXG5cdFx0Ly8gLy8gVE9ETyBiZXR0ZXIgZXhjZXB0aW9uXHJcblx0XHQvLyB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3RydWN0dXJlIGFscmVhZHkgZGVmaW5lcyBhIHZhbHVlXHJcblx0XHQvLyBwcm9wZXJ0eS5cIik7XHJcblx0XHQvLyB9IGVsc2VcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhzdHJ1Y3R1cmUuZWxlbWVudHMpKSB7XHJcblx0XHRcdC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3RydWN0dXJlIGFscmVhZHkgZGVmaW5lcyBlbGVtZW50IG1hcHBpbmdzLCBpdCBjYW5ub3QgZGVmaW5lIGEgdmFsdWUgcHJvcGVydHkuXCIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0c3RydWN0dXJlLnZhbHVlID0gdGhpcztcclxuXHRcdH1cclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLlZhbHVlUHJvcGVydHlJbmZvJ1xyXG59KTtcclxuXHJcbkpzb25peC5Nb2RlbC5BYnN0cmFjdEVsZW1lbnRzUHJvcGVydHlJbmZvID0gSnNvbml4LkNsYXNzKEpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxzLkVsZW1lbnQsIEpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxzLldyYXBwZXJFbGVtZW50LCBKc29uaXguTW9kZWwuUHJvcGVydHlJbmZvLCB7XHJcblx0d3JhcHBlckVsZW1lbnROYW1lIDogbnVsbCxcclxuXHRhbGxvd0RvbSA6IGZhbHNlLFxyXG5cdGFsbG93VHlwZWRPYmplY3QgOiB0cnVlLFxyXG5cdG1peGVkIDogZmFsc2UsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRKc29uaXguTW9kZWwuUHJvcGVydHlJbmZvLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFsgbWFwcGluZyBdKTtcclxuXHRcdHZhciB3ZW4gPSBtYXBwaW5nLndyYXBwZXJFbGVtZW50TmFtZXx8bWFwcGluZy53ZW58fHVuZGVmaW5lZDtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHdlbikpIHtcclxuXHRcdFx0dGhpcy53cmFwcGVyRWxlbWVudE5hbWUgPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3Qod2VuKTtcclxuXHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh3ZW4pKSB7XHJcblx0XHRcdHRoaXMud3JhcHBlckVsZW1lbnROYW1lID0gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSwgd2VuKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMud3JhcHBlckVsZW1lbnROYW1lID0gbnVsbDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHVubWFyc2hhbCA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IG51bGw7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHR2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0XHRpZiAodGhhdC5jb2xsZWN0aW9uKSB7XHJcblx0XHRcdFx0aWYgKHJlc3VsdCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0cmVzdWx0ID0gW107XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJlc3VsdC5wdXNoKHZhbHVlKTtcclxuXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKHJlc3VsdCA9PT0gbnVsbCkge1xyXG5cdFx0XHRcdFx0cmVzdWx0ID0gdmFsdWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdC8vIFRPRE8gUmVwb3J0IHZhbGlkYXRpb24gZXJyb3JcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihcIlZhbHVlIGFscmVhZHkgc2V0LlwiKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMud3JhcHBlckVsZW1lbnROYW1lKSkge1xyXG5cdFx0XHR0aGlzLnVubWFyc2hhbFdyYXBwZXJFbGVtZW50KGNvbnRleHQsIGlucHV0LCBzY29wZSwgY2FsbGJhY2spO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy51bm1hcnNoYWxFbGVtZW50KGNvbnRleHQsIGlucHV0LCBzY29wZSwgY2FsbGJhY2spO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdG1hcnNoYWwgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cclxuXHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUpKSB7XHJcblx0XHRcdC8vIERvIG5vdGhpbmdcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSkpIHtcclxuXHRcdFx0b3V0cHV0LndyaXRlU3RhcnRFbGVtZW50KHRoaXMud3JhcHBlckVsZW1lbnROYW1lKTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoIXRoaXMuY29sbGVjdGlvbikge1xyXG5cdFx0XHR0aGlzLm1hcnNoYWxFbGVtZW50KHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVBcnJheSh2YWx1ZSk7XHJcblx0XHRcdC8vIFRPRE8gRXhjZXB0aW9uIGlmIG5vdCBhcnJheVxyXG5cdFx0XHRmb3IgKCB2YXIgaW5kZXggPSAwOyBpbmRleCA8IHZhbHVlLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdHZhciBpdGVtID0gdmFsdWVbaW5kZXhdO1xyXG5cdFx0XHRcdC8vIFRPRE8gRXhjZXB0aW9uIGlmIGl0ZW0gZG9lcyBub3QgZXhpc3RcclxuXHRcdFx0XHR0aGlzLm1hcnNoYWxFbGVtZW50KGl0ZW0sIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMud3JhcHBlckVsZW1lbnROYW1lKSkge1xyXG5cdFx0XHRvdXRwdXQud3JpdGVFbmRFbGVtZW50KCk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRjb252ZXJ0RnJvbVR5cGVkTmFtZWRWYWx1ZSA6IGZ1bmN0aW9uKGVsZW1lbnRWYWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gZWxlbWVudFZhbHVlLnZhbHVlO1xyXG5cdH0sXHJcblx0YnVpbGRTdHJ1Y3R1cmUgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3Qoc3RydWN0dXJlKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhzdHJ1Y3R1cmUudmFsdWUpKSB7XHJcblx0XHRcdC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3RydWN0dXJlIGFscmVhZHkgZGVmaW5lcyBhIHZhbHVlIHByb3BlcnR5LlwiKTtcclxuXHRcdH0gZWxzZSBpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHN0cnVjdHVyZS5lbGVtZW50cykpIHtcclxuXHRcdFx0c3RydWN0dXJlLmVsZW1lbnRzID0ge307XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMud3JhcHBlckVsZW1lbnROYW1lKSkge1xyXG5cdFx0XHRzdHJ1Y3R1cmUuZWxlbWVudHNbdGhpcy53cmFwcGVyRWxlbWVudE5hbWUua2V5XSA9IHRoaXM7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmJ1aWxkU3RydWN0dXJlRWxlbWVudHMoY29udGV4dCwgc3RydWN0dXJlKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGJ1aWxkU3RydWN0dXJlRWxlbWVudHMgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdHRocm93IG5ldyBFcnJvcihcIkFic3RyYWN0IG1ldGhvZCBbYnVpbGRTdHJ1Y3R1cmVFbGVtZW50c10uXCIpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuQWJzdHJhY3RFbGVtZW50c1Byb3BlcnR5SW5mbydcclxufSk7XHJcblxyXG5Kc29uaXguTW9kZWwuRWxlbWVudFByb3BlcnR5SW5mbyA9IEpzb25peC5DbGFzcyhKc29uaXguTW9kZWwuQWJzdHJhY3RFbGVtZW50c1Byb3BlcnR5SW5mbywgSnNvbml4LkJpbmRpbmcuTWFyc2hhbGxzLkVsZW1lbnQsIHtcclxuXHR0eXBlSW5mbyA6ICdTdHJpbmcnLFxyXG5cdGVsZW1lbnROYW1lIDogbnVsbCxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdEpzb25peC5Nb2RlbC5BYnN0cmFjdEVsZW1lbnRzUHJvcGVydHlJbmZvLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFsgbWFwcGluZyBdKTtcclxuXHRcdHZhciB0aSA9IG1hcHBpbmcudHlwZUluZm8gfHwgbWFwcGluZy50aSB8fCAnU3RyaW5nJztcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHRpKSkge1xyXG5cdFx0XHR0aGlzLnR5cGVJbmZvID0gdGk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHRpKTtcclxuXHRcdFx0dGhpcy50eXBlSW5mbyA9IHRpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIGVuID0gbWFwcGluZy5lbGVtZW50TmFtZSB8fCBtYXBwaW5nLmVuIHx8IHVuZGVmaW5lZDtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KGVuKSkge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnROYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0KGVuKTtcclxuXHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhlbikpIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50TmFtZSA9IG5ldyBKc29uaXguWE1MLlFOYW1lKHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkksIGVuKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudE5hbWUgPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0aGlzLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJLCB0aGlzLm5hbWUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0VHlwZUluZm9CeUVsZW1lbnROYW1lIDogZnVuY3Rpb24oZWxlbWVudE5hbWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy50eXBlSW5mbztcclxuXHR9LFxyXG5cdGNvbnZlcnRUb1R5cGVkTmFtZWRWYWx1ZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRuYW1lIDogdGhpcy5lbGVtZW50TmFtZSxcclxuXHRcdFx0dmFsdWUgOiB2YWx1ZSxcclxuXHRcdFx0dHlwZUluZm8gOiB0aGlzLnR5cGVJbmZvXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0ZG9CdWlsZCA6IGZ1bmN0aW9uKGNvbnRleHQsIG1vZHVsZSkge1xyXG5cdFx0dGhpcy50eXBlSW5mbyA9IGNvbnRleHQucmVzb2x2ZVR5cGVJbmZvKHRoaXMudHlwZUluZm8sIG1vZHVsZSk7XHJcblx0fSxcclxuXHRidWlsZFN0cnVjdHVyZUVsZW1lbnRzIDogZnVuY3Rpb24oY29udGV4dCwgc3RydWN0dXJlKSB7XHJcblx0XHRzdHJ1Y3R1cmUuZWxlbWVudHNbdGhpcy5lbGVtZW50TmFtZS5rZXldID0gdGhpcztcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkVsZW1lbnRQcm9wZXJ0eUluZm8nXHJcbn0pO1xyXG5cclxuSnNvbml4Lk1vZGVsLkVsZW1lbnRzUHJvcGVydHlJbmZvID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5BYnN0cmFjdEVsZW1lbnRzUHJvcGVydHlJbmZvLCBKc29uaXguQmluZGluZy5NYXJzaGFsbHMuRWxlbWVudCwge1xyXG5cdGVsZW1lbnRUeXBlSW5mb3MgOiBudWxsLFxyXG5cdGVsZW1lbnRUeXBlSW5mb3NNYXAgOiBudWxsLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0SnNvbml4Lk1vZGVsLkFic3RyYWN0RWxlbWVudHNQcm9wZXJ0eUluZm8ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgWyBtYXBwaW5nIF0pO1xyXG5cdFx0dmFyIGV0aXMgPSBtYXBwaW5nLmVsZW1lbnRUeXBlSW5mb3MgfHwgbWFwcGluZy5ldGlzIHx8IFtdO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUFycmF5KGV0aXMpO1xyXG5cdFx0dGhpcy5lbGVtZW50VHlwZUluZm9zID0gW107XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgZXRpcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50VHlwZUluZm9zW2luZGV4XSA9IEpzb25peC5VdGlsLlR5cGUuY2xvbmVPYmplY3QoZXRpc1tpbmRleF0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0VHlwZUluZm9CeUVsZW1lbnROYW1lIDogZnVuY3Rpb24oZWxlbWVudE5hbWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5lbGVtZW50VHlwZUluZm9zTWFwW2VsZW1lbnROYW1lLmtleV07XHJcblx0fSxcclxuXHRjb252ZXJ0VG9UeXBlZE5hbWVkVmFsdWUgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudFR5cGVJbmZvcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0dmFyIGVsZW1lbnRUeXBlSW5mbyA9IHRoaXMuZWxlbWVudFR5cGVJbmZvc1tpbmRleF07XHJcblx0XHRcdHZhciB0eXBlSW5mbyA9IGVsZW1lbnRUeXBlSW5mby50eXBlSW5mbztcclxuXHRcdFx0aWYgKHR5cGVJbmZvLmlzSW5zdGFuY2UodmFsdWUsIGNvbnRleHQsIHNjb3BlKSkge1xyXG5cdFx0XHRcdHZhciBlbGVtZW50TmFtZSA9IGVsZW1lbnRUeXBlSW5mby5lbGVtZW50TmFtZTtcclxuXHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0bmFtZSA6IGVsZW1lbnROYW1lLFxyXG5cdFx0XHRcdFx0dmFsdWUgOiB2YWx1ZSxcclxuXHRcdFx0XHRcdHR5cGVJbmZvIDogdHlwZUluZm9cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBJZiB4c2k6dHlwZSBpcyBzdXBwb3J0ZWRcclxuXHRcdGlmIChjb250ZXh0LnN1cHBvcnRYc2lUeXBlKSB7XHJcblx0XHRcdC8vIEZpbmQgdGhlIGFjdHVhbCB0eXBlXHJcblx0XHRcdHZhciBhY3R1YWxUeXBlSW5mbyA9IGNvbnRleHQuZ2V0VHlwZUluZm9CeVZhbHVlKHZhbHVlKTtcclxuXHRcdFx0aWYgKGFjdHVhbFR5cGVJbmZvICYmIGFjdHVhbFR5cGVJbmZvLnR5cGVOYW1lKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgam5kZXggPSAwOyBqbmRleCA8IHRoaXMuZWxlbWVudFR5cGVJbmZvcy5sZW5ndGg7IGpuZGV4KyspIHtcclxuXHRcdFx0XHRcdHZhciBldGkgPSB0aGlzLmVsZW1lbnRUeXBlSW5mb3Nbam5kZXhdO1xyXG5cdFx0XHRcdFx0dmFyIHRpID0gZXRpLnR5cGVJbmZvO1xyXG5cdFx0XHRcdFx0Ly8gVE9ETyBDYW4gYmUgb3B0aW1pemVkXHJcblx0XHRcdFx0XHQvLyBGaW5kIGFuIGVsZW1lbnQgdHlwZSBpbmZvIHdoaWNoIGhhcyBhIHR5cGUgaW5mbyB0aGF0IGlzIGFcclxuXHRcdFx0XHRcdC8vIHN1cGVydHlwZSBvZiB0aGUgYWN0dWFsIHR5cGUgaW5mb1xyXG5cdFx0XHRcdFx0aWYgKGFjdHVhbFR5cGVJbmZvLmlzQmFzZWRPbih0aSkpIHtcclxuXHRcdFx0XHRcdFx0dmFyIGVuID0gZXRpLmVsZW1lbnROYW1lO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdFx0XHRcdG5hbWUgOiBlbixcclxuXHRcdFx0XHRcdFx0XHR2YWx1ZSA6IHZhbHVlLFxyXG5cdFx0XHRcdFx0XHRcdHR5cGVJbmZvIDogdGlcclxuXHRcdFx0XHRcdFx0fTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIFRPRE8gaGFybW9uaXplIGVycm9yIGhhbmRsaW5nLiBTZWUgYWxzbyBtYXJzaGFsbEVsZW1lbnQuIEVycm9yIG11c3RcclxuXHRcdC8vIG9ubHkgYmUgb24gb25lIHBsYWNlLlxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IGZpbmQgYW4gZWxlbWVudCB3aXRoIHR5cGUgaW5mbyBzdXBwb3J0aW5nIHRoZSB2YWx1ZSBbXCIgKyB2YWx1ZSArIFwiXS5cIik7XHJcblx0fSxcclxuXHRkb0J1aWxkIDogZnVuY3Rpb24oY29udGV4dCwgbW9kdWxlKSB7XHJcblx0XHR0aGlzLmVsZW1lbnRUeXBlSW5mb3NNYXAgPSB7fTtcclxuXHRcdHZhciBldGl0aSwgZXRpZW47XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50VHlwZUluZm9zLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHR2YXIgZWxlbWVudFR5cGVJbmZvID0gdGhpcy5lbGVtZW50VHlwZUluZm9zW2luZGV4XTtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChlbGVtZW50VHlwZUluZm8pO1xyXG5cdFx0XHRldGl0aSA9IGVsZW1lbnRUeXBlSW5mby50eXBlSW5mbyB8fCBlbGVtZW50VHlwZUluZm8udGkgfHwgJ1N0cmluZyc7XHJcblx0XHRcdGVsZW1lbnRUeXBlSW5mby50eXBlSW5mbyA9IGNvbnRleHQucmVzb2x2ZVR5cGVJbmZvKGV0aXRpLCBtb2R1bGUpO1xyXG5cdFx0XHRldGllbiA9IGVsZW1lbnRUeXBlSW5mby5lbGVtZW50TmFtZSB8fCBlbGVtZW50VHlwZUluZm8uZW4gfHwgdW5kZWZpbmVkO1xyXG5cdFx0XHRlbGVtZW50VHlwZUluZm8uZWxlbWVudE5hbWUgPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3RPclN0cmluZyhldGllbiwgY29udGV4dCwgdGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSk7XHJcblx0XHRcdHRoaXMuZWxlbWVudFR5cGVJbmZvc01hcFtlbGVtZW50VHlwZUluZm8uZWxlbWVudE5hbWUua2V5XSA9IGVsZW1lbnRUeXBlSW5mby50eXBlSW5mbztcclxuXHRcdH1cclxuXHR9LFxyXG5cdGJ1aWxkU3RydWN0dXJlRWxlbWVudHMgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRUeXBlSW5mb3MubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdHZhciBlbGVtZW50VHlwZUluZm8gPSB0aGlzLmVsZW1lbnRUeXBlSW5mb3NbaW5kZXhdO1xyXG5cdFx0XHRzdHJ1Y3R1cmUuZWxlbWVudHNbZWxlbWVudFR5cGVJbmZvLmVsZW1lbnROYW1lLmtleV0gPSB0aGlzO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuRWxlbWVudHNQcm9wZXJ0eUluZm8nXHJcbn0pO1xyXG5cclxuSnNvbml4Lk1vZGVsLkVsZW1lbnRNYXBQcm9wZXJ0eUluZm8gPSBKc29uaXguQ2xhc3MoSnNvbml4Lk1vZGVsLkFic3RyYWN0RWxlbWVudHNQcm9wZXJ0eUluZm8sIHtcclxuXHRlbGVtZW50TmFtZSA6IG51bGwsXHJcblx0a2V5IDogbnVsbCxcclxuXHR2YWx1ZSA6IG51bGwsXHJcblx0ZW50cnlUeXBlSW5mbyA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRKc29uaXguTW9kZWwuQWJzdHJhY3RFbGVtZW50c1Byb3BlcnR5SW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIG1hcHBpbmcgXSk7XHJcblx0XHQvLyBUT0RPIEVuc3VyZSBjb3JyZWN0IGFyZ3VtZW50XHJcblx0XHR2YXIgayA9IG1hcHBpbmcua2V5IHx8IG1hcHBpbmcuayB8fCB1bmRlZmluZWQ7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KGspO1xyXG5cdFx0dmFyIHYgPSBtYXBwaW5nLnZhbHVlIHx8IG1hcHBpbmcudiB8fCB1bmRlZmluZWQ7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHYpO1xyXG5cdFx0Ly8gVE9ETyBFbnN1cmUgY29ycmVjdCBhcmd1bWVudFxyXG5cdFx0dmFyIGVuID0gbWFwcGluZy5lbGVtZW50TmFtZSB8fCBtYXBwaW5nLmVuIHx8IHVuZGVmaW5lZDtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KGVuKSkge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnROYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0KGVuKTtcclxuXHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhlbikpIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50TmFtZSA9IG5ldyBKc29uaXguWE1MLlFOYW1lKHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkksIGVuKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudE5hbWUgPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0aGlzLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJLCB0aGlzLm5hbWUpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5lbnRyeVR5cGVJbmZvID0gbmV3IEpzb25peC5Nb2RlbC5DbGFzc0luZm8oe1xyXG5cdFx0XHRuYW1lIDogJ01hcDwnICsgay5uYW1lICsgJywnICsgdi5uYW1lICsgJz4nLFxyXG5cdFx0XHRwcm9wZXJ0eUluZm9zIDogWyBrLCB2IF1cclxuXHRcdH0pO1xyXG5cclxuXHR9LFxyXG5cdHVubWFyc2hhbCA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIHJlc3VsdCA9IG51bGw7XHJcblx0XHR2YXIgdGhhdCA9IHRoaXM7XHJcblx0XHR2YXIgY2FsbGJhY2sgPSBmdW5jdGlvbih2YWx1ZSkge1xyXG5cclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlKSkge1xyXG5cdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUsICdNYXAgcHJvcGVydHkgcmVxdWlyZXMgYW4gb2JqZWN0LicpO1xyXG5cdFx0XHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5leGlzdHMocmVzdWx0KSkge1xyXG5cdFx0XHRcdFx0cmVzdWx0ID0ge307XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdGZvciAoIHZhciBhdHRyaWJ1dGVOYW1lIGluIHZhbHVlKSB7XHJcblx0XHRcdFx0XHRpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoYXR0cmlidXRlTmFtZSkpIHtcclxuXHRcdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZVZhbHVlID0gdmFsdWVbYXR0cmlidXRlTmFtZV07XHJcblx0XHRcdFx0XHRcdGlmICh0aGF0LmNvbGxlY3Rpb24pIHtcclxuXHRcdFx0XHRcdFx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHJlc3VsdFthdHRyaWJ1dGVOYW1lXSkpIHtcclxuXHRcdFx0XHRcdFx0XHRcdHJlc3VsdFthdHRyaWJ1dGVOYW1lXSA9IFtdO1xyXG5cdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRyZXN1bHRbYXR0cmlidXRlTmFtZV0ucHVzaChhdHRyaWJ1dGVWYWx1ZSk7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhyZXN1bHRbYXR0cmlidXRlTmFtZV0pKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXN1bHRbYXR0cmlidXRlTmFtZV0gPSBhdHRyaWJ1dGVWYWx1ZTtcclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0Ly8gVE9ETyBSZXBvcnQgdmFsaWRhdGlvbiBlcnJvclxyXG5cdFx0XHRcdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVmFsdWUgd2FzIGFscmVhZHkgc2V0LlwiKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMud3JhcHBlckVsZW1lbnROYW1lKSkge1xyXG5cdFx0XHR0aGlzLnVubWFyc2hhbFdyYXBwZXJFbGVtZW50KGNvbnRleHQsIGlucHV0LCBzY29wZSwgY2FsbGJhY2spO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhpcy51bm1hcnNoYWxFbGVtZW50KGNvbnRleHQsIGlucHV0LCBzY29wZSwgY2FsbGJhY2spO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdGdldFR5cGVJbmZvQnlJbnB1dEVsZW1lbnQgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLmVudHJ5VHlwZUluZm87XHJcblx0fSxcclxuXHRjb252ZXJ0RnJvbVR5cGVkTmFtZWRWYWx1ZSA6IGZ1bmN0aW9uKGVsZW1lbnRWYWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgZW50cnkgPSBlbGVtZW50VmFsdWUudmFsdWU7XHJcblx0XHR2YXIgcmVzdWx0ID0ge307XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhlbnRyeVt0aGlzLmtleS5uYW1lXSkpIHtcclxuXHRcdFx0cmVzdWx0W2VudHJ5W3RoaXMua2V5Lm5hbWVdXSA9IGVudHJ5W3RoaXMudmFsdWUubmFtZV07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblx0bWFyc2hhbCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblxyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZSkpIHtcclxuXHRcdFx0Ly8gRG8gbm90aGluZ1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMud3JhcHBlckVsZW1lbnROYW1lKSkge1xyXG5cdFx0XHRvdXRwdXQud3JpdGVTdGFydEVsZW1lbnQodGhpcy53cmFwcGVyRWxlbWVudE5hbWUpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHRoaXMubWFyc2hhbEVsZW1lbnQodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSkpIHtcclxuXHRcdFx0b3V0cHV0LndyaXRlRW5kRWxlbWVudCgpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0bWFyc2hhbEVsZW1lbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0aWYgKCEhdmFsdWUpIHtcclxuXHRcdFx0Zm9yICggdmFyIGF0dHJpYnV0ZU5hbWUgaW4gdmFsdWUpIHtcclxuXHRcdFx0XHRpZiAodmFsdWUuaGFzT3duUHJvcGVydHkoYXR0cmlidXRlTmFtZSkpIHtcclxuXHRcdFx0XHRcdHZhciBhdHRyaWJ1dGVWYWx1ZSA9IHZhbHVlW2F0dHJpYnV0ZU5hbWVdO1xyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLmNvbGxlY3Rpb24pIHtcclxuXHRcdFx0XHRcdFx0dmFyIHNpbmdsZUVudHJ5ID0ge307XHJcblx0XHRcdFx0XHRcdHNpbmdsZUVudHJ5W3RoaXMua2V5Lm5hbWVdID0gYXR0cmlidXRlTmFtZTtcclxuXHRcdFx0XHRcdFx0c2luZ2xlRW50cnlbdGhpcy52YWx1ZS5uYW1lXSA9IGF0dHJpYnV0ZVZhbHVlO1xyXG5cdFx0XHRcdFx0XHRvdXRwdXQud3JpdGVTdGFydEVsZW1lbnQodGhpcy5lbGVtZW50TmFtZSk7XHJcblx0XHRcdFx0XHRcdHRoaXMuZW50cnlUeXBlSW5mby5tYXJzaGFsKHNpbmdsZUVudHJ5LCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdFx0XHRcdFx0b3V0cHV0LndyaXRlRW5kRWxlbWVudCgpO1xyXG5cclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBhdHRyaWJ1dGVWYWx1ZS5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdFx0XHR2YXIgY29sbGVjdGlvbkVudHJ5ID0ge307XHJcblx0XHRcdFx0XHRcdFx0Y29sbGVjdGlvbkVudHJ5W3RoaXMua2V5Lm5hbWVdID0gYXR0cmlidXRlTmFtZTtcclxuXHRcdFx0XHRcdFx0XHRjb2xsZWN0aW9uRW50cnlbdGhpcy52YWx1ZS5uYW1lXSA9IGF0dHJpYnV0ZVZhbHVlW2luZGV4XTtcclxuXHRcdFx0XHRcdFx0XHRvdXRwdXQud3JpdGVTdGFydEVsZW1lbnQodGhpcy5lbGVtZW50TmFtZSk7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5lbnRyeVR5cGVJbmZvLm1hcnNoYWwoY29sbGVjdGlvbkVudHJ5LCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdFx0XHRcdFx0XHRvdXRwdXQud3JpdGVFbmRFbGVtZW50KCk7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdGRvQnVpbGQgOiBmdW5jdGlvbihjb250ZXh0LCBtb2R1bGUpIHtcclxuXHRcdHRoaXMuZW50cnlUeXBlSW5mby5idWlsZChjb250ZXh0LCBtb2R1bGUpO1xyXG5cdFx0Ly8gVE9ETyBnZXQgcHJvcGVydHkgYnkgbmFtZVxyXG5cdFx0dGhpcy5rZXkgPSB0aGlzLmVudHJ5VHlwZUluZm8ucHJvcGVydGllc1swXTtcclxuXHRcdHRoaXMudmFsdWUgPSB0aGlzLmVudHJ5VHlwZUluZm8ucHJvcGVydGllc1sxXTtcclxuXHR9LFxyXG5cdGJ1aWxkU3RydWN0dXJlRWxlbWVudHMgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdHN0cnVjdHVyZS5lbGVtZW50c1t0aGlzLmVsZW1lbnROYW1lLmtleV0gPSB0aGlzO1xyXG5cdH0sXHJcblx0c2V0UHJvcGVydHkgOiBmdW5jdGlvbihvYmplY3QsIHZhbHVlKSB7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUsICdNYXAgcHJvcGVydHkgcmVxdWlyZXMgYW4gb2JqZWN0LicpO1xyXG5cdFx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG9iamVjdFt0aGlzLm5hbWVdKSkge1xyXG5cdFx0XHRcdG9iamVjdFt0aGlzLm5hbWVdID0ge307XHJcblx0XHRcdH1cclxuXHRcdFx0dmFyIG1hcCA9IG9iamVjdFt0aGlzLm5hbWVdO1xyXG5cdFx0XHRmb3IgKCB2YXIgYXR0cmlidXRlTmFtZSBpbiB2YWx1ZSkge1xyXG5cdFx0XHRcdGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShhdHRyaWJ1dGVOYW1lKSkge1xyXG5cdFx0XHRcdFx0dmFyIGF0dHJpYnV0ZVZhbHVlID0gdmFsdWVbYXR0cmlidXRlTmFtZV07XHJcblx0XHRcdFx0XHRpZiAodGhpcy5jb2xsZWN0aW9uKSB7XHJcblx0XHRcdFx0XHRcdGlmICghSnNvbml4LlV0aWwuVHlwZS5leGlzdHMobWFwW2F0dHJpYnV0ZU5hbWVdKSkge1xyXG5cdFx0XHRcdFx0XHRcdG1hcFthdHRyaWJ1dGVOYW1lXSA9IFtdO1xyXG5cdFx0XHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdFx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgYXR0cmlidXRlVmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0XHRcdFx0bWFwW2F0dHJpYnV0ZU5hbWVdLnB1c2goYXR0cmlidXRlVmFsdWVbaW5kZXhdKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdFx0bWFwW2F0dHJpYnV0ZU5hbWVdID0gYXR0cmlidXRlVmFsdWU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5FbGVtZW50TWFwUHJvcGVydHlJbmZvJ1xyXG59KTtcclxuXHJcbkpzb25peC5Nb2RlbC5BYnN0cmFjdEVsZW1lbnRSZWZzUHJvcGVydHlJbmZvID0gSnNvbml4LkNsYXNzKEpzb25peC5CaW5kaW5nLk1hcnNoYWxscy5FbGVtZW50LCBKc29uaXguQmluZGluZy5NYXJzaGFsbHMuRWxlbWVudC5Bc0VsZW1lbnRSZWYsIEpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxzLkVsZW1lbnQsIEpzb25peC5CaW5kaW5nLlVubWFyc2hhbGxzLldyYXBwZXJFbGVtZW50LCBKc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50LkFzRWxlbWVudFJlZiwgSnNvbml4Lk1vZGVsLlByb3BlcnR5SW5mbywge1xyXG5cdHdyYXBwZXJFbGVtZW50TmFtZSA6IG51bGwsXHJcblx0YWxsb3dEb20gOiB0cnVlLFxyXG5cdGFsbG93VHlwZWRPYmplY3QgOiB0cnVlLFxyXG5cdG1peGVkIDogdHJ1ZSxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nLCAnTWFwcGluZyBtdXN0IGJlIGFuIG9iamVjdC4nKTtcclxuXHRcdEpzb25peC5Nb2RlbC5Qcm9wZXJ0eUluZm8ucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcywgWyBtYXBwaW5nIF0pO1xyXG5cdFx0dmFyIHdlbiA9IG1hcHBpbmcud3JhcHBlckVsZW1lbnROYW1lIHx8IG1hcHBpbmcud2VuIHx8IHVuZGVmaW5lZDtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHdlbikpIHtcclxuXHRcdFx0dGhpcy53cmFwcGVyRWxlbWVudE5hbWUgPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3Qod2VuKTtcclxuXHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh3ZW4pKSB7XHJcblx0XHRcdHRoaXMud3JhcHBlckVsZW1lbnROYW1lID0gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSwgd2VuKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMud3JhcHBlckVsZW1lbnROYW1lID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdHZhciBkb20gPSBKc29uaXguVXRpbC5UeXBlLmRlZmF1bHRWYWx1ZShtYXBwaW5nLmFsbG93RG9tLCBtYXBwaW5nLmRvbSwgdHJ1ZSk7XHJcblx0XHR2YXIgdHlwZWQgPSBKc29uaXguVXRpbC5UeXBlLmRlZmF1bHRWYWx1ZShtYXBwaW5nLmFsbG93VHlwZWRPYmplY3QsIG1hcHBpbmcudHlwZWQsIHRydWUpO1xyXG5cdFx0dmFyIG14ID0gSnNvbml4LlV0aWwuVHlwZS5kZWZhdWx0VmFsdWUobWFwcGluZy5taXhlZCwgbWFwcGluZy5teCwgdHJ1ZSk7XHJcblx0XHR0aGlzLmFsbG93RG9tID0gZG9tO1xyXG5cdFx0dGhpcy5hbGxvd1R5cGVkT2JqZWN0ID0gdHlwZWQ7XHJcblx0XHR0aGlzLm1peGVkID0gbXg7XHJcblx0fSxcclxuXHR1bm1hcnNoYWwgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dmFyIGNhbGxiYWNrID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0aWYgKHRoYXQuY29sbGVjdGlvbikge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXN1bHQucHVzaCh2YWx1ZSk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IHZhbHVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBUT0RPIFJlcG9ydCB2YWxpZGF0aW9uIGVycm9yXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJWYWx1ZSBhbHJlYWR5IHNldC5cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBldCA9IGlucHV0LmV2ZW50VHlwZTtcclxuXHRcdGlmIChldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5TVEFSVF9FTEVNRU5UKSB7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSkpIHtcclxuXHRcdFx0XHR0aGlzLnVubWFyc2hhbFdyYXBwZXJFbGVtZW50KGNvbnRleHQsIGlucHV0LCBzY29wZSwgY2FsbGJhY2spO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHRoaXMudW5tYXJzaGFsRWxlbWVudChjb250ZXh0LCBpbnB1dCwgc2NvcGUsIGNhbGxiYWNrKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLm1peGVkICYmIChldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5DSEFSQUNURVJTIHx8IGV0ID09PSBKc29uaXguWE1MLklucHV0LkNEQVRBIHx8IGV0ID09PSBKc29uaXguWE1MLklucHV0LkVOVElUWV9SRUZFUkVOQ0UpKSB7XHJcblx0XHRcdGNhbGxiYWNrKGlucHV0LmdldFRleHQoKSk7XHJcblx0XHR9IGVsc2UgaWYgKGV0ID09PSBKc29uaXguWE1MLklucHV0LlNQQUNFIHx8IGV0ID09PSBKc29uaXguWE1MLklucHV0LkNPTU1FTlQgfHwgZXQgPT09IEpzb25peC5YTUwuSW5wdXQuUFJPQ0VTU0lOR19JTlNUUlVDVElPTikge1xyXG5cdFx0XHQvLyBTa2lwIHdoaXRlc3BhY2VcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbGxlZ2FsIHN0YXRlOiB1bmV4cGVjdGVkIGV2ZW50IHR5cGUgW1wiICsgZXQgKyBcIl0uXCIpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdG1hcnNoYWwgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZSkpIHtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMud3JhcHBlckVsZW1lbnROYW1lKSkge1xyXG5cdFx0XHRcdG91dHB1dC53cml0ZVN0YXJ0RWxlbWVudCh0aGlzLndyYXBwZXJFbGVtZW50TmFtZSk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICghdGhpcy5jb2xsZWN0aW9uKSB7XHJcblx0XHRcdFx0dGhpcy5tYXJzaGFsSXRlbSh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUFycmF5KHZhbHVlLCAnQ29sbGVjdGlvbiBwcm9wZXJ0eSByZXF1aXJlcyBhbiBhcnJheSB2YWx1ZS4nKTtcclxuXHRcdFx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0XHR2YXIgaXRlbSA9IHZhbHVlW2luZGV4XTtcclxuXHRcdFx0XHRcdHRoaXMubWFyc2hhbEl0ZW0oaXRlbSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModGhpcy53cmFwcGVyRWxlbWVudE5hbWUpKSB7XHJcblx0XHRcdFx0b3V0cHV0LndyaXRlRW5kRWxlbWVudCgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdH0sXHJcblx0bWFyc2hhbEl0ZW0gOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodmFsdWUpKSB7XHJcblx0XHRcdGlmICghdGhpcy5taXhlZCkge1xyXG5cdFx0XHRcdC8vIFRPRE9cclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJQcm9wZXJ0eSBpcyBub3QgbWl4ZWQsIGNhbid0IGhhbmRsZSBzdHJpbmcgdmFsdWVzLlwiKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvdXRwdXQud3JpdGVDaGFyYWN0ZXJzKHZhbHVlKTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIGlmICh0aGlzLmFsbG93RG9tICYmIEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLm5vZGVUeXBlKSkge1xyXG5cdFx0XHQvLyBET00gbm9kZVxyXG5cdFx0XHRvdXRwdXQud3JpdGVOb2RlKHZhbHVlKTtcclxuXHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh2YWx1ZSkpIHtcclxuXHRcdFx0dGhpcy5tYXJzaGFsRWxlbWVudCh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRoaXMubWl4ZWQpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJVbnN1cHBvcnRlZCBjb250ZW50IHR5cGUsIGVpdGhlciBvYmplY3RzIG9yIHN0cmluZ3MgYXJlIHN1cHBvcnRlZC5cIik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5zdXBwb3J0ZWQgY29udGVudCB0eXBlLCBvbmx5IG9iamVjdHMgYXJlIHN1cHBvcnRlZC5cIik7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHJcblx0fSxcclxuXHRnZXRUeXBlSW5mb0J5RWxlbWVudE5hbWUgOiBmdW5jdGlvbihlbGVtZW50TmFtZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHZhciBwcm9wZXJ0eUVsZW1lbnRUeXBlSW5mbyA9IHRoaXMuZ2V0UHJvcGVydHlFbGVtZW50VHlwZUluZm8oZWxlbWVudE5hbWUsIGNvbnRleHQpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHByb3BlcnR5RWxlbWVudFR5cGVJbmZvKSkge1xyXG5cdFx0XHRyZXR1cm4gcHJvcGVydHlFbGVtZW50VHlwZUluZm8udHlwZUluZm87XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR2YXIgY29udGV4dEVsZW1lbnRUeXBlSW5mbyA9IGNvbnRleHQuZ2V0RWxlbWVudEluZm8oZWxlbWVudE5hbWUsIHNjb3BlKTtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKGNvbnRleHRFbGVtZW50VHlwZUluZm8pKSB7XHJcblx0XHRcdFx0cmV0dXJuIGNvbnRleHRFbGVtZW50VHlwZUluZm8udHlwZUluZm87XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHVuZGVmaW5lZDtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0UHJvcGVydHlFbGVtZW50VHlwZUluZm8gOiBmdW5jdGlvbihlbGVtZW50TmFtZSwgY29udGV4dCkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQWJzdHJhY3QgbWV0aG9kIFtnZXRQcm9wZXJ0eUVsZW1lbnRUeXBlSW5mb10uXCIpO1xyXG5cdH0sXHJcblx0YnVpbGRTdHJ1Y3R1cmUgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3Qoc3RydWN0dXJlKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhzdHJ1Y3R1cmUudmFsdWUpKSB7XHJcblx0XHRcdC8vIFRPRE8gYmV0dGVyIGV4Y2VwdGlvblxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3RydWN0dXJlIGFscmVhZHkgZGVmaW5lcyBhIHZhbHVlIHByb3BlcnR5LlwiKTtcclxuXHRcdH0gZWxzZSBpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHN0cnVjdHVyZS5lbGVtZW50cykpIHtcclxuXHRcdFx0c3RydWN0dXJlLmVsZW1lbnRzID0ge307XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMud3JhcHBlckVsZW1lbnROYW1lKSkge1xyXG5cdFx0XHRzdHJ1Y3R1cmUuZWxlbWVudHNbdGhpcy53cmFwcGVyRWxlbWVudE5hbWUua2V5XSA9IHRoaXM7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmJ1aWxkU3RydWN0dXJlRWxlbWVudHMoY29udGV4dCwgc3RydWN0dXJlKTtcclxuXHRcdH1cclxuXHJcblx0XHQvLyBpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc3RydWN0dXJlLmVsZW1lbnRzW2tleV0pKVxyXG5cdFx0Ly8ge1xyXG5cdFx0Ly8gLy8gVE9ETyBiZXR0ZXIgZXhjZXB0aW9uXHJcblx0XHQvLyB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3RydWN0dXJlIGFscmVhZHkgZGVmaW5lcyBhbiBlbGVtZW50IGZvclxyXG5cdFx0Ly8gdGhlIGtleSBbXCJcclxuXHRcdC8vICsga2V5ICsgXCJdLlwiKTtcclxuXHRcdC8vIH0gZWxzZVxyXG5cdFx0Ly8ge1xyXG5cdFx0Ly8gc3RydWN0dXJlLmVsZW1lbnRzW2tleV0gPSB0aGlzO1xyXG5cdFx0Ly8gfVxyXG5cclxuXHRcdGlmICgodGhpcy5hbGxvd0RvbSB8fCB0aGlzLmFsbG93VHlwZWRPYmplY3QpKSB7XHJcblx0XHRcdHN0cnVjdHVyZS5hbnkgPSB0aGlzO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubWl4ZWQgJiYgIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMud3JhcHBlckVsZW1lbnROYW1lKSkge1xyXG5cdFx0XHQvLyBpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc3RydWN0dXJlLm1peGVkKSkge1xyXG5cdFx0XHQvLyAvLyBUT0RPIGJldHRlciBleGNlcHRpb25cclxuXHRcdFx0Ly8gdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0cnVjdHVyZSBhbHJlYWR5IGRlZmluZXMgdGhlIG1peGVkXHJcblx0XHRcdC8vIHByb3BlcnR5LlwiKTtcclxuXHRcdFx0Ly8gfSBlbHNlXHJcblx0XHRcdC8vIHtcclxuXHRcdFx0c3RydWN0dXJlLm1peGVkID0gdGhpcztcclxuXHRcdFx0Ly8gfVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0YnVpbGRTdHJ1Y3R1cmVFbGVtZW50cyA6IGZ1bmN0aW9uKGNvbnRleHQsIHN0cnVjdHVyZSkge1xyXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQWJzdHJhY3QgbWV0aG9kIFtidWlsZFN0cnVjdHVyZUVsZW1lbnRzXS5cIik7XHJcblx0fSxcclxuXHRidWlsZFN0cnVjdHVyZUVsZW1lbnRUeXBlSW5mb3MgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUsIGVsZW1lbnRUeXBlSW5mbykge1xyXG5cdFx0c3RydWN0dXJlLmVsZW1lbnRzW2VsZW1lbnRUeXBlSW5mby5lbGVtZW50TmFtZS5rZXldID0gdGhpcztcclxuXHRcdHZhciBzdWJzdGl0dXRpb25NZW1iZXJzID0gY29udGV4dC5nZXRTdWJzdGl0dXRpb25NZW1iZXJzKGVsZW1lbnRUeXBlSW5mby5lbGVtZW50TmFtZSk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc0FycmF5KHN1YnN0aXR1dGlvbk1lbWJlcnMpKSB7XHJcblx0XHRcdGZvciAodmFyIGpuZGV4ID0gMDsgam5kZXggPCBzdWJzdGl0dXRpb25NZW1iZXJzLmxlbmd0aDsgam5kZXgrKykge1xyXG5cdFx0XHRcdHZhciBzdWJzdGl0dXRpb25FbGVtZW50SW5mbyA9IHN1YnN0aXR1dGlvbk1lbWJlcnNbam5kZXhdO1xyXG5cdFx0XHRcdHRoaXMuYnVpbGRTdHJ1Y3R1cmVFbGVtZW50VHlwZUluZm9zKGNvbnRleHQsIHN0cnVjdHVyZSwgc3Vic3RpdHV0aW9uRWxlbWVudEluZm8pO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0fVxyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuQWJzdHJhY3RFbGVtZW50UmVmc1Byb3BlcnR5SW5mbydcclxufSk7XHJcbkpzb25peC5Nb2RlbC5FbGVtZW50UmVmUHJvcGVydHlJbmZvID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5BYnN0cmFjdEVsZW1lbnRSZWZzUHJvcGVydHlJbmZvLCB7XHJcblx0dHlwZUluZm8gOiAnU3RyaW5nJyxcclxuXHRlbGVtZW50TmFtZSA6IG51bGwsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRKc29uaXguTW9kZWwuQWJzdHJhY3RFbGVtZW50UmVmc1Byb3BlcnR5SW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIG1hcHBpbmcgXSk7XHJcblx0XHQvLyBUT0RPIEVuc3VyZSBjb3JyZWN0IGFyZ3VtZW50XHJcblx0XHR2YXIgdGkgPSBtYXBwaW5nLnR5cGVJbmZvIHx8IG1hcHBpbmcudGkgfHwgJ1N0cmluZyc7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh0aSkpIHtcclxuXHRcdFx0dGhpcy50eXBlSW5mbyA9IHRpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0aSk7XHJcblx0XHRcdHRoaXMudHlwZUluZm8gPSB0aTtcclxuXHRcdH1cclxuXHRcdHZhciBlbiA9IG1hcHBpbmcuZWxlbWVudE5hbWUgfHwgbWFwcGluZy5lbiB8fCB1bmRlZmluZWQ7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChlbikpIHtcclxuXHRcdFx0dGhpcy5lbGVtZW50TmFtZSA9IEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdChlbik7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcoZW4pKSB7XHJcblx0XHRcdHRoaXMuZWxlbWVudE5hbWUgPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0aGlzLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJLCBlbik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLmVsZW1lbnROYW1lID0gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSwgdGhpcy5uYW1lKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGdldFByb3BlcnR5RWxlbWVudFR5cGVJbmZvIDogZnVuY3Rpb24oZWxlbWVudE5hbWUsIGNvbnRleHQpIHtcclxuXHRcdHZhciBuYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0T3JTdHJpbmcoZWxlbWVudE5hbWUsIGNvbnRleHQpO1xyXG5cclxuXHRcdGlmIChuYW1lLmtleSA9PT0gdGhpcy5lbGVtZW50TmFtZS5rZXkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXM7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGRvQnVpbGQgOiBmdW5jdGlvbihjb250ZXh0LCBtb2R1bGUpIHtcclxuXHRcdHRoaXMudHlwZUluZm8gPSBjb250ZXh0LnJlc29sdmVUeXBlSW5mbyh0aGlzLnR5cGVJbmZvLCBtb2R1bGUpO1xyXG5cdH0sXHJcblx0YnVpbGRTdHJ1Y3R1cmVFbGVtZW50cyA6IGZ1bmN0aW9uKGNvbnRleHQsIHN0cnVjdHVyZSkge1xyXG5cdFx0dGhpcy5idWlsZFN0cnVjdHVyZUVsZW1lbnRUeXBlSW5mb3MoY29udGV4dCwgc3RydWN0dXJlLCB0aGlzKTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkVsZW1lbnRSZWZQcm9wZXJ0eUluZm8nXHJcbn0pO1xyXG5Kc29uaXguTW9kZWwuRWxlbWVudFJlZlByb3BlcnR5SW5mby5TaW1wbGlmaWVkID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5FbGVtZW50UmVmUHJvcGVydHlJbmZvLCBKc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50LkFzU2ltcGxpZmllZEVsZW1lbnRSZWYsIHtcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5FbGVtZW50UmVmUHJvcGVydHlJbmZvLlNpbXBsaWZpZWQnXHJcbn0pO1xyXG5Kc29uaXguTW9kZWwuRWxlbWVudFJlZnNQcm9wZXJ0eUluZm8gPSBKc29uaXguQ2xhc3MoSnNvbml4Lk1vZGVsLkFic3RyYWN0RWxlbWVudFJlZnNQcm9wZXJ0eUluZm8sIHtcclxuXHRlbGVtZW50VHlwZUluZm9zIDogbnVsbCxcclxuXHRlbGVtZW50VHlwZUluZm9zTWFwIDogbnVsbCxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdEpzb25peC5Nb2RlbC5BYnN0cmFjdEVsZW1lbnRSZWZzUHJvcGVydHlJbmZvLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFsgbWFwcGluZyBdKTtcclxuXHRcdC8vIFRPRE8gRW5zdXJlIGNvcnJlY3QgYXJndW1lbnRzXHJcblx0XHR2YXIgZXRpcyA9IG1hcHBpbmcuZWxlbWVudFR5cGVJbmZvcyB8fCBtYXBwaW5nLmV0aXMgfHwgW107XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlQXJyYXkoZXRpcyk7XHJcblx0XHR0aGlzLmVsZW1lbnRUeXBlSW5mb3MgPSBbXTtcclxuXHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBldGlzLmxlbmd0aDsgaW5kZXgrKylcclxuXHRcdHtcclxuXHRcdFx0dGhpcy5lbGVtZW50VHlwZUluZm9zW2luZGV4XSA9IEpzb25peC5VdGlsLlR5cGUuY2xvbmVPYmplY3QoZXRpc1tpbmRleF0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Z2V0UHJvcGVydHlFbGVtZW50VHlwZUluZm8gOiBmdW5jdGlvbihlbGVtZW50TmFtZSwgY29udGV4dCkge1xyXG5cdFx0dmFyIG5hbWUgPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3RPclN0cmluZyhlbGVtZW50TmFtZSwgY29udGV4dCk7XHJcblxyXG5cdFx0dmFyIHR5cGVJbmZvID0gdGhpcy5lbGVtZW50VHlwZUluZm9zTWFwW25hbWUua2V5XTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh0eXBlSW5mbykpIHtcclxuXHRcdFx0cmV0dXJuIHtcclxuXHRcdFx0XHRlbGVtZW50TmFtZSA6IG5hbWUsXHJcblx0XHRcdFx0dHlwZUluZm8gOiB0eXBlSW5mb1xyXG5cdFx0XHR9O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0fSxcclxuXHRkb0J1aWxkIDogZnVuY3Rpb24oY29udGV4dCwgbW9kdWxlKSB7XHJcblx0XHR0aGlzLmVsZW1lbnRUeXBlSW5mb3NNYXAgPSB7fTtcclxuXHRcdHZhciBldGl0aSwgZXRpZW47XHJcblx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5lbGVtZW50VHlwZUluZm9zLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHR2YXIgZWxlbWVudFR5cGVJbmZvID0gdGhpcy5lbGVtZW50VHlwZUluZm9zW2luZGV4XTtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChlbGVtZW50VHlwZUluZm8pO1xyXG5cdFx0XHRldGl0aSA9IGVsZW1lbnRUeXBlSW5mby50eXBlSW5mbyB8fCBlbGVtZW50VHlwZUluZm8udGkgfHwgJ1N0cmluZyc7XHJcblx0XHRcdGVsZW1lbnRUeXBlSW5mby50eXBlSW5mbyA9IGNvbnRleHQucmVzb2x2ZVR5cGVJbmZvKGV0aXRpLCBtb2R1bGUpO1xyXG5cdFx0XHRldGllbiA9IGVsZW1lbnRUeXBlSW5mby5lbGVtZW50TmFtZSB8fCBlbGVtZW50VHlwZUluZm8uZW4gfHwgdW5kZWZpbmVkO1xyXG5cdFx0XHRlbGVtZW50VHlwZUluZm8uZWxlbWVudE5hbWUgPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3RPclN0cmluZyhldGllbiwgY29udGV4dCwgdGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSk7XHJcblx0XHRcdHRoaXMuZWxlbWVudFR5cGVJbmZvc01hcFtlbGVtZW50VHlwZUluZm8uZWxlbWVudE5hbWUua2V5XSA9IGVsZW1lbnRUeXBlSW5mby50eXBlSW5mbztcclxuXHRcdH1cclxuXHR9LFxyXG5cdGJ1aWxkU3RydWN0dXJlRWxlbWVudHMgOiBmdW5jdGlvbihjb250ZXh0LCBzdHJ1Y3R1cmUpIHtcclxuXHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRUeXBlSW5mb3MubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdHZhciBlbGVtZW50VHlwZUluZm8gPSB0aGlzLmVsZW1lbnRUeXBlSW5mb3NbaW5kZXhdO1xyXG5cdFx0XHR0aGlzLmJ1aWxkU3RydWN0dXJlRWxlbWVudFR5cGVJbmZvcyhjb250ZXh0LCBzdHJ1Y3R1cmUsIGVsZW1lbnRUeXBlSW5mbyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5FbGVtZW50UmVmc1Byb3BlcnR5SW5mbydcclxufSk7XHJcbkpzb25peC5Nb2RlbC5FbGVtZW50UmVmc1Byb3BlcnR5SW5mby5TaW1wbGlmaWVkID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5FbGVtZW50UmVmc1Byb3BlcnR5SW5mbywgSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbHMuRWxlbWVudC5Bc1NpbXBsaWZpZWRFbGVtZW50UmVmLCB7XHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuRWxlbWVudFJlZnNQcm9wZXJ0eUluZm8uU2ltcGxpZmllZCdcclxufSk7XHJcblxyXG5Kc29uaXguTW9kZWwuQW55RWxlbWVudFByb3BlcnR5SW5mbyA9IEpzb25peC5DbGFzcyhKc29uaXguQmluZGluZy5NYXJzaGFsbHMuRWxlbWVudCwgSnNvbml4LkJpbmRpbmcuTWFyc2hhbGxzLkVsZW1lbnQuQXNFbGVtZW50UmVmLCBKc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50LCBKc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50LkFzRWxlbWVudFJlZiwgSnNvbml4Lk1vZGVsLlByb3BlcnR5SW5mbywge1xyXG5cdGFsbG93RG9tIDogdHJ1ZSxcclxuXHRhbGxvd1R5cGVkT2JqZWN0IDogdHJ1ZSxcclxuXHRtaXhlZCA6IHRydWUsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRKc29uaXguTW9kZWwuUHJvcGVydHlJbmZvLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFsgbWFwcGluZyBdKTtcclxuXHRcdHZhciBkb20gPSBKc29uaXguVXRpbC5UeXBlLmRlZmF1bHRWYWx1ZShtYXBwaW5nLmFsbG93RG9tLCBtYXBwaW5nLmRvbSwgdHJ1ZSk7XHJcblx0XHR2YXIgdHlwZWQgPSBKc29uaXguVXRpbC5UeXBlLmRlZmF1bHRWYWx1ZShtYXBwaW5nLmFsbG93VHlwZWRPYmplY3QsIG1hcHBpbmcudHlwZWQsIHRydWUpO1xyXG5cdFx0dmFyIG14ID0gSnNvbml4LlV0aWwuVHlwZS5kZWZhdWx0VmFsdWUobWFwcGluZy5taXhlZCwgbWFwcGluZy5teCwgdHJ1ZSk7XHJcblx0XHR0aGlzLmFsbG93RG9tID0gZG9tO1xyXG5cdFx0dGhpcy5hbGxvd1R5cGVkT2JqZWN0ID0gdHlwZWQ7XHJcblx0XHR0aGlzLm1peGVkID0gbXg7XHJcblx0fSxcclxuXHR1bm1hcnNoYWwgOiBmdW5jdGlvbihjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciByZXN1bHQgPSBudWxsO1xyXG5cdFx0dmFyIHRoYXQgPSB0aGlzO1xyXG5cdFx0dmFyIGNhbGxiYWNrID0gZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdFx0aWYgKHRoYXQuY29sbGVjdGlvbikge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IFtdO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXN1bHQucHVzaCh2YWx1ZSk7XHJcblxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChyZXN1bHQgPT09IG51bGwpIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9IHZhbHVlO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHQvLyBUT0RPIFJlcG9ydCB2YWxpZGF0aW9uIGVycm9yXHJcblx0XHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJWYWx1ZSBhbHJlYWR5IHNldC5cIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBldCA9IGlucHV0LmV2ZW50VHlwZTtcclxuXHRcdGlmIChldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5TVEFSVF9FTEVNRU5UKSB7XHJcblx0XHRcdHRoaXMudW5tYXJzaGFsRWxlbWVudChjb250ZXh0LCBpbnB1dCwgc2NvcGUsIGNhbGxiYWNrKTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5taXhlZCAmJiAoZXQgPT09IEpzb25peC5YTUwuSW5wdXQuQ0hBUkFDVEVSUyB8fCBldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5DREFUQSB8fCBldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5FTlRJVFlfUkVGRVJFTkNFKSkge1xyXG5cdFx0XHRjYWxsYmFjayhpbnB1dC5nZXRUZXh0KCkpO1xyXG5cdFx0fSBlbHNlIGlmICh0aGlzLm1peGVkICYmIChldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5TUEFDRSkpIHtcclxuXHRcdFx0Ly8gV2hpdGVzcGFjZVxyXG5cdFx0XHQvLyByZXR1cm4gbnVsbDtcclxuXHRcdH0gZWxzZSBpZiAoZXQgPT09IEpzb25peC5YTUwuSW5wdXQuQ09NTUVOVCB8fCBldCA9PT0gSnNvbml4LlhNTC5JbnB1dC5QUk9DRVNTSU5HX0lOU1RSVUNUSU9OKSB7XHJcblx0XHRcdC8vIHJldHVybiBudWxsO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Ly8gVE9ETyBiZXR0ZXIgZXhjZXB0aW9uXHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIklsbGVnYWwgc3RhdGU6IHVuZXhwZWN0ZWQgZXZlbnQgdHlwZSBbXCIgKyBldCArIFwiXS5cIik7XHJcblx0XHR9XHJcblxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdG1hcnNoYWwgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZSkpIHtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCF0aGlzLmNvbGxlY3Rpb24pIHtcclxuXHRcdFx0dGhpcy5tYXJzaGFsSXRlbSh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlQXJyYXkodmFsdWUpO1xyXG5cdFx0XHRmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgdmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0dGhpcy5tYXJzaGFsSXRlbSh2YWx1ZVtpbmRleF0sIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRtYXJzaGFsSXRlbSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRpZiAodGhpcy5taXhlZCAmJiBKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHZhbHVlKSkge1xyXG5cdFx0XHQvLyBNaXhlZFxyXG5cdFx0XHRvdXRwdXQud3JpdGVDaGFyYWN0ZXJzKHZhbHVlKTtcclxuXHRcdH0gZWxzZSBpZiAodGhpcy5hbGxvd0RvbSAmJiBKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5ub2RlVHlwZSkpIHtcclxuXHRcdFx0Ly8gRE9NIG5vZGVcclxuXHRcdFx0b3V0cHV0LndyaXRlTm9kZSh2YWx1ZSk7XHJcblxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRoaXMuYWxsb3dUeXBlZE9iamVjdCkge1xyXG5cdFx0XHRcdHRoaXMubWFyc2hhbEVsZW1lbnQodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRkb0J1aWxkIDogZnVuY3Rpb24oY29udGV4dCwgbW9kdWxlKSB7XHJcblx0XHQvLyBOb3RoaW5nIHRvIGRvXHJcblx0fSxcclxuXHRidWlsZFN0cnVjdHVyZSA6IGZ1bmN0aW9uKGNvbnRleHQsIHN0cnVjdHVyZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChzdHJ1Y3R1cmUpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHN0cnVjdHVyZS52YWx1ZSkpIHtcclxuXHRcdFx0Ly8gVE9ETyBiZXR0ZXIgZXhjZXB0aW9uXHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHJ1Y3R1cmUgYWxyZWFkeSBkZWZpbmVzIGEgdmFsdWUgcHJvcGVydHkuXCIpO1xyXG5cdFx0fSBlbHNlIGlmICghSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc3RydWN0dXJlLmVsZW1lbnRzKSkge1xyXG5cdFx0XHRzdHJ1Y3R1cmUuZWxlbWVudHMgPSB7fTtcclxuXHRcdH1cclxuXHJcblx0XHRpZiAoKHRoaXMuYWxsb3dEb20gfHwgdGhpcy5hbGxvd1R5cGVkT2JqZWN0KSkge1xyXG5cdFx0XHQvLyBpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc3RydWN0dXJlLmFueSkpIHtcclxuXHRcdFx0Ly8gLy8gVE9ETyBiZXR0ZXIgZXhjZXB0aW9uXHJcblx0XHRcdC8vIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHJ1Y3R1cmUgYWxyZWFkeSBkZWZpbmVzIHRoZSBhbnlcclxuXHRcdFx0Ly8gcHJvcGVydHkuXCIpO1xyXG5cdFx0XHQvLyB9IGVsc2VcclxuXHRcdFx0Ly8ge1xyXG5cdFx0XHRzdHJ1Y3R1cmUuYW55ID0gdGhpcztcclxuXHRcdFx0Ly8gfVxyXG5cdFx0fVxyXG5cdFx0aWYgKHRoaXMubWl4ZWQpIHtcclxuXHRcdFx0Ly8gaWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHN0cnVjdHVyZS5taXhlZCkpIHtcclxuXHRcdFx0Ly8gLy8gVE9ETyBiZXR0ZXIgZXhjZXB0aW9uXHJcblx0XHRcdC8vIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHJ1Y3R1cmUgYWxyZWFkeSBkZWZpbmVzIHRoZSBtaXhlZFxyXG5cdFx0XHQvLyBwcm9wZXJ0eS5cIik7XHJcblx0XHRcdC8vIH0gZWxzZVxyXG5cdFx0XHQvLyB7XHJcblx0XHRcdHN0cnVjdHVyZS5taXhlZCA9IHRoaXM7XHJcblx0XHRcdC8vIH1cclxuXHRcdH1cclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4Lk1vZGVsLkFueUVsZW1lbnRQcm9wZXJ0eUluZm8nXHJcbn0pO1xyXG5Kc29uaXguTW9kZWwuQW55RWxlbWVudFByb3BlcnR5SW5mby5TaW1wbGlmaWVkID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5BbnlFbGVtZW50UHJvcGVydHlJbmZvLCBKc29uaXguQmluZGluZy5Vbm1hcnNoYWxscy5FbGVtZW50LkFzU2ltcGxpZmllZEVsZW1lbnRSZWYsIHtcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5Nb2RlbC5BbnlFbGVtZW50UHJvcGVydHlJbmZvLlNpbXBsaWZpZWQnXHJcbn0pO1xyXG5Kc29uaXguTW9kZWwuTW9kdWxlID0gSnNvbml4LkNsYXNzKEpzb25peC5NYXBwaW5nLlN0eWxlZCwge1xyXG5cdG5hbWUgOiBudWxsLFxyXG5cdHR5cGVJbmZvcyA6IG51bGwsXHJcblx0ZWxlbWVudEluZm9zIDogbnVsbCxcclxuXHR0YXJnZXROYW1lc3BhY2UgOiAnJyxcclxuXHRkZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSA6ICcnLFxyXG5cdGRlZmF1bHRBdHRyaWJ1dGVOYW1lc3BhY2VVUkkgOiAnJyxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24obWFwcGluZywgb3B0aW9ucykge1xyXG5cdFx0SnNvbml4Lk1hcHBpbmcuU3R5bGVkLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFsgb3B0aW9ucyBdKTtcclxuXHRcdHRoaXMudHlwZUluZm9zID0gW107XHJcblx0XHR0aGlzLmVsZW1lbnRJbmZvcyA9IFtdO1xyXG5cdFx0aWYgKHR5cGVvZiBtYXBwaW5nICE9PSAndW5kZWZpbmVkJykge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0XHR2YXIgbiA9IG1hcHBpbmcubmFtZSB8fCBtYXBwaW5nLm4gfHwgbnVsbDtcclxuXHRcdFx0dGhpcy5uYW1lID0gbjtcclxuXHRcdFx0dmFyIGRlbnMgPSBtYXBwaW5nLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJIHx8IG1hcHBpbmcuZGVucyB8fCBtYXBwaW5nLnRhcmdldE5hbWVzcGFjZSB8fCBtYXBwaW5nLnRucyB8fCAnJztcclxuXHRcdFx0dGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSA9IGRlbnM7XHJcblx0XHRcdHZhciB0bnMgPSBtYXBwaW5nLnRhcmdldE5hbWVzcGFjZSB8fCBtYXBwaW5nLnRucyB8fCBtYXBwaW5nLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJIHx8IG1hcHBpbmcuZGVucyB8fCB0aGlzLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJO1xyXG5cdFx0XHR0aGlzLnRhcmdldE5hbWVzcGFjZSA9IHRucztcclxuXHRcdFx0dmFyIGRhbnMgPSBtYXBwaW5nLmRlZmF1bHRBdHRyaWJ1dGVOYW1lc3BhY2VVUkkgfHwgbWFwcGluZy5kYW5zIHx8ICcnO1xyXG5cdFx0XHR0aGlzLmRlZmF1bHRBdHRyaWJ1dGVOYW1lc3BhY2VVUkkgPSBkYW5zO1xyXG5cdFx0XHQvLyBJbml0aWFsaXplIHR5cGUgaW5mb3NcclxuXHRcdFx0dmFyIHRpcyA9IG1hcHBpbmcudHlwZUluZm9zIHx8IG1hcHBpbmcudGlzIHx8IFtdO1xyXG5cdFx0XHR0aGlzLmluaXRpYWxpemVUeXBlSW5mb3ModGlzKTtcclxuXHJcblx0XHRcdC8vIEJhY2t3YXJkcyBjb21wYXRpYmlsaXR5OiBjbGFzcyBpbmZvcyBjYW4gYWxzbyBiZSBkZWZpbmVkXHJcblx0XHRcdC8vIGFzIHByb3BlcnRpZXMgb2YgdGhlIHNjaGVtYSwgZm9yIGluc3RhbmNlIFNjaGVtYS5NeVR5cGVcclxuXHRcdFx0Zm9yICggdmFyIHR5cGVJbmZvTmFtZSBpbiBtYXBwaW5nKSB7XHJcblx0XHRcdFx0aWYgKG1hcHBpbmcuaGFzT3duUHJvcGVydHkodHlwZUluZm9OYW1lKSkge1xyXG5cdFx0XHRcdFx0aWYgKG1hcHBpbmdbdHlwZUluZm9OYW1lXSBpbnN0YW5jZW9mIHRoaXMubWFwcGluZ1N0eWxlLmNsYXNzSW5mbykge1xyXG5cdFx0XHRcdFx0XHR0aGlzLnR5cGVJbmZvcy5wdXNoKG1hcHBpbmdbdHlwZUluZm9OYW1lXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBlaXMgPSBtYXBwaW5nLmVsZW1lbnRJbmZvcyB8fCBtYXBwaW5nLmVpcyB8fCBbXTtcclxuXHRcdFx0Ly8gSW5pdGlhbGl6ZSBlbGVtZW50IGluZm9zXHJcblx0XHRcdHRoaXMuaW5pdGlhbGl6ZUVsZW1lbnRJbmZvcyhlaXMpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0aW5pdGlhbGl6ZVR5cGVJbmZvcyA6IGZ1bmN0aW9uKHR5cGVJbmZvTWFwcGluZ3MpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVBcnJheSh0eXBlSW5mb01hcHBpbmdzKTtcclxuXHRcdHZhciBpbmRleCwgdHlwZUluZm9NYXBwaW5nLCB0eXBlSW5mbztcclxuXHRcdGZvciAoaW5kZXggPSAwOyBpbmRleCA8IHR5cGVJbmZvTWFwcGluZ3MubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdHR5cGVJbmZvTWFwcGluZyA9IHR5cGVJbmZvTWFwcGluZ3NbaW5kZXhdO1xyXG5cdFx0XHR0eXBlSW5mbyA9IHRoaXMuY3JlYXRlVHlwZUluZm8odHlwZUluZm9NYXBwaW5nKTtcclxuXHRcdFx0dGhpcy50eXBlSW5mb3MucHVzaCh0eXBlSW5mbyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRpbml0aWFsaXplRWxlbWVudEluZm9zIDogZnVuY3Rpb24oZWxlbWVudEluZm9NYXBwaW5ncykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUFycmF5KGVsZW1lbnRJbmZvTWFwcGluZ3MpO1xyXG5cdFx0dmFyIGluZGV4LCBlbGVtZW50SW5mb01hcHBpbmcsIGVsZW1lbnRJbmZvO1xyXG5cdFx0Zm9yIChpbmRleCA9IDA7IGluZGV4IDwgZWxlbWVudEluZm9NYXBwaW5ncy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0ZWxlbWVudEluZm9NYXBwaW5nID0gZWxlbWVudEluZm9NYXBwaW5nc1tpbmRleF07XHJcblx0XHRcdGVsZW1lbnRJbmZvID0gdGhpcy5jcmVhdGVFbGVtZW50SW5mbyhlbGVtZW50SW5mb01hcHBpbmcpO1xyXG5cdFx0XHR0aGlzLmVsZW1lbnRJbmZvcy5wdXNoKGVsZW1lbnRJbmZvKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGNyZWF0ZVR5cGVJbmZvIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdHZhciB0eXBlSW5mbztcclxuXHRcdC8vIElmIG1hcHBpbmcgaXMgYWxyZWFkeSBhIHR5cGUgaW5mbywgZG8gbm90aGluZ1xyXG5cdFx0aWYgKG1hcHBpbmcgaW5zdGFuY2VvZiBKc29uaXguTW9kZWwuVHlwZUluZm8pIHtcclxuXHRcdFx0dHlwZUluZm8gPSBtYXBwaW5nO1xyXG5cdFx0fVxyXG5cdFx0Ly8gRWxzZSBjcmVhdGUgaXQgdmlhIGdlbmVyaWMgbWFwcGluZyBjb25maWd1cmF0aW9uXHJcblx0XHRlbHNlIHtcclxuXHRcdFx0bWFwcGluZyA9IEpzb25peC5VdGlsLlR5cGUuY2xvbmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRcdHZhciB0eXBlID0gbWFwcGluZy50eXBlIHx8IG1hcHBpbmcudCB8fCAnY2xhc3NJbmZvJztcclxuXHRcdFx0Ly8gTG9jYXRlIHRoZSBjcmVhdG9yIGZ1bmN0aW9uXHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzRnVuY3Rpb24odGhpcy50eXBlSW5mb0NyZWF0b3JzW3R5cGVdKSkge1xyXG5cdFx0XHRcdHZhciB0eXBlSW5mb0NyZWF0b3IgPSB0aGlzLnR5cGVJbmZvQ3JlYXRvcnNbdHlwZV07XHJcblx0XHRcdFx0Ly8gQ2FsbCB0aGUgY3JlYXRvciBmdW5jdGlvblxyXG5cdFx0XHRcdHR5cGVJbmZvID0gdHlwZUluZm9DcmVhdG9yLmNhbGwodGhpcywgbWFwcGluZyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiVW5rbm93biB0eXBlIGluZm8gdHlwZSBbXCIgKyB0eXBlICsgXCJdLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHR5cGVJbmZvO1xyXG5cdH0sXHJcblx0aW5pdGlhbGl6ZU5hbWVzIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0dmFyIGxuID0gbWFwcGluZy5sb2NhbE5hbWUgfHwgbWFwcGluZy5sbiB8fCBudWxsO1xyXG5cdFx0bWFwcGluZy5sb2NhbE5hbWUgPSBsbjtcclxuXHRcdHZhciBuID0gbWFwcGluZy5uYW1lIHx8IG1hcHBpbmcubiB8fCBudWxsO1xyXG5cdFx0bWFwcGluZy5uYW1lID0gbjtcclxuXHRcdC8vIENhbGN1bGF0ZSBib3RoIG5hbWUgYXMgd2VsbCBhcyBsb2NhbE5hbWVcclxuXHRcdC8vIG5hbWUgaXMgcHJvdmlkZWRcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKG1hcHBpbmcubmFtZSkpIHtcclxuXHRcdFx0Ly8gT2Jzb2xldGUgY29kZSBiZWxvd1xyXG5cdFx0XHQvLyAvLyBsb2NhbE5hbWUgaXMgbm90IHByb3ZpZGVkXHJcblx0XHRcdC8vIGlmICghSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhtYXBwaW5nLmxvY2FsTmFtZSkpIHtcclxuXHRcdFx0Ly8gLy8gQnV0IG1vZHVsZSBuYW1lIGlzIHByb3ZpZGVkXHJcblx0XHRcdC8vIGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHRoaXMubmFtZSkpIHtcclxuXHRcdFx0Ly8gLy8gSWYgbmFtZSBzdGFydHMgd2l0aCBtb2R1bGUgbmFtZSwgdXNlIHNlY29uZCBwYXJ0XHJcblx0XHRcdC8vIC8vIGFzIGxvY2FsIG5hbWVcclxuXHRcdFx0Ly8gaWYgKG1hcHBpbmcubmFtZS5pbmRleE9mKHRoaXMubmFtZSArICcuJykgPT09IDApIHtcclxuXHRcdFx0Ly8gbWFwcGluZy5sb2NhbE5hbWUgPSBtYXBwaW5nLm5hbWVcclxuXHRcdFx0Ly8gLnN1YnN0cmluZyh0aGlzLm5hbWUubGVuZ3RoICsgMSk7XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0Ly8gLy8gRWxzZSB1c2UgbmFtZSBhcyBsb2NhbCBuYW1lXHJcblx0XHRcdC8vIGVsc2Uge1xyXG5cdFx0XHQvLyBtYXBwaW5nLmxvY2FsTmFtZSA9IG1hcHBpbmcubmFtZTtcclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHQvLyB9XHJcblx0XHRcdC8vIC8vIE1vZHVsZSBuYW1lIGlzIG5vdCBwcm92aWRlZCwgdXNlIG5hbWUgYXMgbG9jYWwgbmFtZVxyXG5cdFx0XHQvLyBlbHNlIHtcclxuXHRcdFx0Ly8gbWFwcGluZy5sb2NhbE5hbWUgPSBtYXBwaW5nLm5hbWU7XHJcblx0XHRcdC8vIH1cclxuXHRcdFx0Ly8gfVxyXG5cdFx0XHRpZiAobWFwcGluZy5uYW1lLmxlbmd0aCA+IDAgJiYgbWFwcGluZy5uYW1lLmNoYXJBdCgwKSA9PT0gJy4nICYmIEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodGhpcy5uYW1lKSkge1xyXG5cdFx0XHRcdG1hcHBpbmcubmFtZSA9IHRoaXMubmFtZSArIG1hcHBpbmcubmFtZTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Ly8gbmFtZSBpcyBub3QgcHJvdmlkZWQgYnV0IGxvY2FsIG5hbWUgaXMgcHJvdmlkZWRcclxuXHRcdGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcobG4pKSB7XHJcblx0XHRcdC8vIE1vZHVsZSBuYW1lIGlzIHByb3ZpZGVkXHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHRoaXMubmFtZSkpIHtcclxuXHRcdFx0XHRtYXBwaW5nLm5hbWUgPSB0aGlzLm5hbWUgKyAnLicgKyBsbjtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBNb2R1bGUgbmFtZSBpcyBub3QgcHJvdmlkZWRcclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0bWFwcGluZy5uYW1lID0gbG47XHJcblx0XHRcdH1cclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcihcIk5laXRoZXIgW25hbWUvbl0gbm9yIFtsb2NhbE5hbWUvbG5dIHdhcyBwcm92aWRlZCBmb3IgdGhlIGNsYXNzIGluZm8uXCIpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0Y3JlYXRlQ2xhc3NJbmZvIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdChtYXBwaW5nKTtcclxuXHRcdHZhciBkZW5zID0gbWFwcGluZy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSB8fCBtYXBwaW5nLmRlbnMgfHwgdGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSTtcclxuXHRcdG1hcHBpbmcuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgPSBkZW5zO1xyXG5cdFx0dmFyIHRucyA9IG1hcHBpbmcudGFyZ2V0TmFtZXNwYWNlIHx8IG1hcHBpbmcudG5zIHx8IHRoaXMudGFyZ2V0TmFtZXNwYWNlO1xyXG5cdFx0bWFwcGluZy50YXJnZXROYW1lc3BhY2UgPSB0bnM7XHJcblx0XHR2YXIgZGFucyA9IG1hcHBpbmcuZGVmYXVsdEF0dHJpYnV0ZU5hbWVzcGFjZVVSSSB8fCBtYXBwaW5nLmRhbnMgfHwgdGhpcy5kZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJO1xyXG5cdFx0bWFwcGluZy5kZWZhdWx0QXR0cmlidXRlTmFtZXNwYWNlVVJJID0gZGFucztcclxuXHRcdHRoaXMuaW5pdGlhbGl6ZU5hbWVzKG1hcHBpbmcpO1xyXG5cdFx0Ly8gTm93IGJvdGggbmFtZSBhbiBsb2NhbCBuYW1lIGFyZSBpbml0aWFsaXplZFxyXG5cdFx0dmFyIGNsYXNzSW5mbyA9IG5ldyB0aGlzLm1hcHBpbmdTdHlsZS5jbGFzc0luZm8obWFwcGluZywge1xyXG5cdFx0XHRtYXBwaW5nU3R5bGUgOiB0aGlzLm1hcHBpbmdTdHlsZVxyXG5cdFx0fSk7XHJcblx0XHRjbGFzc0luZm8ubW9kdWxlID0gdGhpcztcclxuXHRcdHJldHVybiBjbGFzc0luZm87XHJcblx0fSxcclxuXHRjcmVhdGVFbnVtTGVhZkluZm8gOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0dGhpcy5pbml0aWFsaXplTmFtZXMobWFwcGluZyk7XHJcblx0XHQvLyBOb3cgYm90aCBuYW1lIGFuIGxvY2FsIG5hbWUgYXJlIGluaXRpYWxpemVkXHJcblx0XHR2YXIgZW51bUxlYWZJbmZvID0gbmV3IHRoaXMubWFwcGluZ1N0eWxlLmVudW1MZWFmSW5mbyhtYXBwaW5nLCB7XHJcblx0XHRcdG1hcHBpbmdTdHlsZSA6IHRoaXMubWFwcGluZ1N0eWxlXHJcblx0XHR9KTtcclxuXHRcdGVudW1MZWFmSW5mby5tb2R1bGUgPSB0aGlzO1xyXG5cdFx0cmV0dXJuIGVudW1MZWFmSW5mbztcclxuXHR9LFxyXG5cdGNyZWF0ZUxpc3QgOiBmdW5jdGlvbihtYXBwaW5nKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0dmFyIHRpID0gbWFwcGluZy5iYXNlVHlwZUluZm8gfHwgbWFwcGluZy50eXBlSW5mbyB8fCBtYXBwaW5nLmJ0aSB8fCBtYXBwaW5nLnRpIHx8ICdTdHJpbmcnO1xyXG5cdFx0dmFyIHRuID0gbWFwcGluZy50eXBlTmFtZSB8fCBtYXBwaW5nLnRuIHx8IG51bGw7XHJcblxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRuKSkge1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyh0bikpIHtcclxuXHRcdFx0XHR0biA9IG5ldyBKc29uaXguWE1MLlFOYW1lKHRoaXMudGFyZ2V0TmFtZXNwYWNlLCB0bik7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dG4gPSBKc29uaXguWE1MLlFOYW1lLmZyb21PYmplY3QodG4pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHR2YXIgcyA9IG1hcHBpbmcuc2VwYXJhdG9yIHx8IG1hcHBpbmcuc2VwIHx8ICcgJztcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVFeGlzdHModGkpO1xyXG5cdFx0dmFyIGxpc3RUeXBlSW5mbyA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KHRpLCB0biwgcyk7XHJcblx0XHRsaXN0VHlwZUluZm8ubW9kdWxlID0gdGhpcztcclxuXHRcdHJldHVybiBsaXN0VHlwZUluZm87XHJcblx0fSxcclxuXHRjcmVhdGVFbGVtZW50SW5mbyA6IGZ1bmN0aW9uKG1hcHBpbmcpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QobWFwcGluZyk7XHJcblx0XHRtYXBwaW5nID0gSnNvbml4LlV0aWwuVHlwZS5jbG9uZU9iamVjdChtYXBwaW5nKTtcclxuXHJcblx0XHR2YXIgZGVucyA9IG1hcHBpbmcuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkkgfHwgbWFwcGluZy5kZW5zIHx8IHRoaXMuZGVmYXVsdEVsZW1lbnROYW1lc3BhY2VVUkk7XHJcblx0XHRtYXBwaW5nLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJID0gZGVucztcclxuXHRcdHZhciBlbiA9IG1hcHBpbmcuZWxlbWVudE5hbWUgfHwgbWFwcGluZy5lbiB8fCB1bmRlZmluZWQ7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRXhpc3RzKGVuKTtcclxuXHJcblx0XHR2YXIgdGkgPSBtYXBwaW5nLnR5cGVJbmZvIHx8IG1hcHBpbmcudGkgfHwgJ1N0cmluZyc7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRXhpc3RzKHRpKTtcclxuXHJcblx0XHRtYXBwaW5nLnR5cGVJbmZvID0gdGk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdChlbikpIHtcclxuXHRcdFx0bWFwcGluZy5lbGVtZW50TmFtZSA9IEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdChlbik7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcoZW4pKSB7XHJcblx0XHRcdG1hcHBpbmcuZWxlbWVudE5hbWUgPSBuZXcgSnNvbml4LlhNTC5RTmFtZSh0aGlzLmRlZmF1bHRFbGVtZW50TmFtZXNwYWNlVVJJLCBlbik7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0VsZW1lbnQgaW5mbyBbJyArIG1hcHBpbmcgKyAnXSBtdXN0IHByb3ZpZGUgYW4gZWxlbWVudCBuYW1lLicpO1xyXG5cdFx0fVxyXG5cclxuXHRcdHZhciBzaCA9IG1hcHBpbmcuc3Vic3RpdHV0aW9uSGVhZCB8fCBtYXBwaW5nLnNoIHx8IG51bGw7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc2gpKSB7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHNoKSkge1xyXG5cdFx0XHRcdG1hcHBpbmcuc3Vic3RpdHV0aW9uSGVhZCA9IEpzb25peC5YTUwuUU5hbWUuZnJvbU9iamVjdChzaCk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhzaCk7XHJcblx0XHRcdFx0bWFwcGluZy5zdWJzdGl0dXRpb25IZWFkID0gbmV3IEpzb25peC5YTUwuUU5hbWUodGhpcy5kZWZhdWx0RWxlbWVudE5hbWVzcGFjZVVSSSwgc2gpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblxyXG5cdFx0dmFyIGVsZW1lbnRJbmZvID0gbmV3IHRoaXMubWFwcGluZ1N0eWxlLmVsZW1lbnRJbmZvKG1hcHBpbmcsIHtcclxuXHRcdFx0bWFwcGluZ1N0eWxlIDogdGhpcy5tYXBwaW5nU3R5bGVcclxuXHRcdH0pO1xyXG5cdFx0ZWxlbWVudEluZm8ubW9kdWxlID0gdGhpcztcclxuXHRcdHJldHVybiBlbGVtZW50SW5mbztcclxuXHR9LFxyXG5cdHJlZ2lzdGVyVHlwZUluZm9zIDogZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMudHlwZUluZm9zLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHR2YXIgdHlwZUluZm8gPSB0aGlzLnR5cGVJbmZvc1tpbmRleF07XHJcblx0XHRcdGNvbnRleHQucmVnaXN0ZXJUeXBlSW5mbyh0eXBlSW5mbywgdGhpcyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRidWlsZFR5cGVJbmZvcyA6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLnR5cGVJbmZvcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0dmFyIHR5cGVJbmZvID0gdGhpcy50eXBlSW5mb3NbaW5kZXhdO1xyXG5cdFx0XHR0eXBlSW5mby5idWlsZChjb250ZXh0LCB0aGlzKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdHJlZ2lzdGVyRWxlbWVudEluZm9zIDogZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFx0Zm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuZWxlbWVudEluZm9zLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHR2YXIgZWxlbWVudEluZm8gPSB0aGlzLmVsZW1lbnRJbmZvc1tpbmRleF07XHJcblx0XHRcdGNvbnRleHQucmVnaXN0ZXJFbGVtZW50SW5mbyhlbGVtZW50SW5mbywgdGhpcyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRidWlsZEVsZW1lbnRJbmZvcyA6IGZ1bmN0aW9uKGNvbnRleHQpIHtcclxuXHRcdGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCB0aGlzLmVsZW1lbnRJbmZvcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0dmFyIGVsZW1lbnRJbmZvID0gdGhpcy5lbGVtZW50SW5mb3NbaW5kZXhdO1xyXG5cdFx0XHRlbGVtZW50SW5mby5idWlsZChjb250ZXh0LCB0aGlzKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdC8vIE9ic29sZXRlLCByZXRhaW5lZCBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcclxuXHRjcyA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0cmV0dXJuIHRoaXM7XHJcblx0fSxcclxuXHQvLyBPYnNvbGV0ZSwgcmV0YWluZWQgZm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XHJcblx0ZXMgOiBmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguTW9kZWwuTW9kdWxlJ1xyXG59KTtcclxuSnNvbml4Lk1vZGVsLk1vZHVsZS5wcm90b3R5cGUudHlwZUluZm9DcmVhdG9ycyA9IHtcclxuXHRcImNsYXNzSW5mb1wiIDogSnNvbml4Lk1vZGVsLk1vZHVsZS5wcm90b3R5cGUuY3JlYXRlQ2xhc3NJbmZvLFxyXG5cdFwiY1wiIDogSnNvbml4Lk1vZGVsLk1vZHVsZS5wcm90b3R5cGUuY3JlYXRlQ2xhc3NJbmZvLFxyXG5cdFwiZW51bUluZm9cIiA6IEpzb25peC5Nb2RlbC5Nb2R1bGUucHJvdG90eXBlLmNyZWF0ZUVudW1MZWFmSW5mbyxcclxuXHRcImVudW1cIiA6IEpzb25peC5Nb2RlbC5Nb2R1bGUucHJvdG90eXBlLmNyZWF0ZUVudW1MZWFmSW5mbyxcclxuXHRcImxpc3RcIiA6IEpzb25peC5Nb2RlbC5Nb2R1bGUucHJvdG90eXBlLmNyZWF0ZUxpc3QsXHJcblx0XCJsXCIgOiBKc29uaXguTW9kZWwuTW9kdWxlLnByb3RvdHlwZS5jcmVhdGVMaXN0XHJcbn07XHJcbkpzb25peC5NYXBwaW5nLlN0eWxlLlN0YW5kYXJkID0gSnNvbml4LkNsYXNzKEpzb25peC5NYXBwaW5nLlN0eWxlLCB7XHJcblx0bWFyc2hhbGxlciA6IEpzb25peC5CaW5kaW5nLk1hcnNoYWxsZXIsXHJcblx0dW5tYXJzaGFsbGVyIDogSnNvbml4LkJpbmRpbmcuVW5tYXJzaGFsbGVyLFxyXG5cdG1vZHVsZSA6IEpzb25peC5Nb2RlbC5Nb2R1bGUsXHJcblx0ZWxlbWVudEluZm8gOiBKc29uaXguTW9kZWwuRWxlbWVudEluZm8sXHJcblx0Y2xhc3NJbmZvIDogSnNvbml4Lk1vZGVsLkNsYXNzSW5mbyxcclxuXHRlbnVtTGVhZkluZm8gOiBKc29uaXguTW9kZWwuRW51bUxlYWZJbmZvLFxyXG5cdGFueUF0dHJpYnV0ZVByb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5BbnlBdHRyaWJ1dGVQcm9wZXJ0eUluZm8sXHJcblx0YW55RWxlbWVudFByb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5BbnlFbGVtZW50UHJvcGVydHlJbmZvLFxyXG5cdGF0dHJpYnV0ZVByb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5BdHRyaWJ1dGVQcm9wZXJ0eUluZm8sXHJcblx0ZWxlbWVudE1hcFByb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5FbGVtZW50TWFwUHJvcGVydHlJbmZvLFxyXG5cdGVsZW1lbnRQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuRWxlbWVudFByb3BlcnR5SW5mbyxcclxuXHRlbGVtZW50c1Byb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5FbGVtZW50c1Byb3BlcnR5SW5mbyxcclxuXHRlbGVtZW50UmVmUHJvcGVydHlJbmZvIDogSnNvbml4Lk1vZGVsLkVsZW1lbnRSZWZQcm9wZXJ0eUluZm8sXHJcblx0ZWxlbWVudFJlZnNQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuRWxlbWVudFJlZnNQcm9wZXJ0eUluZm8sXHJcblx0dmFsdWVQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuVmFsdWVQcm9wZXJ0eUluZm8sXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0SnNvbml4Lk1hcHBpbmcuU3R5bGUucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcyk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5NYXBwaW5nLlN0eWxlLlN0YW5kYXJkJ1xyXG59KTtcclxuSnNvbml4Lk1hcHBpbmcuU3R5bGUuU1RZTEVTLnN0YW5kYXJkID0gbmV3IEpzb25peC5NYXBwaW5nLlN0eWxlLlN0YW5kYXJkKCk7XHJcblxyXG5Kc29uaXguTWFwcGluZy5TdHlsZS5TaW1wbGlmaWVkID0gSnNvbml4LkNsYXNzKEpzb25peC5NYXBwaW5nLlN0eWxlLCB7XHJcblx0bWFyc2hhbGxlciA6IEpzb25peC5CaW5kaW5nLk1hcnNoYWxsZXIuU2ltcGxpZmllZCxcclxuXHR1bm1hcnNoYWxsZXIgOiBKc29uaXguQmluZGluZy5Vbm1hcnNoYWxsZXIuU2ltcGxpZmllZCxcclxuXHRtb2R1bGUgOiBKc29uaXguTW9kZWwuTW9kdWxlLFxyXG5cdGVsZW1lbnRJbmZvIDogSnNvbml4Lk1vZGVsLkVsZW1lbnRJbmZvLFxyXG5cdGNsYXNzSW5mbyA6IEpzb25peC5Nb2RlbC5DbGFzc0luZm8sXHJcblx0ZW51bUxlYWZJbmZvIDogSnNvbml4Lk1vZGVsLkVudW1MZWFmSW5mbyxcclxuXHRhbnlBdHRyaWJ1dGVQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuQW55QXR0cmlidXRlUHJvcGVydHlJbmZvLlNpbXBsaWZpZWQsXHJcblx0YW55RWxlbWVudFByb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5BbnlFbGVtZW50UHJvcGVydHlJbmZvLlNpbXBsaWZpZWQsXHJcblx0YXR0cmlidXRlUHJvcGVydHlJbmZvIDogSnNvbml4Lk1vZGVsLkF0dHJpYnV0ZVByb3BlcnR5SW5mbyxcclxuXHRlbGVtZW50TWFwUHJvcGVydHlJbmZvIDogSnNvbml4Lk1vZGVsLkVsZW1lbnRNYXBQcm9wZXJ0eUluZm8sXHJcblx0ZWxlbWVudFByb3BlcnR5SW5mbyA6IEpzb25peC5Nb2RlbC5FbGVtZW50UHJvcGVydHlJbmZvLFxyXG5cdGVsZW1lbnRzUHJvcGVydHlJbmZvIDogSnNvbml4Lk1vZGVsLkVsZW1lbnRzUHJvcGVydHlJbmZvLFxyXG5cdGVsZW1lbnRSZWZQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuRWxlbWVudFJlZlByb3BlcnR5SW5mby5TaW1wbGlmaWVkLFxyXG5cdGVsZW1lbnRSZWZzUHJvcGVydHlJbmZvIDogSnNvbml4Lk1vZGVsLkVsZW1lbnRSZWZzUHJvcGVydHlJbmZvLlNpbXBsaWZpZWQsXHJcblx0dmFsdWVQcm9wZXJ0eUluZm8gOiBKc29uaXguTW9kZWwuVmFsdWVQcm9wZXJ0eUluZm8sXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0SnNvbml4Lk1hcHBpbmcuU3R5bGUucHJvdG90eXBlLmluaXRpYWxpemUuYXBwbHkodGhpcyk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5NYXBwaW5nLlN0eWxlLlNpbXBsaWZpZWQnXHJcbn0pO1xyXG5Kc29uaXguTWFwcGluZy5TdHlsZS5TVFlMRVMuc2ltcGxpZmllZCA9IG5ldyBKc29uaXguTWFwcGluZy5TdHlsZS5TaW1wbGlmaWVkKCk7XHJcblxyXG5Kc29uaXguU2NoZW1hLlhTRCA9IHt9O1xyXG5Kc29uaXguU2NoZW1hLlhTRC5OQU1FU1BBQ0VfVVJJID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDEvWE1MU2NoZW1hJztcclxuSnNvbml4LlNjaGVtYS5YU0QuUFJFRklYID0gJ3hzZCc7XHJcbkpzb25peC5TY2hlbWEuWFNELnFuYW1lID0gZnVuY3Rpb24obG9jYWxQYXJ0KSB7XHJcblx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhsb2NhbFBhcnQpO1xyXG5cdHJldHVybiBuZXcgSnNvbml4LlhNTC5RTmFtZShKc29uaXguU2NoZW1hLlhTRC5OQU1FU1BBQ0VfVVJJLCBsb2NhbFBhcnQsXHJcblx0XHRcdEpzb25peC5TY2hlbWEuWFNELlBSRUZJWCk7XHJcbn07XHJcblxyXG5Kc29uaXguU2NoZW1hLlhTRC5BbnlUeXBlID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5DbGFzc0luZm8sIHtcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdhbnlUeXBlJyksXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0SnNvbml4Lk1vZGVsLkNsYXNzSW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5jYWxsKHRoaXMsIHtcclxuXHRcdFx0bmFtZSA6ICdBbnlUeXBlJyxcclxuXHRcdFx0cHJvcGVydHlJbmZvcyA6IFsge1xyXG5cdFx0XHRcdHR5cGUgOiAnYW55QXR0cmlidXRlJyxcclxuXHRcdFx0XHRuYW1lIDogJ2F0dHJpYnV0ZXMnXHJcblx0XHRcdH0sIHtcclxuXHRcdFx0XHR0eXBlIDogJ2FueUVsZW1lbnQnLFxyXG5cdFx0XHRcdG5hbWUgOiAnY29udGVudCcsXHJcblx0XHRcdFx0Y29sbGVjdGlvbiA6IHRydWVcclxuXHRcdFx0fSBdXHJcblx0XHR9KTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuQW55VHlwZSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkFueVR5cGUuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuQW55VHlwZSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlID0gSnNvbml4LkNsYXNzKEpzb25peC5Nb2RlbC5UeXBlSW5mbywge1xyXG5cdG5hbWUgOiAnQW55U2ltcGxlVHlwZScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnYW55U2ltcGxlVHlwZScpLFxyXG5cdGluaXRpYWxpemUgOiBmdW5jdGlvbigpIHtcclxuXHRcdEpzb25peC5Nb2RlbC5UeXBlSW5mby5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbXSk7XHJcblx0fSxcdFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB2YWx1ZTtcclxuXHR9LFxyXG5cdHBhcnNlIDogZnVuY3Rpb24odGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGV4dDtcclxuXHR9LFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH0sXHJcblx0cmVwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHQvLyBPbmx5IHJlcHJpbnQgd2hlbiB0aGUgdmFsdWUgaXMgYSBzdHJpbmcgYnV0IG5vdCBhbiBpbnN0YW5jZVxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodmFsdWUpICYmICF0aGlzLmlzSW5zdGFuY2UodmFsdWUsIGNvbnRleHQsIHNjb3BlKSkge1xyXG5cdFx0XHQvLyBVc2luZyBudWxsIGFzIGlucHV0IGFzIGlucHV0IGlzIG5vdCBhdmFpbGFibGVcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnQodGhpcy5wYXJzZSh2YWx1ZSwgY29udGV4dCwgbnVsbCwgc2NvcGUpLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnQodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0dW5tYXJzaGFsIDogZnVuY3Rpb24oY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgdGV4dCA9IGlucHV0LmdldEVsZW1lbnRUZXh0KCk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuU3RyaW5nVXRpbHMuaXNOb3RCbGFuayh0ZXh0KSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZSh0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdG1hcnNoYWwgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlKSkge1xyXG5cdFx0XHRvdXRwdXQud3JpdGVDaGFyYWN0ZXJzKHRoaXMucmVwcmludCh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0YnVpbGQ6IGZ1bmN0aW9uKGNvbnRleHQsIG1vZHVsZSlcclxuXHR7XHJcblx0XHQvLyBOb3RoaW5nIHRvIGRvXHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTGlzdCA9IEpzb25peFxyXG5cdFx0LkNsYXNzKFxyXG5cdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUsXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0bmFtZSA6IG51bGwsXHJcblx0XHRcdFx0XHR0eXBlTmFtZSA6IG51bGwsXHJcblx0XHRcdFx0XHR0eXBlSW5mbyA6IG51bGwsXHJcblx0XHRcdFx0XHRzZXBhcmF0b3IgOiAnICcsXHJcblx0XHRcdFx0XHR0cmltbWVkU2VwYXJhdG9yIDogSnNvbml4LlV0aWwuU3RyaW5nVXRpbHMud2hpdGVzcGFjZUNoYXJhY3RlcnMsXHJcblx0XHRcdFx0XHRzaW1wbGVUeXBlIDogdHJ1ZSxcclxuXHRcdFx0XHRcdGJ1aWx0IDogZmFsc2UsXHJcblx0XHRcdFx0XHRpbml0aWFsaXplIDogZnVuY3Rpb24odHlwZUluZm8sIHR5cGVOYW1lLCBzZXBhcmF0b3IpIHtcclxuXHRcdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUV4aXN0cyh0eXBlSW5mbyk7XHJcblx0XHRcdFx0XHRcdC8vIFRPRE8gRW5zdXJlIGNvcnJlY3QgYXJndW1lbnRcclxuXHRcdFx0XHRcdFx0dGhpcy50eXBlSW5mbyA9IHR5cGVJbmZvO1xyXG5cdFx0XHRcdFx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHRoaXMubmFtZSkpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLm5hbWUgPSB0eXBlSW5mby5uYW1lICsgXCIqXCI7XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHR5cGVOYW1lKSkge1xyXG5cdFx0XHRcdFx0XHRcdC8vIFRPRE8gRW5zdXJlIGNvcnJlY3QgYXJndW1lbnRcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnR5cGVOYW1lID0gdHlwZU5hbWU7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHNlcGFyYXRvcikpIHtcclxuXHRcdFx0XHRcdFx0XHQvLyBUT0RPIEVuc3VyZSBjb3JyZWN0IGFyZ3VtZW50XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5zZXBhcmF0b3IgPSBzZXBhcmF0b3I7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy5zZXBhcmF0b3IgPSAnICc7XHJcblx0XHRcdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0XHRcdHZhciB0cmltbWVkU2VwYXJhdG9yID0gSnNvbml4LlV0aWwuU3RyaW5nVXRpbHNcclxuXHRcdFx0XHRcdFx0XHRcdC50cmltKHRoaXMuc2VwYXJhdG9yKTtcclxuXHRcdFx0XHRcdFx0aWYgKHRyaW1tZWRTZXBhcmF0b3IubGVuZ3RoID09PSAwKSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50cmltbWVkU2VwYXJhdG9yID0gSnNvbml4LlV0aWwuU3RyaW5nVXRpbHMud2hpdGVzcGFjZUNoYXJhY3RlcnM7XHJcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0dGhpcy50cmltbWVkU2VwYXJhdG9yID0gdHJpbW1lZFNlcGFyYXRvcjtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdGJ1aWxkIDogZnVuY3Rpb24oY29udGV4dCkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIXRoaXMuYnVpbHQpIHtcclxuXHRcdFx0XHRcdFx0XHR0aGlzLnR5cGVJbmZvID0gY29udGV4dC5yZXNvbHZlVHlwZUluZm8odGhpcy50eXBlSW5mbywgdGhpcy5tb2R1bGUpO1xyXG5cdFx0XHRcdFx0XHRcdHRoaXMuYnVpbHQgPSB0cnVlO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0XHRcdFx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlKSkge1xyXG5cdFx0XHRcdFx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdC8vIFRPRE8gRXhjZXB0aW9uIGlmIG5vdCBhbiBhcnJheVxyXG5cdFx0XHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlQXJyYXkodmFsdWUpO1xyXG5cdFx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gJyc7XHJcblx0XHRcdFx0XHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgdmFsdWUubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0XHRcdFx0aWYgKGluZGV4ID4gMCkge1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzdWx0ID0gcmVzdWx0ICsgdGhpcy5zZXBhcmF0b3I7XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdHJlc3VsdCA9IHJlc3VsdCArIHRoaXMudHlwZUluZm8ucmVwcmludCh2YWx1ZVtpbmRleF0sIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdHJldHVybiByZXN1bHQ7XHJcblx0XHRcdFx0XHR9LFxyXG5cdFx0XHRcdFx0cGFyc2UgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0ZXh0KTtcclxuXHRcdFx0XHRcdFx0dmFyIGl0ZW1zID0gSnNvbml4LlV0aWwuU3RyaW5nVXRpbHNcclxuXHRcdFx0XHRcdFx0XHRcdC5zcGxpdEJ5U2VwYXJhdG9yQ2hhcnModGV4dCxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR0aGlzLnRyaW1tZWRTZXBhcmF0b3IpO1xyXG5cdFx0XHRcdFx0XHR2YXIgcmVzdWx0ID0gW107XHJcblx0XHRcdFx0XHRcdGZvciAoIHZhciBpbmRleCA9IDA7IGluZGV4IDwgaXRlbXMubGVuZ3RoOyBpbmRleCsrKSB7XHJcblx0XHRcdFx0XHRcdFx0cmVzdWx0LnB1c2godGhpcy50eXBlSW5mb1xyXG5cdFx0XHRcdFx0XHRcdFx0XHQucGFyc2UoSnNvbml4LlV0aWwuU3RyaW5nVXRpbHMudHJpbShpdGVtc1tpbmRleF0pLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpKTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHRcdFx0fSxcclxuXHRcdFx0XHRcdC8vIFRPRE8gaXNJbnN0YW5jZT9cclxuXHRcdFx0XHRcdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuTGlzdCdcclxuXHRcdFx0XHR9KTtcclxuXHJcbkpzb25peC5TY2hlbWEuWFNELlN0cmluZyA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlLCB7XHJcblx0bmFtZSA6ICdTdHJpbmcnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ3N0cmluZycpLFxyXG5cdHVubWFyc2hhbCA6IGZ1bmN0aW9uKGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIHRleHQgPSBpbnB1dC5nZXRFbGVtZW50VGV4dCgpO1xyXG5cdFx0cmV0dXJuIHRoaXMucGFyc2UodGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHR9LFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodmFsdWUpO1xyXG5cdFx0cmV0dXJuIHZhbHVlO1xyXG5cdH0sXHJcblx0cGFyc2UgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHRyZXR1cm4gdGV4dDtcclxuXHR9LFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHZhbHVlKTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuU3RyaW5nJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuU3RyaW5nLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELlN0cmluZygpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5TdHJpbmcuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KFxyXG5cdFx0SnNvbml4LlNjaGVtYS5YU0QuU3RyaW5nLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuU3RyaW5ncyA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5MaXN0LCB7XHJcblx0bmFtZSA6ICdTdHJpbmdzJyxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24oKSB7XHJcblx0XHRKc29uaXguU2NoZW1hLlhTRC5MaXN0LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFsgSnNvbml4LlNjaGVtYS5YU0QuU3RyaW5nLklOU1RBTkNFLCBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnc3RyaW5ncycpLCAnICcgXSk7XHJcblx0fSxcclxuXHQvLyBUT0RPIENvbnN0cmFpbnRzXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5TdHJpbmdzJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuU3RyaW5ncy5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5TdHJpbmdzKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5vcm1hbGl6ZWRTdHJpbmcgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuU3RyaW5nLCB7XHJcblx0bmFtZSA6ICdOb3JtYWxpemVkU3RyaW5nJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdub3JtYWxpemVkU3RyaW5nJyksXHJcblx0Ly8gVE9ETyBDb25zdHJhaW50c1xyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuTm9ybWFsaXplZFN0cmluZydcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5vcm1hbGl6ZWRTdHJpbmcuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTm9ybWFsaXplZFN0cmluZygpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Ob3JtYWxpemVkU3RyaW5nLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5Ob3JtYWxpemVkU3RyaW5nLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVG9rZW4gPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuTm9ybWFsaXplZFN0cmluZywge1xyXG5cdG5hbWUgOiAnVG9rZW4nLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ3Rva2VuJyksXHJcblx0Ly8gVE9ETyBDb25zdHJhaW50c1xyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuVG9rZW4nXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Ub2tlbi5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5Ub2tlbigpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Ub2tlbi5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuVG9rZW4uSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5MYW5ndWFnZSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5Ub2tlbiwge1xyXG5cdG5hbWUgOiAnTGFuZ3VhZ2UnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2xhbmd1YWdlJyksXHJcblx0Ly8gVE9ETyBDb25zdHJhaW50c1xyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuTGFuZ3VhZ2UnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5MYW5ndWFnZS5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MYW5ndWFnZSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5MYW5ndWFnZS5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuTGFuZ3VhZ2UuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5OYW1lID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELlRva2VuLCB7XHJcblx0bmFtZSA6ICdOYW1lJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdOYW1lJyksXHJcblx0Ly8gVE9ETyBDb25zdHJhaW50c1xyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuTmFtZSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5hbWUuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTmFtZSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5OYW1lLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5OYW1lLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTkNOYW1lID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELk5hbWUsIHtcclxuXHRuYW1lIDogJ05DTmFtZScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnTkNOYW1lJyksXHJcblx0Ly8gVE9ETyBDb25zdHJhaW50c1xyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuTkNOYW1lJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTkNOYW1lLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELk5DTmFtZSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5OQ05hbWUuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELk5DTmFtZS5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5NVG9rZW4gPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuVG9rZW4sIHtcclxuXHRuYW1lIDogJ05NVG9rZW4nLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ05NVE9LRU4nKSxcclxuXHQvLyBUT0RPIENvbnN0cmFpbnRzXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5OTVRva2VuJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTk1Ub2tlbi5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5OTVRva2VuKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5NVG9rZW5zID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkxpc3QsIHtcclxuXHRuYW1lIDogJ05NVG9rZW5zJyxcclxuXHRpbml0aWFsaXplIDogZnVuY3Rpb24oKSB7XHJcblx0XHRKc29uaXguU2NoZW1hLlhTRC5MaXN0LnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFsgSnNvbml4LlNjaGVtYS5YU0QuTk1Ub2tlbi5JTlNUQU5DRSwgSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ05NVE9LRU4nKSwgJyAnIF0pO1xyXG5cdH0sXHJcblx0Ly8gVE9ETyBDb25zdHJhaW50c1xyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuTk1Ub2tlbnMnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5OTVRva2Vucy5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5OTVRva2VucygpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Cb29sZWFuID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUsIHtcclxuXHRuYW1lIDogJ0Jvb2xlYW4nLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2Jvb2xlYW4nKSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlQm9vbGVhbih2YWx1ZSk7XHJcblx0XHRyZXR1cm4gdmFsdWUgPyAndHJ1ZScgOiAnZmFsc2UnO1xyXG5cdH0sXHJcblx0cGFyc2UgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHRpZiAodGV4dCA9PT0gJ3RydWUnIHx8IHRleHQgPT09ICcxJykge1xyXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdH0gZWxzZSBpZiAodGV4dCA9PT0gJ2ZhbHNlJyB8fCB0ZXh0ID09PSAnMCcpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiRWl0aGVyIFt0cnVlXSwgWzFdLCBbMF0gb3IgW2ZhbHNlXSBleHBlY3RlZCBhcyBib29sZWFuIHZhbHVlLlwiKTtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzQm9vbGVhbih2YWx1ZSk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkJvb2xlYW4nXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Cb29sZWFuLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkJvb2xlYW4oKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQm9vbGVhbi5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuQm9vbGVhbi5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkJhc2U2NEJpbmFyeSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlLCB7XHJcblx0bmFtZSA6ICdCYXNlNjRCaW5hcnknLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2Jhc2U2NEJpbmFyeScpLFxyXG5cdGNoYXJUb0J5dGUgOiB7fSxcclxuXHRieXRlVG9DaGFyIDogW10sXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0SnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZS5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzKTtcclxuXHRcdC8vIEluaXRpYWxpemUgY2hhclRvQnl0ZSBhbmQgYnl0ZVRvQ2hhciB0YWJsZSBmb3IgZmFzdFxyXG5cdFx0Ly8gbG9va3Vwc1xyXG5cdFx0dmFyIGNoYXJUYWJsZSA9IFwiQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLz1cIjtcclxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgY2hhclRhYmxlLmxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBfY2hhciA9IGNoYXJUYWJsZS5jaGFyQXQoaSk7XHJcblx0XHRcdHZhciBfYnl0ZSA9IGNoYXJUYWJsZS5jaGFyQ29kZUF0KGkpO1xyXG5cdFx0XHR0aGlzLmJ5dGVUb0NoYXJbaV0gPSBfY2hhcjtcclxuXHRcdFx0dGhpcy5jaGFyVG9CeXRlW19jaGFyXSA9IGk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlQXJyYXkodmFsdWUpO1xyXG5cdFx0cmV0dXJuIHRoaXMuZW5jb2RlKHZhbHVlKTtcclxuXHR9LFxyXG5cclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0ZXh0KTtcclxuXHRcdHJldHVybiB0aGlzLmRlY29kZSh0ZXh0KTtcclxuXHR9LFxyXG5cdGVuY29kZSA6IGZ1bmN0aW9uKHVhcnJheSkge1xyXG5cdFx0dmFyIG91dHB1dCA9IFwiXCI7XHJcblx0XHR2YXIgYnl0ZTA7XHJcblx0XHR2YXIgYnl0ZTE7XHJcblx0XHR2YXIgYnl0ZTI7XHJcblx0XHR2YXIgY2hhcjA7XHJcblx0XHR2YXIgY2hhcjE7XHJcblx0XHR2YXIgY2hhcjI7XHJcblx0XHR2YXIgY2hhcjM7XHJcblx0XHR2YXIgaSA9IDA7XHJcblx0XHR2YXIgaiA9IDA7XHJcblx0XHR2YXIgbGVuZ3RoID0gdWFycmF5Lmxlbmd0aDtcclxuXHJcblx0XHRmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcclxuXHRcdFx0Ynl0ZTAgPSB1YXJyYXlbaV0gJiAweEZGO1xyXG5cdFx0XHRjaGFyMCA9IHRoaXMuYnl0ZVRvQ2hhcltieXRlMCA+PiAyXTtcclxuXHJcblx0XHRcdGlmIChpICsgMSA8IGxlbmd0aCkge1xyXG5cdFx0XHRcdGJ5dGUxID0gdWFycmF5W2kgKyAxXSAmIDB4RkY7XHJcblx0XHRcdFx0Y2hhcjEgPSB0aGlzLmJ5dGVUb0NoYXJbKChieXRlMCAmIDB4MDMpIDw8IDQpIHwgKGJ5dGUxID4+IDQpXTtcclxuXHRcdFx0XHRpZiAoaSArIDIgPCBsZW5ndGgpIHtcclxuXHRcdFx0XHRcdGJ5dGUyID0gdWFycmF5W2kgKyAyXSAmIDB4RkY7XHJcblx0XHRcdFx0XHRjaGFyMiA9IHRoaXMuYnl0ZVRvQ2hhclsoKGJ5dGUxICYgMHgwRikgPDwgMikgfCAoYnl0ZTIgPj4gNildO1xyXG5cdFx0XHRcdFx0Y2hhcjMgPSB0aGlzLmJ5dGVUb0NoYXJbYnl0ZTIgJiAweDNGXTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2hhcjIgPSB0aGlzLmJ5dGVUb0NoYXJbKGJ5dGUxICYgMHgwRikgPDwgMl07XHJcblx0XHRcdFx0XHRjaGFyMyA9IFwiPVwiO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjaGFyMSA9IHRoaXMuYnl0ZVRvQ2hhclsoYnl0ZTAgJiAweDAzKSA8PCA0XTtcclxuXHRcdFx0XHRjaGFyMiA9IFwiPVwiO1xyXG5cdFx0XHRcdGNoYXIzID0gXCI9XCI7XHJcblx0XHRcdH1cclxuXHRcdFx0b3V0cHV0ID0gb3V0cHV0ICsgY2hhcjAgKyBjaGFyMSArIGNoYXIyICsgY2hhcjM7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0ZGVjb2RlIDogZnVuY3Rpb24odGV4dCkge1xyXG5cclxuXHRcdGlucHV0ID0gdGV4dC5yZXBsYWNlKC9bXkEtWmEtejAtOVxcK1xcL1xcPV0vZywgXCJcIik7XHJcblxyXG5cdFx0dmFyIGxlbmd0aCA9IE1hdGguZmxvb3IoaW5wdXQubGVuZ3RoIC8gNCAqIDMpO1xyXG5cdFx0aWYgKGlucHV0LmNoYXJBdChpbnB1dC5sZW5ndGggLSAxKSA9PT0gXCI9XCIpIHtcclxuXHRcdFx0bGVuZ3RoLS07XHJcblx0XHR9XHJcblx0XHRpZiAoaW5wdXQuY2hhckF0KGlucHV0Lmxlbmd0aCAtIDIpID09PSBcIj1cIikge1xyXG5cdFx0XHRsZW5ndGgtLTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgdWFycmF5ID0gbmV3IEFycmF5KGxlbmd0aCk7XHJcblxyXG5cdFx0dmFyIGJ5dGUwO1xyXG5cdFx0dmFyIGJ5dGUxO1xyXG5cdFx0dmFyIGJ5dGUyO1xyXG5cdFx0dmFyIGNoYXIwO1xyXG5cdFx0dmFyIGNoYXIxO1xyXG5cdFx0dmFyIGNoYXIyO1xyXG5cdFx0dmFyIGNoYXIzO1xyXG5cdFx0dmFyIGkgPSAwO1xyXG5cdFx0dmFyIGogPSAwO1xyXG5cclxuXHRcdGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xyXG5cdFx0XHQvLyBnZXQgdGhlIDMgb2N0ZWN0cyBpbiA0IGFzY2lpIGNoYXJzXHJcblx0XHRcdGNoYXIwID0gdGhpcy5jaGFyVG9CeXRlW2lucHV0LmNoYXJBdChqKyspXTtcclxuXHRcdFx0Y2hhcjEgPSB0aGlzLmNoYXJUb0J5dGVbaW5wdXQuY2hhckF0KGorKyldO1xyXG5cdFx0XHRjaGFyMiA9IHRoaXMuY2hhclRvQnl0ZVtpbnB1dC5jaGFyQXQoaisrKV07XHJcblx0XHRcdGNoYXIzID0gdGhpcy5jaGFyVG9CeXRlW2lucHV0LmNoYXJBdChqKyspXTtcclxuXHJcblx0XHRcdGJ5dGUwID0gKGNoYXIwIDw8IDIpIHwgKGNoYXIxID4+IDQpO1xyXG5cdFx0XHRieXRlMSA9ICgoY2hhcjEgJiAweDBGKSA8PCA0KSB8IChjaGFyMiA+PiAyKTtcclxuXHRcdFx0Ynl0ZTIgPSAoKGNoYXIyICYgMHgwMykgPDwgNikgfCBjaGFyMztcclxuXHJcblx0XHRcdHVhcnJheVtpXSA9IGJ5dGUwO1xyXG5cdFx0XHRpZiAoY2hhcjIgIT0gNjQpIHtcclxuXHRcdFx0XHR1YXJyYXlbaSArIDFdID0gYnl0ZTE7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGNoYXIzICE9IDY0KSB7XHJcblx0XHRcdFx0dWFycmF5W2kgKyAyXSA9IGJ5dGUyO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdWFycmF5O1xyXG5cdH0sXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNBcnJheSh2YWx1ZSk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkJhc2U2NEJpbmFyeSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkJhc2U2NEJpbmFyeS5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5CYXNlNjRCaW5hcnkoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQmFzZTY0QmluYXJ5LklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5CYXNlNjRCaW5hcnkuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5IZXhCaW5hcnkgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZSwge1xyXG5cdG5hbWUgOiAnSGV4QmluYXJ5JyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdoZXhCaW5hcnknKSxcclxuXHRjaGFyVG9RdWFydGV0IDoge30sXHJcblx0Ynl0ZVRvRHVwbGV0IDogW10sXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0SnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZS5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzKTtcclxuXHRcdHZhciBjaGFyVGFibGVVcHBlckNhc2UgPSBcIjAxMjM0NTY3ODlBQkNERUZcIjtcclxuXHRcdHZhciBjaGFyVGFibGVMb3dlckNhc2UgPSBjaGFyVGFibGVVcHBlckNhc2UudG9Mb3dlckNhc2UoKTtcclxuXHRcdHZhciBpO1xyXG5cdFx0Zm9yIChpID0gMDsgaSA8IDE2OyBpKyspIHtcclxuXHRcdFx0dGhpcy5jaGFyVG9RdWFydGV0W2NoYXJUYWJsZVVwcGVyQ2FzZS5jaGFyQXQoaSldID0gaTtcclxuXHRcdFx0aWYgKGkgPj0gMHhBKSB7XHJcblx0XHRcdFx0dGhpcy5jaGFyVG9RdWFydGV0W2NoYXJUYWJsZUxvd2VyQ2FzZS5jaGFyQXQoaSldID0gaTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Zm9yIChpID0gMDsgaSA8IDI1NjsgaSsrKSB7XHJcblx0XHRcdHRoaXMuYnl0ZVRvRHVwbGV0W2ldID1cclxuXHRcdFx0Ly9cclxuXHRcdFx0Y2hhclRhYmxlVXBwZXJDYXNlW2kgPj4gNF0gKyBjaGFyVGFibGVVcHBlckNhc2VbaSAmIDB4Rl07XHJcblx0XHR9XHJcblx0fSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlQXJyYXkodmFsdWUpO1xyXG5cdFx0cmV0dXJuIHRoaXMuZW5jb2RlKHZhbHVlKTtcclxuXHR9LFxyXG5cclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0ZXh0KTtcclxuXHRcdHJldHVybiB0aGlzLmRlY29kZSh0ZXh0KTtcclxuXHR9LFxyXG5cdGVuY29kZSA6IGZ1bmN0aW9uKHVhcnJheSkge1xyXG5cdFx0dmFyIG91dHB1dCA9IFwiXCI7XHJcblx0XHRmb3IgKCB2YXIgaSA9IDA7IGkgPCB1YXJyYXkubGVuZ3RoOyBpKyspIHtcclxuXHRcdFx0b3V0cHV0ID0gb3V0cHV0ICsgdGhpcy5ieXRlVG9EdXBsZXRbdWFycmF5W2ldICYgMHhGRl07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gb3V0cHV0O1xyXG5cdH0sXHJcblx0ZGVjb2RlIDogZnVuY3Rpb24odGV4dCkge1xyXG5cdFx0dmFyIGlucHV0ID0gdGV4dC5yZXBsYWNlKC9bXkEtRmEtZjAtOV0vZywgXCJcIik7XHJcblx0XHQvLyBSb3VuZCBieSB0d29cclxuXHRcdHZhciBsZW5ndGggPSBpbnB1dC5sZW5ndGggPj4gMTtcclxuXHRcdHZhciB1YXJyYXkgPSBuZXcgQXJyYXkobGVuZ3RoKTtcclxuXHRcdGZvciAoIHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcblx0XHRcdHZhciBjaGFyMCA9IGlucHV0LmNoYXJBdCgyICogaSk7XHJcblx0XHRcdHZhciBjaGFyMSA9IGlucHV0LmNoYXJBdCgyICogaSArIDEpO1xyXG5cdFx0XHR1YXJyYXlbaV0gPSB0aGlzLmNoYXJUb1F1YXJ0ZXRbY2hhcjBdIDw8IDRcclxuXHRcdFx0XHRcdHwgdGhpcy5jaGFyVG9RdWFydGV0W2NoYXIxXTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB1YXJyYXk7XHJcblx0fSxcclxuXHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gSnNvbml4LlV0aWwuVHlwZS5pc0FycmF5KHZhbHVlKTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuSGV4QmluYXJ5J1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuSGV4QmluYXJ5LklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkhleEJpbmFyeSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5IZXhCaW5hcnkuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KFxyXG5cdFx0SnNvbml4LlNjaGVtYS5YU0QuSGV4QmluYXJ5LklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTnVtYmVyID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUsIHtcclxuXHRuYW1lIDogJ051bWJlcicsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnbnVtYmVyJyksXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlck9yTmFOKHZhbHVlKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTmFOKHZhbHVlKSkge1xyXG5cdFx0XHRyZXR1cm4gJ05hTic7XHJcblx0XHR9IGVsc2UgaWYgKHZhbHVlID09PSBJbmZpbml0eSkge1xyXG5cdFx0XHRyZXR1cm4gJ0lORic7XHJcblx0XHR9IGVsc2UgaWYgKHZhbHVlID09PSAtSW5maW5pdHkpIHtcclxuXHRcdFx0cmV0dXJuICctSU5GJztcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciB0ZXh0ID0gU3RyaW5nKHZhbHVlKTtcclxuXHRcdFx0cmV0dXJuIHRleHQ7XHJcblx0XHR9XHJcblx0fSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0ZXh0KTtcclxuXHRcdGlmICh0ZXh0ID09PSAnLUlORicpIHtcclxuXHRcdFx0cmV0dXJuIC1JbmZpbml0eTtcclxuXHRcdH0gZWxzZSBpZiAodGV4dCA9PT0gJ0lORicpIHtcclxuXHRcdFx0cmV0dXJuIEluZmluaXR5O1xyXG5cdFx0fSBlbHNlIGlmICh0ZXh0ID09PSAnTmFOJykge1xyXG5cdFx0XHRyZXR1cm4gTmFOO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHZhbHVlID0gTnVtYmVyKHRleHQpO1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlTnVtYmVyKHZhbHVlKTtcclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXJPck5hTih2YWx1ZSk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELk51bWJlcidcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk51bWJlci5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5OdW1iZXIoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTnVtYmVyLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5OdW1iZXIuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5GbG9hdCA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5OdW1iZXIsIHtcclxuXHRuYW1lIDogJ0Zsb2F0JyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdmbG9hdCcpLFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gLUluZmluaXR5IHx8IHZhbHVlID09PSBJbmZpbml0eSB8fCAoSnNvbml4LlV0aWwuVHlwZS5pc051bWJlcih2YWx1ZSkgJiYgdmFsdWUgPj0gdGhpcy5NSU5fVkFMVUUgJiYgdmFsdWUgPD0gdGhpcy5NQVhfVkFMVUUpO1xyXG5cdH0sXHJcblx0TUlOX1ZBTFVFIDogLTMuNDAyODIzNWUrMzgsXHJcblx0TUFYX1ZBTFVFIDogMy40MDI4MjM1ZSszOCxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkZsb2F0J1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRmxvYXQuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuRmxvYXQoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRmxvYXQuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkZsb2F0LklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRGVjaW1hbCA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlLCB7XHJcblx0bmFtZSA6ICdEZWNpbWFsJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdkZWNpbWFsJyksXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcih2YWx1ZSk7XHJcblx0XHR2YXIgdGV4dCA9IFN0cmluZyh2YWx1ZSk7XHJcblx0XHRyZXR1cm4gdGV4dDtcclxuXHR9LFxyXG5cdHBhcnNlIDogZnVuY3Rpb24odGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKHRleHQpO1xyXG5cdFx0dmFyIHZhbHVlID0gTnVtYmVyKHRleHQpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcih2YWx1ZSk7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fSxcclxuXHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gSnNvbml4LlV0aWwuVHlwZS5pc051bWJlcih2YWx1ZSk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkRlY2ltYWwnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5EZWNpbWFsLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkRlY2ltYWwoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRGVjaW1hbC5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuRGVjaW1hbC5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkludGVnZXIgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZSwge1xyXG5cdG5hbWUgOiAnSW50ZWdlcicsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnaW50ZWdlcicpLFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlKTtcclxuXHRcdHZhciB0ZXh0ID0gU3RyaW5nKHZhbHVlKTtcclxuXHRcdHJldHVybiB0ZXh0O1xyXG5cdH0sXHJcblx0cGFyc2UgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHR2YXIgdmFsdWUgPSBOdW1iZXIodGV4dCk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZSk7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fSxcclxuXHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlKSAmJiB2YWx1ZSA+PSB0aGlzLk1JTl9WQUxVRSAmJiB2YWx1ZSA8PSB0aGlzLk1BWF9WQUxVRTtcclxuXHR9LFxyXG5cdE1JTl9WQUxVRSA6IC05MjIzMzcyMDM2ODU0Nzc1ODA4LFxyXG5cdE1BWF9WQUxVRSA6IDkyMjMzNzIwMzY4NTQ3NzU4MDcsXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5JbnRlZ2VyJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuSW50ZWdlci5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5JbnRlZ2VyKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkludGVnZXIuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkludGVnZXIuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Ob25Qb3NpdGl2ZUludGVnZXIgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuSW50ZWdlciwge1xyXG5cdG5hbWUgOiAnTm9uUG9zaXRpdmVJbnRlZ2VyJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdub25Qb3NpdGl2ZUludGVnZXInKSxcclxuXHRNSU5fVkFMVUU6IC05MjIzMzcyMDM2ODU0Nzc1ODA4LFxyXG5cdE1BWF9WQUxVRTogMCxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELk5vblBvc2l0aXZlSW50ZWdlcidcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5vblBvc2l0aXZlSW50ZWdlci5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5Ob25Qb3NpdGl2ZUludGVnZXIoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTm9uUG9zaXRpdmVJbnRlZ2VyLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChcclxuXHRcdEpzb25peC5TY2hlbWEuWFNELk5vblBvc2l0aXZlSW50ZWdlci5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELk5lZ2F0aXZlSW50ZWdlciA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5Ob25Qb3NpdGl2ZUludGVnZXIsIHtcclxuXHRuYW1lIDogJ05lZ2F0aXZlSW50ZWdlcicsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnbmVnYXRpdmVJbnRlZ2VyJyksXHJcblx0TUlOX1ZBTFVFOiAtOTIyMzM3MjAzNjg1NDc3NTgwOCxcclxuXHRNQVhfVkFMVUU6IC0xLFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuTmVnYXRpdmVJbnRlZ2VyJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTmVnYXRpdmVJbnRlZ2VyLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELk5lZ2F0aXZlSW50ZWdlcigpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5OZWdhdGl2ZUludGVnZXIuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KFxyXG5cdFx0SnNvbml4LlNjaGVtYS5YU0QuTmVnYXRpdmVJbnRlZ2VyLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTG9uZyA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5JbnRlZ2VyLCB7XHJcblx0bmFtZSA6ICdMb25nJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdsb25nJyksXHJcblx0TUlOX1ZBTFVFIDogLTkyMjMzNzIwMzY4NTQ3NzU4MDgsXHJcblx0TUFYX1ZBTFVFIDogOTIyMzM3MjAzNjg1NDc3NTgwNyxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkxvbmcnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Mb25nLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxvbmcoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTG9uZy5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoXHJcblx0XHRKc29uaXguU2NoZW1hLlhTRC5Mb25nLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuSW50ID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkxvbmcsIHtcclxuXHRuYW1lIDogJ0ludCcsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnaW50JyksXHJcblx0TUlOX1ZBTFVFIDogLTIxNDc0ODM2NDgsXHJcblx0TUFYX1ZBTFVFIDogMjE0NzQ4MzY0NyxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkludCdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkludC5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5JbnQoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuSW50LklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChcclxuXHRcdEpzb25peC5TY2hlbWEuWFNELkludC5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlNob3J0ID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkludCwge1xyXG5cdG5hbWUgOiAnU2hvcnQnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ3Nob3J0JyksXHJcblx0TUlOX1ZBTFVFIDogLTMyNzY4LFxyXG5cdE1BWF9WQUxVRSA6IDMyNzY3LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuU2hvcnQnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5TaG9ydC5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5TaG9ydCgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5TaG9ydC5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuU2hvcnQuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5CeXRlID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELlNob3J0LCB7XHJcblx0bmFtZSA6ICdCeXRlJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdieXRlJyksXHJcblx0TUlOX1ZBTFVFIDogLTEyOCxcclxuXHRNQVhfVkFMVUUgOiAxMjcsXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5CeXRlJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQnl0ZS5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5CeXRlKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkJ5dGUuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkJ5dGUuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Ob25OZWdhdGl2ZUludGVnZXIgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuSW50ZWdlciwge1xyXG5cdG5hbWUgOiAnTm9uTmVnYXRpdmVJbnRlZ2VyJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdub25OZWdhdGl2ZUludGVnZXInKSxcclxuXHRNSU5fVkFMVUU6IDAsXHJcblx0TUFYX1ZBTFVFOiA5MjIzMzcyMDM2ODU0Nzc1ODA3LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuTm9uTmVnYXRpdmVJbnRlZ2VyJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuTm9uTmVnYXRpdmVJbnRlZ2VyLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELk5vbk5lZ2F0aXZlSW50ZWdlcigpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Ob25OZWdhdGl2ZUludGVnZXIuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KFxyXG5cdFx0SnNvbml4LlNjaGVtYS5YU0QuTm9uTmVnYXRpdmVJbnRlZ2VyLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRMb25nID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELk5vbk5lZ2F0aXZlSW50ZWdlciwge1xyXG5cdG5hbWUgOiAnVW5zaWduZWRMb25nJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCd1bnNpZ25lZExvbmcnKSxcclxuXHRNSU5fVkFMVUUgOiAwLFxyXG5cdE1BWF9WQUxVRSA6IDE4NDQ2NzQ0MDczNzA5NTUxNjE1LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRMb25nJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRMb25nLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkTG9uZygpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZExvbmcuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkTG9uZy5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkSW50ID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkTG9uZywge1xyXG5cdG5hbWUgOiAnVW5zaWduZWRJbnQnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ3Vuc2lnbmVkSW50JyksXHJcblx0TUlOX1ZBTFVFIDogMCxcclxuXHRNQVhfVkFMVUUgOiA0Mjk0OTY3Mjk1LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRJbnQnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZEludC5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZEludCgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZEludC5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRJbnQuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZFNob3J0ID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkSW50LCB7XHJcblx0bmFtZSA6ICdVbnNpZ25lZFNob3J0JyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCd1bnNpZ25lZFNob3J0JyksXHJcblx0TUlOX1ZBTFVFIDogMCxcclxuXHRNQVhfVkFMVUUgOiA2NTUzNSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkU2hvcnQnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZFNob3J0LklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkU2hvcnQoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRTaG9ydC5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRTaG9ydC5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkQnl0ZSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZFNob3J0LCB7XHJcblx0bmFtZSA6ICdVbnNpZ25lZEJ5dGUnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ3Vuc2lnbmVkQnl0ZScpLFxyXG5cdE1JTl9WQUxVRSA6IDAsXHJcblx0TUFYX1ZBTFVFIDogMjU1LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRCeXRlJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRCeXRlLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkQnl0ZSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5VbnNpZ25lZEJ5dGUuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkQnl0ZS5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlBvc2l0aXZlSW50ZWdlciA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5Ob25OZWdhdGl2ZUludGVnZXIsIHtcclxuXHRuYW1lIDogJ1Bvc2l0aXZlSW50ZWdlcicsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgncG9zaXRpdmVJbnRlZ2VyJyksXHJcblx0TUlOX1ZBTFVFIDogMSxcclxuXHRNQVhfVkFMVUUgOiA5MjIzMzcyMDM2ODU0Nzc1ODA3LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuUG9zaXRpdmVJbnRlZ2VyJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuUG9zaXRpdmVJbnRlZ2VyLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELlBvc2l0aXZlSW50ZWdlcigpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Qb3NpdGl2ZUludGVnZXIuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELlBvc2l0aXZlSW50ZWdlci5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRvdWJsZSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5OdW1iZXIsIHtcclxuXHRuYW1lIDogJ0RvdWJsZScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnZG91YmxlJyksXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSAtSW5maW5pdHkgfHwgdmFsdWUgPT09IEluZmluaXR5IHx8IChKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKHZhbHVlKSAmJiB2YWx1ZSA+PSB0aGlzLk1JTl9WQUxVRSAmJiB2YWx1ZSA8PSB0aGlzLk1BWF9WQUxVRSk7XHJcblx0fSxcclxuXHRNSU5fVkFMVUUgOiAtMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDgsXHJcblx0TUFYX1ZBTFVFIDogMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDgsXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5Eb3VibGUnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5Eb3VibGUuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuRG91YmxlKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRvdWJsZS5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuRG91YmxlLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQW55VVJJID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUsIHtcclxuXHRuYW1lIDogJ0FueVVSSScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnYW55VVJJJyksXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh2YWx1ZSk7XHJcblx0XHRyZXR1cm4gdmFsdWU7XHJcblx0fSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0ZXh0KTtcclxuXHRcdHJldHVybiB0ZXh0O1xyXG5cdH0sXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodmFsdWUpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5BbnlVUkknXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5BbnlVUkkuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuQW55VVJJKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkFueVVSSS5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuQW55VVJJLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuUU5hbWUgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZSwge1xyXG5cdG5hbWUgOiAnUU5hbWUnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ1FOYW1lJyksXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIHFOYW1lID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0KHZhbHVlKTtcclxuXHRcdHZhciBwcmVmaXg7XHJcblx0XHR2YXIgbG9jYWxQYXJ0ID0gcU5hbWUubG9jYWxQYXJ0O1xyXG5cdFx0aWYgKG91dHB1dCkge1xyXG5cdFx0XHQvLyBJZiBRTmFtZSBkb2VzIG5vdCBwcm92aWRlIHRoZSBwcmVmaXgsIGxldCBpdCBiZSBnZW5lcmF0ZWRcclxuXHRcdFx0cHJlZml4ID0gb3V0cHV0LmdldFByZWZpeChxTmFtZS5uYW1lc3BhY2VVUkksIHFOYW1lLnByZWZpeHx8bnVsbCk7XHJcblx0XHRcdG91dHB1dC5kZWNsYXJlTmFtZXNwYWNlKHFOYW1lLm5hbWVzcGFjZVVSSSwgcHJlZml4KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHByZWZpeCA9IHFOYW1lLnByZWZpeDtcclxuXHRcdH1cclxuXHRcdHJldHVybiAhcHJlZml4ID8gbG9jYWxQYXJ0IDogKHByZWZpeCArICc6JyArIGxvY2FsUGFydCk7XHJcblx0fSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodmFsdWUpO1xyXG5cdFx0dmFsdWUgPSBKc29uaXguVXRpbC5TdHJpbmdVdGlscy50cmltKHZhbHVlKTtcclxuXHRcdHZhciBwcmVmaXg7XHJcblx0XHR2YXIgbG9jYWxQYXJ0O1xyXG5cdFx0dmFyIGNvbG9uUG9zaXRpb24gPSB2YWx1ZS5pbmRleE9mKCc6Jyk7XHJcblx0XHRpZiAoY29sb25Qb3NpdGlvbiA9PT0gLTEpIHtcclxuXHRcdFx0cHJlZml4ID0gJyc7XHJcblx0XHRcdGxvY2FsUGFydCA9IHZhbHVlO1xyXG5cdFx0fSBlbHNlIGlmIChjb2xvblBvc2l0aW9uID4gMCAmJiBjb2xvblBvc2l0aW9uIDwgKHZhbHVlLmxlbmd0aCAtIDEpKSB7XHJcblx0XHRcdHByZWZpeCA9IHZhbHVlLnN1YnN0cmluZygwLCBjb2xvblBvc2l0aW9uKTtcclxuXHRcdFx0bG9jYWxQYXJ0ID0gdmFsdWUuc3Vic3RyaW5nKGNvbG9uUG9zaXRpb24gKyAxKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBRTmFtZSBbJyArIHZhbHVlICsgJ10uJyk7XHJcblx0XHR9XHJcblx0XHR2YXIgbmFtZXNwYWNlQ29udGV4dCA9IGlucHV0IHx8IGNvbnRleHQgfHwgbnVsbDtcclxuXHRcdGlmICghbmFtZXNwYWNlQ29udGV4dClcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIHZhbHVlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHR2YXIgbmFtZXNwYWNlVVJJID0gbmFtZXNwYWNlQ29udGV4dC5nZXROYW1lc3BhY2VVUkkocHJlZml4KTtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcobmFtZXNwYWNlVVJJKSlcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHJldHVybiBuZXcgSnNvbml4LlhNTC5RTmFtZShuYW1lc3BhY2VVUkksIGxvY2FsUGFydCwgcHJlZml4KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1ByZWZpeCBbJyArIHByZWZpeCArICddIG9mIHRoZSBRTmFtZSBbJyArIHZhbHVlICsgJ10gaXMgbm90IGJvdW5kIGluIHRoaXMgY29udGV4dC4nKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdH0sXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuICh2YWx1ZSBpbnN0YW5jZW9mIEpzb25peC5YTUwuUU5hbWUpIHx8IChKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHZhbHVlKSAmJiBKc29uaXguVXRpbC5UeXBlLmlzU3RyaW5nKHZhbHVlLmxvY2FsUGFydCB8fCB2YWx1ZS5scCkpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5RTmFtZSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlFOYW1lLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELlFOYW1lKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELlFOYW1lLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChcclxuXHRcdEpzb25peC5TY2hlbWEuWFNELlFOYW1lLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQW55U2ltcGxlVHlwZSwge1xyXG5cdG5hbWUgOiAnQ2FsZW5kYXInLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2NhbGVuZGFyJyksXHJcblx0cGFyc2UgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHRpZiAodGV4dC5tYXRjaChuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFURVRJTUVfUEFUVEVSTiArIFwiJFwiKSkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VEYXRlVGltZSh0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0fSBlbHNlIGlmICh0ZXh0Lm1hdGNoKG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5EQVRFX1BBVFRFUk4gKyBcIiRcIikpKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlRGF0ZSh0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0fSBlbHNlIGlmICh0ZXh0Lm1hdGNoKG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FX1BBVFRFUk4gKyBcIiRcIikpKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlVGltZSh0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0fSBlbHNlIGlmICh0ZXh0Lm1hdGNoKG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5HWUVBUl9NT05USF9QQVRURVJOICsgXCIkXCIpKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUdZZWFyTW9udGgodGV4dCwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHRcdH0gZWxzZSBpZiAodGV4dC5tYXRjaChuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR1lFQVJfUEFUVEVSTiArIFwiJFwiKSkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucGFyc2VHWWVhcih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0fSBlbHNlIGlmICh0ZXh0Lm1hdGNoKG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5HTU9OVEhfREFZX1BBVFRFUk4gKyBcIiRcIikpKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlR01vbnRoRGF5KHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSk7XHJcblx0XHR9IGVsc2UgaWYgKHRleHQubWF0Y2gobmV3IFJlZ0V4cChcIl5cIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkdNT05USF9QQVRURVJOICsgXCIkXCIpKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wYXJzZUdNb250aCh0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0fSBlbHNlIGlmICh0ZXh0Lm1hdGNoKG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5HREFZX1BBVFRFUk4gKyBcIiRcIikpKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnBhcnNlR0RheSh0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHRleHQgKyAnXSBkb2VzIG5vdCBtYXRjaCB4czpkYXRlVGltZSwgeHM6ZGF0ZSwgeHM6dGltZSwgeHM6Z1llYXJNb250aCwgeHM6Z1llYXIsIHhzOmdNb250aERheSwgeHM6Z01vbnRoIG9yIHhzOmdEYXkgcGF0dGVybnMuJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRwYXJzZUdZZWFyTW9udGggOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgZ1llYXJNb250aEV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR1lFQVJfTU9OVEhfUEFUVEVSTiArIFwiJFwiKTtcclxuXHRcdHZhciByZXN1bHRzID0gdmFsdWUubWF0Y2goZ1llYXJNb250aEV4cHJlc3Npb24pO1xyXG5cdFx0aWYgKHJlc3VsdHMgIT09IG51bGwpIHtcclxuXHRcdFx0dmFyIGRhdGEgPSB7XHJcblx0XHRcdFx0eWVhciA6IHBhcnNlSW50KHJlc3VsdHNbMV0sIDEwKSxcclxuXHRcdFx0XHRtb250aCA6IHBhcnNlSW50KHJlc3VsdHNbNV0sIDEwKSxcclxuXHRcdFx0XHR0aW1lem9uZSA6IHRoaXMucGFyc2VUaW1lem9uZVN0cmluZyhyZXN1bHRzWzddKVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXR1cm4gbmV3IEpzb25peC5YTUwuQ2FsZW5kYXIoZGF0YSk7XHJcblx0XHR9XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIFsnICsgdmFsdWUgKyAnXSBkb2VzIG5vdCBtYXRjaCB0aGUgeHM6Z1llYXJNb250aCBwYXR0ZXJuLicpO1xyXG5cdH0sXHJcblx0cGFyc2VHWWVhciA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciBnWWVhckV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR1lFQVJfUEFUVEVSTiArIFwiJFwiKTtcclxuXHRcdHZhciByZXN1bHRzID0gdmFsdWUubWF0Y2goZ1llYXJFeHByZXNzaW9uKTtcclxuXHRcdGlmIChyZXN1bHRzICE9PSBudWxsKSB7XHJcblx0XHRcdHZhciBkYXRhID0ge1xyXG5cdFx0XHRcdHllYXIgOiBwYXJzZUludChyZXN1bHRzWzFdLCAxMCksXHJcblx0XHRcdFx0dGltZXpvbmUgOiB0aGlzLnBhcnNlVGltZXpvbmVTdHJpbmcocmVzdWx0c1s1XSlcclxuXHRcdFx0fTtcclxuXHRcdFx0cmV0dXJuIG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHZhbHVlICsgJ10gZG9lcyBub3QgbWF0Y2ggdGhlIHhzOmdZZWFyIHBhdHRlcm4uJyk7XHJcblx0fSxcclxuXHRwYXJzZUdNb250aERheSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciBnTW9udGhEYXlFeHByZXNzaW9uID0gbmV3IFJlZ0V4cChcIl5cIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkdNT05USF9EQVlfUEFUVEVSTiArIFwiJFwiKTtcclxuXHRcdHZhciByZXN1bHRzID0gdmFsdWUubWF0Y2goZ01vbnRoRGF5RXhwcmVzc2lvbik7XHJcblx0XHRpZiAocmVzdWx0cyAhPT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgZGF0YSA9IHtcclxuXHRcdFx0XHRtb250aCA6IHBhcnNlSW50KHJlc3VsdHNbMl0sIDEwKSxcclxuXHRcdFx0XHRkYXkgOiBwYXJzZUludChyZXN1bHRzWzNdLCAxMCksXHJcblx0XHRcdFx0dGltZXpvbmUgOiB0aGlzLnBhcnNlVGltZXpvbmVTdHJpbmcocmVzdWx0c1s1XSlcclxuXHRcdFx0fTtcclxuXHRcdFx0cmV0dXJuIG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHZhbHVlICsgJ10gZG9lcyBub3QgbWF0Y2ggdGhlIHhzOmdNb250aERheSBwYXR0ZXJuLicpO1xyXG5cdH0sXHJcblx0cGFyc2VHTW9udGggOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgZ01vbnRoRXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5HTU9OVEhfUEFUVEVSTiArIFwiJFwiKTtcclxuXHRcdHZhciByZXN1bHRzID0gdmFsdWUubWF0Y2goZ01vbnRoRXhwcmVzc2lvbik7XHJcblx0XHRpZiAocmVzdWx0cyAhPT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgZGF0YSA9IHtcclxuXHRcdFx0XHRtb250aCA6IHBhcnNlSW50KHJlc3VsdHNbMl0sIDEwKSxcclxuXHRcdFx0XHR0aW1lem9uZSA6IHRoaXMucGFyc2VUaW1lem9uZVN0cmluZyhyZXN1bHRzWzNdKVxyXG5cdFx0XHR9O1xyXG5cdFx0XHRyZXR1cm4gbmV3IEpzb25peC5YTUwuQ2FsZW5kYXIoZGF0YSk7XHJcblx0XHR9XHJcblx0XHR0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIFsnICsgdmFsdWUgKyAnXSBkb2VzIG5vdCBtYXRjaCB0aGUgeHM6Z01vbnRoIHBhdHRlcm4uJyk7XHJcblx0fSxcclxuXHRwYXJzZUdEYXkgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgZ0RheUV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR0RBWV9QQVRURVJOICsgXCIkXCIpO1xyXG5cdFx0dmFyIHJlc3VsdHMgPSB2YWx1ZS5tYXRjaChnRGF5RXhwcmVzc2lvbik7XHJcblx0XHRpZiAocmVzdWx0cyAhPT0gbnVsbCkge1xyXG5cdFx0XHR2YXIgZGF0YSA9IHtcclxuXHRcdFx0XHRkYXkgOiBwYXJzZUludChyZXN1bHRzWzJdLCAxMCksXHJcblx0XHRcdFx0dGltZXpvbmUgOiB0aGlzLnBhcnNlVGltZXpvbmVTdHJpbmcocmVzdWx0c1szXSlcclxuXHRcdFx0fTtcclxuXHRcdFx0cmV0dXJuIG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHZhbHVlICsgJ10gZG9lcyBub3QgbWF0Y2ggdGhlIHhzOmdEYXkgcGF0dGVybi4nKTtcclxuXHR9LFxyXG5cdHBhcnNlRGF0ZVRpbWUgOiBmdW5jdGlvbih0ZXh0LCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVTdHJpbmcodGV4dCk7XHJcblx0XHR2YXIgZXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5EQVRFVElNRV9QQVRURVJOICsgXCIkXCIpO1xyXG5cdFx0dmFyIHJlc3VsdHMgPSB0ZXh0Lm1hdGNoKGV4cHJlc3Npb24pO1xyXG5cdFx0aWYgKHJlc3VsdHMgIT09IG51bGwpIHtcclxuXHRcdFx0dmFyIGRhdGEgPSB7XHJcblx0XHRcdFx0eWVhciA6IHBhcnNlSW50KHJlc3VsdHNbMV0sIDEwKSxcclxuXHRcdFx0XHRtb250aCA6IHBhcnNlSW50KHJlc3VsdHNbNV0sIDEwKSxcclxuXHRcdFx0XHRkYXkgOiBwYXJzZUludChyZXN1bHRzWzddLCAxMCksXHJcblx0XHRcdFx0aG91ciA6IHBhcnNlSW50KHJlc3VsdHNbOV0sIDEwKSxcclxuXHRcdFx0XHRtaW51dGUgOiBwYXJzZUludChyZXN1bHRzWzEwXSwgMTApLFxyXG5cdFx0XHRcdHNlY29uZCA6IHBhcnNlSW50KHJlc3VsdHNbMTFdLCAxMCksXHJcblx0XHRcdFx0ZnJhY3Rpb25hbFNlY29uZCA6IChyZXN1bHRzWzEyXSA/IHBhcnNlRmxvYXQocmVzdWx0c1sxMl0pIDogMCksXHJcblx0XHRcdFx0dGltZXpvbmUgOiB0aGlzLnBhcnNlVGltZXpvbmVTdHJpbmcocmVzdWx0c1sxNF0pXHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiBuZXcgSnNvbml4LlhNTC5DYWxlbmRhcihkYXRhKTtcclxuXHRcdH1cclxuXHRcdHRocm93IG5ldyBFcnJvcignVmFsdWUgWycgKyB0ZXh0ICsgJ10gZG9lcyBub3QgbWF0Y2ggdGhlIHhzOmRhdGUgcGF0dGVybi4nKTtcclxuXHR9LFxyXG5cdHBhcnNlRGF0ZSA6IGZ1bmN0aW9uKHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0ZXh0KTtcclxuXHRcdHZhciBleHByZXNzaW9uID0gbmV3IFJlZ0V4cChcIl5cIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkRBVEVfUEFUVEVSTiArIFwiJFwiKTtcclxuXHRcdHZhciByZXN1bHRzID0gdGV4dC5tYXRjaChleHByZXNzaW9uKTtcclxuXHRcdGlmIChyZXN1bHRzICE9PSBudWxsKSB7XHJcblx0XHRcdHZhciBkYXRhID0ge1xyXG5cdFx0XHRcdHllYXIgOiBwYXJzZUludChyZXN1bHRzWzFdLCAxMCksXHJcblx0XHRcdFx0bW9udGggOiBwYXJzZUludChyZXN1bHRzWzVdLCAxMCksXHJcblx0XHRcdFx0ZGF5IDogcGFyc2VJbnQocmVzdWx0c1s3XSwgMTApLFxyXG5cdFx0XHRcdHRpbWV6b25lIDogdGhpcy5wYXJzZVRpbWV6b25lU3RyaW5nKHJlc3VsdHNbOV0pXHJcblx0XHRcdH07XHJcblx0XHRcdHJldHVybiBuZXcgSnNvbml4LlhNTC5DYWxlbmRhcihkYXRhKTtcclxuXHRcdH1cclxuXHRcdHRocm93IG5ldyBFcnJvcignVmFsdWUgWycgKyB0ZXh0ICsgJ10gZG9lcyBub3QgbWF0Y2ggdGhlIHhzOmRhdGUgcGF0dGVybi4nKTtcclxuXHR9LFxyXG5cdHBhcnNlVGltZSA6IGZ1bmN0aW9uKHRleHQsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyh0ZXh0KTtcclxuXHRcdHZhciBleHByZXNzaW9uID0gbmV3IFJlZ0V4cChcIl5cIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlRJTUVfUEFUVEVSTiArIFwiJFwiKTtcclxuXHRcdHZhciByZXN1bHRzID0gdGV4dC5tYXRjaChleHByZXNzaW9uKTtcclxuXHRcdGlmIChyZXN1bHRzICE9PSBudWxsKSB7XHJcblx0XHRcdHZhciBkYXRhID0ge1xyXG5cdFx0XHRcdGhvdXIgOiBwYXJzZUludChyZXN1bHRzWzFdLCAxMCksXHJcblx0XHRcdFx0bWludXRlIDogcGFyc2VJbnQocmVzdWx0c1syXSwgMTApLFxyXG5cdFx0XHRcdHNlY29uZCA6IHBhcnNlSW50KHJlc3VsdHNbM10sIDEwKSxcclxuXHRcdFx0XHRmcmFjdGlvbmFsU2Vjb25kIDogKHJlc3VsdHNbNF0gPyBwYXJzZUZsb2F0KHJlc3VsdHNbNF0pIDogMCksXHJcblx0XHRcdFx0dGltZXpvbmUgOiB0aGlzLnBhcnNlVGltZXpvbmVTdHJpbmcocmVzdWx0c1s2XSlcclxuXHRcdFx0fTtcclxuXHRcdFx0cmV0dXJuIG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKGRhdGEpO1xyXG5cdFx0fVxyXG5cdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHRleHQgKyAnXSBkb2VzIG5vdCBtYXRjaCB0aGUgeHM6dGltZSBwYXR0ZXJuLicpO1xyXG5cdH0sXHJcblx0cGFyc2VUaW1lem9uZVN0cmluZyA6IGZ1bmN0aW9uKHRleHQpIHtcclxuXHRcdC8vICgoJysnIHwgJy0nKSBoaCAnOicgbW0pIHwgJ1onXHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodGV4dCkpIHtcclxuXHRcdFx0cmV0dXJuIE5hTjtcclxuXHRcdH0gZWxzZSBpZiAodGV4dCA9PT0gJycpIHtcclxuXHRcdFx0cmV0dXJuIE5hTjtcclxuXHRcdH0gZWxzZSBpZiAodGV4dCA9PT0gJ1onKSB7XHJcblx0XHRcdHJldHVybiAwO1xyXG5cdFx0fSBlbHNlIGlmICh0ZXh0ID09PSAnKzE0OjAwJykge1xyXG5cdFx0XHRyZXR1cm4gMTQgKiA2MDtcclxuXHRcdH0gZWxzZSBpZiAodGV4dCA9PT0gJy0xNDowMCcpIHtcclxuXHRcdFx0cmV0dXJuIC0xNCAqIDYwO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIGV4cHJlc3Npb24gPSBuZXcgUmVnRXhwKFwiXlwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuVElNRVpPTkVfUEFUVEVSTiArIFwiJFwiKTtcclxuXHRcdFx0dmFyIHJlc3VsdHMgPSB0ZXh0Lm1hdGNoKGV4cHJlc3Npb24pO1xyXG5cdFx0XHRpZiAocmVzdWx0cyAhPT0gbnVsbCkge1xyXG5cdFx0XHRcdHZhciBzaWduID0gcmVzdWx0c1sxXSA9PT0gJysnID8gMSA6IC0xO1xyXG5cdFx0XHRcdHZhciBob3VyID0gcGFyc2VJbnQocmVzdWx0c1s0XSwgMTApO1xyXG5cdFx0XHRcdHZhciBtaW51dGUgPSBwYXJzZUludChyZXN1bHRzWzVdLCAxMCk7XHJcblx0XHRcdFx0cmV0dXJuIHNpZ24gKiAoaG91ciAqIDYwICsgbWludXRlKTtcclxuXHRcdFx0fVxyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIFsnICsgdGV4dCArICddIGRvZXMgbm90IG1hdGNoIHRoZSB0aW1lem9uZSBwYXR0ZXJuLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdCh2YWx1ZSk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLnllYXIpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5tb250aCkgJiYgSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLmRheSkgJiYgSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLmhvdXIpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5taW51dGUpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5zZWNvbmQpKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnByaW50RGF0ZVRpbWUodmFsdWUpO1xyXG5cdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUueWVhcikgJiYgSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLm1vbnRoKSAmJiBKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUuZGF5KSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wcmludERhdGUodmFsdWUpO1xyXG5cdFx0fSBlbHNlIGlmIChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUuaG91cikgJiYgSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLm1pbnV0ZSkgJiYgSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLnNlY29uZCkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnRUaW1lKHZhbHVlKTtcclxuXHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLnllYXIpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5tb250aCkpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnRHWWVhck1vbnRoKHZhbHVlKTtcclxuXHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLm1vbnRoKSAmJiBKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUuZGF5KSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wcmludEdNb250aERheSh2YWx1ZSk7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS55ZWFyKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wcmludEdZZWFyKHZhbHVlKTtcclxuXHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLm1vbnRoKSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wcmludEdNb250aCh2YWx1ZSk7XHJcblx0XHR9IGVsc2UgaWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5kYXkpKSB7XHJcblx0XHRcdHJldHVybiB0aGlzLnByaW50R0RheSh2YWx1ZSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIFsnICsgdmFsdWUgKyAnXSBpcyBub3QgcmVjb2duaXplZCBhcyBkYXRlVGltZSwgZGF0ZSBvciB0aW1lLicpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cHJpbnREYXRlVGltZSA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHZhbHVlKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLnllYXIpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUubW9udGgpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUuZGF5KTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLmhvdXIpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUubWludXRlKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVOdW1iZXIodmFsdWUuc2Vjb25kKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5mcmFjdGlvbmFsU3RyaW5nKSkge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlTnVtYmVyKHZhbHVlLmZyYWN0aW9uYWxTdHJpbmcpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLnRpbWV6b25lKSAmJiAhSnNvbml4LlV0aWwuVHlwZS5pc05hTih2YWx1ZS50aW1lem9uZSkpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUudGltZXpvbmUpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHJlc3VsdCA9IHRoaXMucHJpbnREYXRlU3RyaW5nKHZhbHVlKTtcclxuXHRcdHJlc3VsdCA9IHJlc3VsdCArICdUJztcclxuXHRcdHJlc3VsdCA9IHJlc3VsdCArIHRoaXMucHJpbnRUaW1lU3RyaW5nKHZhbHVlKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS50aW1lem9uZSkpIHtcclxuXHRcdFx0cmVzdWx0ID0gcmVzdWx0ICsgdGhpcy5wcmludFRpbWV6b25lU3RyaW5nKHZhbHVlLnRpbWV6b25lKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRwcmludERhdGUgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdCh2YWx1ZSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlTnVtYmVyKHZhbHVlLnllYXIpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcih2YWx1ZS5tb250aCk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlTnVtYmVyKHZhbHVlLmRheSk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUudGltZXpvbmUpICYmICFKc29uaXguVXRpbC5UeXBlLmlzTmFOKHZhbHVlLnRpbWV6b25lKSkge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZS50aW1lem9uZSk7XHJcblx0XHR9XHJcblx0XHR2YXIgcmVzdWx0ID0gdGhpcy5wcmludERhdGVTdHJpbmcodmFsdWUpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLnRpbWV6b25lKSkge1xyXG5cdFx0XHRyZXN1bHQgPSByZXN1bHQgKyB0aGlzLnByaW50VGltZXpvbmVTdHJpbmcodmFsdWUudGltZXpvbmUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdHByaW50VGltZSA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHZhbHVlKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVOdW1iZXIodmFsdWUuaG91cik7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlTnVtYmVyKHZhbHVlLm1pbnV0ZSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlTnVtYmVyKHZhbHVlLnNlY29uZCk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUuZnJhY3Rpb25hbFN0cmluZykpIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU51bWJlcih2YWx1ZS5mcmFjdGlvbmFsU3RyaW5nKTtcclxuXHRcdH1cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS50aW1lem9uZSkgJiYgIUpzb25peC5VdGlsLlR5cGUuaXNOYU4odmFsdWUudGltZXpvbmUpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLnRpbWV6b25lKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgcmVzdWx0ID0gdGhpcy5wcmludFRpbWVTdHJpbmcodmFsdWUpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLnRpbWV6b25lKSkge1xyXG5cdFx0XHRyZXN1bHQgPSByZXN1bHQgKyB0aGlzLnByaW50VGltZXpvbmVTdHJpbmcodmFsdWUudGltZXpvbmUpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdHByaW50RGF0ZVN0cmluZyA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KHZhbHVlKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLnllYXIpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUubW9udGgpO1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUuZGF5KTtcclxuXHRcdHJldHVybiAodmFsdWUueWVhciA8IDAgPyAoJy0nICsgdGhpcy5wcmludFllYXIoLXZhbHVlLnllYXIpKSA6IHRoaXMucHJpbnRZZWFyKHZhbHVlLnllYXIpKSArICctJyArIHRoaXMucHJpbnRNb250aCh2YWx1ZS5tb250aCkgKyAnLScgKyB0aGlzLnByaW50RGF5KHZhbHVlLmRheSk7XHJcblx0fSxcclxuXHRwcmludFRpbWVTdHJpbmcgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdCh2YWx1ZSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZS5ob3VyKTtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLm1pbnV0ZSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZS5zZWNvbmQpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLmZyYWN0aW9uYWxTZWNvbmQpKSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVOdW1iZXIodmFsdWUuZnJhY3Rpb25hbFNlY29uZCk7XHJcblx0XHR9XHJcblx0XHR2YXIgcmVzdWx0ID0gdGhpcy5wcmludEhvdXIodmFsdWUuaG91cik7XHJcblx0XHRyZXN1bHQgPSByZXN1bHQgKyAnOic7XHJcblx0XHRyZXN1bHQgPSByZXN1bHQgKyB0aGlzLnByaW50TWludXRlKHZhbHVlLm1pbnV0ZSk7XHJcblx0XHRyZXN1bHQgPSByZXN1bHQgKyAnOic7XHJcblx0XHRyZXN1bHQgPSByZXN1bHQgKyB0aGlzLnByaW50U2Vjb25kKHZhbHVlLnNlY29uZCk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUuZnJhY3Rpb25hbFNlY29uZCkpIHtcclxuXHRcdFx0cmVzdWx0ID0gcmVzdWx0ICsgdGhpcy5wcmludEZyYWN0aW9uYWxTZWNvbmQodmFsdWUuZnJhY3Rpb25hbFNlY29uZCk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblx0cHJpbnRUaW1lem9uZVN0cmluZyA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlKSB8fCBKc29uaXguVXRpbC5UeXBlLmlzTmFOKHZhbHVlKSkge1xyXG5cdFx0XHRyZXR1cm4gJyc7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZSk7XHJcblxyXG5cdFx0XHR2YXIgc2lnbiA9IHZhbHVlIDwgMCA/IC0xIDogKHZhbHVlID4gMCA/IDEgOiAwKTtcclxuXHRcdFx0dmFyIGRhdGEgPSB2YWx1ZSAqIHNpZ247XHJcblx0XHRcdHZhciBtaW51dGUgPSBkYXRhICUgNjA7XHJcblx0XHRcdHZhciBob3VyID0gTWF0aC5mbG9vcihkYXRhIC8gNjApO1xyXG5cclxuXHRcdFx0dmFyIHJlc3VsdDtcclxuXHRcdFx0aWYgKHNpZ24gPT09IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJ1onO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGlmIChzaWduID4gMCkge1xyXG5cdFx0XHRcdFx0cmVzdWx0ID0gJysnO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoc2lnbiA8IDApIHtcclxuXHRcdFx0XHRcdHJlc3VsdCA9ICctJztcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0cmVzdWx0ID0gcmVzdWx0ICsgdGhpcy5wcmludEhvdXIoaG91cik7XHJcblx0XHRcdFx0cmVzdWx0ID0gcmVzdWx0ICsgJzonO1xyXG5cdFx0XHRcdHJlc3VsdCA9IHJlc3VsdCArIHRoaXMucHJpbnRNaW51dGUobWludXRlKTtcclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRwcmludEdEYXkgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdCh2YWx1ZSk7XHJcblx0XHR2YXIgZGF5ID0gdW5kZWZpbmVkO1xyXG5cdFx0dmFyIHRpbWV6b25lID0gdW5kZWZpbmVkO1xyXG5cclxuXHRcdGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcclxuXHRcdFx0ZGF5ID0gdmFsdWUuZ2V0RGF0ZSgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUuZGF5KTtcclxuXHRcdFx0ZGF5ID0gdmFsdWUuZGF5O1xyXG5cdFx0XHR0aW1lem9uZSA9IHZhbHVlLnRpbWV6b25lO1xyXG5cdFx0fVxyXG5cdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZURheShkYXkpO1xyXG5cdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVRpbWV6b25lKHRpbWV6b25lKTtcclxuXHRcdHJldHVybiBcIi0tLVwiICsgdGhpcy5wcmludERheShkYXkpICsgdGhpcy5wcmludFRpbWV6b25lU3RyaW5nKHRpbWV6b25lKTtcclxuXHR9LFxyXG5cdHByaW50R01vbnRoIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUpO1xyXG5cdFx0dmFyIG1vbnRoID0gdW5kZWZpbmVkO1xyXG5cdFx0dmFyIHRpbWV6b25lID0gdW5kZWZpbmVkO1xyXG5cclxuXHRcdGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcclxuXHRcdFx0bW9udGggPSB2YWx1ZS5nZXRNb250aCgpICsgMTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLm1vbnRoKTtcclxuXHRcdFx0bW9udGggPSB2YWx1ZS5tb250aDtcclxuXHRcdFx0dGltZXpvbmUgPSB2YWx1ZS50aW1lem9uZTtcclxuXHRcdH1cclxuXHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVNb250aChtb250aCk7XHJcblx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlVGltZXpvbmUodGltZXpvbmUpO1xyXG5cdFx0cmV0dXJuIFwiLS1cIiArIHRoaXMucHJpbnRNb250aChtb250aCkgKyB0aGlzLnByaW50VGltZXpvbmVTdHJpbmcodGltZXpvbmUpO1xyXG5cdH0sXHJcblx0cHJpbnRHTW9udGhEYXkgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdCh2YWx1ZSk7XHJcblx0XHR2YXIgbW9udGggPSB1bmRlZmluZWQ7XHJcblx0XHR2YXIgZGF5ID0gdW5kZWZpbmVkO1xyXG5cdFx0dmFyIHRpbWV6b25lID0gdW5kZWZpbmVkO1xyXG5cclxuXHRcdGlmICh2YWx1ZSBpbnN0YW5jZW9mIERhdGUpIHtcclxuXHRcdFx0bW9udGggPSB2YWx1ZS5nZXRNb250aCgpICsgMTtcclxuXHRcdFx0ZGF5ID0gdmFsdWUuZ2V0RGF0ZSgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUubW9udGgpO1xyXG5cdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZS5kYXkpO1xyXG5cdFx0XHRtb250aCA9IHZhbHVlLm1vbnRoO1xyXG5cdFx0XHRkYXkgPSB2YWx1ZS5kYXk7XHJcblx0XHRcdHRpbWV6b25lID0gdmFsdWUudGltZXpvbmU7XHJcblx0XHR9XHJcblx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlTW9udGhEYXkobW9udGgsIGRheSk7XHJcblx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlVGltZXpvbmUodGltZXpvbmUpO1xyXG5cdFx0cmV0dXJuIFwiLS1cIiArIHRoaXMucHJpbnRNb250aChtb250aCkgKyBcIi1cIiArIHRoaXMucHJpbnREYXkoZGF5KSArIHRoaXMucHJpbnRUaW1lem9uZVN0cmluZyh0aW1lem9uZSk7XHJcblx0fSxcclxuXHRwcmludEdZZWFyIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodmFsdWUpO1xyXG5cdFx0dmFyIHllYXIgPSB1bmRlZmluZWQ7XHJcblx0XHR2YXIgdGltZXpvbmUgPSB1bmRlZmluZWQ7XHJcblxyXG5cdFx0aWYgKHZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xyXG5cdFx0XHR5ZWFyID0gdmFsdWUuZ2V0RnVsbFllYXIoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVJbnRlZ2VyKHZhbHVlLnllYXIpO1xyXG5cdFx0XHR5ZWFyID0gdmFsdWUueWVhcjtcclxuXHRcdFx0dGltZXpvbmUgPSB2YWx1ZS50aW1lem9uZTtcclxuXHRcdH1cclxuXHRcdEpzb25peC5YTUwuQ2FsZW5kYXIudmFsaWRhdGVZZWFyKHllYXIpO1xyXG5cdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVRpbWV6b25lKHRpbWV6b25lKTtcclxuXHRcdHJldHVybiB0aGlzLnByaW50U2lnbmVkWWVhcih5ZWFyKSArIHRoaXMucHJpbnRUaW1lem9uZVN0cmluZyh0aW1lem9uZSk7XHJcblx0fSxcclxuXHRwcmludEdZZWFyTW9udGggOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdCh2YWx1ZSk7XHJcblx0XHR2YXIgeWVhciA9IHVuZGVmaW5lZDtcclxuXHRcdHZhciBtb250aCA9IHVuZGVmaW5lZDtcclxuXHRcdHZhciB0aW1lem9uZSA9IHVuZGVmaW5lZDtcclxuXHJcblx0XHRpZiAodmFsdWUgaW5zdGFuY2VvZiBEYXRlKSB7XHJcblx0XHRcdHllYXIgPSB2YWx1ZS5nZXRGdWxsWWVhcigpO1xyXG5cdFx0XHRtb250aCA9IHZhbHVlLmdldE1vbnRoKCkgKyAxO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUludGVnZXIodmFsdWUueWVhcik7XHJcblx0XHRcdHllYXIgPSB2YWx1ZS55ZWFyO1xyXG5cdFx0XHRtb250aCA9IHZhbHVlLm1vbnRoO1xyXG5cdFx0XHR0aW1lem9uZSA9IHZhbHVlLnRpbWV6b25lO1xyXG5cdFx0fVxyXG5cdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVllYXIoeWVhcik7XHJcblx0XHRKc29uaXguWE1MLkNhbGVuZGFyLnZhbGlkYXRlTW9udGgobW9udGgpO1xyXG5cdFx0SnNvbml4LlhNTC5DYWxlbmRhci52YWxpZGF0ZVRpbWV6b25lKHRpbWV6b25lKTtcclxuXHRcdHJldHVybiB0aGlzLnByaW50U2lnbmVkWWVhcih5ZWFyKSArIFwiLVwiICsgdGhpcy5wcmludE1vbnRoKG1vbnRoKSArIHRoaXMucHJpbnRUaW1lem9uZVN0cmluZyh0aW1lem9uZSk7XHJcblx0fSxcclxuXHRwcmludFNpZ25lZFllYXIgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuIHZhbHVlIDwgMCA/IChcIi1cIiArIHRoaXMucHJpbnRZZWFyKHZhbHVlICogLTEpKSA6ICh0aGlzLnByaW50WWVhcih2YWx1ZSkpO1xyXG5cdH0sXHJcblx0cHJpbnRZZWFyIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByaW50SW50ZWdlcih2YWx1ZSwgNCk7XHJcblx0fSxcclxuXHRwcmludE1vbnRoIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByaW50SW50ZWdlcih2YWx1ZSwgMik7XHJcblx0fSxcclxuXHRwcmludERheSA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludEludGVnZXIodmFsdWUsIDIpO1xyXG5cdH0sXHJcblx0cHJpbnRIb3VyIDogZnVuY3Rpb24odmFsdWUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByaW50SW50ZWdlcih2YWx1ZSwgMik7XHJcblx0fSxcclxuXHRwcmludE1pbnV0ZSA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludEludGVnZXIodmFsdWUsIDIpO1xyXG5cdH0sXHJcblx0cHJpbnRTZWNvbmQgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucHJpbnRJbnRlZ2VyKHZhbHVlLCAyKTtcclxuXHR9LFxyXG5cdHByaW50RnJhY3Rpb25hbFNlY29uZCA6IGZ1bmN0aW9uKHZhbHVlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlTnVtYmVyKHZhbHVlKTtcclxuXHRcdGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPj0gMSkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ZyYWN0aW9uYWwgc2Vjb25kIFsnICsgdmFsdWUgKyAnXSBtdXN0IGJlIGJldHdlZW4gMCBhbmQgMS4nKTtcclxuXHRcdH0gZWxzZSBpZiAodmFsdWUgPT09IDApIHtcclxuXHRcdFx0cmV0dXJuICcnO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHN0cmluZyA9IFN0cmluZyh2YWx1ZSk7XHJcblx0XHRcdHZhciBkb3RJbmRleCA9IHN0cmluZy5pbmRleE9mKCcuJyk7XHJcblx0XHRcdGlmIChkb3RJbmRleCA8IDApIHtcclxuXHRcdFx0XHRyZXR1cm4gJyc7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIHN0cmluZy5zdWJzdHJpbmcoZG90SW5kZXgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRwcmludEludGVnZXIgOiBmdW5jdGlvbih2YWx1ZSwgbGVuZ3RoKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcih2YWx1ZSk7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlSW50ZWdlcihsZW5ndGgpO1xyXG5cdFx0aWYgKGxlbmd0aCA8PSAwKSB7XHJcblx0XHRcdHRocm93IG5ldyBFcnJvcignTGVuZ3RoIFsnICsgdmFsdWUgKyAnXSBtdXN0IGJlIHBvc2l0aXZlLicpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKHZhbHVlIDwgMCkge1xyXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1ZhbHVlIFsnICsgdmFsdWUgKyAnXSBtdXN0IG5vdCBiZSBuZWdhdGl2ZS4nKTtcclxuXHRcdH1cclxuXHRcdHZhciByZXN1bHQgPSBTdHJpbmcodmFsdWUpO1xyXG5cdFx0Zm9yICh2YXIgaSA9IHJlc3VsdC5sZW5ndGg7IGkgPCBsZW5ndGg7IGkrKykge1xyXG5cdFx0XHRyZXN1bHQgPSAnMCcgKyByZXN1bHQ7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdH0sXHJcblx0aXNJbnN0YW5jZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIEpzb25peC5VdGlsLlR5cGUuaXNPYmplY3QodmFsdWUpICYmICgoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLnllYXIpICYmIEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5tb250aCkgJiYgSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLmRheSkpIHx8IChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUuaG91cikgJiYgSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLm1pbnV0ZSkgJiYgSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLnNlY29uZCkpKTtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXInXHJcbn0pO1xyXG5cclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuWUVBUl9QQVRURVJOID0gXCItPyhbMS05XVswLTldKik/KCg/ISgwMDAwKSlbMC05XXs0fSlcIjtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuVElNRVpPTkVfUEFUVEVSTiA9IFwiWnwoW1xcXFwtXFxcXCtdKSgoKDBbMC05XXwxWzAtM10pOihbMC01XVswLTldKSl8KDE0OjAwKSlcIjtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuTU9OVEhfUEFUVEVSTiA9IFwiKDBbMS05XXwxWzAtMl0pXCI7XHJcbkpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlNJTkdMRV9NT05USF9QQVRURVJOID0gXCJcXFxcLVxcXFwtXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5NT05USF9QQVRURVJOO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5EQVlfUEFUVEVSTiA9IFwiKDBbMS05XXxbMTJdWzAtOV18M1swMV0pXCI7XHJcbkpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlNJTkdMRV9EQVlfUEFUVEVSTiA9IFwiXFxcXC1cXFxcLVxcXFwtXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5EQVlfUEFUVEVSTjtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuR1lFQVJfUEFUVEVSTiA9IFwiKFwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuWUVBUl9QQVRURVJOICsgXCIpXCIgKyBcIihcIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlRJTUVaT05FX1BBVFRFUk4gKyBcIik/XCI7XHJcbkpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLkdNT05USF9QQVRURVJOID0gXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5TSU5HTEVfTU9OVEhfUEFUVEVSTiArIFwiKVwiICsgXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FWk9ORV9QQVRURVJOICsgXCIpP1wiO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5HREFZX1BBVFRFUk4gPSBcIihcIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlNJTkdMRV9EQVlfUEFUVEVSTiArIFwiKVwiICsgXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FWk9ORV9QQVRURVJOICsgXCIpP1wiO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5HWUVBUl9NT05USF9QQVRURVJOID0gXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5ZRUFSX1BBVFRFUk4gKyBcIilcIiArIFwiLVwiICsgXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5EQVlfUEFUVEVSTiArIFwiKVwiICsgXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FWk9ORV9QQVRURVJOICsgXCIpP1wiO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5HTU9OVEhfREFZX1BBVFRFUk4gPSBcIihcIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlNJTkdMRV9NT05USF9QQVRURVJOICsgXCIpXCIgKyBcIi1cIiArIFwiKFwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFZX1BBVFRFUk4gKyBcIilcIiArIFwiKFwiICsgSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuVElNRVpPTkVfUEFUVEVSTiArIFwiKT9cIjtcclxuSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFURV9QQVJUX1BBVFRFUk4gPSBcIihcIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLllFQVJfUEFUVEVSTiArIFwiKVwiICsgXCItXCIgKyBcIihcIiArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLk1PTlRIX1BBVFRFUk4gKyBcIilcIiArIFwiLVwiICsgXCIoXCIgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5EQVlfUEFUVEVSTiArIFwiKVwiO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FX1BBUlRfUEFUVEVSTiA9IFwiKFswLTFdWzAtOV18MlswLTNdKTooWzAtNV1bMC05XSk6KFswLTVdWzAtOV0pKFxcXFwuKFswLTldKykpP1wiO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FX1BBVFRFUk4gPSBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FX1BBUlRfUEFUVEVSTiArICcoJyArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlRJTUVaT05FX1BBVFRFUk4gKyAnKT8nO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5EQVRFX1BBVFRFUk4gPSBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5EQVRFX1BBUlRfUEFUVEVSTiArICcoJyArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlRJTUVaT05FX1BBVFRFUk4gKyAnKT8nO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5EQVRFVElNRV9QQVRURVJOID0gSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuREFURV9QQVJUX1BBVFRFUk4gKyAnVCcgKyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5USU1FX1BBUlRfUEFUVEVSTiArICcoJyArIEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLlRJTUVaT05FX1BBVFRFUk4gKyAnKT8nO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhcigpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhci5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5EdXJhdGlvbiA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5BbnlTaW1wbGVUeXBlLCB7XHJcblx0bmFtZSA6ICdEdXJhdGlvbicsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnZHVyYXRpb24nKSxcclxuXHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh2YWx1ZSkgJiYgKFxyXG5cdFx0XHRcdChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5zaWduKSA/ICh2YWx1ZS5zaWduID09PSAtMSB8fCB2YWx1ZS5zaWduID09PSAxKSA6IHRydWUpXHJcblx0XHRcdFx0KEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS55ZWFycykgJiYgdmFsdWUueWVhcnMgPj0wKSB8fFxyXG5cdFx0XHRcdChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUubW9udGhzKSAmJiB2YWx1ZS5tb250aHMgPj0wKSB8fFxyXG5cdFx0XHRcdChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUuZGF5cykgJiYgdmFsdWUuZGF5cyA+PSAwKSB8fFxyXG5cdFx0XHRcdChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUuaG91cnMpICYmIHZhbHVlLmhvdXJzID49IDApIHx8XHJcblx0XHRcdFx0KEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcih2YWx1ZS5taW51dGVzKSAmJiB2YWx1ZS5taW51dGVzID49IDApIHx8XHJcblx0XHRcdFx0KEpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIodmFsdWUuc2Vjb25kcykgJiYgdmFsdWUuc2Vjb25kcyA+PSAwKSApO1xyXG5cdH0sXHJcblx0dmFsaWRhdGUgOiBmdW5jdGlvbih2YWx1ZSkge1xyXG5cdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZU9iamVjdCh2YWx1ZSk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHModmFsdWUuc2lnbikpIHtcclxuXHRcdFx0aWYgKCEodmFsdWUuc2lnbiA9PT0gMSB8fCB2YWx1ZS5zaWduID09PSAtMSkpIHtcclxuXHRcdFx0XHR0aHJvdyBuZXcgRXJyb3IoXCJTaWduIG9mIHRoZSBkdXJhdGlvbiBbXCIgKyB2YWx1ZS5zaWduICsgXCJdIG11c3QgYmUgZWl0aGVyIFsxXSBvciBbLTFdLlwiKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0dmFyIGVtcHR5ID0gdHJ1ZTtcclxuXHRcdHZhciBpZkV4aXN0c0Vuc3VyZVVuc2lnbmVkSW50ZWdlciA9IGZ1bmN0aW9uKHYsIG1lc3NhZ2UpIHtcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHYpKSB7XHJcblx0XHRcdFx0aWYgKCEoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHYpICYmIHYgPj0gMCkpIHtcclxuXHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcihtZXNzYWdlLnJlcGxhY2UoXCJ7MH1cIiwgdikpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHJ1ZTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9O1xyXG5cdFx0dmFyIGlmRXhpc3RzRW5zdXJlVW5zaWduZWROdW1iZXIgPSBmdW5jdGlvbih2LCBtZXNzYWdlKSB7XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2KSkge1xyXG5cdFx0XHRcdGlmICghKEpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIodikgJiYgdiA+PSAwKSkge1xyXG5cdFx0XHRcdFx0dGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UucmVwbGFjZShcInswfVwiLCB2KSk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHRcdH1cclxuXHRcdH07XHJcblx0XHRlbXB0eSA9IGVtcHR5ICYmICFpZkV4aXN0c0Vuc3VyZVVuc2lnbmVkSW50ZWdlcih2YWx1ZS55ZWFycywgXCJOdW1iZXIgb2YgeWVhcnMgW3swfV0gbXVzdCBiZSBhbiB1bnNpZ25lZCBpbnRlZ2VyLlwiKTtcclxuXHRcdGVtcHR5ID0gZW1wdHkgJiYgIWlmRXhpc3RzRW5zdXJlVW5zaWduZWRJbnRlZ2VyKHZhbHVlLm1vbnRocywgXCJOdW1iZXIgb2YgbW9udGhzIFt7MH1dIG11c3QgYmUgYW4gdW5zaWduZWQgaW50ZWdlci5cIik7XHJcblx0XHRlbXB0eSA9IGVtcHR5ICYmICFpZkV4aXN0c0Vuc3VyZVVuc2lnbmVkSW50ZWdlcih2YWx1ZS5kYXlzLCBcIk51bWJlciBvZiBkYXlzIFt7MH1dIG11c3QgYmUgYW4gdW5zaWduZWQgaW50ZWdlci5cIik7XHJcblx0XHRlbXB0eSA9IGVtcHR5ICYmICFpZkV4aXN0c0Vuc3VyZVVuc2lnbmVkSW50ZWdlcih2YWx1ZS5ob3VycywgXCJOdW1iZXIgb2YgaG91cnMgW3swfV0gbXVzdCBiZSBhbiB1bnNpZ25lZCBpbnRlZ2VyLlwiKTtcclxuXHRcdGVtcHR5ID0gZW1wdHkgJiYgIWlmRXhpc3RzRW5zdXJlVW5zaWduZWRJbnRlZ2VyKHZhbHVlLm1pbnV0ZXMsIFwiTnVtYmVyIG9mIG1pbnV0ZXMgW3swfV0gbXVzdCBiZSBhbiB1bnNpZ25lZCBpbnRlZ2VyLlwiKTtcclxuXHRcdGVtcHR5ID0gZW1wdHkgJiYgIWlmRXhpc3RzRW5zdXJlVW5zaWduZWROdW1iZXIodmFsdWUuc2Vjb25kcywgXCJOdW1iZXIgb2Ygc2Vjb25kcyBbezB9XSBtdXN0IGJlIGFuIHVuc2lnbmVkIG51bWJlci5cIik7XHJcblx0XHRpZiAoZW1wdHkpIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKFwiQXQgbGVhc3Qgb25lIG9mIHRoZSBjb21wb25lbnRzICh5ZWFycywgbW9udGhzLCBkYXlzLCBob3VycywgbWludXRlcywgc2Vjb25kcykgbXVzdCBiZSBzZXQuXCIpO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0dGhpcy52YWxpZGF0ZSh2YWx1ZSk7XHJcblx0XHR2YXIgcmVzdWx0ID0gJyc7XHJcblx0XHRpZiAodmFsdWUuc2lnbiA9PT0gLTEpXHJcblx0XHR7XHJcblx0XHRcdHJlc3VsdCArPSAnLSc7XHJcblx0XHR9XHJcblx0XHRyZXN1bHQgKz0gJ1AnO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLnllYXJzKSkge1xyXG5cdFx0XHRyZXN1bHQgKz0gKHZhbHVlLnllYXJzICsgJ1knKTtcclxuXHRcdH1cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5tb250aHMpKSB7XHJcblx0XHRcdHJlc3VsdCArPSAodmFsdWUubW9udGhzICsgJ00nKTtcclxuXHRcdH1cclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5kYXlzKSkge1xyXG5cdFx0XHRyZXN1bHQgKz0gKHZhbHVlLmRheXMgKyAnRCcpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLmhvdXJzKSB8fCBKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5taW51dGVzKSB8fCBKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5zZWNvbmRzKSlcclxuXHRcdHtcclxuXHRcdFx0cmVzdWx0ICs9ICdUJztcclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLmhvdXJzKSkge1xyXG5cdFx0XHRcdHJlc3VsdCArPSAodmFsdWUuaG91cnMgKyAnSCcpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyh2YWx1ZS5taW51dGVzKSkge1xyXG5cdFx0XHRcdHJlc3VsdCArPSAodmFsdWUubWludXRlcyArICdNJyk7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlLnNlY29uZHMpKSB7XHJcblx0XHRcdFx0cmVzdWx0ICs9ICh2YWx1ZS5zZWNvbmRzICsgJ1MnKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdHBhcnNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0dmFyIGR1cmF0aW9uRXhwcmVzc2lvbiA9IG5ldyBSZWdFeHAoXCJeXCIgKyBKc29uaXguU2NoZW1hLlhTRC5EdXJhdGlvbi5QQVRURVJOICsgXCIkXCIpO1xyXG5cdFx0dmFyIHJlc3VsdHMgPSB2YWx1ZS5tYXRjaChkdXJhdGlvbkV4cHJlc3Npb24pO1xyXG5cdFx0aWYgKHJlc3VsdHMgIT09IG51bGwpIHtcclxuXHRcdFx0dmFyIGVtcHR5ID0gdHJ1ZTtcclxuXHRcdFx0dmFyIGR1cmF0aW9uID0ge307XHJcblx0XHRcdGlmIChyZXN1bHRzWzFdKSB7IGR1cmF0aW9uLnNpZ24gPSAtMTsgfVxyXG5cdFx0XHRpZiAocmVzdWx0c1szXSkgeyBkdXJhdGlvbi55ZWFycyA9IHBhcnNlSW50KHJlc3VsdHNbM10sIDEwKTsgZW1wdHkgPSBmYWxzZTsgfVxyXG5cdFx0XHRpZiAocmVzdWx0c1s1XSkgeyBkdXJhdGlvbi5tb250aHMgPSBwYXJzZUludChyZXN1bHRzWzVdLCAxMCk7IGVtcHR5ID0gZmFsc2U7IH1cclxuXHRcdFx0aWYgKHJlc3VsdHNbN10pIHsgZHVyYXRpb24uZGF5cyA9IHBhcnNlSW50KHJlc3VsdHNbN10sIDEwKTsgZW1wdHkgPSBmYWxzZTsgfVxyXG5cdFx0XHRpZiAocmVzdWx0c1sxMF0pIHsgZHVyYXRpb24uaG91cnMgPSBwYXJzZUludChyZXN1bHRzWzEwXSwgMTApOyBlbXB0eSA9IGZhbHNlOyB9XHJcblx0XHRcdGlmIChyZXN1bHRzWzEyXSkgeyBkdXJhdGlvbi5taW51dGVzID0gcGFyc2VJbnQocmVzdWx0c1sxMl0sIDEwKTsgZW1wdHkgPSBmYWxzZTsgfVxyXG5cdFx0XHRpZiAocmVzdWx0c1sxNF0pIHsgZHVyYXRpb24uc2Vjb25kcyA9IE51bWJlcihyZXN1bHRzWzE0XSk7IGVtcHR5ID0gZmFsc2U7IH1cclxuXHRcdFx0cmV0dXJuIGR1cmF0aW9uO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdWYWx1ZSBbJyArIHZhbHVlICsgJ10gZG9lcyBub3QgbWF0Y2ggdGhlIGR1cmF0aW9uIHBhdHRlcm4uJyk7XHJcblx0XHR9XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkR1cmF0aW9uJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRHVyYXRpb24uUEFUVEVSTiA9ICcoLSk/UCgoWzAtOV0rKVkpPygoWzAtOV0rKU0pPygoWzAtOV0rKUQpPyhUKChbMC05XSspSCk/KChbMC05XSspTSk/KChbMC05XSsoXFxcXC5bMC05XSspPylTKT8pPyc7XHJcbkpzb25peC5TY2hlbWEuWFNELkR1cmF0aW9uLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkR1cmF0aW9uKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkR1cmF0aW9uLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5EdXJhdGlvbi5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLCB7XHJcblx0bmFtZSA6ICdEYXRlVGltZScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnZGF0ZVRpbWUnKSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnBhcnNlRGF0ZVRpbWUodmFsdWUpO1xyXG5cdH0sXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucHJpbnREYXRlVGltZSh2YWx1ZSk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRGF0ZVRpbWUuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuRGF0ZVRpbWUoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRGF0ZVRpbWUuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lLklOU1RBTkNFKTtcclxuXHJcbkpzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lQXNEYXRlID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLCB7XHJcblx0bmFtZSA6ICdEYXRlVGltZUFzRGF0ZScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnZGF0ZVRpbWUnKSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciBjYWxlbmRhciA9IHRoaXMucGFyc2VEYXRlVGltZSh2YWx1ZSk7XHJcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRkYXRlLnNldEZ1bGxZZWFyKGNhbGVuZGFyLnllYXIpO1xyXG5cdFx0ZGF0ZS5zZXRNb250aChjYWxlbmRhci5tb250aCAtIDEpO1xyXG5cdFx0ZGF0ZS5zZXREYXRlKGNhbGVuZGFyLmRheSk7XHJcblx0XHRkYXRlLnNldEhvdXJzKGNhbGVuZGFyLmhvdXIpO1xyXG5cdFx0ZGF0ZS5zZXRNaW51dGVzKGNhbGVuZGFyLm1pbnV0ZSk7XHJcblx0XHRkYXRlLnNldFNlY29uZHMoY2FsZW5kYXIuc2Vjb25kKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKGNhbGVuZGFyLmZyYWN0aW9uYWxTZWNvbmQpKSB7XHJcblx0XHRcdGRhdGUuc2V0TWlsbGlzZWNvbmRzKE1hdGguZmxvb3IoMTAwMCAqIGNhbGVuZGFyLmZyYWN0aW9uYWxTZWNvbmQpKTtcclxuXHRcdH1cclxuXHRcdHZhciB0aW1lem9uZTtcclxuXHRcdHZhciB1bmtub3duVGltZXpvbmU7XHJcblx0XHR2YXIgbG9jYWxUaW1lem9uZSA9IC0gZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcihjYWxlbmRhci50aW1lem9uZSkpXHJcblx0XHR7XHJcblx0XHRcdHRpbWV6b25lID0gY2FsZW5kYXIudGltZXpvbmU7XHJcblx0XHRcdHVua25vd25UaW1lem9uZSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBVbmtub3duIHRpbWV6b25lXHJcblx0XHRcdHRpbWV6b25lID0gbG9jYWxUaW1lem9uZTtcclxuXHRcdFx0dW5rbm93blRpbWV6b25lID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdC8vXHJcblx0XHR2YXIgcmVzdWx0ID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkgKyAoNjAwMDAgKiAoLSB0aW1lem9uZSArIGxvY2FsVGltZXpvbmUpKSk7XHJcblx0XHRpZiAodW5rbm93blRpbWV6b25lKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBudWxsIGRlbm90ZXMgXCJ1bmtub3duIHRpbWV6b25lXCJcclxuXHRcdFx0cmVzdWx0Lm9yaWdpbmFsVGltZXpvbmUgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHRyZXN1bHQub3JpZ2luYWxUaW1lem9uZSA9IGNhbGVuZGFyLnRpbWV6b25lO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVEYXRlKHZhbHVlKTtcclxuXHRcdHZhciB0aW1lem9uZTtcclxuXHRcdHZhciBsb2NhbFRpbWV6b25lID0gLSB2YWx1ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG5cdFx0dmFyIGNvcnJlY3RlZFZhbHVlO1xyXG5cdFx0Ly8gSWYgb3JpZ2luYWwgdGltZSB6b25lIHdhcyB1bmtub3duLCBwcmludCB0aGUgZ2l2ZW4gdmFsdWUgd2l0aG91dFxyXG5cdFx0Ly8gdGhlIHRpbWV6b25lXHJcblx0XHRpZiAodmFsdWUub3JpZ2luYWxUaW1lem9uZSA9PT0gbnVsbClcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnREYXRlVGltZShuZXcgSnNvbml4LlhNTC5DYWxlbmRhcih7XHJcblx0XHRcdFx0eWVhciA6IHZhbHVlLmdldEZ1bGxZZWFyKCksXHJcblx0XHRcdFx0bW9udGggOiB2YWx1ZS5nZXRNb250aCgpICsgMSxcclxuXHRcdFx0XHRkYXkgOiB2YWx1ZS5nZXREYXRlKCksXHJcblx0XHRcdFx0aG91ciA6IHZhbHVlLmdldEhvdXJzKCksXHJcblx0XHRcdFx0bWludXRlIDogdmFsdWUuZ2V0TWludXRlcygpLFxyXG5cdFx0XHRcdHNlY29uZCA6IHZhbHVlLmdldFNlY29uZHMoKSxcclxuXHRcdFx0XHRmcmFjdGlvbmFsU2Vjb25kIDogKHZhbHVlLmdldE1pbGxpc2Vjb25kcygpIC8gMTAwMClcclxuXHRcdFx0fSkpO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBJZiBvcmlnaW5hbCB0aW1lem9uZSB3YXMga25vd24sIGNvcnJlY3QgYW5kIHByaW50IHRoZSB2YWx1ZSB3aXRoIHRoZSB0aW1lem9uZVxyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLm9yaWdpbmFsVGltZXpvbmUpKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGltZXpvbmUgPSB2YWx1ZS5vcmlnaW5hbFRpbWV6b25lO1xyXG5cdFx0XHRcdGNvcnJlY3RlZFZhbHVlID0gbmV3IERhdGUodmFsdWUuZ2V0VGltZSgpIC0gKDYwMDAwICogKCAtIHRpbWV6b25lICsgbG9jYWxUaW1lem9uZSkpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvLyBJZiBvcmlnaW5hbCB0aW1lem9uZSB3YXMgbm90IHNwZWNpZmllZCwgZG8gbm90IGNvcnJlY3QgYW5kIHVzZSB0aGUgbG9jYWwgdGltZSB6b25lXHJcblx0XHRcdGVsc2VcclxuXHRcdFx0e1xyXG5cdFx0XHRcdHRpbWV6b25lID0gbG9jYWxUaW1lem9uZTtcclxuXHRcdFx0XHRjb3JyZWN0ZWRWYWx1ZSA9IHZhbHVlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciB4ID0gdGhpcy5wcmludERhdGVUaW1lKG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKHtcclxuXHRcdFx0XHR5ZWFyIDogY29ycmVjdGVkVmFsdWUuZ2V0RnVsbFllYXIoKSxcclxuXHRcdFx0XHRtb250aCA6IGNvcnJlY3RlZFZhbHVlLmdldE1vbnRoKCkgKyAxLFxyXG5cdFx0XHRcdGRheSA6IGNvcnJlY3RlZFZhbHVlLmdldERhdGUoKSxcclxuXHRcdFx0XHRob3VyIDogY29ycmVjdGVkVmFsdWUuZ2V0SG91cnMoKSxcclxuXHRcdFx0XHRtaW51dGUgOiBjb3JyZWN0ZWRWYWx1ZS5nZXRNaW51dGVzKCksXHJcblx0XHRcdFx0c2Vjb25kIDogY29ycmVjdGVkVmFsdWUuZ2V0U2Vjb25kcygpLFxyXG5cdFx0XHRcdGZyYWN0aW9uYWxTZWNvbmQgOiAoY29ycmVjdGVkVmFsdWUuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwKSxcclxuXHRcdFx0XHR0aW1lem9uZTogdGltZXpvbmVcclxuXHRcdFx0fSkpO1xyXG5cdFx0XHRyZXR1cm4geDtcclxuXHRcdH1cclxuXHR9LFxyXG5cdGlzSW5zdGFuY2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiBKc29uaXguVXRpbC5UeXBlLmlzRGF0ZSh2YWx1ZSk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lQXNEYXRlJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRGF0ZVRpbWVBc0RhdGUuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuRGF0ZVRpbWVBc0RhdGUoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRGF0ZVRpbWVBc0RhdGUuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lQXNEYXRlLklOU1RBTkNFKTtcclxuXHJcbkpzb25peC5TY2hlbWEuWFNELlRpbWUgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIsIHtcclxuXHRuYW1lIDogJ1RpbWUnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ3RpbWUnKSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnBhcnNlVGltZSh2YWx1ZSk7XHJcblx0fSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludFRpbWUodmFsdWUpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5UaW1lJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuVGltZS5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5UaW1lKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELlRpbWUuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELlRpbWUuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5UaW1lQXNEYXRlID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLCB7XHJcblx0bmFtZSA6ICdUaW1lQXNEYXRlJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCd0aW1lJyksXHJcblx0cGFyc2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHR2YXIgY2FsZW5kYXIgPSB0aGlzLnBhcnNlVGltZSh2YWx1ZSk7XHJcblx0XHR2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcblx0XHRkYXRlLnNldEZ1bGxZZWFyKDE5NzApO1xyXG5cdFx0ZGF0ZS5zZXRNb250aCgwKTtcclxuXHRcdGRhdGUuc2V0RGF0ZSgxKTtcclxuXHRcdGRhdGUuc2V0SG91cnMoY2FsZW5kYXIuaG91cik7XHJcblx0XHRkYXRlLnNldE1pbnV0ZXMoY2FsZW5kYXIubWludXRlKTtcclxuXHRcdGRhdGUuc2V0U2Vjb25kcyhjYWxlbmRhci5zZWNvbmQpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNOdW1iZXIoY2FsZW5kYXIuZnJhY3Rpb25hbFNlY29uZCkpIHtcclxuXHRcdFx0ZGF0ZS5zZXRNaWxsaXNlY29uZHMoTWF0aC5mbG9vcigxMDAwICogY2FsZW5kYXIuZnJhY3Rpb25hbFNlY29uZCkpO1xyXG5cdFx0fVxyXG5cdFx0dmFyIHRpbWV6b25lO1xyXG5cdFx0dmFyIHVua25vd25UaW1lem9uZTtcclxuXHRcdHZhciBsb2NhbFRpbWV6b25lID0gLSBkYXRlLmdldFRpbWV6b25lT2Zmc2V0KCk7XHJcblx0XHRpZiAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKGNhbGVuZGFyLnRpbWV6b25lKSlcclxuXHRcdHtcclxuXHRcdFx0dGltZXpvbmUgPSBjYWxlbmRhci50aW1lem9uZTtcclxuXHRcdFx0dW5rbm93blRpbWV6b25lID0gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdC8vIFVua25vd24gdGltZXpvbmVcclxuXHRcdFx0dGltZXpvbmUgPSBsb2NhbFRpbWV6b25lO1xyXG5cdFx0XHR1bmtub3duVGltZXpvbmUgPSB0cnVlO1xyXG5cdFx0fVxyXG5cdFx0Ly9cclxuXHRcdHZhciByZXN1bHQgPSBuZXcgRGF0ZShkYXRlLmdldFRpbWUoKSArICg2MDAwMCAqICggLSB0aW1lem9uZSArIGxvY2FsVGltZXpvbmUpKSk7XHJcblx0XHRpZiAodW5rbm93blRpbWV6b25lKVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBudWxsIGRlbm90ZXMgXCJ1bmtub3duIHRpbWV6b25lXCJcclxuXHRcdFx0cmVzdWx0Lm9yaWdpbmFsVGltZXpvbmUgPSBudWxsO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHRyZXN1bHQub3JpZ2luYWxUaW1lem9uZSA9IHRpbWV6b25lO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHJlc3VsdDtcclxuXHR9LFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVEYXRlKHZhbHVlKTtcclxuXHRcdHZhciB0aW1lID0gdmFsdWUuZ2V0VGltZSgpO1xyXG5cdFx0aWYgKHRpbWUgPD0gLTg2NDAwMDAwICYmIHRpbWUgPj0gODY0MDAwMDApIHtcclxuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHRpbWUgWycgKyB2YWx1ZSArICddLicpO1xyXG5cdFx0fVxyXG5cdFx0Ly8gT3JpZ2luYWwgdGltZXpvbmUgd2FzIHVua25vd24sIGp1c3QgdXNlIGN1cnJlbnQgdGltZSwgbm8gdGltZXpvbmVcclxuXHRcdGlmICh2YWx1ZS5vcmlnaW5hbFRpbWV6b25lID09PSBudWxsKVxyXG5cdFx0e1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5wcmludFRpbWUobmV3IEpzb25peC5YTUwuQ2FsZW5kYXIoe1xyXG5cdFx0XHRcdGhvdXIgOiB2YWx1ZS5nZXRIb3VycygpLFxyXG5cdFx0XHRcdG1pbnV0ZSA6IHZhbHVlLmdldE1pbnV0ZXMoKSxcclxuXHRcdFx0XHRzZWNvbmQgOiB2YWx1ZS5nZXRTZWNvbmRzKCksXHJcblx0XHRcdFx0ZnJhY3Rpb25hbFNlY29uZCA6ICh2YWx1ZS5nZXRNaWxsaXNlY29uZHMoKSAvIDEwMDApXHJcblx0XHRcdH0pKTtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0dmFyIGNvcnJlY3RlZFZhbHVlO1xyXG5cdFx0XHR2YXIgdGltZXpvbmU7XHJcblx0XHRcdHZhciBsb2NhbFRpbWV6b25lID0gLSB2YWx1ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG5cdFx0XHRpZiAoSnNvbml4LlV0aWwuTnVtYmVyVXRpbHMuaXNJbnRlZ2VyKHZhbHVlLm9yaWdpbmFsVGltZXpvbmUpKVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0dGltZXpvbmUgPSB2YWx1ZS5vcmlnaW5hbFRpbWV6b25lO1xyXG5cdFx0XHRcdGNvcnJlY3RlZFZhbHVlID0gbmV3IERhdGUodmFsdWUuZ2V0VGltZSgpIC0gKDYwMDAwICogKCAtIHRpbWV6b25lICsgbG9jYWxUaW1lem9uZSkpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlXHJcblx0XHRcdHtcclxuXHRcdFx0XHR0aW1lem9uZSA9IGxvY2FsVGltZXpvbmU7XHJcblx0XHRcdFx0Y29ycmVjdGVkVmFsdWUgPSB2YWx1ZTtcclxuXHRcdFx0fVxyXG5cdFx0XHR2YXIgY29ycmVjdGVkVGltZSA9IGNvcnJlY3RlZFZhbHVlLmdldFRpbWUoKTtcclxuXHRcdFx0aWYgKGNvcnJlY3RlZFRpbWUgPj0gKC0gbG9jYWxUaW1lem9uZSAqIDYwMDAwKSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnByaW50VGltZShuZXcgSnNvbml4LlhNTC5DYWxlbmRhcih7XHJcblx0XHRcdFx0XHRob3VyIDogY29ycmVjdGVkVmFsdWUuZ2V0SG91cnMoKSxcclxuXHRcdFx0XHRcdG1pbnV0ZSA6IGNvcnJlY3RlZFZhbHVlLmdldE1pbnV0ZXMoKSxcclxuXHRcdFx0XHRcdHNlY29uZCA6IGNvcnJlY3RlZFZhbHVlLmdldFNlY29uZHMoKSxcclxuXHRcdFx0XHRcdGZyYWN0aW9uYWxTZWNvbmQgOiAoY29ycmVjdGVkVmFsdWUuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwKSxcclxuXHRcdFx0XHRcdHRpbWV6b25lOiB0aW1lem9uZVxyXG5cdFx0XHRcdH0pKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR2YXIgdGltZXpvbmVIb3VycyA9IE1hdGguY2VpbCgtY29ycmVjdGVkVGltZSAvIDM2MDAwMDApO1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBjb3JyZWN0ZWRUaW1lSW5TZWNvbmRzID0gY29ycmVjdGVkVmFsdWUuZ2V0U2Vjb25kcygpICtcclxuXHRcdFx0XHRcdGNvcnJlY3RlZFZhbHVlLmdldE1pbnV0ZXMoKSAqIDYwICtcclxuXHRcdFx0XHRcdGNvcnJlY3RlZFZhbHVlLmdldEhvdXJzKCkgKiAzNjAwICtcclxuXHRcdFx0XHRcdHRpbWV6b25lSG91cnMgKiAzNjAwIC1cclxuXHRcdFx0XHRcdHRpbWV6b25lICogNjA7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMucHJpbnRUaW1lKG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKHtcclxuXHRcdFx0XHRcdGhvdXIgOiBjb3JyZWN0ZWRUaW1lSW5TZWNvbmRzICUgODY0MDAsXHJcblx0XHRcdFx0XHRtaW51dGUgOiBjb3JyZWN0ZWRUaW1lSW5TZWNvbmRzICUgMzYwMCxcclxuXHRcdFx0XHRcdHNlY29uZCA6IGNvcnJlY3RlZFRpbWVJblNlY29uZHMgJSA2MCxcclxuXHRcdFx0XHRcdGZyYWN0aW9uYWxTZWNvbmQgOiAoY29ycmVjdGVkVmFsdWUuZ2V0TWlsbGlzZWNvbmRzKCkgLyAxMDAwKSxcclxuXHRcdFx0XHRcdHRpbWV6b25lIDogdGltZXpvbmVIb3VycyAqIDYwXHJcblx0XHRcdFx0fSkpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gSnNvbml4LlV0aWwuVHlwZS5pc0RhdGUodmFsdWUpICYmIHZhbHVlLmdldFRpbWUoKSA+IC04NjQwMDAwMCAmJiB2YWx1ZS5nZXRUaW1lKCkgPCA4NjQwMDAwMDtcclxuXHR9LFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuVGltZUFzRGF0ZSdcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELlRpbWVBc0RhdGUuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuVGltZUFzRGF0ZSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5UaW1lQXNEYXRlLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5UaW1lQXNEYXRlLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRGF0ZSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhciwge1xyXG5cdG5hbWUgOiAnRGF0ZScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnZGF0ZScpLFxyXG5cdHBhcnNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucGFyc2VEYXRlKHZhbHVlKTtcclxuXHR9LFxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByaW50RGF0ZSh2YWx1ZSk7XHJcblx0fSxcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELkRhdGUnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5EYXRlLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkRhdGUoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRGF0ZS5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuRGF0ZS5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRhdGVBc0RhdGUgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIsIHtcclxuXHRuYW1lIDogJ0RhdGVBc0RhdGUnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2RhdGUnKSxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHZhciBjYWxlbmRhciA9IHRoaXMucGFyc2VEYXRlKHZhbHVlKTtcclxuXHRcdHZhciBkYXRlID0gbmV3IERhdGUoKTtcclxuXHRcdGRhdGUuc2V0RnVsbFllYXIoY2FsZW5kYXIueWVhcik7XHJcblx0XHRkYXRlLnNldE1vbnRoKGNhbGVuZGFyLm1vbnRoIC0gMSk7XHJcblx0XHRkYXRlLnNldERhdGUoY2FsZW5kYXIuZGF5KTtcclxuXHRcdGRhdGUuc2V0SG91cnMoMCk7XHJcblx0XHRkYXRlLnNldE1pbnV0ZXMoMCk7XHJcblx0XHRkYXRlLnNldFNlY29uZHMoMCk7XHJcblx0XHRkYXRlLnNldE1pbGxpc2Vjb25kcygwKTtcclxuXHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmlzTnVtYmVyKGNhbGVuZGFyLmZyYWN0aW9uYWxTZWNvbmQpKSB7XHJcblx0XHRcdGRhdGUuc2V0TWlsbGlzZWNvbmRzKE1hdGguZmxvb3IoMTAwMCAqIGNhbGVuZGFyLmZyYWN0aW9uYWxTZWNvbmQpKTtcclxuXHRcdH1cclxuXHRcdHZhciB0aW1lem9uZTtcclxuXHRcdHZhciB1bmtub3duVGltZXpvbmU7XHJcblx0XHR2YXIgbG9jYWxUaW1lem9uZSA9IC0gZGF0ZS5nZXRUaW1lem9uZU9mZnNldCgpO1xyXG5cdFx0aWYgKEpzb25peC5VdGlsLk51bWJlclV0aWxzLmlzSW50ZWdlcihjYWxlbmRhci50aW1lem9uZSkpXHJcblx0XHR7XHJcblx0XHRcdHRpbWV6b25lID0gY2FsZW5kYXIudGltZXpvbmU7XHJcblx0XHRcdHVua25vd25UaW1lem9uZSA9IGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0ZWxzZVxyXG5cdFx0e1xyXG5cdFx0XHQvLyBVbmtub3duIHRpbWV6b25lXHJcblx0XHRcdHRpbWV6b25lID0gbG9jYWxUaW1lem9uZTtcclxuXHRcdFx0dW5rbm93blRpbWV6b25lID0gdHJ1ZTtcclxuXHRcdH1cclxuXHRcdC8vXHJcblx0XHR2YXIgcmVzdWx0ID0gbmV3IERhdGUoZGF0ZS5nZXRUaW1lKCkgKyAoNjAwMDAgKiAoIC0gdGltZXpvbmUgKyBsb2NhbFRpbWV6b25lKSkpO1xyXG5cdFx0aWYgKHVua25vd25UaW1lem9uZSlcclxuXHRcdHtcclxuXHRcdFx0Ly8gbnVsbCBkZW5vdGVzIFwidW5rbm93biB0aW1lem9uZVwiXHJcblx0XHRcdHJlc3VsdC5vcmlnaW5hbFRpbWV6b25lID0gbnVsbDtcclxuXHRcdH1cclxuXHRcdGVsc2VcclxuXHRcdHtcclxuXHRcdFx0cmVzdWx0Lm9yaWdpbmFsVGltZXpvbmUgPSB0aW1lem9uZTtcclxuXHRcdH1cclxuXHRcdHJldHVybiByZXN1bHQ7XHJcblx0fSxcclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlRGF0ZSh2YWx1ZSk7XHJcblx0XHR2YXIgbG9jYWxEYXRlID0gbmV3IERhdGUodmFsdWUuZ2V0VGltZSgpKTtcclxuXHRcdGxvY2FsRGF0ZS5zZXRIb3VycygwKTtcclxuXHRcdGxvY2FsRGF0ZS5zZXRNaW51dGVzKDApO1xyXG5cdFx0bG9jYWxEYXRlLnNldFNlY29uZHMoMCk7XHJcblx0XHRsb2NhbERhdGUuc2V0TWlsbGlzZWNvbmRzKDApO1xyXG5cdFx0XHJcblx0XHQvLyBPcmlnaW5hbCB0aW1lem9uZSBpcyB1bmtub3duXHJcblx0XHRpZiAodmFsdWUub3JpZ2luYWxUaW1lem9uZSA9PT0gbnVsbClcclxuXHRcdHtcclxuXHRcdFx0cmV0dXJuIHRoaXMucHJpbnREYXRlKG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKHtcclxuXHRcdFx0XHR5ZWFyIDogdmFsdWUuZ2V0RnVsbFllYXIoKSxcclxuXHRcdFx0XHRtb250aCA6IHZhbHVlLmdldE1vbnRoKCkgKyAxLFxyXG5cdFx0XHRcdGRheSA6IHZhbHVlLmdldERhdGUoKVxyXG5cdFx0XHR9KSk7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdC8vIElmIG9yaWdpbmFsIHRpbWV6b25lIHdhcyBrbm93biwgY29ycmVjdCBhbmQgcHJpbnQgdGhlIHZhbHVlIHdpdGggdGhlIHRpbWV6b25lXHJcblx0XHRcdGlmIChKc29uaXguVXRpbC5OdW1iZXJVdGlscy5pc0ludGVnZXIodmFsdWUub3JpZ2luYWxUaW1lem9uZSkpXHJcblx0XHRcdHtcclxuXHRcdFx0XHR2YXIgY29ycmVjdGVkVmFsdWUgPSBuZXcgRGF0ZSh2YWx1ZS5nZXRUaW1lKCkgLSAoNjAwMDAgKiAoLSB2YWx1ZS5vcmlnaW5hbFRpbWV6b25lIC0gdmFsdWUuZ2V0VGltZXpvbmVPZmZzZXQoKSkpKTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5wcmludERhdGUobmV3IEpzb25peC5YTUwuQ2FsZW5kYXIoe1xyXG5cdFx0XHRcdFx0eWVhciA6IGNvcnJlY3RlZFZhbHVlLmdldEZ1bGxZZWFyKCksXHJcblx0XHRcdFx0XHRtb250aCA6IGNvcnJlY3RlZFZhbHVlLmdldE1vbnRoKCkgKyAxLFxyXG5cdFx0XHRcdFx0ZGF5IDogY29ycmVjdGVkVmFsdWUuZ2V0RGF0ZSgpLFxyXG5cdFx0XHRcdFx0dGltZXpvbmUgOiB2YWx1ZS5vcmlnaW5hbFRpbWV6b25lXHJcblx0XHRcdFx0fSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vIElmIG9yaWdpbmFsIHRpbWV6b25lIHdhcyBub3Qgc3BlY2lmaWVkLCBkbyBub3QgY29ycmVjdCBhbmQgdXNlIHRoZSBsb2NhbCB0aW1lIHpvbmVcclxuXHRcdFx0ZWxzZVxyXG5cdFx0XHR7XHJcblx0XHRcdFx0Ly8gV2UgYXNzdW1lIHRoYXQgdGhlIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgZGF0ZSB2YWx1ZSBhbmQgbG9jYWwgbWlkbmlnaHRcclxuXHRcdFx0XHQvLyBzaG91bGQgYmUgaW50ZXJwcmV0ZWQgYXMgYSB0aW1lem9uZSBvZmZzZXQuXHJcblx0XHRcdFx0Ly8gSW4gY2FzZSB0aGVyZSdzIG5vIGRpZmZlcmVuY2UsIHdlIGFzc3VtZSBkZWZhdWx0L3Vua25vd24gdGltZXpvbmVcclxuXHRcdFx0XHR2YXIgbG9jYWxUaW1lem9uZSA9IC0gdmFsdWUuZ2V0VGltZSgpICsgbG9jYWxEYXRlLmdldFRpbWUoKTtcclxuXHRcdFx0XHRpZiAobG9jYWxUaW1lem9uZSA9PT0gMCkge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHRoaXMucHJpbnREYXRlKG5ldyBKc29uaXguWE1MLkNhbGVuZGFyKHtcclxuXHRcdFx0XHRcdFx0eWVhciA6IHZhbHVlLmdldEZ1bGxZZWFyKCksXHJcblx0XHRcdFx0XHRcdG1vbnRoIDogdmFsdWUuZ2V0TW9udGgoKSArIDEsXHJcblx0XHRcdFx0XHRcdGRheSA6IHZhbHVlLmdldERhdGUoKVxyXG5cdFx0XHRcdFx0fSkpO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgdGltZXpvbmUgPSBsb2NhbFRpbWV6b25lIC0gKDYwMDAwICogdmFsdWUuZ2V0VGltZXpvbmVPZmZzZXQoKSk7XHJcblx0XHRcdFx0XHRpZiAodGltZXpvbmUgPj0gLTQzMjAwMDAwKSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnByaW50RGF0ZShuZXcgSnNvbml4LlhNTC5DYWxlbmRhcih7XHJcblx0XHRcdFx0XHRcdFx0eWVhciA6IHZhbHVlLmdldEZ1bGxZZWFyKCksXHJcblx0XHRcdFx0XHRcdFx0bW9udGggOiB2YWx1ZS5nZXRNb250aCgpICsgMSxcclxuXHRcdFx0XHRcdFx0XHRkYXkgOiB2YWx1ZS5nZXREYXRlKCksXHJcblx0XHRcdFx0XHRcdFx0dGltZXpvbmUgOiBNYXRoLmZsb29yKHRpbWV6b25lIC8gNjAwMDApXHJcblx0XHRcdFx0XHRcdH0pKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHZhciBuZXh0RGF5ID0gbmV3IERhdGUodmFsdWUuZ2V0VGltZSgpICsgODY0MDAwMDApO1xyXG5cdFx0XHRcdFx0XHRyZXR1cm4gdGhpcy5wcmludERhdGUobmV3IEpzb25peC5YTUwuQ2FsZW5kYXIoe1xyXG5cdFx0XHRcdFx0XHRcdHllYXIgOiBuZXh0RGF5LmdldEZ1bGxZZWFyKCksXHJcblx0XHRcdFx0XHRcdFx0bW9udGggOiBuZXh0RGF5LmdldE1vbnRoKCkgKyAxLFxyXG5cdFx0XHRcdFx0XHRcdGRheSA6IG5leHREYXkuZ2V0RGF0ZSgpLFxyXG5cdFx0XHRcdFx0XHRcdHRpbWV6b25lIDogKE1hdGguZmxvb3IodGltZXpvbmUgLyA2MDAwMCkgKyAxNDQwKVxyXG5cdFx0XHRcdFx0XHR9KSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fSxcclxuXHRpc0luc3RhbmNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gSnNvbml4LlV0aWwuVHlwZS5pc0RhdGUodmFsdWUpO1xyXG5cdH0sXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5EYXRlQXNEYXRlJ1xyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuRGF0ZUFzRGF0ZS5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5EYXRlQXNEYXRlKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkRhdGVBc0RhdGUuSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkRhdGVBc0RhdGUuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5HWWVhck1vbnRoID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLCB7XHJcblx0bmFtZSA6ICdHWWVhck1vbnRoJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdnWWVhck1vbnRoJyksXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5HWWVhck1vbnRoJyxcclxuXHJcblx0cGFyc2UgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wYXJzZUdZZWFyTW9udGgodmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSk7XHJcblx0fSxcclxuXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucHJpbnRHWWVhck1vbnRoKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHR9XHJcblxyXG59KTtcclxuSnNvbml4LlNjaGVtYS5YU0QuR1llYXJNb250aC5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5HWWVhck1vbnRoKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkdZZWFyTW9udGguSU5TVEFOQ0UuTElTVCA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5MaXN0KEpzb25peC5TY2hlbWEuWFNELkdZZWFyTW9udGguSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5HWWVhciA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhciwge1xyXG5cdG5hbWUgOiAnR1llYXInLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2dZZWFyJyksXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5HWWVhcicsXHJcblxyXG5cdHBhcnNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucGFyc2VHWWVhcih2YWx1ZSwgY29udGV4dCwgaW5wdXQsIHNjb3BlKTtcclxuXHR9LFxyXG5cclxuXHRwcmludCA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcmludEdZZWFyKHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHR9XHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5HWWVhci5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5HWWVhcigpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5HWWVhci5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuR1llYXIuSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5HTW9udGhEYXkgPSBKc29uaXguQ2xhc3MoSnNvbml4LlNjaGVtYS5YU0QuQ2FsZW5kYXIsIHtcclxuXHRuYW1lIDogJ0dNb250aERheScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnZ01vbnRoRGF5JyksXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5HTW9udGhEYXknLFxyXG5cclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnBhcnNlR01vbnRoRGF5KHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdH0sXHJcblxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByaW50R01vbnRoRGF5KHZhbHVlLCBjb250ZXh0LCBvdXRwdXQsIHNjb3BlKTtcclxuXHR9XHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5HTW9udGhEYXkuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuR01vbnRoRGF5KCk7XHJcbkpzb25peC5TY2hlbWEuWFNELkdNb250aERheS5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoSnNvbml4LlNjaGVtYS5YU0QuR01vbnRoRGF5LklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuR0RheSA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5DYWxlbmRhciwge1xyXG5cdG5hbWUgOiAnR0RheScsXHJcblx0dHlwZU5hbWUgOiBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnZ0RheScpLFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuR0RheScsXHJcblxyXG5cdHBhcnNlIDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIGlucHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucGFyc2VHRGF5KHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdH0sXHJcblxyXG5cdHByaW50IDogZnVuY3Rpb24odmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByaW50R0RheSh2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSk7XHJcblx0fVxyXG5cclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkdEYXkuSU5TVEFOQ0UgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuR0RheSgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5HRGF5LklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5HRGF5LklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuR01vbnRoID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLCB7XHJcblx0bmFtZSA6ICdHTW9udGgnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ2dNb250aCcpLFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuR01vbnRoJyxcclxuXHRwYXJzZSA6IGZ1bmN0aW9uKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnBhcnNlR01vbnRoKHZhbHVlLCBjb250ZXh0LCBpbnB1dCwgc2NvcGUpO1xyXG5cdH0sXHJcblx0cHJpbnQgOiBmdW5jdGlvbih2YWx1ZSwgY29udGV4dCwgb3V0cHV0LCBzY29wZSkge1xyXG5cdFx0cmV0dXJuIHRoaXMucHJpbnRHTW9udGgodmFsdWUsIGNvbnRleHQsIG91dHB1dCwgc2NvcGUpO1xyXG5cdH1cclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELkdNb250aC5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5HTW9udGgoKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuR01vbnRoLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChKc29uaXguU2NoZW1hLlhTRC5HTW9udGguSU5TVEFOQ0UpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5JRCA9IEpzb25peC5DbGFzcyhKc29uaXguU2NoZW1hLlhTRC5TdHJpbmcsIHtcclxuXHRuYW1lIDogJ0lEJyxcclxuXHR0eXBlTmFtZSA6IEpzb25peC5TY2hlbWEuWFNELnFuYW1lKCdJRCcpLFxyXG5cdENMQVNTX05BTUUgOiAnSnNvbml4LlNjaGVtYS5YU0QuSUQnXHJcbn0pO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5JRC5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5JRCgpO1xyXG5Kc29uaXguU2NoZW1hLlhTRC5JRC5JTlNUQU5DRS5MSVNUID0gbmV3IEpzb25peC5TY2hlbWEuWFNELkxpc3QoXHJcblx0XHRKc29uaXguU2NoZW1hLlhTRC5JRC5JTlNUQU5DRSk7XHJcbkpzb25peC5TY2hlbWEuWFNELklEUkVGID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELlN0cmluZywge1xyXG5cdG5hbWUgOiAnSURSRUYnLFxyXG5cdHR5cGVOYW1lIDogSnNvbml4LlNjaGVtYS5YU0QucW5hbWUoJ0lEUkVGJyksXHJcblx0Q0xBU1NfTkFNRSA6ICdKc29uaXguU2NoZW1hLlhTRC5JRFJFRidcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELklEUkVGLklOU1RBTkNFID0gbmV3IEpzb25peC5TY2hlbWEuWFNELklEUkVGKCk7XHJcbkpzb25peC5TY2hlbWEuWFNELklEUkVGLklOU1RBTkNFLkxJU1QgPSBuZXcgSnNvbml4LlNjaGVtYS5YU0QuTGlzdChcclxuXHRcdEpzb25peC5TY2hlbWEuWFNELklEUkVGLklOU1RBTkNFKTtcclxuSnNvbml4LlNjaGVtYS5YU0QuSURSRUZTID0gSnNvbml4LkNsYXNzKEpzb25peC5TY2hlbWEuWFNELkxpc3QsIHtcclxuXHRuYW1lIDogJ0lEUkVGUycsXHJcblx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKCkge1xyXG5cdFx0SnNvbml4LlNjaGVtYS5YU0QuTGlzdC5wcm90b3R5cGUuaW5pdGlhbGl6ZS5hcHBseSh0aGlzLCBbIEpzb25peC5TY2hlbWEuWFNELklEUkVGLklOU1RBTkNFLCBKc29uaXguU2NoZW1hLlhTRC5xbmFtZSgnSURSRUZTJyksICcgJyBdKTtcclxuXHR9LFxyXG5cdC8vIFRPRE8gQ29uc3RyYWludHNcclxuXHRDTEFTU19OQU1FIDogJ0pzb25peC5TY2hlbWEuWFNELklEUkVGUydcclxufSk7XHJcbkpzb25peC5TY2hlbWEuWFNELklEUkVGUy5JTlNUQU5DRSA9IG5ldyBKc29uaXguU2NoZW1hLlhTRC5JRFJFRlMoKTtcclxuSnNvbml4LlNjaGVtYS5YU0kgPSB7fTtcclxuSnNvbml4LlNjaGVtYS5YU0kuTkFNRVNQQUNFX1VSSSA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAxL1hNTFNjaGVtYS1pbnN0YW5jZSc7XHJcbkpzb25peC5TY2hlbWEuWFNJLlBSRUZJWCA9ICd4c2knO1xyXG5Kc29uaXguU2NoZW1hLlhTSS5UWVBFID0gJ3R5cGUnO1xyXG5Kc29uaXguU2NoZW1hLlhTSS5OSUwgPSAnbmlsJztcclxuSnNvbml4LlNjaGVtYS5YU0kucW5hbWUgPSBmdW5jdGlvbihsb2NhbFBhcnQpIHtcclxuXHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKGxvY2FsUGFydCk7XHJcblx0cmV0dXJuIG5ldyBKc29uaXguWE1MLlFOYW1lKEpzb25peC5TY2hlbWEuWFNJLk5BTUVTUEFDRV9VUkksIGxvY2FsUGFydCxcclxuXHRcdFx0SnNvbml4LlNjaGVtYS5YU0kuUFJFRklYKTtcclxufTtcclxuSnNvbml4LlNjaGVtYS5YU0kuVFlQRV9RTkFNRSA9IEpzb25peC5TY2hlbWEuWFNJLnFuYW1lKEpzb25peC5TY2hlbWEuWFNJLlRZUEUpO1xyXG5cclxuSnNvbml4LkNvbnRleHQgPSBKc29uaXhcclxuXHRcdC5DbGFzcyhKc29uaXguTWFwcGluZy5TdHlsZWQsIHtcclxuXHRcdFx0bW9kdWxlcyA6IFtdLFxyXG5cdFx0XHR0eXBlSW5mb3MgOiBudWxsLFxyXG5cdFx0XHR0eXBlTmFtZUtleVRvVHlwZUluZm8gOiBudWxsLFxyXG5cdFx0XHRlbGVtZW50SW5mb3MgOiBudWxsLFxyXG5cdFx0XHRvcHRpb25zIDogbnVsbCxcclxuXHRcdFx0c3Vic3RpdHV0aW9uTWVtYmVyc01hcCA6IG51bGwsXHJcblx0XHRcdHNjb3BlZEVsZW1lbnRJbmZvc01hcCA6IG51bGwsXHJcblx0XHRcdHN1cHBvcnRYc2lUeXBlIDogdHJ1ZSxcclxuXHRcdFx0aW5pdGlhbGl6ZSA6IGZ1bmN0aW9uKG1hcHBpbmdzLCBvcHRpb25zKSB7XHJcblx0XHRcdFx0SnNvbml4Lk1hcHBpbmcuU3R5bGVkLnByb3RvdHlwZS5pbml0aWFsaXplLmFwcGx5KHRoaXMsIFtvcHRpb25zXSk7XHJcblx0XHRcdFx0dGhpcy5tb2R1bGVzID0gW107XHJcblx0XHRcdFx0dGhpcy5lbGVtZW50SW5mb3MgPSBbXTtcclxuXHRcdFx0XHR0aGlzLnR5cGVJbmZvcyA9IHt9O1xyXG5cdFx0XHRcdHRoaXMudHlwZU5hbWVLZXlUb1R5cGVJbmZvID0ge307XHJcblx0XHRcdFx0dGhpcy5yZWdpc3RlckJ1aWx0aW5UeXBlSW5mb3MoKTtcclxuXHRcdFx0XHR0aGlzLm5hbWVzcGFjZVByZWZpeGVzID0ge307XHJcblx0XHRcdFx0dGhpcy5wcmVmaXhOYW1lc3BhY2VzID0ge307XHJcblx0XHRcdFx0dGhpcy5zdWJzdGl0dXRpb25NZW1iZXJzTWFwID0ge307XHJcblx0XHRcdFx0dGhpcy5zY29wZWRFbGVtZW50SW5mb3NNYXAgPSB7fTtcclxuXHJcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSBvcHRpb25zXHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG9wdGlvbnMpKSB7XHJcblx0XHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG9wdGlvbnMpO1xyXG5cdFx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGVcclxuXHRcdFx0XHRcdFx0XHQuaXNPYmplY3Qob3B0aW9ucy5uYW1lc3BhY2VQcmVmaXhlcykpIHtcclxuXHRcdFx0XHRcdFx0dGhpcy5uYW1lc3BhY2VQcmVmaXhlcyA9IFxyXG5cdFx0XHRcdFx0XHRcdEpzb25peC5VdGlsLlR5cGUuY2xvbmVPYmplY3Qob3B0aW9ucy5uYW1lc3BhY2VQcmVmaXhlcywge30pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGVcclxuXHRcdFx0XHRcdFx0XHQuaXNCb29sZWFuKG9wdGlvbnMuc3VwcG9ydFhzaVR5cGUpKSB7XHJcblx0XHRcdFx0XHRcdHRoaXMuc3VwcG9ydFhzaVR5cGUgPSBvcHRpb25zLnN1cHBvcnRYc2lUeXBlOyBcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSBwcmVmaXgvbmFtZXNwYWNlIG1hcHBpbmdcclxuXHRcdFx0XHRmb3IgKHZhciBucyBpbiB0aGlzLm5hbWVzcGFjZVByZWZpeGVzKVxyXG5cdFx0XHRcdHtcclxuXHRcdFx0XHRcdGlmICh0aGlzLm5hbWVzcGFjZVByZWZpeGVzLmhhc093blByb3BlcnR5KG5zKSlcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0cCA9IHRoaXMubmFtZXNwYWNlUHJlZml4ZXNbbnNdO1xyXG5cdFx0XHRcdFx0XHR0aGlzLnByZWZpeE5hbWVzcGFjZXNbcF0gPSBucztcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Ly8gSW5pdGlhbGl6ZSBtb2R1bGVzXHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG1hcHBpbmdzKSkge1xyXG5cdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZUFycmF5KG1hcHBpbmdzKTtcclxuXHRcdFx0XHRcdC8vIEluaXRpYWxpemUgbW9kdWxlc1xyXG5cdFx0XHRcdFx0dmFyIGluZGV4LCBtYXBwaW5nLCBtb2R1bGU7XHJcblx0XHRcdFx0XHRmb3IgKGluZGV4ID0gMDsgaW5kZXggPCBtYXBwaW5ncy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdFx0bWFwcGluZyA9IG1hcHBpbmdzW2luZGV4XTtcclxuXHRcdFx0XHRcdFx0bW9kdWxlID0gdGhpcy5jcmVhdGVNb2R1bGUobWFwcGluZyk7XHJcblx0XHRcdFx0XHRcdHRoaXMubW9kdWxlc1tpbmRleF0gPSBtb2R1bGU7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHRoaXMucHJvY2Vzc01vZHVsZXMoKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Y3JlYXRlTW9kdWxlIDogZnVuY3Rpb24obWFwcGluZykge1xyXG5cdFx0XHRcdHZhciBtb2R1bGU7XHJcblx0XHRcdFx0aWYgKG1hcHBpbmcgaW5zdGFuY2VvZiB0aGlzLm1hcHBpbmdTdHlsZS5tb2R1bGUpIHtcclxuXHRcdFx0XHRcdG1vZHVsZSA9IG1hcHBpbmc7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdG1hcHBpbmcgPSBKc29uaXguVXRpbC5UeXBlLmNsb25lT2JqZWN0KG1hcHBpbmcpO1xyXG5cdFx0XHRcdFx0bW9kdWxlID0gbmV3IHRoaXMubWFwcGluZ1N0eWxlLm1vZHVsZShtYXBwaW5nLCBcclxuXHRcdFx0XHRcdHtcclxuXHRcdFx0XHRcdFx0bWFwcGluZ1N0eWxlIDogdGhpcy5tYXBwaW5nU3R5bGVcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gbW9kdWxlO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZWdpc3RlckJ1aWx0aW5UeXBlSW5mb3MgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRmb3IgKCB2YXIgaW5kZXggPSAwOyBpbmRleCA8IHRoaXMuYnVpbHRpblR5cGVJbmZvcy5sZW5ndGg7IGluZGV4KyspIHtcclxuXHRcdFx0XHRcdHRoaXMucmVnaXN0ZXJUeXBlSW5mbyh0aGlzLmJ1aWx0aW5UeXBlSW5mb3NbaW5kZXhdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHByb2Nlc3NNb2R1bGVzIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0dmFyIGluZGV4LCBtb2R1bGU7XHJcblx0XHRcdFx0Zm9yIChpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tb2R1bGVzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0bW9kdWxlID0gdGhpcy5tb2R1bGVzW2luZGV4XTtcclxuXHRcdFx0XHRcdG1vZHVsZS5yZWdpc3RlclR5cGVJbmZvcyh0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yIChpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tb2R1bGVzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0bW9kdWxlID0gdGhpcy5tb2R1bGVzW2luZGV4XTtcclxuXHRcdFx0XHRcdG1vZHVsZS5yZWdpc3RlckVsZW1lbnRJbmZvcyh0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yIChpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tb2R1bGVzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0bW9kdWxlID0gdGhpcy5tb2R1bGVzW2luZGV4XTtcclxuXHRcdFx0XHRcdG1vZHVsZS5idWlsZFR5cGVJbmZvcyh0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0Zm9yIChpbmRleCA9IDA7IGluZGV4IDwgdGhpcy5tb2R1bGVzLmxlbmd0aDsgaW5kZXgrKykge1xyXG5cdFx0XHRcdFx0bW9kdWxlID0gdGhpcy5tb2R1bGVzW2luZGV4XTtcclxuXHRcdFx0XHRcdG1vZHVsZS5idWlsZEVsZW1lbnRJbmZvcyh0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0sXHJcblx0XHRcdHJlZ2lzdGVyVHlwZUluZm8gOiBmdW5jdGlvbih0eXBlSW5mbykge1xyXG5cdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QodHlwZUluZm8pO1xyXG5cdFx0XHRcdHZhciBuID0gdHlwZUluZm8ubmFtZXx8dHlwZUluZm8ubnx8bnVsbDtcclxuXHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlU3RyaW5nKG4pO1xyXG5cdFx0XHRcdHRoaXMudHlwZUluZm9zW25dID0gdHlwZUluZm87XHJcblx0XHRcdFx0aWYgKHR5cGVJbmZvLnR5cGVOYW1lICYmIHR5cGVJbmZvLnR5cGVOYW1lLmtleSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHR0aGlzLnR5cGVOYW1lS2V5VG9UeXBlSW5mb1t0eXBlSW5mby50eXBlTmFtZS5rZXldID0gdHlwZUluZm87XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZXNvbHZlVHlwZUluZm8gOiBmdW5jdGlvbihtYXBwaW5nLCBtb2R1bGUpIHtcclxuXHRcdFx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKG1hcHBpbmcpKSB7XHJcblx0XHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0XHR9IGVsc2UgaWYgKG1hcHBpbmcgaW5zdGFuY2VvZiBKc29uaXguTW9kZWwuVHlwZUluZm8pIHtcclxuXHRcdFx0XHRcdHJldHVybiBtYXBwaW5nO1xyXG5cdFx0XHRcdH0gZWxzZSBpZiAoSnNvbml4LlV0aWwuVHlwZS5pc1N0cmluZyhtYXBwaW5nKSkge1xyXG5cdFx0XHRcdFx0dmFyIHR5cGVJbmZvTmFtZTtcclxuXHRcdFx0XHRcdC8vIElmIG1hcHBpbmcgc3RhcnRzIHdpdGggJy4nIGNvbnNpZGVyIGl0IHRvIGJlIGEgbG9jYWwgdHlwZSBuYW1lIGluIHRoaXMgbW9kdWxlXHJcblx0XHRcdFx0XHRpZiAobWFwcGluZy5sZW5ndGggPiAwICYmIG1hcHBpbmcuY2hhckF0KDApID09PSAnLicpXHJcblx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdHZhciBuID0gbW9kdWxlLm5hbWUgfHwgbW9kdWxlLm4gfHwgdW5kZWZpbmVkO1xyXG5cdFx0XHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1vZHVsZSwgJ1R5cGUgaW5mbyBtYXBwaW5nIGNhbiBvbmx5IGJlIHJlc29sdmVkIGlmIG1vZHVsZSBpcyBwcm92aWRlZC4nKTtcclxuXHRcdFx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhuLCAnVHlwZSBpbmZvIG1hcHBpbmcgY2FuIG9ubHkgYmUgcmVzb2x2ZWQgaWYgbW9kdWxlIG5hbWUgaXMgcHJvdmlkZWQuJyk7XHJcblx0XHRcdFx0XHRcdHR5cGVJbmZvTmFtZSA9IG4gKyBtYXBwaW5nO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0ZWxzZVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR0eXBlSW5mb05hbWUgPSBtYXBwaW5nO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0aWYgKCF0aGlzLnR5cGVJbmZvc1t0eXBlSW5mb05hbWVdKSB7XHJcblx0XHRcdFx0XHRcdHRocm93IG5ldyBFcnJvcignVHlwZSBpbmZvIFsnICsgdHlwZUluZm9OYW1lICsgJ10gaXMgbm90IGtub3duIGluIHRoaXMgY29udGV4dC4nKTtcclxuXHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdHJldHVybiB0aGlzLnR5cGVJbmZvc1t0eXBlSW5mb05hbWVdO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRKc29uaXguVXRpbC5FbnN1cmUuZW5zdXJlT2JqZWN0KG1vZHVsZSwgJ1R5cGUgaW5mbyBtYXBwaW5nIGNhbiBvbmx5IGJlIHJlc29sdmVkIGlmIG1vZHVsZSBpcyBwcm92aWRlZC4nKTtcclxuXHRcdFx0XHRcdHZhciB0eXBlSW5mbyA9IG1vZHVsZS5jcmVhdGVUeXBlSW5mbyhtYXBwaW5nKTtcclxuXHRcdFx0XHRcdHR5cGVJbmZvLmJ1aWxkKHRoaXMsIG1vZHVsZSk7XHJcblx0XHRcdFx0XHRyZXR1cm4gdHlwZUluZm87XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHRyZWdpc3RlckVsZW1lbnRJbmZvIDogZnVuY3Rpb24oZWxlbWVudEluZm8sIG1vZHVsZSkge1xyXG5cdFx0XHRcdEpzb25peC5VdGlsLkVuc3VyZS5lbnN1cmVPYmplY3QoZWxlbWVudEluZm8pO1xyXG5cdFx0XHRcdHRoaXMuZWxlbWVudEluZm9zLnB1c2goZWxlbWVudEluZm8pO1xyXG5cclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZWxlbWVudEluZm8uc3Vic3RpdHV0aW9uSGVhZCkpIHtcclxuXHRcdFx0XHRcdHZhciBzdWJzdGl0dXRpb25IZWFkID0gZWxlbWVudEluZm8uc3Vic3RpdHV0aW9uSGVhZDtcclxuXHRcdFx0XHRcdHZhciBzdWJzdGl0dXRpb25IZWFkS2V5ID0gc3Vic3RpdHV0aW9uSGVhZC5rZXk7XHJcblx0XHRcdFx0XHR2YXIgc3Vic3RpdHV0aW9uTWVtYmVycyA9IHRoaXMuc3Vic3RpdHV0aW9uTWVtYmVyc01hcFtzdWJzdGl0dXRpb25IZWFkS2V5XTtcclxuXHJcblx0XHRcdFx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuaXNBcnJheShzdWJzdGl0dXRpb25NZW1iZXJzKSkge1xyXG5cdFx0XHRcdFx0XHRzdWJzdGl0dXRpb25NZW1iZXJzID0gW107XHJcblx0XHRcdFx0XHRcdHRoaXMuc3Vic3RpdHV0aW9uTWVtYmVyc01hcFtzdWJzdGl0dXRpb25IZWFkS2V5XSA9IHN1YnN0aXR1dGlvbk1lbWJlcnM7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRzdWJzdGl0dXRpb25NZW1iZXJzLnB1c2goZWxlbWVudEluZm8pO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIHNjb3BlS2V5O1xyXG5cdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhlbGVtZW50SW5mby5zY29wZSkpIHtcclxuXHRcdFx0XHRcdHNjb3BlS2V5ID0gdGhpcy5yZXNvbHZlVHlwZUluZm8oZWxlbWVudEluZm8uc2NvcGUsIG1vZHVsZSkubmFtZTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0c2NvcGVLZXkgPSAnIyNnbG9iYWwnO1xyXG5cdFx0XHRcdH1cclxuXHJcblx0XHRcdFx0dmFyIHNjb3BlZEVsZW1lbnRJbmZvcyA9IHRoaXMuc2NvcGVkRWxlbWVudEluZm9zTWFwW3Njb3BlS2V5XTtcclxuXHJcblx0XHRcdFx0aWYgKCFKc29uaXguVXRpbC5UeXBlLmlzT2JqZWN0KHNjb3BlZEVsZW1lbnRJbmZvcykpIHtcclxuXHRcdFx0XHRcdHNjb3BlZEVsZW1lbnRJbmZvcyA9IHt9O1xyXG5cdFx0XHRcdFx0dGhpcy5zY29wZWRFbGVtZW50SW5mb3NNYXBbc2NvcGVLZXldID0gc2NvcGVkRWxlbWVudEluZm9zO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRzY29wZWRFbGVtZW50SW5mb3NbZWxlbWVudEluZm8uZWxlbWVudE5hbWUua2V5XSA9IGVsZW1lbnRJbmZvO1xyXG5cclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0VHlwZUluZm9CeVZhbHVlIDogZnVuY3Rpb24odmFsdWUpXHJcblx0XHRcdHtcclxuXHRcdFx0XHRpZiAoIUpzb25peC5VdGlsLlR5cGUuZXhpc3RzKHZhbHVlKSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm4gdW5kZWZpbmVkO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5pc09iamVjdCh2YWx1ZSkpXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0dmFyIHR5cGVOYW1lID0gdmFsdWUuVFlQRV9OQU1FO1xyXG5cdFx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcodHlwZU5hbWUpKVxyXG5cdFx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0XHR2YXIgdHlwZUluZm9CeU5hbWUgPSB0aGlzLmdldFR5cGVJbmZvQnlOYW1lKHR5cGVOYW1lKTtcclxuXHRcdFx0XHRcdFx0aWYgKHR5cGVJbmZvQnlOYW1lKVxyXG5cdFx0XHRcdFx0XHR7XHJcblx0XHRcdFx0XHRcdFx0cmV0dXJuIHR5cGVJbmZvQnlOYW1lO1xyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybiB1bmRlZmluZWQ7XHJcblx0XHRcdH0sXHJcblx0XHRcdC8vIFRPRE8gcHVibGljIEFQSVxyXG5cdFx0XHRnZXRUeXBlSW5mb0J5TmFtZSA6IGZ1bmN0aW9uKG5hbWUpIHtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy50eXBlSW5mb3NbbmFtZV07XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldFR5cGVJbmZvQnlUeXBlTmFtZSA6IGZ1bmN0aW9uKHR5cGVOYW1lKSB7XHJcblx0XHRcdFx0dmFyIHRuID0gSnNvbml4LlhNTC5RTmFtZS5mcm9tT2JqZWN0T3JTdHJpbmcodHlwZU5hbWUsIHRoaXMpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnR5cGVOYW1lS2V5VG9UeXBlSW5mb1t0bi5rZXldO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRUeXBlSW5mb0J5VHlwZU5hbWVLZXkgOiBmdW5jdGlvbih0eXBlTmFtZUtleSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnR5cGVOYW1lS2V5VG9UeXBlSW5mb1t0eXBlTmFtZUtleV07XHJcblx0XHRcdH0sXHJcblx0XHRcdGdldEVsZW1lbnRJbmZvIDogZnVuY3Rpb24obmFtZSwgc2NvcGUpIHtcclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoc2NvcGUpKSB7XHJcblx0XHRcdFx0XHR2YXIgc2NvcGVLZXkgPSBzY29wZS5uYW1lO1xyXG5cdFx0XHRcdFx0dmFyIHNjb3BlZEVsZW1lbnRJbmZvcyA9IHRoaXMuc2NvcGVkRWxlbWVudEluZm9zTWFwW3Njb3BlS2V5XTtcclxuXHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhzY29wZWRFbGVtZW50SW5mb3MpKSB7XHJcblx0XHRcdFx0XHRcdHZhciBzY29wZWRFbGVtZW50SW5mbyA9IHNjb3BlZEVsZW1lbnRJbmZvc1tuYW1lLmtleV07XHJcblx0XHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhzY29wZWRFbGVtZW50SW5mbykpIHtcclxuXHRcdFx0XHRcdFx0XHRyZXR1cm4gc2NvcGVkRWxlbWVudEluZm87XHJcblx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBnbG9iYWxTY29wZUtleSA9ICcjI2dsb2JhbCc7XHJcblx0XHRcdFx0dmFyIGdsb2JhbFNjb3BlZEVsZW1lbnRJbmZvcyA9IHRoaXMuc2NvcGVkRWxlbWVudEluZm9zTWFwW2dsb2JhbFNjb3BlS2V5XTtcclxuXHRcdFx0XHRpZiAoSnNvbml4LlV0aWwuVHlwZS5leGlzdHMoZ2xvYmFsU2NvcGVkRWxlbWVudEluZm9zKSkge1xyXG5cdFx0XHRcdFx0dmFyIGdsb2JhbFNjb3BlZEVsZW1lbnRJbmZvID0gZ2xvYmFsU2NvcGVkRWxlbWVudEluZm9zW25hbWUua2V5XTtcclxuXHRcdFx0XHRcdGlmIChKc29uaXguVXRpbC5UeXBlLmV4aXN0cyhnbG9iYWxTY29wZWRFbGVtZW50SW5mbykpIHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIGdsb2JhbFNjb3BlZEVsZW1lbnRJbmZvO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdFx0XHQvL1xyXG5cdFx0XHRcdC8vIHRocm93IG5ldyBFcnJvcihcIkVsZW1lbnQgW1wiICsgbmFtZS5rZXlcclxuXHRcdFx0XHQvLyArIFwiXSBjb3VsZCBub3QgYmUgZm91bmQgaW4gdGhlIGdpdmVuIGNvbnRleHQuXCIpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRnZXRTdWJzdGl0dXRpb25NZW1iZXJzIDogZnVuY3Rpb24obmFtZSkge1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnN1YnN0aXR1dGlvbk1lbWJlcnNNYXBbSnNvbml4LlhNTC5RTmFtZVxyXG5cdFx0XHRcdFx0XHQuZnJvbU9iamVjdChuYW1lKS5rZXldO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjcmVhdGVNYXJzaGFsbGVyIDogZnVuY3Rpb24oKSB7XHJcblx0XHRcdFx0cmV0dXJuIG5ldyB0aGlzLm1hcHBpbmdTdHlsZS5tYXJzaGFsbGVyKHRoaXMpO1xyXG5cdFx0XHR9LFxyXG5cdFx0XHRjcmVhdGVVbm1hcnNoYWxsZXIgOiBmdW5jdGlvbigpIHtcclxuXHRcdFx0XHRyZXR1cm4gbmV3IHRoaXMubWFwcGluZ1N0eWxlLnVubWFyc2hhbGxlcih0aGlzKTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0TmFtZXNwYWNlVVJJIDogZnVuY3Rpb24ocHJlZml4KSB7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhwcmVmaXgpO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLnByZWZpeE5hbWVzcGFjZXNbcHJlZml4XTtcclxuXHRcdFx0fSxcclxuXHRcdFx0Z2V0UHJlZml4IDogZnVuY3Rpb24obmFtZXNwYWNlVVJJLCBkZWZhdWx0UHJlZml4KSB7XHJcblx0XHRcdFx0SnNvbml4LlV0aWwuRW5zdXJlLmVuc3VyZVN0cmluZyhuYW1lc3BhY2VVUkkpO1xyXG5cdFx0XHRcdHZhciBwcmVmaXggPSB0aGlzLm5hbWVzcGFjZVByZWZpeGVzW25hbWVzcGFjZVVSSV07XHJcblx0XHRcdFx0aWYgKEpzb25peC5VdGlsLlR5cGUuaXNTdHJpbmcocHJlZml4KSlcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRyZXR1cm4gcHJlZml4O1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRlbHNlXHJcblx0XHRcdFx0e1xyXG5cdFx0XHRcdFx0cmV0dXJuIGRlZmF1bHRQcmVmaXg7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9LFxyXG5cdFx0XHQvKipcclxuXHRcdFx0ICogQnVpbHRpbiB0eXBlIGluZm9zLlxyXG5cdFx0XHQgKi9cclxuXHRcdFx0YnVpbHRpblR5cGVJbmZvcyA6IFtcclxuXHRcdFx0ICAgICAgICBKc29uaXguU2NoZW1hLlhTRC5BbnlUeXBlLklOU1RBTkNFLFxyXG5cdFx0XHQgICAgICAgIEpzb25peC5TY2hlbWEuWFNELkFueVNpbXBsZVR5cGUuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5BbnlVUkkuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5CYXNlNjRCaW5hcnkuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5Cb29sZWFuLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuQnl0ZS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkNhbGVuZGFyLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuRGF0ZUFzRGF0ZS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkRhdGUuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5EYXRlVGltZUFzRGF0ZS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkRhdGVUaW1lLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuRGVjaW1hbC5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkRvdWJsZS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkR1cmF0aW9uLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuRmxvYXQuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5HRGF5LklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuR01vbnRoLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuR01vbnRoRGF5LklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuR1llYXIuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5HWWVhck1vbnRoLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuSGV4QmluYXJ5LklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuSUQuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5JRFJFRi5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELklEUkVGUy5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkludC5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkludGVnZXIuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5MYW5ndWFnZS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELkxvbmcuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5OYW1lLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuTkNOYW1lLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuTmVnYXRpdmVJbnRlZ2VyLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuTk1Ub2tlbi5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELk5NVG9rZW5zLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuTm9uTmVnYXRpdmVJbnRlZ2VyLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuTm9uUG9zaXRpdmVJbnRlZ2VyLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuTm9ybWFsaXplZFN0cmluZy5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELk51bWJlci5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELlBvc2l0aXZlSW50ZWdlci5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELlFOYW1lLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuU2hvcnQuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5TdHJpbmcuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5TdHJpbmdzLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuVGltZUFzRGF0ZS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELlRpbWUuSU5TVEFOQ0UsXHJcblx0XHRcdFx0XHRKc29uaXguU2NoZW1hLlhTRC5Ub2tlbi5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkQnl0ZS5JTlNUQU5DRSxcclxuXHRcdFx0XHRcdEpzb25peC5TY2hlbWEuWFNELlVuc2lnbmVkSW50LklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRMb25nLklOU1RBTkNFLFxyXG5cdFx0XHRcdFx0SnNvbml4LlNjaGVtYS5YU0QuVW5zaWduZWRTaG9ydC5JTlNUQU5DRSBdLFxyXG5cdFx0XHRDTEFTU19OQU1FIDogJ0pzb25peC5Db250ZXh0J1xyXG5cdFx0fSk7XHJcblx0Ly8gQ29tcGxldGUgSnNvbml4IHNjcmlwdCBpcyBpbmNsdWRlZCBhYm92ZVxyXG5cdHJldHVybiB7IEpzb25peDogSnNvbml4IH07XHJcbn07XHJcblxyXG4vLyBJZiB0aGUgcmVxdWlyZSBmdW5jdGlvbiBleGlzdHMgLi4uXHJcbmlmICh0eXBlb2YgcmVxdWlyZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdC8vIC4uLiBidXQgdGhlIGRlZmluZSBmdW5jdGlvbiBkb2VzIG5vdCBleGlzdHNcclxuXHRpZiAodHlwZW9mIGRlZmluZSAhPT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0aWYgKCFwcm9jZXNzLmJyb3dzZXIpIHtcclxuXHRcdFx0Ly8gTG9hZCB0aGUgZGVmaW5lIGZ1bmN0aW9uIHZpYSBhbWRlZmluZVxyXG5cdFx0XHRkZWZpbmUgPSByZXF1aXJlKCdhbWRlZmluZScpKG1vZHVsZSk7XHJcblx0XHRcdC8vIFJlcXVpcmUgeG1sZG9tLCB4bWxodHRwcmVxdWVzdCBhbmQgZnNcclxuXHRcdFx0ZGVmaW5lKFtcInhtbGRvbVwiLCBcInhtbGh0dHByZXF1ZXN0XCIsIFwiZnNcIl0sIF9qc29uaXhfZmFjdG9yeSk7XHJcblx0XHR9XHJcblx0XHRlbHNlXHJcblx0XHR7XHJcblx0XHRcdC8vIFdlJ3JlIHByb2JhYmx5IGluIGJyb3dzZXIsIG1heWJlIGJyb3dzZXJpZnlcclxuXHRcdFx0Ly8gRG8gbm90IHJlcXVpcmUgeG1sZG9tLCB4bWxodHRwcmVxdWVzdCBhcyB0aGV5J3IgcHJvdmlkZWQgYnkgdGhlIGJyb3dzZXJcclxuXHRcdFx0Ly8gRG8gbm90IHJlcXVpcmUgZnMgc2luY2UgZmlsZSBzeXN0ZW0gaXMgbm90IGF2YWlsYWJsZSBhbnl3YXlcclxuXHRcdFx0ZGVmaW5lKFtdLCBfanNvbml4X2ZhY3RvcnkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRlbHNlIHtcclxuXHRcdC8vIE90aGVyd2lzZSBhc3N1bWUgd2UncmUgaW4gdGhlIGJyb3dzZXIvUmVxdWlyZUpTIGVudmlyb25tZW50XHJcblx0XHQvLyBMb2FkIHRoZSBtb2R1bGUgd2l0aG91dCB4bWxkb20gYW5kIHhtbGh0dHByZXF1ZXN0cyBkZXBlbmRlbmNpZXNcclxuXHRcdGRlZmluZShbXSwgX2pzb25peF9mYWN0b3J5KTtcclxuXHR9XHJcbn1cclxuLy8gSWYgdGhlIHJlcXVpcmUgZnVuY3Rpb24gZG9lcyBub3QgZXhpc3RzLCB3ZSdyZSBub3QgaW4gTm9kZS5qcyBhbmQgdGhlcmVmb3JlIGluIGJyb3dzZXIgZW52aXJvbm1lbnRcclxuZWxzZVxyXG57XHJcblx0Ly8gSnVzdCBjYWxsIHRoZSBmYWN0b3J5IGFuZCBzZXQgSnNvbml4IGFzIGdsb2JhbC5cclxuXHR2YXIgSnNvbml4ID0gX2pzb25peF9mYWN0b3J5KCkuSnNvbml4O1xyXG59XHJcbiJdfQ==