import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-900 via-purple-900 to-black text-white selection:bg-fuchsia-500 selection:text-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between p-6 md:px-12 backdrop-blur-md bg-black/20 border-b border-white/10 sticky top-0 z-50">
        <div className="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-500">
          QueueLess
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="px-5 py-2 text-sm font-semibold rounded-full hover:bg-white/10 transition-colors">
            Log in
          </Link>
          <Link href="/register" className="px-5 py-2 text-sm font-semibold bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            Sign up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center p-6 mt-10 md:mt-0 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            Don't Wait.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500">
              Arrive When It's Your Turn.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl font-light">
            Join the college office queue digitally. Do your other work. Get notified when your turn is near.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <Link href="/register" className="group relative px-8 py-4 bg-white text-black text-lg font-bold rounded-full overflow-hidden transition-transform hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)]">
              <span className="relative z-10">Get Started as Student</span>
              <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-gray-100 to-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
            
            <Link href="/login" className="px-8 py-4 bg-white/10 text-white text-lg font-bold rounded-full border border-white/20 hover:bg-white/20 transition-all hover:border-white/40 active:scale-95 backdrop-blur-sm">
              Staff Portal
            </Link>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl w-full mt-32 relative z-10 px-4 pb-20">
          {[
            { title: 'Digital Tokens', desc: 'Get your token number instantly without standing in a physical line.' },
            { title: 'Live Tracking', desc: 'Watch the queue progress in real-time from your smartphone.' },
            { title: 'Smart Alerts', desc: 'Receive a notification when you are 5 positions away from your turn.' }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-colors group">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-fuchsia-500 mb-6 flex items-center justify-center text-xl font-bold shadow-[0_0_15px_rgba(236,72,153,0.5)] group-hover:scale-110 transition-transform">
                {i + 1}
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
