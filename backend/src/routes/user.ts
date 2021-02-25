import { logger } from './../logger';
import {Router} from 'express';
import {user} from "../store/user"
import {connections} from "../store/connections"
import { UploadedFile } from 'express-fileupload';
import { saveAvatar } from '../service/dataService';
import { uuidv4 } from '../common';
import { config } from '../config/config';

const router = Router();

router.get('/getStatus', async(req, res) => {
    const isOnline = connections.getConnections().length ? true : false
    const status = user.getStatus()
    const avatar = user.getAvatar()
    const lastSeen = user.getLastSeen()
    const data = {
        status,
        avatar,
        isOnline,
        lastSeen
    }
    res.json(data);
})

router.get('/avatar/:avatarId', async(req, res) => {
    if(!req.params.avatarId){
        res.sendStatus(403)
    }
    let path = `/appdata/user/avatar-${req.params.avatarId}`
    res.download(path);
})

router.post('/avatar',async(req,resp)=>{
    const fileToSave = <UploadedFile>req.files.file
    const avatarId= uuidv4()
    saveAvatar(fileToSave.data,avatarId)
    let url = `https://${config.appId}/api/user/avatar/${avatarId}`
    if(config.userid == "localhost:3000"){
        url = `http://${config.userid}/api/user/avatar/${avatarId}`
    }
    user.updateAvatar(url)
    resp.status(200).json(url)
})

export default router
