var Classy074 = require('../build/classy.js');
var classyStyle073 = {}, classyStyle074 = {};
/*
classyStyle073.Class1 = Classy073.Class({
    constructor: function( ){ 
    },
    _start:0,
    depth: function( ) {
        return this._start;
    }
});
classyStyle073.Class2 = Classy073.Class(classyStyle073.Class1, {
    depth: function( ) {
        return this.$super('depth')+1;
    }
});
classyStyle073.Class3 = Classy073.Class(classyStyle073.Class2, {
    depth: function( ) {
        return this.$super('depth')+1;
    }
});
*/
classyStyle074.Class1 = Classy074.Class({
    constructor: function( ){ 
    },
    _start:0,
    depth: function( ) {
        return this._start;
    }
});
classyStyle074.Class2 = Classy074.Class(classyStyle074.Class1, {
    depth: function( ) {
        return this.$super('depth')+1;
    }
});
classyStyle074.Class3 = Classy074.Class(classyStyle074.Class2, {
    depth: function( ) {
        return this.$super('depth')+1;
    }
});

var classy = new classyStyle074.Class3();

for (var i=0; i<10; i++) console.log(classy.depth());