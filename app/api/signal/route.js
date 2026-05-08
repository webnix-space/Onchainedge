import { NextResponse } from 'next/server';
import { generateSignal, validateRisk } from '@/lib/groq';
import { 
  getPriceBySymbol, getETFFlows, getSSISectors, getBTCTreasuries 
} from '@/lib/soso';

export async function POST(request) {
  try {
    const { asset = 'BTC' } = await request.json();
    
    // Fetch market data
    const [priceData, etfData, sectors, treasuries] = await Promise.all([
      getPriceBySymbol(asset),
      getETFFlows(),
      getSSISectors(),
      getBTCTreasuries()
    ]);
    
    if (!priceData) {
      return NextResponse.json({ 
        ok: false, 
        error: 'Price data unavailable' 
      }, { status: 503 });
    }
    
    const topSector = sectors?.reduce((max, s) => 
      s.change > (max?.change || -Infinity) ? s : max, null);
    
    const pulseScore = calculatePulseScore(etfData?.totalNetInflow, topSector);
    
    const marketData = {
      symbol: asset,
      price: priceData.price,
      etfFlow: etfData?.totalNetInflow || 0,
      topSector,
      pulseScore,
      treasuryHoldings: treasuries?.[0]?.btc_holdings || 0
    };
    
    // Generate AI signal
    const signal = await generateSignal(asset, marketData);
    const risk = await validateRisk(signal, marketData);
    
    return NextResponse.json({
      ok: true,
      asset,
      signal: signal.signal,
      confidence: signal.confidence,
      entry: signal.entry,
      stopLoss: signal.stopLoss,
      takeProfit: signal.takeProfit,
      reasoning: signal.reasoning,
      risk,
      pulseScore,
      etfFlow: etfData?.totalNetInflow,
      timestamp: Date.now()
    });
  } catch (err) {
    console.error('Signal error:', err);
    return NextResponse.json({ 
      ok: false, 
      error: err.message 
    }, { status: 500 });
  }
}

function calculatePulseScore(etfFlow, topSector) {
  let score = 50;
  
  if (etfFlow > 500_000_000) score += 25;
  else if (etfFlow > 100_000_000) score += 15;
  else if (etfFlow < -100_000_000) score -= 20;
  
  if (topSector?.change > 5) score += 20;
  else if (topSector?.change > 2) score += 10;
  else if (topSector?.change < -2) score -= 10;
  
  return Math.min(100, Math.max(0, score));
}
