"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var discover_1 = __importDefault(require("./discover"));
var list_1 = __importDefault(require("./list"));
var review_1 = __importDefault(require("./review"));
var search_1 = __importDefault(require("./search"));
var user_1 = __importDefault(require("./user"));
// check JWT middleware
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.use('/discover', discover_1.default);
router.use('/list', list_1.default);
router.use('/review', review_1.default);
router.use('/search', search_1.default);
router.use('/user', user_1.default);
module.exports = router;
