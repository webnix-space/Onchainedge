import { NextResponse } from 'next/server';
import { 
  getETFFlows, getSSISectors, getBTCTreasuries, 
  getCryptoStocks, getCurrencies 
} from '@/lib/soso';

export async function GET() {
  const [etf, sectors, treasuries, stocks, currencies] = await Promise.all([
    getETFFlows(),
    getSSISectors(),
    getBTCTreasuries(),
    getCryptoStocks(),
    getCurrencies()
  ]);
  
  return NextResponse.json({
    ok: true,
    timestamp: Date.now(),
    etf,
    sectors,
    treasuries: treasuries?.slice(0, 10) || [],
    stocks,
    currenciesCount: currencies?.length || 0
  });
}
