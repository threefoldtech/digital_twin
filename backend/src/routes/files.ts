import {Router} from 'express';
import {user} from "../store/user"
import {connections} from "../store/connections"

const router = Router();

router.get('/:chatid/:name', async(req, res) => {

    const path = `/appdata/chats/${req.params.chatid}/files/${req.params.name}`

    res.download(path);
})

export default router
