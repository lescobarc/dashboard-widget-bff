import { weatherService } from '../services/weather.service.js';
import { bitcoinService } from '../services/bitcoin.service.js';

export async function getDashboardWidget(req, res, next) {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }
  try {
    const [weather, bitcoin] = await Promise.all([
      weatherService.getWeatherByCity(city, process.env.OPENWEATHER_API_KEY),
      bitcoinService.getBitcoinPrice()
    ]);
    res.json({ city: weather.city, weather, bitcoin });
  } catch (err) {
    next(err);
  }
}

