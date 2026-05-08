import { NextResponse } from 'next/server';
import * as soso from '@/lib/soso';

export async function GET() {
  const tests = {
    currencies: await soso.getCurrencies().then(d => ({ ok: !!d, count: d?.length })),
    etf_list: await soso.getETFList('BTC').then(d => ({ ok: !!d, count: d?.length })),
    etf_flows: await soso.getETFFlows().then(d => ({ ok: !!d, total: d?.totalNetInflow })),
    indices: await soso.getIndices().then(d => ({ ok: !!d, count: d?.length })),
    treasuries: await soso.getBTCTreasuries().then(d => ({ ok: !!d, count: d?.length })),
    stocks: await soso.getCryptoStocks().then(d => ({ ok: !!d, count: d?.length })),
    btc_price: await soso.getPriceBySymbol('BTC').then(d => ({ ok: !!d, price: d?.price }))
  };
  
  return NextResponse.json({
    timestamp: Date.now(),
    base_url: process.env.SOSOVALUE_BASE_URL,
    has_key: !!process.env.SOSOVALUE_API_KEY,
    tests
  });
}
