const fs = require('fs');
const https = require('https');

const url = "https://prod20509.fssb.io/api/sportscenter/carousels/featured-matches/events?language=TR&customerLevel=0&draft=false&epoEnabled=true";

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        try {
            const json = JSON.parse(data);
            fs.writeFileSync('sekabet_sample.json', JSON.stringify(json, null, 2));
            console.log("Saved to sekabet_sample.json");
            console.log("Total events:", json.length || (json.items && json.items.length) || "unknown");
        } catch (e) {
            console.error("Error parsing JSON", e);
        }
    });
}).on('error', err => {
    console.error("Error:", err.message);
});
