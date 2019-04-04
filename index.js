const request = require('request');
const cheerio = require('cheerio');
const argv = require('minimist')(process.argv.slice(1));

const url = argv.c;

function getData(url) {
	request(url, (err, res, html) => {
		if(!err && res.statusCode == 200) {
			const $ = cheerio.load(html);

			const data = $('script').get()[8].children[0].data;

			jsonParse(data);
		}
	});
}

function jsonParse(string) {
	try {
		const jsonData = JSON.parse(string);
		console.log(jsonData.itemListElement[0].item.itemListElement[0].url);
	} catch(e) {
		console.log("Try again... TODO: FIX THIS PROBLEM");
	}
}

getData(url);
