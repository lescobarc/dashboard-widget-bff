import axios from 'axios';
import ApiError from '../utils/apiError.js';

export const weatherService = {
  async getWeatherByCity(city, apiKey) {
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`;
      const { data } = await axios.get(url, { timeout: 5000 });
      return {
        city: data.name,
        description: data.weather[0].description,
        temperature: data.main.temp,
        icon: data.weather[0].icon
      };
    } catch (err) {
      throw new ApiError('Error al obtener el clima', err.response?.status || 500, err.message);
    }
  }
};