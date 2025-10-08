"use client";
// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { WeatherWidgetProps } from "./WeatherInterface";
import ScriptBox from "./ScriptBox";

export default function TimeButton({ lat, lon }: WeatherWidgetProps) {
  const [delay, setDelay] = useState<number>(1); // set seconds
  const [script, setScript] = useState("");
  const [loading, setLoading] = useState(false);
  // accessing local storage client id
  const clientId = useMemo(() => {
    const key = "clientId";
    // check for previous client id
    let prev_id = localStorage.getItem(key);
    if (!prev_id) {
      prev_id = crypto.randomUUID();
      localStorage.setItem(key, prev_id);
    }
    return prev_id;
  }, []);

  useEffect(() => {
    // connecting to the WebSocket
    console.log("WS Connecting to", process.env.NEXT_PUBLIC_WS_URL);
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    // print out client id for debugging 
    ws.onopen = () => {
      console.log("WS Connected");
      ws.send(JSON.stringify({ event: "register", data: clientId }));
    };

    // receiving script payload
    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg?.type === "script-ready") {
        const { script, error } = msg.data || {};
        if (error) {
          console.log("WS", error);
          setLoading(false);
        } else {
          setScript(script || "Some error occured");
          console.log("Script:", script);
          setLoading(false);
        }
      }
    };

    ws.onerror = (err) => {
      console.log("Error:", err);
      setLoading(false);
    };

    ws.onclose = () => console.log("WS Closed");

    return () => ws.close();
  }, [clientId]);

  async function handleSchedule() {
    setLoading(true);
    try {
      // payload for /schedule endpoint
      const res = await fetch("/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          delaySeconds: delay,
          lat,
          lon,
          clientId,
        }),
      });

      const json = await res.json();
      console.log("Json", json);
      if (!res.ok) throw new Error(json?.message || "Failed");

    } catch (err: any) {
      console.log("Error:", err);
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 border p-4 rounded-lg">
      <h2 className="font-semibold text-lg">Set Timer</h2>

      <div className="flex items-center gap-2">
        <input
          type="number"
          value={delay}
          min={1}
          onChange={(e) => setDelay(Number(e.target.value))}
          className="border rounded px-2 py-1 w-24"
        />
        <span className="text-sm">seconds</span>
        <button onClick={handleSchedule} className="bg-black text-white px-3 py-1 rounded">
          Set timer
        </button>
      </div>

      <ScriptBox loading={loading} script={script} />
    </div>
  );
}
