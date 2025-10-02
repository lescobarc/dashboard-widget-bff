import { jest } from '@jest/globals';
import { getDashboardWidget } from '../../src/controllers/dashboardWidget.controller.js';
import { weatherService } from '../../src/services/weather.service.js';
import { bitcoinService } from '../../src/services/bitcoin.service.js';

describe('getDashboardWidget controller', () => {
  let req, res, next;
  let weatherSpy, bitcoinSpy;

  beforeEach(() => {
    req = { query: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
    weatherSpy = jest.spyOn(weatherService, 'getWeatherByCity');
    bitcoinSpy = jest.spyOn(bitcoinService, 'getBitcoinPrice');
  });

  it('should return 400 if city is missing', async () => {
    await getDashboardWidget(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'City parameter is required' });
  });

  it('should return 400 if city is empty string', async () => {
    req.query.city = '';
    await getDashboardWidget(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'City parameter is required' });
  });

  it('should return combined data for a valid city', async () => {
    req.query.city = 'Madrid';
    weatherSpy.mockResolvedValue({ city: 'Madrid', temp: 20 });
    bitcoinSpy.mockResolvedValue({ usd: 50000 });

    await getDashboardWidget(req, res, next);
    expect(weatherService.getWeatherByCity).toHaveBeenCalledWith('Madrid', process.env.OPENWEATHER_API_KEY);
    expect(bitcoinService.getBitcoinPrice).toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith({ city: 'Madrid', weather: { city: 'Madrid', temp: 20 }, bitcoin: { usd: 50000 } });
  });

  it('should call next with error if weather service fails', async () => {
    req.query.city = 'Madrid';
    const error = new Error('Weather error');
    weatherSpy.mockRejectedValue(error);
    bitcoinSpy.mockResolvedValue({ usd: 50000 });

    await getDashboardWidget(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should call next with error if bitcoin service fails', async () => {
    req.query.city = 'Madrid';
    weatherSpy.mockResolvedValue({ city: 'Madrid', temp: 20 });
    const error = new Error('Bitcoin error');
    bitcoinSpy.mockRejectedValue(error);

    await getDashboardWidget(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should call next if weather service returns null', async () => {
    req.query.city = 'Madrid';
    weatherSpy.mockResolvedValue(null);
    bitcoinSpy.mockResolvedValue({ usd: 50000 });
    await getDashboardWidget(req, res, next);
    // El controlador intentará acceder a weather.city y fallará
    expect(next).toHaveBeenCalled();
  });

  it('should call next if bitcoin service returns null', async () => {
    req.query.city = 'Madrid';
    weatherSpy.mockResolvedValue({ city: 'Madrid', temp: 20 });
    bitcoinSpy.mockResolvedValue(null);
    await getDashboardWidget(req, res, next);
    // El controlador debería responder igual, pero puedes validar el comportamiento
    expect(res.json).toHaveBeenCalledWith({ city: 'Madrid', weather: { city: 'Madrid', temp: 20 }, bitcoin: null });
  });

  it('should call next with error if weather service throws 401 (API key inválido)', async () => {
    req.query.city = 'Madrid';
    const error = { response: { status: 401 }, message: 'Invalid API key' };
    weatherSpy.mockRejectedValue(error);
    bitcoinSpy.mockResolvedValue({ usd: 50000 });
    await getDashboardWidget(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });
});
