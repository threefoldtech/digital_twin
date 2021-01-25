"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
let userid = process.env.USER_ID || 'jonasw';
exports.config = {
    appBackend: 'https://login.threefold.me',
    kycBackend: 'https://openkyc.live',
    appId: `${userid}.digitaltwin.jimbertesting.be`,
    seedPhrase: 'calm science teach foil burst until next mango hole sponsor fold bottom cousin push focus track truly tornado turtle over tornado teach large fiscal',
    userid,
};
