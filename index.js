const request = require('request');
const cheerio = require('cheerio');
const argv = require('minimist')(process.argv.slice(2));

// the -c argument stands for channel. ie. -c https://youtube.com/user/ChannelName
const url = argv.c;
// the -f argument is a boolean value. If the app is being run for the first time then it needs to be set to true. ie. -f true
const first = argv.f;

// TODO: read from json file
const latestVideoDownloaded = "http://www.youtube.com/watch?v=Q1kmrl9s8u";

function getData(url) {
	request(url, (err, res, html) => {
		if(!err && res.statusCode == 200) {
			const $ = cheerio.load(html);
			
			// gets json data from a script tag. Note: this sometimes causes JSON.parse to crash the app.
			const data = $('script').get()[8].children[0].data;

			jsonParse(data);
		}
	});
}

function jsonParse(string) {
	try {
		const jsonData = JSON.parse(string);
		const latestVideo = jsonData.itemListElement[0].item.itemListElement[0].url;
		console.log(latestVideo);
		
		downloadVideo(latestVideo, first);
	} catch(e) {
		console.log("Try again... TODO: FIX THIS PROBLEM");
	}
}

function downloadVideo(videoUrl, first) {
	if(first === "true") { // If -f is true then write videoUrl to a json file and download the audio/video
		// TODO: write videoUrl to a json file
		// TODO: download video/audio
		console.log("first time running.. download the video");
	} else if(videoUrl == latestVideoDownloaded && first === "false") { // If videoUrl is the same as latestVideo then don't download
		console.log("do not dl")
	} else if(videoUrl != latestVideoDownloaded && first == "false"){ // If videoUrl is not the same as latestVideo then download
		console.log("download");
	}
}

getData(url);
