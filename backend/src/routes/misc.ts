import {Router} from 'express';
import {MessageTypes} from "../types";

const router = Router();

router.get('/healthcheck', async(req, res) => {
    res.sendStatus(200);
})

router.get('/possibleMessages', async(req, res) => {
    res.json(MessageTypes)
})

export default router
