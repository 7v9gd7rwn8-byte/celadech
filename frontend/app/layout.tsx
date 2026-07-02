import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Celadech - App Cuisine',
  description: 'Explorez, partagez et gérez vos recettes préférées',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
