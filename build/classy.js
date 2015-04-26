/**
*
*   Classy.js
*   @version: 0.9.3
*   @built on 2015-04-26 14:47:30
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
*   @version: 0.9.3
*   @built on 2015-04-26 14:47:30
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
        SUPER = "$super", STATIC = "$static", LATESTATIC = "$latestatic", CLASS = "$class", METHOD = "$method",
        PUBLIC_PROP = 2, PRIVATE_PROP = 4, STATIC_PROP = 8, LATE_BINDING = 256,
        Obj = Object, OP = Obj[PROTO], Func = Function, FP = Func[PROTO], 
        Str = String, Num = Number, Regex = RegExp, Arr = Array, 
        toString = OP.toString, /*toStr = FP.call.bind(toString),*/ stringifyFunc = FP.call.bind(FP.toString),
        /*AP = Arr[PROTO], slice = FP.call.bind(AP.slice),*/ 
        /*hasProperty = FP.call.bind(OP.hasOwnProperty),*/ HAS = 'hasOwnProperty', 
        /*propertyIsEnum = FP.call.bind(OP.propertyIsEnumerable),*/ IS_ENUM = 'propertyIsEnumerable',
        Keys = Obj.keys, defineProperty = Obj.defineProperty,
        
        //is_instance = function(o, t) { return o instanceof t; },
        typeOf = function( v ) { return typeof( v ); },
        type_error = function( msg ) { throw new TypeError( msg ); },
        
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
        TO_STRING = {
            "[object Array]"    : T_ARRAY,
            "[object RegExp]"   : T_REGEX,
            "[object Number]"   : T_NUM,
            "[object String]"   : T_STR,
            "[object Function]" : T_FUNC,
            "[object Object]"   : T_OBJ
        },
        get_type = function( v ) {
            var /*type_of,*/ to_string;
            
            if (null === v)  return T_NULL;
            else if (true === v || false === v)  return T_BOOL;
            else if (undef === v /*|| "undefined" === type_of*/)  return T_UNDEF;
            
            //type_of = typeOf(v);
            to_string = toString.call( v );
            //to_string = TO_STRING[HAS](to_string) ? TO_STRING[to_string] : T_UNKNOWN;
            to_string = TO_STRING[to_string] || T_UNKNOWN;
            
            //if (undef === v /*|| "undefined" === type_of*/)  return T_UNDEF;
            if (T_NUM === to_string || v instanceof Num)  return isNaN(v) ? T_NAN : T_NUM;
            else if (T_STR === to_string || v instanceof Str) return (1 === v.length) ? T_CHAR : T_STR;
            else if (T_ARRAY === to_string || v instanceof Arr)  return T_ARRAY;
            else if (T_REGEX === to_string || v instanceof Regex)  return T_REGEX;
            else if (T_FUNC === to_string || v instanceof Func)  return T_FUNC;
            else if (T_OBJ === to_string)  return T_OBJ;
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
            
            if ( desc[HAS]("enumerable") )   d.enumerable = !!obj.enumerable;
            
            if ( desc[HAS]("configurable") ) d.configurable = !!obj.configurable;
            
            if ( desc[HAS]("value") )    d.value = obj.value;
            
            if ( desc[HAS]("writable") )  d.writable = !!desc.writable;
            
            if ( desc[HAS]("get") ) 
            {
                var g = desc.get;

                if ( T_FUNC !== get_type(g) && g !== "undefined") type_error("bad get");
                d.get = g;
            }
            
            if ( desc[HAS]("set") ) 
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
        
        dummySuper = function( ){ },
        
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
                        if ( o2[HAS](p) && o2[IS_ENUM](p) ) 
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
                        if ( o[HAS](p) )
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
                }
                else
                {
                    for (p in o)
                    {
                        if ( o[HAS](p) )
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
            }
            else
            {
                ao = o;
            }
            return ao;
        },
        
        // this.$superv('method', [a, b]);
        // this.$super('method', a, b);
        $SUPER = function( superClass ) {
            // return the function to handle the super call, handling possible recursion if needed
            var _super_super = superClass[SUPER] || dummySuper, 
                _super_superv = superClass[SUPER+'v'] || dummySuper, 
                called = null;
                return [
                // $super
                /*, var args here.. */
                /* use up to 10 arguments for speed, use $superv for arbitrary arguments */
                function( method, a0, a1, a2, a3, a4, a5, a6, a7, a8, a9 ) { 
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
                },
                // $superv
                function( method, args ) { 
                    var r, m;
                    if ( called === method )
                    {
                        // no recursion faster instead of recursing on this.$super and walking the prototype
                        r = _super_superv.call(this, method, args);
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
            ];
        },
        
        /**[DOC_MARKDOWN]
        * __Method__: *Method*
        *
        * ```javascript
        * aMethod = Classy.Method(Function methodFactory [, FLAG qualifier=Classy.PUBLIC]);
        * ```
        *
        * Return a *method* accessed as qualifier (PUBLIC/STATIC/LATE/PRIVATE),
        * where direct contextual information (e.g faster "$super" reference) can be added transparently (as a closure)
        *
        * example:
        * ```javascript
        * aClass = Classy.Class(anotherClass, {
        *     
        *     // accessible as "this.aMethod"
        *     aMethod: Classy.Method(function($super, $private, $class){
        *           return function( a, b ) { 
        *               // $super is the direct reference to the superclass prototype
        *               // $private is the direct reference to the private methods of this class (if any)
        *               // $class is the direct reference to this class itself, NOT the prototype (same as this.$class)
        *               $super.aMethod.call(this, a, b);
        *               // ...
        *           }
        *     }, Classy.PUBLIC ), // optional method qualifier, default is Classy.PUBLIC
        *
        *     // accessible as "aClass.aStaticMethod" (extendable)
        *     aStaticMethod: Classy.Method(function($super, $private, $class){
        *           // $super is the direct reference to the superclass itself (NOT the prototype)
        *           // $private is the direct reference to the private methods of this class (if any)
        *           // $class is the direct reference to this class itself (NOT the prototype)
        *           return function( a, b ){ 
        *               $super.aStaticMethod(a, b);
        *               // ...
        *           }
        *     }, Classy.STATIC )
        *
        *     // accessible as "aClass.aLateStaticBindMethod" (extendable)
        *     // classy implements "LATE STATIC BINDING" for static methods (with Classy.LATE|Classy.STATIC flags)
        *     aLateStaticBindMethod: Classy.Method(function($super, $private, $class){
        *           // $super is the direct reference to the superclass itself (NOT the prototype)
        *           // $private is the direct reference to the private methods of this class (if any)
        *           // $class is the direct reference to this class itself (NOT the prototype)
        *           return function( a, b ){ 
        *               console.log($class.name); // this should be dynamicaly binded for each subclass
        *               // ...
        *           }
        *     }, Classy.LATE|Classy.STATIC )
        * });
        * ```
        *
        [/DOC_MARKDOWN]**/
        Method = function( methodFactory, qualifier ) {
            if ( !(this instanceof Method) ) return new Method( methodFactory, qualifier );
            this.factory = methodFactory;
            this.qualifier = (T_NUM === get_type(qualifier) ? qualifier : 0) | PUBLIC_PROP;
        },
        
        Prop = function( prop, qualifier ) {
            if ( !(this instanceof Prop) ) return new Prop( prop, qualifier );
            this.prop = prop;
            this.qualifier = (T_NUM === get_type(qualifier) ? qualifier : 0) | PUBLIC_PROP;
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
                $latestatic = superClass[LATESTATIC] || {},
                superClassProto = superClass[PROTO], 
                C, __static__ = null, __latestatic__ = Merge({}, $latestatic), 
                currect$static = null,
                __private__ = { }, $super,
                i, l, prop, key, val, T, mname, method
            ;
            
            // fix issue when constructor is missing
            if ( !subClassProto[HAS](CONSTRUCTOR) ) subClassProto[CONSTRUCTOR] = function( ){ };
            
            C = subClassProto[CONSTRUCTOR];
            
            if ( subClassProto[HAS](__PRIVATE__) )
            {
                __private__ = subClassProto[__PRIVATE__] || { };
                delete subClassProto[__PRIVATE__];
            }
            
            if ( subClassProto[HAS](__STATIC__) )
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
                if ( subClassProto[HAS](mname) )
                {
                    method = subClassProto[ mname ];
                    if ( method instanceof Method )
                    {
                        if ( STATIC_PROP & method.qualifier )
                        {
                            if ( LATE_BINDING & method.qualifier )
                            {
                                (__static__=__static__||{})[ mname ] = mname;
                                __latestatic__[ mname ] = method;
                                (currect$static=currect$static||[]).push( mname );
                            }
                            else
                            {
                                (__static__=__static__||{})[ mname ] = method.factory( superClass, __private__, C );
                                (currect$static=currect$static||[]).push( mname );
                            }
                            delete subClassProto[mname];
                            continue;
                        }
                        else if ( PRIVATE_PROP & method.qualifier )
                        {
                            __private__[ mname ] = method;
                            delete subClassProto[mname];
                            continue;
                        }
                        method = subClassProto[mname] = method.factory( superClassProto, __private__, C );
                    }
                    if ( T_FUNC === get_type(method) )
                    {
                        // enable NFE-style super functionality as well
                        method[SUPER] = superClassProto[mname] || dummySuper;
                    }
                }
            }
            for (mname in __private__)
            {
                if ( __private__[HAS](mname) )
                {
                    method = __private__[ mname ];
                    if ( method instanceof Method )
                    {
                        method = __private__[mname] = method.factory( superClassProto, __private__, C );
                    }
                    if ( !(T_FUNC === get_type(method)) )
                    {
                        delete __private__[mname];
                    }
                }
            }
            
            C[PROTO] = Alias( Create( superClassProto ), namespace, aliases );
            C[PROTO] = Merge( C[PROTO], subClassProto );
            $super = $SUPER( superClassProto );
            prop = { };
            prop[CLASS] = prop[CONSTRUCTOR] = {
                value: C,
                enumerable: false,
                writable: true,
                configurable: true
            };
            prop[SUPER] = {
                value: $super[0],
                enumerable: false,
                writable: true,
                configurable: true
            };
            prop[SUPER+'v'] = {
                value: $super[1],
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
                    key = $static[ i ]; val = null;
                    if ( __static__ && undef !== __static__[ key ] )
                    {
                        // implememnt a version of Late Static Binding here
                        // to bind the $class dynamicaly on each class extension
                        // similar to PHP self:: or static:: late static binding
                        if ( __latestatic__[HAS]( key ) )
                        {
                            //val = __latestatic__[key].factory( superClass, __private__, C );
                            continue;
                        }
                        else
                        {
                            val = __static__[ key ];
                        }
                        // add direct super reference as well
                        if ( T_FUNC === get_type(val) )
                            val[SUPER] = superClass[ key ] || dummySuper;
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
            for ( key in __latestatic__ )
            {
                // implememnt a version of Late Static Binding here
                // to bind the $class dynamicaly on each class extension
                // similar to PHP self:: or static:: late static binding
                if ( __latestatic__[HAS]( key ) )
                {
                    val = __latestatic__[key].factory( superClass, __private__, C );
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
            prop[LATESTATIC] = {
                value: __latestatic__,
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
        * __Method__: *Dispose*
        *
        * ```javascript
        * Classy.Dispose(Function aClassyClass);
        * ```
        *
        * Dispose a Class definition and all references added by Classy.js
        *
        [/DOC_MARKDOWN]**/
        Dispose = function( aClass ) {
            var i, l, o, k;
            if ( !(T_FUNC === get_type(aClass)) ) return;
            if ( SUPER in aClass )  aClass[SUPER] = undef;
            if ( CLASS in aClass ) aClass[CLASS] = undef;
            if ( LATESTATIC in aClass ) aClass[LATESTATIC] = undef;
            if ( STATIC in aClass )
            {
                o = aClass[STATIC];
                for (i=0,l=o.length; i<l; i++)
                {
                    k = o[i];
                    if ( k in aClass )
                    {
                        if ( T_FUNC === get_type(aClass[k]) && aClass[k][SUPER] )
                            aClass[k][SUPER] = undef;
                        aClass[k] = undef;
                    }
                }
                aClass[STATIC] = undef;
            }
            o = aClass[PROTO];
            for (k in o)
            {
                if ( T_FUNC === get_type(o[k]) )
                {
                    if ( o[k][SUPER] ) o[k][SUPER] = undef;
                    o[k] = undef;
                }
            }
            o[SUPER] = undef;
            o[SUPER+'v'] = undef;
        },
        
        /**[DOC_MARKDOWN]
        * __Method__: *Class*
        *
        * ```javascript
        * aClass = Classy.Class( );
        * // or
        * aStaticClass = Classy.Class(FLAG Classy.STATIC, Object staticdefs={});
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
        *     aPrivateMethod2: Classy.Method(function($super, $private, $class){
        *           return function(msg) { 
        *               // access other private methods as well
        *               $private.aPrivateMethod( msg );
        *           }
        *     }, Classy.PRIVATE),
        *     
        *     // extendable static props/methods (are inherited by subclasses)
        *     __static__: {
        *       aStaticProp: 2,
        *       aStaticMethod: function(msg) { console.log(msg); }
        *     },
        *     // alternative way to define static methods/props (extendable)
        *     // classy implements "LATE STATIC BINDING" for static methods (with Classy.STATIC|Classy.LATE flags)
        *     aStaticMethod2: Classy.Method(function($super, $private, $class){
        *           return function(msg) { 
        *               console.log(msg); 
        *           }
        *     }, Classy.STATIC|Classy.LATE),
        *     
        *     // class constructor
        *     constructor: function(a, b) {
        *         // call super constructor
        *         this.$super('constructor', a, b);
        *         // call super vector (args) constructor
        *         //this.$superv('constructor', [a, b]);
        *     },
        *     
        *     // class method factory (wrap around a Classy.Method to have access to $private and $super direct references)
        *     sayHi: Classy.Method(function($super, $private, $class){
        *           return function( ){
        *               // call a private method here
        *               $private.aPrivateMethod.call(this, 'Hi');
        *               $private.aPrivateMethod2('Hi2');
        *               $super.sayHi.call(this, 'Hi3');
        *               return 'Hi';
        *           }
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
        * __Three Ways to make Super Calls__
        *
        * Classy.js provides three ways to make a super call to the same method of a super class, from inside a method of a subclass (see below):
        *
        * 1. __Using $super/$superv builtin methods:__
        *
        * ```javascript
        *   var aSubClass = Classy.Class( aSuperClass, {
        *       constructor: function( a, b ) {
        *           // minimum hassle, less verbose, more abstract, average performance (depends on application)
        *           this.$super("constructor", a, b);
        *       }
        *   });
        *
        * ```
        *
        * 2. __Using NFE-style super calls (Named-Function Expression):__
        *
        * ```javascript
        *   var aSubClass = Classy.Class( aSuperClass, {
        *       constructor: function constr( a, b ) {
        *           // lot faster performance, less verbose, more hardcoded
        *           // Classy will add the $super reference for each method as needed
        *           constr.$super.call(this, a, b);
        *       }
        *   });
        *
        * ```
        *
        * 3. __Using Classy.Method method-factory wrapper:__
        *
        * ```javascript
        *   var aSubClass = Classy.Class( aSuperClass, {
        *       constructor: Classy.Method(function($super, $private, $class) {
        *           return function( a, b ) {
        *               // lot faster performance, more verbose, more abstract, 
        *               // have direct access to $super/$private/$class references inside the method itself
        *               $super.constructor.call(this, a, b);
        *           }
        *       })
        *   });
        *
        * ```
        *
        * __NOTE__ One can use a mix of these super schemes in any given class, however due to the different way these are implemented and synchronised, the scheme for super calls in the same methods along the class chain should be the same, else the $super calls will not have correct synchronisation resulting in wrong results.
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
                    _qualifier = { 'Extends': args[0] };
                else if ( T_OBJ === _qualifier )
                    _qualifier = args[0];
                else
                    _qualifier = { 'Extends': Obj };
                
                var _proto = args[1] || {},
                    _protomix = {},
                    _extends = _qualifier[HAS]('Extends') ? _qualifier['Extends'] : (_qualifier[HAS]('extends') ? _qualifier['extends'] : Obj),
                    _implements = _qualifier[HAS]('Implements') ? _qualifier['Implements'] : (_qualifier[HAS]('implements') ? _qualifier['implements'] : null),
                    _mixin = _qualifier[HAS]('Mixin') ? _qualifier['Mixin'] : (_qualifier[HAS]('mixin') ? _qualifier['mixin'] : null),
                    _protoalias = null,
                    i, l
                ;
                
                // make them arrays, if not
                _implements = _implements ? [].concat(_implements) : null;
                _mixin = _mixin ? [].concat(_mixin) : null;
                
                if ( _mixin )
                {
                    for (i=0, l=_mixin.length; i<l; i++)
                    {
                        if ( T_OBJ === get_type( _mixin[i] ) )
                        {
                            if ( _mixin[i][HAS]('mixin') && _mixin[i].mixin && _mixin[i].mixin[PROTO] )
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
                            if ( _implements[i][HAS]('implements') && _implements[i]['implements'] && _implements[i]['implements'][PROTO] )
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
        
        VERSION: "0.9.3",
        
        PUBLIC: PUBLIC_PROP, STATIC: STATIC_PROP, LATE: LATE_BINDING, PRIVATE: PRIVATE_PROP,
        
        Type: get_type,
        
        Create: Create, Merge: Merge, Alias: Alias,
        
        Implements: Implements, Mixin: Mixin,
        
        Extends: Extends, Dispose: Dispose,
        
        Method: Method, Prop: Prop,
        
        // main method
        Class: Class
    };
    
}(exports);    
    /* main code ends here */
    /* export the module */
    return exports["Classy"];
});