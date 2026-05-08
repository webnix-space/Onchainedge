'use client';
import { useEffect, useState } from 'react';

export default function MarketPulse() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/soso')
      .then(r => r.json())
      .then(d => {
        const topSector = d.sectors?.reduce((max, s) => 
          s.change > (max?.change || -Infinity) ? s : max, null);
        
        const score = calculateScore(d.etf?.totalNetInflow, topSector);
        
        setData({
          score,
          etfFlow: d.etf?.totalNetInflow || 0,
          topSector,
          treasuries: d.treasuries?.[0]?.btc_holdings || 604000
        });
      });
  }, []);
  
  if (!data) return <Loading title="🔥 SoSoValue Market Pulse" />;
  
  return (
    <section className="card">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">🔥 SoSoValue Market Pulse</h2>
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold">
          POWERED BY SOSOVALUE
        </span>
      </div>
      
      <div className="text-center mb-6">
        <div className="text-7xl font-bold gradient-text">{data.score}</div>
        <div className="text-gray-400 text-sm mt-2">MARKET PULSE SCORE (0-100)</div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Metric 
          icon="📈"
          label="ETF NET FLOW"
          value={`${data.etfFlow >= 0 ? '+' : ''}$${(data.etfFlow / 1e6).toFixed(1)}M`}
          tag="SOSOVALUE ETF API"
          positive={data.etfFlow > 0}
        />
        <Metric 
          icon="🎯"
          label="TOP SSI SECTOR"
          value={`${data.topSector?.name || '-'} ${data.topSector?.change > 0 ? '+' : ''}${data.topSector?.change?.toFixed(2) || 0}%`}
          tag="SOSOVALUE SSI API"
          positive={data.topSector?.change > 0}
        />
        <Metric 
          icon="🏛️"
          label="INSTITUTIONAL BTC"
          value={`${(data.treasuries / 1000).toFixed(0)}K BTC`}
          tag="SOSOVALUE TREASURY"
          positive={true}
        />
        <Metric 
          icon="🤖"
          label="AI INTERPRETATION"
          value={data.score > 70 ? '🟢 Bullish' : data.score > 40 ? '🟡 Neutral' : '🔴 Bearish'}
          tag="GROQ + SOSOVALUE"
          positive={data.score > 50}
        />
      </div>
    </section>
  );
}

function Metric({ icon, label, value, tag, positive }) {
  return (
    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-xs text-gray-500 mb-1">{label}</div>
      <div className={`font-bold mb-2 ${positive ? 'text-green-400' : 'text-red-400'}`}>
        {value}
      </div>
      <div className="text-[10px] text-purple-400 font-semibold">{tag}</div>
    </div>
  );
}

function Loading({ title }) {
  return (
    <section className="card">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      <div className="text-center text-gray-500 py-12">Loading...</div>
    </section>
  );
}

function calculateScore(etfFlow, topSector) {
  let score = 50;
  if (etfFlow > 500e6) score += 25;
  else if (etfFlow > 100e6) score += 15;
  else if (etfFlow < -100e6) score -= 20;
  
  if (topSector?.change > 5) score += 20;
  else if (topSector?.change > 2) score += 10;
  else if (topSector?.change < -2) score -= 10;
  
  return Math.min(100, Math.max(0, score));
}
