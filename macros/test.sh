#!/usr/bin/env sh

# compile the test with sjs including the classy.sweet.js macro
sjs -m ./classy.sweet.js test_classy_sweet.js > test_classy_sweet_compiled.js
# run the test with node
node test_classy_sweet_compiled.js
