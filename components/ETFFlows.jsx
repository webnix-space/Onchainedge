'use client';
import { useEffect, useState } from 'react';

export default function ETFFlows() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/soso').then(r => r.json()).then(d => setData(d.etf));
  }, []);
  
  if (!data) return null;
  
  return (
    <section className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📊 BTC ETF Flows</h2>
        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
          SOSOVALUE
        </span>
      </div>
      
      <div className="text-center mb-6">
        <div className={`text-4xl font-bold ${data.totalNetInflow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          {data.totalNetInflow >= 0 ? '+' : ''}${(data.totalNetInflow / 1e6).toFixed(1)}M
        </div>
        <div className="text-gray-400 text-sm">Total Net Inflow Today</div>
      </div>
      
      <div className="space-y-2">
        {data.etfs?.map(etf => (
          <div key={etf.ticker} className="flex justify-between items-center bg-slate-950/50 rounded-xl p-4">
            <div>
              <div className="font-bold">{etf.ticker}</div>
              <div className="text-xs text-gray-400">{etf.issuer}</div>
            </div>
            <div className={`font-bold ${etf.netInflow >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {etf.netInflow >= 0 ? '+' : ''}${(etf.netInflow / 1e6).toFixed(1)}M
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
