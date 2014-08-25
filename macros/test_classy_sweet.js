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
        aStaticMethod2(msg, arg1, arg2=null) { 
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
