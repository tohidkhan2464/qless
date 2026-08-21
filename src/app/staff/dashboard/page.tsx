'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function StaffDashboard() {
  const [queues, setQueues] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('qless_token');
    const userData = localStorage.getItem('qless_user');
    
    if (!token || !userData) {
      router.push('/login');
      return;
    }
    
    const u = JSON.parse(userData);
    if (u.role !== 'STAFF' && u.role !== 'ADMIN') {
      router.push('/student/dashboard');
      return;
    }
    setUser(u);
    
    const fetchQueues = async () => {
      try {
        const res = await fetch('/api/queues', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setQueues(await res.json());
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchQueues();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-blue-600">QueueLess Staff Portal</div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{user?.name}</span>
          <button onClick={() => { localStorage.clear(); router.push('/'); }} className="text-sm text-red-500 font-medium">Log out</button>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Active Queues</h1>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 font-medium">
            + Start New Queue
          </button>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {queues.map((q) => (
            <div key={q._id} className="bg-white rounded-2xl shadow-sm border p-6 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg">{q.serviceId?.name || 'Service'}</h3>
                <span className="px-2 py-1 text-xs rounded-md bg-green-100 text-green-700 font-bold">{q.status}</span>
              </div>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="text-sm text-gray-500 mb-1">Currently Serving Token</div>
                <div className="text-4xl font-black text-blue-600">#{q.currentTokenNumber}</div>
              </div>
              
              <Link href={`/staff/queue/${q._id}`} className="mt-auto block text-center w-full py-3 bg-gray-900 hover:bg-black text-white font-medium rounded-xl transition-colors">
                Manage Queue
              </Link>
            </div>
          ))}
          {queues.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-400 bg-white rounded-2xl border border-dashed">
              No active queues. Click "Start New Queue" to begin serving students.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
