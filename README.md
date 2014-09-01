classy.js
=========

[classy.js](https://raw.githubusercontent.com/foo123/classy.js/master/build/classy.js),  [classy.min.js](https://raw.githubusercontent.com/foo123/classy.js/master/build/classy.min.js)


Object-Oriented micro-framework ( ~6kB minified ) for JavaScript

__Example:__    [API Reference](/api-reference.md)


```javascript
    
    // if inside node
    var Class = require('../build/classy.js').Classy.Class;
    // else Classy will be available as window.Classy in browser
    
    var aParent = Class({ /* extends Object by default */
        
    // static properties/methods (are inherited by subclasses)
    __static__: { 
        aStaticProp: 1 
    },
    
    constructor: function(a, b) {
            this.a = a;
            this.b = b;
        },
        
        a: null,
        b: null,
        
        add: function() {
            return this.a + this.b;
        }
    });

    var aChild = Class( { Extends: aParent }, {
        
        constructor: function(a, b) {
            // call super constructor
            this.$super('constructor', a, b);
        },
        
        sayHi: function() {
            return 'Hi';
        }
    });

    var aParentInst = new aParent(1, 2);
    var aChildInst = new aChild(1, 2);

    console.log(aParentInst.add());
    console.log(aChildInst.add());
    
    console.log(aParent.aStaticProp);
    console.log(aChild.aStaticProp);
    
```


or with some [sweet.js](http://github.com/mozilla/sweet.js) syntactic sugar similar to php or java:
(compile including the [/macros/classy.sweet.js](macros/classy.sweet.js) macro lib)

```javascript

// require the classy lib here, compile this file including the classy.sweet.js macro lib
var Classy = require('../build/classy').Classy;

// define a Parent super class
Class aParent {
    
    // static method (inherited by subclasses)
    // method arguments default values supported
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/default_parameters
    // rest parameters also supported
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/rest_parameters
    static aStaticMethod(msg = '', ...rest) { 
        console.log(rest);
        return 'Static Parent ' + msg; 
    }
    
    // static prop (inherited by subclasses)
    // method arguments default values supported
    static aStaticProp = 1;
    
    // block definition of static properties / methods (inherited by subclasses)
    static: {
        
        aStaticProp2 =  1;
        
        // method arguments default values supported
        aStaticMethod2(msg = '') { 
            return 'Static '+msg; 
        }
    }
    
    // a property with initial value
    aProp = 1;
    
    // a property no initial value (null by default)
    msg;
    
    // class constructor
    // method arguments default values supported
    constructor ( msg = '', test = null ) {
        this.msg = msg;
    }
    
    // class method
    // method arguments default values supported
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/default_parameters
    // rest parameters also supported
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/rest_parameters
    sayHi (arg1 = 'arg1', arg2 = 'arg2', ...otherArgs) {
        console.log(arg1);
        console.log(arg2);
        console.log(otherArgs);
        return this.msg;
    }
}


// define a Child sub class
Class aChild extends aParent implements String, RegExp {
    
    // method arguments default values supported
    static aStaticMethod(msg = '') { 
        return 'Static Child ' + msg; 
    }
    
    // method arguments default values supported
    constructor (msg='') {
        // call super constructor (js-style)
        super(msg);
        // call super constructor or other method (PHP-style)
        //super.constructor(msg);
        this.msg = 'child says also ' + this.msg;
    }
    
    // method arguments default values supported
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/default_parameters
    // rest parameters also supported
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/rest_parameters
    sayHi (arg1 = 'arg1', arg2 = 'arg2', ...otherArgs) {
        // test recursive $super calls
        // call super method (js-style)
        //return super();
        // call super method or other method (PHP-style)
        console.log(arg1);
        console.log(arg2);
        console.log(otherArgs);
        return super.sayHi(arg1, arg2);
    }
}


// do the test
console.log("Classy.VERSION = " + Classy.VERSION);
console.log(new aParent('Hi').sayHi('arg1', 'arg2', 'rest1', 'rest2'));
console.log(new aChild('Hi').sayHi('arg1', 'arg2', 'rest1', 'rest2'));
console.log(aParent.aStaticMethod('aParent', 'restStatic1', 'restStatic2'));
console.log(aChild.aStaticMethod('aChild', 'restStatic1', 'restStatic2'));
console.log(aParent.aStaticMethod2('aParent'));
console.log(aChild.aStaticMethod2('aChild'));

```


**Performance**

This little framework was created for enabling (sugar-flavored) abstraction and modularity for bigger projects (using Object-Oriented methods).

Most times, in big projects, one does not instantiate classes in the blink of a second, still performance is important. So decided to check performance and size,
and inspired by [this post comparing OOP/JS approaches performance](http://techblog.netflix.com/2014/05/improving-performance-of-our-javascript.html), added new jsperf tests 
for classy.js (and updates). First test with previous classy.js version (0.6.1) is [here](http://jsperf.com/fun-with-method-overrides/8) and new test(s) based on increasing performance, while at the same not spoiling the abstraction and flexibility of using *$super* method calls, is [here](http://jsperf.com/fun-with-method-overrides-3/2).

Overall an **increase in performance of 13% was achieved** , yet classy.js is slowest compared to the other methods. On the other hand, it provides greater flexibility and convenience. The whole point (and bottleneck) of performances is the *super method calls*. 
Classy.js uses an abstraction which resembles the super method calls in other languages (like PHP and Java).

The new classy version(s) (0.7+) do an optimisation there. It is relatively easy to change the whole *super calls design* to match the other approaches (mostly NFE), however it will make code
less flexible, less abstract and more verbose. For my use-cases, of this micro-framework, this is not as important, but one should take this into account if needed.
