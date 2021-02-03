import {Router} from 'express';

const router = Router();

router.get('/healthcheck', async(req, res) => {
    res.sendStatus(200);
})

export default router
