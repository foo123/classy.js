/** 
*   sweet.js macros for classy.js
*   adapted from sweet.js docs
*   https://github.com/mozilla/sweet.js/issues/169
*   https://github.com/mozilla/sweet.js/issues/278
**/

let __TO_STR__ = macro 
{
    case { _ $tok } => { return [makeValue(unwrapSyntax(#{ $tok }), #{ $tok })]; }
}

// DEFAULT_PARAMS_ initializes function/method parameters to given values
macro DEFAULT_PARAMS_
{
    case { $default #$numargs:lit# $param:ident = $value:expr , $rest ... } => { 
        var numargs = unwrapSyntax(#{ $numargs });
        letstx $numargsNext = [makeValue(parseInt(numargs, 10)+1, #{$default})];
        return #{
            if ($numargsNext > arguments.length) $param = $value;
            DEFAULT_PARAMS_ #$numargsNext# $rest ... 
        }
    }
    
    case { _ #$numargs:lit# $param:ident = $value:expr $rest ... } => { 
        var numargs = unwrapSyntax(#{ $numargs });
        letstx $numargsNext = [makeValue(parseInt(numargs, 10)+1, #{$default})];
        return #{
            if ($numargsNext > arguments.length) $param = $value;
            $rest ... 
        }
    }
    
    case { $default #$numargs:lit# $param:ident , $rest ... } => { 
        var numargs = unwrapSyntax(#{ $numargs });
        letstx $numargsNext = [makeValue(parseInt(numargs, 10)+1, #{$default})];
        return #{
            DEFAULT_PARAMS_ #$numargsNext# $rest ...
        }
    }
    
    case { _ #$numargs:lit# $[...]$param:ident $rest ... } => { 
        return #{
            var $param = Array.prototype.slice.call(arguments, $numargs);
            $rest ...
        }
    }
    
    // rest ...
    case { _ #$numargs:lit# $rest ... } => { 
        return #{
            $rest ...
        }
    }
    
    case { _ $rest ... } => { 
        return #{
            $rest ...
        }
    }
}

// WITH_DEFAULTS_ (adapted from https://github.com/jlongster/es6-macros)
macro WITH_DEFAULTS_ {
    rule { ($args ...) [[ ]] $body $rest ... } => {
        ($args ...) $body $rest ...
    }
    
    rule { [[$args ...]] {macro $macro $macrobody $body ...} $rest ... } => {
        WITH_DEFAULTS_ ( ) [[$args ...]] {macro $macro $macrobody DEFAULT_PARAMS_ #0# $args ... $body ...} $rest ...
    }
    
    rule { [[$args ...]] {$body ...} $rest ... } => {
        WITH_DEFAULTS_ ( ) [[$args ...]] {DEFAULT_PARAMS_ #0# $args ... $body ...} $rest ...
    }
    
    rule { ($args ...) [[$param:ident = $val:expr $resta ...]] $body $rest ... } => {
        WITH_DEFAULTS_ ($args ... $param) [[$resta ...]] $body $rest ...
    }

    rule { ($args ...) [[$param:ident $resta ...]] $body $rest ... } => {
        WITH_DEFAULTS_ ($args ... $param) [[$resta ...]] $body $rest ...
    }

    rule { ($args ...) [[, $[...]$param:ident $resta ...]] $body $rest ... } => {
        WITH_DEFAULTS_ ($args ...) [[$resta ...]] $body $rest ...
    }

    rule { ($args ...) [[, $resta ...]] $body $rest ... } => {
        WITH_DEFAULTS_ ($args ... ,) [[$resta ...]] $body $rest ...
    }

    rule { $rest ... } => {
        $rest ...
    }
}

// PARSE_STATIC_DEFS_ parses the static class method/properties definitions
macro PARSE_STATIC_DEFS_ 
{
    // static method definition
    case { _ $method:ident ( $args ... ) { $body ... } $rest ... } => { 
        
        return #{ 
            $method: function WITH_DEFAULTS_ [[ $args ... ]] {
                $body ...
            }, 
            PARSE_STATIC_DEFS_ $rest ... 
        }
    }

    // static property definition no initial value (null by default)
    case { _ $prop:ident ; $rest ... } => { 
        return #{ 
            $prop: null, 
            PARSE_STATIC_DEFS_ $rest ... 
        }
    }

    // static property definition with initial value
    case { _ $prop:ident = $val:expr ; $rest ... } => { 
        return #{ 
            $prop: $val, 
            PARSE_STATIC_DEFS_ $rest ... 
        }
    }

    // rest ...
    case { _ $rest ... } => { 
        return #{ $rest ... }
    }
}

// PARSE_CLASS_DEFS_ parses the class method/property definitions recursively
macro PARSE_CLASS_DEFS_ 
{
    // class method definition
    case { _ $method:ident ( $args ... ) { $body ... } $rest ... __static__ $(:) { $static ... } } => { 
        
        // create custom "super" macro, related to current method name
        var __super__ = [makeIdent("super", #{ $method })];
        
        return withSyntax($__super__ = __super__) #{ 
            $method: function WITH_DEFAULTS_ [[ $args ... ]] {
                
                // parse current method-related super calls with custom macro
                macro $__super__ {
                    // same super method no args
                    rule { ( )  } => {
                        this.$superv(__TO_STR__ $method)
                    }
                    
                    // same super method with args
                    rule { ( $sargs $[...] ) } => {
                        this.$superv(__TO_STR__ $method, [$sargs $[...]])
                    }
                    
                    // another super method no args
                    rule { . $supermethod:ident ( ) } => { 
                        this.$superv(__TO_STR__ $supermethod)
                    }

                    // another super method with args
                    rule { . $supermethod:ident ( $sargs $[...] ) } => { 
                        this.$superv(__TO_STR__ $supermethod, [$sargs $[...]] )
                    }
                    
                    // rest ...
                    rule { $resta $[...] } => { 
                        $resta $[...]
                    }
                }  $body ...
            }, 
            PARSE_CLASS_DEFS_ $rest ... __static__:{ $static ... }
        }
    }

    // class property definition no initial value (null by default)
    case { _ $prop:ident ; $rest ... __static__ $(:) { $static ... } } => { 
        return #{
            $prop: null, 
            PARSE_CLASS_DEFS_ $rest ... __static__:{ $static ... }
        }
    }

    // class property definition with initial value
    case { _ $prop:ident = $val:expr ; $rest ... __static__ $(:) { $static ... } } => { 
        return #{
            $prop: $val, 
            PARSE_CLASS_DEFS_ $rest ... __static__:{ $static ... }
        }
    }

    // static method definition
    case { _ static $method:ident ( $args ... ) { $body ... } $rest ... __static__ $(:) { $static ... } } => { 
        return #{
            PARSE_CLASS_DEFS_ $rest ... __static__:{ $static ... $method ( $args ... ) { $body ... } }
        }
    }

    // static property definition no initial value
    case { _ static $prop:ident ; $rest ... __static__ $(:) { $static ... } } => { 
        return #{
            PARSE_CLASS_DEFS_ $rest ... __static__:{ $static ...  $prop ; }
        }
    }

    // static property definition with initial value
    case { _ static $prop:ident = $val:expr ; $rest ... __static__ $(:) { $static ... } } => { 
        return #{
            PARSE_CLASS_DEFS_ $rest ... __static__:{ $static ... $prop = $val ; }
        }
    }

    // block static definitions
    case { _ static $(:) { $static_defs ... } $rest ... __static__ $(:) { $static ... } } => { 
        return #{
            PARSE_CLASS_DEFS_ $rest ... __static__:{ $static ... $static_defs ... }
        }
    }

    // static empty...
    case { _ $rest ... __static__ $(:) { }} => { 
        return #{ PARSE_CLASS_DEFS_ $rest ... } 
    }
    
    // static ...
    case { _ $rest ... __static__ $(:) { $static ... }} => { 
        return #{            
            __static__: { 
                PARSE_STATIC_DEFS_ $static ...  
            }, PARSE_CLASS_DEFS_ $rest ...
        } 
    }
    
    // rest...
    case { _ $rest ... } => { 
        return #{ $rest ... } 
    }
}

// main Class macro here
let Class = macro 
{
    // Define the Classy.Class (procedural/case) macro here...
    // use "let Class = macro .. " to avoid expanding the "Class" identifier inside macro body

    // Class definition without any qualifiers
    case { $Classy $className:ident { $class_definitions ... } } => { 
        // get the Classy runtime identifier ( break default hygiene )
        letstx $ClassyRuntime = [makeIdent('Classy', #{ $Classy })];
        return #{
            var $className = $ClassyRuntime.Class( 
                { Extends: Object }, 
                { PARSE_CLASS_DEFS_ $class_definitions ... __static__:{ }} 
            );
        } 
    }

    // Class definition with "extends" qualifier
    case { $Classy $className:ident extends $superClass:ident { $class_definitions ... } } => { 
        // get the Classy runtime identifier ( break default hygiene )
        letstx $ClassyRuntime = [makeIdent('Classy', #{ $Classy })];
        return #{
            var $className = $ClassyRuntime.Class( 
                { Extends: $superClass }, 
                { PARSE_CLASS_DEFS_ $class_definitions ... __static__:{ }} 
            );
        } 
    }

    // Class definition with "implements" qualifier
    case { $Classy $className:ident implements $implements:ident (,) ... { $class_definitions ... } } => { 
        // get the Classy runtime identifier ( break default hygiene )
        letstx $ClassyRuntime = [makeIdent('Classy', #{ $Classy })];
        return #{
            var $className = $ClassyRuntime.Class( 
                { Extends: Object, Implements: [ $($implements) (,) ... ] }, 
                { PARSE_CLASS_DEFS_ $class_definitions ... __static__:{ }} 
            );
        } 
    }

    // full Class definition "all qualifiers"
    case { $Classy $className:ident extends $superClass:ident implements $implements:ident (,) ... { $class_definitions ... } } => { 
        // get the Classy runtime identifier ( break default hygiene )
        letstx $ClassyRuntime = [makeIdent('Classy', #{ $Classy })];
        return #{
            var $className = $ClassyRuntime.Class( 
                { Extends: $superClass, Implements: [ $($implements) (,) ... ] }, 
                { PARSE_CLASS_DEFS_ $class_definitions ... __static__:{ }} 
            );
        } 
    }
}

// export it
export Class
