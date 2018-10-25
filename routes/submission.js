var express = require('express');
var router = express.Router();

const fs = require('fs');
const unzip = require('unzip');
var requestLib = require('request');
const { spawn } = require('child_process');

router.get('/', function(request, response) {
	response.send('Hello World');
});

router.post('/', function(request, response) {
	var answers = request.body;
	console.log(answers);
	var name = answers["Name"];
	var email = answers["Email"];
	// var fileURL = answers["Submission"];
	var fileURL = "https://drive.google.com/uc?export=download&id=" + answers["Submission"];
	var benchmark = answers["Benchmark"];

	console.log("Attempting download from: " + fileURL);
	requestLib(fileURL).on('response', function(fileResponse) {

		var fileName = "submission_" + (new Date()).toISOString();
		var file = fs.createWriteStream(fileName + ".zip");
		fileResponse.pipe(file);
		
		file.on('error', function (err) {
        	console.log("ERROR!: " + err);
    	});

		file.on('close', function() {
			console.log("Upload successful! Unzipping.")
			fs.createReadStream(fileName + ".zip")
				.pipe(unzip.Extract({ path: 'data/submissions/' + benchmark + '/' + fileName }))
				.on('close', function(e) {
					console.log("Finished unzipping! (" + e + ")")
					processFile(fileName, benchmark)
				})
		});
	});
	response.sendStatus(200)
})

// move following to /utils ?
function processFile(folderName, benchmark) {
	console.log("Retrieving reward for " + folderName)
	// call get_reward function with extracted config and controller function
	// get score back from reward function

	var callback = function(reward) {
		var file = fs.createWriteStream('data/submissions/' + benchmark + '/' + folderName + '/result.yml');
		file.write("score: " + reward);
		
		file.on('error', function (err) {
	    	console.log("ERROR!: " + err);
		});

		file.on('close', function() {
			console.log("Successfully wrote to result.yml.")
		});

		file.end();
	};

	retrieve_reward(folderName, callback);

	// Step 1. Read the input yaml config file that's placed in the folderName directory. Extract the environment file name and environment class name
			// For now, it might be worth it to just encode that as part of the Google Form for simplicity and avoidance of this extra step. In addition,
			// it might be worth it to simply pass these in as input params into the test_bm script ("python test_bm --benchmark='abc' --env-name=-test-'")

	// Step 2. Call test_bm(folderName). Jonathan's script should access the correct folder/solution_config.yaml file, or if we go with the alternate option,
			// should get the necessary input as command line args. His script should then output either an error (which I should pipe to a log file) 
			// or a successful reward value.

	// Step 3. If everything has succeeded thus far, I need to read the benchmarks/benchmark_name.yml file as an object, update the object with the newest score,
			// email, link to explanation, name, description, and then write back to the file. This will be used by Kevin's stuff.

}

function retrieve_reward(folderName, callback) {
	const cmd = spawn('python', ['utils/test_bm_placeholder.py', folderName]);

	var out = "";
	cmd.stdout.on('data', (data) => {
	  console.log(`stdout: ${data}`);
	  out += data.toString();
	});

	cmd.stderr.on('data', (data) => {
	  console.log(`stderr: ${data}`);
	});

	cmd.on('close', (code) => {
	  console.log(`child process exited with code ${code}`);
	  console.log("Reward: " + out);
	  callback(out);
	});

}

module.exports = router;
