
Variant: **Regular Expressions (RE)**<br/>

Source: [`cfg2kv.js`](cfg2kv.js), [`package.json`](package.json)

This is the Unix rooky approach. It uses complex [Regular
Expressions](http://en.wikipedia.org/wiki/Regular_expression) to
match sections and property assignments. Section blocks are matched
recursively while carrying forward the current namespace information.
Properties are matched and then immediately lead to the resulting
key/value output.

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


