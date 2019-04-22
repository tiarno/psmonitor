'use strict';
const find = require('../utils').find;

exports.get_load = async function (req, res) {
    const query = {'server': req.params['machine']+'.example.com'};
    res.json( await find('monitor', query, null));
}
