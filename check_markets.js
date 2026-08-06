const fetch = require('node-fetch');

async function test() {
   try {
      const res = await fetch('http://localhost:3002/api/test-markets');
      const data = await res.json();
      console.log(data);
   } catch(e) {
      console.log('Error', e.message);
   }
}
test();
