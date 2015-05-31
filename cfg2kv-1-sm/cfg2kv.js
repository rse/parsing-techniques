
export default class CFG2KV {
    cfg2kv (cfg) {
        /*  helper function for character class checking  */
        const isAlpha = (ch) => {
            let cc = ch.charCodeAt(0)
            return (
                   ("A".charCodeAt(0) <= cc && cc <= "Z".charCodeAt(0))
                || ("a".charCodeAt(0) <= cc && cc <= "z".charCodeAt(0))
            )
        }
        const isDigit = (ch) => {
            let cc = ch.charCodeAt(0)
            return ("0".charCodeAt(0) <= cc && cc <= "9".charCodeAt(0))
        }

        /*  helper function for consuming and looking at next characters  */
        const consume = (cfg, num) => {
            if (num > 0)
                cfg = cfg.substr(num)
            return cfg
        }
        const lookahead = (cfg) => {
            let ch = cfg.substr(0, 1)
            let la = cfg.substr(1, 1)
            return { ch, la }
        }

        /*  iterate over the configuration file content  */
        let kv = ""
        let ns = []
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
                ns.push(id)
                cfg = consume(cfg, 1)
                expect = "key"
            }
            else if (ch === "}") {
                ns.pop()
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
                kv += `${[ ...ns, id].join(".")} ${parseInt(num, 10)}\n`
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
                kv += `${[ ...ns, id ].join(".")} ${str}\n`
                expect = "key"
            }

            /*  everything else leads to a parsing error  */
            else {
                throw new Error("unexpected character: \"" + ch + "\" (at \"" + cfg + "\")")
            }
        }
        return kv
    }
}

