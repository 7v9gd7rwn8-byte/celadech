'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

export default function Home() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <div className="container">
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-6xl font-bold mb-4">🍳 Celadech</h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mb-8">
            Explorez, partagez et gérez vos recettes préférées
          </p>

          {isAuthenticated ? (
            <div className="flex gap-4 justify-center">
              <Link
                href="/recipes"
                className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-lg"
              >
                Voir les recettes
              </Link>
              <Link
                href="/recipes/create"
                className="px-8 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white text-lg"
              >
                Créer une recette
              </Link>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Link
                href="/auth/register"
                className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-lg"
              >
                Commencer
              </Link>
              <Link
                href="/auth/login"
                className="px-8 py-3 border border-orange-500 text-orange-500 rounded-lg hover:bg-orange-500 hover:text-white text-lg"
              >
                Se connecter
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
          <FeatureCard
            icon="📖"
            title="Catalogue de recettes"
            description="Découvrez des milliers de recettes délicieuses"
          />
          <FeatureCard
            icon="❤️"
            title="Vos favoris"
            description="Sauvegardez vos recettes préférées"
          />
          <FeatureCard
            icon="📝"
            title="Planifier vos menus"
            description="Organisez vos repas pour la semaine"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
