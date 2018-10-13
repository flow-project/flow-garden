var express = require('express');
var router = express.Router();
var benchmarksYaml = require('../utils/data/benchmarks-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  var benchmarks = benchmarksYaml.getBenchmarks();
  res.render('pages/index', { title: 'Flow Garden Website', benchmarks: benchmarks });
});

module.exports = router;
