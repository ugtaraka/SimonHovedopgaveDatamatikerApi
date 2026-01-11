import { fetchWeatherByCity as fetchFromAPI } from '../api/externalApiClient.js';
import { logger } from '../middleware/logging/logger.js';

export async function fetchWeatherByCity(city) {
    try {
        const data = await fetchFromAPI(city);


        return {
            city: data.name || city,
            temperature: data.main?.temp ?? 'N/A',
            windSpeed: data.wind?.speed ?? 'N/A',
            humidity: data.main?.humidity ?? 'N/A',
            description: data.weather?.[0]?.description ?? 'N/A',
        };

    } catch (err) {
        logger.error('Weather service failed', { message: err.message });
        throw err;
    }
}
