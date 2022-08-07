classy.js
=========

[classy.js](https://raw.githubusercontent.com/foo123/classy.js/master/build/classy.js),  [classy.min.js](https://raw.githubusercontent.com/foo123/classy.js/master/build/classy.min.js)


Object-Oriented mini-framework ( ~6kB minified, ~3kB gzipped ) for JavaScript

__Example:__    [API Reference](/api-reference.md)


```javascript
    
    // if inside node
    var Class = require('../build/classy.js').Class;
    // else Classy will be available as window.Classy in browser
    
    var aParent = Class({ /* extends Object by default */
        
    // extendable static props/methods (are inherited by subclasses)
    __static__: {
        aStaticProp: 2,
        aStaticMethod: function(msg) { 
            console.log(msg); 
        }
    },
    
    constructor: function(a, b) {
            this.a = a;
            this.b = b;
        },
        
        a: null,
        b: null,
        
        add: function( ) {
            return this.a + this.b;
        }
    });

    var aChild = Class( { Extends: aParent }, {
        
        constructor: function(a, b) {
            // call super constructor
            this.$super('constructor', a, b);
            // call super vector (args) constructor
            //this.$superv('constructor', [a, b]);
        },
        
        sayHi: function( ) {
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
var Classy = require('../build/classy');

// define a Parent super class
Class aParent {
    
    // static method (inherited by subclasses)
    static aStaticMethod(msg = '', ...rest) { 
        console.log(rest);
        return 'Static Parent ' + msg; 
    }
    
    // static prop (inherited by subclasses)
    static aStaticProp = 1;
    
    // block definition of static properties / methods (inherited by subclasses)
    static: {
        
        aStaticProp2 =  1;
        
        aStaticMethod2(msg = '') { 
            return 'Static '+msg; 
        }
    }
    
    // a property with initial value
    aProp = 1;
    
    // a property no initial value (null by default)
    msg;
    
    // class constructor
    constructor ( msg = '', test = null ) {
        this.msg = msg;
    }
    
    // class method
    sayHi (arg1 = 'arg1', arg2 = 'arg2', ...otherArgs) {
        console.log(arg1);
        console.log(arg2);
        console.log(otherArgs);
        return this.msg;
    }
}


// define a Child sub class
Class aChild extends aParent implements String, RegExp {
    
    static aStaticMethod(msg = '') { 
        return 'Static Child ' + msg; 
    }
    
    constructor (msg='') {
        // call super constructor (js-style)
        super(msg);
        // call super constructor or other method (php-style)
        //super.constructor(msg);
        this.msg = 'child says also ' + this.msg;
    }
    
    sayHi (arg1 = 'arg1', arg2 = 'arg2', ...otherArgs) {
        console.log(arg1);
        console.log(arg2);
        console.log(otherArgs);
        // call super method (js-style)
        //return super();
        // call super method or other method (php-style)
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

Most times, in big projects, one does not instantiate classes in the blink of a second, still performance is important. So decided to check performance and size, and inspired by [this post comparing OOP/JS approaches performance](http://techblog.netflix.com/2014/05/improving-performance-of-our-javascript.html), added new jsperf tests 
for classy.js (and updates). First test with previous classy.js version (0.6.1) is [here](http://jsperf.com/fun-with-method-overrides/8).

[![jsperf-0.6.1](/test/jsperf-0.6.1.png)](http://jsperf.com/fun-with-method-overrides/8)


The whole point (and bottleneck) of performances is the *super method calls*. Classy.js uses an abstraction which resembles the super method calls in other OOP-like languages (like PHP and Java). The bottleneck (in Classy) has two parts. One is that **recursion** is used to handle super calls and the other is the **arguments.slice** issue.

It is relatively easy to change the whole *super calls design* to match the other approaches (eg NFE), however it will make code less flexible, less abstract and more verbose. For my use-cases, of this micro-framework, this is not as important, but one should take this into account if needed.

In any case, i wanted to optimise the code without losing the flexibility and abstraction provided (else there is no point). The criterion is [@ejohn's OOP closure performance](http://ejohn.org/blog/simple-javascript-inheritance/) (for vanilla super calls and NFE-style performance it needs to hardcode and remove almost all the flexibility of the library, so one need not use it if the need is such).

Initially tried to remove the **recursion bottleneck** by re-assigning the $super method to the $super_super method in each call (in a closure-like style). This resulted in increased performance by about 20%, but still classy $super calls were way slower.
Plus it also introduced a bug when circular-nested super calls are made (see tests/test-super-circular.js). 
The relevant jsperf tests (for Classy 0.7.1-0.7.4) are [here](http://jsperf.com/fun-with-method-overrides-3/2).

Then tried to remove the **arguments.slice bottleneck** (and the recursion, and also fix the previous bug). This resulted in two updates, a new  **method $superv** (super method with vector arguments) and a performance increase of **16x times faster when using the $superv method** and **6x times faster when using the $super method** , making classy super calls comparable (if not faster) to the closure-style super calls.
The relevant jsperf tests (for Classy 0.7.6) are [here](http://jsperf.com/fun-with-method-overrides-3/6).


[![jsperf-0.7.6](/test/jsperf-0.7.6.png)](http://jsperf.com/fun-with-method-overrides-3/6)


**UPDATE (0.9)**

Finally, enabled both NFE-style (named-function expression) super calls in classy.js (v. 0.9+), and scoped super calls in a generic way with direct access to class references like $super/$private/$class etc.., using the new *Classy.Method* method factory wrapper, see examples and tests under test/ folder. 

Classy.js super calls are faster almost in all browsers and in all cases (i.e. builtin $super methods are faster than equivalent closure methods and direct reference $super methods are faster than equivalent methods like NFE).

The relevant jsperf tests are [here](http://jsperf.com/fun-with-method-overrides-3/9)

[![jsperf-0.9](/test/jsperf-0.9.png)](http://jsperf.com/fun-with-method-overrides-3/9)

**see also:**

* [ModelView](https://github.com/foo123/modelview.js) a simple, fast, powerful and flexible MVVM framework for JavaScript
* [Contemplate](https://github.com/foo123/Contemplate) a fast and versatile isomorphic template engine for PHP, JavaScript, Python
* [HtmlWidget](https://github.com/foo123/HtmlWidget) html widgets, made as simple as possible, both client and server, both desktop and mobile, can be used as (template) plugins and/or standalone for PHP, JavaScript, Python (can be used as [plugins for Contemplate](https://github.com/foo123/Contemplate/blob/master/src/js/plugins/plugins.txt))
* [Paginator](https://github.com/foo123/Paginator)  simple and flexible pagination controls generator for PHP, JavaScript, Python
* [ColorPicker](https://github.com/foo123/ColorPicker) a fully-featured and versatile color picker widget
* [Pikadaytime](https://github.com/foo123/Pikadaytime) a refreshing JavaScript Datetimepicker that is ightweight, with no dependencies
* [Timer](https://github.com/foo123/Timer) count down/count up JavaScript widget
* [InfoPopup](https://github.com/foo123/InfoPopup) a simple JavaScript class to show info popups easily for various items and events (Desktop and Mobile)
* [Popr2](https://github.com/foo123/Popr2) a small and simple popup menu library
* [area-select.js](https://github.com/foo123/area-select.js) a simple JavaScript class to select rectangular regions in DOM elements (image, canvas, video, etc..)
* [area-sortable.js](https://github.com/foo123/area-sortable.js) simple and light-weight JavaScript class for handling smooth drag-and-drop sortable items of an area (Desktop and Mobile)
* [css-color](https://github.com/foo123/css-color) simple class for manipulating color values and color formats for css, svg, canvas/image
* [jquery-plugins](https://github.com/foo123/jquery-plugins) a collection of custom jQuery plugins
* [jquery-ui-widgets](https://github.com/foo123/jquery-ui-widgets) a collection of custom, simple, useful jQueryUI Widgets
* [touchTouch](https://github.com/foo123/touchTouch) a variation of touchTouch jQuery Optimized Mobile Gallery in pure vanilla JavaScript
* [Imagik](https://github.com/foo123/Imagik) fully-featured, fully-customisable and extendable Responsive CSS3 Slideshow
* [Carousel3](https://github.com/foo123/Carousel3) HTML5 Photo Carousel using Three.js
* [Rubik3](https://github.com/foo123/Rubik3) intuitive 3D Rubik Cube with Three.js
* [MOD3](https://github.com/foo123/MOD3) JavaScript port of AS3DMod ActionScript 3D Modifier Library
* [RT](https://github.com/foo123/RT) unified client-side real-time communication for JavaScript using XHR polling / BOSH / WebSockets / WebRTC
* [AjaxListener.js](https://github.com/foo123/AjaxListener.js): Listen to any AJAX event on page with JavaScript, even by other scripts
* [asynchronous.js](https://github.com/foo123/asynchronous.js) simple manager for asynchronous, linear, parallel, sequential and interleaved tasks for JavaScript
* [classy.js](https://github.com/foo123/classy.js) Object-Oriented mini-framework for JavaScript

