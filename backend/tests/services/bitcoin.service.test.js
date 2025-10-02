

import { jest } from '@jest/globals';
import { bitcoinService } from '../../src/services/bitcoin.service.js';
import ApiError from '../../src/utils/apiError.js';
import axios from 'axios';

jest.mock('axios');
axios.get = jest.fn();

describe('bitcoinService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getBitcoinPrice', () => {
    it('should return the bitcoin price in USD on success', async () => {
      axios.get.mockResolvedValue({ data: { bitcoin: { usd: 42000 } } });
      const result = await bitcoinService.getBitcoinPrice();
      expect(result).toEqual({ usd: 42000 });
      expect(axios.get).toHaveBeenCalledWith(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
        { timeout: 5000 }
      );
    });

    it('should throw ApiError on axios failure with response', async () => {
      const error = { response: { status: 404 }, message: 'Not found' };
      axios.get.mockRejectedValue(error);
      await expect(bitcoinService.getBitcoinPrice()).rejects.toThrow(ApiError);
      try {
        await bitcoinService.getBitcoinPrice();
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.message).toBe('Error al obtener el precio de Bitcoin');
        expect(err.statusCode).toBe(404);
      }
    });

    it('should throw ApiError on axios failure without response', async () => {
      const error = { message: 'Network error' };
      axios.get.mockRejectedValue(error);
      await expect(bitcoinService.getBitcoinPrice()).rejects.toThrow(ApiError);
      try {
        await bitcoinService.getBitcoinPrice();
      } catch (err) {
        expect(err).toBeInstanceOf(ApiError);
        expect(err.message).toBe('Error al obtener el precio de Bitcoin');
        expect(err.statusCode).toBe(500);
      }
    });
  });
});
