"use client";
// @ts-nocheck

import React, { useEffect, useState } from "react";
import { WeatherWidgetProps } from "./WeatherInterface";
export default function ScriptBox({lat, lon}:WeatherWidgetProps) {

  const [script, setScript] = useState<string>("")
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
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
    })();
  }, [lat, lon]);

  if (loading) {
    return (
        <div className="w-full max-w-md rounded-2xl border border-grey-200 bg-white p-5 shadow-sm">
            <div className="h-5 w-40 animate-pulse rounded" >Generating Script</div>
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
  return (
    <div className="space-y-2">
        <div className="text-sm font-semibold text-grey-700">Generated Script</div>
        <div className="rounded border border-slate-200 bg-slate-50 p-3 text-grey-800 whitespace-pre-wrap">
            {script || "—"}
        </div>
    </div>
  )
}
