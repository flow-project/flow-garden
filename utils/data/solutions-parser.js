
var yaml = require('js-yaml');
var fs   = require('fs');

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

  var benchmarkSolutionDir = __dirname + '/../../data/submissions/' + benchmarkId;
  try {
    fs.readdirSync(benchmarkSolutionDir).forEach(function (solDir) {
      var solConfig = yaml.safeLoad(fs.readFileSync(benchmarkSolutionDir + '/' + solDir + '/solution_config.yml', 'utf8'));
      var solResult = yaml.safeLoad(fs.readFileSync(benchmarkSolutionDir + '/' + solDir + '/result.yml', 'utf8'));
      
      solConfig.score = solResult.score;
      solConfig.timestamp = solDir;
      solutions.push(solConfig);
    });
  } catch (e) {
    console.log(e);
  }

  // order solutions by score
  solutions.sort(function (sol1, sol2) {
      return sol1.score < sol2.score;
  });

  return solutions;
}

exports.getSolutions = getSolutions;
