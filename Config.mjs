import toml from "toml";
import fs from "fs";

// 读配置文件
let conf_data = fs.readFileSync("config.toml", "utf8");
let config = {}
try {
    config = toml.parse(conf_data);
} catch (e) {
    log("An error occurred when reading config files, try using env config.")
}