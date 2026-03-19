import toml from "toml";
import fs from "fs";

// 读配置文件
let conf_data = fs.readFileSync("config.toml", "utf8");
let conf = {}
try {
    conf = toml.parse(conf_data);
} catch (e) {
    console.warn("An error occurred when reading config files, try using env config.")
}

// 使用环境变量覆盖配置
// 优先级：环境变量 > 配置文件
// DEBUG配置
if (process.env.DEBUG_MODE) conf.DEBUG_CONFIG.DEBUG_MODE = process.env.DEBUG_MODE; // 是否开启调试模式
if (process.env.APISERV_ENABLE) conf.DEBUG_CONFIG.APISERV_ENABLE = process.env.APISERV_ENABLE; // API服务是否开启

// 日志配置
if (process.env.LOGFILE_FORMAT) conf.LOGGER.LOGFILE_FORMAT = process.env.LOGFILE_FORMAT; // 日志文件名格式
if (process.env.LOGTIME_FORMAT) conf.LOGGER.LOGTIME_FORMAT = process.env.LOGTIME_FORMAT; // 时间格式

// 会话配置
if (process.env.SESS_NAME) conf.SESSION.SESS_NAME = process.env.SESS_NAME; // session名称
if (process.env.SESS_SECRET) conf.SESSION.SESS_SECRET = process.env.SESS_SECRET; // session密钥
if (process.env.SESS_MAXAGE) conf.SESSION.SESS_MAXAGE = parseInt(process.env.SESS_MAXAGE); // session过期时间

// 服务配置
if (process.env.SERV_HOSTNAME) conf.SERV_CONFIG.SERV_HOSTNAME = process.env.SERV_HOSTNAME; // 服务监听地址
if (process.env.SERV_PORT) conf.SERV_CONFIG.SERV_PORT = parseInt(process.env.SERV_PORT); // 服务监听端口

// 数据配置
if (process.env.IMAGE_QUALITY) conf.DATA_CONFIG.IMAGE_QUALITY = parseInt(process.env.IMAGE_QUALITY); // 图片质量
if (process.env.IMAGE_WIDTH) conf.DATA_CONFIG.IMAGE_WIDTH = parseInt(process.env.IMAGE_WIDTH); // 图片宽度

export {conf};