
export default class CFG2KV {

    cfg2kv (cfg) {
        let kv = ""
        cfg = cfg.replace(/\/\/[^\r\n]*\r?\n/g, "")
        const parseBlock = (ns, cfg) => {
            cfg = cfg.replace(/([a-zA-Z_][a-zA-Z_0-9]*)\s*\{((?:.|\r?\n)*)\}/, (m, key, block) => {
                block = parseBlock(ns.concat(key), block)
                return ""
            })
            cfg = cfg.replace(/([a-zA-Z_][a-zA-Z_0-9]*)\s*=\s*(?:(\d+)|"((?:\\"|.)*?)")/g, (m, key, val1, val2) => {
                let val = val1
                if (val === undefined)
                    val = val2.replace(/\\"/g, "\"")
                kv += `${[ ...ns, key ].join(".")} ${val}\n`
                return ""
            })
            return cfg
        }
        cfg = parseBlock([], cfg)
        return kv
    }
}

