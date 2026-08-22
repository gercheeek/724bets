import http from 'http';
http.get('http://localhost:3000/api/sports/matches', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('Response:', data.substring(0, 100)));
});
