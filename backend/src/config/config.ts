let userid = process.env.USER_ID || 'localhost:3000';
export const config = {
    appBackend: 'https://login.threefold.me',
    kycBackend: 'https://openkyc.live',
    appId: `${userid}.digitaltwin.jimbertesting.be`,
    seedPhrase: 'calm science teach foil burst until next mango hole sponsor fold bottom cousin push focus track truly tornado turtle over tornado teach large fiscal',
    baseDir: '/appdata/',
    userid,
}
