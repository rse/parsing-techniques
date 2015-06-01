
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
A [sample configuration](sample.cfg) can be:

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
[simple key/value format](sample.kv) where the sections are flattened:

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

There are various parsing techniques available, each with their pros
and cons. For illustration purposes we've implemented a bunch of them.
Each one can be run by executing `make <id>` or `node cfg2kv.js <id>`
where `<id>` is one of `0-re`, `1-sm`, `2-sm-ast`, `3-ls-rdp-ast` or
`4-peg-ast`. Follow the above links to their particular source code
and documentation.

- [`cfg2kv-0-re/`](cfg2kv-0-re/):<br/>
  **Regular Expressions (RE)**

- [`cfg2kv-1-sm/`](cfg2kv-1-sm/):<br/>
  **State Machine (SM)**

- [`cfg2kv-2-sm-ast/`](cfg2kv-2-sm-ast/):<br/>
  **State Machine (SM), Abstract Syntax Tree (AST)**

- [`cfg2kv-3-ls-rdp-ast/`](cfg2kv-3-ls-rdp-ast/):<br/>
  **Lexical Scanner (LS), Recursive Descent Parser (RDP), Abstract Syntax Tree (AST)**

- [`cfg2kv-4-peg-ast/`](cfg2kv-4-peg-ast/):<br/>
  **Parsing Expression Grammar (PEG) Parser, Abstract Syntax Tree (AST)**

