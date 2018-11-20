#!/bin/bash
if lsof -ti tcp:3000; then kill $(lsof -ti tcp:3000); fi
source activate flow
node ./bin/www
