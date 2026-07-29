const https = require('https');
https.get("https://football-logos.cc/turkey/", res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/src="(https:\/\/assets\.football-logos\.cc\/logos\/turkey\/256x256\/[^"]+basaksehir[^"]+)"/i);
    if(match) console.log(match[1]);
    else console.log("Not found in turkey page");
  });
});
