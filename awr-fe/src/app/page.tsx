// pages/index.jsx (or any page)
import WeatherWidget from "./WeatherWidget";


export default function Home() {
  return (
    <main className="flex min-h-screen items-start justify-center bg-slate-100 p-6">
      <WeatherWidget lat={20.3277} lon={106.0121} title="Hanoi" />
    </main>
  );
}
