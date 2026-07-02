'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { setAuth } from '@/store/slices/authSlice';
import { apiClient } from '@/lib/api';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      dispatch(
        setAuth({
          user: response.data.user,
          token: response.data.token,
        })
      );

      router.push('/recipes');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Connexion</h1>

          {error && (
            <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-orange-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="mt-4 text-center">
            Pas encore de compte?{' '}
            <Link href="/auth/register" className="text-orange-500 hover:underline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
