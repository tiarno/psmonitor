'use strict';
const find = require('../utils').find;

exports.get_load = async function (req, res) {
    const server = 'localhost';
    const query = {'server': {server: req.params['machine']}};
    res.json( await find('monitor', query, null));
}
