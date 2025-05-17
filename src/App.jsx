import { useState, useEffect } from "react";
import { API_KEY } from '../apikey.js';


function getSeason(month) {
  if ([12, 1, 2].includes(month)) return "iarna";
  if ([3, 4, 5].includes(month)) return "primavara";
  if ([6, 7, 8].includes(month)) return "vara";
  if ([9, 10, 11].includes(month)) return "toamna";
  return "";
}



function generateRecommendation(weather) {
  if (!weather) return { text: "", imgSrc: "", color: "white" };

  const temp = weather.main.temp;
  const humidity = weather.main.humidity;
  const windSpeed = weather.wind.speed;
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth() + 1;
  const season = getSeason(month);


  
  let rec = "";
  let imgSrc = "";
  let color = "";  
  let emoji = "";

  if (temp <= 0) {
    rec += "❄️ Foarte frig! Recomandăm geacă groasă, căciulă din lână, mănuși călduroase și bocanci impermeabili. ";
    imgSrc = "/clothesimg/coat_winter.png";
    color = "#0d47a1"; 
  } else if (temp <= 10) {
    rec += "🧥 Rece. Poartă o jachetă călduroasă, eșarfă și încălțăminte rezistentă la umezeală. ";
    imgSrc = "/clothesimg/jacket_autumn.png";
    color = "#6d4c41"; 
  } else if (temp <= 20) {
    rec += "😊 Temperatură plăcută. Pulover sau hanorac, pantaloni confortabili și pantofi sport. ";
    imgSrc = "/clothesimg/sweater.png";
    color = "#2e7d32"; 
  } else if (temp <= 30) {
    rec += "🌞 Cald. Tricou, pantaloni scurți sau fustă, încălțăminte lejeră și pălărie de soare. ";
    imgSrc = "/clothesimg/tshirt_summer.png";
    color = "#fbc02d"; 
  } else {
    rec += "🔥 Foarte cald! Haine lejere din materiale naturale, hidratare constantă și protecție solară. ";
    imgSrc = "/clothesimg/light_clothes.png";
    color = "#d32f2f";
  }

  if (windSpeed > 15) {
    rec += "💨 Vânt puternic! Poartă haine care protejează de vânt, eșarfă și glugă sau căciulă. ";
  } else if (windSpeed > 7) {
    rec += "🌬️ Vânt moderat, recomandăm să iei o jachetă ușoară care blochează vântul. ";
  }

  if (humidity > 85) {
    rec += "💧 Umiditate ridicată. Alege haine din bumbac sau alte materiale care permit pielii să respire. ";
  }

  if (hour < 6 || hour > 20) {
    rec += "🌙 Este noapte sau dimineața devreme – poartă haine reflectorizante dacă ieși afară. ";
  }

  switch (season) {
    case "primavara":
      rec += "🌸 Trend primăvară: culori pastelate, layering (straturi subțiri), umbrele compacte. ";
      if (!color) color = "#81c784";
      break;
    case "vara":
      rec += "🌻 Trend vară: culori vii, pălării de soare, ochelari de soare și sandale confortabile. ";
      if (!color) color = "#fdd835";
      break;
    case "toamna":
      rec += "🍂 Trend toamnă: culori pământii, jachete din denim sau piele, eșarfe groase. ";
      if (!color) color = "#a1887f"; 
      break;
    case "iarna":
      rec += "⛄ Trend iarnă: straturi multiple, pulovere groase, cizme impermeabile și mănuși călduroase. ";
      if (!color) color = "#90caf9"; 
      break;
  }

  const weatherMain = weather.weather[0].main.toLowerCase();

  if (["rain", "drizzle"].includes(weatherMain)) {
    rec += "☔ Nu uita umbrela și încălțăminte impermeabilă. Poate fi alunecos, deci ai grijă la teren. ";
  } else if (weatherMain === "snow") {
    rec += "❄️ Zăpadă pe drumuri – încălțăminte cu talpă aderentă, haine termice și protecție pentru față. ";
  } else if (weatherMain === "thunderstorm") {
    rec += "⚡ Furtună puternică! Evită să ieși afară dacă nu este necesar. ";
  }

  return { text: rec, imgSrc, color };
}


function Background({ weather }) {
  if (!weather) {
    return (
      <div
        className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{ backgroundImage: `url(/images/default.jpg)` }}
      />
    );
  }

  const main = weather.weather[0].main.toLowerCase();

  const backgrounds = {
    clear: { type: "image", src: "/images/sunny.jpg" },
    clouds: { type: "image", src: "/images/cloudy.jpg" },
    rain: { type: "video", src: "/images/rainy.mp4" },
    snow: { type: "image", src: "/images/snowy.jpg" },
    thunderstorm: { type: "video", src: "/images/thunderstorm.mp4" },
  };

  const bg = backgrounds[main] || { type: "image", src: "/images/default.jpg" };

  return bg.type === "video" ? (
    <>
      <video
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        autoPlay
        muted
        loop
        playsInline
        src={bg.src}
      />
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-40 z-5"></div>
    </>
  ) : (
    <div
      className="fixed top-0 left-0 w-full h-full bg-cover bg-center z-0"
      style={{ backgroundImage: `url(${bg.src})` }}
    />
  );
}

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [manualLocationSet, setManualLocationSet] = useState(false); 


useEffect(() => {
    if (!manualMode && !manualLocationSet) {
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          await fetchWeatherByCoords(latitude, longitude);
          setError(null);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setManualMode(true);
          setLoading(false);
        }
      );
    }
  }, [manualMode, manualLocationSet]);


  async function fetchWeatherByCoords(lat, lon) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("Eroare la preluarea vremii.");
      const data = await res.json();
      setWeather(data);
      setManualLocationSet(false); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
    async function fetchWeatherByCity(cityName) {
    if (!cityName) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      if (!res.ok) throw new Error("Orașul nu a fost găsit.");
      const data = await res.json();
      setWeather(data);
      setManualMode(true);       
      setManualLocationSet(true); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Background weather={weather} />

      <div className="relative z-20 p-10 bg-black bg-opacity-70 rounded-xl max-w-4xl mx-auto mt-14 text-white font-sans shadow-xl"
                        style={{ border: `3px solid ${generateRecommendation(weather).color || "white"}` }}
      >
        <h1 className="text-5xl font-extrabold text-center mb-8 tracking-wide drop-shadow-md">What2Wear</h1>

        {loading && <p className="text-center text-lg animate-pulse">Se încarcă vremea...</p>}
        {error && <p className="text-center text-red-500 font-semibold">{error}</p>}

        {!loading && !weather && manualMode && (
          <div className="mb-6 flex space-x-3 items-center justify-center">
            <input
              type="text"
              placeholder="Introdu un oraș"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchWeatherByCity(city)}
              className="border border-gray-400 rounded-lg p-3 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow max-w-sm"
            />
            <button
              onClick={() => fetchWeatherByCity(city)}
              className="px-5 py-3 bg-blue-600 rounded-lg font-semibold transition hover:bg-blue-700 shadow-md"
            >
              Caută
            </button>
                 <button
              className="px-5 py-3 bg-yellow-500 rounded-lg font-semibold transition hover:bg-yellow-600 shadow-md"

            onClick={() => {
              setLoading(true);
              setError(null);
              setManualLocationSet(false);  
              setManualMode(false);         
              navigator.geolocation.getCurrentPosition(
                async (pos) => {
                  const { latitude, longitude } = pos.coords;
                  await fetchWeatherByCoords(latitude, longitude);
                  setManualMode(false);
                },
                () => {
                  setLoading(false);
                  setError("Nu am putut detecta locația. Te rog introdu orașul manual.");
                  setManualMode(true);
                }
              );
            }}
      >
        Detectează locația
      </button>
          </div>
        )}

        {weather && (
          <div className="flex flex-col md:flex-row items-start justify-between gap-10">
            <div
              className="flex-1 bg-black bg-opacity-60 p-8 rounded-xl shadow-lg"
              style={{ border: `3px solid ${generateRecommendation(weather).color || "white"}` }}
            >
              <button
                onClick={() => {
                  setManualMode(true);
                  setWeather(null);
                  setError(null);
                  setCity("");
                }}
                className="mb-5 px-4 py-2 bg-yellow-500 rounded-lg font-semibold hover:bg-yellow-600 transition shadow-md"
              >
                Schimbă locația
              </button>
              <h2 className="text-3xl font-semibold mb-3">{weather.name}, {weather.sys.country}</h2>
              <p className="text-xl capitalize mb-3">{weather.weather[0].description}</p>
              <p className="mb-2 text-lg">🌡 Temperatura: <span className="font-semibold">{weather.main.temp}°C</span></p>
              <p className="mb-2 text-lg">💧 Umiditate: <span className="font-semibold">{weather.main.humidity}%</span></p>
              <p className="mb-6 text-lg">🌬 Vânt: <span className="font-semibold">{weather.wind.speed} m/s</span></p>

              <p
                className="italic text-lg max-w-md leading-relaxed"
                style={{ color: generateRecommendation(weather).color || "white" }}
              >
                {generateRecommendation(weather).text}
              </p>
            </div>

            <div
              className="w-72 flex-shrink-0 rounded-xl overflow-hidden shadow-lg"
              style={{ border: `3px solid ${generateRecommendation(weather).color || "white"}` }}
            >
              {generateRecommendation(weather).imgSrc && (
                <img
                  src={generateRecommendation(weather).imgSrc}
                  alt="Recomandare vestimentară"
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
