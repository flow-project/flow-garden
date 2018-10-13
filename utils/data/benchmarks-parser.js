var yaml = require('js-yaml');
var fs   = require('fs');

var testData = [
  {
    id: "b01",
    name: "inflow-no-control",
    description: "The goal of this benchmark is to examine how autonomous vehicles can be used to control traffic passing through a bottleneck/capacity drop.",
    yt_string: "Lggtw9AOH0A"
  },
  {
    id: "b02",
    name: "benchmark-2",
    description: "The goal of this benchmark is to examine how autonomous vehicles can be used to control traffic passing through a bottleneck/capacity drop.",
    yt_string: "Lggtw9AOH0A"
  },
  {
    id: "b03",
    name: "benchmark-3",
    description: "The goal of this benchmark is to examine how autonomous vehicles can be used to control traffic passing through a bottleneck/capacity drop.",
    yt_string: "Lggtw9AOH0A"
  }
];

/* Get benchmark documents, or throw exception on error
 */
function getBenchmarks() {
  var benchmarksData = [];
  var testFolder = __dirname + '/../../data/benchmarks';
  try {
    fs.readdirSync(testFolder).forEach(function (file) {
      var doc = yaml.safeLoad(fs.readFileSync(testFolder + '/' + file, 'utf8'));
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
