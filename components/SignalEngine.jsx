'use client';
import { useEffect, useState } from 'react';

const ASSETS = ['BTC', 'ETH', 'SOL', 'BNB', 'MARKET'];

export default function SignalEngine() {
  const [asset, setAsset] = useState('BTC');
  const [signal, setSignal] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const generate = async (a) => {
    setLoading(true);
    try {
      const res = await fetch('/api/signal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset: a })
      });
      const data = await res.json();
      setSignal(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    generate(asset);
  }, [asset]);
  
  return (
    <section className="card">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-1">
          🤖 AI Signal Engine — Dual-Model + Audit Trail
        </h2>
        <span className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold mt-2">
          SOSOVALUE DATA
        </span>
      </div>
      
      <div className="grid grid-cols-5 gap-2 mb-4">
        {ASSETS.map(a => (
          <button
            key={a}
            onClick={() => setAsset(a)}
            className={`py-2 px-2 rounded-lg text-sm font-bold transition-all ${
              asset === a 
                ? 'bg-purple-600 text-white' 
                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
            }`}
          >
            {a}
          </button>
        ))}
      </div>
      
      <button 
        onClick={() => generate(asset)}
        disabled={loading}
        className={`w-full py-4 rounded-xl font-bold text-lg mb-4 transition-all ${
          signal?.signal === 'BUY' ? 'bg-green-500/20 border-2 border-green-500 text-green-400' :
          signal?.signal === 'SELL' ? 'bg-red-500/20 border-2 border-red-500 text-red-400' :
          'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400'
        }`}
      >
        {loading ? 'ANALYZING...' : signal?.signal || 'BUY'}
      </button>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">AI Confidence (Weighted)</span>
          <span className="font-bold">{signal?.confidence || 0}%</span>
        </div>
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            style={{ width: `${signal?.confidence || 0}%` }}
          />
        </div>
      </div>
      
      <div className="grid gap-3 mb-4">
        <Box label="ENTRY" value={signal?.entry} color="text-white" />
        <Box label="STOP LOSS" value={signal?.stopLoss} color="text-red-400" />
        <Box label="TAKE PROFIT" value={signal?.takeProfit} color="text-green-400" />
      </div>
      
      {signal?.reasoning && (
        <div className="bg-slate-950/50 rounded-xl p-4 text-sm text-gray-300 leading-relaxed mb-4">
          {signal.reasoning}
        </div>
      )}
      
      {signal && <AuditTrail signal={signal} asset={asset} />}
    </section>
  );
}

function Box({ label, value, color }) {
  return (
    <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
      <div className="text-center text-xs text-gray-500 mb-1">{label}</div>
      <div className={`text-center text-2xl font-bold ${color}`}>
        ${value?.toLocaleString(undefined, { 
          minimumFractionDigits: 2, 
          maximumFractionDigits: 4 
        }) || '0.00'}
      </div>
    </div>
  );
}

function AuditTrail({ signal, asset }) {
  return (
    <div className="border-t border-slate-800 pt-4 mt-4">
      <h3 className="text-purple-400 font-bold mb-3">📊 AUDIT TRAIL — FULL TRANSPARENCY</h3>
      
      <div className="space-y-2 text-sm">
        <AuditRow icon="📥" label="Data from SoSoValue" status="live" />
        <AuditRow icon="🧠" label={`Primary Analysis [M1] · llama-3.3-70b · ${signal.confidence}% · ${signal.signal}`} />
        <AuditRow icon="🛡️" label={`Risk Validation [M2] · llama-3.1-8b · Score: ${signal.risk?.riskScore || 0}/100`} />
        {signal.risk?.warnings?.length > 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 text-yellow-300 text-xs">
            <div className="font-bold mb-1">⚠️ Risk Warnings</div>
            {signal.risk.warnings.map((w, i) => (
              <div key={i}>• {w}</div>
            ))}
          </div>
        )}
        {signal.risk?.contrarian && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 text-blue-300 text-xs">
            <div className="font-bold mb-1">🔄 Contrarian View</div>
            {signal.risk.contrarian}
          </div>
        )}
      </div>
    </div>
  );
}

function AuditRow({ icon, label, status }) {
  return (
    <div className="flex items-center justify-between bg-slate-950/50 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-gray-300">{label}</span>
      </div>
      {status && (
        <span className="text-green-400 text-xs">●live</span>
      )}
    </div>
  );
}
