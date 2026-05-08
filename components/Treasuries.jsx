'use client';
import { useEffect, useState } from 'react';

export default function Treasuries() {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    fetch('/api/soso').then(r => r.json()).then(d => setData(d.treasuries || []));
  }, []);
  
  return (
    <section className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">🏛️ BTC Treasury</h2>
        <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold">
          SOSO CACHED
        </span>
      </div>
      
      <div className="space-y-2">
        {data.slice(0, 5).map((t, i) => (
          <div key={i} className="flex justify-between items-center bg-slate-950/50 rounded-xl p-4">
            <div>
              <div className="font-bold">{t.company_name || t.name}</div>
              <div className="text-xs text-gray-500">{t.ticker}</div>
            </div>
            <div className="font-bold">
              {(t.btc_holdings || 0).toLocaleString()} BTC
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
