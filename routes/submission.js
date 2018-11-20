var express = require('express');
var router = express.Router();
const fs = require('fs');
const unzip = require('unzip2');
const { spawn } = require('child_process');
const path = require('path');
const aws = require('aws-sdk');

router.get('/', function(request, response) {
	response.send('Hello World');
});

router.post('/', function(request, response) {
	var answers = request.body;
	console.log(answers);
	var name = answers["Name"];
	var email = answers["Email"];
	var fileID = answers["Upload"][0] + "";
	var benchmark = answers["Benchmark"];
	
	var fileName = "submission_" + (new Date()).toISOString();
	console.log("Attempting download from Google Drive: " + fileID + " to " + fileName);
	downloadFromDrive(fileID, benchmark, fileName, unzipAndProcess);
	response.sendStatus(200);
});

function unzipAndProcess(fileName, locationOfZip, benchmark) {
	console.log("Unzipping to submissions directory.");
	const fullPath = 'data/submissions/' + benchmark + '/' + fileName
	console.log("YUH: " + locationOfZip + " : " + fullPath)
	fs.createReadStream(locationOfZip)
	.pipe(unzip.Extract({ path: fullPath }))
	.on('close', function(e) {
		console.log("Finished unzipping!");
		retrieve_reward(fullPath);
	});
}

function downloadFromDrive(fileID, benchmark, fileName, unzipCallback) {
	const { google } = require('googleapis');
	const credentials  = require('./credentials.json');
	const token  = require('./token.json');

	const oAuth2Client = new google.auth.OAuth2(
		credentials.installed.client_id,
		credentials.installed.client_secret,
		credentials.installed.redirect_uris[0]
	);

	oAuth2Client.credentials = token;

	const drive = google.drive({
		version: 'v3',
		auth: oAuth2Client,
	});

	const zipDestination = 'data/' + fileName + ".zip";

	drive.files.get(
		{fileId: fileID, alt: 'media'}, 
		{responseType: 'stream'},
		function(err, res){
			res.data
			.on('end', () => {
				console.log("Successfully retrieved file (end event)!");
			})
			.on('error', err => {
				console.log('Error', err);
			})
			.pipe(fs.createWriteStream(zipDestination))
			.on('finish', function() {
				console.log("Successfully wrote file and then called callback (finish event)!");
				unzipCallback(fileName, zipDestination, benchmark);
				uploadFileToS3(zipDestination);
			});
		}
	);
}

function uploadFileToS3(file) {
	const keys = require('./aws_keys.json');
	aws.config.update({
		accessKeyId: keys.iam_user_key,
		secretAccessKey: keys.iam_user_secret,
	});

	var s3 = new aws.S3();
	const params = {
		Bucket: keys.bucket_name,
		Body: fs.createReadStream(file),
		Key: file
	};
	s3.upload(params, function (err, data) {
		if (err) { console.log("Error", err); }
		if (data) { console.log("Successfully uploaded " + file + " to bucket '" + keys.bucket_name + "'.");}
	})
}
 
function retrieve_reward(path) {
	console.log("Retrieving reward for " + path)

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
