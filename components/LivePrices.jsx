'use client';
import { useEffect, useState } from 'react';

export default function LivePrices() {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/price?symbols=BTC,ETH,SOL,BNB');
        const data = await res.json();
        if (data.ok) setPrices(data.prices);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrices();
    const interval = setInterval(fetchPrices, 30_000);
    return () => clearInterval(interval);
  }, []);
  
  return (
    <section className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">💰 Live Prices</h2>
        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold">
          SOSOVALUE
        </span>
      </div>
      
      <div className="grid gap-3">
        {['BTC', 'ETH', 'SOL', 'BNB'].map(sym => (
          <PriceCard 
            key={sym} 
            symbol={sym} 
            data={prices[sym]} 
            loading={loading}
          />
        ))}
      </div>
    </section>
  );
}

function PriceCard({ symbol, data, loading }) {
  const price = data?.price || 0;
  const change = data?.change || 0;
  const isUp = change >= 0;
  
  return (
    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
      <div className="text-center text-gray-400 text-sm mb-1">{symbol}</div>
      <div className="text-center text-3xl font-bold mb-1">
        {loading ? '...' : `$${price.toLocaleString(undefined, { 
          minimumFractionDigits: price < 100 ? 2 : 0,
          maximumFractionDigits: 2 
        })}`}
      </div>
      <div className={`text-center font-semibold ${isUp ? 'text-green-500' : 'text-red-500'}`}>
        {isUp ? '▲' : '▼'} {isUp ? '+' : ''}{change.toFixed(2)}%
      </div>
    </div>
  );
}
