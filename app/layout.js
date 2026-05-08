import './globals.css';

export const metadata = {
  title: 'OnchainEdge — AI Crypto Terminal',
  description: 'Institutional crypto intelligence for solo traders'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
