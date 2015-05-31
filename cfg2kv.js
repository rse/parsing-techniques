
/*  require some standard functionality  */
import fs   from "fs"
import path from "path"

/*  read configuration file  */
let cfg = fs.readFileSync("sample.cfg", "utf8")
console.log(cfg)

/*  convert configuration to property format  */
let CFG2KV = require(path.join(__dirname, `cfg2kv-${process.argv[2]}`, "cfg2kv"))
let cfg2kv = new CFG2KV()
let kv = cfg2kv.cfg2kv(cfg)

/*  write property file  */
fs.writeFileSync("sample.kv", kv, "utf8")
console.log(kv)

