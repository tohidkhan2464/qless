'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import io from 'socket.io-client';

export default function StaffQueueView() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<any>(null);
  
  const fetchStatus = async () => {
    try {
      const token = localStorage.getItem('qless_token');
      const res = await fetch(`/api/queues/${params.queueId}/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setStatus(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    
    // Connect to Socket.IO
    const socket = io();
    socket.on(`queue_update_${params.queueId}`, () => {
      fetchStatus();
    });
    
    return () => {
      socket.disconnect();
    };
  }, [params.queueId]);

  const handleServeNext = async () => {
    try {
      const token = localStorage.getItem('qless_token');
      await fetch(`/api/queues/${params.queueId}/serve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchStatus();
    } catch (err) {
      console.error(err);
    }
  };
  
  const handleSkip = async (entryId: string) => {
    try {
      const token = localStorage.getItem('qless_token');
      await fetch(`/api/queue-entries/${entryId}/skip`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchStatus();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">Loading...</div>;
  if (!status) return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">Queue not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/staff/dashboard')} className="text-gray-500 hover:text-blue-600 transition-colors">
            &larr; Back
          </button>
          <div className="text-xl font-bold text-gray-900">{status.queue.serviceId?.name}</div>
        </div>
        <div className="px-3 py-1 bg-green-100 text-green-700 text-sm font-bold rounded-lg border border-green-200">
          {status.queue.status}
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto p-8 grid md:grid-cols-2 gap-8">
        {/* Left Column - Current Serving */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-sm border p-8 flex flex-col items-center text-center">
            <h2 className="text-gray-500 font-semibold mb-2 uppercase tracking-wider text-sm">Currently Serving</h2>
            <div className="w-32 h-32 rounded-full bg-blue-50 border-4 border-blue-100 flex items-center justify-center mb-6">
              <span className="text-5xl font-black text-blue-600">
                {status.serving ? `#${status.serving.tokenNumber}` : '--'}
              </span>
            </div>
            
            <div className="flex gap-4 w-full">
              <button 
                onClick={handleServeNext}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all active:scale-[0.98] shadow-[0_4px_14px_0_rgba(37,99,235,0.39)]"
              >
                Serve Next Token
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl shadow-sm border p-6">
            <h3 className="font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              <button className="p-4 rounded-xl border hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">Pause Queue</button>
              <button className="p-4 rounded-xl border hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors text-sm font-medium text-gray-700">Close Queue</button>
            </div>
          </div>
        </div>

        {/* Right Column - Waiting List */}
        <div className="bg-white rounded-3xl shadow-sm border p-6 flex flex-col max-h-[80vh]">
          <div className="flex justify-between items-center mb-6 pb-4 border-b">
            <h3 className="font-bold text-lg">Waiting Students</h3>
            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-bold">
              {status.waiting.length} waiting
            </span>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {status.waiting.length === 0 ? (
              <div className="text-center py-12 text-gray-400">Queue is empty.</div>
            ) : (
              status.waiting.map((entry: any) => (
                <div key={entry._id} className="flex justify-between items-center p-4 rounded-xl border hover:shadow-sm transition-shadow group bg-gray-50 hover:bg-white">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center">
                      #{entry.tokenNumber}
                    </div>
                    <div>
                      <div className="font-medium text-sm text-gray-500">Position {entry.position}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSkip(entry._id)}
                    className="text-xs font-semibold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1 rounded hover:bg-red-50"
                  >
                    Skip
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
