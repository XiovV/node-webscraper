# node-youtube-listener
node-youtube-listener is a basic NodeJS web scraper for youtube.
It's used for automatically downloading audio/video from latest videos on a YouTube channel. Every 2 hours (TODO: Make the interval optional) the script will check if a channel has uploaded a new video.

# How to use:
```
npm install
node index.js -c https://www.youtube.com/user/ChannelName -f true
```
# Command line arguments
* `-c` (channel) Specify a channel which the script should listen to.
* `-f` (first) It has to be set to true only when you run the script for the first time. If you're not running it for the first time then you can either set it to false or not type it at all.
* `-i` (interval) Specify how often the script should check for new YouTube videos. Value has to be specified in miliseconds (ie. `-i 1000` to check every 1 second). Default is 7200000ms (2 hours). Not implemented yet.

# Examples
* If you're running the script for the first time and if you want the script to download the latest video and keep checking for new videos on (ie. NewRetroWave) every hour:
`node index.js -c https://www.youtube.com/user/NewRetroWave -i 3600000 -f true`

PLEASE NOTE: use `-f true` ONLY if you're running the script for the first time!
 
