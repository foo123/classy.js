// require the classy lib here, compile this file including the classy.sweet.js macro lib
var Classy$951 = require('../build/classy');
// define a Parent super class
var aParent$953 = Classy$951.Class({ Extends: Object }, {
        aProp: 1,
        msg: null,
        constructor: function (msg, test) {
            if (1 > arguments.length)
                msg = '';
            if (2 > arguments.length)
                test = null;
            this.msg = msg;
        },
        sayHi: function (arg1, arg2) {
            if (1 > arguments.length)
                arg1 = 'arg1';
            if (2 > arguments.length)
                arg2 = 'arg2';
            var otherArgs$1061 = Array.prototype.slice.call(arguments, 2);
            console.log(arg1);
            console.log(arg2);
            console.log(otherArgs$1061);
            return this.msg;
        },
        __static__: {
            aStaticMethod: function (msg) {
                if (1 > arguments.length)
                    msg = '';
                var rest$1080 = Array.prototype.slice.call(arguments, 1);
                console.log(rest$1080);
                return 'Static Parent ' + msg;
            },
            aStaticProp: 1,
            aStaticProp2: 1,
            aStaticMethod2: function (msg, arg1, arg2) {
                if (3 > arguments.length)
                    arg2 = null;
                return 'Static ' + msg;
            }
        }
    });
// define a Child sub class
var aChild$955 = Classy$951.Class({
        Extends: aParent$953,
        Implements: [
            String,
            RegExp
        ]
    }, {
        constructor: function (msg) {
            if (1 > arguments.length)
                msg = '';
            // call super constructor (js-style)
            this.$super('constructor', msg);
            // call super constructor or other method (PHP-style)
            //super.constructor(msg);
            this.msg = 'child says also ' + this.msg;
        },
        sayHi: function (arg1, arg2) {
            if (1 > arguments.length)
                arg1 = 'arg1';
            if (2 > arguments.length)
                arg2 = 'arg2';
            var otherArgs$1061 = Array.prototype.slice.call(arguments, 2);
            // test recursive $super calls
            // call super method (js-style)
            //return super();
            // call super method or other method (PHP-style)
            console.log(arg1);
            console.log(arg2);
            console.log(otherArgs$1061);
            return this.$super('sayHi', arg1, arg2);
        },
        __static__: {
            aStaticMethod: function (msg) {
                if (1 > arguments.length)
                    msg = '';
                return 'Static Child ' + msg;
            }
        }
    });
// do the test
console.log('Classy.VERSION = ' + Classy$951.VERSION);
console.log(new aParent$953('Hi').sayHi('arg1', 'arg2', 'rest1', 'rest2'));
console.log(new aChild$955('Hi').sayHi('arg1', 'arg2', 'rest1', 'rest2'));
console.log(aParent$953.aStaticMethod('aParent', 'restStatic1', 'restStatic2'));
console.log(aChild$955.aStaticMethod('aChild', 'restStatic1', 'restStatic2'));
console.log(aParent$953.aStaticMethod2('aParent'));
console.log(aChild$955.aStaticMethod2('aChild'));
