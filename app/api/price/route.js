import { NextResponse } from 'next/server';
import { getPriceBySymbol } from '@/lib/soso';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const symbols = (searchParams.get('symbols') || 'BTC,ETH,SOL,BNB').split(',');
  
  const prices = await Promise.all(
    symbols.map(s => getPriceBySymbol(s.trim()))
  );
  
  const result = {};
  symbols.forEach((sym, i) => {
    result[sym] = prices[i] || { price: 0, change: 0 };
  });
  
  return NextResponse.json({
    ok: true,
    prices: result,
    timestamp: Date.now()
  });
}
