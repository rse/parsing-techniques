
Variant: **Lexical Scanner (LS), Recursive Descent Parser (RDP), Abstract Syntax Tree (AST)**

Source: [`cfg2kv.js`](cfg2kv.js), [`package.json`](package.json)

One can get rid of the low-level character parsing by splitting the
parsing into two streams: tokenization of characters and parsing the
token structure. For the first we now use a library supporting the
implementation of so-called [Lexical Scanners](http://en.wikipedia.org/wiki/Lexical_analysis). For the second, we now
switch over to [Recursive Descent Parsing](http://en.wikipedia.org/wiki/Recursive_descent_parser).
This uses my [Tokenizr](https://github.com/rse/tokenizr), [ASTy](https://github.com/rse/asty)
and [ASTq](https://github.com/rse/astq) as external libraries.

**RECOMMENDATION**: Acceptable for simple formal language structures and
limited situations, but usually not worth the effort as it still
causes noticable boilerplate code.

  Pros                               | Cons
  -----------------------------------|-----------------------------------
  acceptable amount of code          | external dependencies
  easier to understand               | still somewhat lower-level
  very flexible in output generation | hard to implement error reporting
  semi-automatic line/column tracking| 

