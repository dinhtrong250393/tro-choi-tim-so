const https = require('https');
async function run() {
  const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=400&titles=Fish`;
  const options = { headers: { 'User-Agent': 'MyApp/1.0 (dinhtrong250393@gmail.com)' } };
  https.get(url, options, (res) => {
    let data = ''; res.on('data', (c) => data += c);
    res.on('end', () => console.log(JSON.parse(data).query.pages));
  });
}
run();
