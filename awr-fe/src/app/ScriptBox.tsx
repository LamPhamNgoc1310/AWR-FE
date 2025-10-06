"use client";
// @ts-nocheck

import React, { useState } from "react";
import { WeatherWidgetProps } from "./WeatherInterface";
export default function ScriptBox({lat, lon}:WeatherWidgetProps) {

  const [script, setScript] = useState<string>("")
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleGenerate = async () => {
        try {
            setLoading(true);
            setErr(null);

            const url = `/generate?lat=${lat}&lon=${lon}`;
            const result = await fetch(url, { cache: "no-store" });
            const script_json = await result.json();
            setScript(typeof script_json.script === "string" ? script_json.script : "")
        } catch (e) {
            setErr(e?.message || "Error");
        } finally {
            setLoading(false);
        }
    }

  return (
    <div className="space-y-4 w-full max-w-md p-4 rounded-2xl border border-gray-200 shadow-sm bg-white">
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full rounded-lg border-2 border-black bg-black text-white font-medium hover:bg-white hover:text-black disabled:opacity-50 py-2 transition delay-300"
      >
        {loading ? "Generating..." : "Generate Script"}
      </button>

      {err && (
        <div className="rounded border border-rose-200 bg-rose-50 p-3 text-rose-800">
          {err}
        </div>
      )}

      {script && (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-gray-700">
            Generated Script
          </div>
          <div className="rounded border border-slate-200 bg-slate-50 p-3 text-gray-800 whitespace-pre-wrap">
            {script || "—"}
          </div>
        </div>
      )}
    </div>
  )
}
