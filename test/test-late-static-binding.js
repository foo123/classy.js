var Classy = /*window.Classy*/require('../build/classy.js'), l = console.log;

var C1 = Classy.Class({
    __static__: {
        print: Classy.Method(function($super, $priv, $class){
            return function() {
                l($class.id + ' (static)');
            }
        }, Classy.STATIC|Classy.LATE)
    },
    
    print: function( ) {
        l(this.$class.id + ' (dynamic)');
    }
});
C1.id = "C1";

var C2 = Classy.Class(C1, {
});
C2.id = "C2";

var C3 = Classy.Class(C1, {
});
C3.id = "C3";

var C4 = Classy.Class(C2, {
});
C4.id = "C4";

/*l(C1.print);
l(C2.print);
l(C3.print);
l(C4.print);
*/

C1.print();
new C1().print();
C2.print();
new C2().print();
C3.print();
new C3().print();
C4.print();
new C4().print();
