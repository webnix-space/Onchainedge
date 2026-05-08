'use client';
import { useEffect, useState } from 'react';

export default function SSIIndexes() {
  const [sectors, setSectors] = useState([]);
  
  useEffect(() => {
    fetch('/api/soso').then(r => r.json()).then(d => setSectors(d.sectors || []));
  }, []);
  
  return (
    <section className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🎯 SSI Indexes</h2>
        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
          SOSOVALUE
        </span>
      </div>
      
      <div className="space-y-2">
        {sectors.map(s => (
          <div key={s.ticker} className="flex justify-between items-center bg-slate-950/50 rounded-xl p-4">
            <div>
              <div className="font-bold">{s.name}</div>
              <div className="text-xs text-gray-500">{s.ticker}</div>
            </div>
            <div className="text-right">
              <div className={`font-bold ${s.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {s.change >= 0 ? '+' : ''}{s.change.toFixed(2)}%
              </div>
              <div className="text-xs text-purple-400">VIEW →</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
