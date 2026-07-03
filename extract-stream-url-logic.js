async function check() {
  try {
    const res = await fetch('https://tipobettv263.com/channel?id=trt1', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const scriptIndex = html.indexOf('(function(){');
    if (scriptIndex !== -1) {
      const script = html.slice(scriptIndex);
      // Let's print the first 2000 characters of the script which contains the stream URL resolving logic
      console.log(script.slice(0, 2500));
    } else {
      console.log("Script not found");
    }
  } catch (err) {
    console.error("Error:", err);
  }
}
check();
