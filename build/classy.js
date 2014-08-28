/**
*
*   Classy.js
*   @version: 0.7
*
*   Object-Oriented micro-framework for JavaScript
*   https://github.com/foo123/classy.js
*
**/!function ( root, name, deps, factory, undef ) {

    "use strict";
    var isNode = ("undefined" !== typeof global && "[object global]" === {}.toString.call(global)),
        isBrowser = (!isNode && "undefined" !== typeof navigator ), 
        isWorker = ("function" === typeof importScripts && navigator instanceof WorkerNavigator),
        A = Array, AP = A.prototype
    ;
    // Get current filename/path
    var getCurrentPath = function() {
            var file = null;
            if ( isNode ) 
            {
                // http://nodejs.org/docs/latest/api/globals.html#globals_filename
                // this should hold the current file in node
                file = __filename;
                return { path: __dirname, file: __filename };
            }
            else if ( isWorker )
            {
                // https://developer.mozilla.org/en-US/docs/Web/API/WorkerLocation
                // this should hold the current url in a web worker
                file = self.location.href;
            }
            else if ( isBrowser )
            {
                // get last script (should be the current one) in browser
                var scripts;
                if ((scripts = document.getElementsByTagName('script')) && scripts.length) 
                    file  = scripts[scripts.length - 1].src;
            }
            
            if ( file )
                return { path: file.split('/').slice(0, -1).join('/'), file: file };
            return { path: null, file: null };
        },
        thisPath = getCurrentPath(),
        makePath = function(base, dep) {
            if ( isNode )
            {
                //return require('path').join(base, dep);
                return dep;
            }
            if ( "." == dep.charAt(0) ) 
            {
                base = base.split('/');
                dep = dep.split('/'); 
                var index = 0, index2 = 0, i, l = dep.length, l2 = base.length;
                
                for (i=0; i<l; i++)
                {
                    if ( /^\.\./.test( dep[i] ) )
                    {
                        index++;
                        index2++;
                    }
                    else if ( /^\./.test( dep[i] ) )
                    {
                        index2++;
                    }
                    else
                    {
                        break;
                    }
                }
                index = ( index >= l2 ) ? 0 : l2-index;
                dep = base.slice(0, index).concat( dep.slice( index2 ) ).join('/');
            }
            return dep;
        }
    ;
    
    //
    // export the module in a umd-style generic way
    deps = ( deps ) ? [].concat(deps) : [];
    var i, dl = deps.length, ids = new A( dl ), paths = new A( dl ), fpaths = new A( dl ), mods = new A( dl ), _module_, head;
        
    for (i=0; i<dl; i++) { ids[i] = deps[i][0]; paths[i] = deps[i][1]; fpaths[i] = /\.js$/i.test(paths[i]) ? makePath(thisPath.path, paths[i]) : makePath(thisPath.path, paths[i]+'.js'); }
    
    // node, commonjs, etc..
    if ( "object" === typeof( module ) && module.exports ) 
    {
        if ( undef === module.exports[name] )
        {
            for (i=0; i<dl; i++)  mods[i] = module.exports[ ids[i] ] || require( fpaths[i] )[ ids[i] ];
            _module_ = factory.apply(root, mods );
            // allow factory just to add to existing modules without returning a new module
            module.exports[ name ] = _module_ || 1;
        }
    }
    
    // amd, etc..
    else if ( "function" === typeof( define ) && define.amd ) 
    {
        define( ['exports'].concat( paths ), function( exports ) {
            if ( undef === exports[name] )
            {
                var args = AP.slice.call( arguments, 1 ), dl = args.length;
                for (var i=0; i<dl; i++)   mods[i] = exports[ ids[i] ] || args[ i ];
                _module_ = factory.apply(root, mods );
                // allow factory just to add to existing modules without returning a new module
                exports[ name ] = _module_ || 1;
            }
        });
    }
    
    // web worker
    else if ( isWorker ) 
    {
        for (i=0; i<dl; i++)  
        {
            if ( !self[ ids[i] ] ) importScripts( fpaths[i] );
            mods[i] = self[ ids[i] ];
        }
        _module_ = factory.apply(root, mods );
        // allow factory just to add to existing modules without returning a new module
        self[ name ] = _module_ || 1;
    }
    
    // browsers, other loaders, etc..
    else
    {
        if ( undef === root[name] )
        {
            /*
            for (i=0; i<dl; i++)  mods[i] = root[ ids[i] ];
            _module_ = factory.apply(root, mods );
            // allow factory just to add to existing modules without returning a new module
            root[name] = _module_ || 1;
            */
            
            // load javascript async using <script> tags in browser
            var loadJs = function(url, callback) {
                head = head || document.getElementsByTagName("head")[0];
                var done = 0, script = document.createElement('script');
                
                script.type = 'text/javascript';
                script.language = 'javascript';
                script.onload = script.onreadystatechange = function( ) {
                    if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete'))
                    {
                        done = 1;
                        script.onload = script.onreadystatechange = null;
                        head.removeChild( script );
                        script = null;
                        if ( callback )  callback();
                    }
                }
                // load it
                script.src = url;
                head.appendChild( script );
            };

            var loadNext = function(id, url, callback) { 
                    if ( !root[ id ] ) 
                        loadJs( url, callback ); 
                    else
                        callback();
                },
                continueLoad = function( i ) {
                    return function() {
                        if ( i < dl )  mods[ i ] = root[ ids[ i ] ];
                        if ( ++i < dl )
                        {
                            loadNext( ids[ i ], fpaths[ i ], continueLoad( i ) );
                        }
                        else
                        {
                            _module_ = factory.apply(root, mods );
                            // allow factory just to add to existing modules without returning a new module
                            root[ name ] = _module_ || 1;
                        }
                    };
                }
            ;
            if ( dl ) 
            {
                loadNext( ids[ 0 ], fpaths[ 0 ], continueLoad( 0 ) );
            }
            else
            {
                _module_ = factory.apply(root, mods );
                // allow factory just to add to existing modules without returning a new module
                root[ name ] = _module_ || 1;
            }
        }
    }


}(  /* current root */          this, 
    /* module name */           "Classy",
    /* module dependencies */   null, 
    /* module factory */        function(  ) {

        /* custom exports object */
        var EXPORTS = {};
        
        /* main code starts here */

/**
*
*   Classy.js
*   @version: 0.7
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
    
    var CONSTRUCTOR = "constructor", PROTO= "prototype", __PROTO__ = "__proto__", __STATIC__ = "__static__",
        Str = String, Num = Number, Regex = RegExp, Arr = Array, AP = Arr[PROTO], Obj = Object, OP = Obj[PROTO], Func = Function, FP = Func[PROTO],
        slice = FP.call.bind(AP.slice), toStr = FP.call.bind(OP.toString), hasProperty = FP.call.bind(OP.hasOwnProperty), 
        propertyIsEnum = FP.call.bind(OP.propertyIsEnumerable), Keys = Obj.keys, defineProperty = Obj.defineProperty,
        
        typeOf = function( v ) { return typeof( v ); },
        type_error = function( msg ) { throw new TypeError( msg ); },
        
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperties
        // https://developer.mozilla.org/en-US/docs/Enumerability_and_ownership_of_properties
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/propertyIsEnumerable?redirectlocale=en-US&redirectslug=JavaScript%2FReference%2FGlobal_Objects%2FObject%2FpropertyIsEnumerable
        
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
            var type_of = typeOf(v), to_string = toStr(v);
            
            if ("undefined" === type_of)  return T_UNDEF;
            
            else if ("number" === type_of || v instanceof Num)  return isNaN(v) ? T_NAN : T_NUM;
            
            else if (null === v)  return T_NULL;
            
            else if (true === v || false === v)  return T_BOOL;
            
            else if (v && ("string" === type_of || v instanceof Str)) return (1 === v.length) ? T_CHAR : T_STR;
            
            else if (v && ("[object Array]" === to_string || v instanceof Arr))  return T_ARRAY;
            
            else if (v && ("[object RegExp]" === to_string || v instanceof Regex))  return T_REGEX;
            
            else if (v && (("function" === type_of && "[object Function]" === to_string) || v instanceof Func))  return T_FUNC;
            
            else if (v && "[object Object]" === to_string)  return T_OBJ;
            
            // unkown type
            return T_UNKNOWN;
        },
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
        
        
        $super = function( thisClass ) {
            var currentScope = thisClass;
            // return the function to handle the super call, handling possible recursion if needed
            return function(method /*, var args here.. */) { 
                var p, m, r;
                if ( currentScope && (p=currentScope[PROTO]) && (m=p[method]) && m.$sup )
                {
                    currentScope = currentScope.$super;
                    r = m.$sup.apply(this, slice( arguments, 1 ));
                    currentScope = thisClass;
                    return r;
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
            superClass = superClass || Obj;
            subClassProto = subClassProto || {};
            var dummyConstructor, C, __static__ = null, 
                $static = superClass.$static || null,
                superClassProto = superClass[PROTO], 
                i, l, prop, key, val, T, 
                method, supermethod, methodname
            ;
            // fix issue when constructor is missing
            if ( !hasProperty(subClassProto, CONSTRUCTOR) )
            {
                dummyConstructor = function() {};
                subClassProto[CONSTRUCTOR] = C = dummyConstructor;
            }
            else
            {
                C = subClassProto[CONSTRUCTOR];
            }
            
            if ( hasProperty(subClassProto, __STATIC__) )
            {
                // $static / __static__ props/methods and associated keys
                // __static__ = actual props/methods
                __static__ = subClassProto[__STATIC__];
                delete subClassProto[__STATIC__];
                // $static = props/methods keys
                // store "static keys" for enabling subclass inheritance/extension if needed
                $static = mergeUnique( $static || [], Keys( __static__ ) );
            }
            
            // add $super method references
            for (methodname in subClassProto)
            {
                if ( ("$super" !== methodname) && (T_FUNC === get_type((method = subClassProto[methodname]))) )
                {
                    supermethod = superClassProto[methodname];
                    if ( (T_FUNC === get_type(supermethod)) && (method !== supermethod) )
                    {
                        method.$sup = supermethod;
                    }
                    else if (method.$sup)
                    {
                        delete method.$sup;
                    }
                }
            }
            
            C[PROTO] = Alias( Create( superClassProto ), namespace, aliases );
            C[PROTO] = Merge( C[PROTO], subClassProto );

            defineProperties( C[PROTO], {
                
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
                    value: $super( C ),
                    enumerable: false,
                    writable: true,
                    configurable: true
                }
            });

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
    exports.Classy = {
        
        VERSION: "0.7",
        
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
    
}(EXPORTS);

    /* main code ends here */
    
    /* export the module "Classy" */
    return EXPORTS["Classy"];
});