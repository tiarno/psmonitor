'use strict';
module.exports = function (app) {
  const tool = require('../controllers/toolController');
  app.route('/api/load/:machine')
    .get(tool.get_load);
}
