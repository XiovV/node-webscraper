const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const argv = require('minimist')(process.argv.slice(2));
const youtubedl = require('youtube-dl');

// the -c argument stands for channel. ie. -c https://youtube.com/user/ChannelName
const url = argv.c;
// the -f argument is a boolean value. If the app is being run for the first time then it needs to be set to true. ie. -f true
const first = argv.f;
let fileName = "";
// TODO: use fs.readFile
const latestVideoDownloaded = require('./latest_downloaded.json').latestVideoDownloaded;

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
	// TODO: Fix infinite loop
	while(true) {
		try {
			const jsonData = JSON.parse(string);
			const latestVideo = jsonData.itemListElement[0].item.itemListElement[0].url;
			console.log(`latestVideo: ${latestVideo} \n latestVideoDownloaded:$ ${latestVideoDownloaded}`);
			downloadVideo(latestVideo, first);
			break;
		} catch(e) {
			console.log("There was an error. Trying again...");
		}
	}
}

function downloadVideo(videoUrl, first) {
	if(first === "true") { // If -f is true then write videoUrl to a json file and download the audio/video
		writeLatestVideoDownloaded(videoUrl);
		getVideoData(videoUrl);
	} else if(videoUrl == latestVideoDownloaded && (first === "false" || first == undefined)) { // If videoUrl is the same as latestVideo then don't download
		console.log("do not dl");
		setTimeout(getData, 2000, url);
	} else if(videoUrl != latestVideoDownloaded && (first == "false" || first == undefined)){ // If videoUrl is not the same as latestVideo then download
		writeLatestVideoDownloaded(videoUrl);
		console.log("download");
	}
}


async function getVideoData(videoUrl) {
	let video = await youtubedl(videoUrl);
  
        video.on('info', info => {
        	console.log(`Download started for ${info._filename} \n File size: ${(info.size/1048626.62057).toFixed(2)}MB`);
		fileName = info._filename;
		try {
			video.pipe(fs.createWriteStream(fileName));
			console.log("Finished downlading");
		} catch(e) {
			console.log(e);
		}
        });

}

function writeLatestVideoDownloaded(videoUrl) {
	fs.writeFile("./latest_downloaded.json", JSON.stringify({latestVideoDownloaded: videoUrl}), (err) => {
		if (err) console.log(err);
		console.log(`${videoUrl} has been written to latest_downloaded.json`);
	});
}

getData(url);
