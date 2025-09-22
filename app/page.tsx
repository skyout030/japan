"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Train, Bus } from "lucide-react";

// 模擬行程資料
const routes = [
  { date: "9/27 (六)", from: "成田", to: "日暮里", type: "train", line: "Skyliner", duration: "36 分", fare: "¥5810", schedule: ["09:15", "09:45", "10:15", "10:45"] },
  { date: "9/28 (日)", from: "日暮里", to: "上野", type: "train", line: "山手線", duration: "5 分", fare: "¥200", schedule: ["08:00", "08:10", "08:20", "08:30"] },
  { date: "9/28 (日)", from: "上野", to: "輕井澤", type: "train", line: "北陸新幹線", duration: "65 分", fare: "¥5810", schedule: ["08:20", "08:40", "09:00", "09:20"] },
  { date: "9/29 (一)", from: "輕井澤", to: "長野", type: "train", line: "普通列車", duration: "35 分", fare: "¥1200", schedule: ["07:00", "07:30", "08:00", "08:30"] },
  { date: "9/29 (一)", from: "長野", to: "松本", type: "train", line: "特急信濃", duration: "55 分", fare: "¥2500", schedule: ["09:00", "09:30", "10:00", "10:30"] },
  { date: "9/30 (二)", from: "松本", to: "新島々", type: "train", line: "普通列車", duration: "30 分", fare: "¥900", schedule: ["07:30", "08:00", "08:30", "09:00"] },
  { date: "9/30 (二)", from: "新島々", to: "上高地", type: "bus", line: "上高地巴士", duration: "1 小時", fare: "現場購票", schedule: ["07:30", "08:00", "08:30", "09:00"] },
  { date: "10/1 (三)", from: "松本", to: "新宿", type: "train", line: "特急 Azusa", duration: "2.5 小時", fare: "¥5000", schedule: ["08:00", "09:00", "10:00"] },
  { date: "10/1 (三)", from: "新宿", to: "神田", type: "train", line: "JR中央線", duration: "15 分", fare: "¥300", schedule: ["11:00", "11:15", "11:30"] },
  { date: "10/4 (五)", from: "江之島電鐵", to: "藤澤", type: "train", line: "江之島電鐵", duration: "9 分", fare: "¥200", schedule: ["07:00", "07:15", "07:30"] },
  { date: "10/4 (五)", from: "藤澤", to: "押上", type: "train", line: "直通", duration: "90 分", fare: "¥1200", schedule: ["08:00", "08:30", "09:00"] },
  { date: "10/4 (五)", from: "押上", to: "淺草", type: "train", line: "普通列車", duration: "5 分", fare: "¥200", schedule: ["09:00", "09:15", "09:30"] },
  { date: "10/3 (五)", from: "淺草", to: "成田機場", type: "bus", line: "Access成田巴士", duration: "1 小時 30 分", fare: "¥1500", schedule: ["06:30", "07:00", "07:30"] },
];

// 呼叫本地 API Proxy
async function fetchNextTransitRoute(origin, destination) {
  try {
    // 設定出發時間為現在
    const departureTime = Math.floor(Date.now() / 1000);

    const res = await fetch(
      `/api/directions?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&departure_time=${departureTime}`
    );
    const data = await res.json();

    if (!data.routes || data.routes.length === 0) {
      return { times: [], fare: "無資料", duration: "N/A" };
    }

    // 取得第一條路線的第一段 legs
    const route = data.routes[0].legs[0];

    // 取得下一班可搭乘時間
    const nextTime = route.departure_time?.text || "N/A";

    // 票價與時間
    const fare = route?.fare?.text || "查詢中";
    const duration = route.duration?.text || "N/A";

    return {
      times: [nextTime],
      fare,
      duration,
    };
  } catch (err) {
    console.error("Google Directions API error:", err);
    return { times: [], fare: "錯誤", duration: "N/A" };
  }
}


export default function TransitApp() {
  const [selected, setSelected] = useState(null);
  const [realtime, setRealtime] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  async function handleRealtime(r) {
    const data = await fetchNextTransitRoute(r.from, r.to);
    setRealtime(data);
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen p-4 bg-blue-50">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-800">旅行交通速查表</h1>

      <div className="grid gap-4">
        {routes.map((r, idx) => (
          <Card key={idx} className="shadow-md cursor-pointer border-l-4 border-blue-400" onClick={() => { setSelected(r); setRealtime(null); }}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-900">📅 {r.date}</p>
                <p className="text-gray-800">{r.from} → {r.to}</p>
                <p className="text-sm text-gray-600">{r.line} • {r.duration}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-blue-600">{r.fare}</p>
                {r.type === "train" ? <Train className="inline ml-2 text-blue-500" /> : <Bus className="inline ml-2 text-green-500" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <Card className="w-80 bg-white shadow-lg">
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-2 text-gray-900">{selected.from} → {selected.to}</h2>
              <p className="mb-1 text-gray-800">🚄 路線：{selected.line}</p>
              <p className="mb-1 text-gray-800">⏱ 耗時：{selected.duration}</p>
              <p className="mb-3 font-semibold text-blue-600">💴 費用：{selected.fare}</p>

              <p className="font-semibold mb-2 flex items-center text-gray-900"><Clock className="w-4 h-4 mr-1" /> 班次資訊</p>
              <ul className="list-disc ml-6 text-gray-700">
                {(realtime ? realtime.times : selected.schedule).map((time, idx) => (
                  <li key={idx}>{time}</li>
                ))}
              </ul>

              <div className="flex justify-between mt-4">
                <Button className="bg-blue-500 hover:bg-blue-600 text-white" onClick={() => handleRealtime(selected)}>
                  查即時班次
                </Button>
                <Button variant="secondary" className="bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={() => setSelected(null)}>
                  關閉
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
