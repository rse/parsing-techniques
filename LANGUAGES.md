
Markup Languages
----------------

Markup languages are actually two languages combined: a "host" language
(often just plain text) and the embedded markup language to mark
up various parts of the host language. As the host language can be
arbitrary, markup languages sometimes are hard to parse because they
have to recognize tokens representing the arbitrary plain text.

### POD-like

[Plain Old Document](http://perldoc.perl.org/perlpod.html) (POD) style
markup is a very concise and still flexible enough markup language.
It is often used in variants where it is mixed together with Markdown elements.

```
API Management
--------------

Change the API symbol in the global variable namespace under which ComponentJS
is exposed. By default ComponentJS is exposed under the symbol name
C<ComponentJS>. It is a common convention to change the symbol to C<cs> (for
"component system/service") to have a convenient short-hand.

- ComponentJS.M<symbol>([P<name>: T<String>]): T<ComponentJS>

  Change symbol of ComponentJS API to global variable P<name> and return it.
  If P<name> is not given, ComponentJS does not occupy any global namespace slot at all --
  then it is required to store the return value and use ComponentJS directly through it.

  | ComponentJS.symbol("cs")        /* standard    */
  | var cs = ComponentJS.symbol()   /* alternative */

- ComponentJS.M<version> = {
      F<major>: T<Number>, F<minor>: T<Number>, F<micro>: T<Number>, F<date>:  T<Number>
  }

  Access the ComponentJS implementation version "F<major>C<.>F<minor>C<.>F<micro>"
  and the corresponding release F<date> (in format YYYYMMDD).

  | if (ComponentJS.version.date &lt; 20120101)
  |      throw new Error("need at least ComponentJS as of 20120101")
```

    Pros                       | Cons
    ---------------------------|-----------------------------------
    very concise               | somewhat "cryptic" in style
    easy to parse              |
    supports custom tags       |

### Markdown

[Markdown](https://daringfireball.net/projects/markdown/) is a very
readable markup language for writing documents, inspired by ASCII-based
email texts of the 1990's.

```md
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

    Pros                       | Cons
    ---------------------------|-----------------------------------
    very concise               | does not provide custom tags
    easy to parse              |

### LaTeX

[LaTeX](http://en.wikipedia.org/wiki/LaTeX) is one of the oldest
markup languages. It is based on the underlying TeX macro language
and used for writing documents.

```tex
\documentclass{scrartcl}

\title{Ein Testdokument}

\begin{document}

\section{Einleitung}

Hier kommt die Einleitung. Ihre Überschrift kommt
automatisch in das Inhaltsverzeichnis.

\subsection{Formeln}

\LaTeX{} ist auch ohne Formeln sehr nützlich und
einfach zu verwenden. Grafiken, Tabellen,
Querverweise aller Art, Literatur- und
Stichwortverzeichnis sind kein Problem.

Formeln sind etwas schwieriger, dennoch hier ein
einfaches Beispiel.  Zwei von Einsteins
berühmtesten Formeln lauten:

\begin{align}
E &= mc^2                                  \\
m &= \frac{m_0}{\sqrt{1-\frac{v^2}{c^2}}}
\end{align}

Aber wer keine Formeln schreibt, braucht sich
damit auch nicht zu beschäftigen.

\end{document}
```

### SGML/HTML/XML

```html
<html>
    <head>
        <title>Foo</title>
    </head>
    <body>
        <h1>Foo</h1>
        Bar <em>Baz</em> Quux
    </body>
</html>
```


Configuration Languages
-----------------------

### YAML

```yaml
config:
    Foo:
        bar: "quux"
        baz: 42
    Bar:
        bar: "foo"
        baz: 7
```

#### HOCON

```
config {
    Foo {
        bar = "quux"
        baz = 42
    },
    Bar {
        bar = "foo",
        baz = 7
    }
}
```

### INI

```
[config]

[config.Foo]
bar = "quux"
baz = 42

[config.Bar]
bar = "foo"
baz = 7
```

#### JSON

```json
{
    "Foo": {
        "bar": "quux",
        "baz": 42
    },
    "Bar": {
        "bar": "foo",
        "baz": 7
    }
}
```

### XML

```xml
<config>
    <Foo>
        <bar>quux</bar>
        <baz>42</baz>
    </Foo>
    <Bar>
        <bar>foo</bar>
        <baz>7</baz>
    </Bar>
</config>
```


Serialization Languages
-----------------------

### JSON

```json
{
    "foo": 42,
    "bar": [ 7, "baz" ],
    "quux": {
        "a": 1,
        "b": 2
    }
}
```

### YAML

```yaml
sample:
  foo: 42
  bar:
    - 7
    - "baz"
  quux:
    a: 1
    b: 2
```

### XML

```xml
<sample>
    <foo>42</foo>
    <bar>
        <item>7</item>
        <item>baz</item>
    </bar>
    <quux>
        <a>1</a>
        <b>2</a>
    </quux>
</sample>
```


Query Languages
---------------

### XPath

```
// Foo [ @bar == 'quux' ]
```

### ASTq

```js
astq.query(`
    // VariableDeclarator [
           /:id   Identifier [ @name  ]
        && /:init Literal    [ @value ]
    ]
`)
```

## CSS Selectors

```
@id .class > *[type="foo"]
```

### DuckyJS Selectors

```js
ducky.select({
    foo: {
        bar: {
            baz: [ 42, 7, "Quux" ]
        }
    }
},
    "foo['bar'].baz[2]"
)
```

### Neo4J Cypher

```
MATCH
  (you {name:"You"}),
  (expert)-[:WORKED_WITH]->(db:Database {name:"Neo4j"}),
  p = shortestPath((you)-[:FRIEND*..5]-(expert))
  RETURN p, db
```

### ArangoDB AQL

```
FOR user IN users
  SORT user.name, user.gender
  RETURN user
```

### SQL

```
SELECT * FROM users
  WHERE active = 1
  ORDER BY name, gender;
```


Pattern Languages
-----------------

### DuckyJS Validation

```
ducky.validate({
    foo: "Foo",
    bar: "Bar",
    baz: [ 42, 7, "Quux" ]
}, `{
    foo: string,
    bar: any,
    baz: [ number+, string* ],
    quux?: any
}`)
```

### Regular Expression

```
/[+-]?[0-9]*\.[0-9]+([eE][+-]?[0-9]+)?/.test(str)
```

### Shell Glob Pattern

```
foo-*.txt
```


Programming Languages
---------------------

### ECMAScript

```js
export default class OSet {
    constructor () {
        this._items = 0
        this._index = {}
        this._ring = {}
        this._ring.prev = this._ring
        this._ring.next = this._ring
        return this
    }
    length () {
        return this._items
    }
    keys () {
        return this.each(function (val, key) {
            this.push(key)
        }, [])
    }
    values () {
        return this.each(function (val /*, key */) {
            this.push(val)
        }, [])
    }
    find (predicate, ctx) {
        if (arguments < 2)
            ctx = this
        return this.each(function (val, key, order) {
            if (predicate.call(ctx, val, key, order))
                this.push(val)
        }, [])
    }
    each (iterator, ctx) {
        if (arguments < 2)
            ctx = this
        let i = 0
        let bucket = this._ring.next
        while (bucket !== this._ring) {
            iterator.call(ctx, bucket.val, bucket.key, i++)
            bucket = bucket.next
        }
        return ctx
    }
    [...]
}
```

