"use client"
import React, { useState } from "react";

export default function ScriptBox() {
  const [script, setScript] = useState("");

  async function sendData() {
    const payload = {
      max_new_tokens: 220,
      owm: {
        clouds: 45,
        description: "scattered clouds",
        humidity: 91,
        rain: 0,
        temp: 28.98,
        wind_speed: 1.73,
      },
      repetition_penalty: 1.1,
      temperature: 0.3,
      top_p: 0.85,
    };

    const res = await fetch("https://nwtt-gpt2peftweather.hf.space/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("Server response:", data);

    // If server returns a "script" string
    if (data?.script) setScript(data.script);
  }

  return (
    <div className="space-y-4">
      <button
        onClick={sendData}
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Generate Script
      </button>

      {script && (
        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <h3 className="mb-2 font-semibold text-slate-700">Generated Script</h3>
          <p className="text-slate-800">{script}</p>
        </div>
      )}
    </div>
  );
}
