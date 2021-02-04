import {Router} from 'express';
import {appCallback, getAppLoginUrl} from "../service/authService";
import {getAcceptedChats} from "../service/chatService";

const router = Router();

router.get("/", (req, res) => {
    const returnChats = getAcceptedChats()
    res.json(returnChats);
});

export default router
