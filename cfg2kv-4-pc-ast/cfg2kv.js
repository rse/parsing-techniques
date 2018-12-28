
import ASTY    from "asty-astq"
import * as AS from "arcsecond"

module.exports = class CFG2KV {

    /*  parse configuration format into key/value format  */
    cfg2kv (cfg) {
        let ast = this.cfg2ast(cfg)
        console.log(ast.dump())
        let kv = this.ast2kv(ast)
        return kv
    }

    /*  parse configuration format into Abstract Syntax Tree (AST)  */
    cfg2ast (cfg) {
        let asty = new ASTY()
        const AST = (type, ref) => {
            let ast = asty.create(type)
            if (typeof ref === "object" && ref instanceof Array && ref.length > 0)
                ref = ref[0]
            if (typeof ref === "object" && asty.isA(ref))
                ast.pos(ref.pos().line, ref.pos().column, ref.pos().offset)
            return ast
        }

        const ruleWS =
            AS.regex(/^[ \t\r\n]+/)
        const ruleCO =
            AS.regex(/^\/\/[^\r\n]*(?:\r?\n|$)/)
        const _ =
            AS.many(AS.choice([ ruleCO, ruleWS ]))
        const ruleString = AS.pipeParsers([
            AS.sequenceOf([ AS.char("\""), AS.many(AS.choice([ AS.str("\\\""), AS.anythingExcept(AS.char("\"")) ])), AS.char("\"") ]),
            AS.mapTo((m) => {
                let str = m[1].join("")
                return str.replace(/\\"/g, "\"")
            })
        ])
        const ruleNumber = AS.pipeParsers([
            AS.regex(/^[+-]?[0-9]+/),
            AS.mapTo((num) => {
                return parseInt(num, 10)
            })
        ])
        const ruleId =
            AS.regex(/^[a-zA-Z_][a-zA-Z0-9_]*/)
        const ruleSection = AS.pipeParsers([
            AS.sequenceOf([ _, ruleId, _, AS.char("{"), _, AS.recursiveParser(() => ruleBlock), _, AS.char("}"), _ ]),
            AS.mapTo((m) => {
                let [ ns, block ] = [ m[1], m[5] ]
                return AST("Section").set({ ns: ns }).add(block)
            })
        ])
        const ruleProperty = AS.pipeParsers([
            AS.sequenceOf([ _, ruleId, _, AS.char("="), _, AS.choice([ ruleNumber, ruleString ]), _ ]),
            AS.mapTo((m) => {
                let [ key, val ] = [ m[1], m[5] ]
                return AST("Property").set({ key: key, val: val })
            })
        ])
        const ruleBlock =
            AS.many(AS.choice([ ruleProperty, ruleSection ]))
        const ruleCfg = AS.pipeParsers([
            ruleBlock,
            AS.mapTo((block) => {
                return AST("Section").set({ ns: "" }).add(block)
            })
        ])

        let parser = AS.parse(ruleCfg)
        let ast = parser(cfg).value

        return ast
    }

    /*  generate key/value format from Abstract Syntax Tree (AST)  */
    ast2kv (ast) {
        let kv = ""
        ast.query("// Property").forEach((p) => {
            let ns = p.query("..// Section").reverse().slice(1).map((n) => n.get("ns"))
            let key = [ ...ns, p.get("key") ].join(".")
            let val = p.get("val")
            kv += `${key} ${val}\n`
        })
        return kv
    }
}

