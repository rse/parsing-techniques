
Variant: **Parsing Expression Grammar (PEG) Parser, Abstract Syntax Tree (AST)**

Source: [`cfg2kv.js`](cfg2kv.js), [`cfg2kv.pegjs`](cfg2kv.pegjs), [`package.json`](package.json)

The structure behind Recursive Descent Parsing is actually an LL(1)
[Context-Free Grammar](http://en.wikipedia.org/wiki/Context-free_grammar). An efficient variant of [LL(1)](http://en.wikipedia.org/wiki/LL_grammar) are
[Parsing Expression Grammars](http://en.wikipedia.org/wiki/Parsing_expression_grammar)
(PEG) where the lexical scanning and syntax parsing can be smartly
interweaved again and where full-blown parser generators exist (which
in the background generate the necessary Recursive Descent code for
us). Hence, we now switch over to a PEG, but still use the flexible AST
approach. This uses [PEG.js](http://pegjs.org) and my [ASTy](https://github.com/rse/asty)
and [ASTq](https://github.com/rse/astq) as external libraries.

**RECOMMENDATION**: The preferred approach which should be used whenever possible,
as it has to really best Pros/Cons ratio.

  Pros                               | Cons
  -----------------------------------|-----------------------------------
  very less code                     | external dependencies
  easier to understand               | you have to write an LL(1) grammar
  very high-level                    | 
  very flexible in output generation | 
  automatic error generation         | 
  automatic line/column tracking     | 

