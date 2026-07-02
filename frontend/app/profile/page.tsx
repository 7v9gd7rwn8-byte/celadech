'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await apiClient.put('/users/profile', {
        bio,
        avatar_url: avatarUrl,
      });
      setMessage('Profil mis à jour avec succès!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Mon Profil</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 max-w-md">
        <div className="mb-6 text-center">
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="Avatar"
              className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
            />
          )}
          <h2 className="text-2xl font-bold">{user?.username}</h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        {message && (
          <div className="p-4 bg-green-100 text-green-700 rounded mb-4">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">URL de l'avatar</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Parlez-nous de vous..."
              rows={4}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-orange-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Mise à jour...' : 'Mettre à jour le profil'}
          </button>
        </form>
      </div>
    </div>
  );
}
