// //Clone the full project on: https://github.com/dinizgb/nextjs-weather-widget-with-styled-components

// import React, { useState, useEffect } from "react";
// import styled from 'styled-components';

// const weatherAPI = `https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,minutely,daily&units=metric&appid=53907dcd692419014f9b50999c5bbb42`

// const WeatherWidgetWrapper = styled.div`
//     min-width: 250px;
//     background: #fff;
//     border: 1px solid #e8eaff;
//     border-radius: 6px;
//     padding: 15px 15px 0 15px;
//     margin: 20px;
// `

// const WidgetTitle = styled.h1`
//     font-size: 16px;
//     font-weight: bold;
//     color: #666;
// `

// const IconArea = styled.div`
//     padding: 0 5px;
// `

// const TempText = styled.div`
//     font-size: 30px;
//     font-weight: bold;
//     color: #666;
//     margin-top: 24px;
// `

// export default function WeatherWidget_City() {
//     const [weather, setWeather] = useState({});
//     useEffect(() => {
//         const fetchWeather = async () => {
//             try{
//                 const weatherReq = await fetch(weatherAPI);
//                 const weatherData = await weatherReq.json();
//                 console.log(weatherData)
//                 setWeather({temperature: weatherData.current.temp + "º C", humidity: weatherData.current.humidity + "%", description: weatherData.current.weather[0].description});
//             }
//             catch(e){
//                 console.log(e);
//             }
//         };
//         fetchWeather();
//     }, []);
//     return (
//         <WeatherWidgetWrapper>  
//             <div className="row">
//                 <WidgetTitle>With City Name</WidgetTitle>
//             </div>
//             <div className="row">
//                 {/* <IconArea>{weather.icon}</IconArea> */}
//                 <TempText>Temperature: {weather.temperature}</TempText>
//                 <TempText>Humidity: {weather.humidity}</TempText>
//                 <TempText>Temperature: {weather.temperature}</TempText>
//             </div>
//         </WeatherWidgetWrapper>
//     )
// }

"use client";
import React, { useEffect, useState } from "react";

export default function WeatherWidget({ lat = 20.3277, lon = 106.0121, title = "Current Weather" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // If you call OWM directly, keep this URL pattern:
        const url = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=hourly,current,minutely&units=metric&appid=53907dcd692419014f9b50999c5bbb42`;
        const r = await fetch(url, { cache: "no-store" });
        const json = await r.json();
        console.log(json)
        if (!r.ok) throw new Error(json?.message || "Failed to fetch weather");

        // 🔽 flatten the nested shape (json.current.*) to what the UI needs
        const cur = json?.daily[0] ?? {};
        const flattened = {
          description: cur?.weather?.[0]?.description ?? "—",
          temp: cur?.temp?.day ?? null,
          humidity: cur?.humidity ?? null,
          wind_speed: cur?.wind_speed ?? null,
          clouds: cur?.clouds ?? null,
          // rain may be number or object like { "1h": 0.12 }
          rain:
            typeof cur?.rain === "number"
              ? cur.rain
              : typeof cur?.rain?.["1h"] === "number"
              ? cur.rain["1h"]
              : 0,
        };

        if (alive) setData(flattened);
      } catch (e) {
        if (alive) setErr(e.message || "Error");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-2 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded-lg border border-slate-100 p-3">
              <div className="mb-2 h-3 w-20 animate-pulse rounded bg-slate-200" />
              <div className="h-6 w-16 animate-pulse rounded bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
        <div className="mb-1 text-sm font-semibold">Weather Error</div>
        <div className="text-sm opacity-90">{err}</div>
      </div>
    );
  }

  // ✅ now you can safely deconstruct because we flattened it
  const { description, temp, humidity, rain, wind_speed, clouds } = data || {};
  const fmt = (v, suf = "") => (v === null || v === undefined ? "—" : `${v}${suf}`);

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-700">{title}</h2>
      </div>

      <div className="mb-4 rounded-xl bg-slate-50 p-4">
        <div className="text-sm uppercase tracking-wide text-slate-500">Description</div>
        <div className="text-xl font-semibold text-slate-800 capitalize">{description}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Info label="Temp" value={fmt(temp, " °C")} />
        <Info label="Humidity" value={fmt(humidity, " %")} />
        <Info label="Rain (1h)" value={fmt(rain, " mm")} />
        <Info label="Wind Speed" value={fmt(wind_speed, " m/s")} />
        <Info label="Clouds" value={fmt(clouds, " %")} />
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-3">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold text-slate-800">{value}</div>
    </div>
  );
}
