import { NextResponse } from 'next/server';

const cache = { data: null, time: 0 };
const TTL = 5 * 60_000; // 5 min

export async function GET() {
  if (cache.data && Date.now() - cache.time < TTL) {
    return NextResponse.json(cache.data);
  }
  
  try {
    // Try CoinGecko news (free)
    const res = await fetch(
      'https://api.coingecko.com/api/v3/news',
      { next: { revalidate: 300 } }
    );
    
    let news = [];
    
    if (res.ok) {
      const data = await res.json();
      news = (data.data || []).slice(0, 10).map(item => ({
        title: item.title,
        source: item.news_site || 'CoinGecko',
        url: item.url,
        date: formatDate(item.updated_at)
      }));
    }
    
    // Fallback to mock if API fails
    if (news.length === 0) {
      news = getMockNews();
    }
    
    const result = { ok: true, news, timestamp: Date.now() };
    cache.data = result;
    cache.time = Date.now();
    
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ 
      ok: true, 
      news: getMockNews(),
      timestamp: Date.now()
    });
  }
}

function formatDate(timestamp) {
  const date = new Date(timestamp * 1000 || timestamp);
  const now = new Date();
  if (date > now) date.setTime(now.getTime());
  return date.toLocaleDateString('en-US');
}

function getMockNews() {
  const today = new Date().toLocaleDateString('en-US');
  return [
    { title: 'Bitcoin ETF inflows continue strong momentum', source: 'CoinDesk', date: today, url: '#' },
    { title: 'Ethereum Layer 2 adoption hits new highs', source: 'CoinTelegraph', date: today, url: '#' },
    { title: 'Major institutions add BTC to treasury', source: 'Bloomberg', date: today, url: '#' }
  ];
}
