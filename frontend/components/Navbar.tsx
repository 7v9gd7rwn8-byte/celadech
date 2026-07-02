'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';

export function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow">
      <div className="container flex items-center justify-between h-16">
        <Link href="/" className="text-2xl font-bold text-orange-500">
          🍳 Celadech
        </Link>

        <div className="flex gap-6 items-center">
          <Link href="/recipes" className="hover:text-orange-500">
            Recettes
          </Link>
          <Link href="/menus" className="hover:text-orange-500">
            Menus
          </Link>
          <Link href="/shopping" className="hover:text-orange-500">
            Liste d'achats
          </Link>

          {isAuthenticated ? (
            <>
              <Link href="/profile" className="hover:text-orange-500">
                {user?.username}
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="px-4 py-2 border border-orange-500 text-orange-500 rounded hover:bg-orange-500 hover:text-white"
              >
                Connexion
              </Link>
              <Link
                href="/auth/register"
                className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
              >
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
