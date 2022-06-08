import { readFile, writeFile } from "fs";
import { createInterface } from "readline";
import { google } from "googleapis";

const SCOPES = [
	"https://www.googleapis.com/auth/calendar",
	"https://www.googleapis.com/auth/calendar.events",
];

const TOKEN_PATH = "token.json";

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback, params) {
	const { client_secret, client_id, redirect_uris } = credentials.installed;
	const oAuth2Client = new google.auth.OAuth2(
		client_id,
		client_secret,
		redirect_uris[0]
	);

	// Check if we have previously stored a token.
	readFile(TOKEN_PATH, (err, token) => {
		if (err) return getAccessToken(oAuth2Client, callback);
		oAuth2Client.setCredentials(JSON.parse(token));
		callback(oAuth2Client, params);
	});
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
	const authUrl = oAuth2Client.generateAuthUrl({
		access_type: "offline",
		scope: SCOPES,
	});
	console.log("Authorize this app by visiting this url:", authUrl);
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout,
	});
	rl.question("Enter the code from that page here: ", (code) => {
		rl.close();
		oAuth2Client.getToken(code, (err, token) => {
			if (err) return console.error("Error retrieving access token", err);
			oAuth2Client.setCredentials(token);
			// Store the token to disk for later program executions
			writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
				if (err) return console.error(err);
				console.log("Token stored to", TOKEN_PATH);
			});
			callback(oAuth2Client);
		});
	});
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listEvents(auth) {
	const calendar = google.calendar({ version: "v3", auth });
	calendar.events.list(
		{
			calendarId: "mbriv38l1eiailglvj172un7js@group.calendar.google.com",
			timeMin: new Date().toISOString(),
			maxResults: 10,
			singleEvents: true,
			orderBy: "startTime",
		},
		(err, res) => {
			if (err) return console.log("The API returned an error: " + err);
			const events = res.data.items;
			if (events.length) {
				console.log("Upcoming 10 events:");
				events.map((event, i) => {
					const start = event.start.dateTime || event.start.date;
					console.log(`${start} - ${event.summary}`);
				});
			} else {
				console.log("No upcoming events found.");
			}
		}
	);
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function insertEvent(auth, event) {
	const calendar = google.calendar({ version: "v3", auth });

	calendar.events.insert(
		{
			auth: auth,
			calendarId: "mbriv38l1eiailglvj172un7js@group.calendar.google.com",
			resource: event,
		},
		function (err, event) {
			if (err) {
				console.log(
					"There was an error contacting the Calendar service: " + err
				);
				return;
			}
			console.log("Event created: %s", event.data.htmlLink);
		}
	);
}

function getEvents() {
	// Load client secrets from a local file.
	readFile("credentials.json", (err, content) => {
		if (err) return console.log("Error loading client secret file:", err);
		// Authorize a client with credentials, then call the Google Calendar API.
		authorize(JSON.parse(content), listEvents, null);
	});
}

function createEvent(event) {
	// Load client secrets from a local file.
	readFile("credentials.json", (err, content) => {
		if (err) return console.log("Error loading client secret file:", err);
		// Authorize a client with credentials, then call the Google Calendar API.
		authorize(JSON.parse(content), insertEvent, event);
	});
}

export { getEvents, createEvent };
