'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import io from 'socket.io-client';

export default function QueueView() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [entry, setEntry] = useState<any>(null);
  
  const handleJoin = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('qless_token');
      const res = await fetch(`/api/queues/${params.queueId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestDescription: 'General Query' })
      });
      const data = await res.json();
      if (res.ok) {
        setEntry(data);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchEntry = async () => {
    try {
      const token = localStorage.getItem('qless_token');
      // If we already have the entry, fetch its fresh status
      if (entry) {
         // for simplicity, let's just re-join (which will just return existing if present)
         // or better, we should have a GET /api/queue-entries/me endpoint
         // for MVP, let's just reload the join endpoint which returns existing entry
         handleJoin();
      }
    } catch (e) {}
  };

  useEffect(() => {
    if (!entry) return;
    const socket = io();
    
    // Listen for general queue updates (position changes)
    socket.on(`queue_update_${params.queueId}`, () => {
      // we would normally re-fetch the specific entry status here
      handleJoin(); 
    });

    // Listen for specific user turn
    socket.on(`your_turn_${entry.studentId}`, (updatedEntry: any) => {
      setEntry(updatedEntry);
      // We could use browser notifications here in the future
      alert('🔔 Your turn has arrived! Please proceed to the office.');
    });
    
    return () => {
      socket.disconnect();
    };
  }, [entry?.studentId, params.queueId]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl text-center">
        {!entry ? (
          <>
            <h2 className="text-3xl font-bold mb-4">Join Queue</h2>
            <p className="text-gray-400 mb-8">Confirm you want to join this queue.</p>
            <button 
              onClick={handleJoin} 
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-fuchsia-600 to-pink-500 hover:from-fuchsia-500 hover:to-pink-400 rounded-xl font-bold shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all"
            >
              {loading ? 'Joining...' : 'Confirm Join'}
            </button>
            <button onClick={() => router.back()} className="mt-4 text-gray-500 hover:text-white transition-colors">
              Cancel
            </button>
          </>
        ) : (
          <>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 mx-auto flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(52,211,153,0.3)]">
              <span className="text-4xl font-black">#{entry.tokenNumber}</span>
            </div>
            <h2 className="text-2xl font-bold mb-2">You're in the queue!</h2>
            <div className="bg-black/50 rounded-2xl p-6 mt-6 border border-white/5">
              <div className="flex justify-between mb-4">
                <span className="text-gray-400">Your Position</span>
                <span className="font-bold">{entry.position}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status</span>
                <span className="font-bold text-yellow-400">{entry.status}</span>
              </div>
            </div>
            
            <button onClick={() => router.push('/student/dashboard')} className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors w-full">
              Back to Dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
}
