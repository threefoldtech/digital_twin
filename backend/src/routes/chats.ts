import {Router} from 'express';
import {appCallback, getAppLoginUrl} from "../service/authService";
import {chats} from "../store/chats";

const router = Router();

router.get("/", (req, res) => {
    const returnChats = chats.getAcceptedChats()
    console.log(returnChats)
    res.json(returnChats);
});

export default router
