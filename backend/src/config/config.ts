let userid = process.env.USER_ID || 'localhost:3000';
let appId = process.env.DIGITALTWIN_APPID || "digitaltwin.jimbertesting.be"
let myLocation = process.env.MyYggdrasilAddress || ""
export const config = {
    appBackend: 'https://login.threefold.me',
    kycBackend: 'https://openkyc.live',
    appId: `${userid}.${appId}`,
    seedPhrase: 'calm science teach foil burst until next mango hole sponsor fold bottom cousin push focus track truly tornado turtle over tornado teach large fiscal',
    baseDir: '/appdata/',
    userid,
    myLocation
}
