import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Train, Bus } from "lucide-react";

// 模擬行程資料
const routes = [
  {
    date: "9/27",
    from: "成田",
    to: "日暮里",
    type: "train",
    line: "Skyliner",
    duration: "36 分",
    fare: "¥5810",
    schedule: ["09:15", "09:45", "10:15", "10:45"],
  },
  {
    date: "9/28",
    from: "上野",
    to: "軽井沢",
    type: "train",
    line: "北陸新幹線",
    duration: "65 分",
    fare: "¥5810",
    schedule: ["08:20", "08:40", "09:00", "09:20"],
  },
  {
    date: "9/30",
    from: "新島々",
    to: "上高地",
    type: "bus",
    line: "上高地巴士",
    duration: "1 小時",
    fare: "現場購票",
    schedule: ["07:30", "08:00", "08:30", "09:00"],
  },
];

// （未來可換成 Google Routes API）
async function fetchNextTransitRoute(origin, destination) {
  // 假資料模擬 API
  return {
    times: ["10:00", "10:30", "11:00"],
    fare: "¥2000",
    duration: "1 小時",
  };
}

export default function TransitApp() {
  const [selected, setSelected] = useState(null);
  const [realtime, setRealtime] = useState(null);

  async function handleRealtime(r) {
    const data = await fetchNextTransitRoute(r.from, r.to);
    setRealtime(data);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <h1 className="text-2xl font-bold text-center mb-6">旅行交通速查表</h1>

      {/* 行程列表 */}
      <div className="grid gap-4">
        {routes.map((r, idx) => (
          <Card key={idx} className="shadow-md cursor-pointer" onClick={() => {setSelected(r); setRealtime(null);}}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">📅 {r.date}</p>
                <p>{r.from} → {r.to}</p>
                <p className="text-sm text-gray-600">{r.line} • {r.duration}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{r.fare}</p>
                {r.type === "train" ? <Train className="inline ml-2" /> : <Bus className="inline ml-2" />}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 即時班次查詢 */}
      {selected && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <Card className="w-80 bg-white shadow-lg">
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-2">{selected.from} → {selected.to}</h2>
              <p className="mb-1">🚄 路線：{selected.line}</p>
              <p className="mb-1">⏱ 耗時：{selected.duration}</p>
              <p className="mb-3">💴 費用：{selected.fare}</p>

              <p className="font-semibold mb-2 flex items-center"><Clock className="w-4 h-4 mr-1" /> 班次資訊</p>
              <ul className="list-disc ml-6 text-gray-700">
                {(realtime ? realtime.times : selected.schedule).map((time, idx) => (
                  <li key={idx}>{time}</li>
                ))}
              </ul>

              <div className="flex justify-between mt-4">
                <Button onClick={() => handleRealtime(selected)}>查即時班次</Button>
                <Button variant="secondary" onClick={() => setSelected(null)}>關閉</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
