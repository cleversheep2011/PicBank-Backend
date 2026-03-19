// 导入需要的包
import fs from "fs";

import app from "./Router.mjs";
import {conf} from "./Config.mjs"
import {log} from "./Functions.mjs"

if (!fs.existsSync("./log")) fs.mkdirSync("./log"); //若log目录不存在 则新建
if (!fs.existsSync("./image")) fs.mkdirSync("./image"); //若image目录不存在 则新建

log("=-=-=-=-=-=-=-=-= Server Starting =-=-=-=-=-=-=-=-=")
// API服务端监听
if (conf.DEBUG_CONFIG.APISERV_ENABLE) {
    app.listen(conf.SERV_CONFIG.SERV_PORT, conf.SERV_CONFIG.SERV_HOSTNAME, (err) => {
        if (err) throw err;
    });
    console.log(`Backend Server started at http://${conf.SERV_CONFIG.SERV_HOSTNAME}:${conf.SERV_CONFIG.SERV_PORT}/.`);
}
log("=-=-=-=-=-=-=-=-= Server  Running =-=-=-=-=-=-=-=-=")