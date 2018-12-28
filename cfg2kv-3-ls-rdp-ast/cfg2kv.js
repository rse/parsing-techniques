
import ASTY     from "asty-astq"
import Tokenizr from "tokenizr"

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
        /*  establish abstract syntax tree (AST) node generator  */
        let asty = new ASTY()
        const AST = (type, ref) => {
            let ast = asty.create(type)
            if (typeof ref === "object" && ref instanceof Array && ref.length > 0)
                ref = ref[0]
            if (typeof ref === "object" && ref instanceof Tokenizr.Token)
                ast.pos(ref.line, ref.column, ref.pos)
            else if (typeof ref === "object" && asty.isA(ref))
                ast.pos(ref.pos().line, ref.pos().column, ref.pos().offset)
            return ast
        }

        /*  establish lexical scanner  */
        let lexer = new Tokenizr()
        lexer.rule(/[a-zA-Z_][a-zA-Z0-9_]*/, (ctx, m) => {
            ctx.accept("id")
        })
        lexer.rule(/[+-]?[0-9]+/, (ctx, m) => {
            ctx.accept("number", parseInt(m[0]))
        })
        lexer.rule(/"((?:\\\"|[^\r\n]+)+)"/, (ctx, m) => {
            ctx.accept("string", m[1].replace(/\\"/g, "\""))
        })
        lexer.rule(/\/\/[^\r\n]+\r?\n/, (ctx, m) => {
            ctx.ignore()
        })
        lexer.rule(/[ \t\r\n]+/, (ctx, m) => {
            ctx.ignore()
        })
        lexer.rule(/./, (ctx, m) => {
            ctx.accept("char")
        })

        /*  establish recursive descent parser  */
        let parser = {
            parseCfg () {
                let block = this.parseBlock()
                lexer.consume("EOF")
                return AST("Section", block).set({ ns: "" }).add(block)
            },
            parseBlock () {
                let items = []
                for (;;) {
                    let item = lexer.alternatives(
                        this.parseProperty.bind(this),
                        this.parseSection.bind(this),
                        this.parseEmpty.bind(this))
                    if (item === undefined)
                        break
                    items.push(item)
                }
                return items
            },
            parseProperty () {
                let key = this.parseId()
                lexer.consume("char", "=")
                let value = lexer.alternatives(
                    this.parseNumber.bind(this),
                    this.parseString.bind(this))
                return AST("Property", value).set({ key: key.value, val: value.value })
            },
            parseSection () {
                let ns = this.parseId()
                lexer.consume("char", "{")
                let block = this.parseBlock()
                lexer.consume("char", "}")
                return AST("Section", ns).set({ ns: ns.value }).add(block)
            },
            parseId () {
                return lexer.consume("id")
            },
            parseNumber () {
                return lexer.consume("number")
            },
            parseString () {
                return lexer.consume("string")
            },
            parseEmpty () {
                return undefined
            }
        }

        /*  parse syntax character string into abstract syntax tree (AST)  */
        let ast
        try {
            lexer.input(cfg)
            ast = parser.parseCfg()
        }
        catch (ex) {
            console.log(ex.toString())
            process.exit(0)
        }
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

