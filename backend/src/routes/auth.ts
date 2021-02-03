import {Router} from 'express';
import {appCallback, getAppLoginUrl} from "../service/authService";

const router = Router();

router.get('/signin', async (request, response) => {
    const loginUrl = await getAppLoginUrl(request, `/api/auth/callback`);
    response.redirect(loginUrl);
});

router.get('/callback', async (request, response) => {
    const callback = await appCallback(request);
    response.redirect(callback);
});

export default router
