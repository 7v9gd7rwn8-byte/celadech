'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function MenusPage() {
  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Planification des Menus</h1>
      
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-8 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-300">Cette fonctionnalité est en développement 🚀</p>
        <p className="text-gray-500 mt-2">Bientôt vous pourrez planifier vos menus hebdomadaires</p>
        <Link href="/recipes" className="inline-block mt-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
          Retour aux recettes
        </Link>
      </div>
    </div>
  );
}
