/**
*
*   Classy.js
*   @version: 0.8.2
*
*   Object-Oriented micro-framework for JavaScript
*   https://github.com/foo123/classy.js
*
**/!function( root, name, factory ) {
    "use strict";
    
    //
    // export the module, umd-style (no other dependencies)
    var isCommonJS = ("object" === typeof(module)) && module.exports, 
        isAMD = ("function" === typeof(define)) && define.amd, m;
    
    // CommonJS, node, etc..
    if ( isCommonJS ) 
        module.exports = (module.$deps = module.$deps || {})[ name ] = module.$deps[ name ] || (factory.call( root, {NODE:module} ) || 1);
    
    // AMD, requireJS, etc..
    else if ( isAMD && ("function" === typeof(require)) && ("function" === typeof(require.specified)) && require.specified(name) ) 
        define( name, ['require', 'exports', 'module'], function( require, exports, module ){ return factory.call( root, {AMD:module} ); } );
    
    // browser, web worker, etc.. + AMD, other loaders
    else if ( !(name in root) ) 
        (root[ name ] = (m=factory.call( root, {} ) || 1)) && isAMD && define( name, [], function( ){ return m; } );


}(  /* current root */          this, 
    /* module name */           "Classy",
    /* module factory */        function( exports ) {
        
    /* main code starts here */

/**
*
*   Classy.js
*   @version: 0.8.2
*
*   Object-Oriented micro-framework for JavaScript
*   https://github.com/foo123/classy.js
*
**/
!function( exports, undef ) {
    
    "use strict";
    
    /**[DOC_MARKDOWN]
    *
    * ###Classy Methods
    *
    [/DOC_MARKDOWN]**/
    
    var CONSTRUCTOR = "constructor", PROTO= "prototype", __PROTO__ = "__proto__", 
        __STATIC__ = "__static__", __PRIVATE__ = "__private__", PRIVATE = "$private",
        SUPER = "$super", STATIC = "$static", CLASS = "$class",
        /*METHOD = 1,*/ PUBLIC_PROP = 2, PRIVATE_PROP = 4, STATIC_PROP = 8,
        Obj = Object, OP = Obj[PROTO], Func = Function, FP = Func[PROTO], 
        Str = String, Num = Number, Regex = RegExp, Arr = Array, 
        toStr = FP.call.bind(OP.toString), stringifyFunc = FP.call.bind(FP.toString),
        /*AP = Arr[PROTO], slice = FP.call.bind(AP.slice),*/ 
        hasProperty = FP.call.bind(OP.hasOwnProperty), 
        propertyIsEnum = FP.call.bind(OP.propertyIsEnumerable), Keys = Obj.keys, defineProperty = Obj.defineProperty,
        
        is_instance = function(o, t) { return o instanceof t; },
        typeOf = function( v ) { return typeof( v ); },
        type_error = function( msg ) { throw new TypeError( msg ); },
        
        // http://stackoverflow.com/a/20473505/3591273
        createScopedFunc = function( func, scope ) {
            var k, names = Keys( scope ), vars = [ ];
            for (k=0; k<names.length; k++) vars.push( scope[ names[k] ] );
            return new Func( names.join(','), func ).apply( {}, vars );
        },
        
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
        // https://developer.mozilla.org/en-US/docs/Enumerability_and_ownership_of_properties
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FObject%2FpropertyIsEnumerable
        
        // types
        //T_INF = 3,
        T_NUM = 2, T_NAN = 3,  T_BOOL = 4,
        T_STR = 8, T_CHAR = 9,
        T_ARRAY = 16, T_OBJ = 32, T_FUNC = 64,  T_REGEX = 128,
        T_NULL = 256, T_UNDEF = 512, T_UNKNOWN = 1024,
        get_type = function( v ) {
            var type_of, to_string;
            
            if (null === v)  return T_NULL;
            
            else if (true === v || false === v)  return T_BOOL;
            
            type_of = typeOf(v); to_string = toStr(v);
            
            if (undef === v || "undefined" === type_of)  return T_UNDEF;
            
            else if (is_instance(v, Num) || "number" === type_of)  return isNaN(v) ? T_NAN : T_NUM;
            
            else if (is_instance(v, Str) || "string" === type_of) return (1 === v.length) ? T_CHAR : T_STR;
            
            else if (is_instance(v, Arr) || "[object Array]" === to_string)  return T_ARRAY;
            
            else if (is_instance(v, Regex) || "[object RegExp]" === to_string)  return T_REGEX;
            
            else if (is_instance(v, Func) || ("function" === type_of && "[object Function]" === to_string))  return T_FUNC;
            
            else if ("[object Object]" === to_string)  return T_OBJ;
            
            // unkown type
            return T_UNKNOWN;
        },
        mergeUnique = function( a1, a2 ) {
            var i, l = a2.length, a = [ ].concat( a1 );
            for (i=0; i<l; i++)
            {
                if ( -1 < a.indexOf( a2[i] ) ) continue;
                a.push( a2[i] );
            }
            return a;
        },
        convertToDescriptor = function (desc, obj) {

            if ( T_OBJ !== get_type(desc) ) type_error("bad desc");

            var d = {};
            
            if ( hasProperty(desc, "enumerable") )   d.enumerable = !!obj.enumerable;
            
            if ( hasProperty(desc, "configurable") ) d.configurable = !!obj.configurable;
            
            if ( hasProperty(desc, "value") )    d.value = obj.value;
            
            if ( hasProperty(desc, "writable") )  d.writable = !!desc.writable;
            
            if ( hasProperty(desc, "get") ) 
            {
                var g = desc.get;

                if ( T_FUNC !== get_type(g) && g !== "undefined") type_error("bad get");
                d.get = g;
            }
            
            if ( hasProperty(desc, "set") ) 
            {
                var s = desc.set;
                
                if ( T_FUNC !== get_type(s) && s !== "undefined") type_error("bad set");
                d.set = s;
            }

            if (("get" in d || "set" in d) && ("value" in d || "writable" in d)) type_error("identity-confused descriptor");

            return d;
        },
        defineProperties = Obj.defineProperties || function (obj, properties) {
            
            if (typeOf(obj) !== "object" || obj === null) type_error("bad obj");

            properties = Obj(properties);

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
       Create = Obj.create || function( proto, properties ) {
            var Type = function () {}, TypeObject;
            Type[PROTO] = proto;
            TypeObject = new Type( );
            TypeObject[__PROTO__] = proto;
            if ( 'object' === typeOf(properties) ) defineProperties(TypeObject, properties);
            return TypeObject;
        },
        
        // this.$superv('method', [a, b]);
        // this.$super('method', a, b);
        dummySuper = function(){},
        $SUPER = function( superClass, vectorSuper ) {
            // return the function to handle the super call, handling possible recursion if needed
            var _super_super, called = null;
            if ( vectorSuper )
            {
                _super_super = superClass[SUPER+'v'] || dummySuper;
                return function( method, args ) { 
                    var r, m;
                    if ( called === method )
                    {
                        // no recursion faster instead of recursing on this.$super and walking the prototype
                        r = _super_super.call(this, method, args);
                    }
                    else if ( m=superClass[method] )
                    {
                        // .call is faster than .apply
                        called = method;
                        r = args && args.length ? m.apply(this, args) : m.call(this);
                        called = null;
                    }
                    return r;
                }
            }
            else
            {
                _super_super = superClass[SUPER] || dummySuper;
                /*, var args here.. */
                /* use up to 10 arguments for speed, use $superv for arbitrary arguments */
                return function( method, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9 ) { 
                    var r, m;
                    if ( called === method )
                    {
                        // no recursion faster instead of recursing on this.$super and walking the prototype
                        r = _super_super.call(this, method, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
                    }
                    else if ( m=superClass[method] )
                    {
                        // http://jsperf.com/argument-slicers
                        // .call is faster than .apply
                        called = method;
                        r = m.call(this, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9);
                        called = null;
                    }
                    return r;
                }
            }
        },
        
        // $super.method.call(this, a, b);
        // $method.$super.call(this, a, b);
        // _super.call(this, a, b);
        $SCOPED = function( name, method, currentClass, superClass, privateMethods, scope ) {
            scope = scope || {};
            scope[SUPER] = superClass;
            scope[CLASS] = currentClass;
            scope[PRIVATE] = privateMethods;
            scope['_super'] = superClass[name] || dummySuper;
            var newMethod = createScopedFunc("var $method="+stringifyFunc( method )+"; return $method;", scope);
            newMethod[SUPER] = scope['_super'];
            return newMethod;
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
            var args = arguments, argslen, 
                o1, o2, v, p, i, T;
            o1 = args[0] || {}; 
            argslen = args.length;
            for (i=1; i<argslen; i++)
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
                        if ( CONSTRUCTOR !== p )
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
                        if ( CONSTRUCTOR !== p )
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
        * __Method__: *Method*
        *
        * ```javascript
        * aMethod = Classy.Method(Function method [, FLAG qualifier=Classy.PUBLIC] [, Object scope=null]);
        * ```
        *
        * Return a *method* accessed as qualifier (PUBLIC/STATIC/PRIVATE) with optional "scoped" lexical variable context, 
        * to be used as a method function in a class definition,
        * where direct contextual information (e.g faster "$super" reference) can be added transparently
        *
        * example:
        * ```javascript
        * aClass = Classy.Class(anotherClass, {
        *     
        *     constructor: Classy.Method(function( a, b ) { 
        *        $super.constructor.call(this, a, b);
        *        // ...
        *     }),
        *     // this enables Classy to scope a method correctly (if needed), 
        *     // so as to add direct $super context reference (faster) or other contextual information
        *     // (optional) scope includes any variables used inside the method that belong to its lexical scope
        *     // so the method can be reproduced correctly
        *     aMethod: Classy.Method(function( ) {
        *         // ...
        *         // direct $super reference used here, 
        *         // Classy will add the necessary reference transparently
        *         $super.aMethod.call(this);
        *
        *         // aVar1, avar2 are variables NOT defined inside the method, 
        *         // but part of its lexical (closure) scope
        *         aVar1 = aVar2 + 1;
        *     }, Classy.PUBLIC, {aVar1:aVar1, aVar2:aVar2}),
        *
        *     // accessible as "aClass.aStaticMethod" (extendable)
        *     aStaticMethod: Classy.Method(function( ){ 
        *          // ...
        *     }, Classy.STATIC )
        * });
        * ```
        *
        [/DOC_MARKDOWN]**/
        Method = function( method, qualifier, scope ) {
            if ( !(this instanceof Method) ) return new Method( method, qualifier, scope );
            this.method = method;
            this.qualifier = (T_NUM === get_type(qualifier) ? qualifier : 0) | PUBLIC_PROP;
            this.scope = T_OBJ === get_type(scope) ? scope : null;
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
        Extends = function( superClass, subClassProto, namespace, aliases ) {
            superClass = superClass || Obj;
            subClassProto = subClassProto || {};
            var $static = superClass[STATIC] || null,
                superClassProto = superClass[PROTO], 
                C, __static__ = null, currect$static = null,
                __private__ = { }, 
                i, l, prop, key, val, T, mname, method
            ;
            
            // fix issue when constructor is missing
            if ( !hasProperty(subClassProto, CONSTRUCTOR) ) subClassProto[CONSTRUCTOR] = function(){};
            
            C = subClassProto[CONSTRUCTOR];
            
            if ( hasProperty(subClassProto, __PRIVATE__) )
            {
                __private__ = subClassProto[__PRIVATE__] || { };
                delete subClassProto[__PRIVATE__];
            }
            
            if ( hasProperty(subClassProto, __STATIC__) )
            {
                // $static / __static__ props/methods and associated keys
                // __static__ = actual props/methods
                __static__ = subClassProto[__STATIC__];
                // $static = props/methods keys
                // store "static keys" for enabling subclass inheritance/extension if needed
                currect$static = Keys( __static__ );
                delete subClassProto[__STATIC__];
            }
            
            // add $SCOPED/Method functionality as well
            for (mname in subClassProto)
            {
                method = subClassProto[ mname ];
                if ( method instanceof Method )
                {
                    if ( STATIC_PROP & method.qualifier )
                    {
                        (__static__=__static__||{})[ mname ] = method.method;
                        (currect$static=currect$static||[]).push( mname );
                        delete subClassProto[mname];
                    }
                    else if ( T_FUNC === get_type(method.method) )
                    {
                        if ( PRIVATE_PROP & method.qualifier )
                        {
                            __private__[ mname ] = method;
                            delete subClassProto[mname];
                        }
                        else
                        {
                            subClassProto[mname] = $SCOPED(
                                mname, method.method, 
                                C, superClassProto, 
                                __private__,
                                method.scope
                            );
                        }
                    }
                    else
                    {
                        subClassProto[mname] = method.method;
                    }
                }
                else if ( T_FUNC === get_type(subClassProto[mname]) )
                {
                    // enable NFE-style super functionality as well
                    subClassProto[mname][SUPER] = superClassProto[mname] || dummySuper;
                }
            }
            for (mname in __private__)
            {
                method = __private__[ mname ];
                if ( method instanceof Method )
                {
                    __private__[mname] = $SCOPED(
                        mname, method.method, 
                        C, superClassProto, 
                        __private__,
                        method.scope
                    );
                }
                else if ( T_FUNC === get_type(method) )
                {
                    __private__[mname] = $SCOPED(
                        mname, method, 
                        C, superClassProto, 
                        __private__,
                        { }
                    );
                }
                else
                {
                    delete __private__[mname];
                }
            }
            
            C[PROTO] = Alias( Create( superClassProto ), namespace, aliases );
            C[PROTO] = Merge( C[PROTO], subClassProto );
            
            prop = { };
            prop[CLASS] = prop[CONSTRUCTOR] = {
                value: C,
                enumerable: false,
                writable: true,
                configurable: true
            };
            prop[SUPER] = {
                value: $SUPER( superClassProto ),
                enumerable: false,
                writable: true,
                configurable: true
            };
            prop[SUPER+'v'] = {
                value: $SUPER( superClassProto, true ),
                enumerable: false,
                writable: true,
                configurable: true
            };
            defineProperties( C[PROTO], prop );
            
            prop = { };
            if ( $static || currect$static )
            {
                $static = mergeUnique( $static || [], currect$static || [] );
                // add inlne static props/methods
                //C = Merge( C, $static );
                l = $static.length;
                //prop = {};
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
            }
            prop[STATIC] = {
                value: $static,
                enumerable: false,
                writable: true,
                configurable: true
            };
            prop[SUPER] = {
                value: superClass,
                enumerable: false,
                writable: true,
                configurable: true
            };
            // define class info and (extendable) static props/methods
            defineProperties( C, prop );

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
        * aStaticClass = Classy.Class( Classy.STATIC, Object staticdefs={} );
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
        *     // private methods ONLY (NOT extendable)
        *     __private__: {
        *       aPrivateMethod: function(msg) { console.log(msg); }
        *     },
        *     // alternative way to define private methods ONLY (NOT extendable)
        *     aPrivateMethod2: Classy.Method(function(msg) { 
        *         // access other private methods as well
        *         $private.aPrivateMethod( msg );
        *     }, Classy.PRIVATE),
        *     
        *     // extendable static props/methods (are inherited by subclasses)
        *     __static__: {
        *       aStaticProp: 2,
        *       aStaticMethod: function(msg) { console.log(msg); }
        *     },
        *     // alternative way to define static methods/props (extendable)
        *     aStaticMethod2: Classy.Method(function(msg) { console.log(msg); }, Classy.STATIC),
        *     
        *     // class constructor
        *     constructor: function(a, b) {
        *         // call super constructor (slower)
        *         this.$super('constructor', a, b);
        *         // call super vector (args) constructor (faster)
        *         //this.$superv('constructor', [a, b]);
        *     },
        *     
        *     // class method (wrap around a Classy.Method to have access to $private and $super direct references)
        *     sayHi: Classy.Method(function( ){
        *         // call a private method here
        *         $private.aPrivateMethod.call(this, 'Hi');
        *         $private.aPrivateMethod2('Hi2');
        *         $super.sayHi.call(this, 'Hi3');
        *         return 'Hi';
        *     })
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
        * var Classy = require('../build/classy');
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
            var args = arguments, argslen = args.length, _class = null;
            
            // "static class" definition, vanilla, return the defs
            if ( STATIC_PROP === args[0] ) return args[1] || { };
            
            if ( 2 <= argslen )
            {
                var _qualifier = get_type( args[0] );
                
                if ( T_FUNC === _qualifier )
                    // shortcut to extend a class
                    _qualifier = { Extends: args[0] };
                else if ( T_OBJ === _qualifier )
                    _qualifier = args[0];
                else
                    _qualifier = { Extends: Obj };
                
                var _proto = args[1] || {},
                    _protomix = {},
                    _extends = _qualifier.Extends || _qualifier.extends || Obj,
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
                            if ( _mixin[i].mixin && _mixin[i].mixin[PROTO] )
                            {
                                _protoalias = Alias(
                                    _mixin[i].mixin[PROTO], 
                                    _mixin[i].namespace || null, 
                                    _mixin[i].as || null
                                );
                                _protomix = Mixin(_protomix, _protoalias);
                            }
                        }
                        else if ( _mixin[i][PROTO] )
                        {
                            _protoalias = _mixin[i][PROTO];
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
                            if ( _implements[i].implements && _implements[i].implements[PROTO] )
                            {
                                _protoalias = Alias(
                                    _implements[i].implements[PROTO], 
                                    _implements[i].namespace || null, 
                                    _implements[i].as || null
                                );
                                _protomix = Implements(_protomix, _protoalias);
                            }
                        }
                        else if ( _implements[i][PROTO] )
                        {
                            _protoalias = _implements[i][PROTO];
                            _protomix = Implements(_protomix, _protoalias);
                        }
                    }
                }
                
                if ( T_OBJ === get_type( _extends ) )
                {
                    _class = Extends(
                        _extends.extends || Obj, 
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
                _class = Extends(Obj, args[0]);
            }
            
            return _class;
        }
    ;
    
    // export it
    exports['Classy'] = {
        
        VERSION: "0.8.2",
        
        PUBLIC: PUBLIC_PROP, STATIC: STATIC_PROP, PRIVATE: PRIVATE_PROP,
        
        Type: get_type,
        
        Create: Create,
        
        Merge: Merge,
        
        Alias: Alias,
        
        Implements: Implements, Mixin: Mixin,
        
        Extends: Extends,
        
        Method: Method,
        
        // main method
        Class: Class
    };
    
}(exports);    
    /* main code ends here */
    /* export the module */
    return exports["Classy"];
});