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
    
    var classy073 = {}, classy = {};
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
    classy.Class1 = Classy.Class({
        constructor: function( ){  },
        _start:0,
        depth: function( ) { return this._start; }
    });
    classy.Class2 = Classy.Class(classy.Class1, {
        depth: function( ) { return this.$super('depth')+1; }
    });
    classy.Class3 = Classy.Class(classy.Class2, {
        depth: function( ) { return this.$super('depth')+1; }
    });
    classy.Class2V = Classy.Class(classy.Class1, {
        depth: function( ) { return this.$superv('depth')+1; }
    });
    classy.Class3V = Classy.Class(classy.Class2V, {
        depth: function( ) { return this.$superv('depth')+1; }
    });
    classy.Class2NFE = Classy.Class(classy.Class1, {
        depth: function( ) { return $method.$super.call(this)+1; }
    });
    classy.Class3NFE = Classy.Class(classy.Class2NFE, {
        depth: function( ) { return $method.$super.call(this)+1; }
    });
    
    var vanilla = new vanillaStyle.Class3();
    var closure = new closureStyle.Class3();
    var cl073 = new classy073.Class3();
    var cl = new classy.Class3();
    var clV = new classy.Class3V();
    var clNFE = new classy.Class3NFE();

    /*for (var i=0; i<3; i++) 
    {
        console.log([cl073.depth(), cl.depth(), clV.depth(), clNFE.depth()]);
    }*/
    
    loader.style.display = "inline-block";
    new Benchmark.Suite( )
        // add tests
        .add('Classy073 this.$super("method"), recursion', function() {
            cl073.depth( );
        })
        .add('Classy this.$super("method"), NO recursion', function() {
            cl.depth( );
        })
        .add('Classy this.$superv("method"), with args', function() {
            clV.depth( );
        })
        .add('Classy $method.$super.call(this), NFE', function() {
            clNFE.depth( );
        })
        .add('closure (Resig)', function() {
            closure.depth( );
        })
        .add('vanilla BASE', function() {
            vanilla.depth( );
        })
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