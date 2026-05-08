import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function generateSignal(asset, marketData) {
  const prompt = `You are a crypto trading analyst. Analyze this data and provide a signal.

Asset: ${asset}
Current Price: $${marketData.price}
ETF Net Inflow Today: $${(marketData.etfFlow / 1e6).toFixed(1)}M
Top SSI Sector: ${marketData.topSector?.name} (${marketData.topSector?.change > 0 ? '+' : ''}${marketData.topSector?.change?.toFixed(2)}%)
Market Pulse Score: ${marketData.pulseScore}/100
BTC Treasury Holdings: ${marketData.treasuryHoldings} BTC

Provide a JSON response with:
{
  "signal": "BUY" | "SELL" | "HOLD",
  "confidence": 0-100,
  "reasoning": "2-3 sentence explanation",
  "stopLossPercent": number (e.g. 5 for 5%),
  "takeProfitPercent": number (e.g. 8 for 8%)
}

Respond ONLY with valid JSON, no markdown.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    });
    
    const result = JSON.parse(completion.choices[0].message.content);
    
    return {
      signal: result.signal || 'HOLD',
      confidence: Math.min(100, Math.max(0, result.confidence || 50)),
      reasoning: result.reasoning || '',
      entry: marketData.price,
      stopLoss: marketData.price * (1 - (result.stopLossPercent || 5) / 100),
      takeProfit: marketData.price * (1 + (result.takeProfitPercent || 8) / 100)
    };
  } catch (err) {
    console.error('Groq error:', err.message);
    return {
      signal: 'HOLD',
      confidence: 30,
      reasoning: 'AI temporarily unavailable. Showing default signal.',
      entry: marketData.price,
      stopLoss: marketData.price * 0.95,
      takeProfit: marketData.price * 1.08
    };
  }
}

export async function validateRisk(signal, marketData) {
  const prompt = `Risk validator. Find weaknesses in this trade signal.

Signal: ${signal.signal} ${marketData.symbol} at $${marketData.price}
Confidence: ${signal.confidence}%
ETF Flow: $${(marketData.etfFlow / 1e6).toFixed(1)}M

Return JSON:
{
  "riskScore": 0-100 (higher = riskier),
  "warnings": ["warning 1", "warning 2"],
  "contrarian": "1-2 sentence opposing view"
}

JSON only.`;

  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });
    
    return JSON.parse(completion.choices[0].message.content);
  } catch (err) {
    return {
      riskScore: 50,
      warnings: ['Risk validator unavailable'],
      contrarian: 'Unable to generate contrarian view at this time.'
    };
  }
}
