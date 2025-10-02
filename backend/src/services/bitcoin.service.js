import axios from 'axios';
import ApiError from '../utils/apiError.js';

export const bitcoinService = {
  async getBitcoinPrice() {
    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
      const { data } = await axios.get(url, { timeout: 5000 });
      return { usd: data.bitcoin.usd };
    } catch (err) {
      throw new ApiError('Error al obtener el precio de Bitcoin', err.response?.status || 500, err.message);
    }
  }
};