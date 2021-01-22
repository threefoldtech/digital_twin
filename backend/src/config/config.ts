let userid = process.env.USER_ID || 'jonasw';
export const config = {
    appBackend: 'https://login.staging.jimber.org',
    kycBackend: 'https://openkyc.staging.jimber.org',
    appId: `${userid}.digitaltwin.jimbertesting.be`,
    seedPhrase: 'calm science teach foil burst until next mango hole sponsor fold bottom cousin push focus track truly tornado turtle over tornado teach large fiscal',
    userid,
}
