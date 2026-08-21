'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Queue {
  _id: string;
  serviceId: {
    _id: string;
    name: string;
    description: string;
    averageServiceTime: number;
    departmentId: {
      name: string;
    };
  };
  status: string;
}

export default function StudentDashboard() {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('qless_token');
    const userData = localStorage.getItem('qless_user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    
    const fetchQueues = async () => {
      try {
        const res = await fetch('/api/queues', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // We populate serviceId, but we might need to populate departmentId too if we altered the backend.
          setQueues(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    
    fetchQueues();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="p-6 border-b border-white/10 flex justify-between items-center backdrop-blur-md sticky top-0 z-10">
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-fuchsia-500">
          QueueLess
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Hello, {user?.name}</span>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} className="text-sm px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 mt-8">
        <h1 className="text-4xl font-extrabold mb-2">Available Services</h1>
        <p className="text-gray-400 mb-10">Select a service to join the queue digitally.</p>

        {queues.length === 0 ? (
          <div className="p-12 border border-dashed border-white/20 rounded-3xl text-center text-gray-500">
            No active queues available right now.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {queues.map((queue) => (
              <div key={queue._id} className="group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer relative overflow-hidden flex flex-col">
                <div className="absolute top-0 right-0 p-4">
                  <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                    {queue.status}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold mb-2 pr-16">{queue.serviceId?.name || 'Service'}</h3>
                <p className="text-sm text-gray-400 mb-6 flex-1">{queue.serviceId?.description || 'No description provided.'}</p>
                
                <div className="flex justify-between items-center mt-auto">
                  <div className="text-xs text-gray-500">
                    Est. wait: {queue.serviceId?.averageServiceTime || 5} min/person
                  </div>
                  <Link href={`/student/queues/${queue._id}`} className="px-5 py-2 rounded-full bg-fuchsia-600 hover:bg-fuchsia-500 text-sm font-semibold transition-colors shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                    Join Queue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
