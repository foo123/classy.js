var Class = require('../build/classy.js').Class, l = console.log;

var C1 = Class({
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

var C2 = Class(C1, {
    f1: function( ) {
        l('+ C2 f1');
        var r = this.$superv('f1')+1;
        l('- C2 f1');
        return r;
    },
    f2: function( ) {
        l('+ C2 f2');
        var r = this.$superv('f2')+1;
        l('- C2 f2');
        return r;
    },
    f3: function( ) {
        l('+ C2 f3');
        var r = this.$superv('f3')+1;
        l('- C2 f3');
        return r;
    }
});

var C3 = Class(C2, {
    f1: function( ) {
        l('+ C3 f1');
        var r = this.$superv('f1')+1;
        l('- C3 f1');
        return r;
    },
    f2: function( ) {
        l('+ C3 f2');
        var r = this.$superv('f2')+1;
        l('- C3 f2');
        return r;
    },
    f3: function( ) {
        l('+ C3 f3');
        var r = this.$superv('f3')+2;
        l('- C3 f3');
        return r;
    }
});

var C4 = Class(C3, {
    f1: function( ) {
        l('+ C4 f1');
        var r = this.$superv('f1')+1;
        l('- C4 f1');
        return r;
    },
    f2: function( ) {
        l('+ C4 f2');
        var r = this.$superv('f2')+1;
        l('- C4 f2');
        return r;
    },
    f3: function( ) {
        l('+ C4 f3');
        var r = this.$superv('f3')+3;
        l('- C4 f3');
        return r;
    }
});

var c = new C4();
l('Result = ' + c.f1());