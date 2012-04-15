#!/bin/sh

# Simple script to download required packages for wowza-stats.js
if which npm &> /dev/null; then
  npm install jsdom@0.2.13;
  npm install optimist;
  npm install request;
  echo "Success!";
  exit 1;
else
  echo "You are not going to get far without npm.";
  exit 0;
fi
