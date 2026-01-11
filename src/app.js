import { fetchWeatherByCity } from './services/weatherService.js';
import { logger } from './middleware/logging/logger.js';
import { weatherByCitySchema } from './middleware/validation/weatherValidation.js';

// Hent input
const cityInput = process.argv[2] || 'London';

// Valider input
const { error, value } = weatherByCitySchema.validate(cityInput);

// Fallback
const city = error ? 'Copenhagen' : value;

async function main() {
    try {
        const weather = await fetchWeatherByCity(city);

        logger.info('Weather fetched successfully', {
            city: weather.city,
            temperature: weather.temperature,
            windSpeed: weather.windSpeed,
            humidity: weather.humidity,
            description: weather.description,
        });

        console.log(weather);

    } catch (err) {
        logger.error('Application error', { message: err.message });
        console.error(`Failed to fetch weather for ${city}: ${err.message}`);
        process.exitCode = 1;
    }
}

main();
