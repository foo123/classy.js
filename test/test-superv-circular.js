var Class = require('../build/classy.js').Class;

var C1 = Class({
    f1: function( ) {
        console.log('+ C1 f1');
        var r = this.f2( );
        console.log('- C1 f1');
        return r;
    },
    f2: function( ) {
        console.log('+ C1 f2');
        var r = this.f3( );
        console.log('- C1 f2');
        return r;
    },
    f3: function( ) {
        console.log('+ C1 f3');
        var r = 0;
        console.log('- C1 f3');
        return r;
    }
});

var C2 = Class(C1, {
    f1: function( ) {
        console.log('+ C2 f1');
        var r = this.$superv('f1')+2;
        console.log('- C2 f1');
        return r;
    },
    f2: function( ) {
        console.log('+ C2 f2');
        var r = this.$superv('f2')+2;
        console.log('- C2 f2');
        return r;
    },
    f3: function( ) {
        console.log('+ C2 f3');
        var r = this.$superv('f3')+2;
        console.log('- C2 f3');
        return r;
    }
});

var C3 = Class(C2, {
    f1: function( ) {
        console.log('+ C3 f1');
        var r = this.$superv('f1')+3;
        console.log('- C3 f1');
        return r;
    },
    f2: function( ) {
        console.log('+ C3 f2');
        var r = this.$superv('f2')+3;
        console.log('- C3 f2');
        return r;
    },
    f3: function( ) {
        console.log('+ C3 f3');
        var r = this.$superv('f3')+3;
        console.log('- C3 f3');
        return r;
    }
});

var C4 = Class(C3, {
    f1: function( ) {
        console.log('+ C4 f1');
        var r = this.$superv('f1')+4;
        console.log('- C4 f1');
        return r;
    },
    f2: function( ) {
        console.log('+ C4 f2');
        var r = this.$superv('f2')+4;
        console.log('- C4 f2');
        return r;
    },
    f3: function( ) {
        console.log('+ C4 f3');
        var r = this.$superv('f3')+4;
        console.log('- C4 f3');
        return r;
    }
});

var c = new C4();
console.log('Result = ' + c.f1());