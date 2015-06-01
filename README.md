
Parsing Techniques
==================

There are lots of [formal languages](LANGUAGES.md) for various kinds of
practical purposes. But they all have one thing in common: for further
processing them inside a program, they first have to be parsed from
their character string representation. This is the material of a lecture
about various techniques to perform this parsing step.

Notice: the code is all written in [ECMAScript
6](http://en.wikipedia.org/wiki/ECMAScript), is on-the-fly transpiled
to ECMAScript 5 and then executed under [Node.js](http://nodejs.org/),
but it actually doesn't matter very much. Equivalent code can be written
in Java or C#, too. The only major point is just that the required
third-party libraries have to be also changed, of course.

Parsing Input
-------------

Let's image a formal language for describing key/value based
configurations in a redundancy-free nested structure.
A sample configuration can be:

```
foo {
    baz = 7 // some comment
    bar {
        quux = 42
        hello = "{hello} = \"world\"!"
    }
    quux = 3
}
bar  = 1
quux = 2
```

This is a very simple formal language, but it already has
some cruxes which can become a hurdle for parsing:

1. nested sections
2. intermixed comments
3. alternatives (value is either number or string)
4. string value can contain spaces, quotes and section braces

Parsing Output
--------------

Let's image we want to parse configurations in the above format into a
simple key/value format where the sections are flattened:

```
foo.bar.quux 42
foo.bar.hello {hello} = "world"!
foo.baz 7
foo.quux 3
bar 1
quux 2
```

Parsing Techniques
------------------

There are various parsing techniques available, each with their pros and
cons. For illustration purposes we've implemented a bunch of them. Each
one can be run by executing `make <id>` where `<id>` is one of `0-re`,
`1-sm`, `2-sm-ast`, `3-ls-rdp-ast` or `4-peg-ast`:

- [`cfg2kv-0-re/cfg2kv.js`](cfg2kv-0-re/cfg2kv.js):<br/>
  **Regular Expressions (RE)**<br/>
  This is the Unix rooky approach. It uses complex [Regular Expressions](http://en.wikipedia.org/wiki/Regular_expression)
  to match sections and property assignments. Section blocks are matched
  recursively while carrying forward the current namespace information. Properties
  are matched and then immediately lead to the resulting key/value
  output.

  **RECOMMENDATION**: Use only for "code once &amp; forget" situations or
  if external dependencies are not acceptable, but be aware of the hard
  limitations.

    Pros                       | Cons
    ---------------------------|-----------------------------------
    very less code             | hard to understand
    no external dependencies   | does not support multiple sections at same level
                               | fails if non-balanced braces occur in strings
                               | produces key/values in section-first/properties-second order
                               | inflexible in output generation
                               | hard to implement error reporting
                               | impossible to track line/column

- [`cfg2kv-1-sm/cfg2kv.js`](cfg2kv-1-sm/cfg2kv.js):<br/>
  **State Machine (SM)**:<br/>
  As Regular Expressions are (unfortunately) not everyone's favorite,
  many people would avoid them and code a parser with bare language
  features only. This is the next technique. One still needs to cope
  with the Cons of technique 0 above, so a [State Machine](http://en.wikipedia.org/wiki/Finite-state_machine) is used to
  support multiple sections, arbitrary nesting, more precisely string
  parsing and expected output ordering.

  **RECOMMENDATION**: Avoid this approach at all as it is too low-level
  and leads to too much boilerplate code.

    Pros                       | Cons
    ---------------------------|-----------------------------------
    very much code             | hard to understand
    no external dependencies   | still inflexible in output generation
                               | hard to implement error reporting
                               | hard to track line/column

- [`cfg2kv-2-sm-ast/cfg2kv.js`](cfg2kv-2-sm-ast/cfg2kv.js):<br/>
  **State Machine (SM), Abstract Syntax Tree (AST)**<br/>
  As the direct output generation usually is not recommended (it works
  just for the cases where the output ordering directly follows the
  input ordering) one usually always wants to use an intermediate
  format, a so called [Abstract Syntax Tree](http://en.wikipedia.org/wiki/Abstract_syntax_tree) (AST). This way two passes
  are performed: parsing of the input syntax into the AST and then
  querying the AST to produce the output. For our trivial configuration
  language this looks like overhead, but for mostly all parsing
  approaches this is the recommended way. Additionally, some too much
  bare metal coding can be replaced with at least a little bit of
  Regular Expressions again. This uses my [ASTy](https://github.com/rse/asty)
  and [ASTq](https://github.com/rse/astq) as external libraries.

  **RECOMMENDATION**: Avoid this approach at all as it is also too low-level
  and leads to too much boilerplate code.

    Pros                               | Cons
    -----------------------------------|-----------------------------------
    still rather much code             | still partly hard to understand
    very flexible in output generation | external dependencies
                                       | hard to implement error reporting
                                       | hard to track line/column

- [`cfg2kv-3-ls-rdp-ast/cfg2kv.js`](cfg2kv-3-ls-rdp-ast/cfg2kv.js):<br/>
  **Lexical Scanner (LS), Recursive Descent Parser (RDP), Abstract Syntax Tree (AST)**<br/>
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

- [`cfg2kv-4-peg-ast/cfg2kv.js`](cfg2kv-4-peg-ast/cfg2kv.js):<br/>
  [`cfg2kv-4-peg-ast/cfg2kv.pegjs`](cfg2kv-4-peg-ast/cfg2kv.pegjs):<br/>
  **Parsing Expression Grammar (PEG) Parser, Abstract Syntax Tree (AST)**<br/>
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

