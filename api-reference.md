

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

        


__Method__: *Method*

```javascript
aMethod = Classy.Method(Function methodFactory [, FLAG qualifier=Classy.PUBLIC]);
```

Return a *method* accessed as qualifier (PUBLIC/STATIC/LATE/PRIVATE),
where direct contextual information (e.g faster "$super" reference) can be added transparently (as a closure)

example:
```javascript
aClass = Classy.Class(anotherClass, {
    
    // accessible as "this.aMethod"
    aMethod: Classy.Method(function($super, $private, $class){
          return function( a, b ) { 
              // $super is the direct reference to the superclass prototype
              // $private is the direct reference to the private methods of this class (if any)
              // $class is the direct reference to this class itself, NOT the prototype (same as this.$class)
              $super.aMethod.call(this, a, b);
              // ...
          }
    }, Classy.PUBLIC ), // optional method qualifier, default is Classy.PUBLIC

    // accessible as "aClass.aStaticMethod" (extendable)
    aStaticMethod: Classy.Method(function($super, $private, $class){
          // $super is the direct reference to the superclass itself (NOT the prototype)
          // $private is the direct reference to the private methods of this class (if any)
          // $class is the direct reference to this class itself (NOT the prototype)
          return function( a, b ){ 
              $super.aStaticMethod(a, b);
              // ...
          }
    }, Classy.STATIC )

    // accessible as "aClass.aLateStaticBindMethod" (extendable)
    // classy implements "LATE STATIC BINDING" for static methods (with Classy.LATE|Classy.STATIC flags)
    aLateStaticBindMethod: Classy.Method(function($super, $private, $class){
          // $super is the direct reference to the superclass itself (NOT the prototype)
          // $private is the direct reference to the private methods of this class (if any)
          // $class is the direct reference to this class itself (NOT the prototype)
          return function( a, b ){ 
              console.log($class.name); // this should be dynamicaly binded for each subclass
              // ...
          }
    }, Classy.LATE|Classy.STATIC )
});
```

        


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

        


__Method__: *Dispose*

```javascript
Classy.Dispose(Function aClassyClass);
```

Dispose a Class definition and all references added by Classy.js

        


__Method__: *Class*

```javascript
aClass = Classy.Class( );
// or
aStaticClass = Classy.Class(FLAG Classy.STATIC, Object staticdefs={});
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
    
    // private methods ONLY (NOT extendable)
    __private__: {
      aPrivateMethod: function(msg) { console.log(msg); }
    },
    // alternative way to define private methods ONLY (NOT extendable)
    aPrivateMethod2: Classy.Method(function($super, $private, $class){
          return function(msg) { 
              // access other private methods as well
              $private.aPrivateMethod( msg );
          }
    }, Classy.PRIVATE),
    
    // extendable static props/methods (are inherited by subclasses)
    __static__: {
      aStaticProp: 2,
      aStaticMethod: function(msg) { console.log(msg); }
    },
    // alternative way to define static methods/props (extendable)
    // classy implements "LATE STATIC BINDING" for static methods (with Classy.STATIC|Classy.LATE flags)
    aStaticMethod2: Classy.Method(function($super, $private, $class){
          return function(msg) { 
              console.log(msg); 
          }
    }, Classy.STATIC|Classy.LATE),
    
    // class constructor
    constructor: function(a, b) {
        // call super constructor
        this.$super('constructor', a, b);
        // call super vector (args) constructor
        //this.$superv('constructor', [a, b]);
    },
    
    // class method factory (wrap around a Classy.Method to have access to $private and $super direct references)
    sayHi: Classy.Method(function($super, $private, $class){
          return function( ){
              // call a private method here
              $private.aPrivateMethod.call(this, 'Hi');
              $private.aPrivateMethod2('Hi2');
              $super.sayHi.call(this, 'Hi3');
              return 'Hi';
          }
    })
}
);
```

Class *static* properties/methods are accessed as:

```javascript
aChild.aStaticProp;
// or, aChildInst is an instance of aChild
aChildInst.$class.aStaticProp;
```

        


__Three Ways to make Super Calls__

Classy.js provides three ways to make a super call to the same method of a super class, from inside a method of a subclass (see below):

1. __Using $super/$superv builtin methods:__

```javascript
  var aSubClass = Classy.Class( aSuperClass, {
      constructor: function( a, b ) {
          // minimum hassle, less verbose, more abstract, average performance (depends on application)
          this.$super("constructor", a, b);
      }
  });

```

2. __Using NFE-style super calls (Named-Function Expression):__

```javascript
  var aSubClass = Classy.Class( aSuperClass, {
      constructor: function constr( a, b ) {
          // lot faster performance, less verbose, more hardcoded
          // Classy will add the $super reference for each method as needed
          constr.$super.call(this, a, b);
      }
  });

```

3. __Using Classy.Method method-factory wrapper:__

```javascript
  var aSubClass = Classy.Class( aSuperClass, {
      constructor: Classy.Method(function($super, $private, $class) {
          return function( a, b ) {
              // lot faster performance, more verbose, more abstract, 
              // have direct access to $super/$private/$class references inside the method itself
              $super.constructor.call(this, a, b);
          }
      })
  });

```

__NOTE__ One can use a mix of these super schemes in any given class, however due to the different way these are implemented and synchronised, the scheme for super calls in the same methods along the class chain should be the same, else the $super calls will not have correct synchronisation resulting in wrong results.

        


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

        