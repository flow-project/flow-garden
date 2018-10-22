
var yaml = require('js-yaml');
var fs   = require('fs');

var testSolnData = [
  {
    username: "flow-project",
    datetime: "2018-10-15-10:33PM",
    description: "",
    score: 2000
  },
  {
    username: "flow-project",
    datetime: "2018-10-15-10:33PM",
    description: "",
    score: 1000
  },
  {
    username: "flow-project",
    datetime: "2018-10-15-10:33PM",
    description: "",
    score: 3000
  },
];

/* Get benchmark documents, or throw exception on error
 */
function getSolutions(benchmarkId) {

  var solutions = [];

  // solutions = testSolnData;

  var benchmarkSolutionDir = __dirname + '/../../solutions/' + benchmarkId;
  try {
    fs.readdirSync(benchmarkSolutionDir).forEach(function (solDir) {
      var sol = yaml.safeLoad(fs.readFileSync(benchmarkSolutionDir + '/' + solDir + '/result.yml', 'utf8'));
      console.log(sol);
      solutions.push(sol);
    });
  } catch (e) {
    console.log(e);
  }

  // order solutions by score
  solutions.sort(function (sol1, sol2) {
      return sol1.score < sol2.score;
  });

  console.log(solutions);
  return solutions;
}

exports.getSolutions = getSolutions;
