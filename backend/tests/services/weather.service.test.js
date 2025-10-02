

import { jest } from '@jest/globals';
import { weatherService } from '../../src/services/weather.service.js';
import ApiError from '../../src/utils/apiError.js';
import axios from 'axios';

jest.mock('axios');
axios.get = jest.fn();

describe('weatherService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getWeatherByCity', () => {
    const apiKey = 'dummy-api-key';
    const city = 'Madrid';
    const mockWeatherData = {
      name: 'Madrid',
      weather: [{ description: 'cielo claro', icon: '01d' }],
      main: { temp: 25 },
    };

    it('should return weather data on success', async () => {
      axios.get.mockResolvedValue({ data: mockWeatherData });
      const result = await weatherService.getWeatherByCity(city, apiKey);
      expect(result).toEqual({
        city: 'Madrid',
        description: 'cielo claro',
        temperature: 25,
        icon: '01d',
      });
      expect(axios.get).toHaveBeenCalledWith(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=es`,
        { timeout: 5000 }
      );
    });

    it('should throw ApiError on axios failure with response', async () => {
      const error = { response: { status: 401 }, message: 'Unauthorized' };
      axios.get.mockRejectedValue(error);
      await expect(weatherService.getWeatherByCity(city, apiKey)).rejects.toThrow(ApiError);
      try {
        await weatherService.getWeatherByCity(city, apiKey);
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.message).toBe('Error al obtener el clima');
        expect(err.statusCode).toBe(401);
      }
    });

    it('should throw ApiError on axios failure without response', async () => {
      const error = { message: 'Timeout' };
      axios.get.mockRejectedValue(error);
      await expect(weatherService.getWeatherByCity(city, apiKey)).rejects.toThrow(ApiError);
      try {
        await weatherService.getWeatherByCity(city, apiKey);
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.message).toBe('Error al obtener el clima');
        expect(err.statusCode).toBe(500);
      }
    });
  });
});
