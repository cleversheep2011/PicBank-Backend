import {conf} from "./Config.mjs";
import moment from "moment";
import fs from "fs";

/* BEGINNING OF 日志函数 */
// 输出到控制台和文件
export function log(context) {
    console.log(context); //打印日志内容
    let logfile = `./log/${moment().format(conf.LOGGER.LOGFILE_FORMAT)}`; // 获得目标文件名
    let data = "";
    for (let line of context.split('\n')) {
        data += `[${moment().format(conf.LOGGER.LOGTIME_FORMAT)}] `;
        data += line;
        data += "\n";
    }
    fs.writeFileSync(logfile, data, {encoding: "utf8", flag: "a"}); //以追加模式写入日志文件
}
/* END OF 日志函数 */

/* BEGINNING OF 后端函数 */
// 返回JSON响应数据
export function response(req, res, code, message) {
    res.writeHead(code, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(message));
    res.end();
    log(`${req.method}`.padEnd(5, ' ') + `${req.path}`.padEnd(35, ' ') + '->' + `${res.statusCode}(${res.statusMessage})`.padStart(36, ' '));
}

// 获得登录状态
export function logon(req){
    return {
        "isLoggedIn": req.session.hasOwnProperty("user_uuid"),
        "user_uuid": req.session["user_uuid"]
    };
}

// 登陆操作 向session中添加登陆状态
export function login(req, uuid) {
    req.session["user_uuid"] = uuid;
}

// 销毁session来退出登陆
export function logout(req) {
    req.session.destroy();
}

// 检查输入参数合法性
export function parmasDetect(queryObj, requirement) {
    for (let require of requirement) {
        if (!(queryObj.hasOwnProperty(require) || queryObj[require] === '')) {
            return false;
        }
    }
    return true;
}
/* END OF 后端函数 */