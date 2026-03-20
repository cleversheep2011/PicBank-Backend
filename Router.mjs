/* 导入包(ES语法) */
import express from 'express';
import session from "express-session";

import cors from 'cors';
import fs from "fs";
import moment from "moment";
import sharp from "sharp";
import {createHash} from 'crypto';

import {conf} from "./Config.mjs";
import {response} from "./Functions.mjs";
import * as func from "./Functions.mjs";
import * as sql from "./SQLmodel.mjs";

/* 创建服务端 */
const app = express(); //创建服务器
app.use(cors()); //添加CORS支持
app.use(session({
    cookie: {
        secure: false, maxAge: conf.SESSION.SESS_MAXAGE * 1000
    },
    secret: conf.SESSION.SESS_SECRET,
    name: conf.SESSION.SESS_NAME,
    resave: false,
    saveUninitialized: true
})) //设置SESSION
app.use(express.json())

/* BEGINNING OF 用户管理 */
// 用户注册
app.post("/api/user/register", async (req, res) => {
    if (func.logon(req).isLoggedIn) {
        func.response(req, res, 403, {status: "ALREADY_LOGGED_IN"});
        return;
    }

    let requirement = ["username", "password", "email"];
    if (!func.parmasDetect(req.body, requirement)) {
        response(req, res, 400, {status: "BAD_REQUEST"});
        return;
    }
    const {username, password, email} = req.body;

    const count = await sql.User.count({
        where: {
            username: username,
        }
    });
    if (count) {
        response(req, res, 400, {status: "USER_ALREADY_EXISTS"})
        return;
    }

    // MD5 加密密码
    const hashedPassword = createHash('md5').update(password).digest('hex');

    // 插入数据库，isActive 固定为 true
    const newUser = await sql.User.create({
        username: username,
        password: hashedPassword,
        email: email,
        isActive: true,
    });
    func.login(req, newUser.uuid);
    response(req, res, 200, {
        "message": "成功", "uuid": newUser.uuid
    });
});
// 用户登入
app.get("/api/user/login", async (req, res) => {
    if (func.logon(req).isLoggedIn) {
        response(req, res, 403, {status: "ALREADY_LOGGED_IN"});
        return;
    }
    let requirement = ["username", "password"];
    if (!func.parmasDetect(req.query, requirement)) {
        response(req, res, 400, {status: "BAD_REQUEST"});
        return;
    }
    const {username, password} = req.query;

    // MD5 加密密码
    const hashedPassword = createHash('md5').update(password).digest('hex');
    const user = await sql.User.findOne({
        where: {
            username: username, password: hashedPassword,
        },
        attributes: ['uuid'],
    });
    if (!user) {
        response(req, res, 401, {status: "INVALID_CREDENTIALS"});
        return;
    }

    func.login(req, user.uuid);
    response(req, res, 200, {
        "message": "成功", "uuid": user.uuid
    })
});
// 用户注销
app.post("/api/user/logout", async (req, res) => {
    if (!func.logon(req).isLoggedIn) {
        response(req, res, 401, {status: "INVALID_CREDENTIALS"});
        return;
    }
    func.logout(req);
    response(req, res, 200, {status: "SUCCESS"})
});

// 获得用户登陆状态
app.get("/api/user/check", async (req, res) => {
    response(req, res, 200, {
        status: "SUCCESS",
        isLogin: func.logon(req).isLoggedIn
    });
});
/* END OF 用户管理 */

export default app;