const tfc = require('tfgrid-api-client')

const url = "wss://explorer.devnet.grid.tf/ws";
const owner_mnemo = "airport olympic door inside spider harbor develop square present manage obey toward";
const bot_mnemo = "maid major gossip speak thank disagree blame museum slide canvas trash submit";
const bot_ipv6 = "200:b57d:d1f0:aad3:71f3:bf:232:9c4";

function client_get(url, mnemonic) {
    const cli = new tfc(url, mnemonic)
    cli.init()

    return cli
}

// global tfclient
const tfclient = client_get(url, bot_mnemo);
const tfowner = client_get(url, owner_mnemo);

const express = require('express');
const router = express.Router();
const path = require('path');
const app = express();
const clusters = require('./clusters.js');

const tferrors = {
    1: 'StorageOverflow',
    2: 'CannotCreateNode',
    3: 'NodeNotExists',
    4: 'NodeWithPubkeyExists',
    5: 'CannotDeleteNode',
    6: 'FarmExists',
    7: 'FarmNotExists',
    8: 'CannotCreateFarmWrongTwin',
    9: 'CannotDeleteFarm',
    10: 'CannotDeleteFarmWrongTwin',
    11: 'EntityWithNameExists',
    12: 'EntityWithPubkeyExists',
    13: 'EntityNotExists',
    14: 'EntitySignatureDoesNotMatch',
    15: 'EntityWithSignatureAlreadyExists',
    16: 'CannotUpdateEntity',
    17: 'CannotDeleteEntity',
    18: 'TwinExists',
    19: 'TwinNotExists',
    20: 'CannotCreateTwin',
    21: 'UnauthorizedToUpdateTwin',
    22: 'PricingPolicyExists',
    23: 'CertificationCodeExists',
    24: 'OffchainSignedTxError',
    25: 'NoLocalAcctForSigning'
}

function events(content, res, okcode) {
    if(content instanceof Error)
        return json_error(res, content);

    const { events = [], status } = content
    console.log(`Current status is ${status.type}`)
    let code = okcode;

    var result = null;

    if(status.isFinalized) {
        console.log(`Transaction included at blockHash ${status.asFinalized}`)

        // Loop through Vec<EventRecord> to display all events
        events.forEach(({ phase, event: { data, method, section } }) => {
            console.log(`>> ${phase}: ${section}.${method}:: ${data}`);

            console.log(data);

            // skip if result is already set
            if(result != null)
                return;

            // error
            if(section == "system" && method == "ExtrinsicFailed") {
                code = 422; // Error code

                let module = data[0].asModule;

                let errid = module['error']['words'][0];
                let errmsg = "unknown";

                if(errid in tferrors)
                    errmsg = tferrors[errid];

                // node already exists, not an error
                if(errmsg == "NodeWithPubkeyExists")
                    code = 304; // Not Modified

                result = {
                    success: false,
                    error: errmsg,
                    errno: errid,
                };
            }

            // success
            if(section == "tfgridModule") {
                result = {
                    success: true,
                    message: method,
                    id: data[1]['words'][0],
                };
            }
        })

        res.status(code).json(result);
    }
}

function fields_validate(required, body) {
    for(var i in required) {
        if(!(required[i] in body))
            return required[i]
    }

    return true
}

function json_error(res, msg) {
    console.log(msg);
    return res.status(422).json({ success: false, message: msg });
}

//
// entities
//

router.post('/entities', function(req, res) {
    let required = ['name', 'country', 'city'];

    if((value = fields_validate(required, req.body)) !== true)
        return json_error(res, "Required field: " + value);

    let name = req.body['name']
    let country = req.body['country'];
    let city = req.body['city'];

    tfclient.createEntity(name, country, city, (content) => {
        events(content, res, 201);

    }).catch(err => { json_error(res, err) })
})

router.get('/entities', function(req, res) {
    tfclient.listEntities().then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

router.get('/entities/:id', function(req, res) {
    tfclient.getEntityByID(req.params.id).then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

router.delete('/entities', function(req, res) {
    tfclient.deleteEntity((content) => {
        events(content, res, 200);

    }).catch(err => { json_error(res, err) })
})

router.put('/entities/:id', function(req, res) {
    // TODO: update entity
});


//
// twins
//

router.post('/twins', function(req, res) {
    tfclient.createTwin(bot_ipv6, (content) => {
        events(content, res, 201);

    }).catch(err => { json_error(res, err) })
})

router.get('/twins', function(req, res) {
    tfclient.listTwins().then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

router.get('/twins/:id', function(req, res) {
    tfclient.getTwinByID(req.params.id).then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

router.delete('/twins/:id', function(req, res) {
    tfclient.deleteTwin(parseInt(req.params.id), (content) => {
        events(content, res, 200);

    }).catch(err => { json_error(req, err) })
})

router.post('/twins/:id/entities', function(req, res) {
    let required = ['signature', 'entity'];

    if((value = fields_validate(required, req.body)) !== true)
        return json_error(res, "Required field: " + value);

    let signature = req.body['signature'];
    let entity = parseInt(req.body['entity']);

    tfclient.addTwinEntity(parseInt(req.params.id), entity, signature, (content) => {
        events(content, res, 201);

    }).catch(err => { json_error(req, err) })
})

router.delete('/twins/:tid/entities/:eid', function(req, res) {
    tfclient.removeTwinEntity(parseInt(req.params.tid), parseInt(req.params.eid), (content) => {
        events(content, res, 200);

    }).catch(err => { json_error(req, err) })
})

//
// farms
//

router.get('/farms', function(req, res) {
    tfclient.listFarms().then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

router.get('/farms/:id', function(req, res) {
    tfclient.getFarmByID(req.params.id).then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

router.post('/farms', function(req, res) {
    let required = ['name', 'entity', 'twin', 'country', 'city', 'policy'];

    if((value = fields_validate(required, req.body)) !== true)
        return json_error(res, "Required field: " + value);

    var name = req.body['name'];
    var entityid = req.body['entity'];
    var twinid = req.body['twin'];
    var country = req.body['country'];
    var city = req.body['city'];
    var policy = req.body['policy'];

    certificationType = tfclient.api.createType('CertificationType', 0)
    const farm = {
        name: name,
        entity_id: entityid,
        twin_id: twinid,
        pricingPolicyID: policy,
        certificationType: certificationType,
        country_id: country,
        city_id: city
    }

    console.log(farm);

    tfclient.createFarm(farm, (content) => {
        events(content, res, 201);

    }).catch(err => { json_error(res, err) })
})

router.delete('/farms/:id', function(req, res) {
    tfclient.deleteFarm(parseInt(req.params.id), (content) => {
        events(content, res, 200);

    }).catch(err => { json_error(res, err) })
})



//
// nodes
//

router.get('/nodes', function(req, res) {
    tfclient.listNodes().then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

router.get('/nodes/:id', function(req, res) {
    tfclient.getNodeByID(req.params.id).then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

router.post('/nodes', function(req, res) {
    var required = ['farm_id', 'node_id', 'capacity', 'location'];

    if((value = fields_validate(required, req.body)) !== true)
        return json_error(res, "Required field: " + value);

    var required = ['cru', 'mru', 'sru', 'hru'];

    if((value = fields_validate(required, req.body['capacity'])) !== true)
        return json_error(res, "Required field: " + value);

    var required = ['longitude', 'latitude'];

    if((value = fields_validate(required, req.body['location'])) !== true)
        return json_error(res, "Required field: " + value);

    let resources = tfclient.api.createType('Resources', req.body['capacity'])

    let location = tfclient.api.createType('Location', {
        latitude: req.body['location']['latitude'].toString(),
        longitude: req.body['location']['longitude'].toString(),
    })

    let node = {
        farm_id: req.body['farm_id'],
        pub_key: req.body['node_id'],
        twin_id: 1, // FIXME
        resources,
        location,
        country_id: 0,
        city_id: 0,
        role: "Node"
    }

    tfclient.createNode(node, (content) => {
        events(content, res, 201);

    }).catch(err => { json_error(res, err) })
})

router.delete('/nodes/:id', function(req, res) {
    tfclient.deleteNode(parseInt(req.params.id), (content) => {
        events(content, res, 200);

    }).catch(err => { json_error(res, err) })
})

//
// gateway
//
router.post('/gateways', function(req, res) {
    var required = ['farm_id', 'node_id', 'capacity', 'location'];

    if((value = fields_validate(required, req.body)) !== true)
        return json_error(res, "Required field: " + value);

    var required = ['cru', 'mru', 'sru', 'hru'];

    if((value = fields_validate(required, req.body['capacity'])) !== true)
        return json_error(res, "Required field: " + value);

    var required = ['longitude', 'latitude'];

    if((value = fields_validate(required, req.body['location'])) !== true)
        return json_error(res, "Required field: " + value);

    let resources = tfclient.api.createType('Resources', req.body['capacity'])

    let location = tfclient.api.createType('Location', {
        latitude: req.body['location']['latitude'].toString(),
        longitude: req.body['location']['longitude'].toString(),
    })

    let node = {
        farm_id: req.body['farm_id'],
        pub_key: req.body['node_id'],
        twin_id: 1, // FIXME
        resources,
        location,
        country_id: 0,
        city_id: 0,
        role: "Gateway"
    }

    tfclient.createNode(node, (content) => {
        events(content, res, 201);

    }).catch(err => { json_error(res, err) })
})


//
// account
//

router.get('/account/price', function(req, res) {
    tfclient.getPrice().then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})


router.get('/account/balance', function(req, res) {
    tfclient.getBalance().then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

//
// owner signing debug
//

router.post('/debug/entities', function(req, res) {
    let required = ['name', 'country', 'city'];

    if((value = fields_validate(required, req.body)) !== true)
        return json_error(res, "Required field: " + value);

    let name = req.body['name']
    let country = req.body['country'];
    let city = req.body['city'];

    tfowner.createEntity(name, country, city, (content) => {
        events(content, res, 201);

    }).catch(err => { json_error(res, err) })
})


router.get('/debug/cluster/:name', function(req, res) {
    clusters.findByName(clusters.rootpath, req.params.name).then((content) => {
        console.log(content);
        res.json(content);
    });
})


router.post('/debug/sign', function(req, res) {
    let required = ['entity', 'twin'];

    if((value = fields_validate(required, req.body)) !== true)
        return json_error(res, "Required field: " + value);

    let entity = parseInt(req.body['entity']);
    let twin = parseInt(req.body['twin']);

    tfowner.sign(entity, twin).then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})


//
// clusters
//

router.get('/clusters', function(req, res) {
    clusters.list(clusters.rootpath).then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

router.post('/clusters', function(req, res) {
    let required = ['name', 'secret', 'ipv4', 'ipv6']

    if((value = fields_validate(required, req.body)) !== true)
        return json_error(res, "Required field: " + value);

    let filename = req.body['name'];
    if(!filename.match(/^[0-9a-zA-Z\._-]*$/))
        return json_error(res, "Invalid cluster name: only alpha, number, period, underscore and dash allowed");

    let fullpath = path.join(clusters.rootpath, filename + ".json");
    const apath = path.resolve(fullpath);

    clusters.put(apath, req.body).then((content) => {
        res.status(201).json(content);

    }, (err) => { json_error(res, err.message); })
})

router.get('/clusters/:id', function(req, res) {
    let fullpath = path.join(clusters.rootpath, req.params.id + ".json");
    const apath = path.resolve(fullpath);

    clusters.get(apath).then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

router.delete('/clusters/:id', function(req, res) {
    let fullpath = path.join(clusters.rootpath, req.params.id + ".json");
    const apath = path.resolve(fullpath);

    clusters.remove(apath).then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})

router.put('/clusters/:id', function(req, res) {
    let fullpath = path.join(clusters.rootpath, req.params.id + ".json");
    const apath = path.resolve(fullpath);

    clusters.put(apath, req.body).then((content) => {
        res.json(content);

    }, (err) => { json_error(res, err.message); })
})


module.exports = router
