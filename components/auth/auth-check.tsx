'use client';

import { useEffect, useState } from 'react';

export function AuthCheck() {
  const [status, setStatus] = useState<'checking' | 'ok' | 'error'>('checking');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setStatus('error');
      setMessage('Missing Supabase environment variables. Please check .env.local file.');
    } else {
      setStatus('ok');
      setMessage('Supabase configured correctly');
    }
  }, []);

  if (status === 'checking') return null;

  if (status === 'error') {
    return (
      <div className="fixed bottom-4 right-4 z-50 max-w-md p-4 bg-destructive text-destructive-foreground rounded-lg shadow-lg">
        <h3 className="font-bold mb-2">⚠️ Configuration Error</h3>
        <p className="text-sm">{message}</p>
        <p className="text-xs mt-2">
          Create a <code>.env.local</code> file with:
          <br />
          <code>NEXT_PUBLIC_SUPABASE_URL=your_url</code>
          <br />
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key</code>
        </p>
      </div>
    );
  }

  return null;
}
