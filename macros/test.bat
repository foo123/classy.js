@echo off

rem compile the test with sjs including the classy.sweet.js macro
call sjs -m ./classy.sweet.js test_classy_sweet.js > test_classy_sweet_compiled.js
rem run the test with node
call node test_classy_sweet_compiled.js
