
Variant: **State Machine (SM), Abstract Syntax Tree (AST)**

Source: [`cfg2kv.js`](cfg2kv.js), [`package.json`](package.json)

As the direct output generation usually is not recommended (it works
just for the cases where the output ordering directly follows the
input ordering) one usually always wants to use an intermediate
format, a so called [Abstract Syntax Tree](http://en.wikipedia.org/wiki/Abstract_syntax_tree)
(AST). This way two passes are performed: parsing of the input
syntax into the AST and then querying the AST to produce the
output. For our trivial configuration language this looks like
overhead, but for mostly all parsing approaches this is the
recommended way. Additionally, some too much bare metal coding
can be replaced with at least a little bit of Regular Expressions
again. This uses my [ASTy](https://github.com/rse/asty) and
[ASTq](https://github.com/rse/astq) as external libraries.

**RECOMMENDATION**: Avoid this approach at all as it is also too low-level
and leads to too much boilerplate code.

  Pros                               | Cons
  -----------------------------------|-----------------------------------
  still rather much code             | still partly hard to understand
  very flexible in output generation | external dependencies
                                     | hard to implement error reporting
                                     | hard to track line/column
