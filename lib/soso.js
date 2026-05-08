const BASE = process.env.SOSOVALUE_BASE_URL || 'https://openapi.sosovalue.com/openapi/v1';
const KEY = process.env.SOSOVALUE_API_KEY;

const cache = new Map();
const CACHE_TTL = 60_000; // 60 seconds

async function sosoFetch(endpoint, params = {}) {
  const url = new URL(`${BASE}${endpoint}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) url.searchParams.append(k, v);
  });
  
  const cacheKey = url.toString();
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }
  
  try {
    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'x-soso-api-key': KEY,
        'Content-Type': 'application/json'
      }
    });
    
    if (!res.ok) {
      const text = await res.text();
      console.error(`SoSo ${endpoint} → ${res.status}: ${text}`);
      return null;
    }
    
    const data = await res.json();
    cache.set(cacheKey, { data, time: Date.now() });
    return data;
  } catch (err) {
    console.error(`SoSo fetch error:`, err.message);
    return null;
  }
}

// ============ CURRENCY APIs ============
export async function getCurrencies() {
  return sosoFetch('/currencies');
}

export async function getCurrencyInfo(currencyId) {
  return sosoFetch(`/currencies/${currencyId}`);
}

export async function getCurrencySnapshot(currencyId) {
  return sosoFetch(`/currencies/${currencyId}/market-snapshot`);
}

// Get price by symbol (BTC, ETH, etc)
export async function getPriceBySymbol(symbol) {
  const currencies = await getCurrencies();
  if (!currencies) return null;
  
  const currency = currencies.find(c => 
    c.symbol?.toUpperCase() === symbol.toUpperCase()
  );
  if (!currency) return null;
  
  const snapshot = await getCurrencySnapshot(currency.currency_id);
  if (!snapshot) return null;
  
  return {
    symbol,
    price: snapshot.price || 0,
    change: snapshot.change_pct_24h || 0,
    marketcap: snapshot.marketcap || 0,
    volume: snapshot.turnover_24h || 0
  };
}

// ============ ETF APIs ============
export async function getETFList(symbol = 'BTC') {
  return sosoFetch('/etfs', { symbol, country_code: 'US' });
}

export async function getETFSummaryHistory(symbol = 'BTC', limit = 30) {
  return sosoFetch('/etfs/summary-history', { 
    symbol, 
    country_code: 'US', 
    limit 
  });
}

export async function getETFSnapshot(ticker) {
  return sosoFetch(`/etfs/${ticker}/market-snapshot`);
}

export async function getETFHistory(ticker, limit = 30) {
  return sosoFetch(`/etfs/${ticker}/history`, { limit });
}

// Get all ETF flows
export async function getETFFlows() {
  const tickers = [
    { ticker: 'IBIT', issuer: 'BlackRock' },
    { ticker: 'FBTC', issuer: 'Fidelity' },
    { ticker: 'BITB', issuer: 'Bitwise' },
    { ticker: 'ARKB', issuer: 'ARK 21Shares' },
    { ticker: 'GBTC', issuer: 'Grayscale' }
  ];
  
  const results = await Promise.all(
    tickers.map(async ({ ticker, issuer }) => {
      const snap = await getETFSnapshot(ticker);
      return {
        ticker,
        issuer,
        netInflow: snap?.net_inflow || 0,
        cumInflow: snap?.cum_inflow || 0,
        netAssets: snap?.net_assets || 0
      };
    })
  );
  
  const totalNetInflow = results.reduce((sum, r) => sum + r.netInflow, 0);
  
  return { etfs: results, totalNetInflow };
}

// ============ SSI INDEX APIs ============
export async function getIndices() {
  return sosoFetch('/indices');
}

export async function getIndexConstituents(indexTicker) {
  return sosoFetch(`/indices/${indexTicker}/constituents`);
}

export async function getIndexSnapshot(indexTicker) {
  return sosoFetch(`/indices/${indexTicker}/market-snapshot`);
}

// Get SSI sectors with changes
export async function getSSISectors() {
  const sectors = [
    { ticker: 'ssiLayer1', name: 'Layer 1' },
    { ticker: 'ssiDefi', name: 'DeFi' },
    { ticker: 'ssiMeme', name: 'Meme' },
    { ticker: 'ssiAi', name: 'AI' },
    { ticker: 'ssiGaming', name: 'Gaming' },
    { ticker: 'ssiSocialFi', name: 'SocialFi' }
  ];
  
  const results = await Promise.all(
    sectors.map(async ({ ticker, name }) => {
      const snap = await getIndexSnapshot(ticker);
      return {
        ticker,
        name,
        change: snap?.change_pct_24h || 0,
        price: snap?.price || 0
      };
    })
  );
  
  return results;
}

// ============ TREASURY APIs ============
export async function getBTCTreasuries() {
  return sosoFetch('/btc-treasuries');
}

// ============ CRYPTO STOCKS ============
export async function getCryptoStocksList() {
  return sosoFetch('/crypto-stocks');
}

export async function getCryptoStockSnapshot(ticker) {
  return sosoFetch(`/crypto-stocks/${ticker}/market-snapshot`);
}

export async function getCryptoStocks() {
  const tickers = ['MSTR', 'COIN', 'MARA', 'RIOT', 'CLSK'];
  
  const results = await Promise.all(
    tickers.map(async (ticker) => {
      const snap = await getCryptoStockSnapshot(ticker);
      return {
        ticker,
        price: snap?.price || 0,
        change: snap?.change_pct_24h || 0
      };
    })
  );
  
  return results;
}
