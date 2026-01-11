// Importerer fetch-funktionalitet fra Undici, en moderne HTTP-klient til Node.js
// Bruges i stedet for node-fetch eller axios for bedre performance
import { fetch } from 'undici';
import { config } from '../config/index.js';
import { logger } from '../middleware/logging/logger.js';

// Eksporterer en asynkron funktion, der henter vejrdata for en given by
export async function fetchWeatherByCity(city) {

    // Opretter en AbortController, så vi kan afbryde requesten hvis den tager for lang tid
    const controller = new AbortController();

    // Starter en timer, der afbryder requesten efter det antal millisekunder, der er sat i config
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

    // Samler URL til OpenWeather API:
    // - Byen URL-enkodes
    // - Enheder sættes til metriske
    // - API-key tilføjes fra .env
    const url =
        `${config.baseUrl}/weather` +
        `?q=${encodeURIComponent(city)}` +
        `&units=metric` +
        `&appid=${config.apiKey}`;

    try {
        // Sender GET-request til API med signal fra AbortController og Accept JSON-header
        const response = await fetch(url, {
            method: 'GET',
            signal: controller.signal,
            headers: {
                'Accept': 'application/json'
            }
        });

        // Pars JSON fra API-responsen til et objekt
        const data = await response.json();

        // Hvis API returnerer en fejlkode (ikke 200), log warning og kast fejl
        if (data.cod && data.cod !== 200) {
            logger.warn('OpenWeather API returned error', {
                cod: data.cod,
                message: data.message,
                city
            });
            throw new Error(`Weather service error: ${data.message}`);
        }

        return data;

    } catch (err) {
        // Hvis request blev afbrudt pga timeout
        if (err.name === 'AbortError') {
            logger.error('OpenWeather request timed out');
        } else {
            // Anden form for fejl
            logger.error('OpenWeather request failed', {
                message: err.message
            });
        }
        // Genkaster fejl, så den kan håndteres upstream
        throw err;
    } finally {
        // Rydder timeout uanset om request lykkedes eller fejlede
        clearTimeout(timeout);
    }
}
