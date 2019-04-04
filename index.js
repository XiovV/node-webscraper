const request = require('request');
const cheerio = require('cheerio');
const argv = require('minimist')(process.argv.slice(1));

// get the -c command line argument
const url = argv.c;

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
	} catch(e) {
		console.log("Try again... TODO: FIX THIS PROBLEM");
	}
}

getData(url);
