const https = require('https');

function searchUnsplash(query) {
  return new Promise((resolve, reject) => {
    https.get(`https://unsplash.com/napi/search/photos?query=${query}&per_page=1&page=1`, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.results && json.results.length > 0) {
            resolve(json.results[0].id);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', (err) => resolve(null));
  });
}

async function run() {
  const queries = [
    'dog', 'cat', 'rabbit', 'monkey', 'elephant', 'panda', 'frog', 'bear', 'chicken', 'cow', 'horse',
    'dog bone', 'raw fish', 'carrot', 'banana', 'peanut', 'bamboo leaves', 'fly insect', 'honey pot', 'earthworm', 'green grass', 'red apple',
    'potato', 'tomato', 'corn cob', 'broccoli', 'mushroom', 'onion', 'garlic', 'eggplant', 'cucumber', 'chili pepper', 'cabbage'
  ];
  const results = {};
  for (const q of queries) {
    const id = await searchUnsplash(q);
    results[q] = id;
    console.log(`${q}: ${id}`);
  }
}
run();
