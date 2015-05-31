
import ASTY from "asty-astq"

export default class CFG2KV {

    cfg2kv (cfg) {
        let ast = this.cfg2ast(cfg)
        console.log(ast.dump())
        let kv = this.ast2kv(ast)
        return kv
    }

    cfg2ast (cfg) {
        const asty = new ASTY()
        const AST = (type) => asty.create(type)
        let ast = AST("Section").pos(1, 1, 0).set({ ns: "" })
        let cursor = ast

        /*  helper function for character class checking  */
        const isAlpha = (ch) => /^[A-Za-z]$/.test(ch)
        const isDigit = (ch) => /^[0-9]$/.test(ch)

        /*  helper function for consuming and looking at next characters  */
        let line   = 1
        let column = 1
        let offset = 0
        const consume = (cfg, num) => {
            if (num > 0) {
                offset += num
                for (let i = 0; i < num; i++) {
                    let c = cfg.charAt(i)
                    if (c === "\r")
                        column = 1
                    else if (c === "\n") {
                        line++
                        column = 1
                    }
                    else if (c === "\t")
                        column += 8 - (column % 8)
                    else
                        column++
                }
                cfg = cfg.substr(num)
            }
            return cfg
        }
        const lookahead = (cfg) => {
            let ch = cfg.substr(0, 1)
            let la = cfg.substr(1, 1)
            return { ch, la }
        }

        /*  iterate over the configuration file content  */
        let id = ""
        let expect = "key"
        while (cfg !== "") {
            /*  extract first and second (look-ahead) character  */
            let { ch, la } = lookahead(cfg)

            /*  white-space  */
            if (ch === " " || ch === "\t" || ch === "\n")
                cfg = consume(cfg, 1)

            /*  end-of-line comment  */
            else if (ch === "/" && la === "/") {
                while (cfg !== "" && ch !== "\n") {
                    cfg = consume(cfg, 1)
                    ch = lookahead(cfg).ch
                }
            }

            /*  section start end end  */
            else if (ch === "{") {
                let node = AST("Section").pos(line, column, offset).set({ ns: id })
                cursor.add(node)
                cursor = node
                cfg = consume(cfg, 1)
                expect = "key"
            }
            else if (ch === "}") {
                cursor = cursor.parent()
                cfg = consume(cfg, 1)
            }

            /*  key  */
            else if (expect === "key" && isAlpha(ch)) {
                id = ""
                while (isAlpha(ch)) {
                    id += ch
                    cfg = consume(cfg, 1)
                    ch = lookahead(cfg).ch
                }
                expect = "val"
            }

            /*  key to value punctuation operator  */
            else if (ch === "=") {
                cfg = consume(cfg, 1)
            }

            /*  number value  */
            else if (expect === "val" && isDigit(ch)) {
                let num = ""
                while (isDigit(ch)) {
                    num += ch
                    cfg = consume(cfg, 1)
                    ch = lookahead(cfg).ch
                }
                let node = AST("Property").pos(line, column, offset).set({ key: id, val: parseInt(num, 10) })
                cursor.add(node)
                expect = "key"
            }

            /*  string value  */
            else if (expect === "val" && ch === "\"") {
                let str = ""
                let escaped = false
                cfg = consume(cfg, 1)
                ch = lookahead(cfg).ch
                while (ch !== "\"" || escaped) {
                    if (ch === "\\")
                        escaped = true
                    else {
                        escaped = false
                        str += ch
                    }
                    cfg = consume(cfg, 1)
                    ch = lookahead(cfg).ch
                }
                cfg = consume(cfg, 1)
                ch = lookahead(cfg).ch
                let node = AST("Property").pos(line, column, offset).set({ key: id, val: str })
                cursor.add(node)
                expect = "key"
            }

            /*  everything else leads to a parsing error  */
            else {
                throw new Error("unexpected character: \"" + ch + "\" (at \"" + cfg + "\")")
            }
        }
        return ast
    }

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

