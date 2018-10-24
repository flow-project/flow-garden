
var yaml = require('js-yaml');
var fs   = require('fs');

var testSolnData = [
  {
    username: "flow-project",
    email: "flow@flower.org",
    datetime: "2018-10-15-10:33PM",
    score: 2000
  },
  {
    username: "flow-project",
    email: "flow@flower.org",
    datetime: "2018-10-15-10:33PM",
    score: 1000
  },
  {
    username: "flow-project",
    email: "flow@flower.org",
    datetime: "2018-10-15-10:33PM",
    score: 3000
  },
];

/* Gets solutions for some benchmark_id from /data/submissions/{benchmark_id}/{solution_timestamp}/

solution object becomes:
{
  (everything in solution_config),
  score: score from result.yml
  timestamp: timestamp from folder name
}

 */
function getSolutions(benchmarkId) {

  var solutions = [];

  // solutions = testSolnData;

  var benchmarkSolutionDir = __dirname + '/../../data/submissions/' + benchmarkId;
  try {
    fs.readdirSync(benchmarkSolutionDir).forEach(function (solDir) {
      var solConfig = yaml.safeLoad(fs.readFileSync(benchmarkSolutionDir + '/' + solDir + '/solution_config.yml', 'utf8'));
      var solResult = yaml.safeLoad(fs.readFileSync(benchmarkSolutionDir + '/' + solDir + '/result.yml', 'utf8'));
      
      solConfig.score = solResult.score
      solConfig.timestamp = solDir
      solutions.push(solConfig);
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
