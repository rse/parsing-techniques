
{
    var ast = options.util.makeAST(location, options)
}

cfg
    = block:block {
          return ast("Section").set({ ns: "" }).add(block)
      }

block
    = (property / section)*

section
    = _ ns:id _ "{" _ block:block _ "}" _ {
          return ast("Section").set({ ns: ns }).add(block)
      }

property
    = _ key:id _ "=" _ val:(number / string) _ {
          return ast("Property").set({ key: key, val: val })
      }

id "identifier"
    = $([a-zA-Z_][a-zA-Z0-9_]*)

number "integer number"
    = num:$([+-]? [0-9]+) {
          return parseInt(num, 10)
      }

string "quoted string"
    = "\"" str:$(("\\\"" / [^"])*) "\"" {
          return str.replace(/\\"/g, "\"")
    }

_ "blank"
    = (co / ws)*

co "comment"
    = "//" (![\r\n] .)*

ws "whitespaces"
    = [ \t\r\n]+

