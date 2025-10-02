const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint principal
app.get('/api/dashboard-widget', async (req, res) => {
  const { city } = req.query;
  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  try {
    // OpenWeatherMap
    const weatherApiKey = process.env.OPENWEATHER_API_KEY || 'REEMPLAZAR_API_KEY';
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${weatherApiKey}&units=metric&lang=es`;
    const weatherResponse = await axios.get(weatherUrl, { timeout: 5000 });
    const weatherData = weatherResponse.data;

    // CoinGecko
    const btcUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
    const btcResponse = await axios.get(btcUrl, { timeout: 5000 });
    const btcPrice = btcResponse.data.bitcoin.usd;

    // Respuesta combinada
    res.json({
      city: weatherData.name,
      weather: {
        description: weatherData.weather[0].description,
        temperature: weatherData.main.temp,
        icon: weatherData.weather[0].icon
      },
      bitcoin: {
        usd: btcPrice
      }
    });
  } catch (error) {
    if (error.response) {
      return res.status(error.response.status).json({ error: error.response.data });
    }
    res.status(500).json({ error: 'Error fetching data from external APIs', details: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`BFF listening on port ${PORT}`);
});
