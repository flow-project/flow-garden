var yaml = require('js-yaml');
var fs   = require('fs');

/* Get benchmark documents, or throw exception on error
 */
function getBenchmarks() {
  var benchmarksData = [];
  var benchmarksFolder = __dirname + '/../../data/benchmarks';
  try {
    fs.readdirSync(benchmarksFolder).forEach(function (file) {
      var doc = yaml.safeLoad(fs.readFileSync(benchmarksFolder + '/' + file, 'utf8'));
      // console.log(doc);
      doc.id = file.substr(0, file.length - 4); // strip .yml
      benchmarksData.push(doc);
    });
  } catch (e) {
    console.log(e);
  }
  return benchmarksData;
}

exports.getBenchmarks = getBenchmarks;
