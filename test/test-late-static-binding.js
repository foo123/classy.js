var Classy = /*window.Classy*/require('../build/classy.js'), l = console.log;

var C1 = Classy.Class({
    fs: Classy.Method(function($super, $priv, $class){
        return function() {
            l($class.id + ' (static)');
        }
    }, Classy.STATIC|Classy.LATE),
    
    fd: function( ) {
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

/*l(C1.fs);
l(C2.fs);
l(C3.fs);
l(C4.fs);
*/

C1.fs();
new C1().fd();
C2.fs();
new C2().fd();
C3.fs();
new C3().fd();
C4.fs();
new C4().fd();
