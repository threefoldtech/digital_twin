import {Router} from 'express';
import {user} from "../store/user"
import {connections} from "../store/connections"

const router = Router();

router.get('/getStatus', async(req, res) => {
    const isOnline = connections.getConnections().length ? true : false
    const status = user.getStatus()
    const data = {
        status,
        isOnline
    }
    res.json(data);
})

export default router
