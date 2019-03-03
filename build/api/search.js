"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var axios_1 = __importDefault(require("axios"));
exports.router = express_1.default.Router();
exports.router.get('/', function (req, resp) {
    if (!req.query)
        return resp.json({ results: [] });
    var error = { status: 500, msg: 'Database error' };
    var queryString = '?' + [
        "api_key=" + process.env.GIANT_BOMB_API_KEY,
        'format=json',
        "query=" + req.query.searchTerm
    ].join('&');
    axios_1.default.get("https://www.giantbomb.com/api/search/" + queryString).then(function (resp) {
        if (!resp) {
            error = { status: 404, msg: 'No results from Giant Bomb' };
            throw new Error();
        }
        console.log(resp);
    }).catch(function (e) { return resp.status(error.status).send(error.msg); });
});
