import {Router} from 'express';
import {appCallback, getAppLoginUrl} from "../service/authService";
import {chats} from "../store/chats";
import {getAcceptedChats} from "../service/chatService";

const router = Router();

router.get("/", (req, res) => {
    const returnChats = getAcceptedChats()
    console.log(returnChats)
    res.json(returnChats);
});

export default router
