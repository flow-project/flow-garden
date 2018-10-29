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

	console.log("Attempting download from Google Drive: " + fileURL);
	requestLib(fileURL).on('response', function(fileResponse) {

		var fileName = "submission_" + (new Date()).toISOString();
		var file = fs.createWriteStream('data/' + fileName + ".zip");
		fileResponse.pipe(file);
		
		file.on('error', function (err) {
        	console.log("ERROR!: " + err);
    	});

		file.on('close', function() {
			console.log("Upload successful! Unzipping to submissions directory.")
			const fullPath = 'data/submissions/' + benchmark + '/' + fileName
			fs.createReadStream('data/' + fileName + ".zip")
				.pipe(unzip.Extract({ path: fullPath }))
				.on('close', function(e) {
					console.log("Finished unzipping!")
					processFile(fullPath, benchmark)
				})
		});
	});
	response.sendStatus(200)
})

function processFile(path, benchmark) {
	console.log("Retrieving reward for " + path)
	retrieve_reward(path);
}
 
function retrieve_reward(path) {
	const cmd = spawn('python', ['utils/test_bm.py', path]);

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
	  console.log("Output:\n" + out);
	});
}

module.exports = router;
