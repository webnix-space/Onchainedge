'use client';
import { useEffect, useState } from 'react';

export default function CryptoNews() {
  const [news, setNews] = useState([]);
  
  useEffect(() => {
    fetch('/api/news').then(r => r.json()).then(d => setNews(d.news || []));
  }, []);
  
  return (
    <section className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">📰 Crypto News</h2>
        <span className="px-3 py-1 rounded-full border border-green-500/30 text-green-400 text-xs">
          <span className="live-dot"></span>LIVE
        </span>
      </div>
      
      <div className="space-y-3">
        {news.map((item, i) => (
          <a 
            key={i}
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block bg-slate-950/50 rounded-xl p-4 hover:bg-slate-900 transition"
          >
            <div className="text-purple-400 font-semibold mb-2 line-clamp-2">
              {item.title}
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{item.source}</span>
              <span>{item.date}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
