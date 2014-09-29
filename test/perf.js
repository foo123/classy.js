!function( window ) {
    
    var loader = document.getElementById('loader'),
        output = document.getElementById('output'), 
        vanillaStyle = {}, closureStyle = {},
        /*classy073 = {},*/ classy = {},
        buff = ''
    ;
    
    //Object.prototype.depth = function(){};
    
    // Vanilla
    vanillaStyle.Class1 = function( ){ };
        vanillaStyle.Class1.prototype = {
        _start:0,
        depth: function ( ) {
            return this._start;
        }
    };
    vanillaStyle.Class2 = function( ){ };
    vanillaStyle.Class2.prototype = new vanillaStyle.Class1( );
    vanillaStyle.Class2.prototype.depth = function( ) {
        return vanillaStyle.Class1.prototype.depth.call(this)+1;
    };
    vanillaStyle.Class3 = function( ){ };
    vanillaStyle.Class3.prototype = new vanillaStyle.Class2( );
    vanillaStyle.Class3.prototype.depth = function( ) {
        return vanillaStyle.Class2.prototype.depth.call(this)+1;
    };
    
    // Closure
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
    
    // Classy
    /*classy073.Class2 = Classy073.Class(vanillaStyle.Class1, {
        depth: function( ) { return this.$super('depth')+1; }
    });
    classy073.Class3 = Classy073.Class(classy073.Class2, {
        depth: function( ) { return this.$super('depth')+1; }
    });*/
    classy.Class2Super = Classy.Class(vanillaStyle.Class1, {
        depth: function( ) { return this.$super('depth')+1; }
    });
    classy.Class3Super = Classy.Class(classy.Class2Super, {
        depth: function( ) { return this.$super('depth')+1; }
    });
    classy.Class2SuperVector = Classy.Class(vanillaStyle.Class1, {
        depth: function( ) { return this.$superv('depth')+1; }
    });
    classy.Class3SuperVector = Classy.Class(classy.Class2SuperVector, {
        depth: function( ) { return this.$superv('depth')+1; }
    });
    classy.Class2SuperNFE = Classy.Class(vanillaStyle.Class1, {
        depth: function depth( ) { return depth.$super.call(this)+1; }
    });
    classy.Class3SuperNFE = Classy.Class(classy.Class2SuperNFE, {
        depth: function depth( ) { return depth.$super.call(this)+1; }
    });
    classy.Class2SuperScoped = Classy.Class(vanillaStyle.Class1, {
        depth: Classy.Method(function( $super ){
            return function( ) { return $super.depth.call(this)+1; }
        })
    });
    classy.Class3SuperScoped = Classy.Class(classy.Class2SuperScoped, {
        depth: Classy.Method(function( $super ){
            return function( ) { return $super.depth.call(this)+1; }
        })
    });
    
    var vanilla = new vanillaStyle.Class3( );
    var closure = new closureStyle.Class3( );
    //var cl073 = new classy073.Class3( );
    var clSuper = new classy.Class3Super( );
    var clSuperVector = new classy.Class3SuperVector( );
    var clSuperNFE = new classy.Class3SuperNFE( );
    var clSuperScoped = new classy.Class3SuperScoped( );

    loader.style.display = "inline-block";
    
    output.innerHTML += 'The following should all have result=2' + "\n\n";
    output.innerHTML += 'Vanilla.depth = ' + vanilla.depth( ) + "\n";
    output.innerHTML += 'Closure.depth = ' + closure.depth( ) + "\n";
    output.innerHTML += 'ClassySuper.depth = ' + clSuper.depth( ) + "\n";
    output.innerHTML += 'ClassySuperVector.depth = ' + clSuperVector.depth( ) + "\n";
    output.innerHTML += 'ClassySuperNFE.depth = ' + clSuperNFE.depth( ) + "\n";
    output.innerHTML += 'ClassySuperScoped.depth = ' + clSuperScoped.depth( ) + "\n";
    output.innerHTML += "\n\n";
    
    new Benchmark.Suite( )
        // add tests
        .add('Closure, this._super()', function( ){
            closure.depth( );
        })
        /*.add('Classy073 $super, this.$super("method")', function( ){
            cl073.depth( );
        })*/
        .add('Classy Super, this.$super("method")', function( ){
            clSuper.depth( );
        })
        .add('Classy SuperVector, this.$superv("method")', function( ){
            clSuperVector.depth( );
        })
        .add('Classy SuperNFE, method.$super.call(this)', function( ){
            clSuperNFE.depth( );
        })
        .add('Classy SuperScoped, $super.method.call(this)', function( ){
            clSuperScoped.depth( );
        })
        .add('Vanilla OOP, base', function( ){
            vanilla.depth( );
        })
        // add listeners
        .on('cycle', function(event){
            buff += String(event.target) + "\n\n";
            //console.log(String(event.target));
        })
        .on('complete', function( ){
            buff += 'Fastest is ' + this.filter('fastest').pluck('name') + "\n\n";
            loader.style.display = "none";
            output.innerHTML += buff;
            //console.log('Fastest is ' + this.filter('fastest').pluck('name'));
        })
        // run async
        .run({async:true})
    ;
        
}( window );