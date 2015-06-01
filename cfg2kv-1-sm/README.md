
Variant: **State Machine (SM)**

Source: [`cfg2kv.js`](cfg2kv.js)

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

