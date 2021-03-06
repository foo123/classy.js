var Classy = require('../build/classy.js'), l = console.log;

var C1 = Classy.Class({
    f1: function( ) {
        l('+ C1 f1');
        var r = this.f2( );
        l('- C1 f1');
        return r;
    },
    f2: function( ) {
        l('+ C1 f2');
        var r = this.f3( );
        l('- C1 f2');
        return r;
    },
    f3: function( ) {
        l('+ C1 f3');
        var r = 0;
        l('- C1 f3');
        return r;
    }
});

var C2 = Classy.Class(C1, {
    f1: function f1( ) {
        l('+ C2 f1');
        var r = f1.$super.call(this)+2;
        l('- C2 f1');
        return r;
    },
    f2: function f2( ) {
        l('+ C2 f2');
        var r = f2.$super.call(this)+2;
        l('- C2 f2');
        return r;
    },
    f3: function f3( ) {
        l('+ C2 f3');
        var r = f3.$super.call(this)+2;
        l('- C2 f3');
        return r;
    }
});

var C3 = Classy.Class(C2, {
    f1: function f1( ) {
        l('+ C3 f1');
        var r = f1.$super.call(this)+3;
        l('- C3 f1');
        return r;
    },
    f2: function f2( ) {
        l('+ C3 f2');
        var r = f2.$super.call(this)+3;
        l('- C3 f2');
        return r;
    },
    f3: function f3( ) {
        l('+ C3 f3');
        var r = f3.$super.call(this)+3;
        l('- C3 f3');
        return r;
    }
});

var C4 = Classy.Class(C3, {
    f1: function f1( ) {
        l('+ C4 f1');
        var r = f1.$super.call(this)+4;
        l('- C4 f1');
        return r;
    },
    f2: function f2( ) {
        l('+ C4 f2');
        var r = f2.$super.call(this)+4;
        l('- C4 f2');
        return r;
    },
    f3: function f3( ) {
        l('+ C4 f3');
        var r = f3.$super.call(this)+4;
        l('- C4 f3');
        return r;
    }
});

var c = new C4();
l('Result = ' + c.f1());