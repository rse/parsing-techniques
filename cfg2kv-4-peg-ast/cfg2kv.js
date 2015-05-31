
import path    from "path"
import ASTY    from "asty-astq"
import PEG     from "pegjs-otf"
import PEGutil from "pegjs-util"

export default class CFG2KV {

    cfg2kv (cfg) {
        let ast = this.cfg2ast(cfg)
        console.log(ast.dump())
        let kv = this.ast2kv(ast)
        return kv
    }

    cfg2ast (cfg) {
        /*  parse configuration into an Abstract Syntax Tree (AST)  */
        let asty = new ASTY()
        let parser = PEG.buildParserFromFile(path.join(__dirname, "cfg2kv.pegjs"), { optimize: "speed" })
        let result = PEGutil.parse(parser, cfg, {
            makeAST: (line, column, offset, args) =>
                asty.create.apply(asty, args).pos(line, column, offset)
        })
        if (result.error !== null) {
            console.error("ERROR: Parsing Failure:\n" +
                PEGutil.errorMessage(result.error, true).replace(/^/mg, "ERROR: "))
            process.exit(0)
        }
        return result.ast
    }

    /*  convert AST to resulting data structure  */
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

