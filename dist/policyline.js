module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/adapter.js":
/*!************************!*\
  !*** ./src/adapter.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function optimize(exp) {
  var flag = void 0;
  do {
    flag = false;

    Object.keys(exp).forEach(function (key) {
      if (key === '$or') {
        for (var i = exp[key].length - 1; i >= 0; i--) {
          var obj = exp[key][i];
          if (obj['$or']) {
            for (var j = obj['$or'].length - 1; j >= 0; j--) {
              exp[key].push(obj['$or'][j]);
            }
            exp[key].splice(i, 1);
            flag = true;
          }
        }
      } else if (_typeof(exp[key]) === 'object') {
        exp[key] = optimize(exp[key]);
      }
    });
  } while (flag);

  return exp;
}

var MongoJSONb = {

  and: Object.assign.bind(Object),

  or: function or(a, b) {
    return {
      '$or': [a, b]
    };
  },

  optimize: optimize,

  proceed: function proceed(rules) {
    var OperatorMap = {
      '=': '$eq', //Matches values that are equal to a specified value.
      '==': '$eq', //Matches values that are equal to a specified value.
      '!=': '$ne', //Matches all values that are not equal to a specified value.
      '>=': '$gte', //Matches values that are greater than or equal to a specified value.
      '>': '$gt', //Matches values that are greater than a specified value.
      '<=': '$lte', //Matches values that are less than or equal to a specified value.
      '<': '$lt', //Matches values that are less than a specified value.
      '~=': '$in', //Matches any of the values specified in an array.
      '^=': '$nin' //Matches none of the values specified in an array.
    };

    var MutatorMap = {
      'or': function or(rule, result) {
        if (!result[rule.attribute]) {
          result[rule.attribute] = { '$or': [] };
        }

        result[rule.attribute]['$or'].push(rule.value);
      },
      'radius': function radius(rule, result, context) {
        context.radius = rule.value;
      },
      'inArea': function inArea(rule, result, context) {
        result[rule.attribute] = {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: rule.value
            },
            $maxDistance: 1000 * context.radius
          }
        };
      }
    };

    // adapter logic
    var result = {},
        context = {};
    var attribute = void 0;

    rules.forEach(function (rule) {
      attribute = rule.attribute;

      if (rule.mutators.length) {
        // apply mutators
        rule.mutators.forEach(function (mutator) {
          if (MutatorMap[mutator]) {
            if (!context[attribute]) {
              context[attribute] = {};
            }
            MutatorMap[mutator](rule, result, context[attribute]);
          }
        });
      } else {
        // apply attribute to result object
        if (result[attribute]) {
          result[attribute][OperatorMap[rule.operator]] = rule.value;
        } else {
          if (rule.operator === '=') {
            result[attribute] = rule.value;
          } else {
            result[attribute] = _defineProperty({}, OperatorMap[rule.operator], rule.value);
          }
        }
      }
    });

    return result;
  }
};

exports.default = { MongoJSONb: MongoJSONb };

/***/ }),

/***/ "./src/expression.js":
/*!***************************!*\
  !*** ./src/expression.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/* based on https://www.barkweb.co.uk/blog/how-to-build-a-calculator-in-javascript */
var operators = ['AND', 'OR', '(', ')'];
var TYPE = {
  op: 'OP',
  val: 'VAL'
};

var wrapToToken = function wrapToToken(item) {
  return {
    val: item,
    type: operators.includes(item) ? TYPE.op : TYPE.val
  };
};

var createTokens = function createTokens(expression) {
  return expression.split(/\s+|(?=\(|\))|\b/).map(wrapToToken);
};

var infixToRPN = function infixToRPN(tokens) {
  var queue = [];
  var stack = [];
  var precedence = {
    '(': 10,
    'AND': 30,
    'OR': 20
  };

  while (tokens.length) {
    var token = tokens.shift();
    var tkPrec = precedence[token.val] || 0;
    var stPrec = stack.length ? precedence[stack[stack.length - 1].val] : 0;

    if (token.type === TYPE.op && token.val === ')') {
      var op = null;

      while ((op = stack.pop()).val !== '(') {
        queue.push(op);
      }
    } else if (token.type === TYPE.val) {
      queue.push(token);
    } else if (token.type === TYPE.op && (!stack.length || token.val === '(' || tkPrec > stPrec)) {
      stack.push(token);
    } else {
      while (tkPrec <= stPrec) {
        queue.push(stack.pop());
        stPrec = stack.length ? precedence[stack[stack.length - 1].val] : 0;
      }

      stack.push(token);
    }
  }

  while (stack.length) {
    queue.push(stack.pop());
  }

  return queue;
};

var fillTokens = function fillTokens(tokens, data) {
  return tokens.reduce(function (prev, next) {
    var obj = {
      type: next.type,
      res: next.res,
      val: next.val
    };
    if (next.type === TYPE.val) {
      obj.res = data[next.val];
      obj.val = [next.val];
    }
    prev.push(obj);
    return prev;
  }, []);
};

var evaluateRPN = function evaluateRPN(tokens) {
  var stack = [];
  var val = void 0;

  while (tokens.length) {
    var token = tokens.shift();

    if (token.type === TYPE.val) {
      stack.push(token);
      continue;
    }

    var rhs = stack.pop();
    var lhs = stack.pop();

    switch (token.val) {
      case 'AND':
        stack.push({
          type: TYPE.val,
          val: rhs.res && lhs.res ? lhs.val.concat(rhs.val) : [],
          res: rhs.res && lhs.res
        });
        break;
      case 'OR':
        val = [];
        if (lhs.res) {
          val = lhs.val;
        } else if (rhs.res) {
          val = rhs.val;
        }

        stack.push({
          type: TYPE.val,
          val: val,
          res: rhs.res || lhs.res
        });
        break;
    }
  }

  return stack.pop();
};

var processRPN = function processRPN(tokens, adapter) {
  var stack = [];

  while (tokens.length) {
    var token = tokens.shift();

    if (token.type === TYPE.val) {
      stack.push(token);
      continue;
    }

    var rhs = stack.pop();
    var lhs = stack.pop();

    switch (token.val) {
      case 'OR':
        if (rhs && lhs && rhs.res && lhs.res) {
          stack.push({
            type: TYPE.val,
            res: adapter.or(rhs.res, lhs.res)
          });
        } else {
          if (rhs && rhs.res) {
            stack.push(rhs);
          }
          if (lhs && lhs.res) {
            stack.push(lhs);
          }
        }
        break;
      case 'AND':
        if (rhs && lhs && rhs.res && lhs.res) {
          stack.push({
            type: TYPE.val,
            res: adapter.and(rhs.res, lhs.res)
          });
        }
        break;
    }
  }

  return stack.pop();
};

exports.processRPN = processRPN;
exports.createTokens = createTokens;
exports.infixToRPN = infixToRPN;
exports.fillTokens = fillTokens;
exports.evaluateRPN = evaluateRPN;
exports.wrapToToken = wrapToToken;
exports.TYPE = TYPE;

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Adapter = exports.Mutator = exports.Operator = exports.Policy = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _target2 = __webpack_require__(/*! ./target */ "./src/target.js");

var _shared = __webpack_require__(/*! ./shared */ "./src/shared.js");

var _adapter = __webpack_require__(/*! ./adapter */ "./src/adapter.js");

var _adapter2 = _interopRequireDefault(_adapter);

var _expression = __webpack_require__(/*! ./expression */ "./src/expression.js");

var _utils = __webpack_require__(/*! ./utils */ "./src/utils.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _property = Symbol(); // inner property name
var _calcResult = Symbol();
var USER = 'user.';
var RESOURCE = 'resource.';
var ENV = 'env.';
var ACTION = 'action.';
var CONDITION = 'condition';
var WATCHER = 'watcher';
var BOOL = 'boolean';
var DENY = 'deny';

var checkOperand = function checkOperand(oper, objStr) {
  return oper.isDIObj && oper.value.indexOf && oper.value.indexOf(objStr) === 0;
};

var collectResult = function collectResult(obj, data, key, resourceName) {
  var context = {},
      targetResults = [];

  obj[_property].filterTarget[key].forEach(function (expr) {
    targetResults.push((0, _shared.prepareCollection)(data, expr, context, resourceName));
  });

  return obj.adapter.proceed(targetResults);
};

var aggregateResult = function aggregateResult(policy, type, data) {
  var rules = {},
      resource = type === CONDITION ? RESOURCE : USER;
  Object.keys(policy[_property].filterTarget).forEach(function (key) {
    try {
      rules[key] = collectResult(policy, data, key, resource);
      if (dependencyGuard(rules[key])) {
        rules[key] = undefined;
      }
    } catch (error) {
      // important to close error in calculate result
    }
  });

  return rules;
};

var dependencyGuard = function dependencyGuard(obj) {
  var flag = false;
  Object.keys(obj).forEach(function (key) {
    if (typeof obj[key] === 'string' && (obj[key].indexOf(USER) === 0 || obj[key].indexOf(RESOURCE) === 0 || obj[key].indexOf(ENV) === 0 || obj[key].indexOf(ACTION) === 0)) {
      flag = true;
    } else if (_typeof(obj[key]) === 'object') {
      flag = dependencyGuard(obj[key]);
    }
  });

  return flag;
};

var policyConstructor = function policyConstructor(policy) {
  var key = Math.random().toString(36).substr(2, 9);
  this[_property] = {
    expression: [(0, _expression.wrapToToken)(key)],
    target: _defineProperty({}, key, []),
    filterTarget: _defineProperty({}, key, [])
  };

  policyParse(policy, key, this);
};

var groupConstructor = function groupConstructor(jsonPolicy) {
  var _this = this;

  this[_property] = {
    expression: (0, _expression.infixToRPN)((0, _expression.createTokens)(jsonPolicy.expression)),
    target: {},
    filterTarget: {}
  };

  Object.keys(jsonPolicy.policies).forEach(function (key) {
    var policy = jsonPolicy.policies[key];
    _this[_property].target[key] = [];
    _this[_property].filterTarget[key] = [];

    policyParse(policy, key, _this);
  });
};

var prepareFor = function prepareFor(propName, key, context, _exp) {
  var operators = _target2.Operator.list;
  var exp = JSON.parse(JSON.stringify(_exp));
  var resourceName = propName === WATCHER ? USER : RESOURCE;

  /*
      We have a restriction; we cannot have a prepared property on both sides of the expression.
      This contradicts the logic of computation - it makes no sense to compare
      two different attributes of the same object.
   */
  if (checkOperand(exp.left, resourceName)) {
    // fill if expression in left side
    context[_property].filterTarget[key].push(exp);
  } else if (checkOperand(exp.right, resourceName)) {
    // turn over expression
    var tempObj = exp.right;
    exp.right = exp.left;
    exp.left = tempObj;
    if (operators[exp.operator].reverse) {
      exp.operator = operators[exp.operator].reverse;
    }

    context[_property].filterTarget[key].push(exp);
  }
};

var policyParse = function policyParse(policy, key, context) {
  policy.target.map(function (expStr) {
    return (0, _target2.parseExp)(expStr);
  }).forEach(function (_exp) {
    context[_property].target[key].push(_exp);
  });
};

var attributeCheck = function attributeCheck(obj) {
  var attrs = ['user', 'resource', 'action', 'env'];
  if ((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object') {
    Object.keys(obj).forEach(function (attr) {
      var index = attrs.indexOf(attr);
      if (index > -1) {
        attrs.splice(index, 1);
      }
    });
  }
  return attrs;
};

var Policy = function () {
  _createClass(Policy, [{
    key: 'toString',
    value: function toString() {
      return this.rules;
    }
  }]);

  function Policy(jsonPolicy) {
    _classCallCheck(this, Policy);

    this.rules = JSON.stringify(jsonPolicy, null, 2);
    this.adapter = _adapter2.default.MongoJSONb;

    if (jsonPolicy.hasOwnProperty('target')) {
      policyConstructor.call(this, jsonPolicy);
    } else {
      groupConstructor.call(this, jsonPolicy);
    }

    this[_property].effect = jsonPolicy.effect !== DENY;
    this[_property].lastData = null;
  }

  _createClass(Policy, [{
    key: 'check',
    value: function check(data) {
      var _this2 = this;

      // guard part
      var missingAttrs = attributeCheck(data);
      if (missingAttrs.length > 1) {
        throw new Error(data ? data.toString() : 'empty object' + ' should contain any more than two attributes from: "user", "action", "resource" or "env"');
      }

      this[_calcResult] = {};
      this[_property].lastData = undefined;

      var filterTarget = missingAttrs[0];
      this[_property].filterType = filterTarget === 'user' ? WATCHER : CONDITION;

      // clear storage
      Object.keys(this[_property].target).forEach(function (key) {
        _this2[_property].filterTarget[key] = [];
      });

      var resultCollection = {};

      Object.keys(this[_property].target).forEach(function (policyKey) {
        var context = {},
            targetResults = {};

        resultCollection[policyKey] = true;

        // calculate separate rules for one policy
        _this2[_property].target[policyKey].forEach(function (targetExp) {
          // generate unique random key
          var key = Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
          var tmp = (0, _target2.executeExp)(data, targetExp, context, key, filterTarget);

          if ((typeof tmp === 'undefined' ? 'undefined' : _typeof(tmp)) === BOOL) {
            targetResults[key] = tmp;
          } else if ((typeof tmp === 'undefined' ? 'undefined' : _typeof(tmp)) === 'object' && tmp.flag) {

            prepareFor(_this2[_property].filterType, policyKey, _this2, targetExp);
          } else {
            Object.assign(targetResults, tmp);
          }
        });

        // calculate final result for single policy
        Object.values(targetResults).forEach(function (value) {
          resultCollection[policyKey] = resultCollection[policyKey] && value;
        });
      });

      /* fill data for future using */
      var tokens = (0, _expression.fillTokens)(this[_property].expression, resultCollection);
      this[_property].tokens = JSON.parse(JSON.stringify(tokens));
      this[_calcResult] = (0, _expression.evaluateRPN)(tokens);

      // apply effect to bool result
      var result = this[_property].effect ? this[_calcResult].res : !this[_calcResult].res;

      // save data for next `getConditions` methods
      this[_property].lastData = result ? data : undefined;
      /**/

      return result;
    }
  }, {
    key: 'setAdapter',
    value: function setAdapter(adapter) {
      this.adapter = adapter;
    }
  }, {
    key: 'getConditions',
    value: function getConditions(mixin) {
      var _this3 = this;

      if ((this[_property].effect ? this[_calcResult].res : !this[_calcResult].res) === false) return undefined;

      var rules = aggregateResult(this, this[_property].filterType, this[_property].lastData);

      var result = void 0;
      if (this[_property].filterType === WATCHER) {
        // apply results of `check` method
        this[_property].tokens.forEach(function (token) {
          if (token.type === _expression.TYPE.val && token.res === false) {
            rules[token.val[0]] = undefined;
          }
        });

        result = (0, _expression.processRPN)((0, _expression.fillTokens)(this[_property].expression, rules), this.adapter);
        result = result ? this.adapter.optimize(result.res) : undefined;
      } else {
        result = {};
        Object.entries(rules).forEach(function (item) {
          if (_this3[_calcResult].val.includes(item[0])) {
            (0, _utils.mergeDeep)(result, item[1]);
          }
        });
      }

      return (0, _utils.mergeDeep)(result, mixin);
    }
  }]);

  return Policy;
}();

exports.Policy = Policy;
exports.Operator = _target2.Operator;
exports.Mutator = _target2.Mutator;
exports.Adapter = _adapter2.default;

/***/ }),

/***/ "./src/mutator.js":
/*!************************!*\
  !*** ./src/mutator.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var extractDate = function extractDate(a) {
  return a instanceof Date ? a : new Date(a);
};

var prefix = Symbol();
var postfix = Symbol();

var deg2rad = function deg2rad(deg) {
  return deg * (Math.PI / 180);
};

var getDistInKm = function getDistInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

var mutators = {
  'radius': _defineProperty({}, postfix, function (data, context) {
    if (data.leftIsData) {
      context.radius = data.leftValue;
    } else {
      context.radius = data.rightValue;
    }

    return true;
  }),
  'inArea': _defineProperty({}, postfix, function (data, context) {
    return context.radius >= getDistInKm(data.rightValue[0], data.rightValue[1], data.leftValue[0], data.leftValue[1]);
  }),

  'or': _defineProperty({}, postfix, function (data, context, key) {
    if (!context.container) {
      context.container = {};
    }
    context.container[key] = data.result;

    if (data.result) {
      for (var _key in context.container) {
        context.container[_key] = true;
      }
    }

    return context.container;
  }),

  'toInt': function toInt(a) {
    return parseInt(a, 10);
  },
  'toString': function toString(a) {
    return '' + a;
  },
  'trim': function trim(a) {
    return a.trim();
  },
  'uppercase': function uppercase(a) {
    return a.toUpperCase();
  },
  'lowercase': function lowercase(a) {
    return a.toLowerCase();
  },

  'minute': function minute(a) {
    return extractDate(a).getMinutes();
  },
  'day': function day(a) {
    return extractDate(a).getDate();
  }, // according to the local time
  'hour': function hour(a) {
    return extractDate(a).getHours();
  }, // according to the local time
  'weekday': function weekday(a) {
    return extractDate(a).getDay();
  }, // according to the local time
  'month': function month(a) {
    return extractDate(a).getMonth();
  }, // according to the local time
  'year': function year(a) {
    return extractDate(a).getFullYear();
  }, // according to the local time

  'regExp': function regExp(a) {
    var position = a.lastIndexOf('/');

    if (position === -1) {
      position = a.length;
    }

    var exp = a.substring(0, position);
    var flags = a.substring(position + 1, a.length);
    return flags && flags.length ? new RegExp(exp, flags) : new RegExp(exp);
  }
};

var register = function register(name, prefixFn, postfixFn) {
  var _mutators$name;

  mutators[name] = (_mutators$name = {}, _defineProperty(_mutators$name, prefix, prefixFn), _defineProperty(_mutators$name, postfix, postfixFn), _mutators$name);
};

var unregister = function unregister(name) {
  delete mutators[name];
};

exports.default = {
  prefix: prefix,
  postfix: postfix,
  register: register,
  unregister: unregister,
  get list() {
    return mutators;
  }
};

/***/ }),

/***/ "./src/operator.js":
/*!*************************!*\
  !*** ./src/operator.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var operators = {
  '==': {
    '*': function _(a, b) {
      return a === b;
    }
  },
  '!=': {
    '*': function _(a, b) {
      return a !== b;
    }
  },
  '>=': {
    '*': function _(a, b) {
      return a >= b;
    },
    reverse: '<='
  },
  '<=': {
    '*': function _(a, b) {
      return a <= b;
    },
    reverse: '>='
  },
  '~=': {
    // contains in array
    '*': function _(a, b) {
      return Array.isArray(b) && b.includes(a);
    },
    reverse: '~!'
  },
  '~!': {
    // contains in array
    '*': function _(b, a) {
      return Array.isArray(b) && b.includes(a);
    },
    reverse: '~='
  },
  '^=': {
    // not contains in array
    '*': function _(a, b) {
      return Array.isArray(b) && !b.includes(a);
    },
    reverse: '^!'
  },
  '^!': {
    // not contains in array
    '*': function _(b, a) {
      return Array.isArray(b) && !b.includes(a);
    },
    reverse: '^='
  },
  '?=': {
    // attribute is absent or equivalent
    '*': function _(a, b) {
      return !a || a === b;
    },
    reverse: '?!'
  },
  '?!': {
    // attribute is absent or equivalent
    '*': function _(b, a) {
      return !a || a === b;
    },
    reverse: '?='
  },
  '=': {
    '*': function _(a, b) {
      return a === b;
    }
  },
  '>': {
    '*': function _(a, b) {
      return a > b;
    },
    reverse: '<'
  },
  '<': {
    '*': function _(a, b) {
      return a < b;
    },
    reverse: '>'
  }
};

var register = function register(_ref) {
  var name = _ref.name,
      namespace = _ref.namespace,
      implement = _ref.implement,
      reverse = _ref.reverse;

  operators[name] = operators[name] || {};
  operators[name][namespace] = implement;
  if (namespace === '*' && reverse) {
    operators[name][namespace].reverse = reverse;
  }

  // we need to sort the operators from the longest to the shorter ones to avoid interception
  var obj = {};
  Object.entries(operators).sort(function (a, b) {
    if (a[0].length < b[0].length) {
      return 1;
    }
    if (a[0].length > b[0].length) {
      return -1;
    }

    return 0;
  }).forEach(function (data) {
    obj[data[0]] = data[1];
  });
  operators = obj;
};

var unregister = function unregister(_ref2) {
  var name = _ref2.name,
      namespace = _ref2.namespace;

  var container = operators[name];
  delete container[namespace];

  if (Object.keys(container).length === 0) {
    delete operators[name];
  }
};

exports.default = {
  register: register,
  unregister: unregister,
  get list() {
    return operators;
  }
};

/***/ }),

/***/ "./src/shared.js":
/*!***********************!*\
  !*** ./src/shared.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prepareCollection = exports.extract = undefined;

var _mutator = __webpack_require__(/*! ./mutator */ "./src/mutator.js");

var _mutator2 = _interopRequireDefault(_mutator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var unwrapNamespace = function unwrapNamespace(data, namespace) {
  var path = namespace.split('.');
  var result = data;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = path[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var part = _step.value;

      try {
        result = result[part];
      } catch (e) {
        result = null;
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return result;
};

var extract = function extract(data, operand, context) {
  var value = operand.value;
  if (operand.isDIObj) {
    value = unwrapNamespace(data, value);
  }

  operand.mutators.forEach(function (mutator) {
    var tmpContext = void 0,
        fn = void 0;
    if (operand.isDIObj) {
      context[operand.value] = context[operand.value] || {};
      tmpContext = context[operand.value];
    }

    fn = _mutator2.default.list[mutator];
    if (fn && typeof fn !== 'function') {
      fn = fn[_mutator2.default.prefix];
    }

    value = fn ? fn(value, tmpContext) : value;
  });

  return value;
};

var prepareCollection = function prepareCollection(inputData, exp, context, resourceName) {
  var leftOperand = extract(inputData, exp.left, context, null);
  var rightOperand = extract(inputData, exp.right, context, null);
  var resource = leftOperand === null ? exp.left.value : leftOperand;

  return {
    attribute: resource.replace(resourceName, ''),
    value: rightOperand === null ? exp.right.value : rightOperand,
    operator: exp.operator,
    mutators: exp.left.mutators
  };
};

exports.extract = extract;
exports.prepareCollection = prepareCollection;

/***/ }),

/***/ "./src/target.js":
/*!***********************!*\
  !*** ./src/target.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Mutator = exports.Operator = exports.executeExp = exports.parseExp = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _operator = __webpack_require__(/*! ./operator */ "./src/operator.js");

var _operator2 = _interopRequireDefault(_operator);

var _mutator = __webpack_require__(/*! ./mutator */ "./src/mutator.js");

var _mutator2 = _interopRequireDefault(_mutator);

var _shared = __webpack_require__(/*! ./shared */ "./src/shared.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var leftRegExp = /^[a-zA-Z]+\.[a-zA-Z]+(?:\.\.[a-zA-Z]+)*/;
var rightRegExp = /[^\n]+/;

var quote = '\'';

var throwSemanticError = function throwSemanticError(expr) {
  var msg = 'Semantic Error in ' + expr + ': \n    Expression should be obj.attr[..mutator](operator)value or object.attribute\n    (user.role~=[\'admin\',\'user\'] , resource.location..radius=100)';
  throw new Error(msg);
};

var isObjWithAttr = function isObjWithAttr(str) {
  return str.includes('.') && (str.indexOf('user.') === 0 || str.indexOf('env.') === 0 || str.indexOf('action.') === 0 || str.indexOf('resource.') === 0);
};

var unwrapString = function unwrapString(str) {
  if (str[0] === quote && str[str.length - 1] === quote) {
    str = '"' + str.substr(1, str.length - 2) + '"';
  }
  return str;
};

var parseOperand = function parseOperand(operandStr) {
  var array = operandStr.split('..');
  var _mutators = array.slice(1, array.length);
  var isDIObj = isObjWithAttr(array[0]);
  var value = void 0;

  try {
    value = isDIObj ? array[0] : JSON.parse(unwrapString(array[0]));
  } catch (e) {
    var msg = 'Parsing Error: \n\t JSON.parse( ' + array[0] + ' ) in expression';
    throw new Error(msg);
  }

  return {
    isDIObj: isDIObj,
    value: value,
    mutators: _mutators
  };
};

var parseExp = function parseExp(expStr) {
  var operators = _operator2.default.list;
  var operator = void 0,
      parts = void 0;
  for (operator in operators) {
    parts = expStr.split(operator);
    if (parts.length === 2) break;
  }

  if (parts.length !== 2 || !leftRegExp.test(parts[0]) || !rightRegExp.test(parts[1])) throwSemanticError(expStr);

  return {
    origin: expStr,
    left: parseOperand(parts[0]),
    operator: operator,
    right: parseOperand(parts[1])
  };
};

var postfixApply = function postfixApply(operand, data, context, key) {
  operand.mutators.forEach(function (mutator) {
    var expr = _mutator2.default.list[mutator];
    if (operand.isDIObj && (typeof expr === 'undefined' ? 'undefined' : _typeof(expr)) === 'object' && expr[_mutator2.default.postfix]) {
      data.result = expr[_mutator2.default.postfix](data, context[operand.value], key);
    }
  });
};

var executeExp = function executeExp(inputData, exp, context, key, filterTarget) {
  var operators = _operator2.default.list;
  var leftOperand = (0, _shared.extract)(inputData, exp.left, context);
  var rightOperand = (0, _shared.extract)(inputData, exp.right, context);

  // get correct path to operator implementation
  var path = '*';
  if (exp.left.isDIObj && typeof operators[exp.operator][exp.left.value] === 'function') {
    path = exp.left.value;
  } else if (exp.right.isDIObj && typeof operators[exp.operator][exp.right.value] === 'function') {
    path = exp.right.value;
  }

  var result = operators[exp.operator][path](leftOperand, rightOperand);

  var data = {
    leftIsData: !exp.left.isDIObj,
    rightIsData: !exp.right.isDIObj,
    leftValue: leftOperand,
    rightValue: rightOperand,
    result: result
  };

  if (filterTarget && (exp.left.isDIObj && exp.left.value.indexOf(filterTarget) === 0 || exp.right.isDIObj && exp.right.value.indexOf(filterTarget) === 0)) {
    return {
      flag: true
    };
  }

  postfixApply(exp.left, data, context, key);
  postfixApply(exp.right, data, context, key);

  return data.result;
};

exports.parseExp = parseExp;
exports.executeExp = executeExp;
exports.Operator = _operator2.default;
exports.Mutator = _mutator2.default;

/***/ }),

/***/ "./src/utils.js":
/*!**********************!*\
  !*** ./src/utils.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isObject = function isObject(item) {
  return item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object' && !Array.isArray(item) && !(item instanceof RegExp);
};

var mergeDeep = function mergeDeep(target, source) {
  if (isObject(target) && isObject(source)) {
    for (var key in source) {
      if (isObject(source[key])) {
        if (!target[key]) {
          target[key] = {};
        }
        mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }
  return target || source;
};

exports.mergeDeep = mergeDeep;

/***/ })

/******/ });
//# sourceMappingURL=policyline.js.map