"use client";
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { WeatherWidgetProps } from "./WeatherInterface";
import { Card } from "antd";

export default function WeatherWidget({ lat, lon, title }: WeatherWidgetProps) {
  const [weatherData, setWeatherData] = useState<any>({});
  const [script, setScript] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // Minimal: BE handles OWM + HF, FE just calls one endpoint
        const url = `https://awr-be.onrender.com/generate?lat=${lat}&lon=${lon}`;
        const res = await fetch(url, { cache: "no-store" });
        const json = await res.json();

        // Your BE response example: { owm_data: {...}, script: "..." }
        const daily = json?.owm ?? json?.owm_data ?? {};
        const flattened = {
          description: daily?.description ?? "—",
          temp: daily?.temp ?? null,
          humidity: daily?.humidity ?? null,
          wind_speed: daily?.wind_speed ?? null,
          clouds: daily?.clouds ?? null,
          rain: typeof daily?.rain === "number" ? daily.rain : 0,
        };

        setWeatherData(flattened as any);
        setScript(typeof json?.script === "string" ? json.script : "");
      } catch (e) {
        setErr(e?.message || "Error");
      } finally {
        setLoading(false);
      }
    })();
  }, [lat, lon]);

  if (loading) {
    return (
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-3 h-5 w-40 animate-pulse rounded bg-slate-200" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
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

  // destructure data
  const { description, temp, humidity, rain, wind_speed, clouds } = weatherData || {};

  return (
    <Card className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-700">{title}</h2>
      <Card className="rounded-xl bg-slate-50 p-4">
        <div className="text-xs uppercase tracking-wide text-slate-500">Description</div>
        <div className="text-xl font-semibold text-slate-800 capitalize">{description}</div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card title="Temperature" variant="borderless"><span className="text-xl">{temp}°C</span></Card>
        <Card title="Humidity" variant="borderless"><span className="text-xl">{humidity}%</span></Card>
        <Card title="Rain" variant="borderless"><span className="text-xl">{rain}mm</span></Card>
        <Card title="Wind speed" variant="borderless"><span className="text-xl">{wind_speed}m/s</span></Card>
        <Card title="Clouds" variant="borderless"><span className="text-xl">{clouds}%</span></Card>
      </div>

      {/* section for script */}
      <div className="space-y-2">
        <div className="text-sm font-semibold text-slate-700">Generated Script</div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-slate-800 whitespace-pre-wrap">
          {script || "—"}
        </div>
      </div>
    </Card>
  );
}


