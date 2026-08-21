'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const userData = localStorage.getItem('qless_user');
    if (userData) {
      setRole(JSON.parse(userData).role);
    }
  }, []);

  const studentLinks = [
    { name: 'Dashboard', href: '/student/dashboard' },
  ];

  const staffLinks = [
    { name: 'Dashboard', href: '/staff/dashboard' },
  ];

  const links = role === 'STAFF' || role === 'ADMIN' ? staffLinks : role === 'STUDENT' ? studentLinks : [];

  if (links.length === 0) return null; // Don't show sidebar if not logged in

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 text-white min-h-screen p-6 hidden md:block">
      <div className="font-black text-2xl mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-500">
        QueueLess
      </div>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={`px-4 py-3 rounded-xl transition-colors ${
              pathname === link.href ? 'bg-fuchsia-600/20 text-fuchsia-400' : 'hover:bg-white/5 text-gray-400'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
