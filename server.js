const express = require('express');
const axios = require('axios');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const yaml = require('js-yaml');

const app = express();
const PORT = 3000;

const BASE_URL = 'https://brottsplatskartan.se/api/events/';


let swaggerDocument;
try {
  const fileContents = fs.readFileSync('./swagger.yaml', 'utf8');
  swaggerDocument = yaml.load(fileContents);
} catch (err) {
  console.error('Error loading Swagger file:', err);
}


if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}


app.get('/crimes', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}?location=karlstad&limit=5`);
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crimes for Karlstad.' });
  }
});


app.get('/crimes/locations', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}?location=karlstad&limit=5`);
    const headlines = response.data.data.map(crime => crime.headline);
    res.json(headlines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch crime headlines.' });
  }
});


app.get('/crimes/search', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required.' });
  }

  try {
    const response = await axios.get(`${BASE_URL}?location=${city}&limit=5`);
    res.json(response.data.data);
  } catch (error) {
    res.status(500).json({ error: `Failed to fetch crimes for city: ${city}` });
  }
});


app.get('/crimes/latest', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}?location=karlstad&limit=1`);
    res.json(response.data.data[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest crime.' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});
