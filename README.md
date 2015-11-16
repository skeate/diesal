[![npm](https://img.shields.io/npm/v/diesal.svg)](https://www.npmjs.com/package/diesal)
[![Build Status](https://img.shields.io/travis/skeate/diesal.svg)](https://travis-ci.org/skeate/diesal)
[![Code Climate](https://img.shields.io/codeclimate/github/skeate/diesal.svg)](https://codeclimate.com/github/skeate/diesal)
[![Test Coverage](https://img.shields.io/codeclimate/coverage/github/skeate/diesal.svg)](https://codeclimate.com/github/skeate/diesal/coverage)
[![devDependency Status](https://img.shields.io/david/dev/skeate/diesal.svg)](https://david-dm.org/skeate/diesal#info=devDependencies)

[![Join the chat at https://gitter.im/skeate/diesal](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/skeate/diesal?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

# Diesal

Diesal is a library of ES2015 modules implementing common data structures and
algorithms. The goal is to wind up with clean, easy to understand, well-tested,
well-documented code, that (with the right tools) can be minimally included into
other projects.

## Clean & Easy to Understand

No tricks, no hacks. Nothing that belongs in code golf. Sensible variable names.
You should be minifying your code; there's no need to deal with that directly.
Code should be self-explanatory, and where it might have to get a bit confusing,
there are ample comments explaining, in detail, what is going on. There is also
linting validation as part of the CI.

## Well-Tested

Master branch with all tests passing and 100% branch coverage, always.

## Well-Documented

[Full API documentation](http://skeate.github.io/diesal/docs) generated
regularly as part of the release process.

## Minimally Included

No packaging into a huge library. Classes are individually importable. `npm
install` the package, then import the modules you want.

For the web, `bower install`. This will actually install the source as-is -- no
transpilation. If you are using tools that allow this (e.g. webpack), you should
be able to import only the pieces of Diesal that your app needs, and then minify
without all the extra cruft.

# Running Tests/Coverage

`npm test` will run tests with Mocha, providing coverage info via Istanbul.

# Contributing

Contributions welcome, submit a PR.

# License

ISC
