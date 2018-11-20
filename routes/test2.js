const fileID = "";
const fileName = "";
const fs = require('fs');
const { google } = require('googleapis');
const client  = require('./client_id.json');
const credentials  = require('./credentials.json');
const path = require('path');

const oAuth2Client = new google.auth.OAuth2(
	credentials.installed.client_id,
	credentials.installed.client_secret,
	credentials.installed.redirect_uris[0]
);

oAuth2Client.credentials = require('./token.json');

const drive = google.drive({
	version: 'v3',
	auth: oAuth2Client,
});

const zipDestination = '../data/' + fileName + ".zip";

drive.files.get(
	{fileId: fileID, alt: 'media'}, 
	{responseType: 'stream'},
	function(err, res){
		res.data
		.on('end', () => {
			console.log("Successfully retrieved file!");
		})
		.on('error', err => {
			console.log('Error', err);
		})
		.pipe(fs.createWriteStream(zipDestination));
	}
);
