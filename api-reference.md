

###Classy Methods

    


__Method__: *Create*

```javascript
obj = Classy.Create(Object proto [, Object properties]);
```

Create an obj having *proto* as prototype adding any optional *properties* (Polyfill around **Object.create** method).

        


__Method__: *Merge*

```javascript
proto = Classy.Merge(Object proto, Object proto1 [, Object proto2, ..]);
```

Merge *objects/prototypes* into one *object/prototype* ( **Arrays** , **Strings** and **Numbers** are shallow copied, else copy by reference).

        


__Method__: *Alias*

```javascript
namespaced_and_or_aliased_proto = Classy.Alias(Object proto, String namespace=null, Object|Function aliases=null);
// a namespaced method "method1" with namepace "ns1"
// will appear as a new method with name "ns1$method1"
// the original method name is also present, except if also "aliased" to a new method name
```

Namespace an object's methods and/or alias an object's methods/properties so as to avoid method naming conflicts.
Useful when implementing multiple interfaces which might share same method names (and which **do not** internally use the original method names). Used internally by other Classy methods (which may include aliases) as well.

        


__Method__: *Extends*

```javascript
subClass = Classy.Extends(Function superClass=Object [, Object proto]);
```

Return a *subClass* that extends the *superClass* , with additional methods/properties defined in *proto* object.
If *superClass* is not given or undefined or null, extend the **Object** class by default.

        


__Methods__: *Implements* , *Mixin*

```javascript
proto = Classy.Implements(Object proto, Object proto1 [, Object proto2, ..]);
// or
proto = Classy.Mixin(Object proto, Object proto1 [, Object proto2, ..]);
```

These methods are aliases of **Classy.Merge** method (for now) and perform the same functionality.

        


__Method__: *Class*

```javascript
aClass = Classy.Class( );
// or
aClass = Classy.Class(Object proto);
// or
aClass = Classy.Class(Function superClass, Object proto);
// or
aClass = Classy.Class(Object qualifier, Object proto);
```

This is the main Classy method to construct JavaScript Classes, it includes all other methods.
If 2 or more arguments are passed to the method, 
the first is the either a *superClass* or a *class qualifier* which is an object defining class qualifications,
the second is the *class prototype* , 

eg.:
```javascript
var aChild = Classy.Class( 
// Class Qualifier Object
{ Extends: aParent, Implements: [EventEmitter, Runnable] }, 
{
    
    // extendable static props/methods (are inherited by subclasses)
    __static__: {
      aStaticProp: 2,
      aStaticMethod: function(msg) { console.log(msg); }
    },
    
    // class constructor
    constructor: function(a, b) {
        // call super constructor (slower)
        this.$super('constructor', a, b);
        // call super vector (args) constructor (faster)
        //this.$superv('constructor', [a, b]);
    },
    
    // class method
    sayHi: function() {
        return 'Hi';
    }
}
);
```

Class *static* properties/methods are accessed as:

```javascript
aChild.aStaticProp;
// or, aChildInst is an instance of aChild
aChildInst.$class.aStaticProp;
```

        


__Classy Sweet Macros__

A set of [sweet.js](http://github.com/mozilla/sweet.js) macros for classy.js are included in order to have a full object-oriented syntactic sugar
for your projects, similar to php or java

see [macros](/macros) folder for the src and examples of how to use.

__Example:__

```javascript

// require the classy lib here, compile this file including the macros/classy.sweet.js macro lib
var Classy = require('../build/classy');

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
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/default_parameters
    // rest parameters also supported
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/rest_parameters
    constructor (msg = '', ...rest) {
       this.msg = msg;
    }
    
    // class method
    sayHi () {
       return this.msg;
    }
}


// define a Chlld sub class
Class aChild extends aParent implements String, RegExp {
    
    // method arguments default values supported
    static aStaticMethod(msg = '') { 
        return 'Static Child ' + msg; 
    }
    
    constructor (msg = '') {
       // call super constructor (js-style)
       super(msg);
       // call super constructor or other super method (PHP-style)
       //super.constructor(msg);
       this.msg = 'child says also ' + this.msg;
    }
}


// do the test
console.log("Classy.VERSION = " + Classy.VERSION);
console.log(new aParent('Hi').sayHi());
console.log(new aChild('Hi').sayHi());
console.log(aParent.aStaticMethod('aParent'));
console.log(aChild.aStaticMethod('aChild'));
console.log(aParent.aStaticMethod2('aParent'));
console.log(aChild.aStaticMethod2('aChild'));

```

        