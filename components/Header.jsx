export default function Header() {
  return (
    <header className="text-center pt-4">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-2xl">
          ⚡
        </div>
        <h1 className="text-3xl font-bold">
          <span className="gradient-text">Onchain</span>
          <span className="text-white">Edge</span>
        </h1>
      </div>
      
      <div className="flex justify-center gap-2 flex-wrap">
        <Badge text="SoSoValue" />
        <Badge text="Groq AI" />
        <Badge text="Live Data" />
      </div>
    </header>
  );
}

function Badge({ text }) {
  return (
    <span className="px-4 py-1.5 rounded-full border border-green-500/30 bg-green-500/5 text-green-400 text-sm">
      <span className="live-dot"></span>{text}
    </span>
  );
}
