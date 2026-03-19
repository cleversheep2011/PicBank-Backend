/* 导入包(ES语法) */
import express from 'express';
import "express-async-errors";
import session from "express-session";

import * as uuid from "uuid"
import cors from 'cors';
import fs from "fs";
import moment from "moment";
import sharp from "sharp";

import * as func from "./common.mjs"
import {log, nantrans, query, response, sqlconn} from "./common.mjs"
import {conf} from "./config.mjs"
import * as worker_threads from "node:worker_threads";

import {waybill_update} from "./updater.mjs"
import {commandOptions} from "redis";


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
app.use(express.urlencoded({extended: true}))