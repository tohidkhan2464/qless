import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between p-4 md:px-8 backdrop-blur-md bg-black/80 border-b border-white/10 sticky top-0 z-50">
      <Link href="/" className="text-xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-500">
        QueueLess
      </Link>
      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 text-sm font-semibold text-white rounded-full hover:bg-white/10 transition-colors">
          Log in
        </Link>
        <Link href="/register" className="px-4 py-2 text-sm font-semibold bg-white text-black rounded-full hover:bg-gray-200 transition-colors">
          Sign up
        </Link>
      </div>
    </nav>
  );
}
