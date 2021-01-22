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
Object.defineProperty(exports, "__esModule", { value: true });
exports.appCallback = exports.getAppLoginUrl = void 0;
const config_1 = require("../config/config");
const threefold_login_1 = require("@threefoldjimber/threefold_login");
const dist_1 = require("@threefoldjimber/threefold_login/dist");
const getAppLoginUrl = (request, redirectUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const login = new threefold_login_1.ThreefoldLogin(config_1.config.appBackend, config_1.config.appId, config_1.config.seedPhrase, redirectUrl, config_1.config.kycBackend);
    yield login.init();
    const loginState = dist_1.generateRandomString();
    console.log(request.session);
    request.session.state = loginState;
    console.log(request.session.state);
    return login.generateLoginUrl(loginState);
});
exports.getAppLoginUrl = getAppLoginUrl;
const appCallback = (request) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const login = new threefold_login_1.ThreefoldLogin(config_1.config.appBackend, config_1.config.appId, config_1.config.seedPhrase, '', // No callback needed
    config_1.config.kycBackend);
    yield login.init();
    const redirectUrl = new URL(request.protocol + '://' + request.get('host') + request.originalUrl);
    try {
        console.log(request.session);
        console.log(request.session.state);
        // @ts-ignore
        const profileData = (_a = (yield login.parseAndValidateRedirectUrl(redirectUrl, request.session.state))) === null || _a === void 0 ? void 0 : _a.profile;
        delete request.session.state;
        const doubleName = profileData.doubleName;
        let userId = doubleName.replace(".3bot", "");
        if (userId !== config_1.config.userid) {
            return '/unauthorized';
        }
        request.session.userId = userId;
        return '/callback';
    }
    catch (e) {
        throw new Error(e.message);
    }
});
exports.appCallback = appCallback;