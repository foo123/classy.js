!function( window ) {
    
    var loader = document.getElementById('loader'),
        output = document.getElementById('output'), 
        buff = ''
    ;
    
    Object.prototype.depth = function(){};
    
    var vanillaStyle = {};
    vanillaStyle.Class1 = function( ){ };
        vanillaStyle.Class1.prototype = {
        _start:0,
        depth: function ( ) {
            return this._start;
        }
    };

    vanillaStyle.Class2 = function( ){ };
    vanillaStyle.Class2.prototype = new vanillaStyle.Class1( );
    vanillaStyle.Class2.depth = function( ) {
        return vanillaStyle.Class1.prototype.depth.call(this)+1;
    };

    vanillaStyle.Class3 = function( ){ };
    vanillaStyle.Class3.prototype = new vanillaStyle.Class2( );
    vanillaStyle.Class3.prototype.depth = function( ) {
        return vanillaStyle.Class2.prototype.depth.call(this)+1;
    };
    
    var closureStyle = {};
    closureStyle.Class3 = Class.extend({
        _start: 0,
        depth: function (){
            return this._start;
        }
    }).extend({
            depth: function (){
                return this._super()+1;
            }
        }).extend({
            depth: function(){
                return this._super() + 1;
            }
        });
    
    var classy073 = {}, classy074 = {};
    classy073.Class1 = Classy073.Class({
        constructor: function( ){ },
        _start:0,
        depth: function( ) { return this._start; }
    });
    classy073.Class2 = Classy073.Class(classy073.Class1, {
        depth: function( ) { return this.$super('depth')+1; }
    });
    classy073.Class3 = Classy073.Class(classy073.Class2, {
        depth: function( ) { return this.$super('depth')+1; }
    });
    classy074.Class1 = Classy074.Class({
        constructor: function( ){  },
        _start:0,
        depth: function( ) { return this._start; }
    });
    classy074.Class2 = Classy074.Class(classy074.Class1, {
        depth: function( ) { return this.$super('depth')+1; }
    });
    classy074.Class3 = Classy074.Class(classy074.Class2, {
        depth: function( ) { return this.$super('depth')+1; }
    });
    /*classy074.Class2Sup = Classy074.Class(classy074.Class1, {
        depth: function( ) { return this.$sup.$depth.call(this)+1; }
    });
    classy074.Class3Sup = Classy074.Class(classy074.Class2Sup, {
        depth: function( ) { return this.$sup.$depth.call(this)+1; }
    });
    classy074.Class2Sup2 = Classy074.Class(classy074.Class1, {
        depth: function( ) { return this.depth.$super.call(this)+1; }
    });
    classy074.Class3Sup2 = Classy074.Class(classy074.Class2Sup2, {
        depth: function( ) { return this.depth.$super.call(this)+1; }
    });*/
    classy074.Class2V = Classy074.Class(classy074.Class1, {
        depth: function( ) { return this.$superv('depth')+1; }
    });
    classy074.Class3V = Classy074.Class(classy074.Class2V, {
        depth: function( ) { return this.$superv('depth')+1; }
    });
    
    var vanilla = new vanillaStyle.Class3();
    var closure = new closureStyle.Class3();
    var cl073 = new classy073.Class3();
    var cl074 = new classy074.Class3();
    var cl074V = new classy074.Class3V();
    //var cl074Sup = new classy074.Class3Sup();
    //var cl074Sup2 = new classy074.Class3Sup2();

    /*for (var i=0; i<5; i++) 
    {
        console.log([cl073.depth(), cl074.depth(), cl074Sup.depth(), cl074Sup2.depth()]);
    }*/
    /*for (var i=0; i<5; i++) 
    {
        console.log([closure.depth(), cl073.depth(), cl074.depth(), cl074V.depth()]);
    }
    return;*/
    
    loader.style.display = "inline-block";
    new Benchmark.Suite( )
        // add tests
        .add('Classy073 this.$super("method"), recursion', function() {
            cl073.depth( );
        })
        .add('Classy074 this.$super("method"), NO recursion', function() {
            cl074.depth( );
        })
        .add('Classy074 this.$superv("method"), with args', function() {
            cl074V.depth( );
        })
        .add('closure (Resig)', function() {
            closure.depth( );
        })
        .add('vanilla BASE', function() {
            vanilla.depth( );
        })
        /*.add('Classy074 this.$sup.$method.call(this)', function() {
            cl074Sup.depth( );
        })
        .add('Classy074 this.method.$super.call(this)', function() {
            cl074Sup2.depth( );
        })*/
        // add listeners
        .on('cycle', function(event) {
            buff += String(event.target) + "\n\n";
            //console.log(String(event.target));
        })
        .on('complete', function() {
            buff += 'Fastest is ' + this.filter('fastest').pluck('name') + "\n\n";
            loader.style.display = "none";
            output.innerHTML = buff;
            //console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        })
        // run async
        .run({async:true})
    ;
        
}( window );