/**
*
*   Classy.js
*   @version: @@VERSION@@
*
*   Object-Oriented mini-framework for JavaScript
*   https://github.com/foo123/classy.js
*
**/
(function( exports, undef ) {
    
    /**[DOC_MARKDOWN]
    *
    * ###Classy Methods
    *
    [/DOC_MARKDOWN]**/
    
    var Ctx = function(val, prev, next) {
        this.v = val || null;
        this.prev = prev || null;
        this.next = next || null;
    };
    Ctx.prototype = {
        constructor: Ctx,
        v: null, prev: null,  next: null,
        fwd: function( next ) { return new Ctx( next, this ); },
        bwd: function( ) { return this.prev; }
    };
    var AP = Array.prototype, OP = Object.prototype, FP = Function.prototype,
        slice = FP.call.bind(AP.slice),
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
        // https://developer.mozilla.org/en-US/docs/Enumerability_and_ownership_of_properties
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FObject%2FpropertyIsEnumerable
        toStr = FP.call.bind(OP.toString), 
        hasProperty = FP.call.bind(OP.hasOwnProperty), 
        propertyIsEnum = FP.call.bind(OP.propertyIsEnumerable),
        Keys = Object.keys, defineProperty = Object.defineProperty,
        // types
        T_NUM = 2,
        T_NAN = 3,
        //T_INF = 3,
        T_BOOL = 4,
        T_STR = 8,
        T_CHAR = 9,
        T_ARRAY = 16,
        T_OBJ = 32,
        T_FUNC = 64,
        T_REGEX = 128,
        T_NULL = 256,
        T_UNDEF = 512,
        T_UNKNOWN = 1024,
        get_type = function( v ) {
            var type_of = typeof(v), to_string = toStr(v);
            
            if ("undefined" === type_of)  return T_UNDEF;
            
            else if ("number" === type_of || v instanceof Number)  return isNaN(v) ? T_NAN : T_NUM;
            
            else if (null === v)  return T_NULL;
            
            else if (true === v || false === v)  return T_BOOL;
            
            else if (v && ("string" === type_of || v instanceof String)) return (1 === v.length) ? T_CHAR : T_STR;
            
            else if (v && ("[object Array]" === to_string || v instanceof Array))  return T_ARRAY;
            
            else if (v && ("[object RegExp]" === to_string || v instanceof RegExp))  return T_REGEX;
            
            else if (v && (("function" === type_of && "[object Function]" === to_string) || v instanceof Function))  return T_FUNC;
            
            else if (v && "[object Object]" === to_string)  return T_OBJ;
            
            // unkown type
            return T_UNKNOWN;
        },
        // recycling same object
        /*withValue = function(value) {
            var d = withValue.d || (
                withValue.d = {
                    enumerable: false,
                    writable: true,
                    configurable: true,
                    value: null
            });
            d.value = value;
            return d;
        },*/
        mergeUnique = function( a1, a2 ) {
            var i, l = a2.length, a = [ ].concat( a1 );
            for (i=0; i<l; i++)
            {
                if ( a.indexOf( a2[i] ) > -1 ) continue;
                a.push( a2[i] );
            }
            return a;
        },
        convertToDescriptor = function (desc, obj) {

            if ( T_OBJ !== get_type(desc) )  throw new TypeError("bad desc");

            var d = {};
            
            if ( hasProperty(desc, "enumerable") )   d.enumerable = !!obj.enumerable;
            
            if ( hasProperty(desc, "configurable") ) d.configurable = !!obj.configurable;
            
            if ( hasProperty(desc, "value") )    d.value = obj.value;
            
            if ( hasProperty(desc, "writable") )  d.writable = !!desc.writable;
            
            if ( hasProperty(desc, "get") ) 
            {
                var g = desc.get;

                if ( T_FUNC !== get_type(g) && g !== "undefined")   throw new TypeError("bad get");
                d.get = g;
            }
            
            if ( hasProperty(desc, "set") ) 
            {
                var s = desc.set;
                
                if ( T_FUNC !== get_type(s) && s !== "undefined")   throw new TypeError("bad set");
                d.set = s;
            }

            if (("get" in d || "set" in d) && ("value" in d || "writable" in d))  throw new TypeError("identity-confused descriptor");

            return d;
        },
        defineProperties = Object.defineProperties || function (obj, properties) {
            
            if (typeof obj !== "object" || obj === null)  throw new TypeError("bad obj");

            properties = Object(properties);

            var keys = Keys(properties);
            var descs = [];

            for (var i = 0; i < keys.length; i++)
                descs.push( [keys[i], convertToDescriptor( properties[keys[i]], obj )] );

            for (var i = 0; i < descs.length; i++)
                defineProperty(obj, descs[i][0], descs[i][1]);

            return obj;
        },
        
         /**[DOC_MARKDOWN]
        * __Method__: *Create*
        *
        * ```javascript
        * obj = Classy.Create(Object proto [, Object properties]);
        * ```
        *
        * Create an obj having *proto* as prototype adding any optional *properties* (Polyfill around **Object.create** method).
        *
        [/DOC_MARKDOWN]**/
       Create = Object.create || function(proto, properties) {
            var Type = function () {}, TypeObject;
            Type.prototype = proto;
            TypeObject = new Type();
            TypeObject.__proto__ = proto;
            if ( 'object' === typeof(properties) ) defineProperties(TypeObject, properties);
            return TypeObject;
        },
        
        
        $super = function( superClass ) {
            var _super = new Ctx( superClass );
            // return the function to handle the super call, handling possible recursion if needed
            return function(method /*, var args here.. */) { 
                if ( method && _super && _super.v )
                {
                    var scope = this, ret;
                    method = ( 'constructor' === method ) ? _super.v : _super.v.prototype[ method ];
                    if ( method ) 
                    {
                        // handle recursion by walking the chain using a new context
                        _super = _super.fwd( _super.v.$super );
                        ret = method.apply(scope, slice( arguments, 1 ));
                        // back to prev
                        _super = _super.bwd( );
                        return ret;
                    }
                }
            };
        },
        
        /**[DOC_MARKDOWN]
        * __Method__: *Merge*
        *
        * ```javascript
        * proto = Classy.Merge(Object proto, Object proto1 [, Object proto2, ..]);
        * ```
        *
        * Merge *objects/prototypes* into one *object/prototype* ( **Arrays** , **Strings** and **Numbers** are shallow copied, else copy by reference).
        *
        [/DOC_MARKDOWN]**/
        Merge = function(/* var args here.. */) { 
            var args = slice(arguments), argslen, 
                o1, o2, v, p, i, T;
            o1 = args.shift() || {}; 
            argslen = args.length;
            for (i=0; i<argslen; i++)
            {
                o2 = args[ i ];
                if ( T_OBJ === get_type( o2 ) )
                {
                    for (p in o2)
                    {            
                        if ( hasProperty(o2, p) && propertyIsEnum(o2, p) ) 
                        {
                            v = o2[p];
                            T = get_type( v );
                            
                            if ( T_NUM & T )
                                // shallow copy for numbers, better ??
                                o1[p] = 0 + v;  
                            
                            else if ( (T_STR | T_ARRAY) & T )
                                // shallow copy for arrays or strings, better ??
                                o1[p] = v.slice(0);  
                            
                            else
                                // just reference copy
                                o1[p] = v;  
                        }
                    }
                }
            }
            return o1; 
        },
        
        /**[DOC_MARKDOWN]
        * __Method__: *Alias*
        *
        * ```javascript
        * namespaced_and_or_aliased_proto = Classy.Alias(Object proto, String namespace=null, Object|Function aliases=null);
        * // a namespaced method "method1" with namepace "ns1"
        * // will appear as a new method with name "ns1$method1"
        * // the original method name is also present, except if also "aliased" to a new method name
        * ```
        *
        * Namespace an object's methods and/or alias an object's methods/properties so as to avoid method naming conflicts.
        * Useful when implementing multiple interfaces which might share same method names (and which **do not** internally use the original method names). Used internally by other Classy methods (which may include aliases) as well.
        *
        [/DOC_MARKDOWN]**/
        Alias = function( o, namespace, aliases ) {
            var ao, hasNamespace = !!namespace, p;
            if ( hasNamespace || aliases )
            {
                ao = { }; namespace = hasNamespace ? (namespace + '$') : namespace;
                if ( aliases && T_FUNC === get_type(aliases) )
                {
                    for (p in o)
                    {
                        if ( "constructor" !== p )
                        {
                            // only method namespacing
                            if ( hasNamespace && 
                                T_FUNC === get_type(o[ p ]) )  ao[ namespace + p ] = o[ p ];
                            // aliases can be a function as well
                            ao[ aliases( p, o[ p ] ) ] = o[ p ];
                        }
                        else
                        {
                            ao[ p ] = o[ p ];
                        }
                    }
                }
                else
                {
                    for (p in o)
                    {
                        if ( "constructor" !== p )
                        {
                            // only method namespacing
                            if ( hasNamespace && 
                                T_FUNC === get_type(o[ p ]) )   ao[ namespace + p ] = o[ p ];
                            if ( aliases && (p in aliases) )    ao[ aliases[ p ] ] = o[ p ];
                            else                                ao[ p ] = o[ p ];
                        }
                        else
                        {
                            ao[ p ] = o[ p ];
                        }
                    }
                }
            }
            else
            {
                ao = o;
            }
            return ao;
        },
        
        /**[DOC_MARKDOWN]
        * __Method__: *Extends*
        *
        * ```javascript
        * subClass = Classy.Extends(Function superClass=Object [, Object proto]);
        * ```
        *
        * Return a *subClass* that extends the *superClass* , with additional methods/properties defined in *proto* object.
        * If *superClass* is not given or undefined or null, extend the **Object** class by default.
        *
        [/DOC_MARKDOWN]**/
        // http://javascript.crockford.com/prototypal.html
        // http://stackoverflow.com/questions/12592913/what-is-the-reason-to-use-the-new-keyword-here
        // http://perfectionkills.com/how-ecmascript-5-still-does-not-allow-to-subclass-an-array/
        // http://dmitrysoshnikov.com/ecmascript/javascript-the-core/
        // http://stackoverflow.com/questions/16063394/prototypical-inheritance-writing-up/16063711#16063711
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty/Additional_examples
        Extends = function(superClass, subClassProto, namespace, aliases) {
            superClass = superClass || Object;
            subClassProto = subClassProto || {};
            var dummyConstructor, C, __static__ = null, $static = superClass.$static || null,
                i, l, prop, key, val, T
            ;
            // fix issue when constructor is missing
            if ( !hasProperty(subClassProto, 'constructor') )
            {
                dummyConstructor = function() {};
                subClassProto['constructor'] = C = dummyConstructor;
            }
            else
            {
                C = subClassProto['constructor'];
            }
            
            if ( hasProperty(subClassProto, '__static__') )
            {
                // $static / __static__ props/methods and associated keys
                // __static__ = actual props/methods
                __static__ = subClassProto['__static__'];
                delete subClassProto['__static__'];
                // $static = props/methods keys
                // store "static keys" for enabling subclass inheritance/extension if needed
                $static = mergeUnique( $static || [], Keys( __static__ ) );
            }
            
            C.prototype = Alias( Create( superClass.prototype ), namespace, aliases );
            C.prototype = Merge( C.prototype, subClassProto );
            /*
            C.prototype.constructor = C.prototype.$class = C;
            C.prototype.$super = $super( superClass );
            */
            defineProperties( C.prototype, {
                
                constructor: {
                    value: C,
                    enumerable: false,
                    writable: true,
                    configurable: true
                },
                
                $class: {
                    value: C,
                    enumerable: false,
                    writable: true,
                    configurable: true
                },
                
                $super: {
                    value: $super( superClass ),
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            /*
            C.$super = superClass;
            if ( superClass.$static && 'object' == typeof(superClass.$static) )
                C.$static = Merge( null, superClass.$static );
            else
                C.$static = null;
            */
            defineProperties( C, {
                
                $super: {
                    value: superClass,
                    enumerable: false,
                    writable: true,
                    configurable: true
                },
                
                $static: {
                    value: $static,
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });
            
            if ( $static )
            {
                // add inlne static props/methods
                //C = Merge( C, $static );
                l = $static.length;
                prop = {};
                for (i=0; i<l; i++)
                {
                    key = $static[ i ];
                    val = null;
                    if ( __static__ && undef !== __static__[ key ] )
                    {
                        val = __static__[ key ];
                    }
                    else if ( undef !== superClass[ key ] )
                    {
                        T = get_type( superClass[ key ] );
                        
                        if ( T_OBJ === T )
                            val = Merge( null, superClass[ key ] );
                        else if ( (T_STR | T_ARRAY) & T )
                            val = superClass[ key ].slice(0);
                        else if ( T_NUM & T )
                            val = 0 + superClass[ key ];
                        else
                            val = superClass[ key ];
                    }
                    prop[ key ] = {
                        value: val,
                        enumerable: false,
                        writable: true,
                        configurable: true
                    };
                }
                // define (extendable) static props/methods
                defineProperties( C, prop );
            }
            return C;
        },

        /**[DOC_MARKDOWN]
        * __Methods__: *Implements* , *Mixin*
        *
        * ```javascript
        * proto = Classy.Implements(Object proto, Object proto1 [, Object proto2, ..]);
        * // or
        * proto = Classy.Mixin(Object proto, Object proto1 [, Object proto2, ..]);
        * ```
        *
        * These methods are aliases of **Classy.Merge** method (for now) and perform the same functionality.
        *
        [/DOC_MARKDOWN]**/
        Implements = Merge, Mixin = Merge,
        
        /**[DOC_MARKDOWN]
        * __Method__: *Class*
        *
        * ```javascript
        * aClass = Classy.Class( );
        * // or
        * aClass = Classy.Class(Object proto);
        * // or
        * aClass = Classy.Class(Function superClass, Object proto);
        * // or
        * aClass = Classy.Class(Object qualifier, Object proto);
        * ```
        *
        * This is the main Classy method to construct JavaScript Classes, it includes all other methods.
        * If 2 or more arguments are passed to the method, 
        * the first is the either a *superClass* or a *class qualifier* which is an object defining class qualifications,
        * the second is the *class prototype* , 
        *
        * eg.:
        * ```javascript
        * var aChild = Classy.Class( 
        * // Class Qualifier Object
        * { Extends: aParent, Implements: [EventEmitter, Runnable] }, 
        * {
        *     
        *     // extendable static props/methods (are inherited by subclasses)
        *     __static__: {
        *       aStaticProp: 2,
        *       aStaticMethod: function(msg) { console.log(msg); }
        *     },
        *     
        *     // class constructor
        *     constructor: function(a, b) {
        *         // call super constructor
        *         this.$super('constructor', a, b);
        *     },
        *     
        *     // class method
        *     sayHi: function() {
        *         return 'Hi';
        *     }
        * }
        * );
        * ```
        *
        * Class *static* properties/methods are accessed as:
        *
        * ```javascript
        * aChild.aStaticProp;
        * // or, aChildInst is an instance of aChild
        * aChildInst.$class.aStaticProp;
        * ```
        *
        [/DOC_MARKDOWN]**/
        /**[DOC_MARKDOWN]
        * __Classy Sweet Macros__
        *
        * A set of [sweet.js](http://github.com/mozilla/sweet.js) macros for classy.js are included in order to have a full object-oriented syntactic sugar
        * for your projects, similar to php or java
        *
        * see [macros](/macros) folder for the src and examples of how to use.
        *
        * __Example:__
        *
        * ```javascript
        *
        * // require the classy lib here, compile this file including the macros/classy.sweet.js macro lib
        * var Classy = require('../build/classy').Classy;
        * 
        * // define a Parent super class
        * Class aParent {
        *
        *     // static method (inherited by subclasses)
        *     // method arguments default values supported
        *     // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/default_parameters
        *     // rest parameters also supported
        *     // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/rest_parameters
        *     static aStaticMethod(msg = '', ...rest) { 
        *         console.log(rest);
        *         return 'Static Parent ' + msg; 
        *     }
        *     
        *     // static prop (inherited by subclasses)
        *     // method arguments default values supported
        *     static aStaticProp = 1;
        *     
        *     // block definition of static properties / methods (inherited by subclasses)
        *     static: {
        *         
        *         aStaticProp2 =  1;
        *         
        *         // method arguments default values supported
        *         aStaticMethod2(msg = '') { 
        *             return 'Static '+msg; 
        *         }
        *     }
        *     
        *     // a property with initial value
        *     aProp = 1;
        *     
        *     // a property no initial value (null by default)
        *     msg;
        *     
        *     // class constructor
        *     // method arguments default values supported
        *     // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/default_parameters
        *     // rest parameters also supported
        *     // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions_and_function_scope/rest_parameters
        *     constructor (msg = '', ...rest) {
        *        this.msg = msg;
        *     }
        *     
        *     // class method
        *     sayHi () {
        *        return this.msg;
        *     }
        * }
        * 
        * 
        * // define a Chlld sub class
        * Class aChild extends aParent implements String, RegExp {
        *     
        *     // method arguments default values supported
        *     static aStaticMethod(msg = '') { 
        *         return 'Static Child ' + msg; 
        *     }
        *     
        *     constructor (msg = '') {
        *        // call super constructor (js-style)
        *        super(msg);
        *        // call super constructor or other super method (PHP-style)
        *        //super.constructor(msg);
        *        this.msg = 'child says also ' + this.msg;
        *     }
        * }
        * 
        * 
        * // do the test
        * console.log("Classy.VERSION = " + Classy.VERSION);
        * console.log(new aParent('Hi').sayHi());
        * console.log(new aChild('Hi').sayHi());
        * console.log(aParent.aStaticMethod('aParent'));
        * console.log(aChild.aStaticMethod('aChild'));
        * console.log(aParent.aStaticMethod2('aParent'));
        * console.log(aChild.aStaticMethod2('aChild'));
        *
        * ```
        *
        [/DOC_MARKDOWN]**/
        Class = function(/* var args here */) {
            var args = slice(arguments), argslen = args.length, _class = null;
            
            if ( 2 <= argslen )
            {
                var _qualifier = get_type( args[0] );
                
                if ( T_FUNC === _qualifier )
                    // shortcut to extend a class
                    _qualifier = { Extends: args[0] };
                else if ( T_OBJ === _qualifier )
                    _qualifier = args[0];
                else
                    _qualifier = { Extends: Object };
                
                var _proto = args[1] || {},
                    _protomix = {},
                    _extends = _qualifier.Extends || _qualifier.extends || Object,
                    _implements = _qualifier.Implements || _qualifier.implements,
                    _mixin = _qualifier.Mixin || _qualifier.mixin,
                    _protoalias = null,
                    i, l
                ;
                
                // make them arrays, if not
                _implements = (_implements) ? [].concat(_implements) : null;
                _mixin = (_mixin) ? [].concat(_mixin) : null;
                
                if ( _mixin )
                {
                    for (i=0, l=_mixin.length; i<l; i++)
                    {
                        if ( T_OBJ === get_type( _mixin[i] ) )
                        {
                            if ( _mixin[i].mixin && _mixin[i].mixin.prototype )
                            {
                                _protoalias = Alias(
                                    _mixin[i].mixin.prototype, 
                                    _mixin[i].namespace || null, 
                                    _mixin[i].as || null
                                );
                                _protomix = Mixin(_protomix, _protoalias);
                            }
                        }
                        else if ( _mixin[i].prototype )
                        {
                            _protoalias = _mixin[i].prototype;
                            _protomix = Mixin(_protomix, _protoalias);
                        }
                    }
                }
                    
                if ( _implements )
                {
                    for (i=0, l=_implements.length; i<l; i++)
                    {
                        if ( T_OBJ === get_type( _implements[i] ) )
                        {
                            if ( _implements[i].implements && _implements[i].implements.prototype )
                            {
                                _protoalias = Alias(
                                    _implements[i].implements.prototype, 
                                    _implements[i].namespace || null, 
                                    _implements[i].as || null
                                );
                                _protomix = Implements(_protomix, _protoalias);
                            }
                        }
                        else if ( _implements[i].prototype )
                        {
                            _protoalias = _implements[i].prototype;
                            _protomix = Implements(_protomix, _protoalias);
                        }
                    }
                }
                
                if ( T_OBJ === get_type( _extends ) )
                {
                    _class = Extends(
                        _extends.extends || Object, 
                        Merge(_protomix, _proto), 
                        _extends.namespace || null,
                        _extends.as || null
                    );
                }
                else
                {
                    _class = Extends(_extends, Merge(_protomix, _proto));
                }
            }
            
            else
            {
                _class = Extends(Object, args[0]);
            }
            
            return _class;
        }
    ;
    
    // export it
    exports.Classy = {
        
        VERSION: "@@VERSION@@",
        
        T: {
            UNDEFINED: T_UNDEF,
            NULL: T_NULL,
            BOOLEAN: T_BOOL,
            STRING: T_STR,
            NUMBER: T_NUM,
            NAN: T_NAN,
            FUNCTION: T_FUNC,
            REGEXP: T_REGEX,
            ARRAY: T_ARRAY,
            OBJECT: T_OBJ
        },
            
        Type: get_type,
        
        Create: Create,
        
        Merge: Merge,
        
        Alias: Alias,
        
        Implements: Implements,
        
        Mixin: Mixin,
        
        Extends: Extends,
        
        // vanilla method for strictly static (objects) classes
        Static: function( defs ) { return defs; },
        
        // main method
        Class: Class
    };
    
})(@@EXPORTS@@);