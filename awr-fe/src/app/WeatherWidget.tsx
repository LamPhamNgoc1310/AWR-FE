"use client";
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { WeatherWidgetProps } from "./WeatherInterface";
import { Card } from "antd";
import ScriptBox from "./ScriptBox";

export default function WeatherWidget({ lat, lon, title }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // Minimal: BE handles OWM + HF, FE just calls one endpoint
        const url = `/weather-info?lat=${lat}&lon=${lon}`;
        const result = await fetch(url, { cache: "no-store" });
        const weather_json = await result.json();

        // Weather response {desc: , temp:, ...}
        const flattened = {
          description: weather_json?.description ?? "—",
          temp: weather_json?.temp ?? null,
          humidity: weather_json?.humidity ?? null,
          wind_speed: weather_json?.wind_speed ?? null,
          clouds: weather_json?.clouds ?? null,
          rain: typeof weather_json?.rain === "number" ? weather_json.rain : 0,
        };
        setWeatherData(flattened as any);
      } catch (e) {
        setErr(e?.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [lat, lon]);

  if (loading) {
    return (
        <div className="w-full max-w-md rounded-2xl border border-grey-200 bg-white p-5 shadow-sm">
            <div className="mb-3 h-5 w-40 animate-pulse rounded bg-grey-200" ></div>
            <div>Fetching the API...Please wait</div>
        </div>
    )
  }

  if (err) {
    return (
        <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-5 text-rose-800">
            <div>{err}</div>
        </div>
    )
  }

  // destructure data
  const { description, temp, humidity, rain, wind_speed, clouds } = weatherData || {};

  return (
    <Card className="w-full max-w-md space-y-4 rounded-2xl border border-grey-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-grey-700">{title}</h2>
      <Card className="rounded-xl bg-grey-50 p-4">
        <div className="text-xs uppercase tracking-wide text-grey-500">Description</div>
        <div className="text-xl font-semibold text-grey-800 capitalize">{description}</div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card title="Temperature" variant="borderless"><span className="text-xl">{temp}°C</span></Card>
        <Card title="Humidity" variant="borderless"><span className="text-xl">{humidity}%</span></Card>
        <Card title="Rain" variant="borderless"><span className="text-xl">{rain}mm</span></Card>
        <Card title="Wind speed" variant="borderless"><span className="text-xl">{wind_speed}m/s</span></Card>
        <Card title="Clouds" variant="borderless"><span className="text-xl">{clouds}%</span></Card>
      </div>

      {/* section for script */}
      <ScriptBox lat={lat} lon={lon}/>
    </Card>
  );
}


