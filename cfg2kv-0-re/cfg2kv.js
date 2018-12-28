
module.exports = class CFG2KV {

    /*  parse configuration format into key/value format  */
    cfg2kv (cfg) {
        let kv = ""

        /*  get rid of all end-of-line comments  */
        cfg = cfg.replace(/\/\/[^\r\n]*\r?\n/g, "")

        /*  parse a section block  */
        const parseBlock = (ns, cfg) => {
            /*  parse sections  */
            cfg = cfg.replace(/([a-zA-Z_][a-zA-Z_0-9]*)\s*\{((?:.|\r?\n)*)\}/, (m, key, block) => {
                block = parseBlock(ns.concat(key), block) /*  RECURSION  */
                return ""
            })

            /*  parse property assignments  */
            cfg = cfg.replace(/([a-zA-Z_][a-zA-Z_0-9]*)\s*=\s*(?:(\d+)|"((?:\\"|.)*?)")/g, (m, key, val1, val2) => {
                let val = val1
                if (val === undefined)
                    val = val2.replace(/\\"/g, "\"")
                kv += `${[ ...ns, key ].join(".")} ${val}\n`
                return ""
            })

            return cfg
        }

        /*  bootstrap parsing  */
        cfg = parseBlock([], cfg)

        return kv
    }
}

