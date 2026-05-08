import Header from '@/components/Header';
import LivePrices from '@/components/LivePrices';
import MarketPulse from '@/components/MarketPulse';
import SignalEngine from '@/components/SignalEngine';
import ETFFlows from '@/components/ETFFlows';
import SSIIndexes from '@/components/SSIIndexes';
import Treasuries from '@/components/Treasuries';
import CryptoStocks from '@/components/CryptoStocks';
import CryptoNews from '@/components/CryptoNews';

export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <Header />
      
      <div className="text-center py-4">
        <h1 className="text-4xl font-bold mb-3">
          The <span className="gradient-text">One-Person Fund Manager</span>
        </h1>
        <p className="text-gray-400">
          Institutional crypto intelligence for solo traders. 
          Transparent AI signals from SoSoValue's ETF flows, SSI indexes, and treasury data.
        </p>
      </div>
      
      <LivePrices />
      <MarketPulse />
      <SignalEngine />
      <ETFFlows />
      <SSIIndexes />
      <Treasuries />
      <CryptoStocks />
      <CryptoNews />
      
      <footer className="text-center text-gray-500 text-sm py-8">
        Built for SoSoValue Buildathon · Powered by SoSoValue API + Groq AI
      </footer>
    </main>
  );
}
