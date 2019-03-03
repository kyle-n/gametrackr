"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var discover_1 = __importDefault(require("./discover"));
var list_1 = __importDefault(require("./list"));
var review_1 = __importDefault(require("./review"));
var search_1 = __importDefault(require("./search"));
var user_1 = __importDefault(require("./user"));
// check JWT middleware
var express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
exports.router.use('/discover', discover_1.default);
exports.router.use('/list', list_1.default);
exports.router.use('/review', review_1.default);
exports.router.use('/search', search_1.default);
exports.router.use('/user', user_1.default);
