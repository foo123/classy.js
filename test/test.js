!function( root ) {
    
    var isNode = ('undefined'!==typeof(global) && '[object global]'=={}.toString.call(global));
    var Classy, Class, _console, echo, assert;
    
    if ( isNode ) 
    {
        var util = require('util');
        var effect = {
            base:   ['\x1B[%dm', '\x1B[%dm'],
            red:    [31, 39],
            green:  [32, 39]
        };
        _console = { 
            log: console.log, 
            
            styleText: function(text, color) {
                return [
                    util.format(effect.base[0], effect[color][0]),
                    String(text),
                    util.format(effect.base[1], effect[color][1])
                ].join('');
            }
        };
        Classy = require('../build/classy.js');
        Class = Classy.Class;
    }
    else
    {
        var effect = {
            base:  ['<strong style="color:$1">', '</strong>'],
            red:    ['$1', '#a00'],
            green:  ['$1', '#00a']
        };
        _console = document.createElement('pre');
        _console.log = function(s) { _console.innerHTML += (s||'') + '<br />'; };
        _console.styleText = function(text, color) {
            return [
                effect.base[0].replace(effect[color][0], effect[color][1]),
                String(text),
                effect.base[1]
            ].join('');
        };
        document.body.appendChild(_console);
        Classy = window.Classy;
        Class = Classy.Class;
    }
    echo = _console.log;
    assert = function(e) { return (e) ? _console.styleText('TRUE', 'green') : _console.styleText('FALSE', 'red'); };

    
    
    var anInterface = Class({
        method1: function( ){ },
        method2: function( ){ }
    });
    
    var aParent = Class(Object, { /* extends Object by default */
        
        // extendable static props/methods (are inherited by subclasses)
        __static__: {
          aStaticProp: 2,
          aStaticMethod: function(msg) { return ('Static '+msg); }
        },
        
        // extendable static props/methods (are inherited by subclasses)
        aStaticMethod2: Classy.Method(function($super, $private, $class){
            return function(msg) { 
                return ('Static2 '+msg); 
            }
        }, Classy.STATIC),
        
        constructor: function(a, b) {
            this.a = a;
            this.b = b;
        },
        
        a: 0,
        b: 0,
        
        add: function( ) {
            return this.a + this.b;
        },
        
        sayHi: function() {
            // test recursive $super calls
            return 'parent parent: ' + this.$super('sayHi') + ', parent: aParent says Hi';
        }
    });

    var aChild = Class( { Extends: aParent, 
        // implement an interface also, 
        // optionally namespace and alias some methods (useful for naming conflicts)
        Implements:{implements: anInterface, namespace: "interface", as: {"method1": "method3"}} }, {
        
        constructor: function(a, b) {
            // call super constructor
            this.$super('constructor', a, b);
        },
        
        privMethod: Classy.Method(function($super, $private, $class){
            return function(msg){
                return 'Private ' + msg;
            }
        }, Classy.PRIVATE),
        
        parentAdd: function() {
            return this.$super('add');
        },
        
        add: function() {
            return this.$super('add');
        },
        
        sayHi: Classy.Method(function($super, $private, $class){
            return function( ){
                return 'child parent: ' + this.$super('sayHi') + ', child: aChild says Hi, ' + $private.privMethod.call(this, 'Hi');
            }
        })
    });
    
    var aParentInst = new aParent(1, 2);
    var aChildInst = new aChild(1, 2);
    
    root.aParent = aParent;
    root.aChild = aChild;
    root.aParentInst = aParentInst;
    root.aChildInst = aChildInst;
    
    echo('Test Output');
    echo('Classy.VERSION = ' + Classy.VERSION);
    echo();
    
    echo('Testing Method Inheritance:');
    echo('** the following should be all equal **');
    echo();
    echo(aParentInst.add());
    echo(aChildInst.add());
    //echo(aChildInst.parentAdd());
    echo();

    echo('Testing Method Override and Super calls recursion:');
    echo();
    
    echo(aParentInst.sayHi());
    echo(aChildInst.sayHi());
    
    echo(aParentInst.$class.aStaticMethod('aParentInst'));
    echo(aChildInst.$class.aStaticMethod('aChildInst'));
    echo(aParent.aStaticMethod('aParent'));
    echo(aChild.aStaticMethod('aChild'));
    echo(aParentInst.$class.aStaticMethod2('aParentInst'));
    echo(aChildInst.$class.aStaticMethod2('aChildInst'));
    echo(aParent.aStaticMethod2('aParent'));
    echo(aChild.aStaticMethod2('aChild'));
    
    echo('Testing Static keys inheritance:');
    echo('** the following should be same **');
    echo();
    echo(aParent.$static);
    echo(aChild.$static);
    
    echo('Testing Configuration/Enumeration of $super, $class properties:');
    echo();
    /*for (var p in aParentInst) echo(p);
    echo(aParentInst.$super.toString());*/
    echo('$super in aParentInst (using in)                  : ' + assert('$super' in aParentInst));
    echo('$super in aParentInst                             : ' + assert(aParentInst.propertyIsEnumerable('$super')));
    echo('$super in aChildInst                              : ' + assert(aChildInst.propertyIsEnumerable('$super')));
    echo('$class in aParentInst                             : ' + assert(aParentInst.propertyIsEnumerable('$class')));
    echo('$class in aChildInst                              : ' + assert(aChildInst.propertyIsEnumerable('$class')));
    echo('$super in aParent                                 : ' + assert(aParent.propertyIsEnumerable('$super')));
    echo('$super in aChild                                  : ' + assert(aChild.propertyIsEnumerable('$super')));
    echo('$static in aParent                                : ' + assert(aParent.propertyIsEnumerable('$static')));
    echo('$static in aChild                                 : ' + assert(aChild.propertyIsEnumerable('$static')));
    echo('aStaticProp in aParent                            : ' + assert(aParent.propertyIsEnumerable('aStaticProp')));
    echo('aStaticProp in aChild                             : ' + assert(aChild.propertyIsEnumerable('aStaticProp')));
    echo('constructor in aChildInst                         : ' + assert('constructor' in aChildInst));
    echo('method1 in aChildInst                             : ' + assert('method1' in aChildInst));
    echo('method3 in aChildInst                             : ' + assert('method3' in aChildInst));
    echo('method2 in aChildInst                             : ' + assert('method2' in aChildInst));
    echo('interface$constructor in aChildInst               : ' + assert('interface$constructor' in aChildInst));
    echo('interface$method2 in aChildInst                   : ' + assert('interface$method2' in aChildInst));
    echo('interface$method1 in aChildInst                   : ' + assert('interface$method1' in aChildInst));
    echo('interface$method3 in aChildInst                   : ' + assert('interface$method3' in aChildInst));
    echo('__private__ in aChildInst (using in)              : ' + assert('__private__' in aChildInst));
    echo('__private__ in aChildInst                         : ' + assert(aChildInst.propertyIsEnumerable('__private__')));
    echo('privMethod in aChildInst                          : ' + assert(aChildInst.propertyIsEnumerable('privMethod')));
    echo();
    
    // the following should be all true
    echo('Testing Prototype Chain:');
    echo();
    echo('** the following should be all true **');
    echo();
    echo('Function.prototype.__proto__ == Object.prototype  : ' + assert(Function.prototype.__proto__ == Object.prototype));
    echo('aParent.__proto__ == Function.prototype           : ' + assert(aParent.__proto__ == Function.prototype));
    echo('aChild.__proto__ == Function.prototype            : ' + assert(aChild.__proto__ == Function.prototype));
    echo('aParent.__proto__.__proto__ == Object.prototype   : ' + assert(aParent.__proto__.__proto__ == Object.prototype));
    echo('aChild.__proto__.__proto__ == Object.prototype    : ' + assert(aChild.__proto__.__proto__ == Object.prototype));
    echo();
    // this is the prototype chain
    echo('** this is the prototype chain **');
    echo();
    echo('aParent.prototype.__proto__ == Object.prototype   : ' + assert(aParent.prototype.__proto__ == Object.prototype));
    echo('aChild.prototype.__proto__ == aParent.prototype   : ' + assert(aChild.prototype.__proto__ == aParent.prototype));
    echo('aParentInst.__proto__ == aParent.prototype        : ' + assert(aParentInst.__proto__ == aParent.prototype));
    echo('aChildInst.__proto__ == aChild.prototype          : ' + assert(aChildInst.__proto__ == aChild.prototype));
    echo();
    echo('aParentInst instanceof Object                     : ' + assert(aParentInst instanceof Object));
    echo('aParentInst instanceof aParent                    : ' + assert(aParentInst instanceof aParent));
    echo('aChildInst instanceof aParent                     : ' + assert(aChildInst instanceof aParent));
    echo('aChildInst instanceof aChild                      : ' + assert(aChildInst instanceof aChild));
    echo();
}( this );