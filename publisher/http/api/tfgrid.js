const tfc = require('tfgrid-api-client')

const url = "wss://tfgrid.tri-fold.com";
const mnemo = "airport olympic door inside spider harbor develop square present manage obey toward";

function client_get(url, mnemonic) {
    const cli = new tfc(url, mnemonic)
    cli.init()

    return cli
}

// global tfclient
const tfclient = client_get(url, mnemo);

var express = require('express');
var router = express.Router();
var app = express();

function events(content, res) {
    if(content instanceof Error) {
        res.status(422).json({ message: `${content}` });
        console.log(content)
        return;
    }

    const { events = [], status } = content
    console.log(`Current status is ${status.type}`)

    var result = null;

    if(status.isFinalized) {
        console.log(`Transaction included at blockHash ${status.asFinalized}`)

        // Loop through Vec<EventRecord> to display all events
        events.forEach(({ phase, event: { data, method, section } }) => {
            // res.json(content);
            console.log(`\t' ${phase}: ${section}.${method}:: ${data}`)
            if(result == null)
                result = `${section}.${method} -> ${data}`;
        })

        res.status(422).json({ message: result });
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
        events(content, res);

    }).catch(err => { json_error(res, err) })
})

router.get('/entities', function(req, res) {
    tfclient.listEntities().then((content) => {
        res.json(content);
    }, (err) => {
        res.status(422).json({ message: `${err}` });
    })
})

router.get('/entities/:id', function(req, res) {
    tfclient.getEntityByID(req.params.id).then((content) => {
        res.json(content);
    }, (err) => {
        res.status(422).json({ message: `${err}` });
    })
})

router.delete('/entities/:id', function(req, res) {
    tfclient.deleteEntity(parseInt(req.params.id), (content) => {
        events(content, req);

    }).catch(err => { json_error(res, err) })
})

router.put('/entities/:id', function(req, res) {
    // TODO: update entity
});


//
// twins
//

router.post('/twins', function(req, res) {
    tfclient.createTwin((content) => {
        events(content, res);

    }).catch(err => { json_error(res, err) })
})

router.get('/twins', function(req, res) {
    tfclient.listTwins().then((content) => {
        res.json(content);
    }, (err) => {
        res.status(422).json({ message: `${err}` });
    })
})

router.get('/twins/:id', function(req, res) {
    tfclient.getTwinByID(req.params.id).then((content) => {
        res.json(content);
    }, (err) => {
        res.status(422).json({ message: `${err}` });
    })
})

router.delete('/twins/:id', function(req, res) {
    tfclient.deleteTwin(parseInt(req.params.id), (content) => {
        events(content, req);

    }).catch(err => { json_error(req, err) })
})

router.post('/twins/:id/entities', function(req, res) {
    // tfclient.addTwinEntity(twinID, entityID, signature, callback)
    // TODO: add twin entity (signature)
})

router.delete('/twins/:tid/entities/:eid', function(req, res) {
    tfclient.removeTwinEntity(parseInt(req.params.tid), parseInt(req.params.eid), (content) => {
        events(content, req);

    }).catch(err => { json_error(req, err) })
})

//
// farms
//

router.get('/farms', function(req, res) {
    tfclient.listFarms().then((content) => {
        res.json(content);
    }, (err) => {
        res.status(422).json({ message: `${err}` });
    })
})

router.get('/farms/:id', function(req, res) {
    tfclient.getFarmByID(req.params.id).then((content) => {
        res.json(content);
    }, (err) => {
        res.status(422).json({ message: `${err}` });
    })
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
        events(content, res);

    }).catch(err => { json_error(res, err) })
})

router.delete('/farms/:id', function(req, res) {
    tfclient.deleteFarm(parseInt(req.params.id), (content) => {
        events(content, req);

    }).catch(err => { json_error(res, err) })
})



//
// nodes
//

router.get('/nodes', function(req, res) {
    tfclient.listNodes().then((content) => {
        res.json(content);
    }, (err) => {
        res.status(422).json({ message: `${err}` });
    })
})

router.get('/nodes/:id', function(req, res) {
    tfclient.getNodeByID(req.params.id).then((content) => {
        res.json(content);
    }, (err) => {
        res.status(422).json({ message: `${err}` });
    })
})

router.post('/nodes', function(req, res) {
    let resources = tfclient.api.createType('Resources', {
        hru: 2000,
        sru: 5000,
        cru: 16,
        mru: 64
    })

    let location = tfclient.api.createType('Location', {
        longitude: '4.349970',
        latitude: '50.845080'
    })

    let node = {
        id: 0,
        farm_id: 1,
        twin_id: 1,
        resources,
        location,
        country_id: 0,
        city_id: 0
    }

    tfclient.createNode(node, (content) => {
        events(content, res);

    }).catch(err => { json_error(res, err) })
})

router.delete('/nodes/:id', function(req, res) {
    tfclient.deleteNode(parseInt(req.params.id), (content) => {
        events(content, req);

    }).catch(err => { json_error(res, err) })
})

router.get('/account/price', function(req, res) {
    tfclient.getPrice().then((content) => {
        res.json(content);
    }, (err) => {
        res.status(422).json({ message: `${err}` });
    })
})


router.get('/account/balance', function(req, res) {
    tfclient.getBalance().then((content) => {
        res.json(content);
    }, (err) => {
        res.status(422).json({ message: `${err}` });
    })
})

module.exports = router
