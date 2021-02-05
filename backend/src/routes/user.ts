import {Router} from 'express';
import {user} from "../store/user"
import {connections} from "../store/connections"

const router = Router();

router.get('/getStatus', async(req, res) => {
    const isOnline = connections.getConnections().length ? true : false
    const status = user.getStatus()
    const avatar = user.getAvatar()
    console.log(avatar)
    const data = {
        status,
        avatar,
        isOnline
    }
    res.json(data);
})

router.get('/avatar', async(req, res) => {
    const path = `/appdata/user/avatar`

    res.download(path);
})

export default router
