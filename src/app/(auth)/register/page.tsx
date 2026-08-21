'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'STUDENT', enrollmentNumber: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      
      // Auto-login after register
      const loginRes = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });
      const loginData = await loginRes.json();
      if (!loginRes.ok) throw new Error('Login after register failed');
      
      localStorage.setItem('qless_token', loginData.token);
      localStorage.setItem('qless_user', JSON.stringify(loginData.user));
      
      router.push(loginData.user.role === 'STAFF' ? '/staff/dashboard' : '/student/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
        <h2 className="text-3xl font-bold mb-2">Create Account</h2>
        <p className="text-gray-400 mb-8">Join the queue digitally today.</p>
        
        {error && <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input type="email" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all" placeholder="you@college.edu" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
            <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all text-white">
              <option value="STUDENT" className="bg-gray-900">Student</option>
              <option value="STAFF" className="bg-gray-900">Staff</option>
            </select>
          </div>
          {formData.role === 'STUDENT' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Enrollment Number</label>
              <input type="text" value={formData.enrollmentNumber} onChange={(e) => setFormData({...formData, enrollmentNumber: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none transition-all" placeholder="e.g. 12345678" />
            </div>
          )}
          
          <button type="submit" disabled={loading} className="w-full py-4 mt-6 bg-gradient-to-r from-blue-500 to-fuchsia-500 hover:from-blue-600 hover:to-fuchsia-600 text-white font-bold rounded-xl shadow-[0_0_20px_rgba(236,72,153,0.3)] transition-all active:scale-[0.98] disabled:opacity-50">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link href="/login" className="text-fuchsia-400 hover:text-fuchsia-300 font-medium">Log in</Link>
        </div>
      </div>
    </div>
  );
}
