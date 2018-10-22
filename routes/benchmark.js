var express = require('express');
var router = express.Router();
var benchmarksYaml = require('../utils/data/benchmarks-parser');
var solutionsParser = require('../utils/data/solutions-parser');

/* GET benchmark page. */
router.get('/:id', function (req, res) {
  var benchmarks = benchmarksYaml.getBenchmarks();

  var id = req.params.id;
  var benchmark = benchmarks.find(function (benchmark) {
    return benchmark.id == id;
  });
  if (benchmark == undefined) {
    res.render('pages/error.ejs', {title: 'Benchmark not found',
      message: 'That benchmark does not exist!', error: {
      status: '',
      stack: ''
    }});
  } else {
    var solutions = solutionsParser.getSolutions(benchmark.id);
    res.render('pages/benchmark', {
      title: 'Benchmark: ' + benchmark.name,
      benchmark: benchmark,
      solutions: solutions
    });
  }
  // TODO: also grab solution data by benchmark key
});

module.exports = router;
