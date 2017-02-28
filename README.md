[![npm][npm-badge]][npm]
[![Build Status][travis-badge]][travis]
[![Code Climate][codeclimate-badge]][codeclimate]
[![Test Coverage][cv-badge]][cv]
[![devDependency Status][david-badge]][david]
[![Greenkeeper badge][greenkeeper-badge]][greenkeeper]

[![gitter][gitter-badge]][gitter]

# Diesal


Diesal is a library of ES20xx modules implementing common data structures and
algorithms. The goal is to wind up with clean, easy to understand, well-tested,
well-documented code that can stand as an exemplar. 

## Clean & Easy to Understand

No tricks, no hacks. Nothing that belongs in code golf. Sensible variable names.
Code should be minified before going into production; there's no sense in
inflicting that upon yourself. Code should be self-explanatory, and where it
might have to get a bit confusing, there should be ample comments explaining, in
detail, what is going on. There is also linting validation as part of the CI.

## Well-Tested & Well-Documented

`master` branch will always be at [100% code coverage][cv].
[Full API documentation][docs] generated regularly as part of the release
process.

## Tree Shakeable

Diesal is not packaged into a single, huge library. Instead, it's published to
npm with the source intact, so you can import only the parts you need, if you're
using a build tool that supports tree shaking (e.g. webpack).

# Running Tests/Coverage

`npm test` will run tests with Mocha, providing coverage info via Istanbul.

# License

ISC

[npm]: https://www.npmjs.com/package/diesal
[npm-badge]: https://img.shields.io/npm/v/diesal.svg
[travis]: https://travis-ci.org/skeate/diesal
[travis-badge]: https://img.shields.io/travis/skeate/diesal.svg
[codeclimate]: https://codeclimate.com/github/skeate/diesal
[codeclimate-badge]: https://img.shields.io/codeclimate/github/skeate/diesal.svg
[cv]: https://codeclimate.com/github/skeate/diesal/coverage
[cv-badge]: https://img.shields.io/codeclimate/coverage/github/skeate/diesal.svg
[david]: https://david-dm.org/skeate/diesal#info=devDependencies
[david-badge]: https://img.shields.io/david/dev/skeate/diesal.svg
[gitter]: https://gitter.im/skeate/diesal
[gitter-badge]: https://badges.gitter.im/Join%20Chat.svg
[docs]: http://skeate.github.io/diesal/docs
[greenkeeper]: http://greenkeeper.io/
[greenkeeper-badge]: https://badges.greenkeeper.io/skeate/diesal.svg
