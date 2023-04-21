"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.getResolvedPath = void 0;
var json_server_1 = require("json-server");
var uuid_1 = require("uuid");
var fs_1 = require("fs");
var path_1 = require("path");
var url_1 = require("url");
exports.getResolvedPath = function (filename) {
    var paths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        paths[_i - 1] = arguments[_i];
    }
    var _dirname = path_1.dirname(filename);
    var resolvedPath = path_1["default"].join.apply(path_1["default"], __spreadArrays([_dirname], paths));
    return resolvedPath;
};
var server = json_server_1["default"].create();
var _filename = url_1.fileURLToPath(import.meta.url);
var pathToDB = exports.getResolvedPath(_filename, 'db.json');
var middlewares = json_server_1["default"].defaults();
var port = 3000;
var router = json_server_1["default"].router(pathToDB);
server.use(middlewares);
server.use(json_server_1["default"].bodyParser);
// To imitate an actual API from which information comes with a delay
server.use(function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, new Promise(function (res) {
                    setTimeout(res, 800);
                })];
            case 1:
                _a.sent();
                next();
                return [2 /*return*/];
        }
    });
}); });
server.use(function (req, res, next) {
    if (req.method === 'POST') {
        req.body.id = uuid_1.v4();
        req.headers['content-type'] = 'application/json';
    }
    next();
});
server.post('/login', function (req, res) {
    try {
        var _a = req.body, username_1 = _a.username, password_1 = _a.password;
        var db = JSON.parse(fs_1["default"].readFileSync(pathToDB, 'utf8'));
        var _b = db.users, users = _b === void 0 ? [] : _b;
        var userFromBd = users.find(function (user) { return user.username === username_1 && user.password === password_1; });
        if (userFromBd) {
            return res.json(userFromBd);
        }
        return res.status(403).json({ message: 'User not found' });
    }
    catch (e) {
        console.error(e);
        return res.status(500).json({ message: e.message });
    }
});
// server.post('/users', (req, res) => {
//   try {
//     req.body.id = uuidv4();
//     res.writeHead(201, { 'Content-Type': 'application/json' });
//     const newUser =  JSON.stringify(req.body);
//     res.end(newUser);
//     fs.writeFileSync('./data/users.json', JSON.stringify([...data.users, req.body]));
//     return newUser;
//   } catch (error) {
//     res.writeHead(500, { 'Content-Type': 'application/json' });
//     res.end(JSON.stringify({ message: `Error creating user: ${error}` }));
//   }
// });
// server.use((req, res, next) => {
//   if (!req.headers.authorization) {
//     return res.status(403).json({ message: 'Authorisation failed!' });
//   }
//   next();
// });
server.use(router);
server.listen(port, function () {
    console.log("JSON Server is running on " + port);
});
