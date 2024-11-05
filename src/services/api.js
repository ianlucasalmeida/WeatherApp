import axios from 'axios';

const API_KEY = 'ponha a api aqui';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeather = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'pt_br'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados do clima:', error);
    return null;
  }
};

export const getForecast = async (city) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: API_KEY,
        units: 'metric',
        lang: 'pt_br'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar dados da previsão:', error);
    return null;
  }
};
