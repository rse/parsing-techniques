
Variant: **Parser Combinators (PC), Abstract Syntax Tree (AST)**

Source: [`cfg2kv.js`](cfg2kv.js), [`package.json`](package.json)

To get rid of the separation between scanner and parser, one can use
scannerless parsing. One way is the use Haskel Parsec like Parser Combinators like Arcsecond, which
also provide Regular Expression based parsers.

**RECOMMENDATION**: Acceptable for simple formal language structures and
limited situations, but usually not worth the effort as it still
causes noticable boilerplate code.

  Pros                               | Cons
  -----------------------------------|-----------------------------------
  no separation of scanner and parser| external dependencies
  everything is plain host language  | hard to implement error reporting
                                     | noticable boilerplate code

