
# About What2Wear

What2Wear is more than just a weather app — it combines accurate weather forecasts with smart clothing recommendations tailored to the current conditions. Whether it's sunny, rainy, chilly, or humid, What2Wear helps you decide the perfect outfit for the day so you can stay comfortable and prepared no matter the weather.

## Features

- Search weather by city name
- Display current temperature, weather conditions, humidity, and wind speed
- Outfit suggestions based on the current weather to help you decide what to wear
- Responsive design using Tailwind CSS
- Fast development and build with Vite
- Beautiful backgrounds and videos sourced from Pexels and Unsplash

## Technologies Used

- React
- Vite (build tool and development server)
- Tailwind CSS (utility-first CSS framework)
- OpenWeather API (weather data)
- Pexels API (background videos and images)
- Unsplash (free background images)

## Installation

1. Clone the repo
   ```bash
   git clone https://github.com/paulxcode/what2wear.git
   ```
2. Navigate into the project directory
   ```bash
   cd what2wear
   ```
3. Edit the `apikey.js` with your API key from OpenWeatherAPI:
   ```js
   export const API_KEY = "YOUR API KEY HERE";
   ```
4. Install dependencies
   ```bash
   npm install
   ```
5. Start the development server
   ```bash
   npm run dev
   ```

## Usage

Open your browser at `http://localhost:5173` (or the port Vite shows) and search for any city to get the current weather and enjoy beautiful background media.

## Credits

- Weather data from [OpenWeather](https://openweathermap.org/)
- Background videos and images from [Pexels](https://www.pexels.com/) and [Unsplash](https://unsplash.com/)
- Built with [React](https://reactjs.org/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
