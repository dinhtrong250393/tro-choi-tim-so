const https = require('https');

async function searchImage(query) {
  return new Promise((resolve, reject) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&pithumbsize=400&titles=${query}`;
    const options = {
      headers: { 'User-Agent': 'MyApp/1.0 (dinhtrong250393@gmail.com)' }
    };
    https.get(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pageId = Object.keys(pages)[0];
          if (pages[pageId].thumbnail) {
            resolve(pages[pageId].thumbnail.source);
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
  const animals = ['Dog', 'Cat', 'Rabbit', 'Monkey', 'Elephant', 'Giant_panda', 'Frog', 'Bear', 'Chicken', 'Cattle', 'Horse'];
  const foods = ['Bone', 'FishAsFood', 'Carrot', 'Banana', 'Peanut', 'Bamboo', 'Mosquito', 'Honey', 'Earthworm', 'Grass', 'Apple'];
  const veggies = ['Potato', 'Tomato', 'Maize', 'Broccoli', 'Mushroom', 'Onion', 'Garlic', 'Eggplant', 'Cucumber', 'Chili_pepper', 'Cabbage'];
  
  for (const q of [...animals, ...foods, ...veggies]) {
    const url = await searchImage(q);
    console.log(`"${q}": "${url}",`);
  }
}
run();
