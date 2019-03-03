"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// npm
var dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: __dirname + '/.env' });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
// app init
var app = express_1.default();
app.use(body_parser_1.default.json({ limit: '50mb' }));
// api
var api_1 = __importDefault(require("./api"));
app.use('/api', api_1.default);
app.listen(process.env.PORT || 8000, function () { return console.log('Server running at selected port...'); });
