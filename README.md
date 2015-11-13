# Diesal

Diesal is a library of ES2015 modules implementing common data structures and
algorithms. The goal is to wind up with clean, easy to understand, well-tested,
well-documented code, that (with the right tools) can be minimally included into
other projects.

## Clean & Easy to Understand

Target: no tricks, no hacks. Nothing that belongs in code golf. Sensible
variable names. Code should be self-explanatory, and where it might have to get
a bit confusing, ample comments explaining, in detail, what is going on. Linting
validation as part of the CI.

## Well-Tested

Target: master branch with all tests passing and 100% branch coverage, always.

## Well-Documented

Target: ESDoc for all methods. Docco generation for browsing code with comments.

## Minimally Included

No transpilation and packaging into a monolithic library. `npm install` the
package, then import the modules you want. If you are using tools that allow
this, you should be able to minify your code with only the pieces of Diesal that
your app needs.

# Running Tests/Coverage

`npm test`

`npm run coverage`

or

`npm run coverage-html`

for an HTML report (in `coverage/index.html`).

# Contributing

Contributions welcome, submit a PR.

# License

ISC
