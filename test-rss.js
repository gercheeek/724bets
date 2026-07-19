import Parser from 'rss-parser';
async function test() {
  const parser = new Parser();
  try {
    const feed = await parser.parseURL('https://www.trtspor.com.tr/rss/anasayfa.xml');
    console.log('TRT Spor RSS OK. Items:', feed.items.length);
  } catch(e) {
    console.error('TRT error:', e.message);
  }
}
test();
